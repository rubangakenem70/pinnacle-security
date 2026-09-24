import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'

const API_URL = "https://pinnacle-security-backend.vercel.app";

const Navbar = () => {
  const loc = useLocation();
  const active = (p) => loc.pathname === p ? {color:'#ffcc00', borderBottom:'3px solid #ffcc00'} : {color:'white'};
  const [open, setOpen] = useState(false);
  return (
    <nav className="nav">
      <div className="nav-top">
        <span className="logo">🛡️ PINNACLE SECURITY LTD</span>
        <span className="menu-btn" onClick={()=>setOpen(!open)}>{open?'✕':'☰'}</span>
      </div>
      <div className={`links ${open?'show':''}`}>
        <Link to="/" style={active("/")} onClick={()=>setOpen(false)}>Home</Link>
        <Link to="/about" style={active("/about")} onClick={()=>setOpen(false)}>About Us</Link>
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
    {t:"Pinnacle Security Limited - 4.3★ Rated Security Company", d:"Plot 442 & 443 Masajjagere, Off Kironde Road Muyenga"},
    {t:"🚨 WE ARE RECRUITING - Join Our Team Today", d:"SITE INCHARGE: UCE + 3yrs | SUPERVISOR: UACE + Rider Permit + 3yrs"},
    {t:"Security Guard Service ISIC 8010 | 60+ Sites | 150+ Officers", d:"Control Room: 0754 139726 | HR: hr@pinnaclegroup.co.ug"},
  ];
  return (
    <>
      <div className="hero"><h1>{slides[i].t}</h1><p>{slides[i].d}</p>
        <div className="dots">{[0,1,2].map(n=><span key={n} className={n===i?'dot on':'dot'} onClick={()=>setI(n)}></span>)}</div>
        <Link to="/join" className="btn-yellow big">Apply Now</Link>
      </div>
      <div className="section">
        <div className="card"><h3>🛡️ Who We Are</h3><p>Pinnacle Security Ltd at Plot 442 & 443 Masajjagere is licensed ISIC 8010 and F Construction. 60+ sites, 150+ officers, 4.3★ rated. Control Room 0754 139726. Open 8AM-4PM daily.</p><Link to="/about" className="link-more">Read More →</Link></div>
        <div className="card gold"><h3>🎯 Our Services</h3><p>Security Guard Service, Construction Security, CCTV Installation, Mobile Patrol 10 mins response, Event Security. All 24/7 professional.</p><Link to="/services" className="link-more">View Services →</Link></div>
        <div className="card dark"><h3>🚨 Urgent Recruitment - No Fees</h3><p>SITE INCHARGE: UCE + 3yrs, 25-45yrs | SUPERVISOR: UACE + Rider Permit + 3yrs, 23-40yrs | Free Training 2 weeks at Muyenga HQ | Salary 500k-800k + benefits.</p><Link to="/join" className="btn-yellow">Apply Now</Link></div>
      </div>
    </>
  )
}

const About = () => (
  <div className="section"><h2>About Pinnacle Security Limited</h2>
    <div className="card"><h3>📍 Location & License</h3><p><strong>Head Office:</strong> Plot 442 & 443 Masajjagere, Off Kironde Road Muyenga, P.O.Box 124853. Branch: 256 Bukasa Rd (4.3★ 92 reviews). Licensed ISIC 8010 and Category F by URSB. Hours 8AM-4PM, Control Room 24/7 at 0754 139726.</p></div>
    <div className="card dark"><h3>📊 Capacity</h3><p>60+ sites across Kampala, Wakiso, Mukono with 150+ officers. Control Room: 0754 139726 | HR: hr@pinnaclegroup.co.ug | Website: pinnaclegroup.co.ug</p></div>
  </div>
)

const Services = () => {
  const [open, setOpen] = useState(null);
  const list=[
    {n:"1. Security Guard Service (ISIC 8010)", d:["Licensed under ISIC 8010. Armed & unarmed guards for offices, banks, NGOs, schools, hospitals, homes. 24/7 vigilance, radio communication, 60+ sites, 150+ officers."]},
    {n:"2. Construction Security (Category F)", d:["Protect cement, iron bars, equipment, workers. Prevent theft, control access, monitor CCTV, enforce safety, night patrol."]},
    {n:"3. CCTV, Alarm & Mobile Patrol", d:["CCTV cameras, alarm systems, access control, electric fences. Mobile patrol 3 vehicles GPS, 10 mins response, 24/7 control room 0754 139726."]},
  ];
  return (<div className="section"><h2>Our Services</h2>{list.map((s,i)=><div key={i} className="service-box"><div className="service-head" onClick={()=>setOpen(open===i?null:i)}><strong>{s.n}</strong><span>{open===i?'Close -':'Open +'}</span></div>{open===i&&<div className="service-body">{s.d.map((p,k)=><p key={k}>{p}</p>)}</div>}</div>)}</div>)
}

const Contact = () => {
  const [f,setF]=useState({fullName:"",email:"",service:"",message:""}); const [s,setS]=useState("");
  const send=async(e)=>{ e.preventDefault(); setS("Sending..."); try{ const r=await fetch(`${API_URL}/api/contact`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(f)}); if(r.ok){ setS("✅ Saved!"); setF({fullName:"",email:"",service:"",message:""}) } }catch{ setS("❌ Error") } };
  return (<div className="section"><h2>Contact Us</h2><form className="form" onSubmit={send}><label>Full Names *</label><input value={f.fullName} onChange={e=>setF({...f,fullName:e.target.value})} required/><label>Email *</label><input type="email" value={f.email} onChange={e=>setF({...f,email:e.target.value})} required/><label>Service *</label><select value={f.service} onChange={e=>setF({...f,service:e.target.value})} required><option value="">Choose Service</option><option>Security Guard Service</option><option>Construction Security</option><option>CCTV Installation</option><option>Mobile Patrol</option><option>Event Security</option></select><label>Message *</label><textarea rows="4" value={f.message} onChange={e=>setF({...f,message:e.target.value})} required></textarea><button>Submit</button>{s&&<p className="msg">{s}</p>}</form></div>)
}

const Join = () => {
  const [f,setF]=useState({fullName:"",phone:"",email:"",position:"SITE INCHARGE",education:"",experience:"",interest:"",appliedBy:""}); const [s,setS]=useState("");
  const send=async(e)=>{ e.preventDefault(); setS("Sending..."); try{ const r=await fetch(`${API_URL}/api/applicants`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(f)}); if(r.ok){ setS("✅ Saved!"); setF({fullName:"",phone:"",email:"",position:"SITE INCHARGE",education:"",experience:"",interest:"",appliedBy:""}) } }catch{ setS("❌ Error") } };
  return (<div className="section"><h2>Apply Now</h2><form className="form" onSubmit={send}><label>Position *</label><select value={f.position} onChange={e=>setF({...f,position:e.target.value})}><option>SITE INCHARGE</option><option>SUPERVISOR / DEPLOYMENT OFFICER</option></select><label>Full Name *</label><input value={f.fullName} onChange={e=>setF({...f,fullName:e.target.value})} required/><label>Phone *</label><input value={f.phone} onChange={e=>setF({...f,phone:e.target.value})} required/><label>Email *</label><input type="email" value={f.email} onChange={e=>setF({...f,email:e.target.value})} required/><label>Education *</label><select value={f.education} onChange={e=>setF({...f,education:e.target.value})} required><option value="">Choose Education</option><option>P7</option><option>O-Level</option><option>UCE</option><option>UACE</option><option>Diploma</option><option>Degree</option><option>Master</option></select><label>Why interested? *</label><input value={f.interest} onChange={e=>setF({...f,interest:e.target.value})} required/><label>New / Ongoing *</label><input value={f.appliedBy} onChange={e=>setF({...f,appliedBy:e.target.value})} required/><label>Experience *</label><textarea value={f.experience} onChange={e=>setF({...f,experience:e.target.value})} required></textarea><button>Submit</button>{s&&<p className="msg">{s}</p>}</form></div>)
}

// ========== ADMIN - FINAL CLEAN - ONLY SEARCH & FILTER - NO DELETE/UPDATE ==========
const Admin = () => {
  const [contacts, setContacts] = useState([]); 
  const [applicants, setApplicants] = useState([]); 
  const [tab, setTab] = useState("contacts");
  const [search, setSearch] = useState("");
  const [eduFilter, setEduFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [positionFilter, setPositionFilter] = useState("");

  const load = () => {
    fetch(`${API_URL}/api/contact`).then(r=>r.json()).then(d=>Array.isArray(d)&&setContacts(d));
    fetch(`${API_URL}/api/applicants`).then(r=>r.json()).then(d=>Array.isArray(d)&&setApplicants(d));
  }
  useEffect(()=>{ load() },[]);

  const filteredContacts = contacts.filter(c => {
    const matchSearch = (c.full_name||c.fullName||"").toLowerCase().includes(search.toLowerCase()) || (c.email||"").toLowerCase().includes(search.toLowerCase());
    const matchService = serviceFilter ? (c.service||"").toLowerCase() === serviceFilter.toLowerCase() : true;
    return matchSearch && matchService;
  });

  const filteredApplicants = applicants.filter(a => {
    const matchSearch = (a.full_name||a.fullName||"").toLowerCase().includes(search.toLowerCase()) || (a.phone||"").includes(search);
    const matchEdu = eduFilter ? (a.education||"").toLowerCase() === eduFilter.toLowerCase() : true;
    const matchPos = positionFilter ? (a.position||"").toLowerCase() === positionFilter.toLowerCase() : true;
    return matchSearch && matchEdu && matchPos;
  });

  return (
    <div className="section">
      <div className="admin-top">
        <h2>🔐 Admin Dashboard</h2>
        <p>View & Filter - Search by Name, Education, Service - Big Font</p>
        <div className="stats"><span>📩 {contacts.length} Contacts</span><span>👮 {applicants.length} Applicants</span></div>
        <div className="tabs">
          <button onClick={()=>{setTab("contacts"); setSearch(""); setServiceFilter("");}} className={tab==="contacts"?"tab on":"tab"}>Contacts</button>
          <button onClick={()=>{setTab("applicants"); setSearch(""); setEduFilter(""); setPositionFilter("");}} className={tab==="applicants"?"tab on":"tab"}>Applicants</button>
        </div>
      </div>

      <div className="filter-bar">
        <input className="filter-input" placeholder="🔍 Search by name, email, phone..." value={search} onChange={e=>setSearch(e.target.value)} />
        {tab==="contacts" ? (
          <>
            <select className="filter-select" value={serviceFilter} onChange={e=>setServiceFilter(e.target.value)}>
              <option value="">All Services Needed ▼</option>
              <option value="Security Guard Service">Security Guard Service</option>
              <option value="Construction Security">Construction Security</option>
              <option value="CCTV Installation">CCTV Installation</option>
              <option value="Mobile Patrol">Mobile Patrol</option>
              <option value="Event Security">Event Security</option>
            </select>
            <button className="btn-dark" onClick={()=>{setSearch(""); setServiceFilter("");}}>Clear</button>
          </>
        ) : (
          <>
            <select className="filter-select" value={eduFilter} onChange={e=>setEduFilter(e.target.value)}>
              <option value="">All Education Levels ▼</option>
              <option value="P7">P7</option>
              <option value="O-Level">O-Level</option>
              <option value="UCE">UCE</option>
              <option value="UACE">UACE</option>
              <option value="Diploma">Diploma</option>
              <option value="Degree">Degree</option>
              <option value="Master">Master</option>
            </select>
            <select className="filter-select" value={positionFilter} onChange={e=>setPositionFilter(e.target.value)}>
              <option value="">All Positions ▼</option>
              <option value="SITE INCHARGE">SITE INCHARGE</option>
              <option value="SUPERVISOR / DEPLOYMENT OFFICER">SUPERVISOR</option>
            </select>
            <button className="btn-dark" onClick={()=>{setSearch(""); setEduFilter(""); setPositionFilter("");}}>Clear</button>
          </>
        )}
        <button className="btn-yellow" onClick={load}>🔄 Refresh</button>
      </div>

      <div className="table-card">
        <h3>{tab==="contacts" ? `📩 Contacts - Showing ${filteredContacts.length} of ${contacts.length}` : `👮 Applicants - Showing ${filteredApplicants.length} of ${applicants.length}`}</h3>
        <div className="scroll">
          {tab==="contacts" ? (
            <table>
              <thead><tr><th>#</th><th>Full Name</th><th>Email Address</th><th>Service Needed</th><th>Message</th></tr></thead>
              <tbody>{filteredContacts.map((c,i)=>(<tr key={c.id||i}><td>{i+1}</td><td><b>{c.full_name||c.fullName}</b></td><td>{c.email}</td><td><span className="tag blue">{c.service}</span></td><td>{c.message}</td></tr>))}</tbody>
            </table>
          ) : (
            <table>
              <thead><tr><th>#</th><th>Full Name</th><th>Position</th><th>Phone</th><th>Email</th><th>Education Level</th><th>Experience</th></tr></thead>
              <tbody>{filteredApplicants.map((a,i)=>(<tr key={a.id||i}><td>{i+1}</td><td><b>{a.full_name||a.fullName}</b></td><td><span className="tag gold">{a.position}</span></td><td>{a.phone}</td><td>{a.email}</td><td><span className="tag dark">{a.education}</span></td><td>{a.experience}</td></tr>))}</tbody>
            </table>
          )}
        </div>
        {((tab==="contacts" && filteredContacts.length===0) || (tab==="applicants" && filteredApplicants.length===0)) && <p className="no-result">No results - Try Clear button</p>}
      </div>
    </div>
  )
}

const Blog = () => (
  <div className="section"><h2>Jobs - We Are Recruiting</h2>
    <div className="card"><h3>1. SITE INCHARGE - 5 Positions - UCE + 3yrs</h3><p>Requirements: UCE, 3+ years security, Age 25-45, LC letters. Salary: 500k-700k + accommodation + medical. Free training 2 weeks at Muyenga HQ.</p></div>
    <div className="card gold"><h3>2. SUPERVISOR / DEPLOYMENT OFFICER - 3 Positions - UACE + Rider Permit</h3><p>Requirements: UACE, Valid Rider Permit 3+ years, 3+ years deployment, Age 23-40, Knows Kampala routes. Salary: 600k-800k + fuel + motorcycle + airtime.</p></div>
    <div style={{textAlign:'center', marginTop:'15px'}}><Link to="/join" className="btn-yellow big">Apply Now - Free</Link></div>
  </div>
)

const Footer = () => <div className="footer">© 2026 Pinnacle Security Limited | Plot 442 & 443 Masajjagere, Off Kironde Road Muyenga, P.O.Box 124853 Kampala | HR: hr@pinnaclegroup.co.ug | 0754 139726</div>

const App = () => (
  <BrowserRouter>
    <style>{`
      *{margin:0;padding:0;box-sizing:border-box}
      html,body{overflow:auto!important; height:auto!important}
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
      .btn-dark{background:#0a1931; color:#ffcc00; border:none; padding:12px 18px; border-radius:10px; font-weight:800; cursor:pointer; font-size:14px}
      .hero{background:linear-gradient(135deg,#0a1931,#1e3a8a); color:#fff; padding:45px 15px; text-align:center; border-radius:0 0 20px 20px}
      .hero h1{color:#ffcc00; font-size:26px; margin-bottom:12px} .hero p{font-size:17px}
      .dots{margin:14px 0} .dot{width:12px; height:12px; background:#555; border-radius:50%; display:inline-block; margin:0 6px; cursor:pointer} .dot.on{background:#ffcc00}
      .section{padding:22px 14px; max-width:1200px; margin:auto}
      .section h2{text-align:center; color:#0a1931; border-bottom:4px solid #ffcc00; padding-bottom:10px; margin-bottom:20px; font-size:26px}
      .card{background:#fff; padding:20px; border-radius:14px; margin-bottom:16px; box-shadow:0 4px 12px rgba(0,0,0,0.07); border-left:6px solid #0a1931; font-size:17px; line-height:1.8; text-align:justify}
      .card.gold{border-left-color:#ffcc00; background:#fffbeb} .card.dark{background:linear-gradient(135deg,#1e293b,#0f172a); color:#fff; border-left-color:#ffcc00}
      .card h3{font-size:19px; margin-bottom:12px; color:#0a1931} .card.dark h3{color:#ffcc00} .link-more{color:#0a1931; font-weight:800; font-size:16px; text-decoration:none}
      .service-box{background:#fff; border-radius:14px; margin-bottom:12px; overflow:hidden; box-shadow:0 3px 10px rgba(0,0,0,0.06)}
      .service-head{background:#0a1931; color:#ffcc00; padding:16px 18px; display:flex; justify-content:space-between; cursor:pointer; font-size:17px}
      .service-body{padding:16px 18px; font-size:17px; background:#f8fafc; line-height:1.8}
      .form{max-width:600px; margin:18px auto; background:#fff; padding:22px; border-radius:16px; display:flex; flex-direction:column; gap:10px; box-shadow:0 5px 18px rgba(0,0,0,0.08)}
      .form label{font-size:16px; font-weight:700; color:#0a1931} .form input,.form select,.form textarea{padding:13px; border:2px solid #ddd; border-radius:10px; font-size:16px}
      .form button{background:#0a1931; color:#fff; padding:14px; border:none; border-radius:12px; font-weight:800; cursor:pointer; font-size:17px} .msg{padding:12px; background:#d4edda; border-radius:10px; font-size:16px; text-align:center}
      .admin-top{background:linear-gradient(135deg,#0a1931,#1e3a8a); color:#fff; padding:24px; border-radius:18px; text-align:center; margin-bottom:18px}
      .admin-top h2{color:#ffcc00; border:none; margin-bottom:8px; font-size:24px} .admin-top p{font-size:16px}
      .stats{display:flex; gap:12px; justify-content:center; margin:14px 0; flex-wrap:wrap} .stats span{background:rgba(255,204,0,0.15); border:2px solid #ffcc00; padding:8px 16px; border-radius:25px; font-size:15px; font-weight:800; color:#ffcc00}
      .tabs{display:flex; gap:12px; justify-content:center; margin-top:14px} .tab{padding:10px 22px; border-radius:25px; border:2px solid #ffcc00; background:transparent; color:#ffcc00; font-weight:800; font-size:15px; cursor:pointer} .tab.on{background:#ffcc00; color:#0a1931}
      .filter-bar{display:flex; gap:10px; margin-bottom:18px; background:#fff; padding:16px; border-radius:14px; box-shadow:0 4px 12px rgba(0,0,0,0.07); flex-wrap:wrap; align-items:center}
      .filter-input{flex:1; padding:14px; border-radius:10px; border:2px solid #0a1931; font-size:16px; min-width:220px}
      .filter-select{padding:14px; border-radius:10px; border:2px solid #0a1931; font-size:16px; background:#fff; font-weight:700; min-width:190px; cursor:pointer}
      .table-card{background:#fff; border-radius:16px; padding:16px; box-shadow:0 5px 18px rgba(0,0,0,0.08)}
      .table-card h3{font-size:17px; margin-bottom:12px; color:#0a1931} .scroll{overflow-x:auto}
      .table-card table{width:100%; border-collapse:collapse; font-size:16px; min-width:850px}
      .table-card th{background:#0a1931; color:#ffcc00; padding:14px 10px; text-align:left; font-size:14px; font-weight:800}
      .table-card td{padding:12px 10px; border-bottom:1px solid #f1f5f9; font-size:16px}
      .table-card tr:hover{background:#fffbeb}
      .tag{padding:5px 12px; border-radius:15px; font-size:13px; font-weight:800} .tag.blue{background:#dbeafe; color:#1e40af} .tag.gold{background:#fef3c7; color:#92400e} .tag.dark{background:#1e293b; color:#ffcc00}
      .no-result{text-align:center; padding:25px; color:#999; font-size:16px}
      .footer{background:#0a1931; color:#aaa; text-align:center; padding:18px; font-size:13px; margin-top:24px}
      @media(max-width:750px){ .menu-btn{display:block} .links{display:none; flex-direction:column; align-items:flex-start; padding-top:14px} .links.show{display:flex} .filter-bar{flex-direction:column} .filter-select,.filter-input{width:100%} }
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