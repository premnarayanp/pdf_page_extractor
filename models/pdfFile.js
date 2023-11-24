const mongoose = require('mongoose');
const multer = require('multer');
const path = require("path");

const PDF_PATH = path.join('/uploads/posts/pdf');
const pdfSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true,
    },
    originalname: {
        type: String,
    },
    path: {
        type: String,
        required: true,
    },
    updated_At: {
        type: Date,
        default: Date.now
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    pdfVersionList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PdfVersion'
    }],
}, {
    timestamps: true
});


const storage = multer.diskStorage({

   
    destination: function(req, file, cb) {
       console.log("===============req===========", file);
       let ext=path.extname(file.originalname);
       if(ext!=='.pdf'){
         return cb(new Error("Invalid File Type,You can upload only pdf"));
        }

     cb(null, path.join(__dirname, '..', PDF_PATH));
    },
    filename: function(req, file, cb) {

        cb(null, "p-" + Date.now() + file.originalname);
    }
})

pdfSchema.statics.uploadedPDF = multer({ storage: storage }).single('pdf');
pdfSchema.statics.pdfPath = PDF_PATH;

const PDFfile = mongoose.model('PDFfile', pdfSchema);

module.exports = PDFfile; 