const { evaluateDignity } = require("./dignityRules");
const { analyzeHouseLords } = require("./houseLordRules");
const { calculateAspects } = require("./aspectRules");
const { evaluateYogas } = require("./yogaRules");
const { evaluateCareerRules } = require("./domainRules/careerRules");
const { evaluateEducationRules } = require("./domainRules/educationRules");
const { evaluateRelationshipRules } = require("./domainRules/relationshipRules");
const { evaluateFinanceRules } = require("./domainRules/financeRules");
const { evaluateFamilyRules } = require("./domainRules/familyRules");
const { evaluatePersonalityRules } = require("./domainRules/personalityRules");

/**
 * Analyzes an authoritative Phase 1 Swiss Ephemeris chart and produces structured,
 * deterministic astrological evidence across all key life domains.
 * 
 * @param {Object} chart - The calculated chart returned by calculateNatalChart
 * @returns {Object} Complete structured astrological evidence
 */
function analyzeChart(chart) {
  if (!chart || !chart.planets || !chart.ascendant || !chart.houses) {
    const error = new Error("Invalid chart object passed to Rule Engine. Must contain planets, ascendant, and houses.");
    error.code = "INVALID_CHART_OBJECT";
    throw error;
  }

  // 1. Evaluate Dignities for all 9 Grahas
  const dignities = {};
  for (const [key, planet] of Object.entries(chart.planets)) {
    dignities[key] = evaluateDignity(key, planet);
  }

  // 2. Evaluate 12 House Lords
  const houseLords = analyzeHouseLords(chart);

  // 3. Evaluate Parashari Aspects
  const aspects = calculateAspects(chart);

  // 4. Evaluate Classical Vedic Yogas
  const yogas = evaluateYogas(chart, houseLords);

  // Shared context for domain evaluators
  const context = {
    chart,
    houseLords,
    aspects,
    dignities,
    yogas
  };

  // 5. Evaluate Domain Rule Analyzers
  const rawCareer = evaluateCareerRules(context);
  const rawEducation = evaluateEducationRules(context);
  const rawRelationships = evaluateRelationshipRules(context);
  const rawFinance = evaluateFinanceRules(context);
  const rawFamily = evaluateFamilyRules(context);
  const rawPersonality = evaluatePersonalityRules(context);

  // 6. Aggregate Domain Evidence (Preserve Supporting vs Contradicting)
  const domains = {
    career: aggregateDomainEvidence("career", rawCareer),
    education: aggregateDomainEvidence("education", rawEducation),
    relationships: aggregateDomainEvidence("relationships", rawRelationships),
    finance: aggregateDomainEvidence("finance", rawFinance),
    family: aggregateDomainEvidence("family", rawFamily),
    personality: aggregateDomainEvidence("personality", rawPersonality)
  };

  // 7. Global Evidence Collection (flattened, deduplicated)
  const allEvidence = [
    ...rawCareer,
    ...rawEducation,
    ...rawRelationships,
    ...rawFinance,
    ...rawFamily,
    ...rawPersonality
  ];

  return {
    engineVersion: "Swiss Ephemeris Rule Engine 2.0",
    chartMetadata: {
      dob: chart.birthData?.dob,
      tob: chart.birthData?.tob,
      resolvedPlace: chart.birthData?.resolvedPlace,
      timezone: chart.birthData?.timezone,
      utcIso: chart.birthData?.utcIso,
      ascendantSign: chart.ascendant.sign,
      moonSign: chart.moon_sign,
      sunSign: chart.sun_sign,
      moonNakshatra: chart.nakshatra?.name,
      moonPada: chart.nakshatra?.pada
    },
    domains,
    dignities,
    houseLords,
    aspects,
    yogas,
    globalEvidence: allEvidence
  };
}

/**
 * Aggregates and classifies evidence for a given life domain.
 * Strictly preserves both supporting and contradicting factors without cancellation.
 * 
 * @param {string} domainName 
 * @param {Array<Object>} evidenceList 
 * @returns {Object} Aggregated domain summary
 */
function aggregateDomainEvidence(domainName, evidenceList) {
  const supportingFactors = [];
  const contradictingFactors = [];
  const neutralFactors = [];

  let totalScore = 0;

  for (const item of evidenceList) {
    totalScore += item.strength;

    if (item.strength > 0) {
      supportingFactors.push(item);
    } else if (item.strength < 0) {
      contradictingFactors.push(item);
    } else {
      neutralFactors.push(item);
    }
  }

  // Sort supporting descending (highest positive first)
  supportingFactors.sort((a, b) => b.strength - a.strength);

  // Sort contradicting ascending (most negative first)
  contradictingFactors.sort((a, b) => a.strength - b.strength);

  let netInfluence = "balanced";
  if (totalScore >= 15) {
    netInfluence = "strongly_supportive";
  } else if (totalScore >= 6) {
    netInfluence = "moderately_supportive";
  } else if (totalScore <= -15) {
    netInfluence = "strongly_challenging";
  } else if (totalScore <= -6) {
    netInfluence = "moderately_challenging";
  }

  return {
    domain: domainName,
    astrologicalEvidenceScore: totalScore,
    netInfluence,
    factorCounts: {
      supporting: supportingFactors.length,
      contradicting: contradictingFactors.length,
      neutral: neutralFactors.length,
      total: evidenceList.length
    },
    supportingFactors,
    contradictingFactors,
    neutralFactors
  };
}

module.exports = {
  analyzeChart,
  aggregateDomainEvidence
};
