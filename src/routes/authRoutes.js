const express = require("express");
const router = express.Router();
const { loginUser, logoutUser, checkAuth } = require("../controller/authController");
const isAuthenticate = require("../middleware/authMiddleware");

router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", isAuthenticate, checkAuth);
module.exports = router;