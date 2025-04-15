# 🔬 BoomCheck – Backend

This is the backend server for **LabSafe AI – BoomCheck**, a chemistry-focused lab safety assistant web application. It handles file parsing, chemical extraction, MSDS lookups, AI-based hazard predictions, and document-driven content generation (quizzes, procedures, etc.).

Built with **Node.js + Express**, it powers the frontend React client with structured API routes, chemical safety intelligence, and AI integration via OpenAI and Gemini.

## 🎯 Key Features

- 📄 Upload `.pdf` / `.docx` experiment files for analysis.
- 🧪 Extract chemical names using NLP + LLM (Gemini).
- 📊 Serve MSDS data (short summary or full details).
- ⚗️ Predict chemical combinations:
  - Products
  - Hazards
  - Safety advisor tips
  - Safer alternatives
- 🧠 Generate:
  - Multiple-choice safety quizzes
  - AI-generated lab procedures
- 🔁 Rule-based fallback logic for known reactions.

## 🧪 Tech Stack

- **Framework**: Node.js + Express.js
- **AI Integration**: OpenAI, Google Gemini
- **Database**: LowDB (`db.json` as flat JSON MSDS store)
- **Parser Libraries**: `pdf-parse`, `mammoth` for DOCX
- **Custom Modules**:
  - AI (reaction prediction, safety tips, quiz/procedure generation)
  - NLP extraction
  - MSDS summarization and hazard rules

## 🛠 API Endpoints

Base URL: `/api`

| Method | Route            | Description                                               |
| ------ | ---------------- | --------------------------------------------------------- |
| POST   | `/upload`        | Upload and parse document, return extracted chemical list |
| POST   | `/info`          | Return MSDS summary (sections 1–5) for selected chemicals |
| POST   | `/msds`          | Return full MSDS (sections 1–10) for one chemical         |
| POST   | `/combine`       | Predict reaction product, hazard, and safety guidance     |
| GET    | `/list`          | List all known chemicals in the local database            |
| POST   | `/quiz`          | Generate multiple-choice safety quiz                      |
| POST   | `/lab-procedure` | Generate lab procedure text for uploaded experiment       |

## 🚀 Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Start the backend server**
   ```bash
   node index.js
   ```
3. **Base URL**
   ```bash
   http://localhost:5000
   ```
4. **Environmental variables**  
    Create a `.env` file with your keys:
   ```bash
   OPENAI_API_KEY=your_openai_key
   GEMINI_API_KEY=your_gemini_key
   ```

## 📦 Deployment

- Hosted on Render with persistent backend logic and database integration.

- Pairs with the frontend deployed on Vercel.

## 🔒 Security Notes

- Input validation is minimal — for educational/demo use only.

- AI modules are rate-limited and can be optimized via caching.
