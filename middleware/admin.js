const { APIError, ErrorMessages } = require("../utils/constants");
const CommonErrorHandler = require("../utils/errors");

function admin(req, res, next) {
  const {isAdmin} = req.user;
  if (!isAdmin) {
    return CommonErrorHandler(res, APIError.UNAUTHORISED_ACCESS, ErrorMessages.PERMISSION_NOT_ALLOWED)
  }
  next();
}

exports.admin = admin;
