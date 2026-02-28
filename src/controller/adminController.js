const User = require("../models/User.model");
const Teacher = require("../models/Teacher.model");
const Student = require("../models/Student.model");
const Class = require("../models/Class.model");

exports.createTeacher = async (req, res) => {
    try {
        const { name, username, password, subject, qualification, phone, experience, address } = req.body;

        // Check existing user
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({
                message: "Username already exists"
            });
        }

        // Create User (role = teacher)
        const user = await User.create({
            name,
            username,
            password,
            role: "teacher"
        });

        // Create Teacher profile
        const teacher = await Teacher.create({
            userId: user._id,
            subject,
            qualification,
            phone,
            experience,
            address
        });

        res.status(201).json({
            message: "Teacher created successfully",
            teacher
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
exports.bulkCreateTeachers = async (req, res) => {
    try {
        const teachersData = req.body; // Expecting array

        if (!Array.isArray(teachersData)) {
            return res.status(400).json({
                message: "Request body must be an array of teachers"
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
                address
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
                role: "teacher"
            });

            // Create teacher profile
            const teacher = await Teacher.create({
                userId: user._id,
                subject,
                qualification,
                phone,
                experience,
                address
            });

            createdTeachers.push(teacher);
        }

        res.status(201).json({
            message: "Bulk teacher creation completed",
            totalCreated: createdTeachers.length,
            teachers: createdTeachers
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
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
            teachers
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


exports.createStudent = async (req, res) => {
    try {
        const {
            name,
            username,
            password,
            classId,
            rollNumber
        } = req.body;

        // 1️⃣ Check username already exists
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({
                message: "Username already exists"
            });
        }

        // 2️⃣ Check class exists
        const existingClass = await Class.findById(classId);

        if (!existingClass) {
            return res.status(404).json({
                message: "Class not found"
            });
        }

        // 3️⃣ Create User (role = student)
        const user = await User.create({
            name,
            username,
            password,
            role: "student"
        });

        // 4️⃣ Create Student Profile
        const student = await Student.create({
            userId: user._id,
            classId,
            rollNumber,
            attendance: 0,
            terms: []
        });

        // 5️⃣ Return populated student
        const studentData = await Student.findById(student._id)
            .populate("userId", "-password")
            .populate("classId");

        res.status(201).json({
            message: "Student created successfully",
            student: studentData
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
exports.bulkCreateStudents = async (req, res) => {
    try {
        const studentsData = req.body;

        if (!Array.isArray(studentsData)) {
            return res.status(400).json({
                message: "Request body must be an array"
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
                role: "student"
            });

            // 4️⃣ Create student
            const student = await Student.create({
                userId: user._id,
                classId,
                rollNumber,
                attendance: 0,
                terms: []
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
            skipped
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.createClass = async (req, res) => {
    try {
        const { className, section, classTeacher } = req.body;

        const newClass = await Class.create({
            className,
            section,
            classTeacher // optional (can assign later)
        });

        res.status(201).json({
            message: "Class created successfully",
            class: newClass
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.assignClassTeacher = async (req, res) => {
    try {
        const { classId, teacherUserId } = req.body;

        // 1️⃣ Check teacher exists
        const teacher = await User.findById(teacherUserId);

        if (!teacher || teacher.role !== "teacher") {
            return res.status(400).json({
                message: "Invalid teacher"
            });
        }

        // 2️⃣ Update class
        const updatedClass = await Class.findByIdAndUpdate(
            classId,
            { classTeacher: teacherUserId },
            { new: true }
        ).populate("classTeacher", "-password");

        if (!updatedClass) {
            return res.status(404).json({
                message: "Class not found"
            });
        }

        res.status(200).json({
            message: "Teacher assigned successfully",
            class: updatedClass
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


exports.getAllStudents = async (req, res) => {
    try {

        const student = await Student.find()
            .populate("userId", "-password")
            .sort({ createdAt: -1 });


        res.status(200).json({
            success: true,
            count: student.length,
            student
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
