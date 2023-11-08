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


//Load My PDF
module.exports.loadPDF = async function(req, res) {
    try {
        const PDFs = await PDFfile.findById({ _id: req.params.pdf_id });
        if (PDFs) {

            if (PDFs.user.equals(req.user._id)) {
                //res.sendFile(path.join(__dirname, '../uploads/posts/pdf/') + PDFs.fileName);

                // fs.readFile('./uploads/posts/pdf/' + PDFs.fileName, function(err, data) {
                //     res.contentType("application/pdf");
                //     console.log("======data=======", data);
                //     res.send(data);
                // });

                const data = fs.readFileSync('./uploads/posts/pdf/' + PDFs.fileName);
                res.contentType("application/pdf");
                res.send(data);

            } else {
                return res.json({ success: false, msg: "You could not view this pdf..", data: { PDFs: null } });

            }

        } else {
            return res.json({ success: false, msg: "Could not found pdf,Pdf not available..", data: { PDFs: null } });
        }

    } catch (error) {
        console.log('error in finding Pdf', error);
        return res.json({ success: false, msg: "Internal server Error..", data: null });

    }
}

module.exports.listOfPdf = async function(req, res) {

    try {
        // const pdfFiles = await PDFfile.find({ user: req.user._id }).populate('user');
        const pdfFiles = await PDFfile.find({ user: req.user._id }).populate('pdfVersion');
        if (pdfFiles) {
            return res.json({ success: true, msg: "success", data: { pdfList: pdfFiles } });
        } else {
            return res.json({ success: false, msg: "There is nothing pdf", data: null });
        }


    } catch (error) {
        return res.json({ success: false, msg: "Internal server Error..", data: null });
    }

}


//Download My PDF
module.exports.downloadPDF = async function(req, res) {
    // console.log("============inside download==============")
    try {
        const PDFs = await PDFfile.findById({ _id: req.params.pdf_id });
        if (PDFs) {

            if (PDFs.user.equals(req.user._id)) {

                //res.sendFile(path.join(__dirname, '../uploads/posts/pdf/') + PDFs.fileName);
                res.download('./uploads/posts/pdf/' + PDFs.fileName);

            } else {
                return res.json({ success: false, msg: "You could not download this pdf..", data: { PDFs: null } });

            }

        } else {
            return res.json({ success: false, msg: "Could not found pdf,Pdf not available..", data: { PDFs: null } });
        }

    } catch (error) {
        console.log('error in finding Pdf', error);
        return res.json({ success: false, msg: "Internal server Error..", data: null });

    }
}

//delete My PDF
module.exports.deletePDF = async function(req, res) {
    try {
        const PDFs = await PDFfile.findById({ _id: req.params.pdf_id });
        if (PDFs) {

            if (PDFs.user.equals(req.user._id)) {
                await PDFfile.findByIdAndDelete({ _id: req.params.pdf_id });
                //await PdfVersion.deleteMany({ pdf: req.params.pdf_id });
                fs.unlinkSync('./uploads/posts/pdf/' + PDFs.fileName);
                return res.json({ success: true, msg: " file successfully deleted", data: { pdf: PDFs } });

            } else {
                return res.json({ success: false, msg: "You could not delete this pdf..", data: { PDFs: null } });

            }

        } else {
            return res.json({ success: false, msg: "Could not found pdf,Pdf not available..", data: { PDFs: null } });
        }

    } catch (error) {
        console.log('error in finding Pdf', error);
        return res.json({ success: false, msg: "Internal server Error..", data: null });

    }
}