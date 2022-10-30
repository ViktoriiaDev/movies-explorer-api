const mongoose = require('mongoose');
const urlRegexp = require('../constants/patterns');
const { modelMovieError } = require('../constants/error-messages');

const movieSchema = new mongoose.Schema({
  // страна создания фильма
  country: {
    type: String,
    required: true,
  },
  // режиссёр фильма
  director: {
    type: String,
    required: true,
  },
  // длительность фильма
  duration: {
    type: Number,
    required: true,
  },
  // год выпуска фильма
  year: {
    type: String,
    required: true,
  },
  // описание фильм
  description: {
    type: String,
    required: true,
  },
  // ссылка на постер к фильму
  image: {
    type: String,
    validate: {
      validator(value) {
        return urlRegexp.test(value);
      },
      message: modelMovieError.incorrectUrl,
    },
  },
  // ссылка на трейлер фильма
  trailerLink: {
    type: String,
    validate: {
      validator(value) {
        return urlRegexp.test(value);
      },
      message: modelMovieError.incorrectUrl,
    },
  },
  // миниатюрное изображение постера к фильму
  thumbnail: {
    type: String,
    validate: {
      validator(value) {
        return urlRegexp.test(value);
      },
      message: modelMovieError.incorrectUrl,
    },
  },
  // _id пользователя, который сохранил фильм
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  // id фильма, который содержится в ответе сервиса MoviesExplorer
  movieId: {
    type: Number,
    required: true,
  },
  // название фильма на русском языке
  nameRU: {
    type: String,
    required: true,
  },
  // название фильма на английском языке
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
