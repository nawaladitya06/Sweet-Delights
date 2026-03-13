const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const Order = require('../models/Order');

/**
 * Generate a sales report Excel
 * @param {string} type - 'monthly' or 'annual'
 * @param {number} month - (0-11)
 * @param {number} year - YYYY
 */
const generateExcelReport = async (type, month, year) => {
    try {
        let startDate, endDate;
        let title = '';

        if (type === 'monthly') {
            startDate = new Date(year, month, 1);
            endDate = new Date(year, month + 1, 0, 23, 59, 59);
            title = `Sales Report - ${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year}`;
        } else {
            startDate = new Date(year, 0, 1);
            endDate = new Date(year, 11, 31, 23, 59, 59);
            title = `Annual Sales Report - ${year}`;
        }

        const orders = await Order.find({
            createdAt: { $gte: startDate, $lte: endDate }
        }).populate('user', 'name email');

        const reportsDir = path.join(__dirname, '../uploads/reports');
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir, { recursive: true });
        }

        const timestamp = Date.now();
        const fileName = `${type}_report_${year}_${type === 'monthly' ? month + 1 : ''}_${timestamp}.xlsx`;
        const filePath = path.join(reportsDir, fileName);

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sales Report');

        // Add Header
        worksheet.mergeCells('A1:F1');
        worksheet.getCell('A1').value = 'Sweet Delights - ' + title;
        worksheet.getCell('A1').font = { name: 'Arial Black', size: 16, color: { argb: 'FFE91E63' } };
        worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };

        worksheet.addRow(['Generated on:', new Date().toLocaleString()]);
        worksheet.addRow([]);

        // Summary
        const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
        const totalGST = orders.reduce((acc, order) => acc + order.taxPrice, 0);
        const totalOrders = orders.length;
        
        worksheet.addRow(['Summary']);
        worksheet.addRow(['Total Orders', totalOrders]);
        worksheet.addRow(['Total Revenue', `₹${totalRevenue.toFixed(2)}`]);
        worksheet.addRow(['Total GST (Tax)', `₹${totalGST.toFixed(2)}`]);
        worksheet.addRow([]);

        // Table Header
        worksheet.addRow(['Date', 'Order ID', 'Customer', 'Items', 'Status', 'Tax (GST)', 'Total Amount']);
        const headerRow = worksheet.getRow(worksheet.rowCount);
        headerRow.font = { bold: true };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF5F5F5' }
        };

        // Order Rows
        orders.forEach(order => {
            worksheet.addRow([
                new Date(order.createdAt).toLocaleDateString(),
                order._id.toString(),
                order.user ? order.user.name : 'Guest',
                order.orderItems.length,
                order.status,
                order.taxPrice,
                order.totalPrice
            ]);
        });

        // Column widths
        worksheet.getColumn(1).width = 15;
        worksheet.getColumn(2).width = 25;
        worksheet.getColumn(3).width = 25;
        worksheet.getColumn(4).width = 10;
        worksheet.getColumn(5).width = 15;
        worksheet.getColumn(6).width = 15;
        worksheet.getColumn(7).width = 15;

        await workbook.xlsx.writeFile(filePath);

        return { fileName, filePath };
    } catch (error) {
        console.error('Error generating Excel report:', error);
        throw error;
    }
};

module.exports = { generateExcelReport };
