const db = require("../data/db.json");
const { getChemicalData } = require("../utils/msdsSummarizer");
// const { predictReaction } = require('../ai/models/reactionPredictor');
// const { safetyAdvisorAI } = require('../ai/openai/safetyAdvisor');
// const { suggestSaferAlternatives } = require('../ai/openai/suggestionEngine');
const { generateQuizFromText } = require("../ai/openai/quizMaker");
const {
  generateLabProcedureFromText,
} = require("../ai/openai/labProcedureGenerator");
const { combineChemicalsAI } = require("../ai/openai/combineAI");

/**
 * Get short summaries for a list of chemical names
 */
exports.getChemicalInfo = (req, res) => {
  const { chemicalNames } = req.body;

  if (!Array.isArray(chemicalNames)) {
    return res.status(400).json({ error: "chemicalNames should be an array" });
  }

  const summaries = chemicalNames
    .map((name) => {
      const full = getChemicalData(name);
      if (!full) return null;

      // Return only sections 1–5
      return {
        name: full.name,
        icon: full.icon,
        cas_number: full.cas_number,
        formula: full.formula,
        molar_mass: full.molar_mass,
        melting_point: full.melting_point,
        boiling_point: full.boiling_point,
        ph: full.ph,
        density: full.density,
        hazard_status: full.hazard_status,
        solubility: full.solubility,
        flammability: full.flammability,
        hmnfpa: full.hmnfpa,
        ppe: full.ppe,
        handling: full.handling,
        first_aid: full.first_aid,
        disposal: full.disposal,
      };
    })
    .filter(Boolean);

  res.json(summaries);
};

/**
 * Get full MSDS of a single chemical
 */
exports.getChemicalMSDS = (req, res) => {
  const { name } = req.body;

  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "Chemical name is required" });
  }

  const match = db.find((c) => c.name.toLowerCase() === name.toLowerCase());

  if (!match) {
    return res.status(404).json({ error: "Chemical not found" });
  }

  res.json(match);
};

/**
 * Check for hazards when combining multiple chemicals
 */
// exports.combineChemicals = async (req, res) => {
//   const { chemicals: chemicalNames } = req.body;
//   console.log("🔻 Requested combination:", chemicalNames);

//   if (!Array.isArray(chemicalNames) || chemicalNames.length < 2) {
//     return res.status(400).json({ error: 'Provide at least 2 chemical names' });
//   }

//   try {
//     // 1. Predict the reaction via AI
//     const reaction = await predictReaction(chemicalNames, process.env.OPENAI_API_KEY);
//     console.log("🧪 Predicted reaction result:", reaction);

//     const productNames = reaction?.products || [];

//     // 2. Fetch MSDS for all predicted products (if known)
//     const msdsList = productNames
//       .map(getChemicalData)
//       .filter(Boolean); // only keep matches found in db.json

//     // 3. AI safety advice
//     const safetyAdvisor = await safetyAdvisorAI(chemicalNames, process.env.OPENAI_API_KEY);

//     // 4. AI safer alternatives
//     const saferAlternatives = await suggestSaferAlternatives(chemicalNames, process.env.OPENAI_API_KEY);
//     console.log("🌿 Safer alternatives:", saferAlternatives);

//     res.json({
//       products: productNames.length > 0 ? productNames : ["Unknown"],
//       msds: msdsList, // array of MSDS objects
//       reactionDescription: reaction?.description || "No description available",
//       hazardLevel: reaction?.hazard || "Unknown",
//       safetyAdvisor,
//       saferAlternatives,
//       source: 'ai'
//     });
//   } catch (err) {
//     console.error('Error in combineChemicals:', err);
//     res.status(500).json({ error: 'Failed to analyze combination', details: err.message });
//   }
// };

exports.combineChemicals = async (req, res) => {
  const { chemicals: chemicalNames } = req.body;
  console.log("🔻 Requested combination:", chemicalNames);

  console.time("combine-api"); // started

  if (!Array.isArray(chemicalNames) || chemicalNames.length < 2) {
    return res.status(400).json({ error: "Provide at least 2 chemical names" });
  }

  try {
    const aiResponse = await combineChemicalsAI(chemicalNames);

    const productNames = aiResponse.products || [];
    const msdsList = productNames.map(getChemicalData).filter(Boolean);

    console.timeEnd("combine-api"); // 🧪 finished

    res.json({
      products: productNames.length > 0 ? productNames : ["Unknown"],
      msds: msdsList,
      reactionDescription: aiResponse.description || "No description available",
      hazardLevel: aiResponse.hazard || "Unknown",
      balancedEquation: aiResponse.balanced_equation || "Unknown",
      safetyAdvisor: aiResponse.safety_advisor || {},
      saferAlternatives: aiResponse.safer_alternatives || {},
      source: "ai",
    });

    console.timeEnd("⏱️ Combine API Time");
  } catch (err) {
    console.error("❌ Error in combineChemicals:", err);
    res
      .status(500)
      .json({ error: "Failed to analyze combination", details: err.message });
  }
};

/**
 * Return all known chemical names
 */
exports.listChemicals = (req, res) => {
  const names = db.map((c) => c.name);
  res.json(names);
};

exports.generateChemicalQuiz = async (req, res) => {
  const { text } = req.body;
  console.log("🧪 Quiz requested for:", text);

  if (!text || typeof text !== "string" || text.trim().length < 10) {
    return res
      .status(400)
      .json({ error: "Please provide valid experiment text." });
  }

  try {
    const quiz = await generateQuizFromText(text); // Already parsed ✅
    res.json(quiz);
  } catch (err) {
    console.error("❌ Quiz generation error:", err);
    res
      .status(500)
      .json({ error: "Quiz generation failed", details: err.message });
  }
};

exports.createLabProcedure = async (req, res) => {
  const { text } = req.body;
  console.log("📄 Generating lab procedures from uploaded text...");

  if (!text || typeof text !== "string" || text.trim().length < 10) {
    return res
      .status(400)
      .json({ error: "Please provide valid experiment text" });
  }

  try {
    const procedure = await generateLabProcedureFromText(
      text,
      process.env.OPENAI_API_KEY,
    );
    res.json({ procedure, source: "ai" });
  } catch (err) {
    console.error("❌ Procedure generation error:", err);
    res
      .status(500)
      .json({ error: "Failed to generate procedure", details: err.message });
  }
};
