const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const ConflictError = require('../errors/ConflictError');
const { userError } = require('../constants/error-messages');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError(userError.notFoundUserId);
    })
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new ValidationError(userError.incorrectDataForGetUser));
      }
      return next(error);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        return next(new ConflictError(userError.emailConflictError));
      }
      return undefined;
    })
    .then(() => bcrypt.hash(password, 10))
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then(() => User.findOne({ email }))
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return next(new ValidationError(userError.incorrectDataForCreateUser));
      }
      return next(error);
    });
};

module.exports.patchUser = (req, res, next) => {
  const { email, name } = req.body;
  const { _id } = req.user;
  User.findOneAndUpdate(
    { _id },
    { name, email },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new NotFoundError(userError.notFoundUserId);
    })
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new ValidationError(userError.incorrectDataForUpdateUser));
      } else if (error.code === 11000) {
        return next(new ConflictError(userError.emailConflictError));
      }
      return next(error);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', {
        expiresIn: '7d',
      });
      res.send({
        data: {
          token,
        },
      });
    })
    .catch(next);
};
