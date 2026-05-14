const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

/* =========================
MULTER STORAGE
========================= */

const storage = multer.diskStorage({

    destination: function(req,file,cb){
        cb(null,"uploads/books");
    },

    filename: function(req,file,cb){
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null,uniqueName);
    }

});

const upload = multer({ storage });

/* =========================
UPLOAD BOOK
========================= */

router.post(
"/upload",
authMiddleware,
adminMiddleware,
upload.single("pdf"),
async (req, res) => {

    try {

        const { title, author, semester_id } = req.body;

        const pdf_url = `/uploads/books/${req.file.filename}`;

        const result = await pool.query(
            `INSERT INTO books (title, author, semester_id, pdf_url)
             VALUES ($1,$2,$3,$4)
             RETURNING *`,
            [title, author, semester_id, pdf_url]
        );

        res.json({
            message: "Book uploaded successfully",
            book: result.rows[0]
        });

    } catch (error) {

        console.error(error);
        res.status(500).json({ error: "Server error" });

    }

});

/* =========================
GET ALL BOOKS
========================= */

router.get("/", async (req, res) => {

    try {

        const result = await pool.query(
            `SELECT books.*, semester.semester_name
             FROM books
             JOIN semester
             ON books.semester_id = semester.id`
        );

        res.json(result.rows);

    } catch (error) {

        console.error(error);
        res.status(500).json({ error: "Server error" });

    }

});

/* =========================
DELETE BOOK
========================= */

router.delete(
"/delete/:id",
authMiddleware,
adminMiddleware,
async (req, res) => {

    const { id } = req.params;

    try {

        await pool.query(
            "DELETE FROM books WHERE id = $1",
            [id]
        );

        res.json({ message: "Book deleted successfully" });

    } catch (err) {

        console.error(err);
        res.status(500).json({ error: "Server error" });

    }

});

/* =========================
UPDATE BOOK
========================= */

router.put(
"/update/:id",
authMiddleware,
adminMiddleware,
async (req, res) => {

    const { id } = req.params;
    const { title, author, semester_id } = req.body;

    try {

        await pool.query(
            `UPDATE books
             SET title=$1,
             author=$2,
             semester_id=$3
             WHERE id=$4`,
            [title, author, semester_id, id]
        );

        res.json({ message: "Book updated successfully" });

    } catch (err) {

        console.error(err);
        res.status(500).json({ error: "Server error" });

    }

});

module.exports = router;