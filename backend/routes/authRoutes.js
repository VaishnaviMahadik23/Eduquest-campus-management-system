const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* ================= REGISTER ================= */

router.post("/register", async (req, res) => {
    try {

        const { username, password, email, role } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            "INSERT INTO users (username,password,email,role) VALUES ($1,$2,$3,$4) RETURNING *",
            [username, hashedPassword, email, role]
        );

        res.json({
            message: "User registered successfully",
            user: result.rows[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Registration failed" });
    }
});

/* ================= LOGIN ================= */

router.post("/login", async (req, res) => {
    try {

        const { username, password } = req.body;

        const user = await pool.query(
            "SELECT * FROM users WHERE username=$1",
            [username]
        );

        if (user.rows.length === 0) {
            return res.status(401).json({ message: "User not found" });
        }

        const validPassword = await bcrypt.compare(
            password,
            user.rows[0].password
        );

        if (!validPassword) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
            { id: user.rows[0].id, role: user.rows[0].role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                username: user.rows[0].username,
                email: user.rows[0].email,
                role: user.rows[0].role
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Login failed" });
    }
});


router.get("/users", async(req,res)=>{

const result = await pool.query("SELECT id,email FROM users");

res.json(result.rows);

});


router.delete("/users/:id", async(req,res)=>{

await pool.query(
"DELETE FROM users WHERE id=$1",
[req.params.id]
);

res.json({message:"User deleted"});

});


module.exports = router;

