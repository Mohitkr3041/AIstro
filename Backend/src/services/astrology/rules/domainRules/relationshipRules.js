const { getLordOfHouse } = require("../houseLordRules");
const { getAspectsOnHouse } = require("../aspectRules");

/**
 * Evaluates relationship, partnership, and marital evidence.
 * 
 * @param {Object} context - { chart, houseLords, aspects, dignities, yogas }
 * @returns {Array<Object>} List of relationship evidence items
 */
function evaluateRelationshipRules({ chart, houseLords, aspects, dignities, yogas }) {
  const evidence = [];
  const p = chart.planets;
  const lord7 = getLordOfHouse(houseLords, 7);

  // 1. Venus Analysis (Karaka for romance, harmony, aesthetic connection)
  if (p.venus) {
    if (["Exalted", "Own Sign", "Moolatrikona"].includes(dignities.venus?.dignity)) {
      evidence.push({
        id: "rel_venus_strong",
        domain: "relationships",
        factor: `Strong Venus (${p.venus.sign})`,
        effect: "positive",
        strength: 8,
        source: { planet: "Venus", sign: p.venus.sign, house: p.venus.house, longitude: p.venus.longitude },
        reason: "Venus is strongly dignified, cultivating genuine affection, refined relationship etiquette, and mutual emotional appreciation."
      });
    } else if (dignities.venus?.dignity === "Debilitated") {
      evidence.push({
        id: "rel_venus_debilitated",
        domain: "relationships",
        factor: "Venus in Virgo (Debilitated)",
        effect: "negative",
        strength: -6,
        source: { planet: "Venus", sign: p.venus.sign, house: p.venus.house, longitude: p.venus.longitude },
        reason: "Venus in Virgo introduces analytical scrutiny into personal dynamics; relationship fulfillment deepens when acceptance replaces perfectionism."
      });
    }

    if (p.venus.retrograde) {
      evidence.push({
        id: "rel_venus_retrograde",
        domain: "relationships",
        factor: "Venus Retrograde",
        effect: "neutral",
        strength: -2,
        source: { planet: "Venus", house: p.venus.house, longitude: p.venus.longitude },
        reason: "Retrograde Venus prompts deep internal re-evaluation of relationship priorities and non-conformist values in partnership."
      });
    }
  }

  // 2. 7th House Occupants
  const planetsIn7 = Object.entries(p).filter(([k, pl]) => pl.house === 7);
  for (const [key, planet] of planetsIn7) {
    if (key === "jupiter") {
      evidence.push({
        id: "rel_jupiter_in_7",
        domain: "relationships",
        factor: "Jupiter in 7th House",
        effect: "positive",
        strength: 8,
        source: { planet: "Jupiter", house: 7, sign: planet.sign, longitude: planet.longitude },
        reason: "Jupiter in the 7th house brings noble, supportive, and philosophically grounded qualities to primary partnerships."
      });
    } else if (key === "saturn") {
      evidence.push({
        id: "rel_saturn_in_7",
        domain: "relationships",
        factor: "Saturn in 7th House (Digbala)",
        effect: "neutral",
        strength: 3,
        source: { planet: "Saturn", house: 7, sign: planet.sign, longitude: planet.longitude },
        reason: "Saturn gains directional strength (Digbala) in the 7th house; relationships prioritize maturity, loyalty, and lasting commitment, often consolidating with greater ease after initial life lessons."
      });
    } else if (key === "mars") {
      evidence.push({
        id: "rel_mars_in_7",
        domain: "relationships",
        factor: "Mars in 7th House (Manglik Consideration)",
        effect: "negative",
        strength: -5,
        source: { planet: "Mars", house: 7, sign: planet.sign, longitude: planet.longitude },
        reason: "Mars in the 7th house brings assertive passion and dynamic energy into partnerships, requiring mature diplomacy to navigate differing viewpoints."
      });
    } else if (key === "rahu") {
      evidence.push({
        id: "rel_rahu_in_7",
        domain: "relationships",
        factor: "Rahu in 7th House",
        effect: "neutral",
        strength: -3,
        source: { planet: "Rahu", house: 7, sign: planet.sign, longitude: planet.longitude },
        reason: "Rahu in the 7th house connects partnership with cross-cultural, non-traditional, or intellectually unconventional individuals."
      });
    } else if (key === "ketu") {
      evidence.push({
        id: "rel_ketu_in_7",
        domain: "relationships",
        factor: "Ketu in 7th House",
        effect: "neutral",
        strength: -3,
        source: { planet: "Ketu", house: 7, sign: planet.sign, longitude: planet.longitude },
        reason: "Ketu in the 7th house encourages seeking spiritual, introspective, or low-drama companions who value inner space."
      });
    }
  }

  // 3. 7th Lord Analysis
  if (lord7) {
    if (["Exalted", "Own Sign", "Moolatrikona"].includes(lord7.dignity)) {
      evidence.push({
        id: "rel_7th_lord_strong",
        domain: "relationships",
        factor: `Strong 7th Lord (${lord7.lordName} in ${lord7.dignity})`,
        effect: "positive",
        strength: 8,
        source: lord7.source,
        reason: `7th lord (${lord7.lordName}) is well-dignified, indicating stability, respect, and mutual empowerment in long-term unions.`
      });
    } else if (lord7.dignity === "Debilitated") {
      evidence.push({
        id: "rel_7th_lord_debilitated",
        domain: "relationships",
        factor: `7th Lord Debilitated (${lord7.lordName})`,
        effect: "negative",
        strength: -6,
        source: lord7.source,
        reason: `7th lord (${lord7.lordName}) is debilitated, signifying that partnerships benefit from explicit boundary-setting and open dialogue.`
      });
    }

    if (lord7.houseClassification.isKendra || lord7.houseClassification.isTrikona) {
      evidence.push({
        id: "rel_7th_lord_in_kendra_trikona",
        domain: "relationships",
        factor: `7th Lord in House ${lord7.placedInHouse}`,
        effect: "positive",
        strength: 7,
        source: lord7.source,
        reason: `7th lord placed in house ${lord7.placedInHouse} aligns partnerships with constructive life goals and shared values.`
      });
    } else if (lord7.houseClassification.isDusthana) {
      evidence.push({
        id: "rel_7th_lord_in_dusthana",
        domain: "relationships",
        factor: `7th Lord in House ${lord7.placedInHouse}`,
        effect: "negative",
        strength: -4,
        source: lord7.source,
        reason: `7th lord in a dusthana house (${lord7.placedInHouse}) points toward relationship phases requiring patience with external stressors or periods of geographic separation.`
      });
    }
  }

  // 4. Aspects on 7th House
  const aspectsOn7 = getAspectsOnHouse(aspects, 7);
  for (const asp of aspectsOn7) {
    if (asp.aspectingPlanet === "jupiter") {
      evidence.push({
        id: "rel_jupiter_aspect_7",
        domain: "relationships",
        factor: "Jupiter Aspects 7th House",
        effect: "positive",
        strength: 8,
        source: asp.source,
        reason: "Jupiter's protective drishti on the 7th house promotes graceful conflict resolution and long-term goodwill."
      });
    }
  }

  // 5. Relationship Yogas
  const relYogas = yogas.filter((y) => Array.isArray(y.domain) && y.domain.includes("relationships"));
  for (const y of relYogas) {
    evidence.push({
      id: `rel_${y.id}`,
      domain: "relationships",
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
  evaluateRelationshipRules
};
