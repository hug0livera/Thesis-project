const bcrypt = require("bcryptjs");

/**
 * encrypt the password
 *
 *  @param password
 *
 */

encryptPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (e) {
    console.log(e);
  }
};

/**
 * to check a password
 *
 * @param password
 * @param savePassword
 *
 */

matchPassword = async (password, savePassword) => {
  try {
    const match = await bcrypt.compare(password, savePassword);
    return match;
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  matchPassword,
  encryptPassword,
};
