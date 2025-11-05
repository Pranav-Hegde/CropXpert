const axios = require("axios");

exports.predictCrop = async (req, res) => {
    try {
        const response = await axios.post("http://localhost:5000/predict", req.body);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to get prediction" });
    }
};
