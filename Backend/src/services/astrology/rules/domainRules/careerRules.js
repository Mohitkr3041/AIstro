const { getLordOfHouse } = require("../houseLordRules");
const { getAspectsOnHouse } = require("../aspectRules");

/**
 * Evaluates career and professional life evidence.
 * 
 * @param {Object} context - { chart, houseLords, aspects, dignities, yogas }
 * @returns {Array<Object>} List of career evidence items
 */
function evaluateCareerRules({ chart, houseLords, aspects, dignities, yogas }) {
  const evidence = [];
  const p = chart.planets;
  const lord10 = getLordOfHouse(houseLords, 10);
  const lord6 = getLordOfHouse(houseLords, 6);

  // 1. 10th House Occupants
  const planetsIn10 = Object.entries(p).filter(([k, pl]) => pl.house === 10);
  for (const [key, planet] of planetsIn10) {
    if (key === "sun") {
      evidence.push({
        id: "career_sun_in_10",
        domain: "career",
        factor: "Sun in 10th House (Digbala)",
        effect: "positive",
        strength: 9,
        source: { planet: "Sun", house: 10, sign: planet.sign, longitude: planet.longitude },
        reason: "Sun possesses maximum directional strength (Digbala) in the 10th house, conferring natural professional visibility, leadership presence, and administrative competence."
      });
    } else if (key === "mars") {
      evidence.push({
        id: "career_mars_in_10",
        domain: "career",
        factor: "Mars in 10th House (Kuladipaka)",
        effect: "positive",
        strength: 8,
        source: { planet: "Mars", house: 10, sign: planet.sign, longitude: planet.longitude },
        reason: "Mars has directional strength in the 10th house, providing high initiative, technical or managerial capability, and tenacity in overcoming hurdles."
      });
    } else if (key === "jupiter") {
      evidence.push({
        id: "career_jupiter_in_10",
        domain: "career",
        factor: "Jupiter in 10th House",
        effect: "positive",
        strength: 8,
        source: { planet: "Jupiter", house: 10, sign: planet.sign, longitude: planet.longitude },
        reason: "Jupiter in the 10th house supports roles involving guidance, strategic advisory, teaching, law, or institutional stewardship."
      });
    } else if (key === "saturn") {
      evidence.push({
        id: "career_saturn_in_10",
        domain: "career",
        factor: "Saturn in 10th House",
        effect: "positive",
        strength: 6,
        source: { planet: "Saturn", house: 10, sign: planet.sign, longitude: planet.longitude },
        reason: "Saturn in the 10th house emphasizes long-term career building through diligence, structured responsibility, and gradual recognition."
      });
    } else if (key === "rahu") {
      evidence.push({
        id: "career_rahu_in_10",
        domain: "career",
        factor: "Rahu in 10th House",
        effect: "positive",
        strength: 6,
        source: { planet: "Rahu", house: 10, sign: planet.sign, longitude: planet.longitude },
        reason: "Rahu in the 10th house fosters unconventional ambition, rapid adaptation to emerging technologies, and public-facing or foreign-connected roles."
      });
    }
  }

  // 2. 10th Lord Analysis
  if (lord10) {
    if (["Exalted", "Own Sign", "Moolatrikona"].includes(lord10.dignity)) {
      evidence.push({
        id: "career_10th_lord_strong_dignity",
        domain: "career",
        factor: `Strong 10th Lord (${lord10.lordName} in ${lord10.dignity})`,
        effect: "positive",
        strength: 8,
        source: lord10.source,
        reason: `The 10th lord (${lord10.lordName}) is in ${lord10.dignity} status, indicating reliable career foundation, professional stability, and self-direction.`
      });
    } else if (lord10.dignity === "Debilitated") {
      evidence.push({
        id: "career_10th_lord_debilitated",
        domain: "career",
        factor: `10th Lord Debilitated (${lord10.lordName} in ${lord10.placedInSign})`,
        effect: "negative",
        strength: -6,
        source: lord10.source,
        reason: `The 10th lord (${lord10.lordName}) is debilitated, suggesting periods where professional direction requires recalibration and conscious role adjustments.`
      });
    }

    if (lord10.houseClassification.isKendra || lord10.houseClassification.isTrikona) {
      evidence.push({
        id: "career_10th_lord_in_kendra_trikona",
        domain: "career",
        factor: `10th Lord in House ${lord10.placedInHouse}`,
        effect: "positive",
        strength: 7,
        source: lord10.source,
        reason: `10th lord placed in house ${lord10.placedInHouse} (an auspicious angular/trinal house) anchors career pursuits to constructive opportunities.`
      });
    } else if (lord10.placedInHouse === 6) {
      evidence.push({
        id: "career_10th_lord_in_6",
        domain: "career",
        factor: "10th Lord in 6th House",
        effect: "positive",
        strength: 5,
        source: lord10.source,
        reason: "10th lord in the 6th house aligns with professions in problem resolution, audit, competitive environments, legal, healthcare, or public service."
      });
    } else if (lord10.placedInHouse === 8) {
      evidence.push({
        id: "career_10th_lord_in_8",
        domain: "career",
        factor: "10th Lord in 8th House",
        effect: "neutral",
        strength: 1,
        source: lord10.source,
        reason: "10th lord in the 8th house suggests careers oriented toward research, crisis management, data transformation, or confidential operations."
      });
    } else if (lord10.placedInHouse === 12) {
      evidence.push({
        id: "career_10th_lord_in_12",
        domain: "career",
        factor: "10th Lord in 12th House",
        effect: "positive",
        strength: 4,
        source: lord10.source,
        reason: "10th lord in the 12th house favors engagement with multinational entities, foreign operations, institutional research, or remote ecosystems."
      });
    }

    if (lord10.retrograde) {
      evidence.push({
        id: "career_10th_lord_retrograde",
        domain: "career",
        factor: "10th Lord Retrograde",
        effect: "neutral",
        strength: -2,
        source: lord10.source,
        reason: `10th lord (${lord10.lordName}) is retrograde, pointing toward periodic self-reassessment of career trajectories or unconventional pacing.`
      });
    }
  }

  // 3. Aspects on the 10th House
  const aspectsOn10 = getAspectsOnHouse(aspects, 10);
  for (const asp of aspectsOn10) {
    if (asp.aspectingPlanet === "jupiter") {
      evidence.push({
        id: "career_jupiter_aspect_10",
        domain: "career",
        factor: "Jupiter Aspects 10th House",
        effect: "positive",
        strength: 7,
        source: asp.source,
        reason: "Jupiter's aspect on the 10th house imparts ethical standing, broad vision, and protection in professional milestones."
      });
    } else if (asp.aspectingPlanet === "saturn") {
      evidence.push({
        id: "career_saturn_aspect_10",
        domain: "career",
        factor: "Saturn Aspects 10th House",
        effect: "neutral",
        strength: -3,
        source: asp.source,
        reason: "Saturn's aspect on the 10th house calls for patience and thorough accountability, moderating early rapid gains with demands for sustained mastery."
      });
    }
  }

  // 4. Relevant Yogas linked to career
  const careerYogas = yogas.filter((y) => Array.isArray(y.domain) && y.domain.includes("career"));
  for (const y of careerYogas) {
    evidence.push({
      id: `career_${y.id}`,
      domain: "career",
      factor: `${y.name}`,
      effect: y.effect,
      strength: y.strength,
      source: y.source,
      reason: y.reason
    });
  }

  return evidence;
}

module.exports = {
  evaluateCareerRules
};
