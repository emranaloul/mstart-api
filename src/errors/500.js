const { parsePrismaValidationError } = require('../utilities/utils');

module.exports = function (err, req, res, next) {
  let error = 'Internal Server Error';
  if (typeof err === 'string') {
    error = err;
  }
  if (err instanceof Error) {
    error = err.message;
  }
  let status = err.statusCode || 500;
  const parsedError = parsePrismaValidationError(err);
  if (parsedError) {
    status = 400;

    if (parsedError.missingArgument) {
      error = `🚨 Missing argument: ${parsedError.missingArgument}`;
    }
    if (parsedError.invalidArgument) {
      error = `⚠️ Invalid argument: ${parsedError.invalidArgument}`;
    }
  }
  const errorObject = {
    status,
    message: error,
  };
  res.status(status).json(errorObject);
};
