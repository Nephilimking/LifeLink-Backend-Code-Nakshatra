const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  dob: { type: String },
  bloodGroup: { type: String, required: true },
  weight: { type: Number },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  available: { type: Boolean, default: true }
}, { 
  timestamps: true 
});

module.exports = mongoose.model("Donor", donorSchema);
