const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const corsOptions = require('./middlewares/cors');
const logoutRoutes = require('./routes/logout');
const { loginUser, createUser } = require('./controllers/users');
const usersRoutes = require('./routes/users');
const moviesRoutes = require('./routes/movies');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errorHandler } = require('./middlewares/errorhandlers');
const { signupValidator, loginValidator } = require('./middlewares/validation');

const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});
app.use(requestLogger);

app.post('/signup', signupValidator, createUser);
app.post('/signin', loginValidator, loginUser);
app.use('/logout', auth, logoutRoutes);
app.use('/movies', auth, moviesRoutes);
app.use('/users', auth, usersRoutes);
app.use('', (req, res, next) => {
  next(new NotFoundError('Not found'));
});
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
