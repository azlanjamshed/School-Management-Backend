const express = require("express");
const router = express.Router();

const isAuthenticate = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  createTeacher,
  getAllTeachers,
  createStudent,
  createClass,
  assignClassTeacher,
  bulkCreateTeachers,
  bulkCreateStudents,
  getAllStudents,
  me,
  getAllClasses,
  latestEnrollment,
  updateTeacher,
  toggleTeacherStatus,
  getTeacher,
  toggleStudentStatus,
  getStudent,
  getSingleClass,
  updateStudent,
} = require("../controller/adminController");

router.post(
  "/create-teacher",
  isAuthenticate,
  roleMiddleware("admin"),
  createTeacher,
);

router.post(
  "/create-bulk-teacher",
  isAuthenticate,
  roleMiddleware("admin"),
  bulkCreateTeachers,
);
// 👨‍🎓 Create Student

router.post(
  "/create-student",
  isAuthenticate,
  roleMiddleware("admin"),
  createStudent,
);
router.post(
  "/create-bulk-student",
  isAuthenticate,
  roleMiddleware("admin"),
  bulkCreateStudents,
);

router.post(
  "/create-class",
  isAuthenticate,
  roleMiddleware("admin"),
  createClass,
);
router.put(
  "/assign-class",
  isAuthenticate,
  roleMiddleware("admin"),
  assignClassTeacher,
);
router.get(
  "/get-all-teachers",
  isAuthenticate,
  roleMiddleware("admin"),
  getAllTeachers,
);
router.get(
  "/get-all-students",
  isAuthenticate,
  roleMiddleware("admin"),
  getAllStudents,
);
router.get(
  "/latest-enrollments",
  isAuthenticate,
  roleMiddleware("admin"),
  latestEnrollment,
);
router.get("/admin-profile", isAuthenticate, roleMiddleware("admin"), me);

router.get(
  "/get-all-classes",
  isAuthenticate,
  roleMiddleware("admin"),
  getAllClasses,
);

router.put(
  "/update-teacher/:id",
  isAuthenticate,
  roleMiddleware("admin"),
  updateTeacher,
);

router.put(
  "/toggle-teacher-status/:id",
  isAuthenticate,
  roleMiddleware("admin"),
  toggleTeacherStatus,
);
router.get("/teacher/:id", isAuthenticate, roleMiddleware("admin"), getTeacher);
router.put(
  "/toggle-student-status/:id",
  isAuthenticate,
  roleMiddleware("admin"),
  toggleStudentStatus,
);
router.put(
  "/update-student/:id",
  isAuthenticate,
  roleMiddleware("admin"),
  updateStudent,
);
router.get("/student/:id", isAuthenticate, roleMiddleware("admin"), getStudent);

router.get(
  "/class/:id",
  isAuthenticate,
  roleMiddleware("admin"),
  getSingleClass,
);
module.exports = router;
