const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME, // e.g. nawaladitya06@gmail.com
            pass: process.env.EMAIL_PASSWORD  // App password
        }
    });

    // Define email options
    const mailOptions = {
        from: `Sweet Delights <${process.env.EMAIL_USERNAME}>`,
        to: options.email,
        subject: options.subject,
        html: options.message // Using html for better formatting
    };

    // Send email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
