const { formatError } = require('node-backend-utils/utils');

function errorHandler(error, _, res, __) {
  const { statusCode, message } = formatError(error).getJSON();

  res.status(statusCode).json({ message });
}

module.exports = { errorHandler };