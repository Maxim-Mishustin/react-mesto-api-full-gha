require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { CREATED_CODE } = require('../utils/constants');
const { NODE_ENV, authKey } = require('../utils/constants');

const NotFoundError = require('../errors/NotFoundError');
const DataConflictError = require('../errors/DataConflictError');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');

// Регистрация пользователя
function registrationUser(req, res, next) {
  const {
    email, password, name, about, avatar,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => {
      const { _id } = user;

      return res.status(CREATED_CODE).send({
        email,
        name,
        about,
        avatar,
        _id,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(
          new DataConflictError(
            'Пользователь с данным электронным адресом уже зарегистрирован',
          ),
        );
      } else if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            'Передача некорректных данных при регистрации пользователя',
          ),
        );
      } else {
        next(err);
      }
    });
}

// Логин пользователя
function login(req, res, next) {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then(({ _id: userId }) => {
      const token = jwt.sign(
        { userId },
        NODE_ENV === 'production' ? authKey : 'dev-secret',
        {
          expiresIn: '7d',
        },
      );
      return res.send({ token });
    })
    .catch(next);
}

// Получение всех пользователей
function getUsersInfo(_, res, next) {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(next);
}

// Поиск пользователя ID
function getUserId(req, res, next) {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if (user) return res.send(user);
      throw new NotFoundError('Пользователь c указанным ID не найден');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передача некорректного ID'));
      } else {
        next(err);
      }
    });
}

// Пользователь
function getUserInfo(req, res, next) {
  const { userId } = req.user;
  User.findById(userId)
    .then((user) => {
      if (user) return res.send(user);
      throw new NotFoundError('Пользователь с указанным ID не найден');
    })
    .catch((err) => {
      next(err);
    });
}

// Редактирование данных пользователя
function editProfileUserInfo(req, res, next) {
  const { name, about } = req.body;
  const { userId } = req.user;

  User.findByIdAndUpdate(
    userId,
    {
      name,
      about,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user) return res.send(user);

      throw new NotFoundError('Пользователь c указанным ID не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            'Передача некорректных данных при попытке обновления профиля',
          ),
        );
      } else {
        next(err);
      }
    });
}

// Редактирование аватара пользователя
function updateProfileUserAvatar(req, res, next) {
  const { avatar } = req.body;
  const { userId } = req.user;

  User.findByIdAndUpdate(
    userId,
    {
      avatar,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user) return res.send(user);

      throw new NotFoundError('Пользователь c указанным ID не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            'Передача некорректных данных при попытке обновления аватара',
          ),
        );
      } else {
        next(err);
      }
    });
}

module.exports = {
  registrationUser,
  login,
  getUsersInfo,
  getUserId,
  getUserInfo,
  editProfileUserInfo,
  updateProfileUserAvatar,
};
