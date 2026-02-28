const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            enum: ["admin", "teacher", "student"],
            required: true,
        },

        mustChangePassword: {
            type: Boolean,
            default: true,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);


userSchema.pre("save", async function () {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)

})

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}



userSchema.methods.generateToken = function () {
    return jwt.sign(
        { id: this._id, role: this.role },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRE || "1d"
        }
    );
};

const userModel = mongoose.model("User", userSchema);
module.exports = userModel