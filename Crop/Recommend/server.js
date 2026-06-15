const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/Crop", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log("✅ MongoDB Atlas Connected Successfully");
    })
    .catch((err) => {
        console.error("❌ MongoDB Connection Failed:", err.message);
    });

app.use("/api/auth", require("./routes/auth"));
app.use('/api/crop', require('./routes/crop'));

app.listen(5000, () => {
    console.log("🚀 Server running on http://localhost:5000");
});
