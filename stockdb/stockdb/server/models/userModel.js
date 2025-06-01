const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createUser = async ({ first_name, last_name, email, password_hash, user_type }) => {
  const hashedPassword = await bcrypt.hash(password_hash, 10);
  const result = await db.query(
    'INSERT INTO "user" (first_name, last_name, email, password_hash, user_type) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [first_name, last_name, email, hashedPassword, user_type]
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
  
  // Generate JWT
  const token = jwt.sign(
    { userId: user.id, userType: user.user_type },
    process.env.JWT_SECRET,
    { expiresIn: '1h' } // Token expires in 1 hour
  );
  
  return { user, token }; // Return user object and token
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