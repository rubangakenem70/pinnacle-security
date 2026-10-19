import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom'

const API_URL = "https://pinnacle-security-backend.vercel.app";
const ADMIN_PASSWORD = "Pinnacle2026!Secure123";

const Navbar = () => {
  const loc = useLocation();
  const active = (p) => loc.pathname === p ? { color: '#ffcc00', borderBottom: '3px solid #ffcc00' } : { color: 'white' };
  const [open, setOpen] = useState(false);
  return (
    <nav className="nav">
      <div className="nav-top"><span className="logo">PINNACLE SECURITY LTD</span><span className="menu-btn" onClick={() => setOpen(!open)}>{open ? '✕' : '☰'}</span></div>
      <div className={`links ${open ? 'show' : ''}`}>
        <Link to="/" style={active("/")} onClick={() => setOpen(false)}>Home</Link>
        <Link to="/about" style={active("/about")} onClick={() => setOpen(false)}>About</Link>
        <Link to="/services" style={active("/services")} onClick={() => setOpen(false)}>Services</Link>
        <Link to="/blog" style={active("/blog")} onClick={() => setOpen(false)}>Jobs</Link>
        <Link to="/contact" style={active("/contact")} onClick={() => setOpen(false)}>Contact</Link>
        <Link to="/online-test" style={active("/online-test")} onClick={() => setOpen(false)}>Online Test</Link>
        <Link to="/join" className="btn-yellow" onClick={() => setOpen(false)}>Apply Now</Link>
        <Link to="/admin" className="btn-admin" onClick={() => setOpen(false)}>Admin</Link>
      </div>
    </nav>
  )
}

const Home = () => {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI(p => (p + 1) % 3), 3500); return () => clearInterval(t) }, []);
  const slides = [
    { t: "Pinnacle Security Limited", d: "Plot 442 & 443 Masajjagere, Muyenga - Licensed Security Company" },
    { t: "WE ARE RECRUITING - JOIN US TODAY", d: "SITE INCHARGE: UCE + 3yrs experience | SUPERVISOR: UACE + Rider Permit + 3yrs" },
    { t: "60+ Sites | 150+ Officers | 24/7 Control Room 0754 139726", d: "hr@pinnaclegroup.co.ug | Free Training | No Recruitment Fees" },
  ];
  return (<>
    <div className="hero">
      <h1>{slides[i].t}</h1><p>{slides[i].d}</p>
      <div className="dots">{[0, 1, 2].map(n => <span key={n} className={n === i ? 'dot on' : 'dot'} onClick={() => setI(n)}></span>)}</div>
      <div style={{display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap', marginTop:'10px'}}>
        <Link to="/join" className="btn-yellow big">Apply Now</Link>
        <Link to="/online-test" className="btn-outline">Online Test</Link>
      </div>
    </div>
    <div className="section">
      <div className="home-grid-3">
        <div className="card">
          <h3>Who We Are</h3>
          <p>Pinnacle Security Ltd is a licensed security company operating from <b>Plot 442 & 443 Masajjagere, Muyenga</b>. Fully licensed by URSB and Ministry of Internal Affairs.</p>
          <p style={{marginTop:'10px'}}>We protect <b>60+ sites</b> with <b>150+ trained officers</b>, equipped for residential, commercial and construction sites with professionalism and discipline.</p>
          <p style={{marginTop:'10px'}}>Our <b>24/7 Control Room 0754 139726</b> ensures rapid response and continuous monitoring day and night.</p>
        </div>
        <div className="card gold">
          <h3>🎯 Core Services</h3>
          <p><b>Guard Service:</b> Armed & unarmed guards with supervisor visits and rapid response.</p>
          <p><b>Construction Security:</b> Protect cement, iron bars, timber, tools - material in/out control.</p>
          <p><b>CCTV Installation:</b> Hikvision/Dahua 4-camera system, phone viewing, night vision, 2-year warranty.</p>
          <p><b>Mobile Patrol:</b> Patrol car with 2 officers, day & night visits, 10min emergency response.</p>
          <p><b>Event Security:</b> Weddings, concerts, conferences - crowd control, VIP, parking.</p>
          <p><b>Alarm & Electric Fence:</b> Intruder alarms with phone alerts + electric fence perimeter.</p>
        </div>
        <div className="card dark">
          <h3>🚨 URGENT RECRUITMENT</h3>
          <p><b>SITE INCHARGE:</b> UCE + 3yrs experience.</p>
          <p style={{marginTop:'8px'}}><b>SUPERVISOR:</b> UACE + Rider Permit + 3yrs.</p>
          <p style={{marginTop:'8px', background:'rgba(255,204,0,0.15)', padding:'8px', borderRadius:'8px'}}>Free 2 weeks training at Muyenga HQ. No fees. Uniform provided.</p>
          <Link to="/join" className="btn-yellow big" style={{marginTop:'15px', width:'100%', textAlign:'center', display:'block'}}>Apply Now - Applicant Form</Link>
        </div>
      </div>
    </div>
  </>)
}

// --- NEW JOBS PAGE - NO LIST DOTS, CLEAN ---
const Blog = () => (
  <div className="section">
    <div className="memo-clean">
      <div className="memo-head">
        <h2>INTERNAL MEMO - PINNACLE SECURITY LTD</h2>
        <p><b>From:</b> Human Resource Manager | <b>To:</b> All Applicants | <b>Date:</b> {new Date().toLocaleDateString()} | <b>Ref:</b> PSL/HR/2026/08</p>
        <p><b>Subject: URGENT RECRUITMENT - SITE INCHARGE, SUPERVISOR & GENERAL GUARDS</b></p>
      </div>

      <div className="memo-body-dark">
        <div className="memo-intro">
          Management has approved recruitment for immediate deployment. Applications are <b>No Fees</b>. Training is <b>2 weeks at Muyenga HQ Plot 442/443</b>.
        </div>

        <div className="job-box">
          <div className="job-header">POSITION 1: SITE INCHARGE</div>
          <div className="job-content">
            <p className="req-title">Requirements:</p>
            <div className="req-grid">
              <div><span>Education:</span> Minimum UCE Certificate (S4) with at least 4 passes</div>
              <div><span>Experience:</span> 3+ Years in security (with recommendation letter)</div>
              <div><span>Age:</span> 25-45 years, physically fit</div>
              <div><span>Skills:</span> Can read/write English, make daily OB reports</div>
              <div><span>Record:</span> No criminal record (verified with LC1 & Police)</div>
              <div><span>Leadership:</span> Will manage 5-10 guards</div>
            </div>
            <p className="duty"><b>Duties:</b> Supervise guards, write daily report, handle client complaints, check attendance, ensure uniform discipline.</p>
          </div>
        </div>

        <div className="job-box gold-border">
          <div className="job-header gold">POSITION 2: SUPERVISOR</div>
          <div className="job-content">
            <p className="req-title">Requirements:</p>
            <div className="req-grid">
              <div><span>Education:</span> Minimum UACE Certificate (S6) - 2 principal passes</div>
              <div><span>Rider:</span> Valid Rider Permit Class A - Must ride motorcycle</div>
              <div><span>Experience:</span> 3+ Years as supervisor or site incharge (with proof)</div>
              <div><span>Age:</span> 27-40 years, must have smartphone for reports</div>
              <div><span>Distance:</span> Can ride long distance Kampala-Entebbe, Kampala-Mukono</div>
              <div><span>Character:</span> Honest, not drunkard, no accident history, can train new guards</div>
            </div>
            <p className="duty"><b>Duties:</b> Visit sites per day, check guards, handle emergencies, recruit new guards, report to Operations Manager.</p>
          </div>
        </div>

        <div className="general-box">
          <h3>GENERAL RECRUITMENT: SECURITY OFFICER</h3>
          <p>We are ALWAYS recruiting disciplined men & women to join our team. Apply as general guard and be called when vacancy comes.</p>
          <div className="req-inline">
            <span>P7 / UCE</span> <span>Age 22-45</span> <span>No Crime</span> <span>Physically Fit</span> <span>Day/Night Duty</span>
          </div>
          <Link to="/join" className="big-recruit-btn">APPLY NOW - Applicant Form</Link>
        </div>

        <div className="apply-footer">
          <b>How to Apply:</b> Click Applicant Form button and fill details. Or visit physically Plot 442/443 Masajjagere, Muyenga. Contact HR: <b>hr@pinnaclegroup.co.ug</b> / Control: <b>0754 139726</b>.
        </div>
      </div>
    </div>
  </div>
)

const About = () => (
  <div className="section">
    <h2>About Pinnacle Security Ltd</h2>
    <div className="about-hero">
      <h3>Pinnacle Security Ltd - Protecting What Matters Most Since 2018</h3>
      <p>Located at <b>Plot 442 & 443 Masajjagere, Off Kironde Road, Muyenga Hill, Kampala</b>, Pinnacle Security Limited is a fully licensed Private Security Organization registered under URSB.</p>
      <p>With <b>60+ Active Sites, 150+ Trained Officers</b> and 24/7 Control Room <b>0754 139726</b>, we are one of the fastest growing security companies in Kampala, Wakiso, Mukono and Entebbe corridor.</p>
    </div>
    <div className="about-grid">
      <div className="card about-card"><h3>Our Mission</h3><p>To provide <b>professional, affordable, and reliable security solutions</b> to homes, businesses, construction sites, schools, hotels and events.</p></div>
      <div className="card about-card gold"><h3>Our Vision</h3><p>To be <b>Uganda's most trusted security company by 2030</b>.</p></div>
      <div className="card about-card dark-card"><h3>Core Values</h3><p><b>D</b>iscipline, <b>I</b>ntegrity, <b>S</b>ervice, <b>C</b>ourage, <b>P</b>rofessionalism</p></div>
    </div>
  </div>
)

const Services = () => {
  const [open, setOpen] = useState(null);
  const list = [
    { n: "1. Security Guard Service", short: "Armed & Unarmed guards", full: ["Disciplined guards with uniform, ID, radio. Gate control, patrol, visitor register.", "Includes supervisor visits 3x week, free replacement, monthly report, 10 min response."] },
    { n: "2. Construction Site Security", short: "Protect cement, iron bars", full: ["We understand construction theft. Guards check materials in/out, store management, night patrol."] },
    { n: "3. CCTV Installation", short: "4 cameras from 2.5M with phone viewing", full: ["Supply & install: DVR, 4 HD cameras, 1TB HDD. View on phone anywhere. Night vision, motion alert."] },
    { n: "4. Mobile Patrol", short: "Patrol every 2 hours", full: ["Best for homes without full-time guard. Patrol car with 2 officers. 3 day, 3 night visits. Random timing."] },
    { n: "5. Event Security", short: "Weddings, concerts", full: ["Crowd control, gate, VIP protection, parking control, anti-theft."] },
    { n: "6. Alarm & Electric Fence", short: "Intruder alarm protection", full: ["Magnetic sensors, motion inside, loud siren + call to phone + control room. Electric fence 5 lines."] },
  ];
  return (
    <div className="section"><h2>Our Services - Click to Expand</h2>
      {list.map((s, i) => <div key={i} className="service-box"><div className="service-head" onClick={() => setOpen(open === i ? null : i)}><div><strong>{s.n}</strong><p className="service-short">{s.short}</p></div><span className="expand-btn">{open === i ? 'Close −' : 'Open +'}</span></div>{open === i && <div className="service-body">{s.full.map((p, k) => <p key={k}>{p}</p>)}</div>}</div>)}
    </div>
  )
}

const Contact = () => {
  const [f, setF] = useState({ fullName: "", email: "", phone: "", service: "", message: "" }); const [s, setS] = useState("");
  const send = async (e) => { e.preventDefault(); setS("Submitting..."); try { const r = await fetch(`${API_URL}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) }); if (r.ok) { setS("✅ Submitted!"); setF({ fullName: "", email: "", phone: "", service: "", message: "" }) } else setS("❌ Error"); } catch { setS("❌ Error") } };
  return (
    <div className="section"><h2>Contact Us</h2>
      <div className="form-2col">
        <div className="form-left-info"><div className="card"><h3>Visit Us</h3><p>Plot 442 & 443 Masajjagere, Muyenga Hill, Kampala.<br />Mon-Sat 8am-6pm. Control 24/7.</p><p>📞 0754 139726<br />📧 hr@pinnaclegroup.co.ug</p></div></div>
        <form className="form-big" onSubmit={send}>
          <div className="two-col"><input value={f.fullName} onChange={e => setF({ ...f, fullName: e.target.value })} required placeholder="Fullname" /><input value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} required placeholder="Phone" /></div>
          <div className="two-col"><input type="email" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} required placeholder="Email" /><select value={f.service} onChange={e => setF({ ...f, service: e.target.value })} required><option value="">Choose Service</option><option>Security Guard Service</option><option>Construction Security</option><option>CCTV Installation</option><option>Mobile Patrol</option><option>Event Security</option><option>Alarm System</option></select></div>
          <textarea rows="5" value={f.message} onChange={e => setF({ ...f, message: e.target.value })} required placeholder="Message / Location"></textarea>
          <button className="big-btn">Submit</button>{s && <p className="msg">{s}</p>}
        </form>
      </div>
    </div>
  )
}

const Join = () => {
  const [f, setF] = useState({ fullName: "", phone: "", email: "", education: "", experience: "", interest: "", position: "SITE INCHARGE", district: "" }); const [s, setS] = useState("");
  const send = async (e) => { e.preventDefault(); setS("Submitting..."); try { const r = await fetch(`${API_URL}/api/applicants`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...f, full_name: f.fullName }) }); if (r.ok) { setS("✅ Submitted!"); setF({ fullName: "", phone: "", email: "", education: "", experience: "", interest: "", position: "SITE INCHARGE", district: "" }) } else setS("❌ Error") } catch { setS("❌ Error") } };
  return (
    <div className="section"><h2>Apply Now - Applicant Form</h2>
      <form className="form-big" onSubmit={send}>
        <div className="two-col"><div><label>Full Name *</label><input value={f.fullName} onChange={e => setF({ ...f, fullName: e.target.value })} required placeholder="Fullname" /></div><div><label>Phone *</label><input value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} required placeholder="Phone" /></div></div>
        <div className="two-col"><div><label>Email *</label><input type="email" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} required placeholder="Email" /></div><div><label>Education *</label><select value={f.education} onChange={e => setF({ ...f, education: e.target.value })} required><option value="">Choose</option><option>P7</option><option>UCE</option><option>UACE</option><option>Diploma</option><option>Degree</option></select></div></div>
        <div className="two-col"><div><label>Position *</label><select value={f.position} onChange={e => setF({ ...f, position: e.target.value })} required><option>SITE INCHARGE</option><option>SUPERVISOR</option><option>SECURITY OFFICER</option></select></div><div><label>District *</label><input value={f.district} onChange={e => setF({ ...f, district: e.target.value })} required placeholder="District" /></div></div>
        <div className="two-col"><div><label>Why Interested? *</label><input value={f.interest} onChange={e => setF({ ...f, interest: e.target.value })} required placeholder="Why interested?" /></div><div><label>Experience *</label><input value={f.experience} onChange={e => setF({ ...f, experience: e.target.value })} required placeholder="Years & where" /></div></div>
        <button className="big-btn">Submit Application</button>{s && <p className="msg">{s}</p>}
      </form>
    </div>
  )
}

const OnlineTest = () => (
  <div className="section" style={{textAlign:'center'}}>
    <h2>Online Test</h2>
    <div className="card" style={{maxWidth:'600px', margin:'20px auto'}}>
      <h3>Ready for Aptitude Test?</h3>
      <p style={{margin:'15px 0'}}>Click below to start your online test.</p>
      <a href="https://ee.kobotoolbox.org/your-form-link" target="_blank" rel="noreferrer" className="btn-yellow big">Take Online Test Now</a>
      <p style={{marginTop:'15px'}}><Link to="/join">Or Apply First - Applicant Form</Link></p>
    </div>
  </div>
)

const AdminLogin = () => {
  const [pass, setPass] = useState(""); const [msg, setMsg] = useState(""); const navigate = useNavigate();
  const login = (e) => { e.preventDefault(); if (pass === ADMIN_PASSWORD) { localStorage.setItem("pinnacle_admin_token", pass); setMsg("Correct! Opening..."); setTimeout(() => navigate("/admin"), 500); } else setMsg(`❌ Wrong password.`); };
  return (
    <div className="section" style={{ maxWidth: '520px', margin: '60px auto' }}>
      <div className="form-big" style={{ border: '3px solid #ffcc00', textAlign: 'center' }}>
        <h2>Admin Login</h2><form onSubmit={login} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
          <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Enter Admin Password" required style={{ padding: '16px' }} />
          <button className="big-btn">Login</button>{msg && <p className="msg">{msg}</p>}
        </form>
      </div>
    </div>
  )
}

const Admin = () => {
  const [contacts, setContacts] = useState([]); const [applicants, setApplicants] = useState([]); const [tab, setTab] = useState("contacts"); const [search, setSearch] = useState(""); const [filterType, setFilterType] = useState("all"); const [page, setPage] = useState(1); const perPage = 10; const navigate = useNavigate(); const token = localStorage.getItem("pinnacle_admin_token");
  const load = async () => { try { const headers = { 'x-admin-secret': token, 'Content-Type': 'application/json' }; const [cRes, aRes] = await Promise.all([fetch(`${API_URL}/api/contact`, { headers }), fetch(`${API_URL}/api/applicants`, { headers })]); if (cRes.status === 401) { localStorage.removeItem("pinnacle_admin_token"); navigate("/admin-login"); return; } const cData = await cRes.json(); const aData = await aRes.json(); if (Array.isArray(cData)) setContacts(cData); if (Array.isArray(aData)) setApplicants(aData); } catch {} }
  useEffect(() => { load(); }, []); useEffect(() => { setPage(1); }, [tab, search, filterType]);
  const handleDelete = async (id, type) => { if (!window.confirm("Delete?")) return; const url = type === 'contacts' ? `${API_URL}/api/contact/${id}` : `${API_URL}/api/applicants/${id}`; await fetch(url, { method: 'DELETE', headers: { 'x-admin-secret': token } }); load(); }
  const exportExcel = () => { const data = tab === 'contacts' ? contacts : applicants; if (!data.length) return alert("No data"); const headers = Object.keys(data[0]); const csv = [headers.join(",")].concat(data.map(r => headers.map(h => `"${(r[h] || '').toString().replace(/"/g, '""')}"`).join(","))).join("\n"); const blob = new Blob([csv], { type: 'text/csv' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `pinnacle_${tab}.csv`; a.click(); }
  const logout = () => { localStorage.removeItem("pinnacle_admin_token"); navigate("/admin-login"); }
  const filteredContacts = contacts.filter(c => { const q = search.toLowerCase(); return (c.full_name || "").toLowerCase().includes(q) || (c.email || "").toLowerCase().includes(q) || (c.phone || "").toLowerCase().includes(q); });
  const filteredApplicants = applicants.filter(a => { const q = search.toLowerCase(); return (a.full_name || "").toLowerCase().includes(q) || (a.phone || "").toLowerCase().includes(q); });
  const currentList = tab === "contacts" ? filteredContacts : filteredApplicants; const totalPages = Math.ceil(currentList.length / perPage) || 1; const paged = currentList.slice((page - 1) * perPage, page * perPage);
  return (
    <div className="admin-page"><div className="admin-top"><h2>Admin</h2><div className="stats"><span>{contacts.length} Contacts</span><span>{applicants.length} Applicants</span><span>Page {page}/{totalPages}</span></div><div className="tabs"><button onClick={() => setTab("contacts")} className={tab === "contacts" ? "tab on" : "tab"}>Contacts</button><button onClick={() => setTab("applicants")} className={tab === "applicants" ? "tab on" : "tab"}>Applicants</button><button onClick={exportExcel} className="tab white">Export Excel</button><button onClick={logout} className="tab red">Logout</button></div></div>
      <div className="filter-bar-visible"><input className="search-input-visible" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} /><div className="filter-btns"><button className="btn-yellow small" onClick={load}>Refresh</button><button className="btn-dark small" onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button><button className="btn-dark small" onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</button></div></div>
      <div className="mobile-cards">{paged.map((item, i) => (<div key={i} className="m-card"><div className="m-head"><b>{item.full_name}</b><small>{new Date(item.created_at || Date.now()).toLocaleString()}</small></div><div className="m-line">{item.email}</div><div className="m-line">{item.phone}</div><div className="m-actions-3"><a href={`tel:${item.phone}`} className="m-btn call">Call</a><a href={`https://wa.me/${(item.phone || '').replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="m-btn wa">WhatsApp</a><button onClick={() => handleDelete(item.id, tab)} className="m-btn del">Delete</button></div></div>))}</div>
    </div>
  )
}

const ProtectedAdmin = () => { const token = localStorage.getItem("pinnacle_admin_token"); if (token !== ADMIN_PASSWORD) return <Navigate to="/admin-login" replace />; return <Admin />; }
const Footer = () => <div className="footer">© 2026 Pinnacle Security Ltd | Plot 442 & 443 Masajjagere, Muyenga | HR: hr@pinnaclegroup.co.ug | Control 24/7: 0754 139726</div>

const App = () => (
  <BrowserRouter>
    <style>{`
      *{margin:0;padding:0;box-sizing:border-box} body{font-family:Arial,sans-serif; background:#f4f6f9; line-height:1.6; overflow-x:hidden}
      .nav{background:#0a1931; padding:14px 15px; position:sticky; top:0; z-index:999}.nav-top{display:flex; justify-content:space-between; align-items:center}.logo{color:#ffcc00; font-weight:900; font-size:16px}.menu-btn{color:#fff; font-size:26px; cursor:pointer; display:none}.links{display:flex; gap:10px; align-items:center; justify-content:center; flex-wrap:wrap}.links a{color:#fff; text-decoration:none; font-size:15px; font-weight:700; padding:8px 10px}.btn-yellow{background:#ffcc00!important; color:#0a1931!important; padding:10px 18px!important; border-radius:25px!important; font-weight:900!important; border:none; cursor:pointer; text-decoration:none; display:inline-block; font-size:14px}.btn-yellow.big{padding:14px 26px!important; font-size:16px}.btn-yellow.small{padding:10px 16px!important; font-size:13px}.btn-outline{background:transparent!important; color:#fff!important; border:2px solid #fff!important; padding:12px 24px!important; border-radius:25px!important; font-weight:900!important; text-decoration:none; display:inline-block}.btn-admin{background:#1e3a8a!important; color:#ffcc00!important; border:2px solid #ffcc00!important; padding:8px 16px!important; border-radius:25px!important; font-weight:900!important; text-decoration:none; font-size:14px}.btn-dark{background:#0a1931; color:#ffcc00; border:none; padding:12px 18px; border-radius:10px; font-weight:800; cursor:pointer; font-size:13px}.btn-dark.small{padding:10px 14px}.hero{background:linear-gradient(135deg,#0a1931,#1e3a8a); color:#fff; padding:35px 15px; text-align:center; border-radius:0 0 20px 20px}.hero h1{color:#ffcc00; font-size:22px; margin-bottom:10px}.hero p{font-size:15px}.dots{margin:12px 0}.dot{width:10px; height:10px; background:#555; border-radius:50%; display:inline-block; margin:0 5px; cursor:pointer}.dot.on{background:#ffcc00}.section{padding:18px 12px; max-width:1250px; margin:auto}.section h2{text-align:center; color:#0a1931; border-bottom:4px solid #ffcc00; padding-bottom:8px; margin-bottom:16px; font-size:22px}.card{background:#fff; padding:18px; border-radius:14px; margin-bottom:14px; box-shadow:0 4px 12px rgba(0,0,0,0.06); border-left:5px solid #0a1931; font-size:15px; line-height:1.7}.card.gold{border-left-color:#ffcc00; background:#fffbeb}.card.dark{background:linear-gradient(135deg,#1e293b,#0f172a); color:#fff; border-left-color:#ffcc00}.card h3{font-size:18px; margin-bottom:10px; color:#0a1931}.card.dark h3{color:#ffcc00}
      .home-grid-3{display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px} @media(max-width:900px){.home-grid-3{grid-template-columns:1fr}}
      
      /* NEW JOBS PAGE - NO BULLETS, DARK TEXT */
      .memo-clean{background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 6px 20px rgba(0,0,0,0.08); border:3px solid #0a1931}
      .memo-head{background:#0a1931; color:#fff; padding:20px; text-align:center}
      .memo-head h2{color:#ffcc00; font-size:18px; border:none; margin-bottom:8px}
      .memo-head p{font-size:12px; margin-top:4px; color:#fff}
      .memo-body-dark{padding:20px; background:#fff}
      .memo-intro{background:#0a1931; color:#ffcc00; padding:14px; border-radius:10px; font-weight:800; text-align:center; font-size:14px; margin-bottom:16px}
      .job-box{background:#f8faff; border-radius:12px; margin-bottom:16px; border:2px solid #0a1931; overflow:hidden}
      .job-box.gold-border{border-color:#ffcc00; background:#fffdf0}
      .job-header{background:#0a1931; color:#ffcc00; padding:12px 16px; font-weight:900; font-size:15px; text-align:center}
      .job-header.gold{background:#ffcc00; color:#0a1931}
      .job-content{padding:16px}
      .req-title{font-weight:900; color:#0a1931; margin-bottom:10px; font-size:14px; border-bottom:2px solid #ffcc00; display:inline-block; padding-bottom:4px}
      .req-grid{display:grid; grid-template-columns:1fr 1fr; gap:10px} @media(max-width:700px){.req-grid{grid-template-columns:1fr}}
      .req-grid div{background:#fff; padding:10px; border-radius:8px; border:1px solid #e2e8f0; font-size:13px; color:#0a1931; font-weight:600}
      .req-grid div span{font-weight:900; color:#0a1931; display:block; font-size:11px; text-transform:uppercase; margin-bottom:2px}
      .duty{background:#fff3cd; padding:12px; border-radius:8px; margin-top:12px; color:#0a1931; font-size:13px; font-weight:700; border-left:4px solid #ffcc00}
      .general-box{background:linear-gradient(135deg,#0a1931,#1e3a8a); color:#fff; padding:20px; border-radius:14px; text-align:center; border:2px solid #ffcc00; margin-bottom:16px}
      .general-box h3{color:#ffcc00; margin-bottom:10px}
      .general-box p{color:#fff; font-size:14px}
      .req-inline{display:flex; gap:6px; flex-wrap:wrap; justify-content:center; margin:12px 0}
      .req-inline span{background:rgba(255,204,0,0.2); border:1px solid #ffcc00; color:#ffcc00; padding:6px 12px; border-radius:20px; font-size:11px; font-weight:800}
      .big-recruit-btn{display:block; background:#ffcc00; color:#0a1931; padding:16px; border-radius:12px; font-weight:900; text-decoration:none; margin-top:12px; font-size:16px; text-align:center}
      .apply-footer{background:#f1f5f9; padding:14px; border-radius:10px; color:#0a1931; font-size:13px; font-weight:600; border:2px solid #0a1931; text-align:center}

      .about-hero{background:linear-gradient(135deg,#0a1931,#1e3a8a); color:#fff; padding:22px; border-radius:16px; margin-bottom:16px; border:2px solid #ffcc00}.about-hero h3{color:#ffcc00; font-size:20px; margin-bottom:12px}.about-hero p{margin-bottom:10px; line-height:1.8}.about-grid{display:grid; grid-template-columns:1fr; gap:14px; margin-bottom:16px}.about-card{text-align:center}
      .service-box{background:#fff; border-radius:12px; margin-bottom:10px; box-shadow:0 2px 8px rgba(0,0,0,0.05); border-left:4px solid #0a1931; overflow:hidden}.service-head{display:flex; justify-content:space-between; align-items:center; padding:14px; cursor:pointer; background:#fff}.service-short{font-size:12px; color:#666; margin-top:3px}.expand-btn{background:#0a1931; color:#ffcc00; padding:6px 12px; border-radius:20px; font-size:12px; font-weight:800}.service-body{background:#f8fafc; padding:14px; border-top:1px solid #e2e8f0}.service-body p{margin-bottom:8px; font-size:14px; color:#0a1931; font-weight:600}
      .form-big{max-width:900px; margin:16px auto; background:#fff; padding:22px; border-radius:16px; display:flex; flex-direction:column; gap:14px; box-shadow:0 6px 20px rgba(0,0,0,0.08)}.form-big input,.form-big select,.form-big textarea{padding:14px; border:2px solid #0a1931; border-radius:10px; font-size:16px; width:100%}.form-big label{font-size:13px; font-weight:800; color:#0a1931; margin-bottom:4px; display:block}.two-col{display:grid; grid-template-columns:1fr 1fr; gap:14px} @media(max-width:700px){.two-col{grid-template-columns:1fr}}.form-2col{display:grid; grid-template-columns:300px 1fr; gap:16px} @media(max-width:900px){.form-2col{grid-template-columns:1fr}}.big-btn{background:#0a1931; color:#ffcc00; padding:16px; border:none; border-radius:12px; font-weight:900; cursor:pointer; font-size:17px}.msg{padding:12px; background:#d4edda; border-radius:10px; font-size:14px; text-align:center; font-weight:700}
      .admin-page{padding:10px; max-width:1300px; margin:auto}.admin-top{background:linear-gradient(135deg,#0a1931,#1e3a8a); color:#fff; padding:16px; border-radius:16px; text-align:center; margin-bottom:10px; border:2px solid #ffcc00}.admin-top h2{color:#ffcc00; border:none; margin-bottom:6px; font-size:18px}.stats{display:flex; gap:8px; justify-content:center; margin:10px 0; flex-wrap:wrap}.stats span{background:rgba(255,204,0,0.15); border:1.5px solid #ffcc00; padding:6px 12px; border-radius:20px; font-size:12px; font-weight:800; color:#ffcc00}.tabs{display:flex; gap:8px; justify-content:center; margin-top:10px; flex-wrap:wrap}.tab{padding:8px 16px; border-radius:20px; border:1.5px solid #ffcc00; background:transparent; color:#ffcc00; font-weight:800; font-size:12px; cursor:pointer}.tab.on{background:#ffcc00; color:#0a1931}.tab.white{background:#fff; color:#0a1931}.tab.red{border-color:#ff4444; color:#ff4444}
      .filter-bar-visible{display:flex; gap:8px; margin-bottom:12px; background:#ffffff; padding:14px; border-radius:14px; flex-wrap:wrap; align-items:center; border:3px solid #0a1931; box-shadow:0 4px 12px rgba(0,0,0,0.1)}.search-input-visible{flex:1; padding:14px 16px; border-radius:10px; border:3px solid #0a1931; font-size:14px; min-width:200px; background:#ffffff; color:#0a1931; font-weight:800}.filter-btns{display:flex; gap:6px; flex-wrap:wrap}
      .mobile-cards{display:flex; flex-direction:column; gap:10px}.m-card{background:#fff; border-radius:12px; padding:14px; box-shadow:0 2px 10px rgba(0,0,0,0.07); border-left:4px solid #ffcc00; border:2px solid #0a1931}.m-head{display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:4px}.m-head b{font-size:14px; color:#0a1931}.m-head small{font-size:10px; color:#0a1931; background:#ffcc00; padding:4px 8px; border-radius:10px; font-weight:800}.m-line{font-size:12px; color:#334155; margin:2px 0; word-break:break-all}.m-actions-3{display:grid; grid-template-columns:1fr 1fr 0.8fr; gap:6px; margin-top:8px}.m-btn{text-align:center; padding:10px 8px; border-radius:8px; font-size:11px; font-weight:800; text-decoration:none; border:none; cursor:pointer}.m-btn.call{background:#0a1931; color:#ffcc00}.m-btn.wa{background:#22c55e; color:#fff}.m-btn.del{background:#fee2e2; color:#dc2626}
      .footer{background:#0a1931; color:#aaa; text-align:center; padding:16px; font-size:11px; margin-top:20px; line-height:1.6} @media(max-width:850px){.menu-btn{display:block}.links{display:none; flex-direction:column; align-items:flex-start; padding-top:12px}.links.show{display:flex} }
    `}</style>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/join" element={<Join />} />
      <Route path="/online-test" element={<OnlineTest />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin" element={<ProtectedAdmin />} />
    </Routes>
    <Footer />
  </BrowserRouter>
)
export default App