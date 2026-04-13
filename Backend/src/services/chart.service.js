const SIGNS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

const NAKSHATRAS = [
  "Ashwini",
  "Bharani",
  "Krittika",
  "Rohini",
  "Mrigashira",
  "Ardra",
  "Punarvasu",
  "Pushya",
  "Ashlesha",
  "Magha",
  "Purva Phalguni",
  "Uttara Phalguni",
  "Hasta",
  "Chitra",
  "Swati",
  "Vishakha",
  "Anuradha",
  "Jyeshtha",
  "Mula",
  "Purva Ashadha",
  "Uttara Ashadha",
  "Shravana",
  "Dhanishta",
  "Shatabhisha",
  "Purva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati",
];

const normalizeDegrees = (degrees) => ((degrees % 360) + 360) % 360;
const toRadians = (degrees) => (degrees * Math.PI) / 180;

const getJulianDay = (date) => date.getTime() / 86400000 + 2440587.5;

const getSign = (longitude) => SIGNS[Math.floor(normalizeDegrees(longitude) / 30)];

const getNakshatra = (longitude) => {
  const segment = 360 / 27;
  return NAKSHATRAS[Math.floor(normalizeDegrees(longitude) / segment)];
};

const getLahiriAyanamsa = (julianDay) => {
  const tropicalYear = 365.2425;
  const yearsSinceJ2000 = (julianDay - 2451545.0) / tropicalYear;

  return 23.85675 + 0.013968 * yearsSinceJ2000;
};

const getSunLongitude = (julianDay) => {
  const daysSinceJ2000 = julianDay - 2451545.0;
  const meanLongitude = normalizeDegrees(280.46646 + 0.98564736 * daysSinceJ2000);
  const meanAnomaly = normalizeDegrees(357.52911 + 0.98560028 * daysSinceJ2000);

  const equationOfCenter =
    1.914602 * Math.sin(toRadians(meanAnomaly)) +
    0.019993 * Math.sin(toRadians(2 * meanAnomaly)) +
    0.000289 * Math.sin(toRadians(3 * meanAnomaly));

  return normalizeDegrees(meanLongitude + equationOfCenter);
};

const getMoonLongitude = (julianDay) => {
  const daysSinceJ2000 = julianDay - 2451545.0;
  const meanLongitude = normalizeDegrees(218.316 + 13.176396 * daysSinceJ2000);
  const meanAnomaly = normalizeDegrees(134.963 + 13.064993 * daysSinceJ2000);
  const sunMeanAnomaly = normalizeDegrees(357.529 + 0.98560028 * daysSinceJ2000);
  const elongation = normalizeDegrees(297.85 + 12.190749 * daysSinceJ2000);
  const argumentOfLatitude = normalizeDegrees(93.272 + 13.22935 * daysSinceJ2000);

  return normalizeDegrees(
    meanLongitude +
      6.289 * Math.sin(toRadians(meanAnomaly)) +
      1.274 * Math.sin(toRadians(2 * elongation - meanAnomaly)) +
      0.658 * Math.sin(toRadians(2 * elongation)) +
      0.214 * Math.sin(toRadians(2 * meanAnomaly)) -
      0.186 * Math.sin(toRadians(sunMeanAnomaly)) -
      0.114 * Math.sin(toRadians(2 * argumentOfLatitude))
  );
};

const getTimezoneOffsetMinutes = (place = "") => {
  const normalizedPlace = place.toLowerCase();

  if (normalizedPlace.includes("india") || normalizedPlace.includes("jharkhand")) {
    return 330;
  }

  return 330;
};

const getBirthDateUtc = ({ dob, tob, place }) => {
  const [year, month, day] = dob.split("-").map(Number);
  const [hours = 0, minutes = 0] = (tob || "00:00").split(":").map(Number);
  const timezoneOffsetMinutes = getTimezoneOffsetMinutes(place);

  return new Date(Date.UTC(year, month - 1, day, hours, minutes) - timezoneOffsetMinutes * 60000);
};

const calculateVedicChart = ({ dob, tob, place }) => {
  const birthDateUtc = getBirthDateUtc({ dob, tob, place });
  const julianDay = getJulianDay(birthDateUtc);
  const ayanamsa = getLahiriAyanamsa(julianDay);
  const tropicalSunLongitude = getSunLongitude(julianDay);
  const tropicalMoonLongitude = getMoonLongitude(julianDay);
  const siderealSunLongitude = normalizeDegrees(tropicalSunLongitude - ayanamsa);
  const siderealMoonLongitude = normalizeDegrees(tropicalMoonLongitude - ayanamsa);

  return {
    zodiac_system: "Vedic sidereal",
    ayanamsa: "Lahiri",
    timezone_assumption: "Asia/Kolkata (UTC+05:30)",
    sun_sign: getSign(siderealSunLongitude),
    moon_sign: getSign(siderealMoonLongitude),
    moon_nakshatra: getNakshatra(siderealMoonLongitude),
    sidereal_sun_longitude: Number(siderealSunLongitude.toFixed(2)),
    sidereal_moon_longitude: Number(siderealMoonLongitude.toFixed(2)),
  };
};

module.exports = { calculateVedicChart };
