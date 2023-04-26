const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const corsOptions = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errorHandler } = require('./middlewares/errorHandlers');

const router = require('./routes/index');
const { urlMongoDev } = require('./utils/constants');
const rateLimiter = require('./middlewares/rateLimiter');
require('dotenv').config();

const { NODE_ENV, DB_LINK } = process.env;
const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
mongoose.connect(NODE_ENV === 'production' ? DB_LINK : urlMongoDev, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});
app.use(requestLogger);
app.use(rateLimiter);

app.use(router);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
