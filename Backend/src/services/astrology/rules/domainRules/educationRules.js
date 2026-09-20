const { getLordOfHouse } = require("../houseLordRules");
const { getAspectsOnHouse } = require("../aspectRules");

/**
 * Evaluates academic, intellectual, and higher educational evidence.
 * 
 * @param {Object} context - { chart, houseLords, aspects, dignities, yogas }
 * @returns {Array<Object>} List of education evidence items
 */
function evaluateEducationRules({ chart, houseLords, aspects, dignities, yogas }) {
  const evidence = [];
  const p = chart.planets;
  const lord4 = getLordOfHouse(houseLords, 4);
  const lord5 = getLordOfHouse(houseLords, 5);
  const lord9 = getLordOfHouse(houseLords, 9);

  // 1. Mercury Analysis (Karaka for analytical intellect, logic, comprehension)
  if (p.mercury) {
    if (["Exalted", "Own Sign", "Moolatrikona"].includes(dignities.mercury?.dignity)) {
      evidence.push({
        id: "edu_mercury_strong",
        domain: "education",
        factor: `Strong Mercury (${p.mercury.sign})`,
        effect: "positive",
        strength: 8,
        source: { planet: "Mercury", sign: p.mercury.sign, house: p.mercury.house, longitude: p.mercury.longitude },
        reason: "Mercury operates with heightened analytical clarity, supporting rapid assimilation of complex technical, scientific, or linguistic concepts."
      });
    } else if (dignities.mercury?.dignity === "Debilitated") {
      evidence.push({
        id: "edu_mercury_debilitated",
        domain: "education",
        factor: "Mercury in Pisces (Debilitated)",
        effect: "negative",
        strength: -5,
        source: { planet: "Mercury", sign: p.mercury.sign, house: p.mercury.house, longitude: p.mercury.longitude },
        reason: "Mercury favors intuitive and holistic thinking over rigid linear analysis, requiring deliberate attention to detail and structured learning regimens."
      });
    }

    if (p.mercury.retrograde) {
      evidence.push({
        id: "edu_mercury_retrograde",
        domain: "education",
        factor: "Mercury Retrograde",
        effect: "neutral",
        strength: 2,
        source: { planet: "Mercury", house: p.mercury.house, longitude: p.mercury.longitude },
        reason: "Retrograde Mercury encourages deep reflection, investigative curiosity, and non-conventional problem-solving strategies."
      });
    }
  }

  // 2. Jupiter Analysis (Karaka for wisdom, higher knowledge, mentors)
  if (p.jupiter) {
    if (["Exalted", "Own Sign", "Moolatrikona"].includes(dignities.jupiter?.dignity)) {
      evidence.push({
        id: "edu_jupiter_strong",
        domain: "education",
        factor: `Strong Jupiter (${p.jupiter.sign})`,
        effect: "positive",
        strength: 8,
        source: { planet: "Jupiter", sign: p.jupiter.sign, house: p.jupiter.house, longitude: p.jupiter.longitude },
        reason: "Jupiter enhances philosophical breadth, conceptual grasp, and receptivity to guidance from esteemed mentors."
      });
    }
  }

  // 3. 5th House and 5th Lord (Intellect & Creative Intelligence)
  if (lord5) {
    if (lord5.houseClassification.isKendra || lord5.houseClassification.isTrikona) {
      evidence.push({
        id: "edu_5th_lord_auspicious",
        domain: "education",
        factor: `5th Lord in House ${lord5.placedInHouse}`,
        effect: "positive",
        strength: 7,
        source: lord5.source,
        reason: `5th lord (${lord5.lordName}) in house ${lord5.placedInHouse} sustains acute cognitive retention, logical synthesis, and natural scholarly aptitude.`
      });
    } else if (lord5.placedInHouse === 8) {
      evidence.push({
        id: "edu_5th_lord_in_8",
        domain: "education",
        factor: "5th Lord in 8th House",
        effect: "positive",
        strength: 5,
        source: lord5.source,
        reason: "5th lord in the 8th house fosters aptitude for investigative research, data science, deep analytics, or esoteric studies."
      });
    }
  }

  // 4. 4th House and 4th Lord (Foundational Learning & Academic Stability)
  if (lord4) {
    if (lord4.dignity === "Exalted" || lord4.dignity === "Own Sign") {
      evidence.push({
        id: "edu_4th_lord_strong",
        domain: "education",
        factor: `4th Lord Strong (${lord4.lordName})`,
        effect: "positive",
        strength: 7,
        source: lord4.source,
        reason: "Strong 4th lord provides consistent study discipline, supportive educational environments, and formal qualification attainment."
      });
    } else if (lord4.houseClassification.isDusthana) {
      evidence.push({
        id: "edu_4th_lord_in_dusthana",
        domain: "education",
        factor: `4th Lord in House ${lord4.placedInHouse}`,
        effect: "negative",
        strength: -4,
        source: lord4.source,
        reason: "4th lord in a dusthana house suggests potential pauses, shifts in academic institutions, or learning away from one's hometown."
      });
    }
  }

  // 5. Aspects on 5th House
  const aspectsOn5 = getAspectsOnHouse(aspects, 5);
  for (const asp of aspectsOn5) {
    if (asp.aspectingPlanet === "jupiter") {
      evidence.push({
        id: "edu_jupiter_aspect_5",
        domain: "education",
        factor: "Jupiter Aspects 5th House",
        effect: "positive",
        strength: 8,
        source: asp.source,
        reason: "Jupiter's drishti on the 5th house is one of the premier classical placements for sharp intellect and academic achievement."
      });
    } else if (asp.aspectingPlanet === "saturn") {
      evidence.push({
        id: "edu_saturn_aspect_5",
        domain: "education",
        factor: "Saturn Aspects 5th House",
        effect: "neutral",
        strength: -3,
        source: asp.source,
        reason: "Saturn's aspect on the 5th house emphasizes steady, methodical learning over rushed breakthroughs, favoring technical depth."
      });
    }
  }

  // 6. Educational Yogas
  const eduYogas = yogas.filter((y) => Array.isArray(y.domain) && y.domain.includes("education"));
  for (const y of eduYogas) {
    evidence.push({
      id: `edu_${y.id}`,
      domain: "education",
      factor: y.name,
      effect: y.effect,
      strength: y.strength,
      source: y.source,
      reason: y.reason
    });
  }

  return evidence;
}

module.exports = {
  evaluateEducationRules
};
