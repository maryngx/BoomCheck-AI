const db = require('../data/db.json');

function getChemicalData(name) {
  return db.find(c => c.name.toLowerCase() === name.toLowerCase());
}

module.exports = { getChemicalData };
