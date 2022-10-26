const router = require('express').Router();
const {
  getMovies, createMovie, checkMovieOwner, deleteMovie,
} = require('../controllers/movies');
const { createMovieValidation, deleteMovieValidation } = require('../middlewares/validation');

router.get('/', getMovies);
router.post('/', createMovieValidation, createMovie);

router.delete('/:id', deleteMovieValidation, checkMovieOwner, deleteMovie);

module.exports = router;
