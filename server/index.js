const express = require('express');
const cors = require('cors');
const uploadRoutes = require('./routes/uploadRoutes');
const chemicalRoutes = require('./routes/chemicalRoutes');

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use('/api/upload', uploadRoutes);
app.use('/api', chemicalRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
