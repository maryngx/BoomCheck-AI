const {
  extractByNameMatching,
  extractWithGeminiAI,
} = require("../ai/nlp/nerExtractor");
const { generateMSDSBatch } = require("../ai/openai/msdsGenerator");

const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const Chemical = require("../models/Chemical");

function convertToSubscript(formula) {
  const subMap = {
    0: "₀",
    1: "₁",
    2: "₂",
    3: "₃",
    4: "₄",
    5: "₅",
    6: "₆",
    7: "₇",
    8: "₈",
    9: "₉",
  };
  return formula.replace(/\d/g, (d) => subMap[d] || d);
}

function getIconFromHazard(msds) {
  const status = msds.hazard_status?.toLowerCase() || "";
  const flame = msds.flammability?.toLowerCase() || "";

  if (flame.includes("flammable") || flame.includes("combustible")) return "🔥";
  if (
    status.includes("corrosive") ||
    status.includes("irritant") ||
    status.includes("harmful")
  )
    return "⚠️";
  return "✅";
}

exports.handleFileUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // 📄 1. Parse file to extract raw text
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

    // 📥 2. Get all known chemical names from DB
    const allChemicals = await Chemical.find({});
    const nameSet = new Set(
      allChemicals.map((c) => c.name?.toLowerCase().trim()),
    );

    // 🔎 3. Extract chemicals using AI + fallback
    const aiResults = await extractWithGeminiAI(text);
    const fallbackResults = extractByNameMatching(text, Array.from(nameSet));
    const extracted = Array.from(new Set([...aiResults, ...fallbackResults]));

    // 🔬 4. Separate new vs. existing chemicals (name check only)
    const isKnown = (name) => nameSet.has(name.toLowerCase().trim());
    const newNames = extracted.filter((name) => !isKnown(name));
    const finalChemicals = [...extracted];
    const newlyAddedChemicals = [];

    // 🧪 5. Generate and insert MSDS for new chemicals
    if (newNames.length > 0) {
      const msdsList = await generateMSDSBatch(newNames);

      for (const msds of msdsList) {
        if (msds.formula) {
          msds.formula = convertToSubscript(msds.formula);
        }
        msds.icon = msds.icon || getIconFromHazard(msds);

        const name = msds.name?.toLowerCase().trim();
        if (!name) {
          console.log(`⚠️ Skipping MSDS due to missing name`);
          continue;
        }

        if (nameSet.has(name)) {
          console.log(`⚠️ Already exists — skipping: ${msds.name}`);
          continue;
        }

        console.log(`🧪 Saving new chemical: ${msds.name}`);
        const newEntry = new Chemical(msds);
        await newEntry.save();

        newlyAddedChemicals.push(msds.name);
        nameSet.add(name);
      }
    }

    // 📤 6. Final response
    res.json({
      chemicals: finalChemicals,
      newlyAddedChemicals,
      text,
      source:
        aiResults.length > 0
          ? "ai-first"
          : fallbackResults.length > 0
            ? "fallback"
            : "none",
      details: {
        fromAI: finalChemicals.filter((name) =>
          aiResults.some((ai) => ai.toLowerCase() === name.toLowerCase()),
        ),
        fromFallback: finalChemicals.filter(
          (name) =>
            fallbackResults.some(
              (fb) => fb.toLowerCase() === name.toLowerCase(),
            ) &&
            !aiResults.some((ai) => ai.toLowerCase() === name.toLowerCase()),
        ),
      },
    });
  } catch (err) {
    console.error("Upload error:", err);
    res
      .status(500)
      .json({ error: "Failed to process document", details: err.message });
  }
};
