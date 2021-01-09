const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 *
 * The user mail is used to generate the token
 *
 * @param userId
 */
const generateJwt = (userId, a, o) => {
  return new Promise((resolve, reject) => {
    const payload = {
      userId,
      a,
      o,
    };

    jwt.sign(
      payload,
      process.env.SECRET_AUTH,
      {
        expiresIn: "6h",
      },
      (err, token) => {
        if (err) {
          console.log("errore", err);
          reject("The token could not be generated");
        } else {
          resolve(token);
        }
      }
    );
  });
};

module.exports = {
  generateJwt,
};
