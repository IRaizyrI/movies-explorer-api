const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const http2 = require('node:http2');
const mongoose = require('mongoose');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const User = require('../models/user');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;
const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
} = http2.constants;

exports.createUser = async (req, res, next) => {
  try {
    const {
      email, password, name,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      name,
      password: hashedPassword,
    });
    user.password = undefined;
    res.status(HTTP_STATUS_CREATED).json(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError('Invalid user data'));
    }
    if (err.code === 11000) {
      next(new ConflictError('User with this email already exists'));
    } else {
      next(err);
    }
  }
};
exports.getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    res.status(HTTP_STATUS_OK).json(user);
  } catch (err) {
    next(err);
  }
};
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', {
      expiresIn: '7d',
    });

    res.status(HTTP_STATUS_OK).cookie('jwt', token, {
      maxAge: 3600000,
      httpOnly: true,
    }).json({ message: 'Authorization successful' });
  } catch (err) {
    next(err);
  }
};
exports.updateUser = async (req, res, next) => {
  try {
    const { email, name } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser && existingUser._id.toString() !== req.user._id.toString()) {
      throw new ConflictError('User with this email already exists');
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { email, name },
      { new: true, runValidators: true },
    );
    if (user) {
      res.status(HTTP_STATUS_OK).json(user);
    } else {
      throw new NotFoundError('User not found');
    }
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError('Invalid Data'));
    } else {
      next(err);
    }
  }
};
