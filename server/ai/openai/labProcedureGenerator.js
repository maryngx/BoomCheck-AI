require("dotenv").config();
// const OpenAI = require('openai');

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });
const { GoogleGenerativeAI } = require("@google/generative-ai"); // ✅ fixed import
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // ✅ fixed instantiation

async function generateLabProcedureFromText(text, apiKey) {
  // if (!apiKey) throw new Error("Missing OpenAI API key");

  const prompt = `
    You are a chemistry lab assistant. The following experiment document contains several sections, including lab procedure, post-lab questions, and equipment used.

    Your task is to extract and rewrite each of these three sections in a clear, concise, and more readable format. Focus on clarity and brevity while preserving all important details.

    Format your response as a JSON object like this:
      {
        "lab_procedure": [Summarized and rewritten list of the lab procedure steps here.],
        "post_lab_questions": [Clean and readable list of post-lab questions here.],
        "equipment": [Bullet-point list of equipment mentioned or implied in the document.]
      }

    Experiment Document:
    ${text}

    Only return valid JSON output without extra explanation.
  `;

  // const response = await openai.chat.completions.create({
  //   model: "gpt-3.5-turbo",
  //   messages: [{ role: "user", content: prompt }],
  //   temperature: 0.5
  // });
  const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" }); // You can change to gemini-pro if needed

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  const response = await result.response;
  let content = response.text();
  content = content.replace(/```json\s*([\s\S]*?)\s*```/, "$1").trim(); // ✅ remove ```json ... ``` block
  console.log(content);

  return content;
}

module.exports = { generateLabProcedureFromText };
