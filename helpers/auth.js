const jwt = require("jsonwebtoken");

const SECRET_KEY = "your_secret_key";

// Generate JWT token
const generateToken = (username, userId) => {
  return jwt.sign({ username, id: userId }, SECRET_KEY, { expiresIn: "1h" });
};

// Verify JWT Token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
};

module.exports = {generateToken, verifyToken}