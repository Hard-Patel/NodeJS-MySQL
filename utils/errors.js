const { StatusCodes, ErrorMessages } = require("./constants");

function handleErrors(err, req, res, next) {
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || ErrorMessages.SOMETHING_WENT_WRONG;
  const responseBody = err.params || {};

  return res.status(statusCode).send({ message, ...responseBody });
}

module.exports = handleErrors;
