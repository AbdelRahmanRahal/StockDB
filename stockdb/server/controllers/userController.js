const User = require('../models/userModel');

const register = async (req, res) => {
  try {
    const { first_name, last_name, email, password_hash } = req.body;
    const newUser = await User.createUser({ first_name, last_name, email, password_hash });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.authenticate(email, password);
    res.json(user);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = { register, login };