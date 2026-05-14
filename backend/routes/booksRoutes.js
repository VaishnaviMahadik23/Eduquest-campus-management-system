const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

/* =========================
   ENSURE UPLOAD DIRECTORY EXISTS
========================= */

const uploadPath = path.join(__dirname, "../uploads/books");

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

/* =========================
   MULTER STORAGE
========================= */

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, uploadPath);
    },

    filename: function (req, file, cb) {

        const uniqueName =
            Date.now() + "-" + file.originalname.replace(/\s+/g, "_");

        cb(null, uniqueName);
    }

});

/* =========================
   FILE FILTER
========================= */

const fileFilter = (req, file, cb) => {

    if (file.mimetype === "application/pdf") {
        cb(null, true);
    } else {
        cb(new Error("Only PDF files are allowed"), false);
    }

};

/* =========================
   MULTER CONFIG
========================= */

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 20 * 1024 * 1024 // 20MB
    }
});

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

            /* =========================
               VALIDATION
            ========================= */

            if (!title || !author || !semester_id) {
                return res.status(400).json({
                    error: "All fields are required"
                });
            }

            if (!req.file) {
                return res.status(400).json({
                    error: "PDF file is required"
                });
            }

            /* =========================
               FILE URL
            ========================= */

            const pdf_url = `/uploads/books/${req.file.filename}`;

            /* =========================
               INSERT INTO DATABASE
            ========================= */

            const result = await pool.query(
                `INSERT INTO books 
                (title, author, semester_id, pdf_url)
                VALUES ($1,$2,$3,$4)
                RETURNING *`,
                [title, author, semester_id, pdf_url]
            );

            res.status(201).json({
                message: "Book uploaded successfully",
                book: result.rows[0]
            });

        } catch (error) {

            console.error("UPLOAD BOOK ERROR:", error);

            res.status(500).json({
                error: "Server error while uploading book"
            });

        }

    }
);

/* =========================
   GET ALL BOOKS
========================= */

router.get("/", async (req, res) => {

    try {

        const result = await pool.query(
            `SELECT 
                books.*,
                semester.semester_name
             FROM books
             JOIN semester
             ON books.semester_id = semester.id
             ORDER BY books.id DESC`
        );

        res.json(result.rows);

    } catch (error) {

        console.error("GET BOOKS ERROR:", error);

        res.status(500).json({
            error: "Server error while fetching books"
        });

    }

});

/* =========================
   GET BOOKS BY SEMESTER
========================= */

router.get("/semester/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(
            `SELECT 
                books.*,
                semester.semester_name
             FROM books
             JOIN semester
             ON books.semester_id = semester.id
             WHERE semester_id = $1
             ORDER BY books.id DESC`,
            [id]
        );

        res.json(result.rows);

    } catch (error) {

        console.error("SEMESTER BOOK ERROR:", error);

        res.status(500).json({
            error: "Server error"
        });

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

            /* =========================
               GET BOOK FIRST
            ========================= */

            const bookResult = await pool.query(
                "SELECT * FROM books WHERE id = $1",
                [id]
            );

            if (bookResult.rows.length === 0) {
                return res.status(404).json({
                    error: "Book not found"
                });
            }

            const book = bookResult.rows[0];

            /* =========================
               DELETE FILE
            ========================= */

            if (book.pdf_url) {

                const filePath = path.join(
                    __dirname,
                    "..",
                    book.pdf_url
                );

                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }

            }

            /* =========================
               DELETE DATABASE RECORD
            ========================= */

            await pool.query(
                "DELETE FROM books WHERE id = $1",
                [id]
            );

            res.json({
                message: "Book deleted successfully"
            });

        } catch (err) {

            console.error("DELETE BOOK ERROR:", err);

            res.status(500).json({
                error: "Server error while deleting book"
            });

        }

    }
);

/* =========================
   UPDATE BOOK
========================= */

router.put(
    "/update/:id",
    authMiddleware,
    adminMiddleware,
    upload.single("pdf"),
    async (req, res) => {

        const { id } = req.params;

        try {

            const { title, author, semester_id } = req.body;

            /* =========================
               VALIDATION
            ========================= */

            if (!title || !author || !semester_id) {
                return res.status(400).json({
                    error: "All fields are required"
                });
            }

            /* =========================
               GET EXISTING BOOK
            ========================= */

            const oldBookResult = await pool.query(
                "SELECT * FROM books WHERE id = $1",
                [id]
            );

            if (oldBookResult.rows.length === 0) {
                return res.status(404).json({
                    error: "Book not found"
                });
            }

            let pdf_url = oldBookResult.rows[0].pdf_url;

            /* =========================
               IF NEW FILE UPLOADED
            ========================= */

            if (req.file) {

                /* DELETE OLD FILE */

                if (pdf_url) {

                    const oldFilePath = path.join(
                        __dirname,
                        "..",
                        pdf_url
                    );

                    if (fs.existsSync(oldFilePath)) {
                        fs.unlinkSync(oldFilePath);
                    }

                }

                pdf_url = `/uploads/books/${req.file.filename}`;
            }

            /* =========================
               UPDATE DATABASE
            ========================= */

            await pool.query(
                `UPDATE books
                 SET title = $1,
                     author = $2,
                     semester_id = $3,
                     pdf_url = $4
                 WHERE id = $5`,
                [
                    title,
                    author,
                    semester_id,
                    pdf_url,
                    id
                ]
            );

            res.json({
                message: "Book updated successfully"
            });

        } catch (err) {

            console.error("UPDATE BOOK ERROR:", err);

            res.status(500).json({
                error: "Server error while updating book"
            });

        }

    }
);

module.exports = router;