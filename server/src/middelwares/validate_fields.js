const { response } = require("express");
const { validationResult } = require("express-validator");

/**
 *  Validate the fields
 *  Show if it finds any errors
 *
 */
const validateFields = (req, res = response, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(400).json({
      ok: false,
      errors: error.mapped(),
    });
  }

  next();
};

module.exports = {
  validateFields,
};
