const Sequelize = require("sequelize");
require("dotenv").config({ path: __dirname + "/../../.env" });

const sequelize = new Sequelize(
  process.env.DB_NOME /* nome db */,
  process.env.DB_UTENTE /* utente */,
  process.env.DB_PASSWORD /*password */,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    define: {
      timestamps: false,
    },
  }
);

/* const config = require("config");
const dbConfig = config.get("dbConfig");
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.user,
  dbConfig.password,
  dbConfig.sequelize
); */

sequelize.authenticate().then(function (err) {
  if (err) console.log("Unable to connect to the PostgreSQL database:", err);
  console.log("Connection has been established successfully.");
});

module.exports.sequelize = sequelize;
