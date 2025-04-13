const express = require('express');
const router = express.Router();
const { handleFileUpload } = require('../controllers/uploadController');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });
router.post('/', upload.single('file'), handleFileUpload);

module.exports = router;
