# 🏫 School Management System - Backend

A role-based School Management System backend built using **Node.js, Express, MongoDB, and JWT authentication**.

This project supports Admin, Teacher, and Student roles with secure access control and academic management features.

---

## 🚀 Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- HTTP-only Cookie Auth
- bcrypt password hashing

---

## 🔐 Authentication & Security

- JWT-based authentication
- HTTP-only secure cookies
- Role-based authorization (Admin, Teacher, Student)
- Password hashing using bcrypt
- Ownership validation (Teachers can only modify their class students)

---

## 👑 Roles & Features

### 👑 Admin

- Create Class
- Create Teacher
- Create Student
- Assign Teacher to Class
- View All Teachers
- View All Students
- Dashboard-ready structure

### 👨‍🏫 Teacher

- View Assigned Class Students
- Add / Update Term-wise Marks
- Update Student Attendance

### 👨‍🎓 Student

- Login Securely
- View Own Profile
- View Marks & Attendance
- Change Password

---

## 🧠 Data Models

- **User** (authentication & roles)
- **Teacher**
- **Student**
- **Class**

Relationships:

- Teacher → User
- Student → User
- Student → Class
- Class → Teacher

---

## 📂 Project Structure

src/
├── controllers/
├── models/
├── routes/
├── middleware/
├── utils/
└── app.js

---

---

## 🔑 API Base URL

http://localhost:8080/api

## 🛠 Setup Instructions

### 1️⃣ Clone Repository

git clone https://github.com/azlanjamshed/School-Management-Backend.git

cd School-Management-Backend

### 2️⃣ Install Dependencies

npm install

### 3️⃣ Create `.env` File

PORT=8080
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRE=1d

### 4️⃣ Run Server

npm run dev

---

## 🧪 Main API Endpoints

### 🔐 Auth

- `POST /api/auth/login`
- `POST /api/auth/logout`

### 👑 Admin

- `POST /api/admin/create-class`
- `POST /api/admin/create-teacher`
- `POST /api/admin/create-student`
- `PUT /api/admin/assign-class`
- `GET /api/admin/teachers`
- `GET /api/admin/students`
- `GET /api/admin/classes`

### 👨‍🏫 Teacher

- `GET /api/teacher/my-students`
- `PUT /api/teacher/add-marks/:studentId`
- `PUT /api/teacher/update-attendance/:studentId`

### 👨‍🎓 Student

- `GET /api/student/profile`
- `PUT /api/student/change-password`

---

## 📈 Current Status

Backend Phase 1 Completed ✅

- Secure authentication
- Role-based access control
- Academic management system
- Fully relational MongoDB design

---

## 🏆 Future Improvements

- Pagination & Search
- Admin Dashboard Stats
- Multi-class teacher support
- Multi-school SaaS version
- Deployment to cloud (Render / Railway / AWS)

---

## 👨‍💻 Author

**Azlan Jamshed**  
Full Stack Developer

---

⭐ If you like this project, feel free to star the repository.
