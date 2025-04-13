require('dotenv').config();
const fs = require('fs');
const path = require('path');
// const OpenAI = require('openai');
const { GoogleGenerativeAI } = require("@google/generative-ai"); // ✅ fixed import
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);   // ✅ fixed instantiation

const dbPath = path.join(__dirname, '../../data/db.json');
const chemicalData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
const knownChemicals = chemicalData.map(c => c.name.toLowerCase());

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });

// 🧠 AI extractor (SAFE)
async function extractWithOpenAI(text, apiKey) {
  const prompt = `
You are a chemistry assistant.

From the following lab text, extract all chemical names that appear in the given list of known chemicals.

Return your answer ONLY as a JSON array of exact matches. Do not add any other text.

Example:
["sodium hydroxide", "benzoic acid"]

Known chemicals:
${knownChemicals.join(", ")}

Text:
${text}
`;

  // const response = await openai.chat.completions.create({
  //   model: "gpt-3.5-turbo",
  //   messages: [{ role: "user", content: prompt }],
  //   temperature: 0.3
  // });
  const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });
  
  const response = await result.response;
  let raw = response.text();
console.log("📨 Gemini raw output:", raw);

// ✅ Strip ```json ... ``` if present
raw = raw.replace(/```json\s*([\s\S]*?)\s*```/, '$1').trim();

  try {
    const parsed = JSON.parse(raw);

    // Filter to known ones (lowercase)
    const matched = parsed
      .map(name => name.toLowerCase().trim())
      .filter(name => knownChemicals.includes(name));

    return matched;
  } catch (err) {
    console.warn("AI extract JSON parse failed:", err.message);
    return [];
  }
}

// 🔍 Basic extractor using exact name match with case-insensitive regex
function extractByNameMatching(text) {
  const matches = new Set();
  const lowerText = text.toLowerCase();

  for (const name of knownChemicals) {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(lowerText)) {
      matches.add(name);
    }
  }

  return Array.from(matches);
}

module.exports = {
  extractByNameMatching,
  extractWithOpenAI
};
