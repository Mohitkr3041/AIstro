const { SIGN_RULERS, evaluateDignity } = require("./dignityRules");

/**
 * Calculates and evaluates house lords for all 12 houses based on the chart.
 * 
 * @param {Object} chart - Phase 1 chart object
 * @returns {Array<Object>} Analysis of all 12 house lords
 */
function analyzeHouseLords(chart) {
  const houseLords = [];
  const rashiHouses = chart.houses.rashiHouses;

  for (const h of rashiHouses) {
    const houseNum = h.house;
    const sign = h.sign;
    const lordKey = SIGN_RULERS[sign];

    if (!lordKey) continue;

    const lordData = chart.planets[lordKey];
    if (!lordData) continue;

    const dignity = evaluateDignity(lordKey, lordData);

    const houseClassification = getHouseClassification(lordData.house);

    houseLords.push({
      house: houseNum,
      sign,
      lord: lordKey,
      lordName: lordData.name,
      placedInHouse: lordData.house,
      placedInSign: lordData.sign,
      degree: lordData.degree,
      retrograde: lordData.retrograde,
      dignity: dignity.dignity,
      dignityStrength: dignity.strength,
      houseClassification,
      source: {
        house: houseNum,
        sign,
        lord: lordData.name,
        placedInHouse: lordData.house,
        placedInSign: lordData.sign,
        longitude: lordData.longitude
      }
    });
  }

  return houseLords;
}

/**
 * Classifies Vedic houses into Kendra, Trikona, Dusthana, Upachaya, etc.
 * 
 * @param {number} house 
 * @returns {{ isKendra: boolean, isTrikona: boolean, isDusthana: boolean, isUpachaya: boolean, isMaraka: boolean }}
 */
function getHouseClassification(house) {
  return {
    isKendra: [1, 4, 7, 10].includes(house),
    isTrikona: [1, 5, 9].includes(house),
    isDusthana: [6, 8, 12].includes(house),
    isUpachaya: [3, 6, 10, 11].includes(house),
    isMaraka: [2, 7].includes(house)
  };
}

/**
 * Convenience helper to get a specific house lord.
 * 
 * @param {Array<Object>} houseLords - Result of analyzeHouseLords
 * @param {number} houseNumber - 1 to 12
 * @returns {Object|null}
 */
function getLordOfHouse(houseLords, houseNumber) {
  return houseLords.find((hl) => hl.house === houseNumber) || null;
}

module.exports = {
  analyzeHouseLords,
  getHouseClassification,
  getLordOfHouse
};
