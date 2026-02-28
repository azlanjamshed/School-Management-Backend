const Class = require("../models/Class.model");
const Student = require("../models/Student.model");

exports.getMyStudents = async (req, res) => {
    try {

        // 1️⃣ Get logged-in teacher ID
        const teacherId = req.user._id;

        // 2️⃣ Find class assigned to this teacher
        const assignedClass = await Class.findOne({
            classTeacher: teacherId
        });

        if (!assignedClass) {
            return res.status(404).json({
                message: "No class assigned to this teacher"
            });
        }

        // 3️⃣ Get students of that class
        const students = await Student.find({
            classId: assignedClass._id
        })
            .populate("userId", "-password")
            .populate("classId");

        res.status(200).json({
            success: true,
            class: assignedClass,
            count: students.length,
            students
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};



exports.addOrUpdateMarks = async (req, res) => {
    try {
        const teacherId = req.user._id;
        const { studentId } = req.params;
        const { termName, subjects } = req.body;

        // 1️⃣ Find class assigned to teacher
        const assignedClass = await Class.findOne({
            classTeacher: teacherId
        });

        if (!assignedClass) {
            return res.status(404).json({
                message: "No class assigned to this teacher"
            });
        }

        // 2️⃣ Find student
        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        // 3️⃣ Verify student belongs to teacher’s class
        if (student.classId.toString() !== assignedClass._id.toString()) {
            return res.status(403).json({
                message: "You are not allowed to modify this student"
            });
        }

        // 4️⃣ Check if term already exists
        const existingTerm = student.terms.find(
            (term) => term.termName === termName
        );

        if (existingTerm) {
            // Update subjects
            existingTerm.subjects = subjects;
        } else {
            // Add new term
            student.terms.push({
                termName,
                subjects
            });
        }

        await student.save();

        res.status(200).json({
            message: "Marks updated successfully",
            student
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.updateAttendance = async (req, res) => {
    try {
        const teacherId = req.user._id;
        const { studentId } = req.params;
        const { attendance } = req.body;

        // 1️⃣ Validate attendance value
        if (attendance < 0 || attendance > 100) {
            return res.status(400).json({
                message: "Attendance must be between 0 and 100"
            });
        }

        // 2️⃣ Find class assigned to teacher
        const assignedClass = await Class.findOne({
            classTeacher: teacherId
        });

        if (!assignedClass) {
            return res.status(404).json({
                message: "No class assigned to this teacher"
            });
        }

        // 3️⃣ Find student
        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        // 4️⃣ Verify ownership
        if (student.classId.toString() !== assignedClass._id.toString()) {
            return res.status(403).json({
                message: "You are not allowed to update this student"
            });
        }

        // 5️⃣ Update attendance
        student.attendance = attendance;

        await student.save();

        res.status(200).json({
            message: "Attendance updated successfully",
            attendance: student.attendance
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};