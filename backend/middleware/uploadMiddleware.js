const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        if (req.baseUrl.includes("books")) {
            cb(null, "uploads/books");
        }
        else if (req.baseUrl.includes("syllabus")) {
            cb(null, "uploads/syllabus");
        }
        else if (req.baseUrl.includes("pyqs")) {
            cb(null, "uploads/pyqs");
        }
    },

    filename: function (req, file, cb) {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

module.exports = upload;