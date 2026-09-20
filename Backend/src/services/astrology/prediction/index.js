'use strict';

/**
 * Phase 3 — Prediction Engine public API
 */

const { generateGroundedPredictions, prepareEvidenceOnly } = require('./predictionEngine');
const { prepareGroundedEvidence, prepareDomainEvidence } = require('./predictionEvidence');
const { buildDomainPrompt, parseAndValidateDomainOutput } = require('./domainPrediction');
const { buildFullAstrologyReport, buildPlanetaryHighlights, buildPersonalitySection, buildCareerSection, buildRelationshipSection, buildPredictionsSection, buildTimelineSection } = require('./reportEngine');
const {
  EVIDENCE_TYPES,
  GEMINI_SYSTEM_PROMPT,
  VALID_DOMAINS,
  getStrengthLanguage,
  validateGeminiDomainOutput,
} = require('./predictionSchema');

module.exports = {
  // Main pipeline
  generateGroundedPredictions,
  prepareEvidenceOnly,
  buildFullAstrologyReport,

  // Report Engine components
  buildPlanetaryHighlights,
  buildPersonalitySection,
  buildCareerSection,
  buildRelationshipSection,
  buildPredictionsSection,
  buildTimelineSection,

  // Evidence layer
  prepareGroundedEvidence,
  prepareDomainEvidence,

  // Prompt / output handling
  buildDomainPrompt,
  parseAndValidateDomainOutput,

  // Schema / constants
  EVIDENCE_TYPES,
  GEMINI_SYSTEM_PROMPT,
  VALID_DOMAINS,
  getStrengthLanguage,
  validateGeminiDomainOutput,
};

