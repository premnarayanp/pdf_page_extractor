const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/users_controller');

router.post('/signup', userController.create);
router.post('/login', userController.createJWTSession);


module.exports = router;