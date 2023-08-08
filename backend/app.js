require('dotenv').config();
// Подключение express к приложению
// Express обрабатывает веб-маршрутизацию и запросы
const express = require('express');
// Подключение объектно-документальной модели (Object-Document Mapping, ODM)
// для Node.js, которая облегчает взаимодействие с MongoDB.
// Mongoose предоставляет удобный интерфейс для работы с MongoDB,
// включая определение схем, валидацию и выполнение запросов= require('express');
const mongoose = require('mongoose');
// Это пакет, который предоставляет набор механизмов для
// улучшения безопасности вашего Express-приложения
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const limiter = require('./middlewares/rateLimiter');
const cors = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const routeSignup = require('./routes/signup');
const routeSignin = require('./routes/signin');

const auth = require('./middlewares/auth');

const routeUsers = require('./routes/users');
const routeCards = require('./routes/cards');

const NotFoundError = require('./errors/NotFoundError');
const errorHandler = require('./middlewares/errorHandler');

const URL = 'mongodb://127.0.0.1:27017/mestodb';
// Порт 3000 для работы бекенда
// Если в файле .env мы не присваиваем переменной PORT значение,
// то наш бекенд по умолчанию будет крутиться на 3000 порту

const { PORT = 3000 } = process.env;

mongoose.set('strictQuery', true);
// Подключение к базе данных
mongoose
  .connect(URL)
  .then(() => {
    console.log('БД подключена');
  })
  .catch(() => {
    console.log('Не удалось подключиться к БД');
  });

const app = express();

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);
app.use(cors);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(limiter);

app.use('/', routeSignup);
app.use('/', routeSignin);

app.use(auth);

app.use(errorLogger);

app.use('/users', routeUsers);
app.use('/cards', routeCards);

app.use((req, res, next) => next(new NotFoundError('Запрашиваемый ресурс не найден.')));
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
