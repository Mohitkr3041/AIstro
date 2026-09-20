const sweph = require("sweph");
const { toDMS, SIGNS } = require("./planetaryCalculator");
const { calculateNakshatra, normalizeDegrees } = require("./nakshatraCalculator");

const { constants } = sweph;

/**
 * Calculates the exact Sidereal Ascendant (Lagna) and Houses using Swiss Ephemeris.
 * 
 * @param {number} julianDayUt - Julian Day in UT (Universal Time)
 * @param {number} latitude - Geographic latitude (-90 to 90)
 * @param {number} longitude - Geographic longitude (-180 to 180)
 * @returns {{
 *   ascendant: {
 *     longitude: number,
 *     sign: string,
 *     signIndex: number,
 *     degree: number,
 *     minute: number,
 *     second: number,
 *     nakshatra: Object
 *   },
 *   houses: {
 *     system: string,
 *     rashiHouses: Array<{
 *       house: number,
 *       sign: string,
 *       signIndex: number,
 *       startLongitude: number,
 *       endLongitude: number
 *     }>,
 *     sripatiCusps: Array<{
 *       house: number,
 *       cuspLongitude: number
 *     }>
 *   }
 * }}
 */
function calculateAscendantAndHouses(julianDayUt, latitude, longitude) {
  // Ensure Swiss Ephemeris is set to Lahiri sidereal mode
  sweph.set_sid_mode(constants.SE_SIDM_LAHIRI, 0, 0);

  // 1. Calculate Sidereal Ascendant using Swiss Ephemeris Whole Sign ('W')
  const wholeSignResult = sweph.houses_ex(
    julianDayUt,
    constants.SEFLG_SIDEREAL,
    latitude,
    longitude,
    "W"
  );

  if (wholeSignResult.error && !wholeSignResult.data) {
    throw new Error(`Swiss Ephemeris houses calculation failed: ${wholeSignResult.error}`);
  }

  // points[0] is SE_ASC (Ascendant)
  const ascLongitude = normalizeDegrees(wholeSignResult.data.points[0]);
  const ascDms = toDMS(ascLongitude);
  const ascNakshatra = calculateNakshatra(ascLongitude);

  const ascendant = {
    longitude: Number(ascLongitude.toFixed(4)),
    sign: ascDms.sign,
    signIndex: ascDms.signIndex,
    degree: ascDms.degree,
    minute: ascDms.minute,
    second: ascDms.second,
    nakshatra: ascNakshatra
  };

  // 2. Build 12 Vedic Whole Sign (Rashi) Houses
  // In classical Parashari Vedic astrology (D1 Rashi Chart):
  // House 1 is the ENTIRE 30-degree sign that contains the Ascendant.
  // House 2 is the entire next sign, etc.
  const rashiHouses = [];
  for (let h = 1; h <= 12; h++) {
    const signIdx = (ascDms.signIndex + (h - 1)) % 12;
    const startLon = signIdx * 30;
    const endLon = (startLon + 30) % 360;

    rashiHouses.push({
      house: h,
      sign: SIGNS[signIdx],
      signIndex: signIdx,
      startLongitude: startLon,
      endLongitude: endLon
    });
  }

  // 3. Calculate Sripati (Bhava Chalit) cusps for Vedic Bhava analysis
  let sripatiCusps = [];
  try {
    const sripatiResult = sweph.houses_ex(
      julianDayUt,
      constants.SEFLG_SIDEREAL,
      latitude,
      longitude,
      "S"
    );

    if (sripatiResult.data && Array.isArray(sripatiResult.data.houses)) {
      sripatiCusps = sripatiResult.data.houses.map((cusp, idx) => ({
        house: idx + 1,
        cuspLongitude: Number(normalizeDegrees(cusp).toFixed(4))
      }));
    }
  } catch (err) {
    // Sripati calculation error should not abort the chart calculation
    console.warn("Sripati houses calculation warning:", err.message);
  }

  return {
    ascendant,
    houses: {
      system: "Whole Sign (Vedic Rashi)",
      rashiHouses,
      sripatiCusps
    }
  };
}

/**
 * Assigns whole sign house numbers (1 - 12) to planets based on the Ascendant sign.
 * 
 * @param {Object} planets - Dictionary of calculated planets
 * @param {number} ascendantSignIndex - Index of the Ascendant sign (0 - 11)
 * @returns {Object} Planets enriched with house number
 */
function assignHousesToPlanets(planets, ascendantSignIndex) {
  const enriched = {};

  for (const [key, planet] of Object.entries(planets)) {
    const houseNumber = ((planet.signIndex - ascendantSignIndex + 12) % 12) + 1;
    enriched[key] = {
      ...planet,
      house: houseNumber
    };
  }

  return enriched;
}

module.exports = {
  calculateAscendantAndHouses,
  assignHousesToPlanets
};
