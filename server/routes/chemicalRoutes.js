const express = require('express');
const router = express.Router();
const {
  getChemicalInfo,
  getChemicalMSDS,
  combineChemicals,        // 🔁 Now does AI prediction + safety + advice
  listChemicals,
  generateChemicalQuiz,
  createLabProcedure
} = require('../controllers/chemicalController');

router.post('/info', getChemicalInfo);           // Get short MSDS summaries (sections 1–5)
router.post('/combine', combineChemicals);       // Predict + Analyze + Suggest for chemical combination
router.get('/list', listChemicals);              // Return all chemical names
router.post('/msds', getChemicalMSDS);           // Get full MSDS (all 10 sections)
router.post('/quiz', generateChemicalQuiz);      // Generate safety quiz based on extracted chemicals
router.post('/generate-procedure', createLabProcedure);  // AI-generated lab steps

module.exports = router;
