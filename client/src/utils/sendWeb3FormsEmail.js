/**
 * Shared utility to send email notifications via Web3Forms directly from the browser.
 * This bypasses server-side Cloudflare blocks (403).
 */
export const sendWeb3FormsEmail = async ({ subject, fromName, fields }) => {
    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

    if (!accessKey) {
        console.warn('⚠️ Web3Forms Access Key is missing in client .env');
        return { success: false, message: 'Access Key Missing' };
    }

    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                access_key: accessKey,
                subject: subject || 'New Notification - Sweet Delights',
                from_name: fromName || 'Sweet Delights System',
                ...fields
            })
        });

        const data = await response.json();

        if (data.success) {
            console.log(`✅ Web3Forms Notification Sent: ${subject}`);
            return { success: true, data };
        } else {
            console.warn(`⚠️ Web3Forms Notification Failed: ${data.message}`);
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error('❌ Web3Forms Utility Error:', error.message);
        return { success: false, message: error.message };
    }
};
