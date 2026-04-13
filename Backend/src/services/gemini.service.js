const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not configured");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const fallbackModelNames = [
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash",
  "gemini-1.5-flash-8b",
];
const configuredModelNames = (process.env.GEMINI_MODEL || "")
  .split(",")
  .map((modelName) => modelName.trim())
  .filter(Boolean);
const modelNames = [...new Set([...configuredModelNames, ...fallbackModelNames])];

const isRetryableModelError = (error) => {
  const message = error?.message || "";

  return (
    message.includes("429") ||
    message.includes("503") ||
    message.includes("high demand") ||
    message.includes("Service Unavailable")
  );
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const generateAstroReading = async (prompt, options = {}) => {
  let lastError;
  const maxAttempts = options.maxAttempts || 2;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    for (const modelName of modelNames) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: options.generationConfig,
        });

        const result = await model.generateContent(prompt);

        return result.response.text();
      } catch (error) {
        lastError = error;

        if (!isRetryableModelError(error)) {
          throw error;
        }

        console.warn(
          `Gemini model ${modelName} failed on attempt ${attempt}, trying fallback:`,
          error.message
        );
      }
    }

    if (attempt < maxAttempts) {
      await wait(1000 * attempt);
    }
  }

  throw lastError;
};

module.exports = { generateAstroReading };
