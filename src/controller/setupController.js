const User = require("../models/User.model");

exports.createAdmin = async (req, res) => {
    try {
        const { name, username, password } = req.body;

        // Check if admin already exists
        const existingAdmin = await User.findOne({ role: "admin" });

        if (existingAdmin) {
            return res.status(400).json({
                message: "Admin already exists"
            });
        }

        const admin = await User.create({
            name,
            username,
            password,
            role: "admin",
            mustChangePassword: false
        });
        const token = admin.generateToken();
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // true in production (HTTPS)
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });
        
        res.status(201).json({
            message: "Admin created successfully",
            token,

        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};