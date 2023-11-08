const PDFfile = require('../models/pdfFile');
const PdfVersion = require('../models/pdfFileVersion');
const path = require('path');
const fs = require('fs');

//Upload the PDF
module.exports.uploadPDF = async function(req, res) {
    try {
        PDFfile.uploadedPDF(req, res, async function(error) {
            //console.log("=========req.file=========", req.file);

            if (error) {
                console.log("multer Error**************", error);
                return res.json({ success: false, msg: "Server Error While Upload PDF", data: null });
            }

            const fileName = req.file.filename;
            const originalname = req.file.originalname;
            //const filePath = path.join(__dirname, '..', PDFfile.pdfPath + '/' + fileName);
            const filePath = PDFfile.pdfPath + '/' + fileName;
            //console.log(filePath);

            if (req.file) {
                const pdf = await PDFfile.create({
                    fileName: fileName,
                    path: filePath,
                    originalname: originalname,
                    user: req.user._id
                });
                //console.log("=========pdf in mongodb=========", pdf);
                return res.json({ success: true, msg: "File Successfully Uploaded", data: pdf });
            } else {
                return res.json({ success: false, msg: "File Not Found", data: null });
            }

        });
    } catch (error) {
        return res.json({ success: false, msg: "Internal server Error..", data: null });
    }

}