const winston = require('winston');
const expressWinston = require('express-winston');

const requestLogTransport = new winston.transports.File({
  filename: './logs/request.log',
  level: 'info',
  format: winston.format.json(),
});

const errorLogTransport = new winston.transports.File({
  filename: './logs/error.log',
  level: 'error',
  format: winston.format.json(),
});

module.exports.requestLogger = expressWinston.logger({
  transports: [requestLogTransport],
  format: winston.format.combine(winston.format.json()),
});
module.exports.errorLogger = expressWinston.errorLogger({
  transports: [errorLogTransport],
  format: winston.format.combine(winston.format.json()),
});
