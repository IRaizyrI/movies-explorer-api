const router = require('express').Router();
const auth = require('../middlewares/auth');
const usersRoutes = require('./users');
const logoutRoutes = require('./logout');
const moviesRoutes = require('./movies');
const { loginUser, createUser } = require('../controllers/users');
const NotFoundError = require('../errors/not-found-err');
const { signupValidator, loginValidator } = require('../middlewares/validation');

router.post('/api/signup', signupValidator, createUser);
router.post('/api/signin', loginValidator, loginUser);
router.use('/api/signout', auth, logoutRoutes);
router.use('/api', auth, moviesRoutes);
router.use('/api', auth, usersRoutes);
router.use('/api', auth, (req, res, next) => {
  next(new NotFoundError('Not found'));
});
module.exports = router;
