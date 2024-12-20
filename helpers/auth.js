const jwt = require("jsonwebtoken");

const SECRET_KEY = "-sdffsdjawd465cVJHFHBNGG^%^&:'>?*-e67187efc6bb";

// Generate JWT token
const generateToken = (username, userId) => {
  return jwt.sign({ username, id: userId }, SECRET_KEY, { expiresIn: "2d" });
};

// Verify JWT Token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
};

module.exports = { generateToken, verifyToken };
