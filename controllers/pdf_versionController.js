const PDFfile = require('../models/pdfFile');
const PdfVersion = require('../models/pdfFileVersion');
const path = require('path');
const fs = require('fs');
const stream = require("stream");

const { PDFDocument } = require("pdf-lib");


//=======================CreateNew Pdf From Existing Pdf using pdf-lib================================
const createNewPdf = async(pdfBufferOrFile, pdfVersion) => {

    const pageIndexList = pdfVersion.pageList;
    const pdfNewVersionSize = pageIndexList.length;

    const pdfFile = await PDFDocument.load(pdfBufferOrFile, pdfVersion);
    //const totalPages = pdfFile.getPageCount();

    const pdfNewVersion = await PDFDocument.create()
    for (let i = 0; i < pdfNewVersionSize; i++) {
        const [existingPage] = await pdfNewVersion.copyPages(pdfFile, [pageIndexList[i] - 1])
        pdfNewVersion.insertPage(i, existingPage);
    }

    const pdfBytes = await pdfNewVersion.save();
    //console.log("==================pdf=byte======================", pdfBytes)
    return pdfBytes;


}

// const loader = async() => {
//     const pdfVersion = {
//         versionName: "pdf-2",
//         pageList: [1, 5, 6, 10]
//     }
//     const data = fs.readFileSync('./uploads/posts/pdf/' + 'p-1699595359526Lec4-Notes-Forms.pdf');
//     const pdfVersionBuffer = await createNewPdf(data, pdfVersion);
//     console.log("==============pdfVersionBuffer=============", pdfVersionBuffer);
// }
//loader();

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

//=========================Load My PDFVersion========================
module.exports.load = async function(req, res) {
    try {

        //console.log("==================inside load==================")
        const pdfVersion = await PdfVersion.findById({ _id: req.params.pdfVersion_id }).populate('pdf');
        if (pdfVersion) {

            if (pdfVersion.user.equals(req.user._id)) {
                const data = fs.readFileSync('./uploads/posts/pdf/' + pdfVersion.pdf.fileName);
                const pdfVersionBuffer = await createNewPdf(data, pdfVersion);


                const stream = require("stream");
                const readStream = new stream.PassThrough();
                readStream.end(pdfVersionBuffer);
                res.set("Content-disposition", 'attachment; filename=' + "output.docx");
                res.set("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.pdf");
                readStream.pipe(res);

                // res.contentType("application/pdf");
                // res.send(pdfVersionBuffer);

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

        //console.log("==================inside load==================")
        const pdfVersion = await PdfVersion.findById({ _id: req.params.pdfVersion_id }).populate('pdf');
        if (pdfVersion) {

            if (pdfVersion.user.equals(req.user._id)) {
                const data = fs.readFileSync('./uploads/posts/pdf/' + pdfVersion.pdf.fileName);
                const pdfVersionBuffer = await createNewPdf(data, pdfVersion);


                const stream = require("stream");
                const readStream = new stream.PassThrough();
                readStream.end(pdfVersionBuffer);
                res.set("Content-disposition", 'attachment; filename=' + "output.docx");
                res.set("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.pdf");
                readStream.pipe(res);
                //res.download();

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


//================edit pdf version====================
module.exports.edit = async function(req, res) {
    try {
        const pdfVersion = await PdfVersion.findById({ _id: req.body.pdfVersion_id });
        var pageList = req.body.pageList.split(",").map(i => Number(i));
        if (pdfVersion) {
            pdfVersion.pageList = pageList

            //console.log("=========pdfVersion=========", pdfVersion);
            pdfVersion.save();
            return res.json(200, { success: true, msg: "success", data: pdfVersion });
        } else {
            return res.json(200, { success: false, msg: "original pdf not exist ", data: null });
        }


    } catch (error) {
        console.log("===========error================", error)
        return res.json({ success: false, msg: "Internal server Error..", data: null });
    }

}