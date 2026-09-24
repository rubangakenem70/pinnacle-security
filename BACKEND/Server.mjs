import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Pinnacle Security Backend is Running! API is LIVE');
});

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT) || 4000,
  ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true },
  waitForConnections: true,
  connectionLimit: 10
});

async function initDB() {
  try {
    const conn = await pool.getConnection();
    console.log("✅ Connected!");
    conn.release();
    await pool.query(`CREATE TABLE IF NOT EXISTS contacts (id INT AUTO_INCREMENT PRIMARY KEY, full_name VARCHAR(255), email VARCHAR(255), service VARCHAR(255), message TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
    await pool.query(`CREATE TABLE IF NOT EXISTS applicants (id INT AUTO_INCREMENT PRIMARY KEY, full_name VARCHAR(255), phone VARCHAR(100), email VARCHAR(255), position VARCHAR(100), education VARCHAR(100), experience TEXT, interest TEXT, applied_by VARCHAR(100), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
  } catch (err) { console.error("DB Error:", err.message); }
}
initDB();

app.post('/api/contact', async (req, res) => {
  try {
    const { fullName, email, service, message } = req.body;
    const [r] = await pool.query("INSERT INTO contacts (full_name, email, service, message) VALUES (?,?,?,?)", [fullName, email, service, message]);
    res.json({ id: r.insertId });
  } catch(e){ res.status(500).json({error:e.message}) }
});
app.get('/api/contact', async (req, res) => {
  try { const [rows] = await pool.query("SELECT * FROM contacts ORDER BY full_name ASC"); res.json(rows); } catch(e){ res.status(500).json({error:e.message}) }
});
app.post('/api/applicants', async (req, res) => {
  try {
    const { fullName, phone, email, position, education, experience, interest, appliedBy } = req.body;
    const [r] = await pool.query("INSERT INTO applicants (full_name, phone, email, position, education, experience, interest, applied_by) VALUES (?,?,?,?,?,?,?,?)", [fullName, phone, email, position, education, experience, interest, appliedBy]);
    res.json({ id: r.insertId });
  } catch(e){ res.status(500).json({error:e.message}) }
});
app.get('/api/applicants', async (req, res) => {
  try { const [rows] = await pool.query("SELECT * FROM applicants ORDER BY full_name ASC"); res.json(rows); } catch(e){ res.status(500).json({error:e.message}) }
});

if (process.env.NODE_ENV!== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Running on ${PORT}`));
}
export default app;