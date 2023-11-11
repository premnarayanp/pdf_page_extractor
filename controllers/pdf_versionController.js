const PDFfile = require('../models/pdfFile');
const PdfVersion = require('../models/pdfFileVersion');
const path = require('path');
const fs = require('fs');

//=========================Upload/create the PDFVersion======================
//actually  not upload file but store page order in PdfVersion models
module.exports.create = async function(req, res) {
    try {
        const pdf = await PDFfile.findById(req.body.pdf_id);

        var pageList = req.body.pageList.split(",").map(i => Number(i));
        // console.log("=========pageList=========", pageList);
        if (pdf) {
            const pdfVersion = await PdfVersion.create({
                name: "Ver_" + pdf.originalname,
                pageList: pageList,
                user: req.user._id,
                pdf: req.body.pdf_id,
            })

            console.log("=========pdfVersion=========", pdfVersion);

            pdf.pdfVersionList.push(pdfVersion);
            pdf.save();
            return res.json(200, { success: true, msg: "success", data: pdfVersion });
        } else {
            return res.json(200, { success: false, msg: "original pdf not exist ", data: null });
        }


    } catch (error) {
        console.log("===========error================", error)
        return res.json({ success: false, msg: "Internal server Error..", data: null });
    }

}

//==========================delete My PDFVersion==============================
module.exports.delete = async function(req, res) {
    try {
        const pdfVersion = await PdfVersion.findById({ _id: req.params.pdfVersion_id });
        if (pdfVersion) {

            if (pdfVersion.user.equals(req.user._id)) {
                const pdf_id = pdfVersion.pdf;

                await PdfVersion.findByIdAndDelete({ _id: req.params.pdfVersion_id });

                let pdf = await PDFfile.findByIdAndUpdate(pdf_id, {
                    $pull: { pdfVersionList: req.params.pdfVersion_id },
                });
                return res.json({ success: true, msg: "This  pdfVersion successfully deleted", data: { pdfVersion: pdfVersion } });

            } else {
                return res.json({ success: false, msg: "You could not delete this pdfVersion..", data: { PDFs: null } });

            }

        } else {
            return res.json({ success: false, msg: "Could not found pdfVersion, not available..", data: null });
        }

    } catch (error) {
        console.log('error in finding PdfVersion', error);
        return res.json({ success: false, msg: "Internal server Error..", data: null });

    }
}

//=====================listOf_version===========================

module.exports.listOf = async function(req, res) {

    try {
        const pdfVersionList = await PdfVersion.find({ pdf: req.params.pdf_id });
        if (pdfVersionList) {
            return res.json({ success: true, msg: "success", data: { pdfVersionList: pdfVersionList } });
        } else {
            return res.json({ success: false, msg: "There is nothing pdf", data: null });
        }


    } catch (error) {
        console.log("============error=============", error);
        return res.json({ success: false, msg: "Internal server Error..", data: null });
    }

}

//=========================Load My PDF========================
module.exports.load = async function(req, res) {
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

//=====================Download pdf version===========================
module.exports.download = async function(req, res) {
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