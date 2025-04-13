const { extractByNameMatching, extractWithOpenAI } = require('../ai/nlp/nerExtractor');
const db = require('../data/db.json');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const knownChemicals = db.map(c => c.name.toLowerCase());

exports.handleFileUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const ext = req.file.originalname.toLowerCase().split('.').pop();
    const buffer = req.file.buffer;

    let text = '';
    if (ext === 'txt') {
      text = buffer.toString('utf-8');
    } else if (ext === 'pdf') {
      const data = await pdfParse(buffer);
      text = data.text;
    } else if (ext === 'docx') {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else {
      return res.status(400).json({ error: 'Unsupported file format' });
    }

    // Step 1: Use AI to extract likely chemical names
    const aiResults = await extractWithOpenAI(text, process.env.OPENAI_API_KEY);

    // Step 2: Use local fallback (regex-based match)
    const basicMatched = extractByNameMatching(text);

    // Step 3: Combine both and remove duplicates
    const uniqueChemicals = Array.from(new Set([...aiResults, ...basicMatched]));

    // Step 4: Match back to original case from db.json
    const finalChemicals = db
      .filter(c => uniqueChemicals.includes(c.name.toLowerCase()))
      .map(c => c.name);

    res.json({
      chemicals: finalChemicals,
      text, // 👈 send back raw document text here
      source: aiResults.length > 0 ? 'ai-first' : basicMatched.length > 0 ? 'fallback' : 'none',
      details: {
        fromAI: finalChemicals.filter(c =>
          aiResults.includes(c.toLowerCase())
        ),
        fromFallback: finalChemicals.filter(c =>
          basicMatched.includes(c.toLowerCase()) && !aiResults.includes(c.toLowerCase())
        )
      }
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to process document', details: err.message });
  }
};
