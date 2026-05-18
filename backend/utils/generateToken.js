// utils/generateToken.js - JWT Token Generation Helper

const jwt = require("jsonwebtoken");

/**
 * Generate a signed JWT token for a given user ID
 * @param {string} id - MongoDB user _id
 * @returns {string} - Signed JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d", // Token valid for 7 days
  });
};

module.exports = generateToken;
