const axios = require('axios');
require('dotenv').config();

const models = [
    "stabilityai/stable-diffusion-2-1",
    "stabilityai/sdxl-turbo",
    "runwayml/stable-diffusion-v1-5",
    "CompVis/stable-diffusion-v1-4",
    "stabilityai/stable-diffusion-xl-base-1.0"
];

async function testModels() {
    const key = process.env.BYTEZ_API_KEY;
    console.log("Testing models with key:", key.substring(0, 5) + "...");

    for (const modelId of models) {
        console.log(`\nTesting: ${modelId}`);
        const url = `https://api.bytez.com/models/v2/${modelId}`;

        try {
            const response = await axios.post(url, {
                text: "A small red apple"
            }, {
                headers: {
                    'Authorization': `Key ${key}`,
                    'Content-Type': 'application/json'
                },
                timeout: 30000 // 30s timeout for test
            });

            console.log(`✅ SUCCESS: ${modelId}`);
            console.log("Output:", response.data.output);
            return; // Stop at first success

        } catch (err) {
            if (err.response) {
                console.error(`❌ FAILED: ${modelId} - Status: ${err.response.status}`);
                console.error("Error:", JSON.stringify(err.response.data));
            } else {
                console.error(`❌ FAILED: ${modelId} - ${err.message}`);
            }
        }
    }
    console.log("\nAll models failed.");
}

testModels();
