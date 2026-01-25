const axios = require('axios');

exports.generateImage = async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const key = process.env.BYTEZ_API_KEY;
        if (!key) {
            return res.status(500).json({ error: 'Bytez API Key not configured' });
        }

        console.log("Generating image with prompt:", prompt);

        // Using CompVis/stable-diffusion-v1-4 as it is confirmed working
        const modelId = "CompVis/stable-diffusion-v1-4";
        const url = `https://api.bytez.com/models/v2/${modelId}`;

        const MAX_RETRIES = 5;
        let attempt = 0;
        let response;
        let lastError;

        while (attempt < MAX_RETRIES) {
            try {
                if (attempt > 0) {
                    console.log(`Retrying request (Attempt ${attempt + 1}/${MAX_RETRIES})...`);
                }
                response = await axios.post(url, {
                    text: prompt
                }, {
                    headers: {
                        'Authorization': `Key ${key}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 0 // No timeout (infinity)
                });
                break; // Success, exit loop
            } catch (err) {
                lastError = err;
                const errorData = err.response ? err.response.data : {};
                const errorMessage = JSON.stringify(errorData).toLowerCase();

                if ((err.response && err.response.status === 429) || errorMessage.includes('rate limited') || errorMessage.includes('inference failed')) {
                    console.warn(`Transient error (Rate limit or Inference). Waiting 5s before retry...`);
                    await new Promise(resolve => setTimeout(resolve, 5000));
                    attempt++;
                } else {
                    throw err; // Not a rate limit, throw immediately
                }
            }
        }

        if (!response && lastError) {
            throw lastError;
        }

        const output = response.data.output;

        if (!output) {
            console.error("No output in response:", response.data);
            return res.status(500).json({ error: 'Image generation returned no output', details: response.data });
        }

        console.log("Image generation successful", output);
        res.status(200).json({ output });

    } catch (err) {
        console.error("Server Error:", err.message);
        if (err.response) {
            console.error("API Response:", err.response.data);
            return res.status(err.response.status).json({
                error: 'Image generation failed',
                details: err.response.data
            });
        }
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
};
