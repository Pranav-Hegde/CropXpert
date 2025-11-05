const express = require("express");
const router = express.Router();
const { predictCrop } = require("../controllers/predictController");

router.post("/predict", predictCrop);
module.exports = router;
