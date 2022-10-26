require('dotenv').config();

const { MONGO_URL = 'mongodb://localhost:27017/moviesdb' } = process.env;
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const router = require('./routes');

const { errorMiddleware } = require('./middlewares/error-middleware');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { rateLimiter } = require('./middlewares/rate-limiter');
const NotFoundError = require('./errors/NotFoundError');

const app = express();

mongoose.connect(
  MONGO_URL,
  {
    useNewUrlParser: true,
    autoIndex: true,
    autoCreate: true,
  },
  (error) => {
    if (!error) {
      console.log('mongoose connected');
    }
  },
);

app.use(bodyParser.json());
app.use(requestLogger); // логгер запросов
app.use(helmet()); // установка заголовков

app.use(router);

app.use(rateLimiter);

app.use('/', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // обработчик ошибок celebrate

// центральный обработчик ошибок
app.use(errorMiddleware);

app.listen(3000);
