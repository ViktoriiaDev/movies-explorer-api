const jwt = require('jsonwebtoken');
const AuthorisationError = require('../errors/AuthorisationError');
const { authError } = require('../constants/error-messages');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next(new AuthorisationError(authError.authError));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (error) {
    return next(new AuthorisationError(authError.authError));
  }
  req.user = payload;
  next();
  return undefined;
};
