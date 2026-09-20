const { getLordOfHouse } = require("../houseLordRules");
const { getAspectsOnHouse } = require("../aspectRules");

/**
 * Evaluates core personality, vitality, mindset, and behavioral disposition evidence.
 * 
 * @param {Object} context - { chart, houseLords, aspects, dignities, yogas }
 * @returns {Array<Object>} List of personality evidence items
 */
function evaluatePersonalityRules({ chart, houseLords, aspects, dignities, yogas }) {
  const evidence = [];
  const p = chart.planets;
  const asc = chart.ascendant;
  const lord1 = getLordOfHouse(houseLords, 1);

  // 1. Ascendant Sign (Lagna) Foundation
  evidence.push({
    id: `pers_lagna_${asc.sign.toLowerCase()}`,
    domain: "personality",
    factor: `Ascendant in ${asc.sign}`,
    effect: "positive",
    strength: 7,
    source: {
      sign: asc.sign,
      longitude: asc.longitude,
      degree: asc.degree,
      minute: asc.minute,
      nakshatra: asc.nakshatra.name,
      pada: asc.nakshatra.pada
    },
    reason: `Ascendant in ${asc.sign} (under ${asc.nakshatra.name} Nakshatra, Pada ${asc.nakshatra.pada}) shapes the fundamental lens of vitality, temperament, and personal orientation.`
  });

  // 2. Ascendant Lord (Lagnesha) Analysis
  if (lord1) {
    if (["Exalted", "Own Sign", "Moolatrikona"].includes(lord1.dignity)) {
      evidence.push({
        id: "pers_lagnesha_strong",
        domain: "personality",
        factor: `Strong Ascendant Lord (${lord1.lordName} in ${lord1.dignity})`,
        effect: "positive",
        strength: 9,
        source: lord1.source,
        reason: `The Ascendant Lord (${lord1.lordName}) is highly dignified, indicating physical stamina, self-assurance, and clear life trajectory.`
      });
    } else if (lord1.dignity === "Debilitated") {
      evidence.push({
        id: "pers_lagnesha_debilitated",
        domain: "personality",
        factor: `Ascendant Lord Debilitated (${lord1.lordName})`,
        effect: "negative",
        strength: -5,
        source: lord1.source,
        reason: `Ascendant Lord (${lord1.lordName}) is in debilitation, suggesting phases of self-doubt or learning to cultivate unshakeable internal validation.`
      });
    }

    if (lord1.houseClassification.isKendra || lord1.houseClassification.isTrikona) {
      evidence.push({
        id: "pers_lagnesha_in_kendra_trikona",
        domain: "personality",
        factor: `Ascendant Lord in House ${lord1.placedInHouse}`,
        effect: "positive",
        strength: 8,
        source: lord1.source,
        reason: `Ascendant Lord placed in house ${lord1.placedInHouse} aligns personal identity with prominent constructive avenues of self-expression.`
      });
    } else if (lord1.placedInHouse === 8) {
      evidence.push({
        id: "pers_lagnesha_in_8",
        domain: "personality",
        factor: "Ascendant Lord in 8th House",
        effect: "neutral",
        strength: 2,
        source: lord1.source,
        reason: "Ascendant Lord in the 8th house imparts deep psychological insight, fascination with the hidden or transformative, and profound resilience."
      });
    }
  }

  // 3. Occupants in 1st House (Lagna)
  const planetsIn1 = Object.entries(p).filter(([k, pl]) => pl.house === 1);
  for (const [key, planet] of planetsIn1) {
    if (key === "sun") {
      evidence.push({
        id: "pers_sun_in_1",
        domain: "personality",
        factor: "Sun in 1st House",
        effect: "positive",
        strength: 7,
        source: { planet: "Sun", house: 1, sign: planet.sign, longitude: planet.longitude },
        reason: "Sun in the 1st house confers authoritative demeanor, strong executive willpower, self-respect, and radiant personal presence."
      });
    } else if (key === "moon") {
      evidence.push({
        id: "pers_moon_in_1",
        domain: "personality",
        factor: "Moon in 1st House",
        effect: "positive",
        strength: 7,
        source: { planet: "Moon", house: 1, sign: planet.sign, longitude: planet.longitude },
        reason: "Moon in the 1st house fosters keen empathy, emotional receptivity, adaptable social presence, and strong intuition."
      });
    } else if (key === "jupiter") {
      evidence.push({
        id: "pers_jupiter_in_1",
        domain: "personality",
        factor: "Jupiter in 1st House (Digbala)",
        effect: "positive",
        strength: 9,
        source: { planet: "Jupiter", house: 1, sign: planet.sign, longitude: planet.longitude },
        reason: "Jupiter gains maximum directional strength (Digbala) in the 1st house, gracing the persona with wisdom, noble demeanor, and optimism."
      });
    } else if (key === "saturn") {
      evidence.push({
        id: "pers_saturn_in_1",
        domain: "personality",
        factor: "Saturn in 1st House",
        effect: "neutral",
        strength: -2,
        source: { planet: "Saturn", house: 1, sign: planet.sign, longitude: planet.longitude },
        reason: "Saturn in the 1st house instills seriousness, reserved self-reliance, and caution, making the individual grow in confidence as years progress."
      });
    } else if (key === "rahu") {
      evidence.push({
        id: "pers_rahu_in_1",
        domain: "personality",
        factor: "Rahu in 1st House",
        effect: "neutral",
        strength: 3,
        source: { planet: "Rahu", house: 1, sign: planet.sign, longitude: planet.longitude },
        reason: "Rahu in the 1st house creates intense magnetism, desire to forge unique non-conformist identities, and sharp modern perceptions."
      });
    } else if (key === "ketu") {
      evidence.push({
        id: "pers_ketu_in_1",
        domain: "personality",
        factor: "Ketu in 1st House",
        effect: "neutral",
        strength: 2,
        source: { planet: "Ketu", house: 1, sign: planet.sign, longitude: planet.longitude },
        reason: "Ketu in the 1st house leans toward modesty, introspective spiritual contemplation, and an enigmatic, understated persona."
      });
    }
  }

  // 4. Moon Sign & Nakshatra (Emotional Disposition)
  if (p.moon) {
    evidence.push({
      id: "pers_moon_mindset",
      domain: "personality",
      factor: `Moon in ${p.moon.sign} (${chart.nakshatra.name} Pada ${chart.nakshatra.pada})`,
      effect: "positive",
      strength: 6,
      source: {
        planet: "Moon",
        sign: p.moon.sign,
        nakshatra: chart.nakshatra.name,
        pada: chart.nakshatra.pada,
        lord: chart.nakshatra.lord,
        longitude: p.moon.longitude
      },
      reason: `The Moon placed in ${p.moon.sign} under ${chart.nakshatra.name} (ruled by ${chart.nakshatra.lord}) shapes the internal emotional rhythm and instinctual response patterns.`
    });
  }

  // 5. Aspects on 1st House
  const aspectsOn1 = getAspectsOnHouse(aspects, 1);
  for (const asp of aspectsOn1) {
    if (asp.aspectingPlanet === "jupiter") {
      evidence.push({
        id: "pers_jupiter_aspect_1",
        domain: "personality",
        factor: "Jupiter Aspects 1st House",
        effect: "positive",
        strength: 8,
        source: asp.source,
        reason: "Jupiter casts an auspicious aspect on the Ascendant, protecting overall health, character integrity, and optimism."
      });
    }
  }

  // 6. Personality Yogas
  const persYogas = yogas.filter((y) => Array.isArray(y.domain) && y.domain.includes("personality"));
  for (const y of persYogas) {
    evidence.push({
      id: `pers_${y.id}`,
      domain: "personality",
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
  evaluatePersonalityRules
};
