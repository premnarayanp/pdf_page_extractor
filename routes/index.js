const express = require('express');
const router = express.Router();
console.log('router loaded');

router.use('/users', require('./users'));
module.exports = router;