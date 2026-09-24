import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// TiDB Connection - Put your TiDB details in.env
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT || 4000,
  ssl: { rejectUnauthorized: true }
});

// Create tables
async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(255),
        email VARCHAR(255),
        service VARCHAR(255),
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS applicants (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(255),
        phone VARCHAR(100),
        email VARCHAR(255),
        position VARCHAR(100),
        education VARCHAR(100),
        experience TEXT,
        interest TEXT,
        applied_by VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Tables ready");
  } catch (err) { console.error(err); }
}
initDB();

// CONTACT API
app.post('/api/contact', async (req, res) => {
  const { fullName, email, service, message } = req.body;
  const [result] = await pool.query(
    "INSERT INTO contacts (full_name, email, service, message) VALUES (?,?,?,?)",
    [fullName, email, service, message]
  );
  res.json({ id: result.insertId });
});
app.get('/api/contact', async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM contacts ORDER BY full_name ASC");
  res.json(rows);
});

// APPLICANTS API
app.post('/api/applicants', async (req, res) => {
  const { fullName, phone, email, position, education, experience, interest, appliedBy } = req.body;
  const [result] = await pool.query(
    "INSERT INTO applicants (full_name, phone, email, position, education, experience, interest, applied_by) VALUES (?,?,?,?,?,?,?,?)",
    [fullName, phone, email, position, education, experience, interest, appliedBy]
  );
  res.json({ id: result.insertId });
});
app.get('/api/applicants', async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM applicants ORDER BY full_name ASC");
  res.json(rows);
});

app.listen(5000, () => console.log("🚀 Backend running on http://localhost:5000"));