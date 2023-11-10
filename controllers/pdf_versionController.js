const PDFfile = require('../models/pdfFile');
const PdfVersion = require('../models/pdfFileVersion');
const path = require('path');
const fs = require('fs');

//Upload the PDF
//actually  not upload file but store page order in PdfVersion models
module.exports.createdPDF_version = async function(req, res) {
    try {
        const pdf = await PDFfile.findById(req.body.pdf_id);

        var pageList = req.body.pageList.split(",").map(i => Number(i));
        // console.log("=========pageList=========", pageList);
        // console.log("=========pdf=========", pdf);
        if (pdf) {
            const pdfVersion = await PdfVersion.create({
                name: "Ver_" + pdf.pdfVersion.length + pdf.originalname,
                pageList: pageList,
                user: req.user._id,
                pdf: req.body.pdf_id,
            })

            console.log("=========pdfVersion=========", pdfVersion);

            pdf.pdfVersion.push(pdfVersion);
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