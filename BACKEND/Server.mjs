import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const ADMIN_SECRET = process.env.ADMIN_SECRET || "Pinnacle2026!Secure123";
console.log("Admin secret set:", ADMIN_SECRET? "YES" : "NO");

// Auth middleware
function protectAdmin(req, res, next) {
  const secret = req.headers['x-admin-secret'];
  if (secret!== ADMIN_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

app.get('/', (req, res) => res.send('Pinnacle Backend Running - Secured'));

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT) || 4000,
  ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true },
  waitForConnections: true, connectionLimit: 10
});

// === PUBLIC - Anyone can submit ===
app.post('/api/contact', async (req, res) => {
  try {
    const { fullName, email, service, message } = req.body;
    const [r] = await pool.query("INSERT INTO contacts (full_name, email, service, message) VALUES (?,?,?,?)", [fullName, email, service, message]);
    res.json({ id: r.insertId });
  } catch(e){ res.status(500).json({error:e.message}) }
});
app.post('/api/applicants', async (req, res) => {
  try {
    const { fullName, phone, email, position, education, experience, interest, appliedBy } = req.body;
    const [r] = await pool.query("INSERT INTO applicants (full_name, phone, email, position, education, experience, interest, applied_by) VALUES (?,?,?,?,?,?,?,?)", [fullName, phone, email, position, education, experience, interest, appliedBy]);
    res.json({ id: r.insertId });
  } catch(e){ res.status(500).json({error:e.message}) }
});

// === ADMIN LOGIN - For frontend ===
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_SECRET) {
    res.json({ success: true, token: ADMIN_SECRET });
  } else {
    res.status(401).json({ success: false, message: "Wrong password" });
  }
});

// === PROTECTED - Need x-admin-secret header ===
app.get('/api/contact', protectAdmin, async (req, res) => {
  try { const [rows] = await pool.query("SELECT * FROM contacts ORDER BY id DESC"); res.json(rows); }
  catch(e){ res.status(500).json({error:e.message}) }
});
app.get('/api/applicants', protectAdmin, async (req, res) => {
  try { const [rows] = await pool.query("SELECT * FROM applicants ORDER BY id DESC"); res.json(rows); }
  catch(e){ res.status(500).json({error:e.message}) }
});

// NEW: Delete after handling
app.delete('/api/contact/:id', protectAdmin, async (req, res) => {
  try { await pool.query("DELETE FROM contacts WHERE id=?", [req.params.id]); res.json({success:true}); }
  catch(e){ res.status(500).json({error:e.message}) }
});
app.delete('/api/applicants/:id', protectAdmin, async (req, res) => {
  try { await pool.query("DELETE FROM applicants WHERE id=?", [req.params.id]); res.json({success:true}); }
  catch(e){ res.status(500).json({error:e.message}) }
});

if (process.env.NODE_ENV!== 'production') {
  app.listen(process.env.PORT || 5000, () => console.log("Running"));
}
export default app;