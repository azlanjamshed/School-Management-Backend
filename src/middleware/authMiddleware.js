const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const userModel = require("../models/User.model");

const isAuthenticate = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {

            return res.status(401).json({
                message: "user is not Authenticate"
            })

        }
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                message: "JWT secret missing"
            })

        }

        const decode = jwt.verify(token, process.env.JWT_SECRET)

        req.user = await userModel.findById(decode.id)
        next()
    } catch (err) {
        console.error("JWT ERROR:", err.name, err.message);
        return res.status(401).json({
            message: "JWT is invalid. Please try again."
        })


    }
}

module.exports = isAuthenticate