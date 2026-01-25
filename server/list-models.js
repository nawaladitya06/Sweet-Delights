const axios = require('axios');
require('dotenv').config();

async function listModels() {
    const key = process.env.BYTEZ_API_KEY;
    console.log("Listing models...");

    try {
        // Based on Bytez docs/SDK, there might be a list endpoint.
        // Trying to query the list of models. 
        // If this exact endpoint doesn't work, I'll rely on the error or try another guess.
        const response = await axios.get('https://api.bytez.com/models/v2/', {
            headers: {
                'Authorization': `Key ${key}`
            }
        });

        const models = response.data;
        if (Array.isArray(models)) {
            const sdModels = models.filter(m => m.id && m.id.toLowerCase().includes('stable-diffusion'));
            console.log("Found Stable Diffusion models:", sdModels.map(m => m.id));
        } else {
            console.log("Response is not an array:", models);
        }

    } catch (err) {
        console.error("Error listing models:");
        if (err.response) {
            console.error(err.response.status, err.response.data);
        } else {
            console.error(err.message);
        }
    }
}

listModels();
