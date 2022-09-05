const express = require('express');

const { getAllUsers, signup, login } = require('../controller/userController');

const router = express.Router();

router.route('/').get(getAllUsers);

router.post('/signup', signup);

router.post('/login', login);

module.exports = router;
