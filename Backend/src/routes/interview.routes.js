// Express framework import
const express = require("express")

// Authentication middleware import
const authMiddleware = require("../middlewares/auth.middleware")

// Controller functions import
const interviewController = require("../controllers/interview.controller")

// Multer file upload middleware import
const upload = require("../middlewares/file.middleware")

// Create router object
const interviewRouter = express.Router()

/**
 * POST /api/interview/
 * Purpose:
 * - Resume PDF upload karega
 * - Self description aur job description lega
 * - AI se interview report generate karega
 *
 * authUser -> user login hona chahiye
 * upload.single("resume") -> ek PDF file upload hogi jiska field name "resume" hai
 * generateInterViewReportController -> report generate karega
 */
interviewRouter.post(
    "/",
    authMiddleware.authUser,
    upload.single("resume"),
    interviewController.generateInterViewReportController
)

/**
 * GET /api/interview/report/:interviewId
 * Purpose:
 * - Particular interview report fetch karna
 *
 * :interviewId -> URL parameter
 */
interviewRouter.get(
    "/report/:interviewId",
    authMiddleware.authUser,
    interviewController.getInterviewReportByIdController
)

/**
 * GET /api/interview/
 * Purpose:
 * - Logged in user ki saari interview reports lana
 */
interviewRouter.get(
    "/",
    authMiddleware.authUser,
    interviewController.getAllInterviewReportsController
)

/**
 * POST /api/interview/resume/pdf/:interviewReportId
 * Purpose:
 * - AI generated resume ko PDF me convert karna
 *
 * :interviewReportId -> report id
 */
interviewRouter.post(
    "/resume/pdf/:interviewReportId",
    authMiddleware.authUser,
    interviewController.generateResumePdfController
)

// Export router
module.exports = interviewRouter