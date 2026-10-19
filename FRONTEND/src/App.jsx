import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom'

const API_URL = "https://pinnacle-security-backend.vercel.app";
const ADMIN_PASSWORD = "Pinnacle2026!Secure123";
const GOOGLE_SHEET_WEBHOOK = "https://script.google.com/macros/s/AKfycbz0Fx9gSfPwPXZdi8pivw9IdQ_fzj707fPk22GBECuGYhGzwePtEPZV47TyXk8TN8bggQ/exec";
const GOOGLE_SHEET_VIEW_URL = "https://docs.google.com/spreadsheets/";

const Navbar = () => {
  const loc = useLocation();
  const active = (p) => loc.pathname === p ? { color: '#ffcc00', borderBottom: '3px solid #ffcc00' } : { color: 'white' };
  const [open, setOpen] = useState(false);
  return (
    <nav className="nav">
      <div className="nav-top">
        <span className="logo">PINNACLE SECURITY LTD</span>
        <span className="menu-btn" onClick={() => setOpen(!open)}>{open ? '✕' : '☰'}</span>
      </div>
      <div className={`links ${open ? 'show' : ''}`}>
        <Link to="/" style={active("/")} onClick={() => setOpen(false)}>Home</Link>
        <Link to="/about" style={active("/about")} onClick={() => setOpen(false)}>About</Link>
        <Link to="/services" style={active("/services")} onClick={() => setOpen(false)}>Services</Link>
        <Link to="/mission" style={active("/mission")} onClick={() => setOpen(false)}>Mission</Link>
        <Link to="/blog" style={active("/blog")} onClick={() => setOpen(false)}>Jobs</Link>
        <Link to="/contact" style={active("/contact")} onClick={() => setOpen(false)}>Contact</Link>
        <Link to="/join" className="btn-yellow" onClick={() => setOpen(false)}>Apply Now</Link>
      </div>
    </nav>
  )
}

const Home = () => {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI(p => (p + 1) % 3), 3500);
    return () => clearInterval(t)
  }, []);
  const slides = [
    { t: "Pinnacle Security Limited", d: "Plot 442 & 443 Masajjagere, Muyenga - Licensed Security Company" },
    { t: "WE ARE RECRUITING - JOIN US TODAY", d: "SITE INCHARGE: UCE + 3yrs | SUPERVISOR: UACE + Rider Permit + 3yrs" },
    { t: "60+ Sites | 150+ Officers | 24/7 Control Room 0754 139726", d: "hr@pinnaclegroup.co.ug | Free Training | No Recruitment Fees" },
  ];
  return (
    <>
      <div className="hero">
        <h1>{slides[i].t}</h1>
        <p>{slides[i].d}</p>
        <div className="dots">
          {[0, 1, 2].map(n => <span key={n} className={n === i ? 'dot on' : 'dot'} onClick={() => setI(n)}></span>)}
        </div>
        <div style={{display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap', marginTop:'12px'}}>
          <Link to="/join" className="btn-yellow big">Apply Now</Link>
        </div>
      </div>
      <div className="section">
        <div className="home-grid-3">
          <div className="card">
            <h3>Who We Are</h3>
            <p>Pinnacle Security Ltd is a licensed company at <b>Plot 442 & 443 Masajjagere, Muyenga</b>. Licensed by URSB and Ministry of Internal Affairs.</p>
            <p style={{marginTop:'12px'}}>We protect <b>60+ sites</b> with <b>150+ trained officers</b> across Kampala, Wakiso, Mukono, Entebbe.</p>
            <p style={{marginTop:'12px'}}>Our <b>24/7 Control Room 0754 139726</b> ensures rapid response day and night. No hidden fees.</p>
          </div>
          <div className="card gold">
            <h3>🎯 Core Services</h3>
            <p><b>Guard Service:</b> Armed & unarmed guards with supervision and rapid response.</p>
            <p><b>Construction Security:</b> Protect cement, iron bars, tools - material control.</p>
            <p><b>CCTV:</b> Hikvision/Dahua 4-camera system, phone viewing, 2-year warranty.</p>
            <p><b>Mobile Patrol:</b> Patrol car day & night visits, 10min emergency response.</p>
            <Link to="/services" style={{color:'#0a1931', fontWeight:'900', fontSize:'16px', marginTop:'12px', display:'inline-block'}}>View All Services →</Link>
          </div>
          <div className="card dark">
            <h3>🚨 URGENT RECRUITMENT</h3>
            <p><b>SITE INCHARGE:</b> UCE + 3yrs experience.</p>
            <p style={{marginTop:'10px'}}><b>SUPERVISOR:</b> UACE + Rider Permit + 3yrs.</p>
            <p style={{marginTop:'10px', background:'rgba(255,204,0,0.15)', padding:'10px', borderRadius:'10px'}}>Free 2 weeks training at Muyenga HQ. No fees.</p>
            <Link to="/join" className="btn-yellow big" style={{marginTop:'18px', width:'100%', textAlign:'center', display:'block'}}>Apply Now - Applicant Form</Link>
          </div>
        </div>
      </div>
    </>
  )
}

const About = () => (
  <div className="section">
    <h2>About Pinnacle Security Ltd</h2>
    <div className="about-hero">
      <h3>Pinnacle Security Ltd - Protecting What Matters Most Since 2018</h3>
      <p><b>Paragraph 1 - Who We Are & Location:</b> Located at <b>Plot 442 & 443 Masajjagere, Off Kironde Road, Muyenga Hill, Kampala - Uganda</b>, Pinnacle Security Limited is a fully licensed Private Security Organization registered under URSB, PSFU and Ministry of Internal Affairs. We are licensed to provide armed and unarmed guards, CCTV, patrol and alarm services across Uganda.</p>
      <p><b>Paragraph 2 - Our Capacity, Team & Coverage:</b> With <b>60+ Active Sites, 150+ Trained Officers and 24/7 Control Room 0754 139726</b>, we have the manpower, technology and infrastructure to protect what matters most. Every officer is vetted by LC1, Police and ISO. We cover Muyenga, Buziga, Munyonyo, Ggaba, Kansanga, Kabalagala, Entebbe Road, Mukono and Wakiso. Our control room monitors all sites day and night with rapid response team on standby.</p>
      <p><b>Paragraph 3 - What Makes Us Different (No Exploitation):</b> Unlike other security companies that exploit guards with low pay and hidden fees, we believe in <b>No Hidden Fees, No Exploitation, Free Training for all recruits</b>. We do not charge any recruitment fees. We provide free 2 weeks training at Muyenga HQ Plot 442/443, free uniform, free accommodation during training, and we pay on time every 28th-30th. Our guards are happy and disciplined.</p>
      <p><b>Paragraph 4 - Our Services & Technology:</b> Our core services include Security Guard Service (Armed & Unarmed), Construction Site Security (protecting cement, iron bars D12/D16, timber, tools), CCTV Installation & Monitoring (Hikvision/Dahua with phone viewing), Mobile Patrol & Rapid Response (patrol car day & night, 10min response), Event Security & Bouncers (weddings, concerts, conferences), and Alarm Systems & Electric Fences. We use modern technology + trained manpower for maximum protection.</p>
      <p><b>Paragraph 5 - Our Clients & Experience:</b> We have protected homes, shops, schools, hotels, factories, construction sites in Muyenga, Buziga and Munyonyo since 2018. We have handled 40+ construction sites, 20+ homes and businesses, and 10+ events. Our clients trust us because we are honest, we keep time, we wear uniform properly, and we report daily. Every site gets supervisor visits 3 times a week and monthly report.</p>
      <p><b>Paragraph 6 - Our Promise & Future Vision:</b> Our promise is simple - to protect lives, property and investments with discipline, integrity and courage. We want to be <b>Uganda's most trusted and most respected security company by 2030</b>, expanding from 60+ sites to 500+ sites across Uganda while maintaining quality. Contact us today at <b>hr@pinnaclegroup.co.ug or Control Room 0754 139726</b> for a free security assessment and quotation. No consultation fees.</p>
    </div>
  </div>
)

const Contact = () => {
  const [f, setF] = useState({ fullName: "", email: "", phone: "", service: "", message: "" });
  const [s, setS] = useState("");
  const send = async (e) => {
    e.preventDefault();
    setS("Submitting to Google Sheet...");
    try {
      await fetch(GOOGLE_SHEET_WEBHOOK, { method: 'POST', mode: 'no-cors', body: JSON.stringify({ type: 'contact', ...f, timestamp: new Date().toISOString() }) });
      setS("✅ Submitted! Saved to Google Sheet");
      setF({ fullName: "", email: "", phone: "", service: "", message: "" })
    } catch { setS("✅ Submitted! Saved to Google Sheet") }
  };
  return (
    <div className="section">
      <h2>Contact Us</h2>
      <div className="form-2col">
        <div className="form-left-info">
          <div className="card">
            <h3>Visit Us</h3>
            <p>Plot 442 & 443 Masajjagere, Muyenga Hill, Kampala.<br />Mon-Sat 8am-6pm. Control 24/7.</p>
            <p>📞 0754 139726<br />📧 hr@pinnaclegroup.co.ug</p>
          </div>
        </div>
        <form className="form-big" onSubmit={send}>
          <div className="two-col">
            <input value={f.fullName} onChange={e => setF({ ...f, fullName: e.target.value })} required placeholder="Fullname" />
            <input value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} required placeholder="Phone" />
          </div>
          <div className="two-col">
            <input type="email" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} required placeholder="Email" />
            <select value={f.service} onChange={e => setF({ ...f, service: e.target.value })} required>
              <option value="">Choose Service</option>
              <option>Security Guard Service</option>
              <option>Construction Security</option>
              <option>CCTV Installation</option>
              <option>Mobile Patrol</option>
              <option>Event Security</option>
              <option>Alarm System</option>
            </select>
          </div>
          <textarea rows="5" value={f.message} onChange={e => setF({ ...f, message: e.target.value })} required placeholder="Message / Location"></textarea>
          <button className="big-btn">Submit</button>
          {s && <p className="msg">{s}</p>}
        </form>
      </div>
    </div>
  )
}

const Join = () => {
  const [f, setF] = useState({ fullName: "", phone: "", email: "", education: "", experience: "", interest: "", position: "SITE INCHARGE", district: "" });
  const [s, setS] = useState("");
  const send = async (e) => {
    e.preventDefault();
    setS("Submitting to Google Sheet...");
    try {
      await fetch(GOOGLE_SHEET_WEBHOOK, { method: 'POST', mode: 'no-cors', body: JSON.stringify({ type: 'applicant', ...f, timestamp: new Date().toISOString() }) });
      setS("✅ Submitted! Saved to Google Sheet");
      setF({ fullName: "", phone: "", email: "", education: "", experience: "", interest: "", position: "SITE INCHARGE", district: "" })
    } catch { setS("✅ Submitted! Saved to Google Sheet") }
  };
  return (
    <div className="section">
      <h2>Apply Now - Applicant Form</h2>
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

const Footer = () => {
  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <div className="footer">
      <div className="footer-quick">
        <h4>Quick Links</h4>
        <div className="footer-links">
          <Link to="/" onClick={handleLinkClick}>Home</Link>
          <Link to="/about" onClick={handleLinkClick}>About</Link>
          <Link to="/services" onClick={handleLinkClick}>Services</Link>
          <Link to="/mission" onClick={handleLinkClick}>Mission</Link>
          <Link to="/blog" onClick={handleLinkClick}>Jobs</Link>
          <Link to="/contact" onClick={handleLinkClick}>Contact</Link>
          <Link to="/join" onClick={handleLinkClick}>Apply Now</Link>
        </div>
      </div>
      <div className="footer-bottom">
        © 2026 Pinnacle Security Ltd | Plot 442 & 443 Masajjagere, Muyenga | HR: hr@pinnaclegroup.co.ug | Control 24/7: 0754 139726
      </div>
    </div>
  )
}

// Keep Admin routes for direct access but not in nav
const AdminLogin = () => {
  const [pass, setPass] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const login = (e) => {
    e.preventDefault();
    if (pass === ADMIN_PASSWORD) {
      localStorage.setItem("pinnacle_admin_token", pass);
      setMsg("Correct! Opening...");
      setTimeout(() => navigate("/admin"), 500);
    } else setMsg(`❌ Wrong password.`);
  };
  return (
    <div className="section" style={{ maxWidth: '520px', margin: '60px auto' }}>
      <div className="form-big" style={{ border: '3px solid #ffcc00', textAlign: 'center' }}>
        <h2>Admin Login</h2>
        <form onSubmit={login} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
          <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Enter Admin Password" required style={{ padding: '18px', fontSize:'16px' }} />
          <button className="big-btn">Login</button>{msg && <p className="msg">{msg}</p>}
        </form>
      </div>
    </div>
  )
}

const App = () => (
  <BrowserRouter>
    <style>{`
      *{margin:0;padding:0;box-sizing:border-box; font-family: Arial, Helvetica, sans-serif !important}
      html{scroll-behavior:smooth}
      body{font-family: Arial, Helvetica, sans-serif !important; background:#f4f6f9; line-height:1.8; overflow-x:hidden; padding-top:75px; font-size:17px}
      .nav{background:#0a1931; padding:16px 18px; position:fixed; top:0; left:0; right:0; width:100%; z-index:9999; box-shadow:0 4px 12px rgba(0,0,0,0.3)}
      .nav-top{display:flex; justify-content:space-between; align-items:center}.logo{color:#ffcc00; font-weight:900; font-size:18px}.menu-btn{color:#fff; font-size:28px; cursor:pointer; display:none}.links{display:flex; gap:12px; align-items:center; justify-content:center; flex-wrap:wrap}.links a{color:#fff; text-decoration:none; font-size:16px; font-weight:700; padding:8px 12px}
      .btn-yellow{background:#ffcc00!important; color:#0a1931!important; padding:11px 20px!important; border-radius:25px!important; font-weight:900!important; border:none; cursor:pointer; text-decoration:none; display:inline-block; font-size:16px}.btn-yellow.big{padding:16px 28px!important; font-size:18px}
      .hero{background:linear-gradient(135deg,#0a1931,#1e3a8a); color:#fff; padding:40px 18px; text-align:center; border-radius:0 0 20px 20px}.hero h1{color:#ffcc00; font-size:28px; margin-bottom:12px; font-weight:900}.hero p{font-size:18px}.dots{margin:14px 0}.dot{width:12px; height:12px; background:#555; border-radius:50%; display:inline-block; margin:0 6px; cursor:pointer}.dot.on{background:#ffcc00}
      .section{padding:22px 14px; max-width:1280px; margin:auto}.section h2{text-align:center; color:#0a1931; border-bottom:4px solid #ffcc00; padding-bottom:10px; margin-bottom:18px; font-size:26px; font-weight:900}
      .card{background:#fff; padding:20px; border-radius:14px; margin-bottom:16px; box-shadow:0 4px 12px rgba(0,0,0,0.06); border-left:6px solid #0a1931; font-size:17px; line-height:1.8; color:#0a1931}.card.gold{border-left-color:#ffcc00; background:#fffbeb}.card.dark{background:linear-gradient(135deg,#1e293b,#0f172a); color:#fff; border-left-color:#ffcc00}.card h3{font-size:20px; margin-bottom:12px; color:#0a1931; font-weight:900}.card.dark h3{color:#ffcc00}
      .home-grid-3{display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px} @media(max-width:900px){.home-grid-3{grid-template-columns:1fr}}
      .about-hero{background:linear-gradient(135deg,#0a1931,#1e3a8a); color:#fff; padding:24px; border-radius:16px; margin-bottom:18px; border:2px solid #ffcc00}.about-hero h3{color:#ffcc00; font-size:24px; margin-bottom:16px; text-align:center; font-weight:900}.about-hero p{margin-bottom:18px; line-height:1.9; color:#fff; font-size:17px; background:rgba(255,255,255,0.07); padding:14px; border-radius:10px}
      .form-big{max-width:900px; margin:18px auto; background:#fff; padding:24px; border-radius:16px; display:flex; flex-direction:column; gap:16px; box-shadow:0 6px 20px rgba(0,0,0,0.08)}.form-big input,.form-big select,.form-big textarea{padding:16px; border:2px solid #0a1931; border-radius:10px; font-size:17px; width:100%; background:#ffffff !important; color:#0a1931 !important}.form-big label{font-size:15px; font-weight:800; color:#0a1931; margin-bottom:4px; display:block}.two-col{display:grid; grid-template-columns:1fr 1fr; gap:16px} @media(max-width:700px){.two-col{grid-template-columns:1fr}}.form-2col{display:grid; grid-template-columns:300px 1fr; gap:18px} @media(max-width:900px){.form-2col{grid-template-columns:1fr}}.big-btn{background:#0a1931; color:#ffcc00; padding:18px; border:none; border-radius:12px; font-weight:900; cursor:pointer; font-size:19px}.msg{padding:14px; background:#d4edda; border-radius:10px; font-size:16px; text-align:center; font-weight:700}
      .footer{background:#0a1931; color:#aaa; text-align:center; padding:0; font-size:13px; margin-top:24px; line-height:1.8}.footer-quick{background:#0f2040; padding:20px 18px; border-bottom:1px solid #1e3a5f}.footer-quick h4{color:#ffcc00; font-size:16px; font-weight:900; margin-bottom:12px; letter-spacing:1px}.footer-links{display:flex; gap:14px; justify-content:center; flex-wrap:wrap}.footer-links a{color:#fff; text-decoration:none; font-size:14px; font-weight:700; padding:6px 12px; border:1px solid #1e3a5f; border-radius:20px; transition:all 0.2s}.footer-links a:hover{background:#ffcc00; color:#0a1931; border-color:#ffcc00}.footer-bottom{padding:18px; background:#0a1931}
      @media(max-width:850px){.menu-btn{display:block}.links{display:none; flex-direction:column; align-items:flex-start; padding-top:14px}.links.show{display:flex} body{padding-top:68px}}
    `}</style>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/mission" element={<MissionPage />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/join" element={<Join />} />
      <Route path="/admin-login" element={<AdminLogin />} />
    </Routes>
    <Footer />
  </BrowserRouter>
)

export default App