// require('dotenv').config();
// const OpenAI = require('openai');

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });

// async function suggestSaferAlternatives(chemicalNames, apiKey) {
//   if (!apiKey) throw new Error("Missing OpenAI API key");

//   const prompt = `
// You are a chemical safety advisor.

// Given the chemical combination: ${chemicalNames.join(', ')}

// 1. If this combination is dangerous, suggest safer alternative chemicals or procedures.
// 2. If safe, explain why and confirm no alternative needed.
// 3. If slightly risky, suggest ways to reduce risk (e.g., dilute, adjust temperature, use fume hood).

// Respond with concise bullet points under these headings:
// - Risk Level
// - Suggestions
// - Explanation
// `;

//   const response = await openai.chat.completions.create({
//     model: "gpt-3.5-turbo",
//     messages: [{ role: "user", content: prompt }],
//     temperature: 0.6
//   });

//   return response.choices[0].message.content;
// }

// module.exports = { suggestSaferAlternatives };
