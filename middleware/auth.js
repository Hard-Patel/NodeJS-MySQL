const jwt = require("jsonwebtoken");
const connection = require("../connection");
const { APIError, ErrorMessages } = require("../utils/constants");
const CommonErrorHandler = require("../utils/errors");

function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) {
    return CommonErrorHandler(
      res,
      APIError.UNAUTHORISED_ACCESS,
      ErrorMessages.NO_TOKEN_PROVIDED
    );
  }
  try {
    const decoded = jwt.verify(token, "myPrivateKey");
    const findQuery = "SELECT * FROM users WHERE id = ?";
    connection.query(findQuery, [decoded.id], (err, data) => {
      if (err || !data.length) {
        return CommonErrorHandler(
          res,
          APIError.UNAUTHORISED_ACCESS,
          ErrorMessages.INVALID_TOKEN
        );
      }
      req.user = data[0];
      next();
    });
  } catch (e) {
    return CommonErrorHandler(res);
  }
}

exports.auth = auth;
