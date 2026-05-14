# 🎓 EduQuest Campus Management System

A full-stack academic management platform designed to simplify student and admin operations within a college environment.

The system provides secure authentication, student management, academic resources access, and organized semester-wise learning materials through a modern web interface.

---

# 🚀 Features

## 👨‍🏫 Admin Panel
- Secure Admin Login
- JWT Authentication & Authorization
- First-Time Profile Completion
- Add / View / Delete Students
- Student Profile Monitoring
- Dashboard Statistics
- Search & Pagination
- Password Management

---

## 👨‍🎓 Student Features
- Student Login System
- Semester-wise Study Material Access
- PYQs (Previous Year Questions)
- Syllabus Downloads
- Academic Books Access
- Notes Management
- Responsive UI

---

# 🔐 Security Features
- JWT Token Authentication
- Role-Based Access Control
- Password Hashing using bcrypt
- Protected Routes Middleware
- Secure File Upload Handling

---

# 🛠️ Tech Stack

## Frontend
- HTML5
- CSS3
- Vanilla JavaScript

## Backend
- Node.js
- Express.js

## Database
- PostgreSQL

## Other Tools
- Multer (File Uploads)
- dotenv
- bcrypt
- JWT

---

# 📂 Project Structure

```bash
EDUQUEST/
│
├── backend/
│   │
│   ├── config/
│   │   └── multerConfig.js
│   │
│   ├── middleware/
│   │   ├── adminMiddleware.js
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   │
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── booksRoutes.js
│   │   ├── pyqsRoutes.js
│   │   ├── searchRoutes.js
│   │   ├── semesterRoutes.js
│   │   └── syllabusRoutes.js
│   │
│   ├── uploads/
│   │   ├── books/
│   │   ├── notes/
│   │   ├── pyqs/
│   │   └── syllabus/
│   │
│   ├── .env
│   ├── db.js
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   │
│   ├── images/
│   │   ├── Home_BG_Image.png
│   │   └── Login_BG_Image.png
│   │
│   ├── admin-panel.html
│   ├── admin-panel.css
│   ├── admin-panel.js
│   │
│   ├── books.html
│   ├── books.css
│   ├── books.js
│   │
│   ├── home-page.html
│   ├── home-page.css
│   ├── home-page.js
│   │
│   ├── landing-page.html
│   ├── landing-page.css
│   ├── landing-page.js
│   │
│   ├── pyqs.html
│   ├── pyqs.css
│   ├── pyqs.js
│   │
│   ├── semester.html
│   ├── semester.css
│   ├── semester.js
│   │
│   ├── syllabus.html
│   ├── syllabus.css
│   └── syllabus.js
│
└── README.md
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/eduquest-campus-management-system.git
```

---

## 2️⃣ Open Project Folder

```bash
cd eduquest-campus-management-system
```

---

# 🔧 Backend Setup

## Install Dependencies

```bash
cd backend
npm install
```

---

## Create `.env` File

```env
PORT=5000

DATABASE_URL=your_postgresql_database_url

JWT_SECRET=your_secret_key
```

---

## Run Backend Server

```bash
node server.js
```

Server will start at:

```bash
http://localhost:5000
```

---

# 🌐 Frontend Setup

Simply open:

```bash
frontend/landing-page.html
```

in browser.

---

# 🗄️ Database Modules

## Users
Stores authentication and role-based data.

## Admins
Stores admin profile information.

## Students
Stores student academic information.

## Academic Resources
- Books
- Notes
- PYQs
- Syllabus

---

# 📦 Major Functional Modules

| Module | Description |
|--------|-------------|
| Authentication | Login & JWT Security |
| Admin Dashboard | Student Management |
| Semester Module | Semester-wise content |
| PYQs Module | Previous year papers |
| Books Module | Academic books access |
| Search Module | Search academic resources |
| Upload Module | File upload management |

---

# 🔥 Key Highlights

- Full-stack project architecture
- Secure authentication system
- Modular backend routing
- Clean frontend structure
- Organized academic resource management
- Responsive design approach
- PostgreSQL database integration

---

# 🚧 Future Enhancements

- Student Profile Dashboard
- Attendance Management
- Assignment Submission
- Faculty Management
- Notifications System
- Email Verification
- Cloud File Storage

---

# 👩‍💻 Author

## Vaishnavi

Full Stack Developer | Node.js | PostgreSQL | JavaScript

---

# 📌 Resume Project Description

Developed a full-stack Campus Management System using Node.js, Express.js, PostgreSQL, HTML, CSS, and JavaScript. Implemented JWT authentication, admin dashboard, student management, academic resource modules, and secure file upload handling with role-based access control.

---

# ⭐ Support

If you like this project:

- ⭐ Star the repository
- 🍴 Fork the project
- 🛠️ Contribute improvements

---

# 📜 License

This repository is created for educational, learning, and portfolio purposes.

## 🌐 Live Demo

Frontend: https://eduquest-campus-management-system.vercel.app/

Backend API: https://eduquest-campus-management-system.onrender.com
