const { APIError, ErrorMessages } = require("../utils/constants");
const CommonErrorHandler = require("../utils/errors");

function admin(req, res, next) {
  try {
    const { isAdmin } = req.user;
    if (!isAdmin) {
      return CommonErrorHandler(
        res,
        APIError.UNAUTHORISED_ACCESS,
        ErrorMessages.PERMISSION_NOT_ALLOWED
      );
    }
    next();
  } catch (e) {
    return CommonErrorHandler(res);
  }
}

exports.admin = admin;
