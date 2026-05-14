const express = require("express");
const router = express.Router();
const pool = require("../db");

/* =====================================
   GLOBAL SEARCH API
===================================== */

router.get("/", async (req, res) => {

    try {

        /* =====================================
           GET SEARCH QUERY
        ===================================== */

        const searchText = req.query.q?.trim();

        if (!searchText) {
            return res.status(400).json({
                error: "Search query is required"
            });
        }

        const q = `%${searchText}%`;

        /* =====================================
           SEARCH BOOKS
        ===================================== */

        const books = await pool.query(
            `SELECT 
                id,
                title,
                author,
                pdf_url,
                'Book' AS type
             FROM books
             WHERE title ILIKE $1
                OR author ILIKE $1
             ORDER BY created_at DESC`,
            [q]
        );

        /* =====================================
           SEARCH PYQS
        ===================================== */

        const pyqs = await pool.query(
            `SELECT 
                id,
                CONCAT(subject, ' - ', year) AS title,
                file_url,
                year,
                'PYQ' AS type
             FROM pyqs
             WHERE subject ILIKE $1
                OR year::text ILIKE $1
             ORDER BY created_at DESC`,
            [q]
        );

        /* =====================================
           SEARCH SUBJECTS
        ===================================== */

        const subjects = await pool.query(
            `SELECT 
                id,
                subject_name AS title,
                notes_url,
                'Subject' AS type
             FROM subjects
             WHERE subject_name ILIKE $1
             ORDER BY subject_name ASC`,
            [q]
        );

        /* =====================================
           SEARCH SYLLABUS
        ===================================== */

        const syllabus = await pool.query(
            `SELECT 
                id,
                subject AS title,
                file_url,
                'Syllabus' AS type
             FROM syllabus
             WHERE subject ILIKE $1
             ORDER BY created_at DESC`,
            [q]
        );

        /* =====================================
           COMBINE RESULTS
        ===================================== */

        const results = [
            ...books.rows,
            ...pyqs.rows,
            ...subjects.rows,
            ...syllabus.rows
        ];

        /* =====================================
           RETURN RESPONSE
        ===================================== */

        res.json({
            success: true,
            totalResults: results.length,
            results
        });

    } catch (err) {

        console.error("SEARCH ERROR:", err);

        res.status(500).json({
            success: false,
            error: "Search failed"
        });

    }

});

module.exports = router;