import express from 'express';
app.get('/', (req, res) => {
  res.send('Pinnacle Security Backend is Running! API is LIVE');
});
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

console.log("Connecting to:", process.env.DB_HOST);

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT) || 4000,
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true
  },
  waitForConnections: true,
  connectionLimit: 10
});

async function initDB() {
  try {
    const conn = await pool.getConnection();
    console.log("✅ Connected to TiDB!");
    conn.release();

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
  } catch (err) {
    console.error("❌ DB Error:", err.message);
    console.error(err);
  }
}
initDB();

app.post('/api/contact', async (req, res) => {
  try {
    const { fullName, email, service, message } = req.body;
    const [result] = await pool.query(
      "INSERT INTO contacts (full_name, email, service, message) VALUES (?,?,?,?)",
      [fullName, email, service, message]
    );
    res.json({ id: result.insertId });
  } catch(e){ res.status(500).json({error:e.message}) }
});

app.get('/api/contact', async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM contacts ORDER BY full_name ASC");
  res.json(rows);
});

app.post('/api/applicants', async (req, res) => {
  try {
    const { fullName, phone, email, position, education, experience, interest, appliedBy } = req.body;
    const [result] = await pool.query(
      "INSERT INTO applicants (full_name, phone, email, position, education, experience, interest, applied_by) VALUES (?,?,?,?,?,?,?,?)",
      [fullName, phone, email, position, education, experience, interest, appliedBy]
    );
    res.json({ id: result.insertId });
  } catch(e){ res.status(500).json({error:e.message}) }
});

app.get('/api/applicants', async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM applicants ORDER BY full_name ASC");
  res.json(rows);
});

app.listen(process.env.PORT || 5000, () => console.log(`🚀 Backend running on http://localhost:${process.env.PORT || 5000}`));