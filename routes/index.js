const router = require('express').Router();
const userRoute = require('./users');
const moviesRoute = require('./movies');
const { login, createUser } = require('../controllers/users');
const { loginValidation, createUserValidation } = require('../middlewares/validation');
const { auth } = require('../middlewares/auth');
// регистрация и логин
router.post('/signin', loginValidation, login);

router.post('/signup', createUserValidation, createUser);

// авторизация
router.use(auth);

router.use('/users', userRoute);
router.use('/movies', moviesRoute);

module.exports = router;
