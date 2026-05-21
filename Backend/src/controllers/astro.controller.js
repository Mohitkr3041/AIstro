const BirthDetails = require("../models/birth.model");
const AstroReport = require("../models/report.model");
const { generateAstroReading } = require("../services/gemini.service");
const { calculateVedicChart } = require("../services/chart.service");
const crypto = require("crypto");

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

const getBirthHash = ({ name, dob, tob, place }) => {
  const payload = JSON.stringify({ name, dob, tob, place });
  return crypto.createHash("sha256").update(payload).digest("hex");
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
    const birthHash = getBirthHash({ name, dob, tob, place });
    const forceRefresh = Boolean(req.body?.forceRefresh);
    const cachedReport = await AstroReport.findOne({ userId, birthHash });

    if (cachedReport && !forceRefresh) {
      return res.json({
        message: "Astrology prediction loaded from cache",
        cached: true,
        data: cachedReport.report,
      });
    }

    const chart = calculateVedicChart({ dob, tob, place });

    const prompt = `
You are AIstro, a professional Vedic astrologer and modern life guide.

Analyze the user's birth details and calculated Vedic chart facts to generate a premium astrology product experience.

IMPORTANT RULES:
- Output MUST be valid JSON only
- No markdown
- No extra explanation
- Use practical and positive language
- Write in a personally revealing, curiosity-building style
- First create trust with hidden self-insights and likely past patterns, then give future predictions
- Keep every point specific, concise, and easy to read on a mobile screen
- Prefer vivid insight over generic praise; avoid broad lines that could apply to everyone
- Include accuracy-check moments that make the user think "this has happened to me before"
- Make future prediction feel like a reward after recognition, past validation, and current clarity
- Follow this exact flow: first tell the user about themselves astrologically, then validate likely past happenings, then predict the future, then give department-wise guidance and remedies
- Each section must be concise but meaningful: 2-4 brief points, not long essays
- Write like a specialist astrologer, not like a generic chatbot
- Make the output feel difficult to get from a normal AI chat by connecting chart facts, past patterns, timing windows, and practical actions
- Use phrases like "your chart suggests", "you may have", and "this can show up as" instead of absolute claims
- Use the CALCULATED_CHART exactly as provided
- Do not recalculate, change, or guess the sun sign, moon sign, or nakshatra
- Do not give medical, legal, financial, or emergency instructions
- For serious health, money, legal, or safety concerns, encourage consulting a qualified professional

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
  "reading_flow": {
    "astrological_identity": {
      "title": "",
      "core_signature": "",
      "chart_factors": ["", "", ""],
      "what_this_means": ["", "", ""],
      "user_hook": ""
    },
    "past_happenings": {
      "title": "",
      "validation_points": [
        {
          "area": "Personality",
          "likely_event": "",
          "chart_reason": "",
          "reflection_prompt": ""
        },
        {
          "area": "Education/Career",
          "likely_event": "",
          "chart_reason": "",
          "reflection_prompt": ""
        },
        {
          "area": "Love/Family",
          "likely_event": "",
          "chart_reason": "",
          "reflection_prompt": ""
        }
      ]
    },
    "future_prediction": {
      "headline": "",
      "timeline": [
        {
          "period": "Next 7 days",
          "prediction": "",
          "opportunity": "",
          "watch_out": "",
          "best_action": ""
        },
        {
          "period": "Next 30 days",
          "prediction": "",
          "opportunity": "",
          "watch_out": "",
          "best_action": ""
        },
        {
          "period": "Next 6 months",
          "prediction": "",
          "opportunity": "",
          "watch_out": "",
          "best_action": ""
        }
      ]
    },
    "departments": [
      {
        "name": "Career",
        "insight": "",
        "past_pattern": "",
        "future_signal": "",
        "action": ""
      },
      {
        "name": "Education",
        "insight": "",
        "past_pattern": "",
        "future_signal": "",
        "action": ""
      },
      {
        "name": "Love",
        "insight": "",
        "past_pattern": "",
        "future_signal": "",
        "action": ""
      },
      {
        "name": "Money",
        "insight": "",
        "past_pattern": "",
        "future_signal": "",
        "action": ""
      },
      {
        "name": "Family",
        "insight": "",
        "past_pattern": "",
        "future_signal": "",
        "action": ""
      },
      {
        "name": "Health",
        "insight": "",
        "past_pattern": "",
        "future_signal": "",
        "action": ""
      }
    ],
    "remedy_plan": {
      "priority": "",
      "daily_actions": ["", "", ""],
      "mantra_or_focus": "",
      "avoid_this": "",
      "lucky_support": ""
    }
  },
  "engagement_journey": {
    "opening_hook": "",
    "trust_statement": "",
    "spotlight_insight": "",
    "curiosity_lines": ["", "", ""],
    "accuracy_checks": [
      {
        "label": "Past pattern",
        "statement": "",
        "why_it_matters": ""
      },
      {
        "label": "Inner pattern",
        "statement": "",
        "why_it_matters": ""
      },
      {
        "label": "Current phase",
        "statement": "",
        "why_it_matters": ""
      }
    ],
    "reveal_sections": [
      {
        "title": "The part of you people rarely understand",
        "category": "Hidden self",
        "hook": "",
        "insights": ["", "", ""],
        "action": ""
      },
      {
        "title": "Past patterns your chart remembers",
        "category": "Past validation",
        "hook": "",
        "insights": ["", "", "", ""],
        "action": ""
      },
      {
        "title": "Where your life is asking for clarity now",
        "category": "Current phase",
        "hook": "",
        "insights": ["", "", ""],
        "action": ""
      },
      {
        "title": "What is opening next",
        "category": "Future timeline",
        "hook": "",
        "insights": ["", "", "", ""],
        "action": ""
      },
      {
        "title": "Your personal guidance",
        "category": "Action plan",
        "hook": "",
        "insights": ["", "", ""],
        "action": ""
      }
    ]
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
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });
    const parsedData = extractJsonObject(aiResponse);

    await AstroReport.findOneAndUpdate(
      { userId, birthHash },
      { report: parsedData },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({
      message: "Astrology prediction generated",
      cached: false,
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
