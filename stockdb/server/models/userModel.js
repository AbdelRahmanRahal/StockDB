const db = require('../config/db');
const bcrypt = require('bcrypt');

const createUser = async ({ first_name, last_name, email, password_hash }) => {
  const hashedPassword = await bcrypt.hash(password_hash, 10);
  const result = await db.query(
    'INSERT INTO "user" (first_name, last_name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING *',
    [first_name, last_name, email, hashedPassword]
  );
  return result.rows[0];
};

const authenticate = async (email, password) => {
  const result = await db.query('SELECT * FROM "user" WHERE email = $1', [email]);
  const user = result.rows[0];
  
  if (!user) {
    throw new Error('User not found');
  }
  
  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    throw new Error('Invalid password');
  }
  
  return user;
};

const getUserById = async (userId) => {
  const result = await db.query('SELECT id, first_name, last_name, email FROM "user" WHERE id = $1', [userId]);
  return result.rows[0];
};

const updateUser = async (userId, { first_name, last_name, email }) => {
  const result = await db.query(
    'UPDATE "user" SET first_name = $1, last_name = $2, email = $3 WHERE id = $4 RETURNING id, first_name, last_name, email',
    [first_name, last_name, email, userId]
  );
  return result.rows[0];
};

module.exports = { createUser, authenticate, getUserById, updateUser };