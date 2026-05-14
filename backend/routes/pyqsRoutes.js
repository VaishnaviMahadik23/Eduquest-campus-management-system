const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

/* ==============================
CREATE UPLOAD FOLDER IF NOT EXISTS
============================== */

const uploadDir = path.join(__dirname, "../uploads/pyqs");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

/* ==============================
MULTER STORAGE
============================== */

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },

    filename: function (req, file, cb) {

        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);

    }

});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

/* ==============================
GET ALL PYQS
============================== */

router.get("/", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT 
            pyqs.id,
            pyqs.subject,
            pyqs.year,
            pyqs.file_url,
            semester.semester_name,
            pyqs.semester_id
            FROM pyqs
            JOIN semester ON pyqs.semester_id = semester.id
            ORDER BY pyqs.created_at DESC
        `);

        res.json(result.rows);

    } catch (err) {

        console.error(err);
        res.status(500).json({ error: "Server error" });

    }

});

/* ==============================
UPLOAD PYQ (ADMIN)
============================== */

router.post(
"/upload",
authMiddleware,
adminMiddleware,
upload.single("pdf"),
async (req, res) => {

    try {

        const { subject, semester_id, year } = req.body;

        if(!req.file){
            return res.status(400).json({ error: "PDF file required" });
        }

        const file_url = `/uploads/pyqs/${req.file.filename}`;

        await pool.query(

            `INSERT INTO pyqs(subject, semester_id, year, file_url)
             VALUES($1,$2,$3,$4)`,

            [subject, semester_id, year, file_url]

        );

        res.json({ message: "PYQ uploaded successfully" });

    } catch (err) {

        console.error(err);
        res.status(500).json({ error: "Upload failed" });

    }

});

/* ==============================
DELETE PYQ (ADMIN)
============================== */

router.delete(
"/delete/:id",
authMiddleware,
adminMiddleware,
async (req, res) => {

    try {

        const id = req.params.id;

        const result = await pool.query(
            "SELECT file_url FROM pyqs WHERE id=$1",
            [id]
        );

        if(result.rows.length === 0){
            return res.status(404).json({ error: "PYQ not found" });
        }

        const filePath = path.join(__dirname, "..", result.rows[0].file_url);

        if(fs.existsSync(filePath)){
            fs.unlinkSync(filePath);
        }

        await pool.query(
            "DELETE FROM pyqs WHERE id=$1",
            [id]
        );

        res.json({ message: "PYQ deleted successfully" });

    } catch (err) {

        console.error(err);
        res.status(500).json({ error: "Delete failed" });

    }

});

module.exports = router;