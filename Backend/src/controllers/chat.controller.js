const BirthDetails = require("../models/birth.model");
const ChatMessage = require("../models/chatMessage.model");
const AstroReport = require("../models/report.model");
const { generateAstroReading } = require("../services/gemini.service");

const formatMessage = (message) => ({
  id: message._id,
  text: message.text,
  sender: message.sender,
  createdAt: message.createdAt,
});

const compactReportContext = (report = {}) => {
  const flow = report.reading_flow || {};
  const parts = [
    ["Chart", report.chart_summary],
    ["Quick Summary", report.quick_summary],
    ["Astrological Identity", flow.astrological_identity],
    ["Past Happenings", flow.past_happenings],
    ["Future Prediction", flow.future_prediction],
    ["Departments", flow.departments],
    ["Remedies", flow.remedy_plan],
    ["Current Transits", report.current_transits],
    ["Forecast", report.forecast],
    ["Career", report.career_and_education],
    ["Love", report.love_and_relationships],
    ["Money", report.money_and_wealth],
  ];

  return parts
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${JSON.stringify(value)}`)
    .join("\n")
    .slice(0, 7000);
};

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
    const mode = typeof req.body.mode === "string" ? req.body.mode.trim() : "general";

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
    const savedReport = await AstroReport.findOne({ userId }).sort({ updatedAt: -1 });
    const reportContext = compactReportContext(savedReport?.report);
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

Saved astrology report context:
${reportContext || "No saved report context is available yet."}

Question mode:
${mode}

User question:
"${message}"

Instructions:
- Reply in simple, clear language
- Be practical, warm, and positive
- Answer from the saved astrology report context whenever available
- If the saved report has relevant future, past, department, or remedy data, use that instead of giving generic advice
- Follow the selected question mode if it is relevant
- Give astrology-based guidance, but do not be fear-based or overly vague
- Prefer 3 short bullets or 2 short paragraphs
- End with one practical next step
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
