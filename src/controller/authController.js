const User = require("../models/User.model");


exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if (!user || !user.isActive) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await user.comparePassword(password)

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = user.generateToken();

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json({
            message: "Login successful",
            token,
            role: user.role,
            mustChangePassword: user.mustChangePassword,
        });


    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.logoutUser = async (req, res) => {
    try {

        res.clearCookie("token", {
            httpOnly: true,
            secure: false, // true in production (HTTPS)
            sameSite: "lax"
        });

        res.status(200).json({
            message: "Logged out successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};