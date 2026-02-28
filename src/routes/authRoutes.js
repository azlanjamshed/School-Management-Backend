const express = require("express");
const router = express.Router();
const { loginUser, logoutUser } = require("../controller/authController");

router.post("/login", loginUser);
router.post("/logout", logoutUser);
module.exports = router;