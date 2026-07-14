const Astronomy = require('astronomy-engine');

const date = new Date(Date.UTC(1995, 5, 15, 0, 0)); // June 15, 1995
const time = new Astronomy.AstroTime(date);

const getPlanetLongitude = (body) => {
    // get ecliptic longitude
    const vec = Astronomy.GeoVector(body, time, true);
    const ecl = Astronomy.EquatorFromVector(vec); // actually gives RA/Dec but let's try direct Ecliptic
    
    // Better: Astronomy.EclipticLongitude(body, time) might exist, wait
    const lonLat = Astronomy.Ecliptic(vec); 
    
    return lonLat.elon || 0; 
};

try {
    const sun = getPlanetLongitude('Sun');
    const moon = getPlanetLongitude('Moon');
    
    console.log({
        sun,
        moon
    });
} catch (e) {
    console.error(e);
}
