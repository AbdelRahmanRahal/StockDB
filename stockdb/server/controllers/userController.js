const User = require('../models/userModel');

const register = async (req, res) => {
  try {
    const { first_name, last_name, email, password_hash, user_type } = req.body;
    const newUser = await User.createUser({ first_name, last_name, email, password_hash, user_type });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await User.authenticate(email, password);
    res.json({ user, token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const { first_name, last_name, email } = req.body;
    const updatedUser = await User.updateUser(userId, { first_name, last_name, email });
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login, getUserProfile, updateUserProfile };