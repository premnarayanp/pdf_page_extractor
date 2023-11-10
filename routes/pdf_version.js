const express = require('express');
const passport = require('passport');
const router = express.Router();

const pdf_versionController = require('../controllers/pdf_versionController');

router.post('/create', passport.authenticate('jwt', { session: false }), pdf_versionController.createdPDF_version);
// router.get('/loads/:version_id', passport.authenticate('jwt', { session: false }), pdf_versionController.loadPDF_version);
// router.get('/posts', passport.authenticate('jwt', { session: false }), pdf_versionController.listOfPdf_version);
// router.get('/downloads/:version_id', passport.authenticate('jwt', { session: false }), pdf_versionController.downloadPDF_version);
// router.delete('/delete/:version_id', passport.authenticate('jwt', { session: false }), pdf_versionController.deletePDF_version);

module.exports = router;