const router = require('express').Router();
const auth = require('../middlewares/auth');
const usersRoutes = require('./users');
const logoutRoutes = require('./logout');
const moviesRoutes = require('./movies');
const { loginUser, createUser } = require('../controllers/users');
const NotFoundError = require('../errors/not-found-err');
const { signupValidator, loginValidator } = require('../middlewares/validation');

router.post('/signup', signupValidator, createUser);
router.post('/signin', loginValidator, loginUser);
router.use('/signout', auth, logoutRoutes);
router.use('/movies', auth, moviesRoutes);
router.use('/users', auth, usersRoutes);
router.use('', auth, (req, res, next) => {
  next(new NotFoundError('Not found'));
});
module.exports = router;
