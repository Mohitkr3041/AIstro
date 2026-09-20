'use strict';

/**
 * Phase 5 — Deterministic Transit Engine
 *
 * Calculates planetary transit positions for an explicit `asOf` date using Swiss Ephemeris.
 *
 * KEY RULES:
 *   1. Computes positions for 9 Grahas (Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Rahu, Ketu)
 *   2. Determines house placement relative to natal Ascendant
 *   3. Identifies retrograde status and speed
 *   4. Computes transit aspects on natal houses and natal planets
 *   5. NEVER uses Date.now() internally — strictly requires explicit `asOf` date.
 */

const sweph = require('sweph');
const { calculatePlanetaryPositions } = require('./planetaryCalculator');
const { assignHousesToPlanets } = require('./houseCalculator');
const { calculateAspects } = require('./rules/aspectRules');
const { localTimeToUtc } = require('./timezoneService');

const { constants } = sweph;

/**
 * Normalizes degrees to 0..360
 */
function normalizeDegrees(deg) {
  return ((deg % 360) + 360) % 360;
}

/**
 * Converts a date object or string into Julian Day UT via Swiss Ephemeris.
 * @param {string|Date} dateInput
 * @returns {number} Julian Day UT
 */
function dateToJulianDayUt(dateInput) {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) {
    throw new Error(`Invalid asOf date passed to transit calculator: ${dateInput}`);
  }

  const year = d.getUTCFullYear();
  const month = d.getUTCMonth() + 1;
  const day = d.getUTCDate();
  const hour = d.getUTCHours();
  const minute = d.getUTCMinutes();
  const second = d.getUTCSeconds() + (d.getUTCMilliseconds() / 1000);

  const jdResult = sweph.utc_to_jd(year, month, day, hour, minute, second, constants.SE_GREG_CAL);
  if (jdResult.error && !jdResult.data) {
    throw new Error(`Julian Day calculation failed for transit date: ${jdResult.error}`);
  }

  return jdResult.data[1]; // UT
}

/**
 * Calculates deterministic transits for a given asOf date and natal chart context.
 *
 * @param {Object} params
 * @param {string|Date} params.asOfUtc - Explicit asOf date/time
 * @param {Object} params.natalChart - Authoritative natal chart from Phase 1 calculateNatalChart
 * @param {Object} [options]
 * @returns {Object} Transit analysis result
 */
function calculateTransits({ asOfUtc, natalChart }, options = {}) {
  if (!asOfUtc) {
    throw new Error('calculateTransits requires an explicit asOfUtc parameter.');
  }
  if (!natalChart || !natalChart.ascendant || !natalChart.planets) {
    throw new Error('calculateTransits requires a valid natalChart object with ascendant and planets.');
  }

  const jdUt = dateToJulianDayUt(asOfUtc);
  const natalAscIndex = natalChart.ascendant.signIndex;

  // Set Lahiri Ayanamsha for transit calculation
  sweph.set_sid_mode(constants.SE_SIDM_LAHIRI, 0, 0);

  // 1. Calculate 9 Grahas transit positions
  const rawTransits = calculatePlanetaryPositions(jdUt, { useTrueNode: options.useTrueNode || false });

  // 2. Assign natal house placements to transiting planets
  const transitPlanets = assignHousesToPlanets(rawTransits, natalAscIndex);

  // 3. Assemble synthetic transit chart for aspect calculation
  const transitChart = {
    planets: transitPlanets,
    ascendant: natalChart.ascendant,
  };

  // 4. Calculate aspects cast by transiting planets
  const transitAspects = calculateAspects(transitChart, options);

  // 5. Compare transit house placements with natal planet houses to find conjunctions
  const conjunctions = [];
  for (const [tKey, tPlanet] of Object.entries(transitPlanets)) {
    for (const [nKey, nPlanet] of Object.entries(natalChart.planets)) {
      if (tPlanet.house === nPlanet.house) {
        conjunctions.push({
          transitingPlanet: tPlanet.name,
          natalPlanet: nPlanet.name,
          house: tPlanet.house,
          sign: tPlanet.sign,
          orbDegrees: parseFloat(Math.abs(tPlanet.longitude - nPlanet.longitude).toFixed(2)),
        });
      }
    }
  }

  return {
    asOfIso: new Date(asOfUtc).toISOString(),
    julianDayUt: parseFloat(jdUt.toFixed(6)),
    natalAscendantSign: natalChart.ascendant.sign,
    transitPlanets,
    transitAspects,
    conjunctions,
  };
}

module.exports = {
  calculateTransits,
  dateToJulianDayUt,
};
