'use strict';

/**
 * Phase 3 — Domain Prediction Builder
 *
 * Responsibilities:
 *   1. Build per-domain grounded prompt payload for Gemini
 *   2. Parse and validate Gemini structured JSON output per domain
 *   3. Enforce that Gemini interprets evidence — not raw chart JSON
 *
 * DOES NOT call Gemini directly.
 * DOES NOT perform astrology calculations.
 */

const { GEMINI_SYSTEM_PROMPT, validateGeminiDomainOutput, VALID_DOMAINS } = require('./predictionSchema');

// ---------------------------------------------------------------------------
// Domain-specific prompt templates
// Each template provides a brief instruction for Gemini SPECIFIC to the domain.
// These are appended to the common grounding system prompt.
// ---------------------------------------------------------------------------

const DOMAIN_INSTRUCTIONS = {
  career: `
Interpret the CAREER domain evidence only.
Focus on: professional aptitude, leadership, recognition, career direction.
Do NOT mention relationship or financial indicators unless they appear in the supplied career evidence.
`.trim(),

  education: `
Interpret the EDUCATION domain evidence only.
Focus on: intellectual ability, learning style, academic aptitude, specialized skills.
Do NOT add claims about career or relationships.
`.trim(),

  relationships: `
Interpret the RELATIONSHIPS domain evidence only.
Focus on: partnership patterns, emotional connection, 7th house indicators, Venus/Moon factors.
Do NOT add claims about career or finance.
`.trim(),

  finance: `
Interpret the FINANCE domain evidence only.
Focus on: wealth-building indicators, 2nd/11th house factors, earning patterns.
Do NOT add claims about relationships or career.
`.trim(),

  family: `
Interpret the FAMILY domain evidence only.
Focus on: family bonds, parental indicators, domestic life, 4th house factors.
Do NOT add claims about relationships outside family or career.
`.trim(),

  personality: `
Interpret the PERSONALITY domain evidence only.
Focus on: Ascendant/Lagna patterns, core nature, emotional patterns, self-expression.
NOTE: Personality evidence frequently overlaps with other domains (same Lagna facts).
Do NOT double-count the same placement as independent personality traits.
`.trim(),
};

// ---------------------------------------------------------------------------
// Prompt builder
// ---------------------------------------------------------------------------

/**
 * Builds a grounded user-turn prompt for a single domain.
 * The system prompt is always GEMINI_SYSTEM_PROMPT (sent separately as systemInstruction).
 *
 * @param {Object} domainEvidence - Output of prepareDomainEvidence() for one domain
 * @param {Object} chartMetadata - From Phase 2 analysis.chartMetadata
 * @returns {string} User-turn prompt string
 */
function buildDomainPrompt(domainEvidence, chartMetadata) {
  const domain = domainEvidence.domain;
  const domainInstruction = DOMAIN_INSTRUCTIONS[domain] || `Interpret the ${domain.toUpperCase()} domain evidence only.`;

  const prompt = `
DOMAIN: ${domain.toUpperCase()}

${domainInstruction}

CHART OVERVIEW:
- Ascendant (Lagna): ${chartMetadata.ascendantSign || 'Unknown'}
- Sun Sign: ${chartMetadata.sunSign || 'Unknown'}
- Moon Sign: ${chartMetadata.moonSign || 'Unknown'}
- Moon Nakshatra: ${chartMetadata.moonNakshatra || 'Unknown'}

EVIDENCE SUMMARY:
- Net Influence: ${domainEvidence.netInfluenceLanguage}
- Evidence Level: ${domainEvidence.evidenceLevel}
- Dominant planetary source: ${domainEvidence.dominantSource}
- Supporting factors: ${domainEvidence.factorCounts.supporting}
- Contradicting factors: ${domainEvidence.factorCounts.contradicting}
${domainEvidence.conflicts.length > 0 ? `- Conflict sources (same planet supports AND challenges): ${domainEvidence.conflicts.join(', ')}` : ''}

SUPPORTING EVIDENCE (use these as your basis):
${domainEvidence.topSupporting.map((f, i) =>
  `[${i + 1}] ID: ${f.id}
  Type: ${f.type}
  Factor: ${f.factor}
  Source planet/axis: ${f.source}
  Strength: ${f.strengthLanguage}
  Note: "${f.reason}" — treat this as astrological basis, not already-interpreted prediction.`
).join('\n\n')}

${domainEvidence.topContradicting.length > 0 ? `
CONTRADICTING EVIDENCE (must be acknowledged):
${domainEvidence.topContradicting.map((f, i) =>
  `[${i + 1}] ID: ${f.id}
  Type: ${f.type}
  Factor: ${f.factor}
  Source: ${f.source}
  Strength: ${f.strengthLanguage}
  Note: "${f.reason}" — treat as astrological caution basis, not prediction.`
).join('\n\n')}
` : ''}

AVAILABLE RULE IDs FOR CITATION (you MUST only reference IDs from this list in sourceRuleIds):
${domainEvidence.ruleIds.join(', ')}

SCORING CONTEXT (do NOT present these numbers as probabilities):
- Raw additive evidence score: ${domainEvidence.rawScore}
- Normalized score (diminishing returns applied): ${domainEvidence.normalizedScore}
- Methodology: ${domainEvidence.normalizationMethod}

REQUIRED OUTPUT FORMAT (respond with valid JSON only, no markdown):
{
  "domain": "${domain}",
  "summary": "<2-3 sentence narrative using evidence above. No probability language.>",
  "keyFactors": [
    "<specific evidence-based factor 1>",
    "<specific evidence-based factor 2>",
    "<specific evidence-based factor 3>"
  ],
  "evidenceLevel": "${domainEvidence.evidenceLevel}",
  "cautions": [
    "<contradicting factor if any — may be empty array>"
  ],
  "sourceRuleIds": ["<only IDs from the AVAILABLE RULE IDs list above>"]
}
`.trim();

  return prompt;
}

// ---------------------------------------------------------------------------
// Gemini output parser
// ---------------------------------------------------------------------------

/**
 * Parses raw Gemini response text into a structured domain prediction object.
 * Strips markdown code fences if present.
 *
 * @param {string} rawText - Gemini's raw response
 * @param {string[]} inputRuleIds - Rule IDs from the evidence payload (for validation)
 * @returns {{ parsed: Object|null, errors: string[] }}
 */
function parseAndValidateDomainOutput(rawText, inputRuleIds = []) {
  const cleaned = (rawText || '')
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    // Attempt to extract the first JSON object
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start === -1 || end <= start) {
      return { parsed: null, errors: ['Gemini response is not valid JSON'] };
    }
    try {
      parsed = JSON.parse(cleaned.slice(start, end + 1));
    } catch {
      return { parsed: null, errors: ['Gemini response could not be parsed as JSON after extraction'] };
    }
  }

  const { valid, errors } = validateGeminiDomainOutput(parsed, inputRuleIds);
  return { parsed, errors: valid ? [] : errors };
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

module.exports = {
  buildDomainPrompt,
  parseAndValidateDomainOutput,
  DOMAIN_INSTRUCTIONS,
  GEMINI_SYSTEM_PROMPT,
  VALID_DOMAINS,
};
