
import { GoogleGenerativeAI } from "@google/generative-ai";

async function testImageGen() {
    const apiKey = process.env.VITE_GOOGLE_API_KEY || "your_api_key_here";
    console.log("Testing Image Generation...");

    const genAI = new GoogleGenerativeAI(apiKey);
    // Trying the model listed in the previous step
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image" });

    const prompt = "A beautiful chocolate cake with berries";

    try {
        console.log("Sending prompt to: gemini-2.0-flash-exp-image-generation");
        const result = await model.generateContent(prompt);
        console.log("Result received.");
        const response = await result.response;
        console.log("Response text (if any):", response.text());
        console.log("Full response:", JSON.stringify(result, null, 2));
    } catch (e) {
        console.log("Error with gemini-2.0-flash-exp-image-generation:");
        console.log(e.message);
    }
}

testImageGen();
