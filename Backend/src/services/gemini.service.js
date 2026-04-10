const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not configured");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const generateAstroReading = async (prompt) => {
  const model = genAI.getGenerativeModel({
    model: modelName,
  });

  const result = await model.generateContent(prompt);

  return result.response.text();
};

module.exports = { generateAstroReading };
