require('dotenv').config();

async function testWeb3Forms() {
    console.log('=== Web3Forms API Test ===');
    console.log('Access Key:', process.env.WEB3FORMS_ACCESS_KEY ?
        process.env.WEB3FORMS_ACCESS_KEY.substring(0, 8) + '...' : 'NOT SET!');
    console.log('Node.js version:', process.version);

    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                access_key: process.env.WEB3FORMS_ACCESS_KEY,
                subject: 'Test Email from Sweet Delights',
                from_name: 'Sweet Delights Test',
                name: 'Test User',
                email: 'test@example.com',
                message: 'This is a test to verify Web3Forms is working.'
            })
        });

        console.log('\n=== HTTP Response ===');
        console.log('Status:', response.status);
        console.log('Status Text:', response.statusText);
        console.log('Content-Type:', response.headers.get('content-type'));

        const text = await response.text();
        console.log('\n=== Raw Response Body (first 500 chars) ===');
        console.log(text.substring(0, 500));

        // Try to parse as JSON
        try {
            const json = JSON.parse(text);
            console.log('\n=== Parsed JSON ===');
            console.log(JSON.stringify(json, null, 2));
        } catch (e) {
            console.log('\n❌ Response is NOT valid JSON!');
            console.log('This means Web3Forms may be returning an error page.');
        }
    } catch (error) {
        console.error('\n❌ Fetch Error:', error.message);
    }
}

testWeb3Forms();
