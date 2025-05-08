import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { GoogleGenAI } from "@google/genai";

const router = express.Router();

// Initialize the OpenAI client with the API key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const instructions = `You are a helpful assistant that generates a list of 3 questions based on the user's topic.

If the user asks about a topic you don't know, say, "I'm sorry, I can only answer questions about the topics I've been trained on."

remove unneccesary triple quotes and json in the output
Otherwise, provide the questions in valid JSON format, using the following structure:

{
  "question1": "[Question 1]",
  "question2": "[Question 2]",
  "question3": "[Question 3]"
}

Ensure that all property names ("question1", "question2", "question3") are enclosed in double quotes.  Do not include any text, markdown, or code formatting outside of the specified JSON structure.  Do not include the word 'output:', and do not use backticks.
`;

// Define the /api/ask route that will handle POST requests
router.post("/ask", async (req, res) => {
  try {
    const prompt = req.body.prompt;
    console.log(prompt);

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        systemInstruction: instructions,
        temperature: 0.2,
      },
    });

    // Send the AI response back to the frontend
    generateQuestions(response.text, res); // Pass res object
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong." }); // Send JSON error response
  }
});

function generateQuestions(responseText, res) {
  responseText = responseText.replace(/```json|```/g, "");
  try {
    const questions = JSON.parse(responseText);
    // console.log(questions);
    askQuestion(questions);
    // console.log(typeof questions); // No need to log the type, handled implicitly.
    res.json({ response: questions }); // Send the parsed JSON
  } catch (error) {
    console.error("JSON Parse Error:", error);
    res.status(400).json({ error: "Invalid JSON format from Gemini." }); // Send a 400 error for bad JSON
  }
}
function askQuestion(question) {
  const questions=Object.values(question);
  for(let i=0;i<questions.length;i++){
    console.log(questions[i]);
    
  }
}

export default router;

