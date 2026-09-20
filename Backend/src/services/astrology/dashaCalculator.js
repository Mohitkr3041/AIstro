'use strict';

/**
 * Phase 4 — Deterministic Vimshottari Dasha Engine
 *
 * Implements 120-year Vimshottari Dasha cycle using Swiss Ephemeris Moon longitude.
 *
 * KEY RULES:
 *   1. Order of Graha Dasha periods (120 years total cycle):
 *      Ketu (7y), Venus (20y), Sun (6y), Moon (10y), Mars (7y), Rahu (18y), Jupiter (16y), Saturn (19y), Mercury (17y)
 *   2. Starting Mahadasha determined by Moon Nakshatra (index 0..26): lord = DASHA_LORDS[nakshatraIndex % 9]
 *   3. Balance of first Mahadasha = lord.years * (1 - (degreesWithinNakshatra / 13.333333))
 *   4. Explicit `asOf` date parameter — NEVER uses Date.now() internally for calculations.
 */

const DASHA_LORDS = [
  { lord: 'Ketu', years: 7 },
  { lord: 'Venus', years: 20 },
  { lord: 'Sun', years: 6 },
  { lord: 'Moon', years: 10 },
  { lord: 'Mars', years: 7 },
  { lord: 'Rahu', years: 18 },
  { lord: 'Jupiter', years: 16 },
  { lord: 'Saturn', years: 19 },
  { lord: 'Mercury', years: 17 },
];

const TOTAL_CYCLE_YEARS = 120;
const NAKSHATRA_SPAN = 360 / 27; // 13.333333333333334 degrees

const DAYS_PER_YEAR = 365.2425;
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const MS_PER_YEAR = DAYS_PER_YEAR * MS_PER_DAY;

/**
 * Normalizes degrees to 0..360
 */
function normalizeDegrees(deg) {
  return ((deg % 360) + 360) % 360;
}

/**
 * Calculates full Vimshottari Dasha timeline and active period for a given asOf date.
 *
 * @param {Object} params
 * @param {number} params.moonLongitude - Sidereal Moon longitude in degrees (0..360)
 * @param {string|Date} params.birthUtc - UTC birth date string or Date object
 * @param {string|Date} [params.asOfUtc] - Explicit asOf date for active Dasha lookup (default: birthUtc)
 * @returns {Object} Full Dasha breakdown including active Mahadasha/Antardasha & 120-yr timeline
 */
function calculateVimshottariDasha({ moonLongitude, birthUtc, asOfUtc }) {
  if (typeof moonLongitude !== 'number' || isNaN(moonLongitude)) {
    throw new Error('calculateVimshottariDasha requires a valid numeric moonLongitude.');
  }
  if (!birthUtc) {
    throw new Error('calculateVimshottariDasha requires a valid birthUtc date.');
  }

  const birthDate = new Date(birthUtc);
  if (isNaN(birthDate.getTime())) {
    throw new Error(`Invalid birthUtc date: ${birthUtc}`);
  }

  const asOfDate = asOfUtc ? new Date(asOfUtc) : birthDate;
  if (isNaN(asOfDate.getTime())) {
    throw new Error(`Invalid asOfUtc date: ${asOfUtc}`);
  }

  const normalizedMoon = normalizeDegrees(moonLongitude);
  const nakshatraIndex = Math.floor(normalizedMoon / NAKSHATRA_SPAN);
  const degreesWithin = normalizedMoon % NAKSHATRA_SPAN;
  const fractionElapsed = degreesWithin / NAKSHATRA_SPAN;
  const fractionRemaining = 1 - fractionElapsed;

  const startingMahaIndex = nakshatraIndex % 9;
  const startingLord = DASHA_LORDS[startingMahaIndex];

  const firstMahaDurationYears = startingLord.years * fractionRemaining;
  const firstMahaDurationMs = firstMahaDurationYears * MS_PER_YEAR;

  // Build full 120-year Mahadasha sequence
  const mahadashas = [];
  let currentStartMs = birthDate.getTime();

  for (let i = 0; i < 9; i++) {
    const dashaIdx = (startingMahaIndex + i) % 9;
    const lordObj = DASHA_LORDS[dashaIdx];
    const durationYears = (i === 0) ? firstMahaDurationYears : lordObj.years;
    const durationMs = durationYears * MS_PER_YEAR;
    const currentEndMs = currentStartMs + durationMs;

    const startDate = new Date(currentStartMs);
    const endDate = new Date(currentEndMs);

    // Calculate 9 Antardashas within this Mahadasha
    const antardashas = [];
    let adStartMs = currentStartMs;

    for (let j = 0; j < 9; j++) {
      const adIdx = (dashaIdx + j) % 9;
      const adLordObj = DASHA_LORDS[adIdx];

      // Antardasha length formula: (Maha years * AD years) / 120
      // For first Mahadasha, scale proportionally by fraction remaining
      const fullAdYears = (lordObj.years * adLordObj.years) / TOTAL_CYCLE_YEARS;
      const actualAdYears = (i === 0) ? (fullAdYears * fractionRemaining) : fullAdYears;
      const adDurationMs = actualAdYears * MS_PER_YEAR;
      const adEndMs = adStartMs + adDurationMs;

      antardashas.push({
        antardashaLord: adLordObj.lord,
        startIso: new Date(adStartMs).toISOString(),
        endIso: new Date(adEndMs).toISOString(),
        durationYears: parseFloat(actualAdYears.toFixed(3)),
      });

      adStartMs = adEndMs;
    }

    mahadashas.push({
      mahadashaLord: lordObj.lord,
      startIso: startDate.toISOString(),
      endIso: endDate.toISOString(),
      durationYears: parseFloat(durationYears.toFixed(3)),
      antardashas,
    });

    currentStartMs = currentEndMs;
  }

  // Find active Mahadasha & Antardasha for asOfDate
  const targetMs = asOfDate.getTime();
  let activeMahadasha = null;
  let activeAntardasha = null;

  for (const m of mahadashas) {
    const mStart = new Date(m.startIso).getTime();
    const mEnd = new Date(m.endIso).getTime();

    if (targetMs >= mStart && targetMs <= mEnd) {
      activeMahadasha = m;
      for (const ad of m.antardashas) {
        const adStart = new Date(ad.startIso).getTime();
        const adEnd = new Date(ad.endIso).getTime();
        if (targetMs >= adStart && targetMs <= adEnd) {
          activeAntardasha = ad;
          break;
        }
      }
      break;
    }
  }

  // Fallback if targetMs is beyond the 120-year cycle
  if (!activeMahadasha) {
    activeMahadasha = mahadashas[mahadashas.length - 1];
    activeAntardasha = activeMahadasha.antardashas[activeMahadasha.antardashas.length - 1];
  }

  return {
    moonLongitude: parseFloat(normalizedMoon.toFixed(4)),
    nakshatraIndex,
    nakshatraLord: startingLord.lord,
    balanceYears: parseFloat((startingLord.years * fractionRemaining).toFixed(2)),
    asOfIso: asOfDate.toISOString(),
    activeDasha: {
      mahadasha: activeMahadasha.mahadashaLord,
      antardasha: activeAntardasha ? activeAntardasha.antardashaLord : activeMahadasha.mahadashaLord,
      mahadashaStart: activeMahadasha.startIso,
      mahadashaEnd: activeMahadasha.endIso,
      antardashaStart: activeAntardasha ? activeAntardasha.startIso : activeMahadasha.startIso,
      antardashaEnd: activeAntardasha ? activeAntardasha.endIso : activeMahadasha.endIso,
    },
    mahadashas,
  };
}

module.exports = {
  calculateVimshottariDasha,
  DASHA_LORDS,
};
