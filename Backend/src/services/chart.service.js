const Astronomy = require("astronomy-engine");

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
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
  "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

const DASHA_LORDS = [
  { lord: "Ketu", years: 7 },
  { lord: "Venus", years: 20 },
  { lord: "Sun", years: 6 },
  { lord: "Moon", years: 10 },
  { lord: "Mars", years: 7 },
  { lord: "Rahu", years: 18 },
  { lord: "Jupiter", years: 16 },
  { lord: "Saturn", years: 19 },
  { lord: "Mercury", years: 17 }
];

const normalizeDegrees = (degrees) => ((degrees % 360) + 360) % 360;

const getSign = (longitude) => SIGNS[Math.floor(normalizeDegrees(longitude) / 30)];

const getNakshatra = (longitude) => {
  const segment = 360 / 27; // 13.3333 degrees
  return {
    name: NAKSHATRAS[Math.floor(normalizeDegrees(longitude) / segment)],
    index: Math.floor(normalizeDegrees(longitude) / segment),
    degreeLeft: (segment - (normalizeDegrees(longitude) % segment)) / segment // Percentage of nakshatra remaining
  };
};

const getLahiriAyanamsa = (julianDay) => {
  const tropicalYear = 365.2425;
  const yearsSinceJ2000 = (julianDay - 2451545.0) / tropicalYear;
  return 23.85675 + 0.013968 * yearsSinceJ2000;
};

const getTimezoneOffsetMinutes = (place = "") => {
  const normalizedPlace = place.toLowerCase();
  if (normalizedPlace.includes("india") || normalizedPlace.includes("jharkhand")) {
    return 330; // UTC+5:30
  }
  return 330; // Defaulting to IST for now
};

const getBirthDateUtc = ({ dob, tob, place }) => {
  const [year, month, day] = dob.split("-").map(Number);
  const [hours = 0, minutes = 0] = (tob || "00:00").split(":").map(Number);
  const timezoneOffsetMinutes = getTimezoneOffsetMinutes(place);
  return new Date(Date.UTC(year, month - 1, day, hours, minutes) - timezoneOffsetMinutes * 60000);
};

const getPlanetLongitude = (body, time) => {
  const vec = Astronomy.GeoVector(body, time, true);
  const lonLat = Astronomy.Ecliptic(vec);
  return normalizeDegrees(lonLat.elon);
};

const calculateCurrentDasha = (birthDateUtc, moonNakshatraIndex, degreeLeft) => {
  // Finding starting dasha
  let dashaIndex = moonNakshatraIndex % 9;
  let startingDasha = DASHA_LORDS[dashaIndex];
  
  // Balance of dasha at birth in years
  let balanceYears = startingDasha.years * degreeLeft;
  
  let currentAge = (Date.now() - birthDateUtc.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  
  if (currentAge < balanceYears) {
    return startingDasha.lord;
  }
  
  let accumulatedYears = balanceYears;
  let currentIndex = (dashaIndex + 1) % 9;
  
  while (accumulatedYears < currentAge && accumulatedYears < 120) {
    let lordYears = DASHA_LORDS[currentIndex].years;
    if (accumulatedYears + lordYears > currentAge) {
      return DASHA_LORDS[currentIndex].lord;
    }
    accumulatedYears += lordYears;
    currentIndex = (currentIndex + 1) % 9;
  }
  
  return DASHA_LORDS[currentIndex].lord; // fallback
};

const calculateVedicChart = ({ dob, tob, place }) => {
  const birthDateUtc = getBirthDateUtc({ dob, tob, place });
  const time = new Astronomy.AstroTime(birthDateUtc);
  
  // Julian Day for Ayanamsa
  const julianDay = time.jd;
  const ayanamsa = getLahiriAyanamsa(julianDay);
  
  const planets = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn"];
  const siderealPositions = {};
  
  planets.forEach(planet => {
    const tropicalLong = getPlanetLongitude(planet, time);
    const siderealLong = normalizeDegrees(tropicalLong - ayanamsa);
    
    siderealPositions[planet.toLowerCase()] = {
      longitude: Number(siderealLong.toFixed(2)),
      sign: getSign(siderealLong)
    };
  });
  
  const moonSidereal = siderealPositions.moon.longitude;
  const nakshatraData = getNakshatra(moonSidereal);
  
  // Approximate Rahu/Ketu
  // Lunar nodes move approx 19.34 degrees per year backwards
  // Precise calculation requires more complex algorithms, but we can do a basic approximation or omit them for now.
  // We'll skip Rahu/Ketu in the basic planets for now, as Astronomy Engine handles main bodies perfectly.
  
  // Calculate Dasha
  const currentMahadasha = calculateCurrentDasha(birthDateUtc, nakshatraData.index, nakshatraData.degreeLeft);

  return {
    zodiac_system: "Vedic sidereal",
    ayanamsa: "Lahiri",
    timezone_assumption: "Asia/Kolkata (UTC+05:30)",
    sun_sign: siderealPositions.sun.sign,
    moon_sign: siderealPositions.moon.sign,
    moon_nakshatra: nakshatraData.name,
    current_mahadasha: currentMahadasha,
    planets: siderealPositions
  };
};

module.exports = { calculateVedicChart };
