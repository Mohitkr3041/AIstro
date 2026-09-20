/**
 * 27 Vedic Nakshatras and their Vimshottari planetary lords.
 * Total span of Zodiac: 360 degrees.
 * Span of each Nakshatra: 360 / 27 = 13° 20' = 13.333333...° = 800 arcminutes.
 * Span of each Pada (quarter): 800 / 4 = 200 arcminutes = 3° 20' = 3.333333...°.
 */

const NAKSHATRAS = [
  { name: "Ashwini", lord: "Ketu" },
  { name: "Bharani", lord: "Venus" },
  { name: "Krittika", lord: "Sun" },
  { name: "Rohini", lord: "Moon" },
  { name: "Mrigashira", lord: "Mars" },
  { name: "Ardra", lord: "Rahu" },
  { name: "Punarvasu", lord: "Jupiter" },
  { name: "Pushya", lord: "Saturn" },
  { name: "Ashlesha", lord: "Mercury" },
  { name: "Magha", lord: "Ketu" },
  { name: "Purva Phalguni", lord: "Venus" },
  { name: "Uttara Phalguni", lord: "Sun" },
  { name: "Hasta", lord: "Moon" },
  { name: "Chitra", lord: "Mars" },
  { name: "Swati", lord: "Rahu" },
  { name: "Vishakha", lord: "Jupiter" },
  { name: "Anuradha", lord: "Saturn" },
  { name: "Jyeshtha", lord: "Mercury" },
  { name: "Mula", lord: "Ketu" },
  { name: "Purva Ashadha", lord: "Venus" },
  { name: "Uttara Ashadha", lord: "Sun" },
  { name: "Shravana", lord: "Moon" },
  { name: "Dhanishta", lord: "Mars" },
  { name: "Shatabhisha", lord: "Rahu" },
  { name: "Purva Bhadrapada", lord: "Jupiter" },
  { name: "Uttara Bhadrapada", lord: "Saturn" },
  { name: "Revati", lord: "Mercury" }
];

const NAKSHATRA_SPAN_MINUTES = 800; // 13 degrees 20 minutes = 800'
const PADA_SPAN_MINUTES = 200;      // 3 degrees 20 minutes = 200'

/**
 * Normalizes any angle in degrees to the [0, 360) range.
 * 
 * @param {number} degrees 
 * @returns {number}
 */
function normalizeDegrees(degrees) {
  return ((degrees % 360) + 360) % 360;
}

/**
 * Calculates Nakshatra, Pada, degrees within Nakshatra, and Nakshatra Lord
 * for any given sidereal longitude.
 * 
 * @param {number} longitude - Sidereal longitude in degrees (0 - 360)
 * @returns {{
 *   name: string,
 *   index: number,
 *   number: number,
 *   pada: number,
 *   degreesWithin: number,
 *   remainingDegrees: number,
 *   percentageElapsed: number,
 *   lord: string
 * }}
 */
function calculateNakshatra(longitude) {
  if (typeof longitude !== "number" || isNaN(longitude)) {
    throw new Error(`Invalid longitude provided for nakshatra calculation: ${longitude}`);
  }

  const normalized = normalizeDegrees(longitude);
  const totalArcMinutes = normalized * 60;

  // Nakshatra index: 0 to 26
  let nakshatraIndex = Math.floor(totalArcMinutes / NAKSHATRA_SPAN_MINUTES);
  if (nakshatraIndex >= 27) {
    nakshatraIndex = 26;
  }

  const arcMinutesInNakshatra = totalArcMinutes - (nakshatraIndex * NAKSHATRA_SPAN_MINUTES);

  // Pada index: 1 to 4
  let pada = Math.floor(arcMinutesInNakshatra / PADA_SPAN_MINUTES) + 1;
  if (pada > 4) {
    pada = 4;
  }

  const degreesWithin = arcMinutesInNakshatra / 60;
  const remainingDegrees = (NAKSHATRA_SPAN_MINUTES - arcMinutesInNakshatra) / 60;
  const percentageElapsed = (arcMinutesInNakshatra / NAKSHATRA_SPAN_MINUTES) * 100;

  const nakshatraInfo = NAKSHATRAS[nakshatraIndex];

  return {
    name: nakshatraInfo.name,
    index: nakshatraIndex,
    number: nakshatraIndex + 1,
    pada,
    degreesWithin: Number(degreesWithin.toFixed(4)),
    remainingDegrees: Number(remainingDegrees.toFixed(4)),
    percentageElapsed: Number(percentageElapsed.toFixed(2)),
    lord: nakshatraInfo.lord
  };
}

module.exports = {
  NAKSHATRAS,
  normalizeDegrees,
  calculateNakshatra
};
