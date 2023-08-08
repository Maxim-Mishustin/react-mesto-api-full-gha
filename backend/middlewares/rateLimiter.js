const rateLimiter = require('express-rate-limit');
// Ограничитель запросов rateLimiter
const limiter = rateLimiter({
  // Максимальное количество запросов за указанный период
  max: 120,
  windowMS: 50000,
  message: 'Превышено количество запросов на сервер. Попробуйте повторить немного позже',
});

module.exports = limiter;
