const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { modelUserError } = require('../constants/error-messages');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  // имя пользователя
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
});

// поиск пользователя по его почте
// если почта найдена, сверяем пароли
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error(modelUserError.incorrectData));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error(modelUserError.incorrectData));
          }

          return user; // теперь user доступен
        });
    });
};

module.exports = mongoose.model('user', userSchema);
