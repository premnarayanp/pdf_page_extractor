const express = require('express');
const passport = require('passport');
const router = express.Router();

const pdfController = require('../controllers/pdf_controller');

router.post('/uploads', passport.authenticate('jwt', { session: false }), pdfController.uploadPDF);
router.get('/loads/:pdf_id', passport.authenticate('jwt', { session: false }), pdfController.loadPDF);
router.get('/posts', passport.authenticate('jwt', { session: false }), pdfController.listOfPdf);
router.get('/downloads/:pdf_id', passport.authenticate('jwt', { session: false }), pdfController.downloadPDF);
router.delete('/delete/:pdf_id', passport.authenticate('jwt', { session: false }), pdfController.deletePDF);

module.exports = router;