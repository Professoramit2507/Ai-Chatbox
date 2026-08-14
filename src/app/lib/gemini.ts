import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error(
    "GEMINI_API_KEY is missing in .env.local"
  );
}

const gemini = new GoogleGenAI({
  apiKey,
});

export default gemini;