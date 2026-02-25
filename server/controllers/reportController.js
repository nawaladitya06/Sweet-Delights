const fs = require('fs');
const path = require('path');
const { generateReport } = require('../utils/reportGenerator');

// @desc    Get all available reports
// @route   GET /api/reports
// @access  Private/Admin
const getReports = async (req, res) => {
    try {
        const reportsDir = path.join(__dirname, '../uploads/reports');
        if (!fs.existsSync(reportsDir)) {
            return res.json([]);
        }

        const files = fs.readdirSync(reportsDir);
        const reports = files
            .filter(file => file.endsWith('.pdf'))
            .map(file => {
                const stats = fs.statSync(path.join(reportsDir, file));
                return {
                    name: file,
                    size: stats.size,
                    createdAt: stats.birthtime,
                    type: file.includes('monthly') ? 'Monthly' : 'Annual'
                };
            })
            .sort((a, b) => b.createdAt - a.createdAt);

        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Download a specific report
// @route   GET /api/reports/download/:filename
// @access  Private/Admin
const downloadReport = async (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = path.join(__dirname, '../uploads/reports', filename);

        if (fs.existsSync(filePath)) {
            res.download(filePath);
        } else {
            res.status(404).json({ message: 'Report not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Manually generate a report
// @route   POST /api/reports/generate
// @access  Private/Admin
const triggerManualReport = async (req, res) => {
    try {
        const { type, month, year } = req.body; // type: 'monthly' or 'annual'

        const now = new Date();
        const targetYear = year || now.getFullYear();
        const targetMonth = month !== undefined ? month : now.getMonth();

        const result = await generateReport(type, targetMonth, targetYear);
        res.status(201).json({ message: 'Report generated successfully', ...result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getReports,
    downloadReport,
    triggerManualReport
};
