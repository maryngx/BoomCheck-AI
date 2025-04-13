// require('dotenv').config();
// const fs = require('fs');
// const path = require('path');
// const OpenAI = require('openai');

// const rulesPath = path.join(__dirname, '../rules/reaction-rules.json');
// const rules = JSON.parse(fs.readFileSync(rulesPath, 'utf-8'));

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });

// // 🧠 AI-first: Predict product + explanation + hazard level
// async function predictReactionWithAI(chemicalNames) {
//   const prompt = `
// You are a chemistry assistant. When the following chemicals are mixed: ${chemicalNames.join(", ")}, respond in this JSON format:

// {
//   "products": ["<product1>", "<product2>", ...],
//   "description": "<brief reaction explanation>",
//   "hazard": "<Low | Moderate | High>"
// }

// Only return the JSON object.
// `;

//   const response = await openai.chat.completions.create({
//     model: "gpt-4",
//     messages: [{ role: "user", content: prompt }],
//     temperature: 0.6
//   });

//   const content = response.choices[0].message.content?.trim();

//   if (!content) throw new Error("AI returned empty response.");

//   try {
//     const json = JSON.parse(content);
//     return {
//       products: json.products || [],
//       description: json.description || "No description provided.",
//       hazard: json.hazard || "Unknown",
//       source: 'ai'
//     };
//   } catch (err) {
//     console.warn("Failed to parse AI JSON:", err.message);
//     return {
//       products: [],
//       description: content,
//       hazard: "Unknown",
//       source: 'ai'
//     };
//   }
// }

// // 🧪 Rule-based fallback
// function findRuleBasedReaction(chemicalNames) {
//   const normalized = chemicalNames.map(c => c.toLowerCase());

//   for (const rule of rules) {
//     const reactants = rule.reactants.map(r => r.toLowerCase());
//     const matched = reactants.every(r => normalized.includes(r));

//     if (matched) {
//       return {
//         type: rule.type,
//         products: rule.products,
//         description: `Rule-based match for reaction: ${rule.reactants.join(" + ")} → ${rule.products.join(" + ")}`,
//         hazard: rule.hazard || "Unknown",
//         source: 'rule-based'
//       };
//     }
//   }

//   return null;
// }

// // 🔁 Main predictor
// async function predictReaction(chemicalNames, apiKey = process.env.OPENAI_API_KEY) {
//   try {
//     if (apiKey) {
//       const aiResult = await predictReactionWithAI(chemicalNames);
//       if (aiResult?.products?.length) return aiResult;
//     }
//   } catch (err) {
//     console.warn("AI prediction failed, falling back to rule-based:", err.message);
//   }

//   const ruleMatch = findRuleBasedReaction(chemicalNames);
//   if (ruleMatch) return ruleMatch;

//   return {
//     message: "No AI prediction and no rule-based match found.",
//     source: 'none'
//   };
// }

// module.exports = { predictReaction };
