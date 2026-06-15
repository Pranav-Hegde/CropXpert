const express = require("express");
const router = express.Router();

// POST /api/crops/recommend
router.post("/recommend", (req, res) => {
    const { temperature, humidity, ph, rainfall, soilType } = req.body;

    if (!temperature || !humidity || !ph || !rainfall || !soilType) {
        return res.status(400).json({ error: "Missing input fields" });
    }

    // Dummy logic — replace with ML logic later
    let crop = "Wheat";
    if (soilType.toLowerCase().includes("loam")) crop = "Sugarcane";
    else if (ph < 5.5) crop = "Rice";
    else if (rainfall > 200) crop = "Cotton";

    res.json({ crop });
});

module.exports = router;
