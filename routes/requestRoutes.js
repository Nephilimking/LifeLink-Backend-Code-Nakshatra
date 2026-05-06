const express = require("express");
const router = express.Router();

const Request = require("../models/Request");
const Donor = require("../models/Donor");

// 🔥 Distance function
function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;

  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// 🔹 Create request + match donors
router.post("/create", async (req, res) => {
  try {
    const {
      patientName,
      age,
      bloodGroup,
      units,
      urgency,
      hospital,
      lat,
      lng
    } = req.body;

    // 🔴 Validation
    if (
      !patientName ||
      !age ||
      !bloodGroup ||
      !units ||
      !urgency ||
      !hospital ||
      lat == null ||
      lng == null
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // 🔹 Save request
    const request = new Request({
      patientName,
      age,
      bloodGroup,
      units,
      urgency,
      hospital,
      lat,
      lng
    });

    await request.save();

    // 🔹 Find matching donors
    const donors = await Donor.find({
      bloodGroup: request.bloodGroup,
      available: true
    });

    // 🔥 Add distance
    const matched = donors.map(d => {
      const distance = getDistance(
        request.lat,
        request.lng,
        d.lat,
        d.lng
      );

      return {
        ...d._doc,
        distance
      };
    });

    // 🔥 Sort nearest first
    matched.sort((a, b) => a.distance - b.distance);

    // 🔥 Urgency-based filtering
    let maxDistance = 50;

    if (request.urgency === "Critical") {
      maxDistance = 10;
    } else if (request.urgency === "Urgent") {
      maxDistance = 25;
    }

    const nearby = matched.filter(
      d => d.distance <= maxDistance
    );

    res.json({
      success: true,
      message: "Request created",
      matchedDonors: nearby
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// 🔹 Accept request
router.patch("/accept/:id", async (req, res) => {
  try {
    const updated = await Request.findByIdAndUpdate(
      req.params.id,
      { status: "accepted" },
      { new: true }
    );

    res.json({
      success: true,
      message: "Request accepted",
      data: updated
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// 🔹 Complete request
router.patch("/complete/:id", async (req, res) => {
  try {
    const updated = await Request.findByIdAndUpdate(
      req.params.id,
      { status: "completed" },
      { new: true }
    );

    res.json({
      success: true,
      message: "Request completed",
      data: updated
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// 🔹 Cancel request
router.patch("/cancel/:id", async (req, res) => {
  try {
    const updated = await Request.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    );

    res.json({
      success: true,
      message: "Request cancelled",
      data: updated
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// 🔹 Get all requests
router.get("/", async (req, res) => {
  try {
    const requests = await Request.find();

    res.json({
      success: true,
      data: requests
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

module.exports = router;