const express = require("express")
const app = express()
const cors = require("cors")
const cookieParser = require("cookie-parser")
const authRouter = require("./routes/authRoutes")
const adminRoutes = require("./routes/adminRoutes")
const setupRoutes = require("./routes/setupRoutes")
const teacherRoutes = require("./routes/teacherRoutes")
const studentRoutes = require("./routes/studentRoutes")



// app.use(
//     cors({
//         origin: "http://localhost:5173",
//         credentials: true,

//     })
// );

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    })
);

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

app.use("/api/auth", authRouter)
app.use("/api/admin", adminRoutes);
app.use("/api/setup", setupRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/student", studentRoutes);







module.exports = app