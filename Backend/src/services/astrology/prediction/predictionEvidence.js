'use strict';

/**
 * Phase 3 — Prediction Evidence Processor
 *
 * Consumes a Phase 2 `analyzeChart` result and produces a normalized,
 * grounded evidence payload for each domain — ready to be handed to Gemini.
 *
 * KEY RESPONSIBILITIES:
 *   1. Add `type` classification to every evidence item (FACT / YOGA / DIGNITY …)
 *   2. Group overlapping items by their underlying `source` planet/axis
 *   3. Apply diminishing-returns normalization so one planet cannot inflate a domain
 *      score unboundedly (Phase 2.1 finding: Venus → +17 in relationships from one placement)
 *   4. Produce `dominantFactors`, `conflicts`, raw + normalized scores
 *   5. Provide full `ruleIds` array for traceability
 *
 * DOES NOT call Gemini.
 * DOES NOT modify Phase 1 or Phase 2 output.
 */

const { EVIDENCE_TYPES, NET_INFLUENCE_LANGUAGE, getStrengthLanguage } = require('./predictionSchema');

// ---------------------------------------------------------------------------
// Evidence type classifier
// Inspects an evidence item's `id` prefix / `factor` string and assigns a type.
// ---------------------------------------------------------------------------

const TYPE_PATTERNS = [
  { pattern: /yoga/i,        type: EVIDENCE_TYPES.YOGA },
  { pattern: /dignity|exalt|debil|own.sign|moolatrik/i, type: EVIDENCE_TYPES.DIGNITY },
  { pattern: /lord|lagnesha/i, type: EVIDENCE_TYPES.HOUSE_LORD },
  { pattern: /aspect/i,      type: EVIDENCE_TYPES.ASPECT },
  { pattern: /nakshatra|pada/i, type: EVIDENCE_TYPES.NAKSHATRA },
];

/**
 * Safely extracts a stable string key from a source field (which may be a string or an object).
 * Preserves the original source object on the item for full traceability.
 * @param {string|Object} source
 * @returns {string}
 */
function getSourceKey(source) {
  if (!source) return 'unknown';
  if (typeof source === 'string') return source.toLowerCase();
  if (typeof source === 'object') {
    if (source.planet) return String(source.planet).toLowerCase();
    if (source.name) return String(source.name).toLowerCase();
    if (source.house) return `house_${source.house}`;
    return JSON.stringify(source).toLowerCase();
  }
  return String(source).toLowerCase();
}

/**
 * Deduplicates evidence items within a domain based on unique rule ID / source / factor combination.
 * @param {Array<Object>} items
 * @returns {Array<Object>}
 */
function deduplicateEvidence(items) {
  const seen = new Set();
  const deduped = [];
  for (const item of items) {
    const srcKey = getSourceKey(item.source);
    const key = `${item.id || item.ruleId || ''}_${srcKey}_${item.factor || ''}`;
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(item);
    }
  }
  return deduped;
}

/**
 * Infer EVIDENCE_TYPES value from item fields.
 * Falls back to FACT or CLASSICAL_PRINCIPLE based on whether a specific
 * chart placement can be identified.
 * @param {Object} item - Phase 2 evidence item
 * @returns {string} EVIDENCE_TYPES value
 */
function classifyEvidenceType(item) {
  const searchText = `${item.id || ''} ${item.factor || ''} ${item.reason || ''}`;
  for (const { pattern, type } of TYPE_PATTERNS) {
    if (pattern.test(searchText)) return type;
  }
  const srcKey = getSourceKey(item.source);
  if (/sun|moon|mercury|venus|mars|jupiter|saturn|rahu|ketu/i.test(srcKey)) {
    return EVIDENCE_TYPES.FACT;
  }
  return EVIDENCE_TYPES.CLASSICAL_PRINCIPLE;
}

// ---------------------------------------------------------------------------
// Score normalization — diminishing returns per source planet
// ---------------------------------------------------------------------------

const DIMINISHING_RETURNS_FACTOR = 0.7;

/**
 * Normalize a list of evidence items using per-source diminishing returns.
 * @param {Array<Object>} items - classified evidence items for one domain
 * @returns {{ normalizedScore: number, annotatedItems: Array<Object> }}
 */
function applyDiminishingReturns(items) {
  const sourceCount = {};
  let normalizedScore = 0;

  const sorted = [...items].sort((a, b) => Math.abs(b.strength) - Math.abs(a.strength));

  const annotatedItems = sorted.map(item => {
    const src = getSourceKey(item.source);
    if (!sourceCount[src]) sourceCount[src] = 0;
    const occurrenceIndex = sourceCount[src];
    sourceCount[src] += 1;

    const multiplier = Math.pow(DIMINISHING_RETURNS_FACTOR, occurrenceIndex);
    const normalizedStrength = item.strength * multiplier;
    normalizedScore += normalizedStrength;

    return {
      ...item,
      normalizedStrength: parseFloat(normalizedStrength.toFixed(3)),
      diminishingMultiplier: parseFloat(multiplier.toFixed(3)),
      occurrenceIndexForSource: occurrenceIndex,
    };
  });

  return { normalizedScore: parseFloat(normalizedScore.toFixed(2)), annotatedItems };
}

// ---------------------------------------------------------------------------
// Domain evidence preparation
// ---------------------------------------------------------------------------

const MAX_SUPPORTING_FOR_GEMINI = 5;
const MAX_CONTRADICTING_FOR_GEMINI = 3;

/**
 * Identify the dominant source (planet/axis) in a set of annotated items.
 * @param {Array<Object>} items
 * @returns {string}
 */
function findDominantSource(items) {
  const sourceTotals = {};
  for (const item of items) {
    const src = getSourceKey(item.source);
    sourceTotals[src] = (sourceTotals[src] || 0) + Math.abs(item.strength);
  }
  const sorted = Object.entries(sourceTotals).sort(([, a], [, b]) => b - a);
  return sorted.length > 0 ? sorted[0][0] : 'unknown';
}

/**
 * Prepare normalized evidence for a single domain.
 *
 * @param {string} domainName
 * @param {Object} domainData - Phase 2 domain object
 * @returns {Object} Grounded domain evidence payload
 */
function prepareDomainEvidence(domainName, domainData) {
  const rawItems = [
    ...(domainData.supportingFactors || []),
    ...(domainData.contradictingFactors || []),
    ...(domainData.neutralFactors || []),
  ];

  // 0. Deduplicate items to prevent identical rule duplication
  const allItems = deduplicateEvidence(rawItems);

  // 1. Classify each item with a type field
  const classified = allItems.map(item => ({
    ...item,
    type: classifyEvidenceType(item),
    strengthLanguage: getStrengthLanguage(item.strength),
  }));

  // 2. Apply diminishing returns normalization
  const { normalizedScore, annotatedItems } = applyDiminishingReturns(classified);

  // 3. Re-separate into supporting / contradicting after normalization
  const supporting = annotatedItems.filter(i => i.strength > 0)
    .sort((a, b) => b.normalizedStrength - a.normalizedStrength);
  const contradicting = annotatedItems.filter(i => i.strength < 0)
    .sort((a, b) => a.normalizedStrength - b.normalizedStrength);
  const neutral = annotatedItems.filter(i => i.strength === 0);

  // 4. Identify conflicts (same source has both supporting and contradicting items)
  const supportingSources = new Set(supporting.map(i => getSourceKey(i.source)));
  const contradictingSources = new Set(contradicting.map(i => getSourceKey(i.source)));
  const conflictSources = [...supportingSources].filter(s => contradictingSources.has(s));

  // 5. Rule IDs for traceability
  const ruleIds = annotatedItems.map(i => i.id).filter(Boolean);

  // 6. Dominant factor
  const dominantSource = findDominantSource(supporting);

  // 7. Evidence level label with explicit insufficient_evidence support
  let evidenceLevel = 'insufficient_evidence';
  if (supporting.length === 0 && contradicting.length === 0) {
    evidenceLevel = 'insufficient_evidence';
  } else if (supporting.length >= 3 && contradicting.length === 0) {
    evidenceLevel = 'Strong';
  } else if (supporting.length >= 2 && contradicting.length <= 1) {
    evidenceLevel = 'Moderate';
  } else if (supporting.length >= 1 && contradicting.length >= 1) {
    evidenceLevel = 'Mixed';
  } else if (supporting.length >= 2) {
    evidenceLevel = 'Moderate';
  } else if (supporting.length === 1 && contradicting.length === 0) {
    evidenceLevel = 'Limited';
  } else {
    evidenceLevel = 'insufficient_evidence';
  }

  // 8. Select top items for Gemini
  const topSupporting = supporting.slice(0, MAX_SUPPORTING_FOR_GEMINI).map(item => ({
    id: item.id,
    type: item.type,
    factor: item.factor,
    strength: item.strength,
    normalizedStrength: item.normalizedStrength,
    strengthLanguage: item.strengthLanguage,
    source: item.source,
    reason: item.reason,
  }));

  const topContradicting = contradicting.slice(0, MAX_CONTRADICTING_FOR_GEMINI).map(item => ({
    id: item.id,
    type: item.type,
    factor: item.factor,
    strength: item.strength,
    normalizedStrength: item.normalizedStrength,
    strengthLanguage: item.strengthLanguage,
    source: item.source,
    reason: item.reason,
  }));

  return {
    domain: domainName,
    rawScore: domainData.astrologicalEvidenceScore,
    normalizedScore,
    netInfluence: domainData.netInfluence,
    netInfluenceLanguage: NET_INFLUENCE_LANGUAGE[domainData.netInfluence] || domainData.netInfluence,
    evidenceLevel,
    dominantSource,
    factorCounts: {
      supporting: supporting.length,
      contradicting: contradicting.length,
      neutral: neutral.length,
    },
    conflicts: conflictSources,
    topSupporting,
    topContradicting,
    ruleIds,
    normalizationMethod: `per-source diminishing returns (factor ${DIMINISHING_RETURNS_FACTOR})`,
  };
}


// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

/**
 * Processes a full Phase 2 analysis result and produces grounded evidence
 * payloads for all 6 domains.
 *
 * @param {Object} analysis - Result of `analyzeChart()` from Phase 2 Rule Engine
 * @returns {Object} Grounded evidence for all domains + chart metadata
 */
function prepareGroundedEvidence(analysis) {
  if (!analysis || !analysis.domains) {
    const err = new Error('prepareGroundedEvidence requires a valid Phase 2 analysis object with domains.');
    err.code = 'INVALID_ANALYSIS_OBJECT';
    throw err;
  }

  const domainEvidence = {};
  for (const [domainName, domainData] of Object.entries(analysis.domains)) {
    domainEvidence[domainName] = prepareDomainEvidence(domainName, domainData);
  }

  return {
    phase: 'prediction_evidence_v1',
    chartMetadata: analysis.chartMetadata || {},
    domainEvidence,
    dignities: analysis.dignities || {},
    yogas: (analysis.yogas || []).map(y => ({
      id: y.id,
      name: y.name,
      domain: y.domain,
      effect: y.effect,
      strength: y.strength,
      source: y.source,
    })),
    scoringMethodology: {
      description: 'Additive rule-engine scores with per-source diminishing returns normalization',
      diminishingReturnsFactor: DIMINISHING_RETURNS_FACTOR,
      maxSupportingForGemini: MAX_SUPPORTING_FOR_GEMINI,
      maxContradictingForGemini: MAX_CONTRADICTING_FOR_GEMINI,
      disclaimer: 'Scores are astrological evidence weights, NOT scientific probabilities.',
    },
  };
}

module.exports = {
  prepareGroundedEvidence,
  prepareDomainEvidence,
  classifyEvidenceType,
  applyDiminishingReturns,
  getSourceKey,
  deduplicateEvidence,
  DIMINISHING_RETURNS_FACTOR,
};

