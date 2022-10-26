const router = require('express').Router();
const {
  getUsers, patchUser,
} = require('../controllers/users');
const { patchUserValidation } = require('../middlewares/validation');

router.get('/me', getUsers);
router.patch('/me', patchUserValidation, patchUser);

module.exports = router;
