const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: true
    },

    age: {
      type: Number,
      required: true
    },

    bloodGroup: {
      type: String,
      required: true
    },

    units: {
      type: Number,
      required: true
    },

    urgency: {
      type: String,
      enum: ["Normal", "Urgent", "Critical"],
      default: "Normal"
    },

    hospital: {
      type: String,
      required: true
    },

    lat: {
      type: Number,
      required: true
    },

    lng: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: ["searching", "accepted", "completed", "cancelled"],
      default: "searching"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Request", requestSchema);
