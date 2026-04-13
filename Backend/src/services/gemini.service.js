const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not configured");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const modelNames = (
  process.env.GEMINI_MODEL || "gemini-2.5-flash,gemini-2.0-flash,gemini-2.0-flash-lite"
)
  .split(",")
  .map((modelName) => modelName.trim())
  .filter(Boolean);

const isRetryableModelError = (error) => {
  const message = error?.message || "";

  return (
    message.includes("429") ||
    message.includes("503") ||
    message.includes("high demand") ||
    message.includes("Service Unavailable")
  );
};

const generateAstroReading = async (prompt) => {
  let lastError;

  for (const modelName of modelNames) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
      });

      const result = await model.generateContent(prompt);

      return result.response.text();
    } catch (error) {
      lastError = error;

      if (!isRetryableModelError(error)) {
        throw error;
      }

      console.warn(`Gemini model ${modelName} failed, trying fallback:`, error.message);
    }
  }

  throw lastError;
};

module.exports = { generateAstroReading };
