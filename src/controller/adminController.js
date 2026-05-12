const User = require("../models/User.model");
const Teacher = require("../models/Teacher.model");
const Student = require("../models/Student.model");
const Class = require("../models/Class.model");

exports.createTeacher = async (req, res) => {
  try {
    const {
      name,
      username,
      password,
      subject,
      qualification,
      phone,
      experience,
      address,
    } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    // Create User (role = student)
    const user = await User.create({
      name,
      username,
      password,
      role: "teacher",
    });

    // Create Teacher profile
    const student = await Teacher.create({
      userId: user._id,
      subject,
      qualification,
      phone,
      experience,
      address,
    });

    res.status(201).json({
      message: "Teacher created successfully",
      student,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
exports.bulkCreateTeachers = async (req, res) => {
  try {
    const teachersData = req.body; // Expecting array

    if (!Array.isArray(teachersData)) {
      return res.status(400).json({
        message: "Request body must be an array of teachers",
      });
    }

    const createdTeachers = [];

    for (const data of teachersData) {
      const {
        name,
        username,
        password,
        subject,
        qualification,
        phone,
        experience,
        address,
      } = data;

      // Check existing username
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        continue; // skip duplicate
      }

      // Create user
      const user = await User.create({
        name,
        username,
        password,
        role: "teacher",
      });

      // Create student profile
      const student = await Teacher.create({
        userId: user._id,
        subject,
        qualification,
        phone,
        experience,
        address,
      });

      createdTeachers.push(student);
    }

    res.status(201).json({
      message: "Bulk student creation completed",
      totalCreated: createdTeachers.length,
      teachers: createdTeachers,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find()
      .populate("userId", "-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: teachers.length,
      teachers,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const { name, username, password, classId, rollNumber, phone } = req.body;

    // 1️⃣ Check username already exists
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    // 2️⃣ Check class exists
    const existingClass = await Class.findById(classId);

    if (!existingClass) {
      return res.status(404).json({
        message: "Class not found",
      });
    }

    // 3️⃣ Create User (role = student)
    const user = await User.create({
      name,
      username,
      password,
      role: "student",
    });

    // 4️⃣ Create Student Profile
    const student = await Student.create({
      userId: user._id,
      classId,
      rollNumber,
      attendance: 0,
      phone,
      terms: [],
    });

    // 5️⃣ Return populated student
    const studentData = await Student.findById(student._id)
      .populate("userId", "-password")
      .populate("classId");

    res.status(201).json({
      message: "Student created successfully",
      student: studentData,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
exports.bulkCreateStudents = async (req, res) => {
  try {
    const studentsData = req.body;

    if (!Array.isArray(studentsData)) {
      return res.status(400).json({
        message: "Request body must be an array",
      });
    }

    const createdStudents = [];
    const skipped = [];

    for (const data of studentsData) {
      const { name, username, password, classId, rollNumber } = data;

      // 1️⃣ Check username
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        skipped.push({ username, reason: "Username exists" });
        continue;
      }

      // 2️⃣ Check class
      const existingClass = await Class.findById(classId);
      if (!existingClass) {
        skipped.push({ username, reason: "Class not found" });
        continue;
      }

      // 3️⃣ Create user
      const user = await User.create({
        name,
        username,
        password,
        role: "student",
      });

      // 4️⃣ Create student
      const student = await Student.create({
        userId: user._id,
        classId,
        rollNumber,
        attendance: 0,
        terms: [],
      });

      // 5️⃣ Populate
      const populatedStudent = await Student.findById(student._id)
        .populate("userId", "-password")
        .populate("classId");

      createdStudents.push(populatedStudent);
    }

    res.status(201).json({
      message: "Bulk student creation completed",
      totalCreated: createdStudents.length,
      totalSkipped: skipped.length,
      createdStudents,
      skipped,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.createClass = async (req, res) => {
  try {
    const { className, section, classTeacher } = req.body;

    const newClass = await Class.create({
      className,
      section,
      classTeacher, // optional (can assign later)
    });

    res.status(201).json({
      message: "Class created successfully",
      class: newClass,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.assignClassTeacher = async (req, res) => {
  try {
    const { classId, teacherId } = req.body;

    // 1️⃣ Check student exists
    const teacher = await Teacher.findById(teacherId).populate(
      "userId",
      "-password",
    );

    if (!teacher) {
      return res.status(400).json({
        message: "Invalid teacher",
      });
    }

    // 2️⃣ Update class
    const updatedClass = await Class.findByIdAndUpdate(
      classId,
      { classTeacher: teacherId },
      { new: true },
    ).populate({
      path: "classTeacher",
      populate: {
        path: "userId",
        select: "name username",
      },
    });

    // .populate("classTeacher", "-password");

    if (!updatedClass) {
      return res.status(404).json({
        message: "Class not found",
      });
    }

    res.status(200).json({
      message: "Teacher assigned successfully",
      class: updatedClass,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const student = await Student.find()
      .populate("classId")
      .populate("userId", "-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: student.length,
      student,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.me = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find student profile using logged-in userId
    const admin = await User.findById(userId).select("-password");

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate({
      path: "classTeacher",
      populate: {
        path: "userId",
        select: "name username",
      },
    });

    // .populate("classTeacher", "-password");

    res.status(200).json({
      success: true,
      count: classes.length,
      classes,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.latestEnrollment = async (req, res) => {
  try {
    const students = await Student.find()
      .populate("classId")
      .populate("userId", "-password")
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// exports.updateTeacher = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const teacher = await Teacher.findById(id).populate("userId", "-password");

//     if (!teacher) {
//       return res.status(404).json({
//         message: "Teacher not found",
//       });
//     }
//     const { subject, qualification, phone, experience, address, name } =
//       req.body;

//     if (subject) teacher.subject = subject;
//     if (qualification) teacher.qualification = qualification;
//     if (phone) teacher.phone = phone;
//     if (experience) teacher.experience = experience;
//     if (address) teacher.address = address;

//     // update User name
//     if (name) {
//       teacher.userId.name = name;
//       await teacher.userId.save();
//     }

//     await teacher.save();
//     console.log(teacher);

//     res.status(200).json({
//       message: "Teacher updated successfully",
//       teacher,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

exports.updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.findById(id).populate("userId", "-password");

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    const {
      subject,
      qualification,
      phone,
      experience,
      address,
      name,
      username,
    } = req.body;

    // Update teacher fields
    if (subject) teacher.subject = subject;
    if (qualification) teacher.qualification = qualification;
    if (phone) teacher.phone = phone;
    if (experience) teacher.experience = experience;
    if (address) teacher.address = address;

    // Update user fields
    if (name) teacher.userId.name = name;

    if (username) {
      const existingUser = await User.findOne({
        username,
        _id: { $ne: teacher.userId._id },
      });

      if (existingUser) {
        return res.status(400).json({
          message: "Username already exists",
        });
      }

      teacher.userId.username = username;
    }

    await teacher.userId.save();
    await teacher.save();

    const updatedTeacher = await Teacher.findById(id).populate(
      "userId",
      "-password",
    );

    res.status(200).json({
      message: "Teacher updated successfully",
      teacher: updatedTeacher,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id).populate("userId", "-password");

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    const { name, username, rollNumber, classId, parentsName, phone } =
      req.body;

    // Update student fields
    if (rollNumber) student.rollNumber = rollNumber;
    if (classId) student.classId = classId;
    if (parentsName) student.parentsName = parentsName;
    if (phone) student.phone = phone;

    // Update user fields
    if (name) student.userId.name = name;

    if (username) {
      const existingUser = await User.findOne({
        username,
        _id: { $ne: student.userId._id },
      });

      if (existingUser) {
        return res.status(400).json({
          message: "Username already exists",
        });
      }

      student.userId.username = username;
    }
    await student.userId.save();
    await student.save();

    const updatedStudent = await Student.findById(id).populate(
      "userId",
      "-password",
    );

    res.status(200).json({
      message: "Student updated successfully",
      student: updatedStudent,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.disableTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.findById(id);

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    // disable student
    teacher.isActive = false;
    await teacher.save();

    // disable login
    await User.findByIdAndUpdate(teacher.userId, {
      isActive: false,
    });

    res.status(200).json({
      message: "Teacher disabled successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.enableTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.findById(id);

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    // enable student
    teacher.isActive = true;
    await teacher.save();

    // enable user login
    await User.findByIdAndUpdate(teacher.userId, {
      isActive: true,
    });

    res.status(200).json({
      message: "Teacher enabled successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.findById(id)
      .populate("userId", "-password")
      .sort({ createdAt: -1 });

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    res.status(200).json({
      teacher,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.disableStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    // disable student
    student.isActive = false;
    await student.save();

    // disable login
    await User.findByIdAndUpdate(student.userId, {
      isActive: false,
    });

    res.status(200).json({
      message: "Student disabled successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.enableStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    // enable student
    student.isActive = true;
    await student.save();

    // enable user login
    await User.findByIdAndUpdate(student.userId, {
      isActive: true,
    });

    res.status(200).json({
      message: "Student enabled successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id)
      .populate("classId")
      .populate("userId", "-password")
      .sort({ createdAt: -1 });

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.status(200).json({
      student,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
exports.getSingleClass = async (req, res) => {
  try {
    const { id } = req.params;

    // get class details
    const singleClass = await Class.findById(id)
      // .populate({
      //   path: "classTeacher",
      //     populate: {
      //         path: "userId",
      //         select: "name username",
      //       },
      //     });
      .populate({
        path: "classTeacher",
        populate: {
          path: "userId",
          select: "name username",
        },
      });

    if (!singleClass) {
      return res.status(404).json({
        message: "Class not found",
      });
    }

    // get students of this class
    const students = await Student.find({
      classId: id,
      isActive: true,
    }).populate("userId", "name username");

    res.status(200).json({
      message: "Class fetched successfully",
      class: singleClass,
      totalStudents: students.length,
      students,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.toggleTeacherStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.findById(id).populate("userId");

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    teacher.userId.isActive = !teacher.userId.isActive;

    await teacher.userId.save();

    res.status(200).json({
      message: `Teacher ${
        teacher.userId.isActive ? "activated" : "deactivated"
      } successfully`,
      teacher,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
exports.toggleStudentStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id).populate("userId");

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    student.userId.isActive = !student.userId.isActive;

    await student.userId.save();

    const updatedStudent = await Student.findById(id)
      .populate("userId", "-password")
      .populate("classId");

    res.status(200).json({
      message: `Student ${
        updatedStudent.userId.isActive ? "activated" : "deactivated"
      } successfully`,
      student: updatedStudent,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
