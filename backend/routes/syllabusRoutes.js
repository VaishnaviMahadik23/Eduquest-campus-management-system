const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

/* =========================
CREATE UPLOAD FOLDER
========================= */

const uploadDir = path.join(__dirname, "../uploads/syllabus");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

/* =========================
MULTER STORAGE
========================= */

const storage = multer.diskStorage({

    destination: function(req, file, cb) {
        cb(null, uploadDir);
    },

    filename: function(req, file, cb) {

        const uniqueName =
            Date.now() + "-" + file.originalname.replace(/\s+/g, "_");

        cb(null, uniqueName);
    }

});

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    }
});

/* =========================
GET ALL SYLLABUS
========================= */

router.get("/", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT 
                syllabus.id,
                syllabus.subject,
                syllabus.file_url,
                syllabus.semester_id,
                semester.semester_name
            FROM syllabus
            JOIN semester 
            ON syllabus.semester_id = semester.id
            ORDER BY syllabus.id DESC
        `);

        res.json(result.rows);

    } catch (err) {

        console.error("GET SYLLABUS ERROR:", err);

        res.status(500).json({
            error: "Failed to fetch syllabus"
        });

    }

});

/* =========================
UPLOAD SYLLABUS
========================= */

router.post(
    "/upload",
    authMiddleware,
    adminMiddleware,
    upload.single("pdf"),
    async (req, res) => {

        try {

            const { subject, semester_id } = req.body;

            if (!subject || !semester_id) {
                return res.status(400).json({
                    error: "Subject and semester are required"
                });
            }

            if (!req.file) {
                return res.status(400).json({
                    error: "PDF file is required"
                });
            }

            const file_url = `/uploads/syllabus/${req.file.filename}`;

            const result = await pool.query(

                `INSERT INTO syllabus
                (subject, semester_id, file_url)
                VALUES($1,$2,$3)
                RETURNING *`,

                [subject, semester_id, file_url]

            );

            res.status(201).json({
                message: "Syllabus uploaded successfully",
                syllabus: result.rows[0]
            });

        } catch (err) {

            console.error("UPLOAD SYLLABUS ERROR:", err);

            res.status(500).json({
                error: "Upload failed"
            });

        }

    }
);

/* =========================
DELETE SYLLABUS
========================= */

router.delete(
    "/delete/:id",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {

        try {

            const id = req.params.id;

            const result = await pool.query(
                "SELECT file_url FROM syllabus WHERE id=$1",
                [id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({
                    error: "Syllabus not found"
                });
            }

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

            await pool.query(
                "DELETE FROM syllabus WHERE id=$1",
                [id]
            );

            res.json({
                message: "Syllabus deleted successfully"
            });

        } catch (err) {

            console.error("DELETE SYLLABUS ERROR:", err);

            res.status(500).json({
                error: "Delete failed"
            });

        }

    }
);

/* =========================
UPDATE SYLLABUS
========================= */

router.put(
    "/update/:id",
    authMiddleware,
    adminMiddleware,
    upload.single("pdf"),
    async (req, res) => {

        try {

            const id = req.params.id;
            const { subject, semester_id } = req.body;

            if (!subject || !semester_id) {
                return res.status(400).json({
                    error: "Subject and semester are required"
                });
            }

            const existing = await pool.query(
                "SELECT * FROM syllabus WHERE id=$1",
                [id]
            );

            if (existing.rows.length === 0) {
                return res.status(404).json({
                    error: "Syllabus not found"
                });
            }

            let file_url = existing.rows[0].file_url;

            // If new PDF uploaded
            if (req.file) {

                // Delete old file
                if (file_url) {

                    const oldPath = path.join(
                        __dirname,
                        "..",
                        file_url
                    );

                    if (fs.existsSync(oldPath)) {
                        fs.unlinkSync(oldPath);
                    }

                }

                file_url = `/uploads/syllabus/${req.file.filename}`;
            }

            await pool.query(

                `UPDATE syllabus
                SET 
                    subject=$1,
                    semester_id=$2,
                    file_url=$3
                WHERE id=$4`,

                [subject, semester_id, file_url, id]

            );

            res.json({
                message: "Syllabus updated successfully"
            });

        } catch (err) {

            console.error("UPDATE SYLLABUS ERROR:", err);

            res.status(500).json({
                error: "Update failed"
            });

        }

    }
);

module.exports = router;