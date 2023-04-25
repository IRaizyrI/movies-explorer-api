const express = require('express');
const {
  getMeValidator,
  patchMeValidator,
} = require('../middlewares/validation');
const {
  getCurrentUser,
  updateUser,
} = require('../controllers/users');

const router = express.Router();

router.get('/me', getMeValidator, getCurrentUser);
router.patch('/me', patchMeValidator, updateUser);

module.exports = router;
