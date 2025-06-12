const { ForbiddenError, UnauthorizedError } = require('node-backend-utils/classes');
const { isValidString } = require('node-backend-utils/validators');
const { verifyJWT } = require('node-backend-utils/auth');
const { getEnvConfig } = require('../config/dotenv');

function authHandler(req, _, next) {
  const token = req.cookies.authToken;

  if (!isValidString(token)) {
    throw new UnauthorizedError('Usuário não autenticado');
  }

  const envConfig = getEnvConfig();

  verifyJWT(token, envConfig.jwt.secretKey)
    .then((decoded) => {
      req.user = decoded;

      next();
    });
}

function adminHandler(req, _, next) {
  if (!req.user.adm) {
    throw new ForbiddenError('Você não possui permissão para realizar esta ação');
  }

  next();
}


module.exports = { authHandler, adminHandler };