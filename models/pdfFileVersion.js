const mongoose = require('mongoose');

const pdfVersionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    pageList: {
        type: Array,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    pdf: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PDFfile'
    },

}, {
    timestamps: true
});

const PdfVersion = mongoose.model('PdfVersion', pdfVersionSchema);
module.exports = PdfVersion;