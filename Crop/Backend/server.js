require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://pranavhegde:pranav123@cluster0.fos8jjm.mongodb.net/Crop?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log("✅ MongoDB Connected Successfully");
    })
    .catch((err) => {
        console.error("❌ MongoDB Connection Failed:", err.message);
    });

app.use("/api/auth", require("./routes/auth"));
app.use('/api/crop', require('./routes/crop'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
