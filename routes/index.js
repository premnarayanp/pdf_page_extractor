const express = require('express');
const router = express.Router();
console.log('router loaded');

router.use('/users', require('./users'));
router.use('/pdf', require('./pdf'));
router.use('/pdf_version', require('./pdf_version'));
module.exports = router;