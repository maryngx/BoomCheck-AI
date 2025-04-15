const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChemicalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String },
  cas_number: { type: String },
  formula: { type: String },
  molar_mass: { type: String }, // e.g., "56.11 g/mol"
  melting_point: { type: String }, // e.g., "360 °C"
  boiling_point: { type: String }, // e.g., "1,327 °C"
  ph: { type: String }, // e.g., "~13.5 (1% solution)"
  density: { type: String }, // e.g., "2.12 g/cm³ (solid)"
  hazard_status: { type: String }, // e.g., "Corrosive"
  solubility: { type: String },
  flammability: { type: String },

  hmnfpa: {
    health: { type: Number },
    fire: { type: Number },
    reactivity: { type: Number },
  },

  ppe: [{ type: String }], // e.g., ["Nitrile gloves", "Safety goggles", "Lab coat"]

  handling: { type: String },

  // 🧪 Make this flexible for either a string or an object
  first_aid: { type: Schema.Types.Mixed },

  disposal: { type: String },
  incompatibilities: { type: String },
  storage: { type: String },
  spill_procedures: { type: String },

  // 🧪 Make this flexible for either a string or an object
  regulatory: { type: Schema.Types.Mixed },

  environmental_hazard: { type: String },
});

module.exports = mongoose.model("Chemical", ChemicalSchema);
