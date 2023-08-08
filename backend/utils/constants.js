// Cтатусы ответа сервера
const CREATED_CODE = 201;
const SERVER_ERROR = 500;

const { config } = require('dotenv');

const { NODE_ENV } = process.env;

if (NODE_ENV === 'production') {
  config();
}

const { authKey = 'dev-secret' } = process.env;

// Регулярное выражение
const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

module.exports = {
  CREATED_CODE,
  SERVER_ERROR,
  authKey,
  urlRegex,
  NODE_ENV,

};
