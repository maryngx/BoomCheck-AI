const { GoogleGenerativeAI } = require("@google/generative-ai");
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 🧠 AI extractor – now supports *any* chemical, not just known ones
async function extractWithGeminiAI(text) {
  const prompt = `
You are a smart chemistry assistant.

From the following lab document, extract a list of all chemical substances mentioned. This includes:
- Reagents
- Solutions
- Acids and bases
- Indicators
- Any compounds, elements, or formulas

Do NOT include lab instruments, procedures, or non-chemical items.

Return ONLY a JSON array of lowercase chemical names (e.g., ["sodium hydroxide", "citric acid"]). Do NOT add Markdown or any explanation.

Text:
"""
${text}
"""
`;

  const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  const response = await result.response;
  let raw = response.text();
  console.log("📨 Gemini raw output:", raw);

  // Remove ```json wrapper if present
  raw = raw.replace(/```json\s*([\s\S]*?)\s*```/, "$1").trim();

  try {
    const parsed = JSON.parse(raw);
    return parsed.map((name) => name.toLowerCase().trim());
  } catch (err) {
    console.warn("AI extract JSON parse failed:", err.message);
    return [];
  }
}

// 🔍 Regex fallback (unchanged)
function extractByNameMatching(text, knownChemicals) {
  const matches = new Set();
  const lowerText = text.toLowerCase();

  for (const name of knownChemicals) {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "i");
    if (regex.test(lowerText)) {
      matches.add(name);
    }
  }

  return Array.from(matches);
}

module.exports = {
  extractByNameMatching,
  extractWithGeminiAI,
};
