const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,

    ssl: {
        rejectUnauthorized: false
    }
});

pool.connect()
    .then(() => console.log("✅ PostgreSQL Connected Successfully"))
    .catch(err => console.error("❌ Database Connection Error:", err));

module.exports = pool;