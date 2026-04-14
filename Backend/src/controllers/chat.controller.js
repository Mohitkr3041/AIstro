const BirthDetails = require("../models/birth.model");
const ChatMessage = require("../models/chatMessage.model");
const { generateAstroReading } = require("../services/gemini.service");

const formatMessage = (message) => ({
  id: message._id,
  text: message.text,
  sender: message.sender,
  createdAt: message.createdAt,
});

const getChatHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const messages = await ChatMessage.find({ userId })
      .sort({ createdAt: 1 })
      .limit(100);

    res.status(200).json({
      message: "Chat history fetched successfully",
      data: messages.map(formatMessage),
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch chat history",
    });
  }
};

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
    const recentMessages = await ChatMessage.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);
    const conversationContext = recentMessages
      .reverse()
      .map((chatMessage) => `${chatMessage.sender === "user" ? "User" : "AIstro"}: ${chatMessage.text}`)
      .join("\n");

    const prompt = `
You are AIstro, a professional Vedic astrologer and modern life guide.

The user is asking a follow-up question based on their birth details.

User birth details:
- Name: ${name}
- Date of Birth: ${dob}
- Time of Birth: ${tob}
- Place of Birth: ${place}

Recent conversation:
${conversationContext || "No previous messages."}

User question:
"${message}"

Instructions:
- Reply in simple, clear language
- Be practical, warm, and positive
- Give astrology-based guidance, but do not be fear-based
- Do not give medical, legal, financial, or emergency instructions
- For serious health, money, legal, or safety concerns, suggest speaking with a qualified professional
- Keep the answer conversational
- Do not use markdown
- Keep it under 200 words
`;

    const reply = await generateAstroReading(prompt);
    const cleanedReply = reply.trim();

    const savedMessages = await ChatMessage.insertMany([
      { userId, text: message, sender: "user" },
      { userId, text: cleanedReply, sender: "ai" },
    ]);

    res.status(200).json({
      message: "Chat response generated",
      reply: cleanedReply,
      data: savedMessages.map(formatMessage),
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate chat response",
      error: error.message,
    });
  }
};

module.exports = { askAstroChat, getChatHistory };
