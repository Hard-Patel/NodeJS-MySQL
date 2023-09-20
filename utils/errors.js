const { StatusCodes, ErrorMessages, APIError } = require("./constants");

function handleErrors(err, req, res, next) {
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || ErrorMessages.SOMETHING_WENT_WRONG;
  const responseBody = err.params || {};

  return res.status(statusCode).send({ message, ...responseBody });
}

function CommonErrorHandler(
  res,
  reason = APIError.INTERNAL_SERVER_ERROR,
  customMessage = "",
  status = 0,
  params = {}
) {
  if (reason == APIError.NOT_FOUND) {
    const statusCode = status || StatusCodes.NOT_FOUND;
    const message = customMessage || ErrorMessages.NOT_FOUND;
    return res.status(statusCode).send({ message, ...params });
  } else if (reason == APIError.UNAUTHORISED_ACCESS) {
    const statusCode = status || StatusCodes.UNAUTHORISED_ACCESS;
    const message = customMessage || ErrorMessages.UNAUTHORISED_ACCESS;
    return res.status(statusCode).send({ message, ...params });
  } else if (reason == APIError.BAD_REQUEST) {
    const statusCode = status || StatusCodes.BAD_REQUEST;
    const message = customMessage || ErrorMessages.BAD_REQUEST;
    return res.status(statusCode).send({ message, ...params });
  }
  const statusCode = status || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = customMessage || ErrorMessages.INTERNAL_SERVER_ERROR;
  return res.status(statusCode).send({ message, ...params });
}

module.exports = handleErrors;
module.exports = CommonErrorHandler;
