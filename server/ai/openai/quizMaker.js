require('dotenv').config();
// const OpenAI = require('openai');

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });
const { GoogleGenerativeAI } = require("@google/generative-ai"); // ✅ fixed import
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);   // ✅ fixed instantiation

// 🧪 NEW: Pre-lab quiz from full experiment text
async function generateQuizFromText(text, apiKey) {
  if (!apiKey) throw new Error("Missing OpenAI API key");

  const prompt = `
You are a chemistry instructor preparing a **pre-lab quiz** based on the following experiment instructions.

Instructions:
${text}

Create **5 multiple choice questions** to test students' understanding before performing the lab. Focus on:
- Experimental steps
- Safety precautions
- Chemicals involved
- Equipment usage
- Data collection

Format each question like this:

Q: [question]
A. ...
B. ...
C. ...
D. ...
Answer: [correct letter]

Be accurate and informative.
  `;

  // const response = await openai.chat.completions.create({
  //   model: "gpt-3.5-turbo",
  //   messages: [{ role: "user", content: prompt }],
  //   temperature: 0.6
  // });
  const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" }); // or "gemini-pro"

const result = await model.generateContent({
  contents: [{ role: "user", parts: [{ text: prompt }] }],
});

const response = await result.response;
let raw = response.text();
raw = raw.replace(/```[a-z]*\s*([\s\S]*?)\s*```/, '$1').trim(); // ✅ Strip markdown fences

return raw; // This is the AI-generated content as a plain string
}

module.exports = {
  generateQuizFromText
};
