const { getLordOfHouse } = require("./houseLordRules");
const { DIGNITY_TABLE } = require("./dignityRules");

/**
 * Evaluates a clean, deterministic set of classical Vedic Yogas.
 * 
 * @param {Object} chart - Phase 1 chart object
 * @param {Array<Object>} houseLords - Result from analyzeHouseLords
 * @returns {Array<Object>} List of evaluated Yogas
 */
function evaluateYogas(chart, houseLords) {
  const yogas = [];
  const p = chart.planets;

  // 1. Gaja Kesari Yoga: Jupiter in Kendra (1, 4, 7, 10) from Moon
  if (p.jupiter && p.moon) {
    const houseFromMoon = ((p.jupiter.house - p.moon.house + 12) % 12) + 1;
    if ([1, 4, 7, 10].includes(houseFromMoon)) {
      yogas.push({
        id: "yoga_gaja_kesari",
        name: "Gaja Kesari Yoga",
        domain: ["personality", "career", "education"],
        effect: "positive",
        strength: 8,
        source: {
          jupiterHouse: p.jupiter.house,
          moonHouse: p.moon.house,
          distanceFromMoon: houseFromMoon
        },
        conditions: "Jupiter placed in an angular house (Kendra 1, 4, 7, 10) from the Moon.",
        reason: `Jupiter is in the ${houseFromMoon}th house from the Moon, forming Gaja Kesari Yoga, which indicates lasting intellect, public respect, and moral courage.`
      });
    }
  }

  // 2. Budhaditya Yoga: Sun and Mercury conjunct in the same house
  if (p.sun && p.mercury && p.sun.house === p.mercury.house) {
    yogas.push({
      id: "yoga_budhaditya",
      name: "Budhaditya Yoga",
      domain: ["education", "career", "personality"],
      effect: "positive",
      strength: 6,
      source: {
        house: p.sun.house,
        sunSign: p.sun.sign,
        mercurySign: p.mercury.sign
      },
      conditions: "Sun and Mercury placed conjunct in the same house.",
      reason: `Sun and Mercury are conjunct in house ${p.sun.house} (${p.sun.sign}), fostering analytical sharpness, commercial acuity, and intellectual agility.`
    });
  }

  // 3. Chandra-Mangala Yoga: Moon and Mars conjunct
  if (p.moon && p.mars && p.moon.house === p.mars.house) {
    yogas.push({
      id: "yoga_chandra_mangala",
      name: "Chandra-Mangala Yoga",
      domain: ["finance", "career"],
      effect: "positive",
      strength: 7,
      source: {
        house: p.moon.house,
        sign: p.moon.sign
      },
      conditions: "Moon and Mars conjunct in the same house.",
      reason: `Moon and Mars are conjunct in house ${p.moon.house} (${p.moon.sign}), uniting emotional drive with practical assertiveness in financial and resource creation.`
    });
  }

  // 4. Pancha Mahapurusha Yogas (Mars, Mercury, Jupiter, Venus, Saturn in Kendra in own or exalted sign)
  const mahapurushaChecks = [
    {
      key: "mars",
      name: "Ruchaka Yoga",
      planet: "Mars",
      ownExalted: ["Aries", "Scorpio", "Capricorn"],
      domain: ["career", "personality"],
      desc: "bestows executive drive, courage, and leadership authority"
    },
    {
      key: "mercury",
      name: "Bhadra Yoga",
      planet: "Mercury",
      ownExalted: ["Gemini", "Virgo"],
      domain: ["education", "career"],
      desc: "bestows superior analytical acumen, linguistic skill, and commercial mastery"
    },
    {
      key: "jupiter",
      name: "Hamsa Yoga",
      planet: "Jupiter",
      ownExalted: ["Sagittarius", "Pisces", "Cancer"],
      domain: ["education", "personality"],
      desc: "bestows high ethical standards, advisory stature, and philosophical wisdom"
    },
    {
      key: "venus",
      name: "Malavya Yoga",
      planet: "Venus",
      ownExalted: ["Taurus", "Libra", "Pisces"],
      domain: ["relationships", "finance"],
      desc: "bestows refined aesthetic sense, harmonious relationships, and material abundance"
    },
    {
      key: "saturn",
      name: "Sasa Yoga",
      planet: "Saturn",
      ownExalted: ["Capricorn", "Aquarius", "Libra"],
      domain: ["career", "personality"],
      desc: "bestows deep perseverance, organizational authority, and structural mastery"
    }
  ];

  for (const mp of mahapurushaChecks) {
    const planet = p[mp.key];
    if (planet && [1, 4, 7, 10].includes(planet.house) && mp.ownExalted.includes(planet.sign)) {
      yogas.push({
        id: `yoga_${mp.key}_mahapurusha`,
        name: mp.name,
        domain: mp.domain,
        effect: "positive",
        strength: 9,
        source: {
          planet: mp.planet,
          house: planet.house,
          sign: planet.sign
        },
        conditions: `${mp.planet} placed in a Kendra (1, 4, 7, 10) in own or exalted sign (${planet.sign}).`,
        reason: `${mp.planet} forms ${mp.name} in house ${planet.house}, which ${mp.desc}.`
      });
    }
  }

  // 5. Dharma-Karmadhipati Yoga: 9th lord and 10th lord connection
  const lord9 = getLordOfHouse(houseLords, 9);
  const lord10 = getLordOfHouse(houseLords, 10);
  if (lord9 && lord10 && lord9.placedInHouse === lord10.placedInHouse) {
    yogas.push({
      id: "yoga_dharma_karmadhipati",
      name: "Dharma-Karmadhipati Yoga",
      domain: ["career", "personality", "finance"],
      effect: "positive",
      strength: 9,
      source: {
        house: lord9.placedInHouse,
        lord9: lord9.lordName,
        lord10: lord10.lordName
      },
      conditions: "9th lord of dharma and 10th lord of action conjunct in the same house.",
      reason: `9th lord (${lord9.lordName}) and 10th lord (${lord10.lordName}) are conjunct in house ${lord9.placedInHouse}, uniting ethical vision with impactful professional execution.`
    });
  }

  // 6. Dhana Yogas (Wealth Linkage: 2nd and 11th houses/lords)
  const lord2 = getLordOfHouse(houseLords, 2);
  const lord11 = getLordOfHouse(houseLords, 11);
  if (lord2 && lord11) {
    if (lord2.placedInHouse === 11 || lord11.placedInHouse === 2 || lord2.placedInHouse === lord11.placedInHouse) {
      yogas.push({
        id: "yoga_dhana_2_11",
        name: "Dhana Yoga (Wealth Linkage)",
        domain: ["finance"],
        effect: "positive",
        strength: 8,
        source: {
          lord2: lord2.lordName,
          lord2House: lord2.placedInHouse,
          lord11: lord11.lordName,
          lord11House: lord11.placedInHouse
        },
        conditions: "Direct connection between 2nd lord (savings) and 11th lord (gains).",
        reason: `2nd lord (${lord2.lordName} in house ${lord2.placedInHouse}) and 11th lord (${lord11.lordName} in house ${lord11.placedInHouse}) form a Dhana Yoga, indicating solid capacity for capital accumulation and earnings.`
      });
    }
  }

  // 7. Vipareeta Raja Yogas (Dusthana lords in Dusthanas 6, 8, 12)
  const lord6 = getLordOfHouse(houseLords, 6);
  const lord8 = getLordOfHouse(houseLords, 8);
  const lord12 = getLordOfHouse(houseLords, 12);

  if (lord6 && [6, 8, 12].includes(lord6.placedInHouse)) {
    yogas.push({
      id: "yoga_harsha",
      name: "Harsha Vipareeta Raja Yoga",
      domain: ["career", "personality"],
      effect: "positive",
      strength: 6,
      source: { lord6: lord6.lordName, house: lord6.placedInHouse },
      conditions: "6th lord placed in a dusthana (6th, 8th, or 12th house).",
      reason: `6th lord (${lord6.lordName}) is placed in house ${lord6.placedInHouse}, shielding against direct adversaries and turning competitive challenges into career milestones.`
    });
  }

  if (lord8 && [6, 8, 12].includes(lord8.placedInHouse)) {
    yogas.push({
      id: "yoga_sarala",
      name: "Sarala Vipareeta Raja Yoga",
      domain: ["personality", "finance"],
      effect: "positive",
      strength: 6,
      source: { lord8: lord8.lordName, house: lord8.placedInHouse },
      conditions: "8th lord placed in a dusthana (6th, 8th, or 12th house).",
      reason: `8th lord (${lord8.lordName}) is placed in house ${lord8.placedInHouse}, granting resilience through unexpected turns of life.`
    });
  }

  if (lord12 && [6, 8, 12].includes(lord12.placedInHouse)) {
    yogas.push({
      id: "yoga_vimala",
      name: "Vimala Vipareeta Raja Yoga",
      domain: ["finance", "personality"],
      effect: "positive",
      strength: 6,
      source: { lord12: lord12.lordName, house: lord12.placedInHouse },
      conditions: "12th lord placed in a dusthana (6th, 8th, or 12th house).",
      reason: `12th lord (${lord12.lordName}) is placed in house ${lord12.placedInHouse}, assisting with containment of unnecessary expenditures and foreign opportunities.`
    });
  }

  // 8. Kemadruma Yoga (Moon isolation) & Cancellation check
  if (p.moon) {
    const moonHouse = p.moon.house;
    const house2FromMoon = (moonHouse % 12) + 1;
    const house12FromMoon = ((moonHouse - 2 + 12) % 12) + 1;

    // Physical planets excluding Sun, Rahu, Ketu
    const checkPlanets = ["mars", "mercury", "jupiter", "venus", "saturn"];
    const hasPlanetIn2 = checkPlanets.some((k) => p[k] && p[k].house === house2FromMoon);
    const hasPlanetIn12 = checkPlanets.some((k) => p[k] && p[k].house === house12FromMoon);

    if (!hasPlanetIn2 && !hasPlanetIn12) {
      // Check cancellation: planets in Kendra from Ascendant or Moon
      const hasKendraPlanet = checkPlanets.some(
        (k) => p[k] && ([1, 4, 7, 10].includes(p[k].house) || [1, 4, 7, 10].includes(((p[k].house - moonHouse + 12) % 12) + 1))
      );

      if (hasKendraPlanet) {
        yogas.push({
          id: "yoga_kemadruma_bhanga",
          name: "Kemadruma Bhanga (Cancelled Isolation)",
          domain: ["personality"],
          effect: "positive",
          strength: 3,
          source: { moonHouse },
          conditions: "Moon without flanking planets, but cancelled by angular planets from Ascendant or Moon.",
          reason: "While the Moon lacks flanking planets, the presence of angular planets cancels the Kemadruma condition, converting early periods of emotional solitude into self-sufficient focus."
        });
      } else {
        yogas.push({
          id: "yoga_kemadruma",
          name: "Kemadruma Yoga",
          domain: ["personality", "family"],
          effect: "negative",
          strength: -5,
          source: { moonHouse },
          conditions: "No physical planets (Mars, Mercury, Jupiter, Venus, Saturn) in 2nd or 12th from Moon.",
          reason: "The Moon has no planets in adjacent houses, indicating intermittent feelings of emotional solitude or a need to build independent psychological anchors."
        });
      }
    }
  }

  return yogas;
}

module.exports = {
  evaluateYogas
};
