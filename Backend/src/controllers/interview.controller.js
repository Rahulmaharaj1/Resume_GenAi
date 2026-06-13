const pdfParse = require("pdf-parse");


const {
    generateInterviewReport,
    generateResumePdf
} = require("../services/ai.service");

const interviewReportModel =
require("../models/interviewReport.model");


// CREATE INTERVIEW REPORT
async function generateInterViewReportController(req, res) {
    try {

        // ONLY ONE resumeText (FIXED)
        let resumeText = "";

        // PDF extract
        if (req.file) {
            const pdfData = await pdfParse(req.file.buffer);
            resumeText = pdfData.text;
        }

        const {
            jobDescription,
            selfDescription
        } = req.body;

        if (!jobDescription) {
            return res.status(400).json({
                message: "Job description required"
            });
        }

        if (!resumeText && !selfDescription) {
            return res.status(400).json({
                message: "Resume or self description required"
            });
        }

        // AI generate
        const interviewReportByAi =
            await generateInterviewReport({
                resume: resumeText,
                jobDescription,
                selfDescription
            });

        // Save DB
        const interviewReport =
            await interviewReportModel.create({
                user: req.user.id,
                resume: resumeText,
                selfDescription,
                jobDescription,
                ...interviewReportByAi
            });

        res.status(201).json({
            message: "Interview report generated successfully",
            interviewReport
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: error.message
        });
    }
}


// GET SINGLE REPORT
async function getInterviewReportByIdController(req, res) {
    try {

        const { interviewId } = req.params;

        const report =
            await interviewReportModel.findOne({
                _id: interviewId,
                user: req.user.id
            });

        if (!report) {
            return res.status(404).json({
                message: "Report not found"
            });
        }

        res.json({
            interviewReport: report
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}


// GET ALL REPORTS
async function getAllInterviewReportsController(req, res) {
    try {

        const reports =
            await interviewReportModel.find({
                user: req.user.id
            }).sort({ createdAt: -1 });

        res.json({
            interviewReports: reports
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}


// GENERATE RESUME PDF
async function generateResumePdfController(req, res) {
    try {

        const { interviewReportId } = req.params;

        const report =
            await interviewReportModel.findById(interviewReportId);

        if (!report) {
            return res.status(404).json({
                message: "Interview report not found"
            });
        }

        const pdfBuffer =
            await generateResumePdf({
                resume: report.resume,
                jobDescription: report.jobDescription,
                selfDescription: report.selfDescription
            });

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition":
                `attachment; filename=resume_${interviewReportId}.pdf`
        });

        res.send(pdfBuffer);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: error.message
        });
    }
}

module.exports = {
    generateInterViewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController
};