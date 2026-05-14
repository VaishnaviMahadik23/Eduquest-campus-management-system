const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path"); 

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const booksRoutes = require("./routes/booksRoutes");
const pyqsRoutes = require("./routes/pyqsRoutes");
const syllabusRoutes = require("./routes/syllabusRoutes");
const semesterRoutes=require("./routes/semesterRoutes");
const searchRoutes = require("./routes/searchRoutes");

const app = express();

/* =========================
   MIDDLEWARE
========================= */

app.use(cors());
app.use(express.json());
/* =========================
   STATIC FILES
========================= */

app.use(express.static(path.join(__dirname, "../frontend")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
/* =========================
   ROUTES
========================= */

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/books", booksRoutes);
app.use("/api/pyqs", pyqsRoutes);
app.use("/api/syllabus", syllabusRoutes);
app.use("/api/semester",semesterRoutes);
app.use("/api/search", searchRoutes);

/* =========================
   TEST ROUTE
========================= */

app.get("/", (req, res) => {
    res.send("EduQuest Backend Running ");
});

/* =========================
   SERVER
========================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log("Backend is connected to the databse successfully ✅")
});