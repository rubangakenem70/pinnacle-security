import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'

const API_URL = "https://pinnacle-security-backend.vercel.app";

const Navbar = () => {
  const loc = useLocation();
  const active = (p) => loc.pathname === p ? {color:'#ffcc00', borderBottom:'3px solid #ffcc00'} : {color:'white'};
  const [open, setOpen] = useState(false);
  return (
    <nav className="nav">
      <div className="nav-top"><span className="logo">🛡️ PINNACLE SECURITY LTD</span><span className="menu-btn" onClick={()=>setOpen(!open)}>{open?'✕':'☰'}</span></div>
      <div className={`links ${open?'show':''}`}>
        <Link to="/" style={active("/")} onClick={()=>setOpen(false)}>Home</Link>
        <Link to="/about" style={active("/about")} onClick={()=>setOpen(false)}>About</Link>
        <Link to="/services" style={active("/services")} onClick={()=>setOpen(false)}>Services</Link>
        <Link to="/blog" style={active("/blog")} onClick={()=>setOpen(false)}>Jobs</Link>
        <Link to="/contact" style={active("/contact")} onClick={()=>setOpen(false)}>Contact</Link>
        <Link to="/join" className="btn-yellow" onClick={()=>setOpen(false)}>Apply Now</Link>
        <Link to="/admin" className="btn-admin" onClick={()=>setOpen(false)}>🔐 Admin</Link>
      </div>
    </nav>
  )
}

const Home = () => {
  const [i, setI] = useState(0);
  useEffect(()=>{ const t=setInterval(()=>setI(p=>(p+1)%3), 3500); return()=>clearInterval(t) },[]);
  const slides=[
    {t:"Pinnacle Security Limited - 4.3★ Rated", d:"Plot 442 & 443 Masajjagere, Muyenga"},
    {t:"🚨 WE ARE RECRUITING", d:"SITE INCHARGE: UCE + 3yrs | SUPERVISOR: UACE + Rider Permit"},
    {t:"ISIC 8010 | 60+ Sites | 150+ Officers", d:"0754 139726 | hr@pinnaclegroup.co.ug"},
  ];
  return (<><div className="hero"><h1>{slides[i].t}</h1><p>{slides[i].d}</p><div className="dots">{[0,1,2].map(n=><span key={n} className={n===i?'dot on':'dot'} onClick={()=>setI(n)}></span>)}</div><Link to="/join" className="btn-yellow big">Apply Now</Link></div>
    <div className="section"><div className="card"><h3>🛡️ Who We Are</h3><p>Pinnacle Security Ltd at Plot 442 & 443 Masajjagere is licensed ISIC 8010 and F. 60+ sites, 150+ officers, 4.3★ rated.</p></div><div className="card gold"><h3>🎯 Our Services</h3><p>Security Guard, Construction, CCTV, Mobile Patrol, Event Security. 24/7 professional.</p></div><div className="card dark"><h3>🚨 Recruitment - No Fees</h3><p>SITE INCHARGE: UCE + 3yrs | SUPERVISOR: UACE + Rider Permit + 3yrs | Free Training 2 weeks | Salary 500k-800k</p><Link to="/join" className="btn-yellow">Apply Now</Link></div></div></>)
}

const About = () => (<div className="section"><h2>About Pinnacle</h2><div className="card"><h3>📍 Location</h3><p>Plot 442 & 443 Masajjagere, Off Kironde Road Muyenga. Licensed ISIC 8010 & F. Control Room 24/7 at 0754 139726.</p></div></div>)
const Services = () => { const [open,setOpen]=useState(null); const list=[{n:"1. Security Guard Service (ISIC 8010)",d:["Licensed ISIC 8010. 60+ sites."]},{n:"2. Construction Security (F)",d:["Protect materials, prevent theft."]},{n:"3. CCTV & Patrol",d:["CCTV, alarm, 10 mins response."]}]; return (<div className="section"><h2>Our Services</h2>{list.map((s,i)=><div key={i} className="service-box"><div className="service-head" onClick={()=>setOpen(open===i?null:i)}><strong>{s.n}</strong><span>{open===i?'Close -':'Open +'}</span></div>{open===i&&<div className="service-body">{s.d.map((p,k)=><p key={k}>{p}</p>)}</div>}</div>)}</div>) }

const Contact = () => {
  const [f,setF]=useState({fullName:"",email:"",service:"",message:""}); const [s,setS]=useState("");
  const send=async(e)=>{ e.preventDefault(); setS("Sending..."); try{ const r=await fetch(`${API_URL}/api/contact`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(f)}); if(r.ok){ setS("✅ Saved! We will contact you."); setF({fullName:"",email:"",service:"",message:""}) } }catch{ setS("❌ Error") } };
  return (
    <div className="section">
      <h2>Contact Us - Big Form</h2>
      <form className="form-big" onSubmit={send}>
        <div className="form-row-2"><div><label>Full Names *</label><input value={f.fullName} onChange={e=>setF({...f,fullName:e.target.value})} required/></div><div><label>Email *</label><input type="email" value={f.email} onChange={e=>setF({...f,email:e.target.value})} required/></div></div>
        <label>Service Needed *</label><select value={f.service} onChange={e=>setF({...f,service:e.target.value})} required><option value="">Choose Service</option><option>Security Guard Service</option><option>Construction Security</option><option>CCTV Installation</option><option>Mobile Patrol</option><option>Event Security</option></select>
        <label>Message *</label><textarea rows="6" value={f.message} onChange={e=>setF({...f,message:e.target.value})} required></textarea>
        <button className="big-btn">Submit Inquiry</button>{s&&<p className="msg">{s}</p>}
      </form>
    </div>
  )
}

const Join = () => {
  const [f,setF]=useState({fullName:"",phone:"",email:"",position:"SITE INCHARGE",education:"",experience:"",interest:"",appliedBy:""}); const [s,setS]=useState("");
  const send=async(e)=>{ e.preventDefault(); setS("Sending..."); try{ const r=await fetch(`${API_URL}/api/applicants`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(f)}); if(r.ok){ setS("✅ Saved!"); setF({fullName:"",phone:"",email:"",position:"SITE INCHARGE",education:"",experience:"",interest:"",appliedBy:""}) } }catch{ setS("❌ Error") } };
  return (
    <div className="section">
      <h2>Apply Now - 2 Columns</h2>
      <form className="form-big" onSubmit={send}>
        <div className="form-row-2"><div><label>Position *</label><select value={f.position} onChange={e=>setF({...f,position:e.target.value})}><option>SITE INCHARGE</option><option>SUPERVISOR / DEPLOYMENT OFFICER</option></select></div><div><label>Full Name *</label><input value={f.fullName} onChange={e=>setF({...f,fullName:e.target.value})} required/></div></div>
        <div className="form-row-2"><div><label>Phone *</label><input value={f.phone} onChange={e=>setF({...f,phone:e.target.value})} required/></div><div><label>Email *</label><input type="email" value={f.email} onChange={e=>setF({...f,email:e.target.value})} required/></div></div>
        <div className="form-row-2"><div><label>Education Level *</label><select value={f.education} onChange={e=>setF({...f,education:e.target.value})} required><option value="">Choose</option><option>P7</option><option>O-Level</option><option>UCE</option><option>UACE</option><option>Diploma</option><option>Degree</option><option>Master</option></select></div><div><label>New / Ongoing *</label><input value={f.appliedBy} onChange={e=>setF({...f,appliedBy:e.target.value})} required/></div></div>
        <div className="form-row-2"><div><label>Why interested? *</label><input value={f.interest} onChange={e=>setF({...f,interest:e.target.value})} required/></div><div><label>Experience *</label><textarea rows="2" value={f.experience} onChange={e=>setF({...f,experience:e.target.value})} required></textarea></div></div>
        <button className="big-btn">Submit Application</button>{s&&<p className="msg">{s}</p>}
      </form>
    </div>
  )
}

// ADMIN - NOW WITH 2 SEARCHBARS - AS YOU ASKED IN SCREENSHOT
const Admin = () => {
  const [contacts, setContacts] = useState([]); 
  const [applicants, setApplicants] = useState([]); 
  const [tab, setTab] = useState("contacts");
  const [searchName, setSearchName] = useState("");
  const [eduFilter, setEduFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [positionFilter, setPositionFilter] = useState("");

  const load = () => {
    fetch(`${API_URL}/api/contact`).then(r=>r.json()).then(d=>Array.isArray(d)&&setContacts(d));
    fetch(`${API_URL}/api/applicants`).then(r=>r.json()).then(d=>Array.isArray(d)&&setApplicants(d));
  }
  useEffect(()=>{ load() },[]);

  const filteredContacts = contacts.filter(c => {
    const matchName = searchName ? (c.full_name||c.fullName||"").toLowerCase().includes(searchName.toLowerCase()) || (c.email||"").toLowerCase().includes(searchName.toLowerCase()) : true;
    const matchService = serviceFilter ? (c.service||"").toLowerCase() === serviceFilter.toLowerCase() : true;
    return matchName && matchService;
  });

  const filteredApplicants = applicants.filter(a => {
    const matchName = searchName ? (a.full_name||a.fullName||"").toLowerCase().includes(searchName.toLowerCase()) || (a.phone||"").toLowerCase().includes(searchName.toLowerCase()) || (a.email||"").toLowerCase().includes(searchName.toLowerCase()) : true;
    const matchEdu = eduFilter ? (a.education||"").toLowerCase() === eduFilter.toLowerCase() : true;
    const matchPos = positionFilter ? (a.position||"").toLowerCase() === positionFilter.toLowerCase() : true;
    return matchName && matchEdu && matchPos;
  });

  return (
    <div className="section">
      <div className="admin-top">
        <h2>🔐 Admin Dashboard</h2>
        <div className="stats"><span>📩 {contacts.length} Contacts</span><span>👮 {applicants.length} Applicants</span></div>
        <div className="tabs">
          <button onClick={()=>{setTab("contacts"); setSearchName(""); setServiceFilter("");}} className={tab==="contacts"?"tab on":"tab"}>Contacts</button>
          <button onClick={()=>{setTab("applicants"); setSearchName(""); setEduFilter(""); setPositionFilter("");}} className={tab==="applicants"?"tab on":"tab"}>Applicants</button>
        </div>
      </div>

      {/* TWO SEARCHBARS - AS YOU REQUESTED */}
      <div className="filter-bar-clean">
        {tab==="contacts" ? (
          <>
            <input className="filter-input-big" placeholder="Search by Name or Email..." value={searchName} onChange={e=>setSearchName(e.target.value)} />
            <select className="filter-select-big" value={serviceFilter} onChange={e=>setServiceFilter(e.target.value)}>
              <option value="">Search by Service ▼</option>
              <option value="Security Guard Service">Security Guard Service</option>
              <option value="Construction Security">Construction Security</option>
              <option value="CCTV Installation">CCTV Installation</option>
              <option value="Mobile Patrol">Mobile Patrol</option>
              <option value="Event Security">Event Security</option>
              <option value="Alarm System">Alarm System</option>
            </select>
          </>
        ) : (
          <>
            <input className="filter-input-big" placeholder="Search by Name, Phone or Email..." value={searchName} onChange={e=>setSearchName(e.target.value)} />
            <select className="filter-select-big" value={eduFilter} onChange={e=>setEduFilter(e.target.value)}>
              <option value="">Search by Education Level ▼</option>
              <option value="P7">P7</option>
              <option value="O-Level">O-Level</option>
              <option value="UCE">UCE</option>
              <option value="UACE">UACE</option>
              <option value="Diploma">Diploma</option>
              <option value="Degree">Degree</option>
              <option value="Master">Master</option>
            </select>
            <select className="filter-select-big" value={positionFilter} onChange={e=>setPositionFilter(e.target.value)}>
              <option value="">Search by Position ▼</option>
              <option value="SITE INCHARGE">SITE INCHARGE</option>
              <option value="SUPERVISOR / DEPLOYMENT OFFICER">SUPERVISOR</option>
            </select>
          </>
        )}
        <button className="btn-dark" onClick={()=>{setSearchName(""); setEduFilter(""); setServiceFilter(""); setPositionFilter("");}}>Clear</button>
        <button className="btn-yellow" onClick={load}>🔄 Refresh</button>
      </div>

      <div className="table-card">
        <h3>{tab==="contacts" ? `📩 Showing ${filteredContacts.length} of ${contacts.length} Contacts` : `👮 Showing ${filteredApplicants.length} of ${applicants.length} Applicants`}</h3>
        <div className="scroll">
          {tab==="contacts" ? (
            <table><thead><tr><th>#</th><th>Full Name</th><th>Email</th><th>Service Needed</th><th>Message</th></tr></thead>
              <tbody>{filteredContacts.map((c,i)=>(<tr key={c.id||i}><td>{i+1}</td><td><b>{c.full_name||c.fullName}</b></td><td>{c.email}</td><td><span className="tag blue">{c.service}</span></td><td>{c.message}</td></tr>))}</tbody></table>
          ) : (
            <table><thead><tr><th>#</th><th>Full Name</th><th>Position</th><th>Phone</th><th>Email</th><th>Education Level</th></tr></thead>
              <tbody>{filteredApplicants.map((a,i)=>(<tr key={a.id||i}><td>{i+1}</td><td><b>{a.full_name||a.fullName}</b></td><td><span className="tag gold">{a.position}</span></td><td>{a.phone}</td><td>{a.email}</td><td><span className="tag dark">{a.education}</span></td></tr>))}</tbody></table>
          )}
        </div>
      </div>
    </div>
  )
}

const Blog = () => (<div className="section"><h2>Jobs</h2><div className="card"><h3>SITE INCHARGE</h3><p>UCE + 3yrs, 500k-700k</p></div><div className="card gold"><h3>SUPERVISOR</h3><p>UACE + Rider Permit, 600k-800k</p></div><div style={{textAlign:'center'}}><Link to="/join" className="btn-yellow big">Apply Now</Link></div></div>)
const Footer = () => <div className="footer">© 2026 Pinnacle Security Ltd | Plot 442 & 443 Masajjagere | HR: hr@pinnaclegroup.co.ug | 0754 139726</div>

const App = () => (
  <BrowserRouter>
    <style>{`
      *{margin:0;padding:0;box-sizing:border-box}
      body{font-family:Arial,sans-serif; background:#f4f6f9; line-height:1.8}
      .nav{background:#0a1931; padding:14px 15px; position:sticky; top:0; z-index:999}
      .nav-top{display:flex; justify-content:space-between; align-items:center}
      .logo{color:#ffcc00; font-weight:900; font-size:18px}
      .menu-btn{color:#fff; font-size:26px; cursor:pointer; display:none}
      .links{display:flex; gap:12px; align-items:center; justify-content:center; flex-wrap:wrap}
      .links a{color:#fff; text-decoration:none; font-size:16px; font-weight:700; padding:8px 12px}
      .btn-yellow{background:#ffcc00!important; color:#0a1931!important; padding:10px 20px!important; border-radius:25px!important; font-weight:900!important; border:none; cursor:pointer; text-decoration:none; display:inline-block; font-size:16px}
      .btn-yellow.big{padding:14px 28px!important; font-size:17px}
      .btn-admin{background:#1e3a8a!important; color:#ffcc00!important; border:2px solid #ffcc00!important; padding:10px 20px!important; border-radius:25px!important; font-weight:900!important; text-decoration:none; font-size:16px}
      .btn-dark{background:#0a1931; color:#ffcc00; border:none; padding:14px 22px; border-radius:12px; font-weight:800; cursor:pointer; font-size:15px}
      .hero{background:linear-gradient(135deg,#0a1931,#1e3a8a); color:#fff; padding:45px 15px; text-align:center; border-radius:0 0 20px 20px}
      .hero h1{color:#ffcc00; font-size:26px; margin-bottom:12px} .hero p{font-size:17px}
      .dots{margin:14px 0} .dot{width:12px; height:12px; background:#555; border-radius:50%; display:inline-block; margin:0 6px; cursor:pointer} .dot.on{background:#ffcc00}
      .section{padding:22px 14px; max-width:1250px; margin:auto}
      .section h2{text-align:center; color:#0a1931; border-bottom:4px solid #ffcc00; padding-bottom:10px; margin-bottom:20px; font-size:26px}
      .card{background:#fff; padding:20px; border-radius:14px; margin-bottom:16px; box-shadow:0 4px 12px rgba(0,0,0,0.07); border-left:6px solid #0a1931; font-size:17px; line-height:1.8}
      .card.gold{border-left-color:#ffcc00; background:#fffbeb} .card.dark{background:linear-gradient(135deg,#1e293b,#0f172a); color:#fff; border-left-color:#ffcc00}
      .card h3{font-size:19px; margin-bottom:12px; color:#0a1931} .card.dark h3{color:#ffcc00}
      .form-big{max-width:900px; margin:20px auto; background:#fff; padding:28px; border-radius:18px; display:flex; flex-direction:column; gap:16px; box-shadow:0 6px 20px rgba(0,0,0,0.09)}
      .form-big label{font-size:17px; font-weight:800; color:#0a1931; display:block; margin-bottom:4px}
      .form-big input,.form-big select,.form-big textarea{padding:15px; border:2px solid #0a1931; border-radius:12px; font-size:17px; width:100%; outline:none}
      .form-row-2{display:grid; grid-template-columns:1fr 1fr; gap:18px}
      .big-btn{background:#0a1931; color:#ffcc00; padding:18px; border:none; border-radius:14px; font-weight:900; cursor:pointer; font-size:19px}
      .msg{padding:14px; background:#d4edda; border-radius:12px; font-size:17px; text-align:center; font-weight:700}
      .admin-top{background:linear-gradient(135deg,#0a1931,#1e3a8a); color:#fff; padding:24px; border-radius:18px; text-align:center; margin-bottom:18px}
      .admin-top h2{color:#ffcc00; border:none; margin-bottom:8px; font-size:24px}
      .stats{display:flex; gap:12px; justify-content:center; margin:14px 0; flex-wrap:wrap} .stats span{background:rgba(255,204,0,0.15); border:2px solid #ffcc00; padding:8px 16px; border-radius:25px; font-size:15px; font-weight:800; color:#ffcc00}
      .tabs{display:flex; gap:12px; justify-content:center; margin-top:14px} .tab{padding:10px 22px; border-radius:25px; border:2px solid #ffcc00; background:transparent; color:#ffcc00; font-weight:800; font-size:15px; cursor:pointer} .tab.on{background:#ffcc00; color:#0a1931}
      .filter-bar-clean{display:flex; gap:12px; margin-bottom:18px; background:#fff; padding:18px; border-radius:14px; box-shadow:0 4px 12px rgba(0,0,0,0.07); flex-wrap:wrap; align-items:center}
      .filter-input-big{flex:1; padding:14px 18px; border-radius:12px; border:2px solid #0a1931; font-size:16px; min-width:240px; outline:none; background:#fff}
      .filter-select-big{padding:14px 18px; border-radius:12px; border:2px solid #0a1931; font-size:16px; background:#fff; font-weight:700; min-width:240px; cursor:pointer; outline:none}
      .filter-input-big:focus,.filter-select-big:focus{border-color:#ffcc00; background:#fffbeb}
      .table-card{background:#fff; border-radius:16px; padding:16px; box-shadow:0 5px 18px rgba(0,0,0,0.08)}
      .table-card h3{font-size:17px; margin-bottom:12px; color:#0a1931} .scroll{overflow-x:auto}
      .table-card table{width:100%; border-collapse:collapse; font-size:16px; min-width:850px}
      .table-card th{background:#0a1931; color:#ffcc00; padding:14px 10px; text-align:left; font-size:14px; font-weight:800}
      .table-card td{padding:12px 10px; border-bottom:1px solid #f1f5f9; font-size:16px}
      .tag{padding:5px 12px; border-radius:15px; font-size:13px; font-weight:800} .tag.blue{background:#dbeafe; color:#1e40af} .tag.gold{background:#fef3c7; color:#92400e} .tag.dark{background:#1e293b; color:#ffcc00}
      .footer{background:#0a1931; color:#aaa; text-align:center; padding:18px; font-size:13px; margin-top:24px}
      @media(max-width:850px){ .form-row-2{grid-template-columns:1fr} .menu-btn{display:block} .links{display:none; flex-direction:column; align-items:flex-start; padding-top:14px} .links.show{display:flex} .filter-bar-clean{flex-direction:column; align-items:stretch} .filter-input-big,.filter-select-big{width:100%} }
    `}</style>
    <Navbar/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/about" element={<About/>}/>
      <Route path="/services" element={<Services/>}/>
      <Route path="/blog" element={<Blog/>}/>
      <Route path="/contact" element={<Contact/>}/>
      <Route path="/join" element={<Join/>}/>
      <Route path="/admin" element={<Admin/>}/>
    </Routes>
    <Footer/>
  </BrowserRouter>
)

export default App