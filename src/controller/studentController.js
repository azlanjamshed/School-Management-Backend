const Student = require("../models/Student.model");
const User = require("../models/User.model")

exports.getMyProfile = async (req, res) => {
    try {

        const userId = req.user._id;

        // Find student profile using logged-in userId
        const student = await Student.findOne({ userId })
            .populate("userId", "-password")
            .populate("classId");

        if (!student) {
            return res.status(404).json({
                message: "Student profile not found"
            });
        }

        res.status(200).json({
            success: true,
            student
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const userId = req.user._id;
        const { currentPassword, newPassword } = req.body;

        // 1️⃣ Validate input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: "Both current and new password are required"
            });
        }

        // 2️⃣ Get user
        const user = await User.findById(userId);
        

        // 3️⃣ Verify current password
        const isMatch = await user.comparePassword(currentPassword);

        if (!isMatch) {
            return res.status(400).json({
                message: "Current password is incorrect"
            });
        }

        // 4️⃣ Set new password
        user.password = newPassword;

        // 5️⃣ Reset mustChangePassword flag
        user.mustChangePassword = false;

        await user.save(); // pre-save hook hashes password

        res.status(200).json({
            message: "Password changed successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};