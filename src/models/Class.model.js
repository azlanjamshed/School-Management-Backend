const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: true,
    },

    section: {
      type: String,
      //   required: true,
    },

    classTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher", // teacher user
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Class", classSchema);
