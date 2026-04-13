const BirthDetails = require("../models/birth.model");
const { generateAstroReading } = require("../services/gemini.service");
const { calculateVedicChart } = require("../services/chart.service");

const extractJsonObject = (text) => {
  const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();

  try {
    return JSON.parse(cleanedText);
  } catch {
    const firstBrace = cleanedText.indexOf("{");
    const lastBrace = cleanedText.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
      throw new Error("Model did not return a valid JSON object");
    }

    const jsonSlice = cleanedText.slice(firstBrace, lastBrace + 1);
    return JSON.parse(jsonSlice);
  }
};

const getPredictionErrorMessage = (error) => {
  const message = error?.message || "";

  if (message.includes("API key") || message.includes("403 Forbidden")) {
    return "AI service authentication failed. Please update the Gemini API key on the server.";
  }

  if (message.includes("valid JSON")) {
    return "AI generated an invalid report format. Please try again.";
  }

  if (
    message.includes("429") ||
    message.includes("503") ||
    message.includes("high demand") ||
    message.includes("Service Unavailable")
  ) {
    return "AI service is busy right now. Please try again in a minute.";
  }

  return "Failed to generate astrology prediction";
};

const generatePrediction = async (req, res) => {
  try {
    const userId = req.user.id;

    const birth = await BirthDetails.findOne({ userId });

    if (!birth) {
      return res.status(404).json({
        message: "Birth details not found. Please save your birth details first.",
      });
    }

    const { name, dob, tob, place } = birth;
    const chart = calculateVedicChart({ dob, tob, place });

    const prompt = `
You are AIstro, a professional Vedic astrologer and modern life guide.

Analyze the user's birth details and calculated Vedic chart facts to generate a complete astrology report.

IMPORTANT RULES:
- Output MUST be valid JSON only
- No markdown
- No extra explanation
- Use practical and positive language
- Use the CALCULATED_CHART exactly as provided
- Do not recalculate, change, or guess the sun sign, moon sign, or nakshatra

INPUT:
{
  "name": "${name}",
  "date_of_birth": "${dob}",
  "time_of_birth": "${tob}",
  "place_of_birth": "${place}"
}

CALCULATED_CHART:
${JSON.stringify(chart, null, 2)}

OUTPUT FORMAT:
{
  "chart_summary": {
    "zodiac_system": "${chart.zodiac_system}",
    "ayanamsa": "${chart.ayanamsa}",
    "sun_sign": "${chart.sun_sign}",
    "moon_sign": "${chart.moon_sign}",
    "moon_nakshatra": "${chart.moon_nakshatra}",
    "timezone_assumption": "${chart.timezone_assumption}"
  },
  "quick_summary": {
    "personality": "",
    "strength": "",
    "relationship_style": "",
    "career_direction": "",
    "next_30_days_highlight": ""
  },
  "personality_and_mindset": {
    "nature": "",
    "emotional_pattern": "",
    "communication_style": "",
    "stress_handling": ""
  },
  "strengths_and_weaknesses": {
    "strengths": ["", "", "", "", ""],
    "weaknesses": ["", "", "", "", ""]
  },
  "love_and_relationships": {
    "partner_type": "",
    "relationship_pattern": "",
    "marriage_timing_hint": "",
    "red_flags": ""
  },
  "career_and_education": {
    "best_fields": ["", "", ""],
    "job_or_business": "",
    "skill_recommendations": ["", "", ""],
    "growth_periods": ""
  },
  "money_and_wealth": {
    "earning_style": "",
    "spending_pattern": "",
    "wealth_growth_timeline": ""
  },
  "health_and_lifestyle": {
    "weak_areas": ["", ""],
    "lifestyle_advice": ["", "", ""]
  },
  "current_transits": {
    "planetary_influence": "",
    "focus_now": "",
    "avoid_now": ""
  },
  "forecast": {
    "next_7_days": "",
    "next_30_days": "",
    "next_6_months": ""
  },
  "remedies": {
    "daily_habits": ["", "", ""],
    "mantra": "",
    "donation_or_service": "",
    "mindset_remedy": ""
  },
  "lucky_factors": {
    "lucky_day": "",
    "lucky_color": "",
    "lucky_number": "",
    "lucky_direction": ""
  },
  "final_guidance": ["", "", ""]
}

Return only valid JSON.
`;

    const aiResponse = await generateAstroReading(prompt, {
      maxAttempts: 3,
      generationConfig: {
        maxOutputTokens: 4096,
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });
    const parsedData = extractJsonObject(aiResponse);

    res.json({
      message: "Astrology prediction generated",
      data: parsedData,
    });
  } catch (error) {
    console.error("Astrology prediction failed:", error);

    res.status(500).json({
      message: getPredictionErrorMessage(error),
    });
  }
};

module.exports = { generatePrediction };
