const { ErrorMessages, StatusCodes, APIError } = require("./constants");

function buildError(reason = APIError.INTERNAL_SERVER_ERROR, message = ErrorMessages.SOMETHING_WENT_WRONG, status = StatusCodes.INTERNAL_SERVER_ERROR, params = {}){
    const error = new Error(reason);
    error.message = message;
    error.statusCode = status;
    error.params = params;
    return error;
}

exports.buildError = buildError;