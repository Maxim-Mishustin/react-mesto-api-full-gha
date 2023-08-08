const Card = require('../models/card');
const { CREATED_CODE } = require('../utils/constants');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');

// Все карточки
function getInitialCards(_, res, next) {
  Card.find({})

    .then((cards) => res.send({ data: cards }))
    .catch(next);
}

// Создание карточки
function addNewCard(req, res, next) {
  const { name, link } = req.body;
  const { userId } = req.user;

  Card.create({ name, link, owner: userId })
    .then((card) => res.status(CREATED_CODE).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные при создании карточки.',
          ),
        );
      } else {
        next(err);
      }
    });
}

// Удаление карточки
function removeCard(req, res, next) {
  const { id: cardId } = req.params;
  const { userId } = req.user;

  Card.findById({
    _id: cardId,
  })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка c указанным id не найдена');
      }

      const { owner: cardOwnerId } = card;

      if (cardOwnerId.valueOf() !== userId) {
        throw new ForbiddenError('Нет прав доступа');
      }

      return Card.findByIdAndDelete(cardId);
    })
    .then((deletedCard) => {
      if (!deletedCard) {
        throw new NotFoundError('Данная карточка была удалена');
      }

      res.send({ data: deletedCard });
    })
    .catch(next);
}

// Лайк на карточку
function addLike(req, res, next) {
  const { cardId } = req.params;
  const { userId } = req.user;

  Card.findByIdAndUpdate(
    cardId,
    {
      $addToSet: {
        likes: userId,
      },
    },
    {
      new: true,
    },
  )
    .then((card) => {
      if (card) return res.send({ data: card });

      throw new NotFoundError('Карточка с указанным id не найдена');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные для постановки лайка.',
          ),
        );
      } else {
        next(err);
      }
    });
}

// Удаление лайка с карточки
function removeLike(req, res, next) {
  const { cardId } = req.params;
  const { userId } = req.user;

  Card.findByIdAndUpdate(
    cardId,
    {
      $pull: {
        likes: userId,
      },
    },
    {
      new: true,
    },
  )
    .then((card) => {
      if (card) return res.send({ data: card });

      throw new NotFoundError('Карточка c указанным id не найдена');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные для удаления лайка.',
          ),
        );
      } else {
        next(err);
      }
    });
}

module.exports = {
  getInitialCards,
  addNewCard,
  addLike,
  removeLike,
  removeCard,
};
