const Chemical = require("../models/Chemical"); // ✅ MongoDB model
const { getChemicalData } = require("../utils/msdsSummarizer");
const { generateQuizFromText } = require("../ai/openai/quizMaker");
const { generateLabProcedureFromText } = require("../ai/openai/labProcedureGenerator");
const { combineChemicalsAI } = require("../ai/openai/combineAI");

/**
 * Get short summaries for a list of chemical names
 */
exports.getChemicalInfo = async (req, res) => {
  const { chemicalNames } = req.body;

  if (!Array.isArray(chemicalNames)) {
    return res.status(400).json({ error: "chemicalNames should be an array" });
  }

  try {
    const found = await Chemical.find({
      name: { $in: chemicalNames },
    });

    const summaries = found.map((chem) => ({
      name: chem.name,
      icon: chem.icon,
      cas_number: chem.cas_number,
      formula: chem.formula,
      molar_mass: chem.molar_mass,
      melting_point: chem.melting_point,
      boiling_point: chem.boiling_point,
      ph: chem.ph,
      density: chem.density,
      hazard_status: chem.hazard_status,
      solubility: chem.solubility,
      flammability: chem.flammability,
      hmnfpa: chem.hmnfpa,
      ppe: chem.ppe,
      handling: chem.handling,
      first_aid: chem.first_aid,
      disposal: chem.disposal,
    }));

    res.json(summaries);
  } catch (err) {
    console.error("❌ Error in getChemicalInfo:", err);
    res.status(500).json({ error: "Failed to fetch chemical info" });
  }
};

/**
 * Get full MSDS of a single chemical
 */
exports.getChemicalMSDS = async (req, res) => {
  const { name } = req.body;

  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "Chemical name is required" });
  }

  try {
    const match = await Chemical.findOne({
      name: new RegExp(`^${name}$`, "i"),
    });

    if (!match) {
      return res.status(404).json({ error: "Chemical not found" });
    }

    res.json(match);
  } catch (err) {
    console.error("❌ Error in getChemicalMSDS:", err);
    res.status(500).json({ error: "Failed to fetch MSDS" });
  }
};

/**
 * Combine chemicals using AI
 */
exports.combineChemicals = async (req, res) => {
  const { chemicals: chemicalNames } = req.body;
  console.log("🔻 Requested combination:", chemicalNames);

  console.time("combine-api");

  if (!Array.isArray(chemicalNames) || chemicalNames.length < 2) {
    return res.status(400).json({ error: "Provide at least 2 chemical names" });
  }

  try {
    const aiResponse = await combineChemicalsAI(chemicalNames);

    const productNames = aiResponse.products || [];
    const msdsList = productNames.map(getChemicalData).filter(Boolean);

    console.timeEnd("combine-api");

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
    res.status(500).json({ error: "Failed to analyze combination", details: err.message });
  }
};

/**
 * Return all known chemical names
 */
exports.listChemicals = async (req, res) => {
  try {
    const names = await Chemical.find({}, "name");
    res.json(names.map((c) => c.name));
  } catch (err) {
    console.error("❌ Error in listChemicals:", err);
    res.status(500).json({ error: "Failed to fetch chemical list" });
  }
};

/**
 * Generate safety quiz from text
 */
exports.generateChemicalQuiz = async (req, res) => {
  const { text } = req.body;
  console.log("🧪 Quiz requested for:", text);

  if (!text || typeof text !== "string" || text.trim().length < 10) {
    return res.status(400).json({ error: "Please provide valid experiment text." });
  }

  try {
    const quiz = await generateQuizFromText(text);
    res.json(quiz);
  } catch (err) {
    console.error("❌ Quiz generation error:", err);
    res.status(500).json({ error: "Quiz generation failed", details: err.message });
  }
};

/**
 * Generate AI-based lab procedure
 */
exports.createLabProcedure = async (req, res) => {
  const { text } = req.body;
  console.log("📄 Generating lab procedures from uploaded text...");

  if (!text || typeof text !== "string" || text.trim().length < 10) {
    return res.status(400).json({ error: "Please provide valid experiment text" });
  }

  try {
    const procedure = await generateLabProcedureFromText(text, process.env.OPENAI_API_KEY);
    res.json({ procedure, source: "ai" });
  } catch (err) {
    console.error("❌ Procedure generation error:", err);
    res.status(500).json({ error: "Failed to generate procedure", details: err.message });
  }
};
