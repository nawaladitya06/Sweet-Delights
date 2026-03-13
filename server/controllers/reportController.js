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

        // Auto-Cleanup: Delete previous versions of the same report type/period/format
        const reportsDir = path.join(__dirname, '../uploads/reports');
        if (fs.existsSync(reportsDir)) {
            const prefix = `${type}_report_${targetYear}_${type === 'monthly' ? targetMonth + 1 : ''}_`;
            const files = fs.readdirSync(reportsDir);
            files.forEach(file => {
                if (file.startsWith(prefix) && file.endsWith(format === 'excel' ? '.xlsx' : '.pdf')) {
                    try {
                        fs.unlinkSync(path.join(reportsDir, file));
                        console.log(`Auto-cleaned old report: ${file}`);
                    } catch (err) {
                        console.error(`Failed to auto-clean ${file}:`, err);
                    }
                }
            });
        }

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
        const reportsDir = path.join(__dirname, '../uploads/reports');
        const filePath = path.join(reportsDir, filename);

        console.log(`Deletion requested for: ${filename}`);
        console.log(`Absolute path: ${filePath}`);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`Successfully deleted: ${filename}`);
            res.json({ message: 'Report deleted successfully' });
        } else {
            console.warn(`File not found for deletion: ${filePath}`);
            // Check if it's a directory issue
            if (!fs.existsSync(reportsDir)) {
                console.error(`Reports directory missing: ${reportsDir}`);
            }
            res.status(404).json({ message: 'Report not found' });
        }
    } catch (error) {
        console.error(`Error during deletion of ${req.params.filename}:`, error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getReports,
    downloadReport,
    triggerManualReport,
    deleteReport
};
