const express = require('express');
const router = express.Router();

const {
  getUsers,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/users.controller');

const { cacheUsers } = require('../middleware/cacheUsers');

router.get('/', cacheUsers, getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;

