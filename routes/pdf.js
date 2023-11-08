const express = require('express');
const passport = require('passport');
const router = express.Router();

const pdfController = require('../controllers/pdf_controller');

router.post('/uploads', passport.authenticate('jwt', { session: false }), pdfController.uploadPDF);


module.exports = router;