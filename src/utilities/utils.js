const getSkipAndTakeByPage = (page) => {
  const take = 10;
  const skip = (page - 1) * take;
  return { skip, take };
};

const {
  PrismaClientValidationError,
} = require('@prisma/client/runtime/library');

/**
 * Parses a PrismaClientValidationError and extracts useful info.
 * @param {Error} error - The error thrown by Prisma.
 * @returns {Object|null} - Returns parsed info or null if not a Prisma validation error.
 */
function parsePrismaValidationError(error) {
  if (!(error instanceof PrismaClientValidationError)) {
    return null;
  }

  const message = error.message;
  // Regex to catch missing argument (e.g., "Argument `name` is missing.")
  const missingArgMatch = message.match(/Argument `(.*?)` is missing/);

  // Regex to catch invalid value (e.g., "Invalid value for argument `email`.")
  const invalidArgMatch = message.match(/Invalid value for argument `(.*?)`/);

  return {
    type: 'PrismaClientValidationError',
    rawMessage: message,
    missingArgument: missingArgMatch ? missingArgMatch[1] : null,
    invalidArgument: invalidArgMatch ? invalidArgMatch[1] : null,
  };
}

module.exports = {
  getSkipAndTakeByPage,
  parsePrismaValidationError,
};
