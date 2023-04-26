const express = require('express');
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');
const {
  createMovieValidator,
  deleteMovieValidator,
} = require('../middlewares/validation');

const router = express.Router();

router.get('/movies', getMovies);
router.post('/movies', createMovieValidator, createMovie);
router.delete('/movies/:_id', deleteMovieValidator, deleteMovie);

module.exports = router;
