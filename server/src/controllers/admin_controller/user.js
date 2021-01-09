const sequelize = require("../../database/database").sequelize;
const nodemailer = require("nodemailer");
const generator = require("generate-password");
const { encryptPassword } = require("../../helpers/encrypt");
const config = require("config");
const transportConfig = config.get("transportConfig");

/**
 *
 * user creation
 * invitation to use the platform
 * creation of the password for the telegram bot
 *
 * @param name      user's name
 * @param email     user's email
 * @param password  user's password
 * @param gender    user gender
 * @param observer  can see administrator statistics
 * @param invitation (invitation message) Invitation to use the platform
 * @param message   (invitation message) Your credentials to access the platform are
 *
 */
const createUser = async (req, res) => {
  try {
    const { name, email, password, gender, observer, invitation, message } = req.body;

    const userVerification = await sequelize.query("SELECT email FROM users WHERE email = ? ", {
      replacements: [email],
      type: sequelize.QueryTypes.SELECT,
    });
    if (Object.keys(userVerification).length !== 0)
      return res.status(401).json("The user already exists");

    const user = await sequelize.query(
      "INSERT INTO Users (name, email, password, gender, observer ) VALUES (?,?,?,?,?)",
      {
        replacements: [name, email, password, gender, observer],
        type: sequelize.QueryTypes.INSERT,
      }
    );

    //password encryption
    const bcryptPassword = await encryptPassword(password);
    const passwordEncryption = await sequelize.query(
      `UPDATE users set password = '${bcryptPassword}'
        WHERE email = '${email}'`,
      { type: sequelize.QueryTypes.UPDATE }
    );

    //Create password for telegram
    let bool = true;
    let i = 0;
    let passwordGenerateTelegram;
    while (bool) {
      i++;
      let value = Math.floor(100000 + Math.random() * 900000);
      var passwordTelegram = value.toString();

      const password = await sequelize.query(
        "SELECT id_telegram FROM users where id_telegram = ? ",
        {
          replacements: [passwordTelegram],
          type: sequelize.QueryTypes.SELECT,
        }
      );
      if (Object.keys(password).length === 0) {
        passwordGenerateTelegram = await sequelize.query(
          `UPDATE Users set id_telegram = '${passwordTelegram}'
            WHERE email = '${email}'`,
          { type: sequelize.QueryTypes.UPDATE }
        );
        bool = false;
      }
      if (i === 999999) return res.json("The are no more random numbers");
    }

    //invite user
    contentHTML = `
    <p> ${message} </p>
    <ul>
      <li><b>E-mail:</b> ${email} </li>
      <li><b>Password:</b>  ${password} </li>
    </ul>`;

    let transporter = nodemailer.createTransport(transportConfig);

    const info = await transporter.sendMail({
      from: process.env.MAIL,
      to: email,
      subject: invitation,
      html: contentHTML,
    });

    if (user && info && passwordEncryption && passwordGenerateTelegram) {
      return res.json("User created successfully");
    }
  } catch (e) {
    console.log(e);
    res.status(500).json("The user was not created successfully and the email was not sent");
  }
};

/**
 *
 * generate a random password
 * sends the new password to the user via email
 *
 *  @param email      user's email
 *  @param invitation (invitation message)  Invitation to use the platform
 *  @param message    (invitation message)  Your credentials to access the platform are:
 *
 */
const generateNewPassword = async (req, res) => {
  try {
    const { email, invitation, message } = req.body;

    const password = generator.generate({
      length: 8,
      numbers: true,
    });

    //encryption of the new password
    let passwordEncryption;
    const bcryptPassword = await encryptPassword(password);
    passwordEncryption = await sequelize.query(
      `UPDATE users set password = '${bcryptPassword}'
        WHERE email = '${email}'`,
      { type: sequelize.QueryTypes.UPDATE }
    );

    //invite user
    contentHTML = `
   <p> ${message} </p>
   <ul>
     <li><b>Email:</b> ${email} </li>
     <li><b>Password:</b>  ${password} </li>
   </ul>`;

    let transporter = nodemailer.createTransport(transportConfig);

    const info = await transporter.sendMail({
      from: process.env.MAIL,
      to: email,
      subject: invitation,
      html: contentHTML,
    });

    if (info && passwordEncryption) {
      return res.json("Password changed successfully");
    }
  } catch (e) {
    console.log(e);
    res.status(500).json("Something goes wrong");
  }
};

/**
 *
 * generate a random password
 *
 */
const generatePassword = async (req, res) => {
  try {
    const password = generator.generate({
      length: 8,
      numbers: true,
    });

    res.json(password);
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
 * Get the list of all users
 *
 */
const getUsers = async (req, res) => {
  try {
    const user = await sequelize.query(
      "SELECT id_user, email, name, gender, administrator, observer, invited_user from users WHERE user_deleted <> ? ORDER BY id_user",
      {
        replacements: [true],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.send(user);
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
 * Get the list of all users
 *
 * @param id user key
 *
 */
const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await sequelize.query(
      "SELECT id_user, email, name, gender, observer, administrator from users WHERE id_user = ?  ",
      {
        replacements: [id],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    return res.status(200).json(user);
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
 * List of users not assigned to a task
 *
 * @param id task key
 *
 */
const usersNotAssignedTask = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await sequelize.query(
      "SELECT id_user, email, name, gender " +
        " FROM  users " +
        "WHERE user_deleted = ? AND id_user not in " +
        "(SELECT id_user " +
        " FROM users_task " +
        "WHERE id_task = ? ) ",
      {
        replacements: [false, id],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.send(user);
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
 * Name of the user to whom the task has been assigned
 *
 * @param id user key
 *
 */
const nameUserTaskAssigned = async (req, res) => {
  try {
    const { id } = req.params;
    const userStatistics = await sequelize.query("SELECT name FROM users WHERE id_user =?", {
      replacements: [id],
      type: sequelize.QueryTypes.SELECT,
    });
    if (userStatistics) return res.status(200).json(userStatistics);
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
 *  First table of user statistics
 *  User list with its statistics
 *
 */
const getUsersStatistics = async (req, res) => {
  try {
    const userStatistics = await sequelize.query(
      " SELECT U.id_user, U.name, U.email, TT.totalTaskAssign, AN.day  " +
        "FROM users U " +
        "LEFT JOIN " +
        "(SELECT UT.id_user, COUNT (UT.id_task) AS totalTaskAssign " +
        "FROM task T " +
        " JOIN users_task UT ON (T.id_task = UT.id_task) " +
        " GROUP BY UT.id_user) TT ON (TT.id_user = U.id_user) " +
        " LEFT JOIN " +
        " (SELECT A.id_user, MIN (now()::date  - A.date_annotation ::date) AS day " +
        " FROM annotation A " +
        " GROUP BY A.id_user) AN ON (AN.id_user = U.id_user) " +
        " GROUP BY U.id_user, U.name, U.email, AN.day, TT.totalTaskAssign ORDER BY  U.name",
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );
    if (userStatistics) return res.status(200).json(userStatistics);
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
 * Second table of user statistics
 * List of tasks assigned to users
 *
 * @param id user key
 *
 */
const userStatistics = async (req, res) => {
  try {
    const { id } = req.params;
    const userStatistics = await sequelize.query(
      "SELECT  t.task_name, ut.id_task, post_annotated_in_total, COUNT (p.id_post) AS post_in_total , day  " +
        "FROM users_task ut " +
        "LEFT JOIN " +
        "( SELECT p.id_task,  MAX (a.index_annotation)AS post_annotated_in_total,  MIN (now()::date  - a.date_annotation ::date) AS day " +
        "FROM users u " +
        "LEFT JOIN annotation a ON (a.id_user = u.id_user) " +
        "LEFT JOIN post p ON (p.id_post = a.id_post) " +
        "WHERE a.id_user = ? " +
        "  GROUP BY p.id_task " +
        ") as tt on (ut.id_task = tt.id_task)" +
        " LEFT JOIN task t ON (t.id_task = ut.id_task) " +
        "LEFT JOIN post p ON (p.id_task = t.id_task) " +
        "WHERE ut.id_user = ? " +
        "GROUP BY t.task_name, ut.id_task, post_annotated_in_total, day ORDER BY t.task_name ",
      {
        replacements: [id, id],
        type: sequelize.QueryTypes.SELECT,
      }
    );
    if (userStatistics) return res.status(200).json(userStatistics);
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
 *  Change the user's role
 *
 *  @param id user key
 *
 */
const assignObserverRole = async (req, res) => {
  try {
    const { id } = req.params;
    const roleUser = await sequelize.query(" SELECT observer FROM users WHERE id_user = ?", {
      replacements: [id],
      type: sequelize.QueryTypes.SELECT,
    });

    const role = roleUser[0].observer;
    if (role) {
      await sequelize.query(
        `UPDATE users set observer = '${false}'
         WHERE id_user = '${id}'`,
        { type: sequelize.QueryTypes.UPDATE }
      );
      return res.status(200).json("Role successfully updated");
    } else if (!role) {
      await sequelize.query(
        `UPDATE users set observer = '${true}'
         WHERE id_user = '${id}'`,
        { type: sequelize.QueryTypes.UPDATE }
      );
      return res.status(200).json("Role successfully updated");
    }
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
 * Get the telegram code to login
 *
 * @param email     user's email
 *
 */
const codeTelegram = async (req, res) => {
  try {
    const { mail } = req.params;
    const user = await sequelize.query(
      "SELECT id_telegram, day_reminder  from users WHERE email = ?",
      {
        replacements: [mail],
        type: sequelize.QueryTypes.SELECT,
      }
    );
    res.json(user[0]);
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
 * Number of days to be notified by the telegram bot
 *
 * @param email     user's email
 * @param day       Number of days to be notified by the telegram bot
 *
 */
const remindDay = async (req, res) => {
  try {
    const { mail, day } = req.params;

    await sequelize.query(
      `UPDATE users set day_reminder = '${day}'
       WHERE email = '${mail}'`,
      { type: sequelize.QueryTypes.UPDATE }
    );
    return res.status(200).json("day successfully updated");
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
 *  deleting a user's data
 *
 *  @param id user key
 *
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await sequelize.query(
      `UPDATE users set id_telegram = ${null},
      name = '',
      email = '',
      password = '',
      date_registration = ${null},
      last_access = ${null},
      administrator = ${false},
      gender = '',
      day_reminder = '${0}',
      observer = ${false},
      user_deleted = ${true}
      WHERE id_user = '${id}'`,
      { type: sequelize.QueryTypes.UPDATE }
    );
    return res.json("user successfully deleted");
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
 *  user edit
 *
 *  @param id user key
 *  @param name user's email
 *  @param emailuser's email
 *  @param gender user gender
 *  @param observer can see administrator statistics
 *
 */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, gender, observer } = req.body;

    await sequelize.query(
      `UPDATE users set name = '${name}',
      email = '${email}',
      gender = '${gender}',
      observer = ${observer}
      WHERE id_user = '${id}'`,
      { type: sequelize.QueryTypes.UPDATE }
    );
    return res.json("user update  successfully");
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something goes wrong",
      data: {},
    });
  }
};

module.exports = {
  generatePassword,
  createUser,
  getUsers,
  userStatistics,
  nameUserTaskAssigned,
  getUsersStatistics,
  usersNotAssignedTask,
  assignObserverRole,
  codeTelegram,
  remindDay,
  deleteUser,
  updateUser,
  getUser,
  generateNewPassword,
};
