const ERROR_MESSAGES = {};
ERROR_MESSAGES.NOT_FOUND = "Not found";
ERROR_MESSAGES.SOMETHING_WENT_WRONG = "Something went wrong";

const StatusCodes = {};
StatusCodes.NOT_FOUND = 404;
StatusCodes.BAD_REQUEST = 400;
StatusCodes.INTERNAL_SERVER_ERROR = 500;

const APIError = {};
APIError.NOT_FOUND = "Resource Not Found";
APIError.BAD_REQUEST = "Bad request";
APIError.INTERNAL_SERVER_ERROR = "Internal Server Error";

exports.ErrorMessages = ERROR_MESSAGES;
exports.StatusCodes = StatusCodes;
exports.APIError = APIError;
