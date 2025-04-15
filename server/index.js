require("dotenv").config();               // ✔️ Loads .env variables

const connectDB = require("./config/db");
connectDB();                              // ✔️ Connects to MongoDB (should log success or error)

const express = require('express');
const cors = require('cors');

const uploadRoutes = require('./routes/uploadRoutes');   // ✔️ Custom routes
const chemicalRoutes = require('./routes/chemicalRoutes');

const app = express();
// app.use(cors({ origin: "http://localhost:5173" }));       // ✔️ Frontend CORS OK for local dev
app.use(cors({ origin: "https://boom-check-ai.vercel.app" }));       // ✔️ Frontend CORS OK for local dev
app.use(express.json());                                  // ✔️ Parse JSON payloads

// ✔️ Setup API routes
app.use('/api/upload', uploadRoutes);
app.use('/api', chemicalRoutes);

// ✔️ Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
