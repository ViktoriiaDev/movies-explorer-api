require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
// const { celebrate, Joi } = require('celebrate');
const userRoute = require('./routes/users');
const moviesRoute = require('./routes/movies');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const { errorMiddleware } = require('./middlewares/error-middleware');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { loginValidation, createUserValidation } = require('./middlewares/validation');
const { rateLimiter } = require('./middlewares/rate-limiter');
const NotFoundError = require('./errors/NotFoundError');

const app = express();

mongoose.connect(
  'mongodb://localhost:27017/moviesdb',
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
app.use(requestLogger); // подключаем логгер запросов
app.use(cors());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// регистрация и логин
app.post('/signin', loginValidation, login);

app.post('/signup', createUserValidation, createUser);

// авторизация
app.use(auth);

app.use('/users', userRoute);
app.use('/movies', moviesRoute);

app.use(rateLimiter);

app.use('/', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // обработчик ошибок celebrate

// центральный обработчик ошибки
app.use(errorMiddleware);

app.listen(3000);
