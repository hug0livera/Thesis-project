const jwt = require("jsonwebtoken");
const sequelize = require("../database/database").sequelize;

require("dotenv").config();

const verifyToken = function (req, res, next) {
  const token = req.header("x-token");
  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "The token does not exist",
    });
  }

  try {
    const { userId } = jwt.verify(token, process.env.SECRET_AUTH);
    req.userId = userId;
    next();
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "The token is not valid",
      data: {},
    });
  }
};

/**
 *
 */
const verifyAdminRole = async (req, res, next) => {
  const userId = req.userId;
  try {
    const mail = await sequelize.query("SELECT administrator FROM users WHERE email = ?", {
      replacements: [userId],
      type: sequelize.QueryTypes.SELECT,
    });
    if (Object.keys(mail).length === 0) return res.status(401).json({ msg: "The user not exists" });
    if (!mail[0].administrator) return res.status(403).json({ msg: "You are not an admin" });
    next();
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Tou are not an admin",
      data: {},
    });
  }
};

module.exports = {
  verifyToken,
  verifyAdminRole,
};
