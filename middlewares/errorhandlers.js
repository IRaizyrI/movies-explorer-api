const http2 = require('node:http2');

const {
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = http2.constants;

module.exports.errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || HTTP_STATUS_INTERNAL_SERVER_ERROR;
  const { message } = err;
  if (statusCode === HTTP_STATUS_INTERNAL_SERVER_ERROR) {
    res.status(statusCode).json({ message: 'Server Error' });
    console.error(`${statusCode} ${message}`);
  } else {
    res.status(statusCode).json({ message });
  }
  next();
};
