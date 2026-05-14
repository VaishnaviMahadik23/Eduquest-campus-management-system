const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// =============================
// ENSURE UPLOAD FOLDER EXISTS
// =============================

const uploadPath = path.join(__dirname, "../uploads/notes");

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

// =============================
// MULTER CONFIG
// =============================

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, uploadPath);

    },

    filename: function (req, file, cb) {

        cb(null, Date.now() + "-" + file.originalname);

    }

});

const upload = multer({ storage });

// =============================
// GET SUBJECTS BY SEMESTER
// =============================

router.get("/:semester", async (req, res) => {

    try {

        const { semester } = req.params;

        const result = await pool.query(
            "SELECT * FROM subjects WHERE semester_id=$1 ORDER BY id DESC",
            [semester]
        );

        res.json(result.rows);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: "Failed to fetch subjects"
        });

    }

});

// =============================
// ADD SUBJECT
// =============================

router.post("/add", upload.single("notes"), async (req, res) => {

    try {

        const { semester_id, subject_name } = req.body;

        // Validation
        if (!semester_id || !subject_name) {

            return res.status(400).json({
                error: "Semester and subject name are required"
            });

        }

        let notes_url = null;

        if (req.file) {

            notes_url = "/uploads/notes/" + req.file.filename;

        }

        const result = await pool.query(

            `INSERT INTO subjects
            (semester_id, subject_name, notes_url)
            VALUES ($1,$2,$3)
            RETURNING *`,

            [semester_id, subject_name, notes_url]

        );

        res.status(201).json({
            message: "Subject added successfully",
            subject: result.rows[0]
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }

});

// =============================
// DELETE SUBJECT
// =============================

router.delete("/:id", async (req, res) => {

    try {

        const result = await pool.query(
            "DELETE FROM subjects WHERE id=$1 RETURNING *",
            [req.params.id]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                error: "Subject not found"
            });

        }

        res.json({
            message: "Subject deleted successfully"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: "Delete failed"
        });

    }

});

// =============================
// UPDATE SUBJECT
// =============================

router.put("/:id", upload.single("notes"), async (req, res) => {

    try {

        const { subject_name } = req.body;

        if (!subject_name) {

            return res.status(400).json({
                error: "Subject name is required"
            });

        }

        let notes_url = null;

        if (req.file) {

            notes_url = "/uploads/notes/" + req.file.filename;

            await pool.query(

                "UPDATE subjects SET subject_name=$1, notes_url=$2 WHERE id=$3",

                [subject_name, notes_url, req.params.id]

            );

        } else {

            await pool.query(

                "UPDATE subjects SET subject_name=$1 WHERE id=$2",

                [subject_name, req.params.id]

            );

        }

        res.json({
            message: "Subject updated successfully"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: "Update failed"
        });

    }

});

module.exports = router;