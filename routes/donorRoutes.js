const express = require("express");
const router = express.Router();
const Donor = require("../models/Donor");

// 🔹 Register donor
router.post("/register", async (req, res) => {
  try {
    const { name, bloodGroup, lat, lng } = req.body;

    // Validation
    if (!name || !bloodGroup || lat == null || lng == null) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const donor = new Donor({
      name,
      bloodGroup,
      lat,
      lng,
      available: true
    });

    await donor.save();

    res.json({
      success: true,
      message: "Donor registered successfully",
      data: donor
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
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