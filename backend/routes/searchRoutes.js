const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {

try {

const q = `%${req.query.q}%`;

const books = await pool.query(
`SELECT title, 'Book' AS type
 FROM books
 WHERE title ILIKE $1`,
[q]
);

const pyqs = await pool.query(
`SELECT year::text AS title, 'PYQ' AS type
 FROM pyqs
 WHERE year::text ILIKE $1`,
[q]
);

const subjects = await pool.query(
`SELECT subject_name AS title, 'Subject' AS type
 FROM subjects
 WHERE subject_name ILIKE $1`,
[q]
);

const syllabus = await pool.query(
`SELECT subject::text AS title, 'Syllabus' AS type
 FROM syllabus
 WHERE subject::text ILIKE $1`,
[q]
);

const results = [
...books.rows,
...pyqs.rows,
...subjects.rows,
...syllabus.rows
];

res.json(results);

} catch(err){
console.error(err);
res.status(500).json({error:"Search failed"});
}

});

module.exports = router;