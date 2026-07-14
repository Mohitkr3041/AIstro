const vedicCalc = require('vedic-calc');

console.log(Object.keys(vedicCalc));

try {
    const chart = vedicCalc.getKundali(new Date(Date.UTC(1995, 5, 15, 0, 0)), 28.6139, 77.2090, 5.5);
    console.log(JSON.stringify(chart).substring(0, 500));
} catch (e) {
    console.error(e);
}
