const sweph = require("sweph");
const { calculateNakshatra, normalizeDegrees } = require("./nakshatraCalculator");

const { constants } = sweph;

const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

// Planet definitions mapped to Swiss Ephemeris IDs
const PLANET_DEFINITIONS = [
  { key: "sun", name: "Sun", id: constants.SE_SUN, canBeRetrograde: false },
  { key: "moon", name: "Moon", id: constants.SE_MOON, canBeRetrograde: false },
  { key: "mercury", name: "Mercury", id: constants.SE_MERCURY, canBeRetrograde: true },
  { key: "venus", name: "Venus", id: constants.SE_VENUS, canBeRetrograde: true },
  { key: "mars", name: "Mars", id: constants.SE_MARS, canBeRetrograde: true },
  { key: "jupiter", name: "Jupiter", id: constants.SE_JUPITER, canBeRetrograde: true },
  { key: "saturn", name: "Saturn", id: constants.SE_SATURN, canBeRetrograde: true }
];

/**
 * Breaks down longitude within a 30-degree sign into degrees, minutes, and seconds.
 * 
 * @param {number} longitude - Total longitude in degrees (0 - 360)
 * @returns {{ sign: string, signIndex: number, degree: number, minute: number, second: number }}
 */
function toDMS(longitude) {
  const normalized = normalizeDegrees(longitude);
  const signIndex = Math.floor(normalized / 30);
  const sign = SIGNS[signIndex];
  const degInSign = normalized - (signIndex * 30);

  let degree = Math.floor(degInSign);
  let remMinutes = (degInSign - degree) * 60;
  let minute = Math.floor(remMinutes);
  let second = Math.round((remMinutes - minute) * 60);

  // Handle rounding edge case (e.g., 59.9999 seconds -> 60)
  if (second >= 60) {
    second = 0;
    minute += 1;
  }
  if (minute >= 60) {
    minute = 0;
    degree += 1;
  }

  return {
    sign,
    signIndex,
    degree,
    minute,
    second
  };
}

/**
 * Calculates sidereal planetary positions for 9 Vedic Grahas using Swiss Ephemeris.
 * 
 * @param {number} julianDayUt - Julian Day in UT (Universal Time)
 * @param {Object} [options]
 * @param {boolean} [options.useTrueNode=false] - If true, uses True Node; otherwise Mean Node (traditional Vedic)
 * @returns {Object} Dictionary of planetary positions
 */
function calculatePlanetaryPositions(julianDayUt, options = {}) {
  // Ensure Swiss Ephemeris is set to Lahiri sidereal mode
  sweph.set_sid_mode(constants.SE_SIDM_LAHIRI, 0, 0);

  const calcFlags = constants.SEFLG_SIDEREAL | constants.SEFLG_SPEED;
  const results = {};

  // 1. Calculate the 7 physical planets
  for (const def of PLANET_DEFINITIONS) {
    const calc = sweph.calc_ut(julianDayUt, def.id, calcFlags);

    if (calc.error && !calc.data) {
      throw new Error(`Swiss Ephemeris calculation failed for ${def.name}: ${calc.error}`);
    }

    const longitude = normalizeDegrees(calc.data[0]);
    const latitude = calc.data[1];
    const distance = calc.data[2];
    const speed = calc.data[3]; // Daily motion in degrees

    const dms = toDMS(longitude);
    const nakshatra = calculateNakshatra(longitude);
    const isRetrograde = def.canBeRetrograde && speed < 0;

    results[def.key] = {
      name: def.name,
      longitude: Number(longitude.toFixed(4)),
      sign: dms.sign,
      signIndex: dms.signIndex,
      degree: dms.degree,
      minute: dms.minute,
      second: dms.second,
      speed: Number(speed.toFixed(5)),
      retrograde: isRetrograde,
      latitude: Number(latitude.toFixed(4)),
      distance: Number(distance.toFixed(6)),
      nakshatra
    };
  }

  // 2. Calculate Rahu (North Node)
  const nodeConstant = options.useTrueNode ? constants.SE_TRUE_NODE : constants.SE_MEAN_NODE;
  const rahuCalc = sweph.calc_ut(julianDayUt, nodeConstant, calcFlags);

  if (rahuCalc.error && !rahuCalc.data) {
    throw new Error(`Swiss Ephemeris calculation failed for Rahu: ${rahuCalc.error}`);
  }

  const rahuLongitude = normalizeDegrees(rahuCalc.data[0]);
  const rahuSpeed = rahuCalc.data[3];
  const rahuDms = toDMS(rahuLongitude);
  const rahuNakshatra = calculateNakshatra(rahuLongitude);

  // Mean node is always retrograde (speed < 0); true node can occasionally have positive speed
  const rahuRetrograde = rahuSpeed < 0;

  results.rahu = {
    name: "Rahu",
    nodeType: options.useTrueNode ? "True Node" : "Mean Node",
    longitude: Number(rahuLongitude.toFixed(4)),
    sign: rahuDms.sign,
    signIndex: rahuDms.signIndex,
    degree: rahuDms.degree,
    minute: rahuDms.minute,
    second: rahuDms.second,
    speed: Number(rahuSpeed.toFixed(5)),
    retrograde: rahuRetrograde,
    nakshatra: rahuNakshatra
  };

  // 3. Calculate Ketu (South Node) — strictly opposite Rahu by 180 degrees
  const ketuLongitude = normalizeDegrees(rahuLongitude + 180);
  const ketuDms = toDMS(ketuLongitude);
  const ketuNakshatra = calculateNakshatra(ketuLongitude);

  results.ketu = {
    name: "Ketu",
    nodeType: options.useTrueNode ? "True Node" : "Mean Node",
    longitude: Number(ketuLongitude.toFixed(4)),
    sign: ketuDms.sign,
    signIndex: ketuDms.signIndex,
    degree: ketuDms.degree,
    minute: ketuDms.minute,
    second: ketuDms.second,
    speed: Number(rahuSpeed.toFixed(5)), // Opposite node has identical speed magnitude
    retrograde: rahuRetrograde,
    nakshatra: ketuNakshatra
  };

  return results;
}

module.exports = {
  SIGNS,
  PLANET_DEFINITIONS,
  toDMS,
  calculatePlanetaryPositions
};
