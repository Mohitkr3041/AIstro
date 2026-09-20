const { getLordOfHouse } = require("../houseLordRules");
const { getAspectsOnHouse } = require("../aspectRules");

/**
 * Evaluates wealth, financial accumulation, and material resource evidence.
 * 
 * @param {Object} context - { chart, houseLords, aspects, dignities, yogas }
 * @returns {Array<Object>} List of financial evidence items
 */
function evaluateFinanceRules({ chart, houseLords, aspects, dignities, yogas }) {
  const evidence = [];
  const p = chart.planets;
  const lord2 = getLordOfHouse(houseLords, 2);
  const lord11 = getLordOfHouse(houseLords, 11);
  const lord9 = getLordOfHouse(houseLords, 9);

  // 1. 2nd House and 2nd Lord (Accumulated Wealth & Capital Conservation)
  if (lord2) {
    if (["Exalted", "Own Sign", "Moolatrikona"].includes(lord2.dignity)) {
      evidence.push({
        id: "fin_2nd_lord_strong",
        domain: "finance",
        factor: `Strong 2nd Lord (${lord2.lordName} in ${lord2.dignity})`,
        effect: "positive",
        strength: 8,
        source: lord2.source,
        reason: `2nd lord (${lord2.lordName}) is strongly dignified, supporting sustained capital retention and family asset security.`
      });
    } else if (lord2.dignity === "Debilitated") {
      evidence.push({
        id: "fin_2nd_lord_debilitated",
        domain: "finance",
        factor: `2nd Lord Debilitated (${lord2.lordName})`,
        effect: "negative",
        strength: -6,
        source: lord2.source,
        reason: `2nd lord (${lord2.lordName}) is debilitated, calling for disciplined budgeting and avoiding speculative ventures.`
      });
    }

    if (lord2.placedInHouse === 11) {
      evidence.push({
        id: "fin_2nd_in_11",
        domain: "finance",
        factor: "2nd Lord in 11th House",
        effect: "positive",
        strength: 9,
        source: lord2.source,
        reason: "2nd lord placed in the 11th house creates a powerful classical Dhana link, converting earnings directly into accumulated assets."
      });
    } else if (lord2.placedInHouse === 12) {
      evidence.push({
        id: "fin_2nd_in_12",
        domain: "finance",
        factor: "2nd Lord in 12th House",
        effect: "negative",
        strength: -4,
        source: lord2.source,
        reason: "2nd lord in the 12th house indicates high outflow of capital, requiring proactive automated savings to guard against impulse expenditures."
      });
    }
  }

  // 2. 11th House and 11th Lord (Cashflow, Gains, and Network Profits)
  if (lord11) {
    if (["Exalted", "Own Sign", "Moolatrikona"].includes(lord11.dignity)) {
      evidence.push({
        id: "fin_11th_lord_strong",
        domain: "finance",
        factor: `Strong 11th Lord (${lord11.lordName})`,
        effect: "positive",
        strength: 8,
        source: lord11.source,
        reason: `11th lord (${lord11.lordName}) possesses high dignity, facilitating healthy recurring income streams and profitable network alliances.`
      });
    }

    if (lord11.placedInHouse === 2) {
      evidence.push({
        id: "fin_11th_in_2",
        domain: "finance",
        factor: "11th Lord in 2nd House",
        effect: "positive",
        strength: 9,
        source: lord11.source,
        reason: "11th lord in the 2nd house ensures that professional gains translate smoothly into tangible net worth."
      });
    }
  }

  // 3. Occupants in 11th House (Upachaya House: all natural malefics flourish here)
  const planetsIn11 = Object.entries(p).filter(([k, pl]) => pl.house === 11);
  for (const [key, planet] of planetsIn11) {
    if (["saturn", "mars", "rahu"].includes(key)) {
      evidence.push({
        id: `fin_${key}_in_11`,
        domain: "finance",
        factor: `${planet.name} in 11th House (Upachaya)`,
        effect: "positive",
        strength: 7,
        source: { planet: planet.name, house: 11, sign: planet.sign, longitude: planet.longitude },
        reason: `${planet.name} in the 11th house harnesses perseverance, strategic drive, or competitive ambition into scalable long-term financial dividends.`
      });
    } else if (key === "jupiter") {
      evidence.push({
        id: "fin_jupiter_in_11",
        domain: "finance",
        factor: "Jupiter in 11th House",
        effect: "positive",
        strength: 8,
        source: { planet: "Jupiter", house: 11, sign: planet.sign, longitude: planet.longitude },
        reason: "Jupiter in the 11th house is an auspicious placement for ethical wealth expansion, noble professional patrons, and generous financial realization."
      });
    }
  }

  // 4. Jupiter (Dhana Karaka)
  if (p.jupiter) {
    if (["Exalted", "Own Sign"].includes(dignities.jupiter?.dignity)) {
      evidence.push({
        id: "fin_jupiter_karaka_strong",
        domain: "finance",
        factor: "Jupiter (Wealth Karaka) Highly Dignified",
        effect: "positive",
        strength: 8,
        source: { planet: "Jupiter", sign: p.jupiter.sign, house: p.jupiter.house, longitude: p.jupiter.longitude },
        reason: "Jupiter, universal significator of wealth, is strongly placed, fostering financial optimism and systemic prosperity."
      });
    } else if (dignities.jupiter?.dignity === "Debilitated") {
      evidence.push({
        id: "fin_jupiter_karaka_debilitated",
        domain: "finance",
        factor: "Jupiter in Capricorn (Debilitated)",
        effect: "negative",
        strength: -5,
        source: { planet: "Jupiter", sign: p.jupiter.sign, house: p.jupiter.house, longitude: p.jupiter.longitude },
        reason: "Jupiter in Capricorn requires strict pragmatism and realistic financial assumptions, warning against overly optimistic investment models."
      });
    }
  }

  // 5. Financial Yogas
  const finYogas = yogas.filter((y) => Array.isArray(y.domain) && y.domain.includes("finance"));
  for (const y of finYogas) {
    evidence.push({
      id: `fin_${y.id}`,
      domain: "finance",
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
  evaluateFinanceRules
};
