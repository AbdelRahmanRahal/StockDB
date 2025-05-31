const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const devAuthRouter = express.Router();


// ─── REGISTER ───────────────────────────────────────────────────────────────
// Expects JSON body: { firstName, lastName, email, password, userType }
devAuthRouter.post('/dev-register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, userType } = req.body;

    // 1) Basic sanity check (you could expand this as needed)
    if (!firstName || !lastName || !email || !password || !userType) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // 2) Check if email already exists
    const checkSql = 'SELECT id FROM "user" WHERE email = $1';
    const checkRes = await pool.query(checkSql, [email.trim().toLowerCase()]);
    if (checkRes.rows.length > 0) {
      return res
        .status(409)
        .json({ error: 'A user with that email already exists.' });
    }

    // 3) Hash the password
    const hashed = await bcrypt.hash(password, 10);

    // 4) Insert a new user
    const insertSql = `
      INSERT INTO "user" (first_name, last_name, email, password_hash, user_type)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, first_name AS "firstName", last_name AS "lastName", email, user_type AS "userType";
    `;
    const insertValues = [
      firstName.trim(),
      lastName.trim(),
      email.trim().toLowerCase(),
      hashed,
      userType.trim(),
    ];
    const insertRes = await pool.query(insertSql, insertValues);

    // 5) Return the newly created user (without the password)
    const newUser = insertRes.rows[0];

    // Immediately sign a JWT so your frontend can store it and treat user as “logged in.”
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, userType: newUser.userType },
      process.env.JWT_SECRET || 'dev_jwt_secret',
      { expiresIn: '2h' }
    );

    return res
      .status(201)
      .json({ user: newUser, token, message: 'Dev registration successful.' });
  } catch (err) {
    console.error('[DEV REGISTER ERROR]', err);
    return res.status(500).json({ error: 'Internal server error (dev).' });
  }
});

// ─── LOGIN ──────────────────────────────────────────────────────────────────
// Expects JSON body: { email, password }
devAuthRouter.post('/dev-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // 1) Look up user by email
    const findSql = `
      SELECT id, first_name AS "firstName", last_name AS "lastName", email, password_hash, user_type AS "userType"
      FROM "user"
      WHERE email = $1
      LIMIT 1;
    `;
    const findRes = await pool.query(findSql, [email.trim().toLowerCase()]);
    if (findRes.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const userRow = findRes.rows[0];

    // 2) Compare the password
    const match = await bcrypt.compare(password, userRow.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // 3) Remove password_hash from the object before sending back
    delete userRow.password_hash;

    // 4) Optionally sign a JWT:
    const token = jwt.sign(
      { id: userRow.id, email: userRow.email, userType: userRow.userType },
      process.env.JWT_SECRET || 'dev_jwt_secret',
      { expiresIn: '2h' }
    );

    return res
      .status(200)
      .json({ user: userRow, token, message: 'Dev login successful.' });
  } catch (err) {
    console.error('[DEV LOGIN ERROR]', err);
    return res.status(500).json({ error: 'Internal server error (dev).' });
  }
});

module.exports = devAuthRouter;
