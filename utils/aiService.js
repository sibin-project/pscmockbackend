import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

export const generatePSCQuestion = async (selectedLevel, selectedSubject) => {
  const prompt = `
You are an expert in Kerala PSC exam content creation.

Task:
Generate ONE high-quality multiple choice question (MCQ) in Malayalam.

Strict Requirements:
- The question must be relevant for Kerala PSC exams.
- Language: Malayalam only for question, options, and explanation.
- Question must be clearly worded and unique.
- Provide exactly 4 options (A, B, C, D).
- Only ONE correct answer.
- Exam Level (Category): Choose ONLY from [sslc, plustow, degree]. Default to "${selectedLevel || 'sslc'}".
- Subject (Subcategory): Choose ONLY from [history, geograpy, maths, english]. Default to "${selectedSubject || 'history'}".

Output format (STRICT JSON, no extra text):
{
  "question": "question text in malayalam",
  "options": {
    "A": "option 1 text",
    "B": "option 2 text",
    "C": "option 3 text",
    "D": "option 4 text"
  },
  "correctAnswer": "A",
  "category": "sslc, plustow, or degree",
  "subcategory": "history, geograpy, maths, or english",
  "explanation": "Detailed explanation in Malayalam why the answer is correct."
}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    
    const text = response.text;
    if (!text) throw new Error("AI returned empty response");

    // Clean JSON if needed (sometimes Gemini wraps in ```json)
    const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
};
