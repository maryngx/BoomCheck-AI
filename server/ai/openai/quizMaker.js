require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function parseRawQuiz(raw) {
  return raw
    .split(/Q\d+:/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const match = /Answer:\s*([A-D])/i.exec(block);
      const correctLetter = match ? match[1].toUpperCase() : "";
      const questionLines = block.split("Answer:")[0].trim().split("\n");
      const question = questionLines[0].trim();
      const choices = questionLines
        .slice(1)
        .map((line) => line.replace(/^[A-Da-d]\.\s*/, "").trim());

      const correctIndex = { A: 0, B: 1, C: 2, D: 3 }[correctLetter] ?? -1;
      const correct = choices[correctIndex] || "";

      if (!correct) {
        console.warn("⚠️ Could not match correct answer for:", question, {
          correctLetter,
          choices,
        });
      }

      return { question, choices, correct };
    });
}

// 🧪 AI quiz generator
async function generateQuizFromText(text) {
  const prompt = `
You are a chemistry instructor generating a multiple-choice **pre-lab quiz**.

You will be given an experiment. Create **exactly 5** questions. Focus on:
- Experimental steps
- Chemicals and equipment
- Safety precautions
- Measurement and pH

⚠️ FORMAT STRICTLY like this:
Q1: [Question text]
A. [Option A]
B. [Option B]
C. [Option C]
D. [Option D]
Answer: C

⚠️ IMPORTANT:
- Do not include explanations after "Answer:"
- Do not use markdown (**bold**, *, etc.)
- Do not add headings or intro text
- Start directly with: Q1: ...
- Answers must be a single letter: A, B, C, or D

📄 Experiment:
---
${text}
---
`;

  const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  const response = await result.response;
  let raw = response.text();
  console.log("🧠 Gemini Raw Output:\n", raw);
  raw = raw.replace(/```[a-z]*\s*([\s\S]*?)\s*```/, "$1").trim();
  console.log("📋 Raw Gemini quiz output:\n", raw);

  const parsedQuiz = parseRawQuiz(raw); // ✅ Gemini fix
  if (!parsedQuiz.length) {
    throw new Error(
      "Quiz parser returned zero questions. Possibly malformed Gemini response.",
    );
  }

  return {
    source: "ai",
    questions: parsedQuiz,
  };
}

module.exports = {
  generateQuizFromText,
};
