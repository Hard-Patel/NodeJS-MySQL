const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const connection = require("../connection");
const CommonErrorHandler = require("../utils/errors");
const { APIError, ErrorMessages } = require("../utils/constants");

exports.loginUserController = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return CommonErrorHandler(
      res,
      APIError.BAD_REQUEST,
      ErrorMessages.VALIDATION_ERROR,
      undefined,
      { message: "Invalid request", errors: error.array() }
    );
  }
  const { email } = req.body;
  try {
    const findQuery = "SELECT * FROM users WHERE email = ?";
    connection.query(findQuery, [email], async (err, data) => {
      if (err || data.length == 0) {
        return CommonErrorHandler(
          res,
          APIError.BAD_REQUEST,
          ErrorMessages.USER_DOES_NOT_EXISTS
        );
      }
      const { name, email, isAdmin, password: dbPwd, id } = data[0];
      const isValid = await bcrypt.compare(req.body.password, dbPwd);
      if (!isValid) {
        return CommonErrorHandler(
          res,
          APIError.BAD_REQUEST,
          ErrorMessages.INVALID_USERNAME_PASSWORD
        );
      }
      const token = jwt.sign({ id }, "myPrivateKey");
      return res.send({
        data: {
          name,
          email,
          isAdmin,
          id,
          "x-auth-token": token,
        },
        message: "LoggedIn successfully",
      });
    });
  } catch (e) {
    return CommonErrorHandler(res);
  }
};
