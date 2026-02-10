/**
 * Web3Forms Email Utility
 * Sends email notifications via Web3Forms API
 * https://web3forms.com/
 * 
 * Setup:
 * 1. Get your free access key at https://web3forms.com/#start
 * 2. Add WEB3FORMS_ACCESS_KEY=your_key to .env
 */

const sendEmail = async (options) => {
    if (!process.env.WEB3FORMS_ACCESS_KEY) {
        const errorMsg = 'WEB3FORMS_ACCESS_KEY environment variable is not set!';
        console.error('❌ WEB3FORMS ERROR:', errorMsg);
        throw new Error(errorMsg);
    }

    console.log(`📧 Sending email via Web3Forms...`);
    console.log(`📧 Subject: ${options.subject}`);
    console.log(`📧 Recipient info: ${options.email}`);

    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                access_key: process.env.WEB3FORMS_ACCESS_KEY,
                subject: options.subject,
                from_name: 'Sweet Delights',
                to: options.email,
                message: options.message
            })
        });

        const data = await response.json();

        if (data.success) {
            console.log('✅ Email sent successfully via Web3Forms!');
            console.log(`✅ Subject: ${options.subject}`);
            return data;
        } else {
            throw new Error(data.message || 'Web3Forms submission failed');
        }
    } catch (error) {
        console.error('❌ WEB3FORMS SEND FAILED:', {
            error: error.message,
            subject: options.subject,
            timestamp: new Date().toISOString()
        });
        throw new Error(`Email sending failed: ${error.message}`);
    }
};

module.exports = sendEmail;
