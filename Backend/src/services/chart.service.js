const Astronomy = require("astronomy-engine");
const axios = require("axios");

const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", 
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
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

const getSignIndex = (longitude) => Math.floor(normalizeDegrees(longitude) / 30);
const getSign = (longitude) => SIGNS[getSignIndex(longitude)];

const getNakshatra = (longitude) => {
  const segment = 360 / 27; // 13.3333 degrees
  return {
    name: NAKSHATRAS[Math.floor(normalizeDegrees(longitude) / segment)],
    index: Math.floor(normalizeDegrees(longitude) / segment),
    degreeLeft: (segment - (normalizeDegrees(longitude) % segment)) / segment
  };
};

const getLahiriAyanamsa = (julianDay) => {
  const tropicalYear = 365.2425;
  const yearsSinceJ2000 = (julianDay - 2451545.0) / tropicalYear;
  return 23.85675 + 0.013968 * yearsSinceJ2000;
};

const getCoordinates = async (place) => {
  try {
      const res = await axios.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1`, {
          headers: { 'User-Agent': 'AIstro/1.0' }
      });
      if (res.data && res.data.length > 0) {
          return { lat: parseFloat(res.data[0].lat), lon: parseFloat(res.data[0].lon) };
      }
  } catch (e) {
      console.error("Geocoding failed:", e.message);
  }
  return { lat: 28.6139, lon: 77.2090 }; // Default to Delhi
};

const calculateAscendant = (time, lat, lon) => {
  const gast = Astronomy.SiderealTime(time);
  let lstHours = gast + (lon / 15);
  lstHours = ((lstHours % 24) + 24) % 24;
  const ramc = lstHours * 15;
  
  const rad = Math.PI / 180;
  const e = 23.4392911; 
  
  const y = Math.cos(ramc * rad);
  const x = - (Math.sin(ramc * rad) * Math.cos(e * rad) + Math.tan(lat * rad) * Math.sin(e * rad));
  
  let asc = Math.atan2(y, x) / rad;
  asc = ((asc % 360) + 360) % 360;
  return asc;
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

const getPlanetLongitude = (body, time) => {
  const vec = Astronomy.GeoVector(body, time, true);
  const lonLat = Astronomy.Ecliptic(vec);
  return normalizeDegrees(lonLat.elon);
};

const calculateDasha = (birthDateUtc, moonNakshatraIndex, degreeLeft) => {
  let dashaIndex = moonNakshatraIndex % 9;
  let startingDasha = DASHA_LORDS[dashaIndex];
  let balanceYears = startingDasha.years * degreeLeft;
  let currentAge = (Date.now() - birthDateUtc.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  
  let accumulatedYears = 0;
  let currentIndex = dashaIndex;
  
  // Find Mahadasha
  if (currentAge < balanceYears) {
      accumulatedYears = 0;
      // time passed in current mahadasha
      let passedInMahadasha = currentAge; 
      return findAntardasha(startingDasha, passedInMahadasha, currentIndex);
  }
  
  accumulatedYears = balanceYears;
  currentIndex = (currentIndex + 1) % 9;
  
  while (accumulatedYears < currentAge && accumulatedYears < 120) {
    let lordYears = DASHA_LORDS[currentIndex].years;
    if (accumulatedYears + lordYears > currentAge) {
      let passedInMahadasha = currentAge - accumulatedYears;
      return findAntardasha(DASHA_LORDS[currentIndex], passedInMahadasha, currentIndex);
    }
    accumulatedYears += lordYears;
    currentIndex = (currentIndex + 1) % 9;
  }
  
  return { mahadasha: DASHA_LORDS[currentIndex].lord, antardasha: DASHA_LORDS[currentIndex].lord };
};

const findAntardasha = (mahadashaLord, yearsPassed, mahaIndex) => {
    let adAccumulated = 0;
    let adIndex = mahaIndex; // Antardasha sequence starts from the Mahadasha lord
    
    for (let i = 0; i < 9; i++) {
        let adLord = DASHA_LORDS[adIndex];
        let adYears = (mahadashaLord.years * adLord.years) / 120; // Proportional length
        
        if (adAccumulated + adYears > yearsPassed) {
            return {
                mahadasha: mahadashaLord.lord,
                antardasha: adLord.lord
            };
        }
        adAccumulated += adYears;
        adIndex = (adIndex + 1) % 9;
    }
    
    return { mahadasha: mahadashaLord.lord, antardasha: mahadashaLord.lord };
};

const getHouse = (planetSignIndex, ascendantSignIndex) => {
    return ((planetSignIndex - ascendantSignIndex + 12) % 12) + 1;
};

const calculatePositionsForTime = (time, ayanamsa, ascendantSignIndex) => {
    const planets = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn"];
    const siderealPositions = {};
    
    planets.forEach(planet => {
      const tropicalLong = getPlanetLongitude(planet, time);
      const siderealLong = normalizeDegrees(tropicalLong - ayanamsa);
      const signIndex = getSignIndex(siderealLong);
      
      siderealPositions[planet.toLowerCase()] = {
        longitude: Number(siderealLong.toFixed(2)),
        sign: SIGNS[signIndex],
        house: ascendantSignIndex !== null ? getHouse(signIndex, ascendantSignIndex) : null
      };
    });
    
    return siderealPositions;
};

const calculateVedicChart = async ({ dob, tob, place }) => {
  const birthDateUtc = getBirthDateUtc({ dob, tob, place });
  const time = new Astronomy.AstroTime(birthDateUtc);
  const julianDay = time.jd;
  const ayanamsa = getLahiriAyanamsa(julianDay);
  
  // Geocode and Ascendant
  const coords = await getCoordinates(place);
  const tropicalAsc = calculateAscendant(time, coords.lat, coords.lon);
  const siderealAsc = normalizeDegrees(tropicalAsc - ayanamsa);
  const ascendantSignIndex = getSignIndex(siderealAsc);
  
  const siderealPositions = calculatePositionsForTime(time, ayanamsa, ascendantSignIndex);
  
  const moonSidereal = siderealPositions.moon.longitude;
  const nakshatraData = getNakshatra(moonSidereal);
  const dasha = calculateDasha(birthDateUtc, nakshatraData.index, nakshatraData.degreeLeft);

  // Calculate Transits
  const nowTime = new Astronomy.AstroTime(new Date());
  const nowJulian = nowTime.jd;
  const nowAyanamsa = getLahiriAyanamsa(nowJulian);
  // House placements of transits are relative to the natal Ascendant
  const transits = calculatePositionsForTime(nowTime, nowAyanamsa, ascendantSignIndex);

  return {
    zodiac_system: "Vedic sidereal",
    ayanamsa: "Lahiri",
    timezone_assumption: "Asia/Kolkata (UTC+05:30)",
    ascendant: {
        sign: SIGNS[ascendantSignIndex],
        longitude: Number(siderealAsc.toFixed(2))
    },
    sun_sign: siderealPositions.sun.sign,
    moon_sign: siderealPositions.moon.sign,
    moon_nakshatra: nakshatraData.name,
    dasha: dasha,
    planets: siderealPositions,
    current_transits: transits
  };
};

module.exports = { calculateVedicChart };
