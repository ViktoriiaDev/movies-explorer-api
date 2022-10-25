const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getMovies = (req, res, next) => {
  const { _id } = req.user;
  Movie.find({
    owner: _id,
  })
    .then((movies) => res.send({ data: movies }))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const { _id } = req.user;
  Movie.create({
    ...req.body,
    owner: _id,
  })
    .then((movie) => res.send({ data: movie }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return next(new ValidationError('Переданы некорректные данные при создании фильма'));
      }
      return next(error);
    });
};

module.exports.checkMovieOwner = (req, res, next) => {
  const { id } = req.params;
  Movie.findById({ _id: id })
    .then((movie) => {
      if (movie && movie.owner.toString() !== req.user._id) {
        return next(new ForbiddenError('Невозможно удалить чужой фильм'));
      }
      next();
      return undefined;
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { id } = req.params;
  Movie.findOneAndRemove({ _id: id })
    .orFail(() => {
      throw new NotFoundError('Фильм с указанным _id не найден');
    })
    .then((movie) => res.send({ data: movie }))
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new ValidationError('Невалидный _id фильма'));
      }
      return next(error);
    });
};
