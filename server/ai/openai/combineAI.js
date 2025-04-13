require("dotenv").config();

// 🔒 OpenAI option (commented out for now)
// const OpenAI = require('openai');
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });

const { GoogleGenerativeAI } = require("@google/generative-ai"); // ✅ fixed import
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // ✅ fixed instantiation

let callCount = 0;

async function combineChemicalsAI(chemicalNames) {
  callCount++;
  console.log(`🔁 combineChemicalsAI call count: ${callCount}`);

  const prompt = `
You are a smart chemistry assistant. When the following chemicals are combined: ${chemicalNames.join(", ")}, return ONLY a valid JSON in this format:

{
  "products": ["<product1>", "<product2>", ...],
  "description": "<brief explanation of the reaction>",
  "hazard": "<Low | Moderate | High>",
  "balanced_equation": "<Balanced chemical equation with formulas, e.g. 2NaOH + H₂SO₄ → Na₂SO₄ + 2H₂O>",
  "safety_advisor": {
    "Hazards": "<list or explanation>",
    "PPE": "<recommended personal protective equipment>",
    "Emergency_Procedures": "<steps for spills or contact>",
    "Warnings": "<special precautions or incompatibilities>"
  },
  "safer_alternatives": {
    "Suggestions": "<alternative chemicals or practices>",
    "Explanation": "<why it’s safer>"
  }
}

Only return the JSON object. Make sure chemical formulas are correct and the equation is balanced.
`;

  console.log("🧠 Calling Gemini to get full combination result...");
  const start = Date.now();

  // ✅ Gemini API
  const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" }); // or "gemini-pro"
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  const response = await result.response;
  let content = response.text();
  content = content.replace(/```json\s*([\s\S]*?)\s*```/, "$1").trim(); // ✅ remove ```json ... ``` block

  console.log(content); // Log full AI output as plain text
  console.log(`🧠 Gemini response received in ${(Date.now() - start) / 1000}s`);

  if (!content) throw new Error("AI returned empty response.");

  try {
    return JSON.parse(content);
  } catch (err) {
    console.error("⚠️ Failed to parse AI JSON:", err.message);
    throw new Error("Invalid JSON returned by AI.");
  }

  // 🧠 OpenAI fallback option (commented for now)
  /*
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.6,
  });

  const content = response.choices[0].message.content?.trim();
  */
}
module.exports = { combineChemicalsAI };
