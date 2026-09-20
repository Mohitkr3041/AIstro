'use strict';

/**
 * Phase 3 — Prediction Engine
 *
 * Orchestrates the full pipeline:
 *   Phase 1 (Swiss Ephemeris) → Phase 2 (Rule Engine) → Evidence Prep → Gemini → Validation
 *
 * ENTRY POINTS:
 *   generateGroundedPredictions(birthData, options)  — full pipeline
 *   prepareEvidenceOnly(birthData)                   — Phase 1+2+evidence (no Gemini)
 *
 * DOES NOT perform astrology calculations itself.
 * DOES NOT trust Gemini output without validation.
 */

const { calculateNatalChart } = require('../astrologyEngine');
const { analyzeChart } = require('../rules/ruleEngine');
const { prepareGroundedEvidence } = require('./predictionEvidence');
const { buildDomainPrompt, parseAndValidateDomainOutput } = require('./domainPrediction');
const { GEMINI_SYSTEM_PROMPT, VALID_DOMAINS } = require('./predictionSchema');

// Gemini service — imported lazily to allow unit tests without GEMINI_API_KEY
let _geminiService = null;
function getGeminiService() {
  if (!_geminiService) {
    _geminiService = require('../../gemini.service');
  }
  return _geminiService;
}

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const MAX_GEMINI_RETRIES = 2;
const DEFAULT_DOMAINS = VALID_DOMAINS; // all six

// ---------------------------------------------------------------------------
// Single-domain Gemini call
// ---------------------------------------------------------------------------

/**
 * Calls Gemini for a single domain and validates the response.
 * Retries once on validation failure.
 *
 * @param {Object} domainEvidence - prepareDomainEvidence() output
 * @param {Object} chartMetadata
 * @param {Object} geminiOptions - forwarded to generateGroundedReading
 * @returns {Object} { domain, prediction, validationErrors, source }
 */
async function callGeminiForDomain(domainEvidence, chartMetadata, geminiOptions = {}) {
  const domain = domainEvidence.domain;
  const inputRuleIds = domainEvidence.ruleIds || [];

  if (domainEvidence.evidenceLevel === 'insufficient_evidence') {
    return {
      domain,
      prediction: {
        domain,
        summary: 'Limited astrological indicators are available in the natal chart for this domain.',
        keyFactors: ['Insufficient specific planetary factors identified for this domain.'],
        evidenceLevel: 'insufficient_evidence',
        cautions: [],
        sourceRuleIds: [],
      },
      validationErrors: [],
      source: 'deterministic_insufficient_evidence',
      attempt: 0,
    };
  }

  const { generateGroundedReading } = getGeminiService();
  let lastErrors = [];
  let lastParsed = null;


  for (let attempt = 1; attempt <= MAX_GEMINI_RETRIES; attempt++) {
    const userPrompt = buildDomainPrompt(domainEvidence, chartMetadata);

    let rawText;
    try {
      rawText = await generateGroundedReading(userPrompt, GEMINI_SYSTEM_PROMPT, {
        ...geminiOptions,
        generationConfig: {
          maxOutputTokens: 1024,
          responseMimeType: 'application/json',
          temperature: 0.3,
          ...(geminiOptions.generationConfig || {}),
        },
      });
    } catch (geminiError) {
      return {
        domain,
        prediction: null,
        validationErrors: [`Gemini call failed: ${geminiError.message}`],
        source: 'gemini_error',
        attempt,
      };
    }

    const { parsed, errors } = parseAndValidateDomainOutput(rawText, inputRuleIds);
    lastParsed = parsed;
    lastErrors = errors;

    if (errors.length === 0) {
      return {
        domain,
        prediction: parsed,
        validationErrors: [],
        source: 'gemini_grounded',
        attempt,
      };
    }

    console.warn(`[PredictionEngine] Domain "${domain}" attempt ${attempt} validation failed:`, errors);
  }

  // All retries exhausted — return the last parsed result with errors flagged
  return {
    domain,
    prediction: lastParsed,
    validationErrors: lastErrors,
    source: 'gemini_grounded_with_warnings',
    attempt: MAX_GEMINI_RETRIES,
  };
}

// ---------------------------------------------------------------------------
// Pipeline: prepare evidence without calling Gemini
// ---------------------------------------------------------------------------

const { calculateVimshottariDasha } = require('../dashaCalculator');
const { calculateTransits } = require('../transitCalculator');

/**
 * Runs Phase 1 + Phase 2 + Dasha + Transits + evidence normalization.
 * Safe to call in tests without a real Gemini API key.
 *
 * @param {{ dob, tob, place }} birthData
 * @param {Object} [options]
 * @param {string|Date} [options.asOf] - Explicit asOf date for Dasha/Transit calculation
 * @returns {{ chart, analysis, groundedEvidence, dasha, transits }}
 */
async function prepareEvidenceOnly(birthData, options = {}) {
  if (!birthData || !birthData.dob || !birthData.tob || !birthData.place) {
    const err = new Error('prepareEvidenceOnly requires { dob, tob, place }');
    err.code = 'INVALID_BIRTH_DATA';
    throw err;
  }

  const chart = await calculateNatalChart({
    dob: birthData.dob,
    tob: birthData.tob,
    place: birthData.place,
  });

  const analysis = analyzeChart(chart);
  const groundedEvidence = prepareGroundedEvidence(analysis);

  // Phase 4: Vimshottari Dasha for asOf date
  const asOfDate = options.asOf || chart.birthData?.utcIso;
  const dasha = calculateVimshottariDasha({
    moonLongitude: chart.planets.moon.longitude,
    birthUtc: chart.birthData.utcIso,
    asOfUtc: asOfDate,
  });

  // Phase 5: Transits for asOf date
  const transits = calculateTransits({
    asOfUtc: asOfDate,
    natalChart: chart,
  });

  // Attach Dasha and Transit evidence to grounded payload
  groundedEvidence.dasha = {
    activeMahadasha: dasha.activeDasha.mahadasha,
    activeAntardasha: dasha.activeDasha.antardasha,
    mahadashaStart: dasha.activeDasha.mahadashaStart,
    mahadashaEnd: dasha.activeDasha.mahadashaEnd,
    antardashaStart: dasha.activeDasha.antardashaStart,
    antardashaEnd: dasha.activeDasha.antardashaEnd,
  };

  groundedEvidence.transits = {
    asOfIso: transits.asOfIso,
    conjunctions: transits.conjunctions,
    keyTransitPlacements: Object.entries(transits.transitPlanets).map(([k, p]) => ({
      planet: p.name,
      sign: p.sign,
      houseInNatal: p.house,
      retrograde: p.retrograde,
    })),
  };

  return { chart, analysis, groundedEvidence, dasha, transits };
}


// ---------------------------------------------------------------------------
// Pipeline: full prediction (with Gemini)
// ---------------------------------------------------------------------------

/**
 * Full pipeline: birth data → chart → rule engine → evidence → Gemini → structured predictions.
 *
 * @param {{ dob, tob, place, name }} birthData
 * @param {Object} options
 * @param {string[]} [options.domains] - Which domains to predict (default: all 6)
 * @param {boolean} [options.skipGemini] - If true, return evidence only (no Gemini call)
 * @param {Object} [options.geminiOptions] - Forwarded to generateGroundedReading
 * @returns {Object} Full prediction result
 */
async function generateGroundedPredictions(birthData, options = {}) {
  const domainsToRun = (options.domains || DEFAULT_DOMAINS)
    .filter(d => VALID_DOMAINS.includes(d));

  if (domainsToRun.length === 0) {
    throw new Error(`No valid domains specified. Valid domains: ${VALID_DOMAINS.join(', ')}`);
  }

  // Phase 1 + Phase 2 + Evidence normalization
  const { chart, analysis, groundedEvidence } = await prepareEvidenceOnly(birthData);

  if (options.skipGemini) {
    return {
      engineVersion: 'Phase3-PredictionEngine-v1',
      status: 'evidence_only',
      chartMetadata: groundedEvidence.chartMetadata,
      groundedEvidence,
      predictions: null,
    };
  }

  // Per-domain Gemini calls
  const { chartMetadata } = groundedEvidence;
  const predictionResults = {};

  for (const domain of domainsToRun) {
    const domainEvidence = groundedEvidence.domainEvidence[domain];
    if (!domainEvidence) {
      predictionResults[domain] = {
        domain,
        prediction: null,
        validationErrors: [`Domain "${domain}" not found in groundedEvidence`],
        source: 'missing_evidence',
      };
      continue;
    }

    predictionResults[domain] = await callGeminiForDomain(
      domainEvidence,
      chartMetadata,
      options.geminiOptions || {}
    );
  }

  return {
    engineVersion: 'Phase3-PredictionEngine-v1',
    status: 'complete',
    chartMetadata,
    scoringMethodology: groundedEvidence.scoringMethodology,
    groundedEvidence,
    predictions: predictionResults,
  };
}

module.exports = {
  generateGroundedPredictions,
  prepareEvidenceOnly,
  callGeminiForDomain,
};
