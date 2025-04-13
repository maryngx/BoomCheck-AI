const {
  extractByNameMatching,
  extractWithGeminiAI,
} = require("../ai/nlp/nerExtractor");
const { generateMSDSBatch } = require("../ai/openai/msdsGenerator");

const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const Chemical = require("../models/Chemical"); // ✅ Mongoose model

exports.handleFileUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const ext = req.file.originalname.toLowerCase().split(".").pop();
    const buffer = req.file.buffer;

    let text = "";
    if (ext === "txt") {
      text = buffer.toString("utf-8");
    } else if (ext === "pdf") {
      const data = await pdfParse(buffer);
      text = data.text;
    } else if (ext === "docx") {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else {
      return res.status(400).json({ error: "Unsupported file format" });
    }

    const allChemicals = await Chemical.find({});
    const knownNames = allChemicals.map((c) => c.name.toLowerCase());
    const knownCas = new Set(allChemicals.map((c) => c.cas_number?.trim()));
    const knownNameSet = new Set(knownNames);

    const aiResults = await extractWithGeminiAI(text);
    const basicMatched = extractByNameMatching(text, knownNames);

    const uniqueChemicals = Array.from(new Set([...aiResults, ...basicMatched]));

    const finalChemicals = [];
    const newlyAddedChemicals = [];

    // 🧠 Pre-check: skip calling API for anything already in DB by name, formula, or cas_number
const lowerNameSet = new Set(allChemicals.map(c => c.name?.toLowerCase().trim()));
const lowerFormulaSet = new Set(allChemicals.map(c => c.formula?.toLowerCase().trim()));
const casSet = new Set(allChemicals.map(c => c.cas_number?.trim()));

// Step 1: Filter out known chemicals before calling Gemini
const toGenerate = uniqueChemicals.filter((name) => {
  const lower = name.toLowerCase().trim();
  return !lowerNameSet.has(lower);
});

let msdsList = [];

if (toGenerate.length > 0) {
  msdsList = await generateMSDSBatch(toGenerate);
}

for (const msdsData of msdsList) {
  const cas = msdsData.cas_number?.trim();
  const name = msdsData.name?.toLowerCase().trim();
  const formula = msdsData.formula?.toLowerCase().trim();

  if (!cas || !name || !formula) {
    console.log(`⚠️ Skipping incomplete entry: ${msdsData.name}`);
    continue;
  }

  if (casSet.has(cas) || lowerNameSet.has(name) || lowerFormulaSet.has(formula)) {
    console.log(`⚠️ Already exists by CAS/Name/Formula — skipping: ${msdsData.name}`);
    continue;
  }

  console.log(`🧪 Saving new chemical: ${msdsData.name}`);
  const newEntry = new Chemical(msdsData);
  await newEntry.save();

  finalChemicals.push(msdsData.name);
  newlyAddedChemicals.push(msdsData.name);

  // Update sets to prevent duplicate processing
  casSet.add(cas);
  lowerNameSet.add(name);
  lowerFormulaSet.add(formula);
}

    // ✅ Add known chemicals (based on name match) that were extracted
    const knownOnly = uniqueChemicals.filter(name => {
      return !newlyAddedChemicals.includes(name);
    });

    for (const name of knownOnly) {
      const match = allChemicals.find(c => c.name.toLowerCase() === name.toLowerCase());
      if (match && !finalChemicals.includes(match.name)) {
        finalChemicals.push(match.name);
      }
    }

    res.json({
      chemicals: finalChemicals,
      newlyAddedChemicals,
      text,
      source: aiResults.length > 0 ? "ai-first" : basicMatched.length > 0 ? "fallback" : "none",
      details: {
        fromAI: finalChemicals.filter(name =>
          aiResults.some(ai => ai.toLowerCase() === name.toLowerCase())
        ),
        fromFallback: finalChemicals.filter(name =>
          basicMatched.some(fb => fb.toLowerCase() === name.toLowerCase()) &&
          !aiResults.some(ai => ai.toLowerCase() === name.toLowerCase())
        ),
      },
    });

  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Failed to process document", details: err.message });
  }
};

