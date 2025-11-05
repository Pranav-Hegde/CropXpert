exports.recommendCrop = (req, res) => {
    const { temperature, humidity, ph, rainfall, soilType } = req.body;

    // Basic rule-based recommendation
    let crop = "Unknown";

    if (soilType === "Loamy" && ph >= 6 && ph <= 7 && rainfall >= 100 && rainfall <= 200) {
        crop = "Wheat";
    } else if (soilType === "Black" && ph >= 6.5 && ph <= 8 && temperature >= 25) {
        crop = "Cotton";
    } else if (soilType === "Alluvial" && rainfall >= 150 && ph >= 5.5 && ph <= 7) {
        crop = "Rice";
    } else if (ph >= 6 && ph <= 7.5 && temperature >= 20 && temperature <= 30) {
        crop = "Maize";
    }

    res.json({ recommendedCrop: crop });
};
