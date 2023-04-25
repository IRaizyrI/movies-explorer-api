const http2 = require('node:http2');
const mongoose = require('mongoose');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');
const Movie = require('../models/movie');
require('dotenv').config();

const { HTTP_STATUS_OK, HTTP_STATUS_CREATED } = http2.constants;

exports.getMovies = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const movies = await Movie.find({ owner: userId });

    res.status(HTTP_STATUS_OK).json(movies);
  } catch (err) {
    next(err);
  }
};

exports.createMovie = async (req, res, next) => {
  try {
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
    } = req.body;

    const owner = req.user._id;
    const movie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      owner,
      movieId,
      nameRU,
      nameEN,
    });

    res.status(HTTP_STATUS_CREATED).json(movie);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError('Invalid movie data'));
    } else {
      next(err);
    }
  }
};

exports.deleteMovie = async (req, res, next) => {
  try {
    const movieId = req.params._id;
    const userId = req.user._id;

    const movie = await Movie.findOne({ _id: movieId });

    if (!movie) {
      throw new NotFoundError('Movie not found');
    }
    if (userId !== movie.owner.toString()) {
      throw new ForbiddenError('Access denied');
    }
    await Movie.deleteOne({ _id: movieId, owner: userId });

    res.status(HTTP_STATUS_OK).json({ message: 'Movie deleted' });
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(new BadRequestError('Invalid movie ID'));
    } else {
      next(err);
    }
  }
};
