const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer TOKEN"

  if (token == null) {
    return res.sendStatus(401); // If there's no token, return 401 Unauthorized
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403); // If token is not valid, return 403 Forbidden
    }
    req.user = user; // Add user payload to request object
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = authenticateToken; 