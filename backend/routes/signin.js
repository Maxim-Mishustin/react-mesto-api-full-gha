const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { login } = require('../controllers/users');

// Вход пользователя в приложение
router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(6),
    }),
  }),
  login,
);

module.exports = router;
