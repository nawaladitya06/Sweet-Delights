const express = require('express');
const router = express.Router();
const { getReports, downloadReport, triggerManualReport, deleteReport } = require('../controllers/reportController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, admin, getReports);

router.route('/generate')
    .post(protect, admin, triggerManualReport);

router.route('/download/:filename')
    .get(protect, admin, downloadReport)
    .delete(protect, admin, deleteReport);

module.exports = router;
