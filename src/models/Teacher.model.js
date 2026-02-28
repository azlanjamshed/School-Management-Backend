const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        subject: {
            type: String,
            required: true,
            trim: true,
        },

        qualification: {
            type: String,
            trim: true,
        },

        phone: {
            type: String,
        },

        experience: {
            type: Number, // years
            default: 0,
        },
        about: {
            type: String,
        },

        address: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Teacher", teacherSchema);