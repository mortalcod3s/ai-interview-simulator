import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { GoogleGenAI } from "@google/genai";

const router = express.Router();

// Initialize the OpenAI client with the API key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


// Define the /api/ask route that will handle POST requests
router.post("/ask", async (req, res) => {
  try {

    const prompt = req.body.prompt;
    console.log(prompt);

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    // Send the AI response back to the frontend
    res.json({ response: response.text });
  } catch (error) {
    console.error("Error:", error);  // Log any errors for debugging
    res.status(500).send("Something went wrong.");  // Send error response
  }
});

export default router  // Export the router to be used in server.js
