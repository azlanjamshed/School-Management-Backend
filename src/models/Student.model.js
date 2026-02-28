// const mongoose = require("mongoose");


// const studentSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     classId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Class",
//     },

//     rollNumber: {
//       type: Number,
//       required: true,
//     },

//     attendance: {
//       type: Number,
//       default: 0,
//     },

//     marks: [
//       {
//         subject: String,
//         score: Number,
//       },
//     ],

//     remarks: {
//       type: String,
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Student", studentSchema);



const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
});

const termSchema = new mongoose.Schema({
  termName: {
    type: String,
    enum: ["Term 1", "Term 2", "Term 3"],
    required: true,
  },
  subjects: [subjectSchema],
});

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },

    rollNumber: {
      type: Number,
      required: true,
    },

    attendance: {
      type: Number,
      default: 0,
    },

    terms: [termSchema],

    remarks: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);