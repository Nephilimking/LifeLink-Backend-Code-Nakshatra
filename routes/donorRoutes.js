const express = require("express");
const router = express.Router();
const Donor = require("../models/Donor");

// 🔹 Create New Donor Profile
router.post("/create", async (req, res) => {
  try {
    const { name, phone, dob, bloodGroup, weight, lat, lng, available } = req.body;

    // Validation
    if (!name || !phone || !bloodGroup || lat == null || lng == null) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const donor = new Donor({
      name,
      phone,
      dob,
      bloodGroup,
      weight,
      lat,
      lng,
      available: available !== undefined ? available : true
    });

    await donor.save();

    res.status(201).json({
      success: true,
      message: "Donor profile created successfully!",
      data: donor
    });

  } catch (err) {
    console.error("Error saving donor:", err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
});

// 🔹 Get all donors
router.get("/", async (req, res) => {
  try {
    const donors = await Donor.find();

    res.json({
      success: true,
      data: donors
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Toggle availability
router.patch("/:id/availability", async (req, res) => {
  try {
    const donor = await Donor.findByIdAndUpdate(
      req.params.id,
      { available: req.body.available },
      { new: true }
    );

    res.json({
      success: true,
      data: donor
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
