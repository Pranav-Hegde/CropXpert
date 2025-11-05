const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hash = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hash });
        res.status(201).json({ message: "User created", user });
    } catch (e) {
        res.status(400).json({ error: "Signup failed", details: e.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: "Invalid credentials" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.json({ token, user });
    } catch (e) {
        res.status(500).json({ error: "Login failed" });
    }
};

exports.getProfile = async (req, res) => {
    const user = await User.findById(req.userId).select("-password");
    res.json(user);
};
