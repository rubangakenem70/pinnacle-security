import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'

const API_URL = "https://pinnacle-security-backend.vercel.app";

const Navbar = () => {
  const loc = useLocation();
  const a = (p) => loc.pathname === p? { color: '#ffcc00', borderBottom: '2px solid #ffcc00' } : { color: 'white' };
  return (
    <nav className="nav">
      <div className="links">
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
    { t: "Pinnacle Security Limited - 4.3★ Rated", d: "Plot 442 & 443 Masajjagere, Off Kironde Road Muyenga" },
    { t: "We Are Recruiting - Join Our Team", d: "SITE INCHARGE UCE + 3yrs & SUPERVISOR UACE + Rider Permit 3yrs" },
    { t: "Security Guard Service ISIC 8010 & Construction F", d: "60+ Sites, 150+ Officers, 0754 139726" },
  ];
  return (
    <div className="hero"><h1>{slides[active].t}</h1><p>{slides[active].d}</p>
      <div className="dots">{[0, 1, 2].map(i => <span key={i} className={i === active? 'dot active' : 'dot'} onClick={() => setActive(i)}></span>)}</div>
      <Link to="/join" className="btn">Apply Now</Link>
    </div>
  )
}

const About = () => (
  <div className="section">
    <h2>About Pinnacle Security Limited</h2>
    <p style={{fontSize:'13px', background:'#fff', padding:'15px', borderRadius:'8px'}}>Pinnacle Security Limited is a licensed security company in Kampala at Plot 442 & 443 Masajjagere, Off Kironde Road Muyenga, P.O.Box 124853 Kampala. Rated 4.3★, ISIC 8010 Security Guard Service and Construction F. 60+ sites, 150+ officers. Control room 0754 139726, hr@pinnaclegroup.co.ug. Open 8AM-4PM daily.</p>
    <p style={{fontSize:'13px', background:'#fff', padding:'15px', borderRadius:'8px', marginTop:'10px'}}>Mission: Reliable, professional and affordable security services. Vision: Leading security company in East Africa. Training 2 weeks free at HQ. Recruiting SITE INCHARGE UCE+3yrs and SUPERVISOR UACE+Rider permit 3yrs.</p>
  </div>
)

const Services = () => {
  const [open, setOpen] = useState(null);
  const services = [
    { name: "Security Guard Service", desc: "Licensed ISIC 8010. Armed and unarmed guards for offices, homes, schools, NGOs, banks. 150+ officers, 60+ sites, 24/7 vigilance." },
    { name: "Construction Security", desc: "Category F - Protect materials, equipment and workers on building sites. Theft prevention, access control, CCTV monitoring." },
    { name: "CCTV & Mobile Patrol", desc: "Install CCTV, alarms, access control. Mobile patrol quick response 10 mins across Kampala. GPS tracked." },
  ];
  return (
    <div className="section"><h2>Our Services</h2>
      {services.map((s,i)=><div key={i} style={{background:'#fff', marginBottom:'10px', borderRadius:'8px', overflow:'hidden'}}><div style={{background:'#0a1931', color:'#ffcc00', padding:'12px', display:'flex', justifyContent:'space-between'}} onClick={()=>setOpen(open===i?null:i)}><strong>{s.name}</strong><span>{open===i?'Close -':'Open +'}</span></div>{open===i&&<p style={{padding:'12px', fontSize:'12px'}}>{s.desc}</p>}</div>)}
      <div style={{background:'#fff3cd', border:'2px dashed #ffcc00', padding:'15px', borderRadius:'10px', textAlign:'center', marginTop:'15px'}}><h3>🚨 We Are Recruiting</h3><p>SITE INCHARGE UCE + 3yrs & SUPERVISOR UACE + Rider permit 3yrs</p><Link to="/join" className="btn">Apply Now</Link></div>
    </div>
  )
}

const Contact = () => {
  const [form, setForm] = useState({ fullName: "", email: "", service: "", message: "" });
  const [status, setStatus] = useState("");
  const handleSubmit = async (e) => { e.preventDefault(); setStatus("Sending..."); try { const r = await fetch(`${API_URL}/api/contact`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form)}); if(r.ok){ setStatus("✅ Saved!"); setForm({fullName:"",email:"",service:"",message:""})} } catch { setStatus("❌ Error")} };
  return (
    <div className="section"><h2>Contact Us</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label>Full Names *</label><input value={form.fullName} onChange={e=>setForm({...form, fullName:e.target.value})} required />
        <label>Email *</label><input type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />
        <label>Service *</label><select value={form.service} onChange={e=>setForm({...form, service:e.target.value})} required><option value="">Choose</option><option>Security Guard Service</option><option>Construction Security</option><option>CCTV Installation</option><option>Mobile Patrol</option><option>Event Security</option></select>
        <label>Message *</label><textarea rows="4" value={form.message} onChange={e=>setForm({...form, message:e.target.value})} required></textarea>
        <button>Submit</button>{status&&<p>{status}</p>}
      </form>
    </div>
  )
}

const Join = () => {
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", position: "SITE INCHARGE", education: "", experience: "", interest: "", appliedBy: "" });
  const [status, setStatus] = useState("");
  const handleSubmit = async (e) => { e.preventDefault(); setStatus("Sending..."); try { const r = await fetch(`${API_URL}/api/applicants`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form)}); if(r.ok){ setStatus("✅ Saved!"); setForm({fullName:"", phone:"", email:"", position:"SITE INCHARGE", education:"", experience:"", interest:"", appliedBy:""})} } catch { setStatus("❌ Error")} };
  return (
    <div className="section"><h2>Apply Now</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label>Position *</label><select value={form.position} onChange={e=>setForm({...form, position:e.target.value})}><option>SITE INCHARGE</option><option>SUPERVISOR / DEPLOYMENT OFFICER</option></select>
        <label>Full Name *</label><input value={form.fullName} onChange={e=>setForm({...form, fullName:e.target.value})} required />
        <label>Phone *</label><input value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} required />
        <label>Email *</label><input type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />
        <label>Education *</label><select value={form.education} onChange={e=>setForm({...form, education:e.target.value})} required><option value="">Choose</option><option>P7</option><option>O-Level</option><option>UCE</option><option>UACE</option><option>Diploma</option><option>Degree</option><option>Master</option></select>
        <label>Why interested? *</label><input value={form.interest} onChange={e=>setForm({...form, interest:e.target.value})} required />
        <label>New / Ongoing *</label><input value={form.appliedBy} onChange={e=>setForm({...form, appliedBy:e.target.value})} required />
        <label>Experience *</label><textarea value={form.experience} onChange={e=>setForm({...form, experience:e.target.value})} required></textarea>
        <button>Submit</button>{status&&<p>{status}</p>}
      </form>
    </div>
  )
}

const Admin = () => {
  const [contacts, setContacts] = useState([]);
  const [applicants, setApplicants] = useState([]);
  useEffect(() => {
    fetch(`${API_URL}/api/contact`).then(r=>r.json()).then(d=>Array.isArray(d)&&setContacts(d));
    fetch(`${API_URL}/api/applicants`).then(r=>r.json()).then(d=>Array.isArray(d)&&setApplicants(d));
  }, []);
  return (
    <div style={{padding:'10px'}}>
      <h2 style={{textAlign:'center', background:'#0a1931', color:'#ffcc00', padding:'15px', borderRadius:'10px'}}>Admin - {contacts.length} Contacts | {applicants.length} Applicants</h2>

      <h3 style={{margin:'15px 0 5px'}}>📩 Contacts</h3>
      <div style={{overflowX:'auto', background:'#fff', border:'1px solid #ccc'}}>
        <table style={{width:'100%', borderCollapse:'collapse', fontSize:'12px'}} border="1">
          <thead><tr style={{background:'#0a1931', color:'#ffcc00'}}><th>#</th><th>Name</th><th>Email</th><th>Service</th><th>Message</th></tr></thead>
          <tbody>{contacts.map((c,i)=><tr key={i}><td>{i+1}</td><td>{c.full_name||c.fullName}</td><td>{c.email}</td><td>{c.service}</td><td>{c.message}</td></tr>)}</tbody>
        </table>
      </div>

      <h3 style={{margin:'20px 0 5px'}}>👮 Applicants</h3>
      <div style={{overflowX:'auto', background:'#fff', border:'1px solid #ccc'}}>
        <table style={{width:'100%', borderCollapse:'collapse', fontSize:'12px'}} border="1">
          <thead><tr style={{background:'#0a1931', color:'#ffcc00'}}><th>#</th><th>Name</th><th>Position</th><th>Phone</th><th>Email</th><th>Edu</th></tr></thead>
          <tbody>{applicants.map((a,i)=><tr key={i}><td>{i+1}</td><td>{a.full_name||a.fullName}</td><td>{a.position}</td><td>{a.phone}</td><td>{a.email}</td><td>{a.education}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  )
}

const Blog = () => (
  <div className="section"><h2>Jobs - We Are Recruiting</h2><p style={{textAlign:'center', fontSize:'13px'}}>Plot 442 & 443 Masajjagere | SITE INCHARGE UCE + 3yrs | SUPERVISOR UACE + Rider permit 3yrs | hr@pinnaclegroup.co.ug</p><div style={{textAlign:'center'}}><Link to="/join" className="btn">Apply Now</Link></div></div>
)
const Footer = () => <div className="footer">© 2026 Pinnacle Security Ltd | Plot 442 & 443 Masajjagere | hr@pinnaclegroup.co.ug | 0754 139726</div>

const App = () => {
  return (
    <BrowserRouter>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box}
        html,body{overflow:auto!important; height:auto!important}
        body{font-family:Arial,sans-serif; background:#f4f6f9}
       .nav{background:#0a1931; padding:12px; position:sticky; top:0; z-index:100}
       .links{display:flex; gap:12px; justify-content:center; flex-wrap:wrap}
       .nav-link{color:#fff; text-decoration:none; font-size:12px; font-weight:700}
       .btn-nav{background:#ffcc00; color:#0a1931; padding:6px 12px; border-radius:5px; text-decoration:none; font-weight:800; font-size:12px}
       .hero{background:#0a1931; color:#fff; padding:40px 15px; text-align:center}
       .hero h1{color:#ffcc00; font-size:20px}
       .dot{width:10px; height:10px; background:#555; border-radius:50%; display:inline-block; margin:0 5px}
       .dot.active{background:#ffcc00}
       .btn{background:#ffcc00; color:#0a1931; padding:10px 18px; border-radius:6px; text-decoration:none; font-weight:800; display:inline-block; margin:5px}
       .section{padding:20px 15px; max-width:1100px; margin:auto}
       .section h2{text-align:center; color:#0a1931; margin-bottom:15px; border-bottom:4px solid #ffcc00; padding-bottom:6px}
       .form{max-width:500px; margin:15px auto; background:#fff; padding:15px; border-radius:10px; display:flex; flex-direction:column; gap:6px}
       .form input,.form select,.form textarea{padding:10px; border:1px solid #ccc; border-radius:5px}
       .form button{background:#0a1931; color:#fff; padding:11px; border:none; border-radius:5px; font-weight:800}
       .footer{background:#0a1931; color:#aaa; text-align:center; padding:15px; font-size:10px; margin-top:20px}
      `}</style>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/join" element={<Join />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
export default App