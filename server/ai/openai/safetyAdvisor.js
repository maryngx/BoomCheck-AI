// require('dotenv').config();
// const OpenAI = require('openai');

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });

// async function safetyAdvisorAI(chemicalNames, apiKey) {
//   if (!apiKey) throw new Error("Missing OpenAI API key");

//   const prompt = `
// You are a chemical safety expert. Given the following chemical names: ${chemicalNames.join(", ")}

// 1. Identify any potential hazards of combining them.
// 2. Recommend the appropriate Personal Protective Equipment (PPE).
// 3. Describe safety precautions for handling.
// 4. Suggest emergency procedures for spills, skin contact, or inhalation.
// 5. Warn about specific incompatibilities or reactions.

// Give your response as 4 bullet points: Hazards, PPE, Emergency Procedures, and Warnings.
// `;

//   const response = await openai.chat.completions.create({
//     model: "gpt-3.5-turbo",
//     messages: [{ role: "user", content: prompt }],
//     temperature: 0.5
//   });

//   return response.choices[0].message.content;
// }

// module.exports = { safetyAdvisorAI };
