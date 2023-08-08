const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { urlRegex } = require('../utils/constants');
const {
  getInitialCards,
  addNewCard,
  addLike,
  removeLike,
  removeCard,
} = require('../controllers/cards');

// Все карточки
router.get('/', getInitialCards);

// Создание новой карточки
router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().pattern(urlRegex),
    }),
  }),
  addNewCard,
);

// Удаление карточки
router.delete(
  '/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().length(24).hex().required(),
    }),
  }),
  removeCard,
);

// Лайк на карточки
router.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
  }),
  addLike,
);

// Удаление лайка с карточки
router.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
  }),
  removeLike,
);

module.exports = router;
