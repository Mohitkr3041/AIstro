const Astronomy = require("astronomy-engine");
const date = new Date(Date.UTC(1995, 5, 15, 0, 0));
const time = new Astronomy.AstroTime(date);
const vec = Astronomy.GeoVector("Sun", time, true);
const ecl = Astronomy.Ecliptic(vec);
console.log(ecl);
