import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./openai.js"; // Import the openai.js routes

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());  // To parse incoming JSON requests

app.use("/api", router);  // Use the /api route prefix and import routes from openai.js

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
