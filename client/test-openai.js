
import OpenAI from 'openai';
// Imports removed for direct key testing

// Load env vars
// Note: In a real Vite app, import.meta.env works. In this standalone node script, we need dotenv.
// But the user's key is in .env file which is simple key=value. 
// For simplicity in this test script, I'll pass the key directly since I just received it, 
// OR I can rely on the fact that I just wrote it to the file. 
// Let's try to read the file or just use the key directly for the *test*.
// Using the key directly ensures we test exactly what the user gave, separate from file reading issues.

// Use environment variable for API key
const apiKey = process.env.VITE_OPENAI_API_KEY || "your_api_key_here";

async function testOpenAI() {
    console.log("Testing OpenAI API with key starting with: " + apiKey.substring(0, 10) + "...");

    const openai = new OpenAI({
        apiKey: apiKey,
    });

    try {
        console.log("Sending DALL-E 3 generation request...");
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: "A simple cupcake with pink frosting",
            n: 1,
            size: "1024x1024",
        });

        console.log("Success! Image URL:");
        console.log(response.data[0].url);
    } catch (error) {
        console.error("Error testing OpenAI:");
        console.error(error);
    }
}

testOpenAI();
