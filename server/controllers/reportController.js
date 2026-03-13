const fs = require('fs');
const path = require('path');
const { generateReport } = require('../utils/reportGenerator');
const { generateExcelReport } = require('../utils/excelGenerator');

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
            .filter(file => file.endsWith('.pdf') || file.endsWith('.xlsx'))
            .map(file => {
                const stats = fs.statSync(path.join(reportsDir, file));
                const isMonthly = file.includes('monthly');
                return {
                    name: file,
                    size: stats.size,
                    createdAt: stats.birthtime,
                    type: isMonthly ? 'Monthly' : 'Annual',
                    format: file.endsWith('.pdf') ? 'PDF' : 'Excel'
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
        const { type, month, year, format } = req.body; // type: 'monthly' or 'annual', format: 'pdf' or 'excel'

        const now = new Date();
        const targetYear = year || now.getFullYear();
        const targetMonth = month !== undefined ? month : now.getMonth();

        let result;
        if (format === 'excel') {
            result = await generateExcelReport(type, targetMonth, targetYear);
        } else {
            result = await generateReport(type, targetMonth, targetYear);
        }
        
        res.status(201).json({ message: 'Report generated successfully', ...result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a specific report
// @route   DELETE /api/reports/download/:filename
// @access  Private/Admin
const deleteReport = async (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = path.join(__dirname, '../uploads/reports', filename);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            res.json({ message: 'Report deleted successfully' });
        } else {
            res.status(404).json({ message: 'Report not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getReports,
    downloadReport,
    triggerManualReport,
    deleteReport
};
