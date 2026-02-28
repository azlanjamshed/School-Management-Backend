const express = require("express");
const router = express.Router();

const isAuthenticate = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const { getMyStudents, addOrUpdateMarks, updateAttendance } = require("../controller/teacherController");

router.get(
    "/my-students",
    isAuthenticate,
    roleMiddleware("teacher"),
    getMyStudents
);
router.put(
    "/add-marks/:studentId",
    isAuthenticate,
    roleMiddleware("teacher"),
    addOrUpdateMarks
);

router.put(
    "/update-attendance/:studentId",
    isAuthenticate,
    roleMiddleware("teacher"),
    updateAttendance
);
module.exports = router;