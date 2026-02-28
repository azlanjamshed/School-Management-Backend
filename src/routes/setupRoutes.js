const express = require("express");
const router = express.Router();

const { createAdmin } = require("../controller/setupController");

router.post("/create-admin", createAdmin);

module.exports = router;