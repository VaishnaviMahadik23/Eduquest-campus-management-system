const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");


// =============================
// MULTER CONFIG
// =============================

const storage = multer.diskStorage({

destination: function(req,file,cb){
cb(null,"uploads/notes");
},

filename: function(req,file,cb){
cb(null,Date.now()+"-"+file.originalname);
}

});

const upload = multer({storage});


// =============================
// GET SUBJECTS BY SEMESTER
// =============================

router.get("/:semester", async(req,res)=>{

try{

const {semester}=req.params;

const result=await pool.query(
"SELECT * FROM subjects WHERE semester_id=$1",
[semester]
);

res.json(result.rows);

}catch(err){

console.error(err);
res.status(500).json({error:"Server error"});

}

});


// =============================
// ADD SUBJECT
// =============================

router.post("/add",upload.single("notes"),async(req,res)=>{

try{

const {semester_id,subject_name}=req.body;

let notes_url=null;

if(req.file){
notes_url="/uploads/notes/"+req.file.filename;
}

const result=await pool.query(

"INSERT INTO subjects(semester_id,subject_name,notes_url) VALUES($1,$2,$3) RETURNING *",

[semester_id,subject_name,notes_url]

);

res.json(result.rows[0]);

}catch(err){

console.error(err);
res.status(500).json({error:"Server error"});

}

});


// =============================
// DELETE SUBJECT
// =============================

router.delete("/:id",async(req,res)=>{

try{

await pool.query(
"DELETE FROM subjects WHERE id=$1",
[req.params.id]
);

res.json({message:"Subject deleted"});

}catch(err){

console.error(err);
res.status(500).json({error:"Server error"});

}

});


// =============================
// UPDATE SUBJECT
// =============================

router.put("/:id",upload.single("notes"),async(req,res)=>{

try{

const {subject_name}=req.body;

let notes_url=null;

if(req.file){
notes_url="/uploads/notes/"+req.file.filename;
}

await pool.query(

"UPDATE subjects SET subject_name=$1,notes_url=$2 WHERE id=$3",

[subject_name,notes_url,req.params.id]

);

res.json({message:"Updated successfully"});

}catch(err){

console.error(err);
res.status(500).json({error:"Server error"});

}

});

module.exports=router;