const sweph = require("sweph");
const { resolveLocation } = require("./locationService");
const { getTimezoneForCoordinates, localTimeToUtc } = require("./timezoneService");
const { calculatePlanetaryPositions, toDMS } = require("./planetaryCalculator");
const { calculateAscendantAndHouses, assignHousesToPlanets } = require("./houseCalculator");
const { normalizeDegrees } = require("./nakshatraCalculator");

const { constants } = sweph;

/**
 * Calculates a complete, deterministic Vedic Sidereal Natal Chart using Swiss Ephemeris.
 * 
 * @param {Object} params
 * @param {string} params.dob - Date of birth (YYYY-MM-DD)
 * @param {string} [params.tob="00:00"] - Time of birth (HH:mm or HH:mm:ss)
 * @param {string} [params.place] - Birthplace name
 * @param {number} [params.latitude] - Explicit latitude (-90 to 90)
 * @param {number} [params.longitude] - Explicit longitude (-180 to 180)
 * @param {string} [params.timezone] - Explicit IANA timezone (optional)
 * @param {boolean} [params.useTrueNode=false] - Whether to use True Node instead of Mean Node
 * @returns {Promise<Object>} Authoritative Vedic Natal Chart
 */
async function calculateNatalChart({
  dob,
  tob = "00:00",
  place,
  latitude,
  longitude,
  timezone,
  useTrueNode = false
}) {
  if (!dob || typeof dob !== "string") {
    const error = new Error("Date of birth (dob) is required in YYYY-MM-DD format.");
    error.code = "INVALID_DATE";
    throw error;
  }

  // 1. Resolve Location (Strictly NO fallback to Delhi)
  const location = await resolveLocation({ place, latitude, longitude });

  // 2. Resolve Timezone (Strictly NO hardcoded UTC+5:30)
  const resolvedTimezone = timezone || getTimezoneForCoordinates(location.latitude, location.longitude);

  // 3. Convert Local Time to UTC Instant (handles historical DST)
  const timeDetails = localTimeToUtc({ dob, tob, timezone: resolvedTimezone });

  // 4. Calculate Julian Day UT
  const utcYear = timeDetails.utcDate.getUTCFullYear();
  const utcMonth = timeDetails.utcDate.getUTCMonth() + 1;
  const utcDay = timeDetails.utcDate.getUTCDate();
  const utcHour = timeDetails.utcDate.getUTCHours();
  const utcMinute = timeDetails.utcDate.getUTCMinutes();
  const utcSecond = timeDetails.utcDate.getUTCSeconds() + (timeDetails.utcDate.getUTCMilliseconds() / 1000);

  const jdResult = sweph.utc_to_jd(
    utcYear,
    utcMonth,
    utcDay,
    utcHour,
    utcMinute,
    utcSecond,
    constants.SE_GREG_CAL
  );

  if (jdResult.error && !jdResult.data) {
    throw new Error(`Julian Day calculation failed: ${jdResult.error}`);
  }

  // jdResult.data[0] = Terrestrial Time (TT), jdResult.data[1] = Universal Time (UT)
  const julianDayUt = jdResult.data[1];

  // 5. Configure Swiss Ephemeris Lahiri Sidereal Ayanamsha
  sweph.set_sid_mode(constants.SE_SIDM_LAHIRI, 0, 0);
  const ayanamsaValue = sweph.get_ayanamsa_ut(julianDayUt);
  const ayanamsaDms = toDMS(ayanamsaValue);

  // 6. Calculate Ascendant and Houses
  const houseData = calculateAscendantAndHouses(
    julianDayUt,
    location.latitude,
    location.longitude
  );

  // 7. Calculate 9 Vedic Grahas (Planets + Rahu + Ketu)
  const rawPlanets = calculatePlanetaryPositions(julianDayUt, { useTrueNode });

  // 8. Assign Houses to Grahas based on Ascendant
  const planetsWithHouses = assignHousesToPlanets(rawPlanets, houseData.ascendant.signIndex);

  // 9. Moon Nakshatra Details
  const moonNakshatra = planetsWithHouses.moon.nakshatra;

  // 10. Assemble Authoritative Chart Schema
  return {
    engine: "Swiss Ephemeris 2.10.03 (sweph)",
    zodiac_system: "Vedic Sidereal (Nirayana)",
    ayanamsha: {
      name: "Lahiri (Chitrapaksha)",
      system: "SE_SIDM_LAHIRI",
      value: Number(ayanamsaValue.toFixed(6)),
      formatted: `${ayanamsaDms.degree}° ${ayanamsaDms.minute}' ${ayanamsaDms.second}"`
    },
    birthData: {
      dob,
      tob,
      resolvedPlace: location.resolvedName,
      latitude: location.latitude,
      longitude: location.longitude,
      timezone: timeDetails.ianaTimezone,
      offsetString: timeDetails.offsetString,
      offsetMinutes: timeDetails.offsetMinutes,
      utcIso: timeDetails.utcIso,
      isDst: timeDetails.isDst,
      julianDayUt: Number(julianDayUt.toFixed(6))
    },
    ascendant: houseData.ascendant,
    sun_sign: planetsWithHouses.sun.sign,
    moon_sign: planetsWithHouses.moon.sign,
    nakshatra: moonNakshatra,
    planets: planetsWithHouses,
    houses: houseData.houses
  };
}

module.exports = {
  calculateNatalChart
};
