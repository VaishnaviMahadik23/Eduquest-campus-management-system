const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/stats", async (req,res) => {

try{

const users = await pool.query("SELECT COUNT(*) FROM users");
const books = await pool.query("SELECT COUNT(*) FROM books");
const pyqs = await pool.query("SELECT COUNT(*) FROM pyqs");
const syllabus = await pool.query("SELECT COUNT(*) FROM syllabus");
const subjects = await pool.query("SELECT COUNT(*) FROM subjects");

res.json({
users: users.rows[0].count,
books: books.rows[0].count,
pyqs: pyqs.rows[0].count,
syllabus: syllabus.rows[0].count,
subjects: subjects.rows[0].count
});

}catch(err){
console.log(err);
res.status(500).json({error:"Stats error"});
}

});

module.exports = router;