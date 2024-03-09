const bcrypt = require("bcrypt");
const crypto = require("crypto");

const hashPassword = async (password) => {
  try {
    const saltRounds = 12;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    throw error;
  }
};

const comparePassword = async (password, hashed) => {
  try {
    const match = await bcrypt.compare(password, hashed);
    return match;
  } catch (error) {
    throw error;
  }
};

module.exports = { hashPassword, comparePassword };
