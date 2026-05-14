const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");
const path = require("path");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

/* =========================
MULTER STORAGE
========================= */

const storage = multer.diskStorage({

    destination: function(req,file,cb){
        cb(null,"uploads/syllabus");
    },

    filename: function(req,file,cb){
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null,uniqueName);
    }

});

const upload = multer({ storage });

/* =========================
GET ALL SYLLABUS
========================= */

router.get("/", async (req,res)=>{

try{

const result = await pool.query(`
SELECT 
syllabus.id,
syllabus.subject,
syllabus.file_url,
syllabus.semester_id,
semester.semester_name
FROM syllabus
JOIN semester ON syllabus.semester_id = semester.id
ORDER BY syllabus.id DESC
`);

res.json(result.rows);

}catch(err){

console.error(err);
res.status(500).json({error:"Server error"});

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
async (req,res)=>{

try{

const {subject,semester_id} = req.body;

const file_url = `/uploads/syllabus/${req.file.filename}`;

await pool.query(

`INSERT INTO syllabus(subject,semester_id,file_url)
VALUES($1,$2,$3)`,

[subject,semester_id,file_url]

);

res.json({message:"Syllabus uploaded successfully"});

}catch(err){

console.error(err);
res.status(500).json({error:"Upload failed"});

}

});

/* =========================
DELETE SYLLABUS
========================= */

router.delete(
"/delete/:id",
authMiddleware,
adminMiddleware,
async (req,res)=>{

try{

const id = req.params.id;

await pool.query(
"DELETE FROM syllabus WHERE id=$1",
[id]
);

res.json({message:"Syllabus deleted successfully"});

}catch(err){

console.error(err);
res.status(500).json({error:"Delete failed"});

}

});

/* =========================
UPDATE SYLLABUS
========================= */

router.put(
"/update/:id",
authMiddleware,
adminMiddleware,
async (req,res)=>{

try{

const id = req.params.id;
const {subject,semester_id} = req.body;

await pool.query(

`UPDATE syllabus
SET subject=$1,
semester_id=$2
WHERE id=$3`,

[subject,semester_id,id]

);

res.json({message:"Syllabus updated successfully"});

}catch(err){

console.error(err);
res.status(500).json({error:"Update failed"});

}

});

module.exports = router;