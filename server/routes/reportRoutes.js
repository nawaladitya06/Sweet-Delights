const express = require('express');
const router = express.Router();
const { getReports, downloadReport, triggerManualReport } = require('../controllers/reportController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, admin, getReports);

router.route('/generate')
    .post(protect, admin, triggerManualReport);

router.route('/download/:filename')
    .get(protect, admin, downloadReport);

module.exports = router;
