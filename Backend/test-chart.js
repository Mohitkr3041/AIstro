const { calculateVedicChart } = require('./src/services/chart.service');

const run = async () => {
    try {
        const chart = await calculateVedicChart({
            name: "Test",
            dob: "1995-06-15",
            tob: "14:30",
            place: "New York, USA"
        });
        console.log(JSON.stringify(chart, null, 2));
    } catch (e) {
        console.error("Error:", e);
    }
};

run();
