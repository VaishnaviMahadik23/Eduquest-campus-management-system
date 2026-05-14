const multer = require("multer");
const path = require("path");

/* =========================
   STORAGE CONFIG
========================= */

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

/* =========================
   FILE FILTER (PDF ONLY)
========================= */

const fileFilter = (req, file, cb) => {

    if (file.mimetype === "application/pdf") {
        cb(null, true);
    } else {
        cb(new Error("Only PDF files allowed"), false);
    }

};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

module.exports = upload;