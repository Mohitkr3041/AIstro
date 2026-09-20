/**
 * Classical Vedic Dignity Rules (Naisargika Dignity Engine)
 * Defines exaltation, debilitation, own signs, moolatrikona ranges, and natural friendship matrices.
 */

const DIGNITY_TABLE = {
  sun: {
    name: "Sun",
    exalted: { sign: "Aries", signIndex: 0 },
    debilitated: { sign: "Libra", signIndex: 6 },
    ownSigns: ["Leo"],
    moolatrikona: { sign: "Leo", minDegree: 0, maxDegree: 20 },
    friends: ["moon", "mars", "jupiter"],
    enemies: ["venus", "saturn"],
    neutrals: ["mercury"]
  },
  moon: {
    name: "Moon",
    exalted: { sign: "Taurus", signIndex: 1 },
    debilitated: { sign: "Scorpio", signIndex: 7 },
    ownSigns: ["Cancer"],
    moolatrikona: { sign: "Taurus", minDegree: 4, maxDegree: 20 },
    friends: ["sun", "mercury"],
    enemies: [],
    neutrals: ["mars", "jupiter", "venus", "saturn"]
  },
  mars: {
    name: "Mars",
    exalted: { sign: "Capricorn", signIndex: 9 },
    debilitated: { sign: "Cancer", signIndex: 3 },
    ownSigns: ["Aries", "Scorpio"],
    moolatrikona: { sign: "Aries", minDegree: 0, maxDegree: 12 },
    friends: ["sun", "moon", "jupiter"],
    enemies: ["mercury"],
    neutrals: ["venus", "saturn"]
  },
  mercury: {
    name: "Mercury",
    exalted: { sign: "Virgo", signIndex: 5 },
    debilitated: { sign: "Pisces", signIndex: 11 },
    ownSigns: ["Gemini", "Virgo"],
    moolatrikona: { sign: "Virgo", minDegree: 16, maxDegree: 20 },
    friends: ["sun", "venus"],
    enemies: ["moon"],
    neutrals: ["mars", "jupiter", "saturn"]
  },
  jupiter: {
    name: "Jupiter",
    exalted: { sign: "Cancer", signIndex: 3 },
    debilitated: { sign: "Capricorn", signIndex: 9 },
    ownSigns: ["Sagittarius", "Pisces"],
    moolatrikona: { sign: "Sagittarius", minDegree: 0, maxDegree: 10 },
    friends: ["sun", "moon", "mars"],
    enemies: ["mercury", "venus"],
    neutrals: ["saturn"]
  },
  venus: {
    name: "Venus",
    exalted: { sign: "Pisces", signIndex: 11 },
    debilitated: { sign: "Virgo", signIndex: 5 },
    ownSigns: ["Taurus", "Libra"],
    moolatrikona: { sign: "Libra", minDegree: 0, maxDegree: 15 },
    friends: ["mercury", "saturn"],
    enemies: ["sun", "moon"],
    neutrals: ["mars", "jupiter"]
  },
  saturn: {
    name: "Saturn",
    exalted: { sign: "Libra", signIndex: 6 },
    debilitated: { sign: "Aries", signIndex: 0 },
    ownSigns: ["Capricorn", "Aquarius"],
    moolatrikona: { sign: "Aquarius", minDegree: 0, maxDegree: 20 },
    friends: ["mercury", "venus"],
    enemies: ["sun", "moon", "mars"],
    neutrals: ["jupiter"]
  },
  rahu: {
    name: "Rahu",
    exalted: { sign: "Taurus", signIndex: 1 },
    debilitated: { sign: "Scorpio", signIndex: 7 },
    ownSigns: ["Aquarius"],
    friends: ["mercury", "venus", "saturn"],
    enemies: ["sun", "moon", "mars"],
    neutrals: ["jupiter"]
  },
  ketu: {
    name: "Ketu",
    exalted: { sign: "Scorpio", signIndex: 7 },
    debilitated: { sign: "Taurus", signIndex: 1 },
    ownSigns: ["Scorpio"],
    friends: ["mars", "venus", "saturn"],
    enemies: ["sun", "moon"],
    neutrals: ["mercury", "jupiter"]
  }
};

const SIGN_RULERS = {
  Aries: "mars",
  Taurus: "venus",
  Gemini: "mercury",
  Cancer: "moon",
  Leo: "sun",
  Virgo: "mercury",
  Libra: "venus",
  Scorpio: "mars",
  Sagittarius: "jupiter",
  Capricorn: "saturn",
  Aquarius: "saturn",
  Pisces: "jupiter"
};

/**
 * Evaluates the Vedic dignity of a planet given its position and sign.
 * 
 * @param {string} planetKey - Planet key (sun, moon, mars, etc.)
 * @param {Object} planetData - Phase 1 planet object
 * @returns {{
 *   dignity: string,
 *   strength: number,
 *   reason: string
 * }}
 */
function evaluateDignity(planetKey, planetData) {
  const key = planetKey.toLowerCase();
  const rule = DIGNITY_TABLE[key];
  if (!rule) {
    return { dignity: "Neutral", strength: 0, reason: "No dignity rule for " + planetKey };
  }

  const sign = planetData.sign;
  const degree = planetData.degree || 0;

  // 1. Check Exaltation
  if (rule.exalted && rule.exalted.sign === sign) {
    return {
      dignity: "Exalted",
      strength: 10,
      reason: `${rule.name} is exalted in ${sign}, its point of highest vitality and expression.`
    };
  }

  // 2. Check Debilitation
  if (rule.debilitated && rule.debilitated.sign === sign) {
    return {
      dignity: "Debilitated",
      strength: -8,
      reason: `${rule.name} is debilitated in ${sign}, requiring extra conscious effort and supportive yogas.`
    };
  }

  // 3. Check Moolatrikona
  if (rule.moolatrikona && rule.moolatrikona.sign === sign) {
    if (degree >= rule.moolatrikona.minDegree && degree <= rule.moolatrikona.maxDegree) {
      return {
        dignity: "Moolatrikona",
        strength: 8,
        reason: `${rule.name} is in its Moolatrikona zone (${rule.moolatrikona.minDegree}°-${rule.moolatrikona.maxDegree}° of ${sign}), operating with authoritative purpose.`
      };
    }
  }

  // 4. Check Own Sign
  if (rule.ownSigns && rule.ownSigns.includes(sign)) {
    return {
      dignity: "Own Sign",
      strength: 7,
      reason: `${rule.name} is placed in its own sign of ${sign}, providing stability and natural sovereignty.`
    };
  }

  // 5. Relationship with Sign Ruler
  const signRulerKey = SIGN_RULERS[sign];
  if (!signRulerKey) {
    return { dignity: "Neutral", strength: 0, reason: `${rule.name} is in ${sign}.` };
  }

  if (rule.friends.includes(signRulerKey)) {
    return {
      dignity: "Friend",
      strength: 4,
      reason: `${rule.name} is in a friendly sign (${sign}, ruled by ${signRulerKey}).`
    };
  }

  if (rule.enemies.includes(signRulerKey)) {
    return {
      dignity: "Enemy",
      strength: -4,
      reason: `${rule.name} is in an inimical sign (${sign}, ruled by ${signRulerKey}).`
    };
  }

  return {
    dignity: "Neutral",
    strength: 0,
    reason: `${rule.name} is in a neutral sign (${sign}, ruled by ${signRulerKey}).`
  };
}

module.exports = {
  DIGNITY_TABLE,
  SIGN_RULERS,
  evaluateDignity
};
