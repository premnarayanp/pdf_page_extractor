const express = require('express');
const passport = require('passport');
const router = express.Router();

const pdf_versionController = require('../controllers/pdf_versionController');

router.post('/create', passport.authenticate('jwt', { session: false }), pdf_versionController.create);
router.get('/posts/:pdf_id', passport.authenticate('jwt', { session: false }), pdf_versionController.listOf);
router.delete('/delete/:pdfVersion_id', passport.authenticate('jwt', { session: false }), pdf_versionController.delete);
//router.get('/downloads/:pdfVersion_id', passport.authenticate('jwt', { session: false }), pdf_versionController.download);
//router.get('/loads/:pdfVersion_id', passport.authenticate('jwt', { session: false }), pdf_versionController.load);
module.exports = router;