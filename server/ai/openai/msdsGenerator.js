const { GoogleGenerativeAI } = require("@google/generative-ai");
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function sanitizeGeminiOutput(text) {
    const jsonMatch = text.match(/```json([\s\S]*?)```/i) || text.match(/{[\s\S]*}/);
    if (!jsonMatch) throw new Error("❌ Gemini response did not include valid JSON.");
  
    const data = JSON.parse(jsonMatch[1] || jsonMatch[0]);
  
    // ✅ Defensive schema patching
    data.hmnfpa = data.hmnfpa || { health: 0, fire: 0, reactivity: 0 };
    if (!Array.isArray(data.ppe)) data.ppe = ["Lab coat", "Gloves", "Safety goggles"];
    if (typeof data.first_aid !== "object") {
      data.first_aid = { skin: "", eyes: "", inhalation: "", ingestion: "" };
    }
    if (typeof data.regulatory !== "object") {
      data.regulatory = { info: data.regulatory || "" };
    }
  
    return data;
  }
  

exports.generateMSDSWithGemini = async (chemicalName) => {
  const prompt = `
You are a chemistry assistant. Generate a Material Safety Data Sheet (MSDS) in strict JSON format (no markdown or HTML) for the chemical: "${chemicalName}".

Instructions:
- Use **Unicode subscripts** for digits in the formula. For example:
  - "H2O" → "H₂O"
  - "C7H6O2" → "C₇H₆O₂"
  - "Zn(NO3)2" → "Zn(NO₃)₂"
  - This means you must replace every digit in the formula with its Unicode subscript version (₀–₉).
  - Do NOT use HTML tags like <sub></sub> or plain digits like "H2O".

Return ONLY the JSON object, matching the schema below:

{
  "name": "string",
  "icon": "leave it empty/blank",
  "cas_number": "string",
  "formula": "string with Unicode subscripts (not HTML)",
  "molar_mass": "string",
  "melting_point": "string",
  "boiling_point": "string",
  "ph": "string",
  "density": "string",
  "hazard_status": "string",
  "solubility": "string",
  "flammability": "string",
  "hmnfpa": { "health": number, "fire": number, "reactivity": number },
  "ppe": [string],
  "handling": "string",
  "first_aid": "string or object",
  "disposal": "string",
  "incompatibilities": "string",
  "storage": "string",
  "spill_procedures": "string",
  "regulatory": "string or object",
  "environmental_hazard": "string"
}
`;

const model = ai.getGenerativeModel({ model: "gemini-1.5-pro" });
const result = await model.generateContent({
  contents: [{ role: "user", parts: [{ text: prompt }] }],
});

  const text = result.response.text();
  return sanitizeGeminiOutput(text);
};

exports.generateMSDSBatch = async (chemicalNames = []) => {
    const prompt = `
  You are a chemistry assistant.
  
  Generate strict JSON MSDS entries for the following chemicals:
  ${chemicalNames.join(", ")}
  
  Respond with a JSON array of objects. Each object must match this schema:
  
  {
    "name": "string",
    "icon": "string",
    "cas_number": "string",
    "formula": "string",
    "molar_mass": "string",
    "melting_point": "string",
    "boiling_point": "string",
    "ph": "string",
    "density": "string",
    "hazard_status": "string",
    "solubility": "string",
    "flammability": "string",
    "hmnfpa": { "health": number, "fire": number, "reactivity": number },
    "ppe": [string],
    "handling": "string",
    "first_aid": "string or object",
    "disposal": "string",
    "incompatibilities": "string",
    "storage": "string",
    "spill_procedures": "string",
    "regulatory": "string or object",
    "environmental_hazard": "string"
  }
  
  No explanation. No markdown. Only JSON array output.
  `;
  
    const model = ai.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
  
    const response = await result.response;
    let raw = response.text().replace(/```json\s*([\s\S]*?)```/, "$1").trim();
  
    return JSON.parse(raw);
};  
