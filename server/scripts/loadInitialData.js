const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const Chemical = require("../models/Chemical");

const loadData = async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  const dataPath = path.join(__dirname, "../data/db.json");
  const rawData = fs.readFileSync(dataPath);
  const chemicals = JSON.parse(rawData);

  await Chemical.deleteMany(); // clean slate
  await Chemical.insertMany(chemicals);
  console.log("✅ Chemicals seeded to MongoDB Atlas");
  process.exit();
};

loadData();
