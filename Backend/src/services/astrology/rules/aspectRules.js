/**
 * Classical Parashari Aspect Engine (Drishti Engine)
 * Implements 7th house aspect for all planets, plus special Parashari aspects for Mars, Jupiter, and Saturn.
 */

const NATURAL_BENEFICS = ["jupiter", "venus", "moon", "mercury"];
const NATURAL_MALEFICS = ["saturn", "mars", "rahu", "ketu", "sun"];

/**
 * Calculates all Parashari aspects between planets and houses.
 * 
 * @param {Object} chart - Phase 1 chart object
 * @param {Object} [options] - Aspect calculation options
 * @param {boolean} [options.includeNodeAspects=true] - Whether Rahu/Ketu receive 5th and 9th special aspects
 * @returns {Array<Object>} List of structured aspect records
 */
function calculateAspects(chart, options = {}) {
  const aspects = [];
  const planets = chart.planets;

  for (const [key, planet] of Object.entries(planets)) {
    const fromHouse = planet.house;
    if (!fromHouse) continue;

    const aspectOffsets = getAspectOffsets(key, options);

    for (const offset of aspectOffsets) {
      const targetHouse = ((fromHouse + offset.houseStep - 2) % 12) + 1;

      // Find planets placed in the target house
      const targetPlanets = Object.entries(planets)
        .filter(([k, p]) => p.house === targetHouse && k !== key)
        .map(([k, p]) => ({ key: k, name: p.name, longitude: p.longitude, sign: p.sign }));

      const isBenefic = NATURAL_BENEFICS.includes(key);
      const isMalefic = NATURAL_MALEFICS.includes(key);

      let baseStrength = isBenefic ? 6 : -5;
      if (key === "jupiter") baseStrength = 7;
      if (key === "sun") baseStrength = -3; // Mild krura

      aspects.push({
        aspectingPlanet: key,
        aspectingPlanetName: planet.name,
        aspectType: offset.name,
        fromHouse,
        targetHouse,
        targetPlanets,
        nature: isBenefic ? "benefic" : "malefic",
        strength: baseStrength,
        source: {
          planet: planet.name,
          fromHouse,
          targetHouse,
          longitude: planet.longitude,
          sign: planet.sign
        },
        reason: `${planet.name} in house ${fromHouse} casts a ${offset.name} on house ${targetHouse}${
          targetPlanets.length > 0 ? ` influencing ${targetPlanets.map((tp) => tp.name).join(", ")}` : ""
        }.`
      });
    }
  }

  return aspects;
}

/**
 * Determines aspect house offsets relative to source planet.
 * In Vedic counting:
 * House 1 = self
 * 3rd aspect = fromHouse + 2
 * 4th aspect = fromHouse + 3
 * 5th aspect = fromHouse + 4
 * 7th aspect = fromHouse + 6 (all planets)
 * 8th aspect = fromHouse + 7
 * 9th aspect = fromHouse + 8
 * 10th aspect = fromHouse + 9
 * 
 * @param {string} planetKey
 * @param {Object} [options]
 */
function getAspectOffsets(planetKey, options = {}) {
  const includeNodeAspects = options.includeNodeAspects !== false;

  const offsets = [
    { houseStep: 7, name: "7th Aspect (Full Samasaptaka)" }
  ];

  if (planetKey === "mars") {
    offsets.push({ houseStep: 4, name: "4th Special Aspect (Chaturtha Drishti)" });
    offsets.push({ houseStep: 8, name: "8th Special Aspect (Ashtama Drishti)" });
  } else if (planetKey === "jupiter") {
    offsets.push({ houseStep: 5, name: "5th Special Aspect (Panchama Drishti)" });
    offsets.push({ houseStep: 9, name: "9th Special Aspect (Navama Drishti)" });
  } else if (includeNodeAspects && (planetKey === "rahu" || planetKey === "ketu")) {
    offsets.push({ houseStep: 5, name: "5th Special Aspect (Panchama Drishti)" });
    offsets.push({ houseStep: 9, name: "9th Special Aspect (Navama Drishti)" });
  } else if (planetKey === "saturn") {
    offsets.push({ houseStep: 3, name: "3rd Special Aspect (Tritiya Drishti)" });
    offsets.push({ houseStep: 10, name: "10th Special Aspect (Dashama Drishti)" });
  }

  return offsets;
}


/**
 * Convenience helper to find all aspects impacting a specific house.
 * 
 * @param {Array<Object>} aspects 
 * @param {number} houseNumber 
 * @returns {Array<Object>}
 */
function getAspectsOnHouse(aspects, houseNumber) {
  return aspects.filter((a) => a.targetHouse === houseNumber);
}

/**
 * Convenience helper to find all aspects impacting a specific planet.
 * 
 * @param {Array<Object>} aspects 
 * @param {string} planetKey 
 * @returns {Array<Object>}
 */
function getAspectsOnPlanet(aspects, planetKey) {
  const targetKey = planetKey.toLowerCase();
  return aspects.filter((a) => a.targetPlanets.some((tp) => tp.key === targetKey));
}

module.exports = {
  NATURAL_BENEFICS,
  NATURAL_MALEFICS,
  calculateAspects,
  getAspectsOnHouse,
  getAspectsOnPlanet
};
