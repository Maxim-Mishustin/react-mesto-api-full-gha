const jwt = require('jsonwebtoken');

const { authKey } = require('../utils/constants');
const AuthenticationError = require('../errors/AuthenticationError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const bearer = 'Bearer ';
  if (!authorization || !authorization.startsWith(bearer)) {
    return next(new AuthenticationError('Неправильные почта или пароль'));
  }
  const token = authorization.replace(bearer, '');
  let payload;
  try {
    payload = jwt.verify(token, authKey);
  } catch (err) {
    return next(new AuthenticationError('Неправильные почта или пароль'));
  }
  req.user = payload;
  return next();
};
