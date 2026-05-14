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

        const uniqueName =
            Date.now() + "-" + file.originalname.replace(/\s+/g, "_");

        cb(null, uniqueName);

    }

});

/* ==============================
   FILE FILTER
============================== */

const fileFilter = (req, file, cb) => {

    if (file.mimetype === "application/pdf") {
        cb(null, true);
    } else {
        cb(new Error("Only PDF files are allowed"), false);
    }

};

/* ==============================
   MULTER CONFIG
============================== */

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 20 * 1024 * 1024 // 20MB
    }
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
                pyqs.semester_id,
                semester.semester_name
            FROM pyqs
            JOIN semester 
            ON pyqs.semester_id = semester.id
            ORDER BY pyqs.created_at DESC
        `);

        res.json(result.rows);

    } catch (err) {

        console.error("GET PYQS ERROR:", err);

        res.status(500).json({
            error: "Server error while fetching PYQs"
        });

    }

});

/* ==============================
   GET PYQS BY SEMESTER
============================== */

router.get("/semester/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(`
            SELECT 
                pyqs.id,
                pyqs.subject,
                pyqs.year,
                pyqs.file_url,
                pyqs.semester_id,
                semester.semester_name
            FROM pyqs
            JOIN semester 
            ON pyqs.semester_id = semester.id
            WHERE pyqs.semester_id = $1
            ORDER BY pyqs.created_at DESC
        `, [id]);

        res.json(result.rows);

    } catch (err) {

        console.error("SEMESTER PYQ ERROR:", err);

        res.status(500).json({
            error: "Server error"
        });

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

            /* ==============================
               VALIDATION
            ============================== */

            if (!subject || !semester_id || !year) {
                return res.status(400).json({
                    error: "All fields are required"
                });
            }

            if (!req.file) {
                return res.status(400).json({
                    error: "PDF file is required"
                });
            }

            /* ==============================
               FILE URL
            ============================== */

            const file_url = `/uploads/pyqs/${req.file.filename}`;

            /* ==============================
               INSERT INTO DATABASE
            ============================== */

            const result = await pool.query(

                `INSERT INTO pyqs
                (subject, semester_id, year, file_url)
                VALUES($1,$2,$3,$4)
                RETURNING *`,

                [subject, semester_id, year, file_url]

            );

            res.status(201).json({
                message: "PYQ uploaded successfully",
                pyq: result.rows[0]
            });

        } catch (err) {

            console.error("UPLOAD PYQ ERROR:", err);

            res.status(500).json({
                error: "Upload failed"
            });

        }

    }
);

/* ==============================
   UPDATE PYQ (ADMIN)
============================== */

router.put(
    "/update/:id",
    authMiddleware,
    adminMiddleware,
    upload.single("pdf"),
    async (req, res) => {

        try {

            const { id } = req.params;
            const { subject, semester_id, year } = req.body;

            /* ==============================
               VALIDATION
            ============================== */

            if (!subject || !semester_id || !year) {
                return res.status(400).json({
                    error: "All fields are required"
                });
            }

            /* ==============================
               GET EXISTING RECORD
            ============================== */

            const existingResult = await pool.query(
                "SELECT * FROM pyqs WHERE id=$1",
                [id]
            );

            if (existingResult.rows.length === 0) {
                return res.status(404).json({
                    error: "PYQ not found"
                });
            }

            let file_url = existingResult.rows[0].file_url;

            /* ==============================
               IF NEW FILE UPLOADED
            ============================== */

            if (req.file) {

                /* DELETE OLD FILE */

                if (file_url) {

                    const oldFilePath = path.join(
                        __dirname,
                        "..",
                        file_url
                    );

                    if (fs.existsSync(oldFilePath)) {
                        fs.unlinkSync(oldFilePath);
                    }

                }

                file_url = `/uploads/pyqs/${req.file.filename}`;
            }

            /* ==============================
               UPDATE DATABASE
            ============================== */

            await pool.query(

                `UPDATE pyqs
                 SET subject = $1,
                     semester_id = $2,
                     year = $3,
                     file_url = $4
                 WHERE id = $5`,

                [
                    subject,
                    semester_id,
                    year,
                    file_url,
                    id
                ]

            );

            res.json({
                message: "PYQ updated successfully"
            });

        } catch (err) {

            console.error("UPDATE PYQ ERROR:", err);

            res.status(500).json({
                error: "Update failed"
            });

        }

    }
);

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

            /* ==============================
               GET FILE PATH
            ============================== */

            const result = await pool.query(
                "SELECT file_url FROM pyqs WHERE id=$1",
                [id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({
                    error: "PYQ not found"
                });
            }

            /* ==============================
               DELETE FILE
            ============================== */

            const file_url = result.rows[0].file_url;

            if (file_url) {

                const filePath = path.join(
                    __dirname,
                    "..",
                    file_url
                );

                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }

            }

            /* ==============================
               DELETE RECORD
            ============================== */

            await pool.query(
                "DELETE FROM pyqs WHERE id=$1",
                [id]
            );

            res.json({
                message: "PYQ deleted successfully"
            });

        } catch (err) {

            console.error("DELETE PYQ ERROR:", err);

            res.status(500).json({
                error: "Delete failed"
            });

        }

    }
);

module.exports = router;