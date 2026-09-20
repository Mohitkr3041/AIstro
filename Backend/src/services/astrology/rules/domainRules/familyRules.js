const { getLordOfHouse } = require("../houseLordRules");
const { getAspectsOnHouse } = require("../aspectRules");

/**
 * Evaluates family dynamics, domestic harmony, and lineage evidence.
 * 
 * @param {Object} context - { chart, houseLords, aspects, dignities, yogas }
 * @returns {Array<Object>} List of family evidence items
 */
function evaluateFamilyRules({ chart, houseLords, aspects, dignities, yogas }) {
  const evidence = [];
  const p = chart.planets;
  const lord2 = getLordOfHouse(houseLords, 2);
  const lord4 = getLordOfHouse(houseLords, 4);

  // 1. 2nd House & Lord (Kutumba Bhava: Family Lineage & Domestic Milieu)
  if (lord2) {
    if (["Exalted", "Own Sign", "Moolatrikona"].includes(lord2.dignity)) {
      evidence.push({
        id: "fam_2nd_lord_strong",
        domain: "family",
        factor: `Strong 2nd Lord (${lord2.lordName})`,
        effect: "positive",
        strength: 7,
        source: lord2.source,
        reason: "Well-supported 2nd lord indicates cohesive family lineage, supportive early upbringing, and constructive domestic values."
      });
    } else if (lord2.houseClassification.isDusthana) {
      evidence.push({
        id: "fam_2nd_lord_in_dusthana",
        domain: "family",
        factor: `2nd Lord in House ${lord2.placedInHouse}`,
        effect: "negative",
        strength: -4,
        source: lord2.source,
        reason: "2nd lord in a challenging house suggests early responsibilities or navigating divergent viewpoints within the family unit."
      });
    }
  }

  // 2. 4th House & Lord (Matru & Sukha Bhava: Mother & Domestic Sanctuary)
  if (lord4) {
    if (["Exalted", "Own Sign", "Moolatrikona"].includes(lord4.dignity)) {
      evidence.push({
        id: "fam_4th_lord_strong",
        domain: "family",
        factor: `Strong 4th Lord (${lord4.lordName})`,
        effect: "positive",
        strength: 8,
        source: lord4.source,
        reason: "4th lord with high dignity creates a stable domestic environment, supportive maternal bonding, and peaceful home sanctuary."
      });
    } else if (lord4.dignity === "Debilitated") {
      evidence.push({
        id: "fam_4th_lord_debilitated",
        domain: "family",
        factor: `4th Lord Debilitated (${lord4.lordName})`,
        effect: "negative",
        strength: -5,
        source: lord4.source,
        reason: "4th lord debilitated points to restlessness regarding domestic roots or the need to consciously create one's own emotional sanctuary."
      });
    }
  }

  // 3. Moon (Matru Karaka — Maternal bond & emotional peace)
  if (p.moon) {
    if (dignities.moon?.dignity === "Exalted") {
      evidence.push({
        id: "fam_moon_exalted",
        domain: "family",
        factor: "Moon Exalted in Taurus",
        effect: "positive",
        strength: 8,
        source: { planet: "Moon", sign: "Taurus", house: p.moon.house, longitude: p.moon.longitude },
        reason: "Exalted Moon confers deep emotional grounding, nurturing maternal influences, and restorative inner tranquility."
      });
    } else if (dignities.moon?.dignity === "Debilitated") {
      evidence.push({
        id: "fam_moon_debilitated",
        domain: "family",
        factor: "Moon Debilitated in Scorpio",
        effect: "negative",
        strength: -6,
        source: { planet: "Moon", sign: "Scorpio", house: p.moon.house, longitude: p.moon.longitude },
        reason: "Moon in Scorpio can heighten emotional sensitivity regarding domestic events; benefits from transparent, calm communication."
      });
    }
  }

  // 4. Sun (Pitru Karaka — Paternal bond & heritage)
  if (p.sun) {
    if (dignities.sun?.dignity === "Exalted") {
      evidence.push({
        id: "fam_sun_exalted",
        domain: "family",
        factor: "Sun Exalted in Aries",
        effect: "positive",
        strength: 8,
        source: { planet: "Sun", sign: "Aries", house: p.sun.house, longitude: p.sun.longitude },
        reason: "Exalted Sun reflects inspiring paternal influences, strong heritage pride, and clear guidance from family seniors."
      });
    } else if (dignities.sun?.dignity === "Debilitated") {
      evidence.push({
        id: "fam_sun_debilitated",
        domain: "family",
        factor: "Sun Debilitated in Libra",
        effect: "negative",
        strength: -4,
        source: { planet: "Sun", sign: "Libra", house: p.sun.house, longitude: p.sun.longitude },
        reason: "Debilitated Sun suggests needing to forge one's own autonomous identity independent of paternal expectations."
      });
    }
  }

  // 5. Aspects on 4th House
  const aspectsOn4 = getAspectsOnHouse(aspects, 4);
  for (const asp of aspectsOn4) {
    if (asp.aspectingPlanet === "jupiter") {
      evidence.push({
        id: "fam_jupiter_aspect_4",
        domain: "family",
        factor: "Jupiter Aspects 4th House",
        effect: "positive",
        strength: 7,
        source: asp.source,
        reason: "Jupiter's aspect on the 4th house blesses the domestic sphere with goodwill, hospitality, and emotional serenity."
      });
    }
  }

  return evidence;
}

module.exports = {
  evaluateFamilyRules
};
