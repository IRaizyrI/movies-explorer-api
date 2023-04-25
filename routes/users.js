const express = require('express');
const {
  patchMeValidator,
} = require('../middlewares/validation');
const {
  getCurrentUser,
  updateUser,
} = require('../controllers/users');

const router = express.Router();

router.get('/me', getCurrentUser);
router.patch('/me', patchMeValidator, updateUser);

module.exports = router;
