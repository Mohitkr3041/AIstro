const BirthDetails = require("../models/birth.model");
const ChatMessage = require("../models/chatMessage.model");
const AstroReport = require("../models/report.model");
const { generateAstroReading } = require("../services/gemini.service");
const { prepareEvidenceOnly } = require("../services/astrology/prediction");

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

    // Phase 3 — Fetch deterministic Rule Engine evidence for grounding
    let groundedEvidenceSummary = "";
    try {
      const { groundedEvidence } = await prepareEvidenceOnly({ dob, tob, place });
      const meta = groundedEvidence.chartMetadata;

      const domainLines = Object.entries(groundedEvidence.domainEvidence).map(([domain, ev]) => {
        const top = (ev.topSupporting || []).slice(0, 3).map(f => `  - ${f.factor} [${f.strengthLanguage}]`).join("\n");
        const contra = (ev.topContradicting || []).slice(0, 2).map(f => `  - ${f.factor} [${f.strengthLanguage}]`).join("\n");
        return `${domain.toUpperCase()}: ${ev.netInfluenceLanguage}\nSupporting:\n${top || "  (none)"}${contra ? `\nChallenging:\n${contra}` : ""}`;
      }).join("\n\n");

      groundedEvidenceSummary = `
AUTHORITATIVE DETERMINISTIC RULE ENGINE EVIDENCE (Use ONLY this for astrological facts):
Chart: ${meta.ascendantSign} Ascendant, ${meta.sunSign} Sun, ${meta.moonSign} Moon, ${meta.moonNakshatra} Nakshatra

${domainLines}

SCORING DISCLAIMER: These are astrological evidence weights, NOT scientific probabilities.
`.trim();
    } catch (evidenceError) {
      console.warn("[ChatController] Rule Engine evidence preparation warning:", evidenceError.message);
    }

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

STRICT GROUNDING RULES:
- Use ONLY the authoritative Rule Engine evidence supplied below for all astrological claims.
- Do NOT invent planetary placements, Yogas, Dasha periods, or transit predictions.
- If the user asks about specific timing, Dasha, or transits that are not provided in the evidence, explicitly state that Dasha/transit calculations are unavailable rather than fabricating them.
- Do NOT convert evidence scores into percentages or probabilities.
- Do NOT make guaranteed predictions. Use "your chart suggests" or "astrological indicators point to".

User birth details:
- Name: ${name}
- Date of Birth: ${dob}
- Time of Birth: ${tob}
- Place of Birth: ${place}

${groundedEvidenceSummary}

${reportContext ? `Saved report context (supplementary reference only):\n${reportContext}` : ""}

Recent conversation:
${conversationContext || "No previous messages."}

Question mode: ${mode}

User question:
"${message}"

Reply in simple, clear language. Be practical and warm.
Prefer 3 short bullets or 2 short paragraphs. End with one practical next step.
Do not use markdown. Keep it under 200 words.
`.trim();

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
