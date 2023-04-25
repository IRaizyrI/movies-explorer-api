const express = require('express');
const {
  patchMeValidator,
} = require('../middlewares/validation');
const {
  getCurrentUser,
  updateUser,
} = require('../controllers/users');

const router = express.Router();

router.get('/users/me', getCurrentUser);
router.patch('/users/me', patchMeValidator, updateUser);

module.exports = router;
