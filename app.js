require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const MONGO_URL = require('./constants/config');
const router = require('./routes');

const { errorMiddleware } = require('./middlewares/error-middleware');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { rateLimiter } = require('./middlewares/rate-limiter');

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

app.use(rateLimiter); //  подключение лимитера
app.use(bodyParser.json());
app.use(requestLogger); // логгер запросов
app.use(helmet()); // установка заголовков

app.use(router); //  подключение роутеров

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // обработчик ошибок celebrate

// центральный обработчик ошибок
app.use(errorMiddleware);

app.listen(3000);
