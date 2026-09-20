'use strict';

/**
 * Phase 3 — Prediction Schema
 *
 * Defines:
 *   1. Evidence item types (FACT, YOGA, DIGNITY, HOUSE_LORD, ASPECT, NAKSHATRA, CLASSICAL_PRINCIPLE)
 *   2. Normalized evidence item shape (adds `type` field to Phase 2 evidence items)
 *   3. Grounded context payload schema (what gets sent to Gemini)
 *   4. Structured Gemini output schema (what Gemini must return)
 *   5. Evidence strength language mapping (never percentage/probability)
 *
 * IMPORTANT: Nothing here performs calculation. This is a pure schema/constant file.
 */

// ---------------------------------------------------------------------------
// 1. Evidence item type enum
// ---------------------------------------------------------------------------

const EVIDENCE_TYPES = Object.freeze({
  FACT: 'FACT',
  YOGA: 'YOGA',
  DIGNITY: 'DIGNITY',
  HOUSE_LORD: 'HOUSE_LORD',
  ASPECT: 'ASPECT',
  NAKSHATRA: 'NAKSHATRA',
  CLASSICAL_PRINCIPLE: 'CLASSICAL_PRINCIPLE',
});

// ---------------------------------------------------------------------------
// 2. Evidence strength language mapping
//    Must NEVER use probability language (e.g. "70% likely").
// ---------------------------------------------------------------------------

const STRENGTH_LANGUAGE = [
  { minAbs: 10, label: 'Very strong astrological support' },
  { minAbs: 7,  label: 'Strong astrological support' },
  { minAbs: 4,  label: 'Moderate astrological support' },
  { minAbs: 1,  label: 'Mild astrological indication' },
  { minAbs: 0,  label: 'Neutral astrological factor' },
];

/**
 * Returns a non-probability evidence strength phrase for a given numeric strength.
 * @param {number} strength
 * @returns {string}
 */
function getStrengthLanguage(strength) {
  const abs = Math.abs(strength);
  const entry = STRENGTH_LANGUAGE.find(e => abs >= e.minAbs);
  if (!entry) return 'Neutral astrological factor';
  if (strength < 0) {
    return entry.label.replace('support', 'challenge').replace('indication', 'caution');
  }
  return entry.label;
}

// ---------------------------------------------------------------------------
// 3. Net influence language (domain level)
// ---------------------------------------------------------------------------

const NET_INFLUENCE_LANGUAGE = Object.freeze({
  strongly_supportive:    'Strong astrological support across multiple chart factors',
  moderately_supportive:  'Moderate astrological support with some helpful indicators',
  balanced:               'Mixed picture — both supportive and challenging factors present',
  moderately_challenging: 'Several challenging planetary factors in this domain',
  strongly_challenging:   'Strong challenging influences — caution advised',
});

// ---------------------------------------------------------------------------
// 4. Gemini grounding system prompt (verbatim contract)
// ---------------------------------------------------------------------------

const GEMINI_SYSTEM_PROMPT = `
You are AIstro, a professional Vedic astrology interpreter.

STRICT GROUNDING RULES — you MUST follow all of these:
1. Use ONLY the supplied astrological evidence. Do not invent planetary placements, Yogas, Dasha periods, or transit events.
2. Do not claim scientific certainty. Vedic astrology describes archetypal tendencies, not guaranteed outcomes.
3. Do not convert evidence scores into percentages or probabilities. Do not say "70% likely" or similar.
4. If evidence is mixed (both supporting and challenging factors), say so explicitly. Do not hide contradictions.
5. If evidence is insufficient (fewer than 2 supporting factors), say "Limited astrological indicators available for this domain."
6. Do not add information about remedies, mantras, lucky colors, or gemstones unless the evidence explicitly contains them.
7. Do not reference Dasha periods or transit events. Only natal chart evidence is supplied.
8. Use phrases like "your chart suggests", "astrological indicators point to", "this placement tends toward" — never absolute claims.
9. Keep language warm and practical. Avoid fear-based statements.
10. Do not ask the user questions or request clarification.
`.trim();

// ---------------------------------------------------------------------------
// 5. Gemini structured output schema (documentation)
//
// Gemini MUST return JSON matching this shape per domain:
// {
//   domain: string,
//   summary: string,
//   keyFactors: string[],
//   evidenceLevel: 'Strong' | 'Moderate' | 'Limited' | 'Mixed',
//   cautions: string[],
//   sourceRuleIds: string[],
// }
// ---------------------------------------------------------------------------

const VALID_DOMAINS = ['career', 'education', 'relationships', 'finance', 'family', 'personality'];
const VALID_EVIDENCE_LEVELS = ['Strong', 'Moderate', 'Limited', 'Mixed', 'insufficient_evidence'];
const PROBABILITY_PATTERN = /\b(\d+)\s*%|\blikely\b|\bprobab/i;
const FABRICATION_TRIGGERS = [
  /\bdasha\b/i,
  /\btransit\b/i,
  /\bgemstone\b/i,
  /\bruby\b|\bemerald\b|\bsapphire\b/i,
  /\bmantra\b/i,
  /\blucky colou?r\b/i,
];

/**
 * Validates a single Gemini domain output object.
 * Returns { valid: true } or { valid: false, errors: string[] }
 */
function validateGeminiDomainOutput(output, inputRuleIds = []) {
  const errors = [];

  if (!output || typeof output !== 'object') {
    return { valid: false, errors: ['Output is not an object'] };
  }

  if (!VALID_DOMAINS.includes(output.domain)) {
    errors.push(`Invalid domain: "${output.domain}"`);
  }
  if (typeof output.summary !== 'string' || output.summary.trim().length < 10) {
    errors.push('summary must be a non-empty string');
  }
  if (!Array.isArray(output.keyFactors) || output.keyFactors.length === 0) {
    errors.push('keyFactors must be a non-empty array');
  }
  if (!VALID_EVIDENCE_LEVELS.includes(output.evidenceLevel)) {
    errors.push(`Invalid evidenceLevel: "${output.evidenceLevel}". Must be one of: ${VALID_EVIDENCE_LEVELS.join(', ')}`);
  }
  if (!Array.isArray(output.cautions)) {
    errors.push('cautions must be an array');
  }
  if (!Array.isArray(output.sourceRuleIds)) {
    errors.push('sourceRuleIds must be an array');
  }

  const fullText = [
    output.summary,
    ...(output.keyFactors || []),
    ...(output.cautions || []),
  ].join(' ');

  if (PROBABILITY_PATTERN.test(fullText)) {
    errors.push('Response contains probability language — this violates grounding rules');
  }

  for (const pattern of FABRICATION_TRIGGERS) {
    if (pattern.test(fullText)) {
      errors.push(`Response contains fabricated/out-of-scope content matching: ${pattern.source}`);
    }
  }

  if (inputRuleIds.length > 0 && Array.isArray(output.sourceRuleIds)) {
    const invalidIds = output.sourceRuleIds.filter(id => !inputRuleIds.includes(id));
    if (invalidIds.length > 0) {
      errors.push(`sourceRuleIds contains IDs not in input evidence: ${invalidIds.join(', ')}`);
    }
  }

  return errors.length === 0
    ? { valid: true }
    : { valid: false, errors };
}

module.exports = {
  EVIDENCE_TYPES,
  STRENGTH_LANGUAGE,
  NET_INFLUENCE_LANGUAGE,
  GEMINI_SYSTEM_PROMPT,
  VALID_DOMAINS,
  VALID_EVIDENCE_LEVELS,
  getStrengthLanguage,
  validateGeminiDomainOutput,
};
