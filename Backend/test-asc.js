const Astronomy = require("astronomy-engine");
const axios = require("axios");

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
    // Default to Delhi if not found
    return { lat: 28.6139, lon: 77.2090 };
};

const calculateAscendant = (time, lat, lon) => {
    // GAST in hours
    const gast = Astronomy.SiderealTime(time);
    
    // LST in hours
    let lstHours = gast + (lon / 15);
    lstHours = ((lstHours % 24) + 24) % 24;
    
    // RAMC (Right Ascension of the Midheaven) in degrees
    const ramc = lstHours * 15;
    
    const rad = Math.PI / 180;
    const e = 23.4392911; // Obliquity of ecliptic
    
    const y = Math.cos(ramc * rad);
    const x = - (Math.sin(ramc * rad) * Math.cos(e * rad) + Math.tan(lat * rad) * Math.sin(e * rad));
    
    let asc = Math.atan2(y, x) / rad;
    asc = ((asc % 360) + 360) % 360;
    return asc;
};

const run = async () => {
    const coords = await getCoordinates("New York, USA");
    console.log("Coords:", coords);
    
    const date = new Date(Date.UTC(1995, 5, 15, 14, 30)); // some time
    const time = new Astronomy.AstroTime(date);
    
    const tropicalAsc = calculateAscendant(time, coords.lat, coords.lon);
    
    // Ayanamsa
    const julianDay = time.jd;
    const tropicalYear = 365.2425;
    const yearsSinceJ2000 = (julianDay - 2451545.0) / tropicalYear;
    const ayanamsa = 23.85675 + 0.013968 * yearsSinceJ2000;
    
    const siderealAsc = ((tropicalAsc - ayanamsa % 360) + 360) % 360;
    
    const SIGNS = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
    const sign = SIGNS[Math.floor(siderealAsc / 30)];
    
    console.log("Tropical Ascendant:", tropicalAsc);
    console.log("Sidereal Ascendant:", siderealAsc, "Sign:", sign);
};

run();
