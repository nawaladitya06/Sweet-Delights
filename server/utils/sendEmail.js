const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create transporter with explicit SSL configuration for Render compatibility
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465, // Use SSL port instead of STARTTLS (587)
        secure: true, // Use SSL
        auth: {
            user: process.env.EMAIL_USERNAME, // e.g. nawaladitya06@gmail.com
            pass: process.env.EMAIL_PASSWORD  // App password
        },
        // Add timeout settings for Render
        connectionTimeout: 10000, // 10 seconds
        greetingTimeout: 10000,
        socketTimeout: 10000
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
