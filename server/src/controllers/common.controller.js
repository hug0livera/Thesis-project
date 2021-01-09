const sequelize = require("../database/database").sequelize;
const { generateJwt } = require("../helpers/generateJwt");
const { matchPassword } = require("../helpers/encrypt");
const SimpleCrypto = require("simple-crypto-js").default;

/**
 * User login
 *
 * @param email
 * @param password
 *
 */

const singIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    //to check a email
    const mail = await sequelize.query(
      "SELECT email, password FROM users WHERE email = ? AND user_deleted <> ?",
      {
        replacements: [email, true],
        type: sequelize.QueryTypes.SELECT,
      }
    );
    if (Object.keys(mail).length === 0) return res.status(401).json({ msg: "The mail not exists" });

    //to check a password
    const userPassword = await matchPassword(password, mail[0]["password"]);
    if (!userPassword) return res.status(401).json({ msg: "the password  is wrong" });

    const getUser = await sequelize.query(
      "SELECT name, email, administrator, observer FROM users WHERE email = ?",
      {
        replacements: [email],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    //generate the token
    const token = await generateJwt(
      getUser[0]["email"],
      getUser[0]["administrator"],
      getUser[0]["observer"]
    );
    return res.status(200).json({ ok: true, token, getUser });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something goes wrong",
      data: {},
    });
  }
};

/**
 * renew Token
 *
 *
 * @param email
 * @param password
 *
 */

const renewToken = async (req, res) => {
  try {
    const userId = req.userId;

    const role = await sequelize.query(
      "SELECT administrator, observer FROM users WHERE email = ?",
      {
        replacements: [userId],
        type: sequelize.QueryTypes.SELECT,
      }
    );
    if (Object.keys(role).length === 0) return res.status(401).json({ msg: "The mail not exists" });

    //renew the token
    const token = await generateJwt(userId, role[0].administrator, role[0].observer);

    res.json({
      userId: userId,
      token,
      role: role[0].administrator,
      observer: role[0].observer,
      ok: true,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something goes wrong",
      data: {},
    });
  }
};

const isAdmin = async (req, res) => {
  const email = req.body.mail;

  //is admin
  const admin = await sequelize.query("SELECT administrator FROM users WHERE email = ?", {
    replacements: [email],
    type: sequelize.QueryTypes.SELECT,
  });
  return res.status(200).json({ admin });
};

/**
 *
 *
 * @param {*} req
 * @param {*} res
 */
const lastAccess = async (req, res) => {
  try {
    const { id_user } = req.body;
    await sequelize.query(`UPDATE users SET  last_access = now()  WHERE id_user = '${id_user}'`, {
      type: sequelize.QueryTypes.UPDATE,
    });
    return res.json({ msg: "update" });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something goes wrong",
      data: {},
    });
  }
};

/**
 *
 *
 * @param {*} req
 * @param {*} res
 */
async function loginTelegram(id_telegram) {
  const loginTelegram = await sequelize.query(
    "SELECT id_user, name FROM users WHERE id_telegram  = ?",
    {
      replacements: [id_telegram],
      type: sequelize.QueryTypes.SELECT,
    }
  );
  if (Object.keys(loginTelegram).length === 0) return "";

  return loginTelegram[0].name;
}

/**
 *
 *
 * @param {*} req
 * @param {*} res
 */
async function daysTelegram(id_telegram) {
  const days = await sequelize.query("SELECT day_reminder FROM users WHERE id_telegram  = ?", {
    replacements: [id_telegram],
    type: sequelize.QueryTypes.SELECT,
  });

  return days[0].day_reminder;
}
/**
 *
 *
 * @param {*} req
 * @param {*} res
 */
async function isAdminTelegram(id_telegram) {
  const loginTelegram = await sequelize.query(
    "SELECT name, administrator FROM users WHERE id_telegram  = ? AND administrator = ?",
    {
      replacements: [id_telegram, true],
      type: sequelize.QueryTypes.SELECT,
    }
  );
  if (Object.keys(loginTelegram).length === 0) return "";

  return loginTelegram[0].name;
}

module.exports = {
  renewToken,
  singIn,
  isAdmin,
  lastAccess,
  loginTelegram,
  daysTelegram,
  isAdminTelegram,
};
