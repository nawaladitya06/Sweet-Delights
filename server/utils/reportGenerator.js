const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const Order = require('../models/Order');

/**
 * Generate a sales report PDF
 * @param {string} type - 'monthly' or 'annual'
 * @param {number} month - (0-11)
 * @param {number} year - YYYY
 */
const generateReport = async (type, month, year) => {
    try {
        let startDate, endDate;
        let title = '';

        if (type === 'monthly') {
            startDate = new Date(year, month, 1);
            endDate = new Date(year, month + 1, 0, 23, 59, 59);
            title = `Sales Report - ${startDate.toLocaleString('default', { month: 'long' })} ${year}`;
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
        const fileName = `${type}_report_${year}_${type === 'monthly' ? month + 1 : ''}_${timestamp}.pdf`;
        const filePath = path.join(reportsDir, fileName);
        const doc = new PDFDocument({ margin: 50 });

        doc.pipe(fs.createWriteStream(filePath));

        // Header
        doc.fillColor('#e91e63').fontSize(24).text('Sweet Delights', { align: 'center' });
        doc.fillColor('#444444').fontSize(10).text('Delicious treats delivered to your door', { align: 'center' });
        doc.moveDown();
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown();

        // Title
        doc.fillColor('#333333').fontSize(18).text(title, { underline: true });
        doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`);
        doc.moveDown();

        // Stats summary
        const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
        const totalGST = orders.reduce((acc, order) => acc + order.taxPrice, 0);
        const totalOrders = orders.length;
        const totalItems = orders.reduce((acc, order) => acc + order.orderItems.reduce((iAcc, item) => iAcc + item.qty, 0), 0);

        doc.fillColor('#e91e63').fontSize(14).text('Summary');
        doc.fillColor('#444444').fontSize(10);
        doc.text(`Total Orders: ${totalOrders}`);
        doc.text(`Total Revenue: ₹${totalRevenue.toFixed(2)}`);
        doc.text(`Total GST (Tax): ₹${totalGST.toFixed(2)}`);
        doc.text(`Total Items Sold: ${totalItems}`);
        doc.moveDown();

        // Table Header
        const tableTop = doc.y;
        doc.font('Helvetica-Bold');
        doc.text('Date', 50, tableTop, { width: 60 });
        doc.text('Order ID', 115, tableTop, { width: 100 });
        doc.text('Customer', 220, tableTop, { width: 160 });
        doc.text('Tax (GST)', 380, tableTop, { width: 80, align: 'right' });
        doc.text('Total Amount', 470, tableTop, { width: 80, align: 'right' });
        doc.moveDown();

        doc.font('Helvetica');
        let currentY = doc.y;

        // Line item logic
        orders.forEach(order => {
            if (currentY > 700) {
                doc.addPage();
                currentY = 50;
            }
            doc.text(new Date(order.createdAt).toLocaleDateString(), 50, currentY, { width: 60 });
            doc.text(order._id.toString().substring(0, 10) + '...', 115, currentY, { width: 100 });
            doc.text(order.user ? order.user.name : 'Guest', 220, currentY, { width: 160 });
            doc.text(`₹${order.taxPrice.toFixed(2)}`, 380, currentY, { width: 80, align: 'right' });
            doc.text(`₹${order.totalPrice.toFixed(2)}`, 470, currentY, { width: 80, align: 'right' });
            currentY += 20;
        });

        doc.moveDown();
        doc.moveTo(50, currentY).lineTo(550, currentY).stroke();
        doc.moveDown();
        doc.text('Thank you for your business!', { align: 'center', italic: true });

        doc.end();

        return { fileName, filePath };
    } catch (error) {
        console.error('Error generating report:', error);
        throw error;
    }
};

module.exports = { generateReport };
