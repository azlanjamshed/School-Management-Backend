const express = require("express");
const router = express.Router();

const isAuthenticate = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const { getMyProfile, changePassword } = require("../controller/studentController");

router.get(
    "/profile",
    isAuthenticate,
    roleMiddleware("student"),
    getMyProfile
);

router.put(
    "/change-password",
    isAuthenticate,
    roleMiddleware("student"),
    changePassword
);
module.exports = router;