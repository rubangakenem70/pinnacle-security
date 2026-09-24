import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'

const Navbar = () => {
  const loc = useLocation();
  const a = (p) => loc.pathname === p? { color: '#ffcc00', borderBottom: '2px solid #ffcc00' } : { color: 'white' };
  return (
    <nav className="nav centered-nav">
      <div className="links centered-links">
        <Link to="/" style={a("/")} className="nav-link">Home</Link>
        <Link to="/about" style={a("/about")} className="nav-link">About</Link>
        <Link to="/services" style={a("/services")} className="nav-link">Services</Link>
        <Link to="/blog" style={a("/blog")} className="nav-link">Jobs</Link>
        <Link to="/contact" style={a("/contact")} className="nav-link">Contact</Link>
        <Link to="/join" className="btn-nav">Apply Now</Link>
      </div>
    </nav>
  )
}

const Home = () => {
  const [active, setActive] = useState(0);
  useEffect(() => { const i = setInterval(() => setActive(p => (p + 1) % 3), 3000); return () => clearInterval(i) }, [])
  const slides = [
    { t: "Pinnacle Security Limited - 4.3★ Rated", d: "Plot 442 & 443 Masajjagere, Off Kironde Road Muyenga, P.O.Box 124853 Kampala" },
    { t: "We Are Recruiting - Join Our Team", d: "SITE INCHARGE UCE + 3yrs & SUPERVISOR UACE + Rider Permit 3yrs - Apply Now" },
    { t: "Security Guard Service ISIC 8010 & Construction F", d: "60+ Sites, 150+ Officers, 0754 139726, hr@pinnaclegroup.co.ug" },
  ];
  return (
    <div className="hero active-hero"><h1>{slides[active].t}</h1><p>{slides[active].d}</p>
      <div className="dots">{[0, 1, 2].map(i => <span key={i} className={i === active? 'dot active' : 'dot'} onClick={() => setActive(i)}></span>)}</div>
      <Link to="/join" className="btn">Apply Now</Link>
    </div>
  )
}

const About = () => (
  <div className="section">
    <h2>About Pinnacle Security Limited</h2>
    <div className="about-text-full">
      <p>Pinnacle Security Limited is a licensed security company in Kampala, Uganda located at Plot 442 & 443 Masajjagere, Off Kironde Road Muyenga, P.O.Box 124853 Kampala, Uganda. We are working in Security Guard Service industry under ISIC 8010 and Construction under F category. Our company is rated 4.3★ (11 reviews) at Kironde Rd and 4.3★ (92 reviews) at 256 Bukasa Rd branch. We operate from 8:00 AM – 4:00 PM daily and have wheelchair accessible parking at both offices.</p>
      <p>Our mission is to provide reliable, professional and affordable security services that exceed client expectations across Central Region. Our vision is to be the leading security company in East Africa known for integrity and excellence. We have grown from Kironde Rd base to protect 60+ sites with 150+ disciplined officers. Our control room number is 0754 139726, email hr@pinnaclegroup.co.ug, hrassistant@pinnaclegroup.co.ug, info@pinnaclegroup.co.ug and website pinnaclegroup.co.ug.</p>
      <p>Our professional guards wear dark blue Pinnacle Security uniform with radios, caps, badges and Uganda flag. They are trained for 2 weeks free at our HQ Plot 442 & 443 Masajjagere, Off Kironde Road Muyenga. Training includes code of conduct, patrol, radio 10-codes, first aid, CCTV basics, customer care. We value clean file record, discipline and merit-based selection as per internal memo dated 11 SEP 2026 from Human Resource Office. Our guards handshake with clients shows trust and professionalism.</p>
      <p>We are currently recruiting SITE INCHARGE requiring UCE plus 3 years experience in security field for new employees or 3 years at level 1 position for ongoing employees and SUPERVISOR / DEPLOYMENT OFFICER requiring UACE plus valid rider's permit minimum 3 years riding experience plus 3 years experience. Applications via hr@pinnaclegroup.co.ug or physically to Human Resource Manager P.O.Box 124853 Kampala. We encourage ongoing employees to develop career path. BEST OF LUCK from HR Office.</p>
    </div>
    <div className="about-hero" style={{ marginTop: '20px' }}>
      <div className="about-card gold"><h3>📍 Location</h3><p>P.O.Box 124853 Kampala<br />Plot 442 & 443 Masajjagere<br />Off Kironde Road Muyenga</p></div>
      <div className="about-card blue"><h3>🎯 Mission</h3><p>Reliable, professional and affordable security services across Uganda.</p></div>
      <div className="about-card dark"><h3>📧 HR Contact</h3><p>hr@pinnaclegroup.co.ug<br />hrassistant@pinnaclegroup.co.ug<br />0754 139726</p></div>
    </div>
  </div>
)

const Services = () => {
  const [open, setOpen] = useState(null);
  const services = [
    { name: "Security Guard Service", desc: ["Pinnacle Security Limited at Plot 442 & 443 Masajjagere, Off Kironde Road Muyenga is licensed under ISIC 8010 for Security Guard Service. We provide armed and unarmed guards for offices, homes, schools, NGOs, banks across Kampala Central Region.", "Our officers are trained at our HQ 8AM-4PM, vetted by Uganda Police, disciplined and professional. We have 150+ officers deployed across 60+ sites with 4.3★ rating from 11 reviews and 4.3★ (92) at Bukasa Rd branch.", "We operate 24/7 vigilance with radios, GPS tracking, incident reports. Control room reachable at 0754 139726. Wheelchair accessible parking yes at both offices. Your safety is our priority."] },
    { name: "Construction Security", desc: ["Second category F - Construction security. We protect construction materials, equipment and workers on building sites across Central Region from our Bukasa Rd 256 office.", "Our construction security officers prevent theft, control access, monitor CCTV and ensure safety compliance. Managed from Plot 442 & 443 Masajjagere with patrol vehicles.", "Contact us via hr@pinnaclegroup.co.ug or P.O.Box 124853 Kampala for site assessment. We provide free survey 8AM-4PM daily."] },
    { name: "CCTV & Mobile Patrol", desc: ["We install and monitor CCTV cameras, alarm systems and access control at client sites and at our HQ Plot 442 & 443 Masajjagere, Off Kironde Road.", "Mobile patrol vehicles provide quick response within 10 minutes across Kampala. GPS tracked and monitored from control room at 0754 139726.", "Modern technology combined with trained officers gives you peace of mind. Visit pinnaclegroup.co.ug or email info@pinnaclegroup.co.ug for quote."] },
  ];
  return (
    <div className="section"><h2>Our Services</h2>
      <div className="service-dropdown">
        {services.map((s, i) => <div key={i} className="dropdown-item">
          <div className="dropdown-head" onClick={() => setOpen(open === i? null : i)}><h3>{s.name}</h3><button className="close-btn">{open === i? 'Close -' : 'Open +'}</button></div>
          {open === i && <div className="dropdown-body">{s.desc.map((p, idx) => <p key={idx}>{p}</p>)}<button className="close-btn small" onClick={() => setOpen(null)}>Close</button></div>}
        </div>)}
      </div>
      <div className="recruit-note"><h3>🚨 We Are Recruiting</h3><p>Plot 442 & 443 Masajjagere - SITE INCHARGE UCE + 3yrs & SUPERVISOR UACE + Rider permit 3yrs</p><Link to="/join" className="btn">Apply Now</Link></div>
    </div>
  )
}

const Contact = () => {
  const [form, setForm] = useState({ fullName: "", email: "", service: "", message: "" });
  const [status, setStatus] = useState("");
  const handleSubmit = async (e) => { e.preventDefault(); try { const r = await fetch('http://localhost:5000/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) }); if (r.ok) { setStatus("✅ Saved!"); setForm({ fullName: "", email: "", service: "", message: "" }) } } catch { setStatus("❌ Backend not running") } };
  return (
    <div className="section"><h2>Contact Us</h2>
      <form className="form centered-form" onSubmit={handleSubmit}>
        <label>Full Names <span className="red">*</span></label><input placeholder="Full Names" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value })} required />
        <label>Email <span className="red">*</span></label><input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value })} required />
        <label>Choose your service <span className="red">*</span></label><select value={form.service} onChange={e => setForm({...form, service: e.target.value })} required><option value="">Choose your service *</option><option>Security Guard Service</option><option>Construction Security</option><option>CCTV Installation</option><option>Mobile Patrol</option><option>Event Security</option></select>
        <label>Message <span className="red">*</span></label><textarea rows="5" placeholder="Message" value={form.message} onChange={e => setForm({...form, message: e.target.value })} required></textarea>
        <button>Submit</button>{status && <p className="status">{status}</p>}
      </form>
    </div>
  )
}

const Join = () => {
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", position: "SITE INCHARGE", education: "", experience: "", interest: "", appliedBy: "" });
  const [status, setStatus] = useState("");
  const handleSubmit = async (e) => { e.preventDefault(); try { const r = await fetch('http://localhost:5000/api/applicants', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) }); if (r.ok) { setStatus("✅ Saved!"); setForm({ fullName: "", phone: "", email: "", position: "SITE INCHARGE", education: "", experience: "", interest: "", appliedBy: "" }) } } catch { setStatus("❌ Backend not running") } };
  return (
    <div className="section"><h2>Apply Now</h2>
      <form className="form centered-form" onSubmit={handleSubmit}>
        <label>Position Apply For <span className="red">*</span></label><select value={form.position} onChange={e => setForm({...form, position: e.target.value })} required><option>SITE INCHARGE</option><option>SUPERVISOR / DEPLOYMENT OFFICER</option></select>
        <label>Full Name <span className="red">*</span></label><input placeholder="Full Name" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value })} required />
        <label>Phone <span className="red">*</span></label><input placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value })} required />
        <label>Email <span className="red">*</span></label><input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value })} required />
        <label>Education Level <span className="red">*</span></label><select value={form.education} onChange={e => setForm({...form, education: e.target.value })} required><option value="">Choose Education *</option><option>P7</option><option>O-Level</option><option>UCE</option><option>UACE</option><option>Diploma</option><option>Degree</option><option>Master</option></select>
        <label>Interested Applicant <span className="red">*</span></label><input placeholder="Why interested?" value={form.interest} onChange={e => setForm({...form, interest: e.target.value })} required />
        <label>What is application by <span className="red">*</span></label><input placeholder="New / Ongoing employee" value={form.appliedBy} onChange={e => setForm({...form, appliedBy: e.target.value })} required />
        <label>Experience <span className="red">*</span></label><textarea placeholder="3 years security field" value={form.experience} onChange={e => setForm({...form, experience: e.target.value })} required></textarea>
        <button>Submit</button>{status && <p className="status">{status}</p>}
      </form>
    </div>
  )
}

const Admin = () => {
  const [contacts, setContacts] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [searchService, setSearchService] = useState("");
  const [searchEdu, setSearchEdu] = useState("");
  useEffect(() => {
    fetch('http://localhost:5000/api/contact').then(r => r.json()).then(d => Array.isArray(d) && setContacts(d)).catch(() => { });
    fetch('http://localhost:5000/api/applicants').then(r => r.json()).then(d => Array.isArray(d) && setApplicants(d)).catch(() => { });
  }, []);
  const filteredContacts = contacts.filter(c => searchService === "" || c.service?.toLowerCase().includes(searchService.toLowerCase()));
  const filteredApplicants = applicants.filter(a => searchEdu === "" || a.education?.toLowerCase().includes(searchEdu.toLowerCase()));
  const fmt = (t) => new Date(t).toLocaleString('en-UG', { timeZone: 'Africa/Kampala', year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit', hour12:true });
  return (
    <div className="section admin-page">
      <h2 className="centered">Admin Dashboard - Secret Link /admin</h2>
      <div className="admin-card">
        <h3 className="centered">Contact Message</h3>
        <div className="admin-search centered"><select value={searchService} onChange={e => setSearchService(e.target.value)}><option value="">All Services - Choose Service</option><option>Security Guard Service</option><option>Construction Security</option><option>CCTV Installation</option><option>Mobile Patrol</option><option>Event Security</option></select></div>
        <div className="table-wrap"><table className="admin-table"><thead><tr><th>#</th><th>Full Name ASC</th><th>Email</th><th>Service</th><th>Message</th><th>Date (Kampala EAT)</th></tr></thead><tbody>{filteredContacts.map((c, i) => <tr key={c.id}><td>{i + 1}</td><td>{c.full_name || c.fullName}</td><td>{c.email}</td><td>{c.service}</td><td>{c.message}</td><td>{fmt(c.created_at)}</td></tr>)}</tbody></table></div>
      </div>
      <div className="admin-card" style={{ marginTop: '20px' }}>
        <h3 className="centered">Job Applicant</h3>
        <div className="admin-search centered"><select value={searchEdu} onChange={e => setSearchEdu(e.target.value)}><option value="">All Education</option><option>P7</option><option>O-Level</option><option>UCE</option><option>UACE</option><option>Diploma</option><option>Degree</option><option>Master</option></select><span className="count">Found: {filteredApplicants.length}</span></div>
        <div className="table-wrap"><table className="admin-table"><thead><tr><th>#</th><th>Full Name ASC</th><th>Position</th><th>Phone</th><th>Email</th><th>Education</th><th>Date (Kampala EAT)</th></tr></thead><tbody>{filteredApplicants.map((a, i) => <tr key={a.id}><td>{i + 1}</td><td>{a.full_name || a.fullName}</td><td>{a.position}</td><td>{a.phone}</td><td>{a.email}</td><td>{a.education}</td><td>{fmt(a.created_at)}</td></tr>)}</tbody></table></div>
      </div>
    </div>
  )
}

const Blog = () => (
  <div className="section"><h2>Jobs - We Are Recruiting</h2><p className="center">Plot 442 & 443 Masajjagere | SITE INCHARGE UCE + 3yrs | SUPERVISOR UACE + Rider permit 3yrs | HR: hr@pinnaclegroup.co.ug</p><div style={{ textAlign: 'center' }}><Link to="/join" className="btn">Apply Now</Link></div></div>
)

const Footer = () => <div className="footer">© 2026 Pinnacle Security Ltd | Plot 442 & 443 Masajjagere, Off Kironde Road Muyenga | P.O.Box 124853 | hr@pinnaclegroup.co.ug | 0754 139726</div>

const App = () => {
  return (
    <BrowserRouter>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box} body{font-family:Arial,sans-serif;background:#f4f6f9;line-height:1.6}
       .nav{background:#0a1931;padding:12px;position:sticky;top:0;z-index:1000}.centered-nav{display:flex;justify-content:center}.centered-links{display:flex;gap:15px;align-items:center;justify-content:center;flex-wrap:wrap}.nav-link{color:#fff;text-decoration:none;font-size:12px;font-weight:700}.btn-nav{background:#ffcc00!important;color:#0a1931!important;padding:6px 12px;border-radius:5px;text-decoration:none;font-weight:800;font-size:12px}
       .hero{background:#0a1931;color:#fff;padding:50px 15px;text-align:center}.hero h1{color:#ffcc00;font-size:24px}.dots{margin-top:15px}.dot{width:10px;height:10px;background:#555;border-radius:50%;display:inline-block;margin:0 5px;cursor:pointer}.dot.active{background:#ffcc00}.btn{background:#ffcc00;color:#0a1931;padding:10px 18px;border-radius:6px;text-decoration:none;font-weight:800;display:inline-block;margin:5px;font-size:13px}
       .section{padding:25px 15px;max-width:1100px;margin:auto}.section h2{text-align:center;color:#0a1931;margin-bottom:15px;border-bottom:4px solid #ffcc00;padding-bottom:6px;font-size:18px}
       .about-text-full p{font-size:12px;color:#333;margin-bottom:12px;text-align:justify;background:#fff;padding:15px;border-radius:8px;box-shadow:0 2px 6px rgba(0,0,0,0.05);border-left:4px solid #0a1931;line-height:1.6}
       .about-hero{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-top:15px}.about-card{padding:15px;border-radius:10px;color:#fff}.about-card.gold{background:linear-gradient(135deg,#ffcc00,#ffb700);color:#0a1931}.about-card.blue{background:linear-gradient(135deg,#0a1931,#1a3a6a)}.about-card.dark{background:linear-gradient(135deg,#333,#000);color:#ffcc00}
       .service-dropdown{display:flex;flex-direction:column;gap:10px}.dropdown-item{background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.06);overflow:hidden}.dropdown-head{display:flex;justify-content:space-between;align-items:center;padding:12px 15px;cursor:pointer;background:#0a1931;color:#fff}.dropdown-head h3{font-size:13px;color:#ffcc00}.close-btn{background:#ffcc00;color:#0a1931;border:none;padding:5px 10px;border-radius:4px;font-size:11px;font-weight:800;cursor:pointer}.dropdown-body{padding:12px 15px;background:#fffbe6}.dropdown-body p{font-size:11px;color:#333;margin-bottom:10px;text-align:justify}
       .recruit-note{background:#fff3cd;border:2px dashed #ffcc00;padding:15px;border-radius:10px;margin-top:20px;text-align:center}
       .form{max-width:500px;margin:15px auto;background:#fff;padding:15px;border-radius:10px;box-shadow:0 3px 10px rgba(0,0,0,0.1);display:flex;flex-direction:column;gap:6px}.form input,.form select,.form textarea{padding:10px;border:1px solid #ccc;border-radius:5px;font-size:12px}.form button{background:#0a1931;color:#fff;padding:11px;border:none;border-radius:5px;font-weight:800;cursor:pointer}.form label{font-size:12px;font-weight:700;color:#0a1931}.red{color:red}.status{padding:8px;background:#d4edda;border-radius:5px;font-size:12px}
       .admin-page{background:#f0f2f5}.admin-card{background:#fff;padding:20px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.08)}.admin-search.centered{display:flex;justify-content:center;gap:10px;margin:15px 0;flex-wrap:wrap}.admin-search.centered select{padding:10px;border:2px solid #0a1931;border-radius:8px;min-width:250px;text-align:center}.count{background:#0a1931;color:#ffcc00;padding:8px 12px;border-radius:6px;font-size:12px;font-weight:800}
       .table-wrap{overflow-x:auto;background:#fff;border-radius:8px;margin-top:10px;border:3px solid #0a1931}
       .admin-table{width:100%;border-collapse:collapse;font-size:11px;border:1px solid #0a1931}
       .admin-table th{background:#0a1931;color:#ffcc00;padding:12px 8px;text-align:left;border:1px solid #000;font-weight:900;text-transform:uppercase}
       .admin-table td{padding:10px 8px;border:1px solid #aaa;color:#222;background:#fff;font-size:11px}
       .admin-table tr:nth-child(even) td{background:#eef2ff}
       .admin-table tr:hover td{background:#ffef9c}
       .footer{background:#0a1931;color:#aaa;text-align:center;padding:15px;font-size:9px;margin-top:20px}.centered{text-align:center}.center{text-align:center;color:#555;font-size:12px}
      `}</style>
      <Navbar /><Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/join" element={<Join />} />
        <Route path="/admin" element={<Admin />} />
      </Routes><Footer />
    </BrowserRouter>
  )
}
export default App