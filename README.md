# BoomCheck AI

BoomCheck is a full-stack chemistry lab safety assistant built at **Hackabull 2025**. This web app analyzes experiment documents, extracts chemical names, displays Material Safety Data Sheets (MSDS), predicts reactions and hazards from chemical combinations, and generates safety tools like quizzes and lab procedures — all powered by **AI**.

> ⚡ Designed for students, researchers, and safety officers to explore chemical risks interactively and intelligently.

---

## 🔥 Live Demo

🚀 [boom-check-ai.vercel.app](https://boom-check-ai.vercel.app)  
🌐 Backend hosted via Render  
📎 AI-powered with OpenAI + Gemini

---

## 🧠 Features at a Glance

- 📁 Upload `.pdf` or `.docx` lab experiment files
- 🧪 Extract and explore chemicals mentioned in your document
- 📦 View MSDS summaries (sections 1–10) for each compound
- ⚗️ Combine chemicals to predict:
  - Product of reaction
  - Hazard level (color-coded)
  - Safety advisor tips
  - Safer alternatives
- 🧠 AI-powered quiz and lab procedure generation
- 🧲 Drag-and-drop chemical testing interface
- 🎨 Chemistry-themed, educational visual design

---

## 🧱 Tech Stack

| Layer    | Technologies                      |
| -------- | --------------------------------- |
| Frontend | React.js, Tailwind CSS, Vite      |
| Backend  | Node.js, Express.js               |
| AI       | OpenAI GPT, Google Gemini         |
| Parser   | pdf-parse, mammoth (DOCX)         |
| Database | MongoDB                           |
| Hosting  | Vercel (client) + Render (server) |

---

## 🧩 Project Structure

```
lab-safe-ai/
├── client/                  # React frontend
│   ├── public/
│   ├── src/
│   │	 ├── assets/
│   │	 ├── pages/
│   │	 │   ├── AnalyzeResult.jsx
│   │	 │   ├── CombineResult.jsx
│   │	 │   ├── Home.jsx
│   │	 │   ├── ProcedurePage.jsx
│   │	 │   ├── QuizPage.jsx
│   │	 │   ├── Workspace.jsx
│   │	 ├── components/      # UI components
│   │	 ├── services/        # API calls
│   │	 │   ├── api.js
│   │	 ├── utils/
│   │	 ├── contexts/        # State management
│   │	 │   ├── ChemicalContext.jsx
│   │	 ├── main.jsx
│   │	 ├── tailwind.css
│   │	 └── App.jsx
├── server/                  # Node.js backend
│   ├── ai/                  # NEW: Dedicated AI module
│   │	 ├── nlp/            # NLP logic for document parsing
│   │	 │   ├── nerExtractor.js
│   │	 ├── rules/           # Hazard rules (JSON/JS files)
│   │	 │   ├── reaction-rules.json
│   │	 │   ├── hazard-rules.json
│   │	 ├── openai/          # OpenAI API integration (future)
│   ├── controllers/         # API logic
│   │	 ├── chemicalController.js
│   │	 ├── uploadController.js
│   ├── routes/              # Express routes
│   │	 ├── chemicalRoutes.js
│   │	 ├── uploadRoutes.js
│   ├── utils/               # Parsers, OCR
│   │	 ├── hazardChecker.js
│   │	 ├── msdsSummarizer.js
│   └── data/
│   │	 ├── db.json         # LowDB database
│   ├── config/
│   ├── models/
│   ├── scripts/
│   ├── index.js
└── README.md
```

## 🚀 Getting Started (Local Dev)

### Prerequisites

- Node.js + npm
- `.env` file with:
  ```bash
  OPENAI_API_KEY=your_openai_key
  GEMINI_API_KEY=your_gemini_key
  ```

### 1. Clone the Repo

```bash
git clone https://github.com/yourusername/lab-safe-ai.git
cd lab-safe-ai
```

### 2. Start the Backend

```bash
cd server
npm install
node index.js
```

### 2. Start the Frontend

```bash
cd client
npm install
npm run dev
```

Access: http://localhost:5173

## 📦 Deployment

- Frontend: Vercel

- Backend: Render (free tier)

- AI: Gemini and OpenAI APIs with caching and fallback rules

## 👨‍🔬 Credits

Team:

- 👩‍🔬 Chemistry Expert

- 👨‍💻 Full-Stack Developer

- 🧠 AI Engineer

Built in 24 hours for Hackabull 2025 🎉
