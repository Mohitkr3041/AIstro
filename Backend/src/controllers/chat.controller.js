const BirthDetails = require("../models/birth.model");
const { generateAstroReading } = require("../services/gemini.service");

const askAstroChat = async (req, res) => {
  try {
    const userId = req.user.id;
    const message = typeof req.body.message === "string" ? req.body.message.trim() : "";

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    if (message.length > 1000) {
      return res.status(400).json({ message: "Message must be under 1000 characters" });
    }

    const birth = await BirthDetails.findOne({ userId });

    if (!birth) {
      return res.status(404).json({
        message: "Birth details not found. Please save your birth details first.",
      });
    }

    const { name, dob, tob, place } = birth;

    const prompt = `
You are AIstro, a professional Vedic astrologer and modern life guide.

The user is asking a follow-up question based on their birth details.

User birth details:
- Name: ${name}
- Date of Birth: ${dob}
- Time of Birth: ${tob}
- Place of Birth: ${place}

User question:
"${message}"

Instructions:
- Reply in simple, clear language
- Be practical, warm, and positive
- Give astrology-based guidance, but do not be fear-based
- Keep the answer conversational
- Do not use markdown
- Keep it under 200 words
`;

    const reply = await generateAstroReading(prompt);

    res.status(200).json({
      message: "Chat response generated",
      reply: reply.trim(),
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate chat response",
      error: error.message,
    });
  }
};

module.exports = { askAstroChat };
