const router = require('express').Router();
const userRoute = require('./users');
const moviesRoute = require('./movies');
const { login, createUser } = require('../controllers/users');
const { loginValidation, createUserValidation } = require('../middlewares/validation');
const { auth } = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');
const { notFoundPage } = require('../constants/error-messages');

// регистрация и логин
router.post('/signin', loginValidation, login);

router.post('/signup', createUserValidation, createUser);

// авторизация
router.use(auth);

router.use('/users', userRoute);
router.use('/movies', moviesRoute);

router.use('/', (req, res, next) => {
  next(new NotFoundError(notFoundPage.notFoundPage));
});

module.exports = router;
