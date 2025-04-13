const path = require('path');
const rules = require('../ai/rules/hazard-rules.json');
const db = require('../data/db.json');

/**
 * Get full chemical object from name
 */
function getChemicalByName(name) {
  return db.find(c => c.name.toLowerCase() === name.toLowerCase());
}

/**
 * Basic compatibility fallback rules
 */
function applyFallbackChecks(chemicals) {
  const flags = {
    acids: [],
    bases: [],
    flammables: [],
    oxidizers: [],
    irritants: [],
  };

  for (const name of chemicals) {
    const chem = getChemicalByName(name);
    if (!chem) continue;

    const hazard = chem.hazard_status?.toLowerCase() || '';
    const incompat = chem.incompatibilities?.toLowerCase() || '';

    if (hazard.includes('corrosive') || incompat.includes('acid')) flags.bases.push(name);
    if (incompat.includes('base') || hazard.includes('acid')) flags.acids.push(name);
    if (hazard.includes('flammable')) flags.flammables.push(name);
    if (incompat.includes('oxidizer') || name.toLowerCase().includes('peroxide')) flags.oxidizers.push(name);
    if (hazard.includes('irritant')) flags.irritants.push(name);
  }

  const fallbackResults = [];

  if (flags.acids.length && flags.bases.length) {
    fallbackResults.push({
      chemicals: [...flags.acids, ...flags.bases],
      hazard: "Possible exothermic neutralization reaction",
      alternative: "Consider pre-diluting reagents and using protective equipment"
    });
  }

  if (flags.flammables.length && flags.oxidizers.length) {
    fallbackResults.push({
      chemicals: [...flags.flammables, ...flags.oxidizers],
      hazard: "Risk of fire or explosion when flammables mix with oxidizers",
      alternative: "Avoid open flames and store separately"
    });
  }

  if (flags.irritants.length && flags.bases.length) {
    fallbackResults.push({
      chemicals: [...flags.irritants, ...flags.bases],
      hazard: "Irritant and corrosive base combination may increase tissue damage risk",
      alternative: "Handle with enhanced PPE and separate procedures"
    });
  }

  return fallbackResults;
}

/**
 * Check for any hazardous interactions (explicit + fallback)
 */
function checkHazardRules(inputChemicals) {
  const normalizedInput = inputChemicals.map(name => name.toLowerCase());

  // First: Exact match rules
  const ruleMatches = rules
    .filter(rule => {
      const ruleChems = rule.chemicals.map(c => c.toLowerCase());
      return ruleChems.every(rc => normalizedInput.includes(rc));
    })
    .map(match => ({
      chemicals: match.chemicals,
      hazard: match.hazard,
      alternative: match.alternative || null
    }));

  // Then: Fallback logic
  const fallbackMatches = applyFallbackChecks(inputChemicals);

  if (ruleMatches.length || fallbackMatches.length) {
    return {
      status: 'hazard_detected',
      results: [...ruleMatches, ...fallbackMatches]
    };
  }

  return {
    status: 'safe',
    message: 'No dangerous combinations found'
  };
}

module.exports = { checkHazardRules };
