import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'

const API_URL = "https://pinnacle-security-backend.vercel.app";

// ========== NAVBAR WITH ADMIN ==========
const Navbar = () => {
  const loc = useLocation();
  const active = (p) => loc.pathname === p ? {color:'#ffcc00', borderBottom:'2px solid #ffcc00'} : {color:'white'};
  const [open, setOpen] = useState(false);
  return (
    <nav className="nav">
      <div className="nav-top">
        <span className="logo">🛡️ PINNACLE SECURITY</span>
        <span className="menu-btn" onClick={()=>setOpen(!open)}>{open?'✕':'☰'}</span>
      </div>
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

// ========== HOME WITH NO WHITE SPACE ==========
const Home = () => {
  const [i, setI] = useState(0);
  useEffect(()=>{ const t=setInterval(()=>setI(p=>(p+1)%3), 3500); return()=>clearInterval(t) },[]);
  const slides=[
    {t:"Pinnacle Security Limited - 4.3★ Rated Company", d:"Licensed at Plot 442 & 443 Masajjagere, Off Kironde Road Muyenga, P.O.Box 124853 Kampala, Uganda"},
    {t:"🚨 WE ARE RECRUITING - Join Our Team Today", d:"SITE INCHARGE: UCE + 3yrs | SUPERVISOR: UACE + Rider Permit + 3yrs | Apply Now Free"},
    {t:"Security Guard Service ISIC 8010 | Construction F | 60+ Sites | 150+ Officers", d:"24/7 Control Room: 0754 139726 | HR: hr@pinnaclegroup.co.ug | pinnaclegroup.co.ug"},
  ];
  return (
    <>
      <div className="hero"><h1>{slides[i].t}</h1><p>{slides[i].d}</p>
        <div className="dots">{[0,1,2].map(n=><span key={n} className={n===i?'dot on':'dot'} onClick={()=>setI(n)}></span>)}</div>
        <Link to="/join" className="btn-yellow big">Apply Now</Link>
      </div>
      <div className="section">
        <div className="card"><h3>🛡️ Who We Are</h3><p>Pinnacle Security Ltd at Plot 442 & 443 Masajjagere is licensed ISIC 8010 Security Guard Service and F Construction. 60+ sites, 150+ officers, 4.3★ rated. Control Room 0754 139726. Open 8AM-4PM daily.</p><Link to="/about" className="link-more">Read More →</Link></div>
        <div className="card gold"><h3>🎯 Our Services</h3><p>• Security Guard Service ISIC 8010 • Construction Security Category F • CCTV Installation & Alarm • Mobile Patrol 10 mins response • Event Security. All 24/7 professional.</p><Link to="/services" className="link-more">View Services →</Link></div>
        <div className="card dark"><h3>🚨 Urgent Recruitment</h3><p>SITE INCHARGE: UCE + 3yrs exp, 25-45yrs, LC letters | SUPERVISOR: UACE + Rider Permit + 3yrs, 23-40yrs | Free Training 2 weeks at Muyenga HQ | No fees. Salary 500k-800k + benefits.</p><Link to="/join" className="btn-yellow">Apply Now</Link></div>
      </div>
    </>
  )
}

// ========== ABOUT FULL DETAILS ==========
const About = () => (
  <div className="section">
    <h2>About Pinnacle Security Limited</h2>
    <div className="card"> <h3>📍 Our Location & License</h3>
      <p><strong>Head Office:</strong> Plot 442 & 443 Masajjagere, Off Kironde Road Muyenga, Kampala, Uganda, P.O.Box 124853 Kampala</p>
      <p><strong>Branch:</strong> 256 Bukasa Rd, Kampala (4.3★ 92 reviews) | Kironde Rd (4.3★ 11 reviews)</p>
      <p><strong>License:</strong> ISIC Code 8010 - Security Guard Service | Category F - Construction Security | Licensed by Uganda Registration Services Bureau</p>
      <p><strong>Hours:</strong> 8:00 AM - 4:00 PM Daily | Wheelchair accessible parking | Control Room 24/7</p>
    </div>
    <div className="card gold"><h3>🎯 Mission, Vision & Values</h3>
      <p><strong>Mission:</strong> To provide reliable, professional and affordable security services that exceed client expectations across Central Region and all Uganda.</p>
      <p><strong>Vision:</strong> To be the leading security company in East Africa known for integrity, excellence and discipline.</p>
      <p><strong>Values:</strong> Integrity, Discipline, Professionalism, Quick Response, Client Satisfaction</p>
    </div>
    <div className="card dark"><h3>📊 Our Capacity & Contacts</h3>
      <p>We protect <strong>60+ sites</strong> across Kampala, Wakiso, Mukono with <strong>150+ disciplined officers</strong> trained for 2 weeks free at HQ.</p>
      <p><strong>Control Room:</strong> 0754 139726 | <strong>HR Email:</strong> hr@pinnaclegroup.co.ug, hrassistant@pinnaclegroup.co.ug, info@pinnaclegroup.co.ug | <strong>Website:</strong> pinnaclegroup.co.ug</p>
      <p><strong>Recruiting Now:</strong> SITE INCHARGE (UCE + 3yrs exp) and SUPERVISOR / DEPLOYMENT OFFICER (UACE + Rider Permit + 3yrs exp)</p>
    </div>
  </div>
)

// ========== SERVICES ==========
const Services = () => {
  const [open, setOpen] = useState(null);
  const list=[
    {n:"1. Security Guard Service (ISIC 8010)", d:["We are licensed under ISIC 8010 at Plot 442 & 443 Masajjagere. Our officers are vetted by Uganda Police, trained at HQ 8AM-4PM, disciplined.", "Services: Armed & unarmed guards for offices, banks, NGOs, schools, hospitals, homes, apartments. 24/7 vigilance, radio communication, incident reporting.", "Coverage: Kampala, Muyenga, Bukasa, Wakiso, Mukono, Entebbe. 60+ active sites, 150+ officers, GPS tracking, control room 0754 139726."]},
    {n:"2. Construction Security (Category F)", d:["We protect construction materials, cement, iron bars, equipment, workers on building sites.", "Duties: Prevent theft, control access, monitor CCTV, enforce safety helmets, log materials, night patrol.", "Clients: Real estate developers, contractors in Kampala. Experienced officers with construction safety training."]},
    {n:"3. CCTV Installation, Alarm & Mobile Patrol", d:["We supply, install and monitor CCTV cameras, alarm systems, access control, electric fences.", "Mobile patrol: 3 vehicles with GPS, 10 minutes quick response in Kampala, 24/7 control room monitoring at 0754 139726.", "Maintenance: Monthly check, backup, cloud storage, phone viewing."]},
  ];
  return (
    <div className="section"><h2>Our Services</h2>
      {list.map((s,i)=><div key={i} className="service-box"><div className="service-head" onClick={()=>setOpen(open===i?null:i)}><strong>{s.n}</strong><span>{open===i?'Close -':'Open +'}</span></div>{open===i&&<div className="service-body">{s.d.map((p,k)=><p key={k}>{p}</p>)}</div>}</div>)}
      <div className="recruit"><h3>🚨 URGENT RECRUITMENT</h3><p>SITE INCHARGE: UCE + 3yrs | SUPERVISOR: UACE + Rider Permit 3yrs | Free Training at Muyenga HQ</p><Link to="/join" className="btn-yellow">Apply Now</Link></div>
    </div>
  )
}

// ========== CONTACT ==========
const Contact = () => {
  const [f,setF]=useState({fullName:"",email:"",service:"",message:""}); const [s,setS]=useState("");
  const send=async(e)=>{ e.preventDefault(); setS("Sending..."); try{ const r=await fetch(`${API_URL}/api/contact`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(f)}); if(r.ok){ setS("✅ Saved to Live DB!"); setF({fullName:"",email:"",service:"",message:""}) } }catch{ setS("❌ Error") } };
  return (<div className="section"><h2>Contact Us</h2><form className="form" onSubmit={send}><label>Full Names *</label><input value={f.fullName} onChange={e=>setF({...f,fullName:e.target.value})} required/><label>Email *</label><input type="email" value={f.email} onChange={e=>setF({...f,email:e.target.value})} required/><label>Service *</label><select value={f.service} onChange={e=>setF({...f,service:e.target.value})} required><option value="">Choose</option><option>Security Guard Service</option><option>Construction Security</option><option>CCTV Installation</option><option>Mobile Patrol</option><option>Event Security</option></select><label>Message *</label><textarea rows="4" value={f.message} onChange={e=>setF({...f,message:e.target.value})} required></textarea><button>Submit</button>{s&&<p className="msg">{s}</p>}</form></div>)
}

// ========== JOIN ==========
const Join = () => {
  const [f,setF]=useState({fullName:"",phone:"",email:"",position:"SITE INCHARGE",education:"",experience:"",interest:"",appliedBy:""}); const [s,setS]=useState("");
  const send=async(e)=>{ e.preventDefault(); setS("Sending..."); try{ const r=await fetch(`${API_URL}/api/applicants`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(f)}); if(r.ok){ setS("✅ Application Saved to Live DB!"); setF({fullName:"",phone:"",email:"",position:"SITE INCHARGE",education:"",experience:"",interest:"",appliedBy:""}) } }catch{ setS("❌ Error") } };
  return (<div className="section"><h2>Apply Now - Join Pinnacle Security</h2><p style={{textAlign:'center', fontSize:'11px', marginBottom:'10px'}}>SITE INCHARGE = UCE + 3yrs security, 25-45yrs, LC letters | SUPERVISOR = UACE + Rider Permit + 3yrs, 23-40yrs | Training 2 weeks FREE at Muyenga HQ 8AM-4PM | No fees</p><form className="form" onSubmit={send}><label>Position *</label><select value={f.position} onChange={e=>setF({...f,position:e.target.value})}><option>SITE INCHARGE</option><option>SUPERVISOR / DEPLOYMENT OFFICER</option></select><label>Full Name *</label><input value={f.fullName} onChange={e=>setF({...f,fullName:e.target.value})} required/><label>Phone *</label><input value={f.phone} onChange={e=>setF({...f,phone:e.target.value})} required/><label>Email *</label><input type="email" value={f.email} onChange={e=>setF({...f,email:e.target.value})} required/><label>Education *</label><select value={f.education} onChange={e=>setF({...f,education:e.target.value})} required><option value="">Choose</option><option>P7</option><option>O-Level</option><option>UCE</option><option>UACE</option><option>Diploma</option><option>Degree</option><option>Master</option></select><label>Why interested? *</label><input value={f.interest} onChange={e=>setF({...f,interest:e.target.value})} required/><label>New / Ongoing *</label><input placeholder="New or Ongoing" value={f.appliedBy} onChange={e=>setF({...f,appliedBy:e.target.value})} required/><label>Experience *</label><textarea value={f.experience} onChange={e=>setF({...f,experience:e.target.value})} required></textarea><button>Submit Application</button>{s&&<p className="msg">{s}</p>}</form></div>)
}

// ========== SUPER ADMIN WITH SEARCH + CRUD ==========
const Admin = () => {
  const [contacts, setContacts] = useState([]); 
  const [applicants, setApplicants] = useState([]); 
  const [tab, setTab] = useState("contacts");
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  const load = () => {
    fetch(`${API_URL}/api/contact`).then(r=>r.json()).then(d=>Array.isArray(d)&&setContacts(d));
    fetch(`${API_URL}/api/applicants`).then(r=>r.json()).then(d=>Array.isArray(d)&&setApplicants(d));
  }
  useEffect(()=>{ load() },[]);

  const handleDelete = async (id, type) => {
    if(!confirm("Delete this? Are you sure?")) return;
    const url = type==="contact" ? `${API_URL}/api/contact/${id}` : `${API_URL}/api/applicants/${id}`;
    try {
      const r = await fetch(url, {method:'DELETE'});
      if(r.ok){ alert("✅ Deleted!"); load(); } else { alert("❌ Backend needs DELETE route - tell me I add it") }
    } catch { alert("❌ Backend error") }
  };

  const handleSave = async (id, type) => {
    const url = type==="contact" ? `${API_URL}/api/contact/${id}` : `${API_URL}/api/applicants/${id}`;
    try {
      const r = await fetch(url, {method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(editData)});
      if(r.ok){ alert("✅ Updated!"); setEditId(null); load(); } else { alert("❌ Backend needs PUT route - tell me I add it") }
    } catch { alert("❌ Backend error") }
  };

  const filteredContacts = contacts.filter(c => 
    (c.full_name||c.fullName||"").toLowerCase().includes(search.toLowerCase()) ||
    (c.email||"").toLowerCase().includes(search.toLowerCase()) ||
    (c.service||"").toLowerCase().includes(search.toLowerCase())
  );
  const filteredApplicants = applicants.filter(a => 
    (a.full_name||a.fullName||"").toLowerCase().includes(search.toLowerCase()) ||
    (a.phone||"").includes(search) ||
    (a.position||"").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="section">
      <div className="admin-top"><h2>🔐 Admin Dashboard - CRUD</h2><p>Pinnacle Security - Live Database | Search, Edit, Delete</p><div className="stats"><span>📩 {contacts.length} Contacts</span><span>👮 {applicants.length} Applicants</span></div>
        <div className="tabs"><button onClick={()=>{setTab("contacts"); setSearch("")}} className={tab==="contacts"?"tab on":"tab"}>Contacts</button><button onClick={()=>{setTab("applicants"); setSearch("")}} className={tab==="applicants"?"tab on":"tab"}>Applicants</button></div>
      </div>

      <div className="search-bar">
        <input placeholder={tab==="contacts" ? "🔍 Search name, email, service..." : "🔍 Search name, phone, position..."} value={search} onChange={e=>setSearch(e.target.value)} />
        <button onClick={()=>setSearch("")} className="btn-dark">Clear</button>
        <button onClick={load} className="btn-yellow">🔄 Refresh</button>
      </div>

      <div className="table-card">
        <h3>{tab==="contacts"?`📩 Contacts (${filteredContacts.length}/${contacts.length})`:`👮 Applicants (${filteredApplicants.length}/${applicants.length})`}</h3>
        <div className="scroll">
          {tab==="contacts" ? (
            <table><thead><tr><th>#</th><th>Name</th><th>Email</th><th>Service</th><th>Message</th><th>Action</th></tr></thead><tbody>{filteredContacts.map((c,i)=>(
              <tr key={c.id||i}><td>{i+1}</td>
                <td>{editId===c.id ? <input value={editData.full_name||""} onChange={e=>setEditData({...editData, full_name:e.target.value})}/> : <b>{c.full_name||c.fullName}</b>}</td>
                <td>{editId===c.id ? <input value={editData.email||""} onChange={e=>setEditData({...editData, email:e.target.value})}/> : c.email}</td>
                <td>{editId===c.id ? <input value={editData.service||""} onChange={e=>setEditData({...editData, service:e.target.value})}/> : <span className="tag blue">{c.service}</span>}</td>
                <td>{editId===c.id ? <input value={editData.message||""} onChange={e=>setEditData({...editData, message:e.target.value})}/> : c.message}</td>
                <td>{editId===c.id ? <><button onClick={()=>handleSave(c.id,"contact")} className="mini green">Save</button><button onClick={()=>setEditId(null)} className="mini gray">Cancel</button></> : <><button onClick={()=>{setEditId(c.id); setEditData(c)}} className="mini dark">Edit</button><button onClick={()=>handleDelete(c.id,"contact")} className="mini red">Del</button></>}</td>
              </tr>))}</tbody></table>
          ) : (
            <table><thead><tr><th>#</th><th>Name</th><th>Position</th><th>Phone</th><th>Email</th><th>Edu</th><th>Action</th></tr></thead><tbody>{filteredApplicants.map((a,i)=>(
              <tr key={a.id||i}><td>{i+1}</td>
                <td>{editId===a.id ? <input value={editData.full_name||""} onChange={e=>setEditData({...editData, full_name:e.target.value})}/> : <b>{a.full_name||a.fullName}</b>}</td>
                <td>{editId===a.id ? <input value={editData.position||""} onChange={e=>setEditData({...editData, position:e.target.value})}/> : <span className="tag gold">{a.position}</span>}</td>
                <td>{editId===a.id ? <input value={editData.phone||""} onChange={e=>setEditData({...editData, phone:e.target.value})}/> : a.phone}</td>
                <td>{editId===a.id ? <input value={editData.email||""} onChange={e=>setEditData({...editData, email:e.target.value})}/> : a.email}</td>
                <td>{a.education}</td>
                <td>{editId===a.id ? <><button onClick={()=>handleSave(a.id,"applicant")} className="mini green">Save</button><button onClick={()=>setEditId(null)} className="mini gray">Cancel</button></> : <><button onClick={()=>{setEditId(a.id); setEditData(a)}} className="mini dark">Edit</button><button onClick={()=>handleDelete(a.id,"applicant")} className="mini red">Del</button></>}</td>
              </tr>))}</tbody></table>
          )}
        </div>
        {((tab==="contacts" && filteredContacts.length===0) || (tab==="applicants" && filteredApplicants.length===0)) && <p className="no-result">No results for "{search}"</p>}
      </div>
      <div className="note"><strong>Note:</strong> Search works 100% now! Edit/Delete needs your backend to have PUT & DELETE routes. If delete fails, send me backend code I add it in 1 min.</div>
    </div>
  )
}

const Blog = () => (
  <div className="section"><h2>Jobs - We Are Recruiting</h2>
    <div className="card"><h3>1. SITE INCHARGE - 5 Positions</h3><p><strong>Requirements:</strong> UCE certificate, 3+ years security experience, Age 25-45, LC1 & LC3 letters, National ID, Good English, No criminal record</p><p><strong>Salary:</strong> 500k-700k + Accommodation + Medical</p></div>
    <div className="card gold"><h3>2. SUPERVISOR / DEPLOYMENT OFFICER - 3 Positions</h3><p><strong>Requirements:</strong> UACE, Valid Rider Permit 3+ years, 3+ years deployment experience, Age 23-40, Knows Kampala routes, Motorcycle maintenance</p><p><strong>Salary:</strong> 600k-800k + Fuel + Motorcycle + Airtime</p></div>
    <div style={{textAlign:'center', marginTop:'15px'}}><Link to="/join" className="btn-yellow big">Apply Now</Link><p style={{fontSize:'10px', marginTop:'8px'}}>Training FREE 2 weeks at Plot 442 & 443 Masajjagere Muyenga 8AM-4PM | No fees | Bring original documents | HR: hr@pinnaclegroup.co.ug | 0754 139726</p></div>
  </div>
)

const Footer = () => <div className="footer">© 2026 Pinnacle Security Limited | Plot 442 & 443 Masajjagere, Off Kironde Road Muyenga, P.O.Box 124853 Kampala | HR: hr@pinnaclegroup.co.ug | 0754 139726 | pinnaclegroup.co.ug</div>

const App = () => (
  <BrowserRouter>
    <style>{`
      *{margin:0;padding:0;box-sizing:border-box}
      html,body{overflow:auto!important; height:auto!important}
      body{font-family:Arial,sans-serif; background:#f4f6f9; line-height:1.5}
      .nav{background:#0a1931; padding:10px 12px; position:sticky; top:0; z-index:999}
      .nav-top{display:flex; justify-content:space-between; align-items:center}
      .logo{color:#ffcc00; font-weight:900; font-size:14px}
      .menu-btn{color:#fff; font-size:22px; cursor:pointer; display:none}
      .links{display:flex; gap:8px; align-items:center; justify-content:center; flex-wrap:wrap}
      .links a{color:#fff; text-decoration:none; font-size:11px; font-weight:700; padding:5px 8px}
      .btn-yellow{background:#ffcc00!important; color:#0a1931!important; padding:6px 14px!important; border-radius:20px!important; font-weight:900!important; border:none; cursor:pointer; text-decoration:none; display:inline-block}
      .btn-yellow.big{padding:10px 20px!important; font-size:13px}
      .btn-admin{background:#1e3a8a!important; color:#ffcc00!important; border:1px solid #ffcc00!important; padding:6px 14px!important; border-radius:20px!important; font-weight:900!important; text-decoration:none}
      .btn-dark{background:#0a1931; color:#ffcc00; border:none; padding:10px 14px; border-radius:8px; font-weight:800; cursor:pointer; font-size:11px}
      .hero{background:linear-gradient(135deg,#0a1931,#1e3a8a); color:#fff; padding:35px 12px; text-align:center; border-radius:0 0 18px 18px}
      .hero h1{color:#ffcc00; font-size:18px; margin-bottom:6px} .hero p{font-size:11px; opacity:0.9}
      .dots{margin:10px 0} .dot{width:9px; height:9px; background:#555; border-radius:50%; display:inline-block; margin:0 4px; cursor:pointer} .dot.on{background:#ffcc00}
      .section{padding:18px 10px; max-width:1100px; margin:auto}
      .section h2{text-align:center; color:#0a1931; border-bottom:4px solid #ffcc00; padding-bottom:5px; margin-bottom:12px; font-size:16px}
      .card{background:#fff; padding:14px; border-radius:10px; margin-bottom:10px; box-shadow:0 2px 8px rgba(0,0,0,0.05); border-left:4px solid #0a1931; font-size:11px}
      .card.gold{border-left-color:#ffcc00; background:#fffbeb} .card.dark{background:linear-gradient(135deg,#1e293b,#0f172a); color:#fff; border-left-color:#ffcc00}
      .card h3{font-size:12px; margin-bottom:6px; color:#0a1931} .card.dark h3{color:#ffcc00} .link-more{color:#0a1931; font-weight:800; font-size:11px; text-decoration:none}
      .service-box{background:#fff; border-radius:10px; margin-bottom:8px; overflow:hidden; box-shadow:0 2px 6px rgba(0,0,0,0.04)}
      .service-head{background:#0a1931; color:#ffcc00; padding:10px 12px; display:flex; justify-content:space-between; cursor:pointer; font-size:12px}
      .service-body{padding:10px 12px; font-size:11px; background:#f8fafc} .service-body p{margin-bottom:8px; text-align:justify}
      .recruit{background:#fff3cd; border:2px dashed #ffcc00; padding:12px; border-radius:10px; text-align:center; margin-top:12px; font-size:11px}
      .form{max-width:500px; margin:12px auto; background:#fff; padding:14px; border-radius:12px; display:flex; flex-direction:column; gap:5px; box-shadow:0 3px 12px rgba(0,0,0,0.06)}
      .form label{font-size:11px; font-weight:700; color:#0a1931} .form input,.form select,.form textarea{padding:9px; border:1px solid #ddd; border-radius:7px; font-size:11px}
      .form button{background:#0a1931; color:#fff; padding:10px; border:none; border-radius:8px; font-weight:800; cursor:pointer} .msg{padding:8px; background:#d4edda; border-radius:6px; font-size:11px; text-align:center}
      .admin-top{background:linear-gradient(135deg,#0a1931,#1e3a8a); color:#fff; padding:18px; border-radius:14px; text-align:center; margin-bottom:12px}
      .admin-top h2{color:#ffcc00; border:none; margin-bottom:4px} .admin-top p{font-size:11px; opacity:0.8}
      .stats{display:flex; gap:8px; justify-content:center; margin:10px 0} .stats span{background:rgba(255,204,0,0.15); border:1px solid #ffcc00; padding:5px 10px; border-radius:15px; font-size:10px; font-weight:800; color:#ffcc00}
      .tabs{display:flex; gap:8px; justify-content:center; margin-top:10px} .tab{padding:7px 16px; border-radius:15px; border:2px solid #ffcc00; background:transparent; color:#ffcc00; font-weight:800; font-size:10px; cursor:pointer} .tab.on{background:#ffcc00; color:#0a1931}
      .search-bar{display:flex; gap:8px; margin-bottom:12px; background:#fff; padding:10px; border-radius:10px; box-shadow:0 2px 8px rgba(0,0,0,0.05)}
      .search-bar input{flex:1; padding:10px; border-radius:8px; border:2px solid #0a1931; font-size:12px}
      .table-card{background:#fff; border-radius:12px; padding:10px; box-shadow:0 3px 12px rgba(0,0,0,0.06)}
      .table-card h3{font-size:12px; margin-bottom:8px; color:#0a1931} .scroll{overflow-x:auto; -webkit-overflow-scrolling:touch}
      .table-card table{width:100%; border-collapse:collapse; font-size:10px; min-width:650px}
      .table-card th{background:#0a1931; color:#ffcc00; padding:9px 7px; text-align:left; font-size:9px}
      .table-card td{padding:7px; border-bottom:1px solid #f1f5f9; border-right:1px solid #f1f5f9}
      .table-card tr:hover{background:#fffbeb} .table-card td input{width:80px; padding:4px; border:1px solid #ccc; border-radius:4px; font-size:10px}
      .tag{padding:2px 7px; border-radius:10px; font-size:8px; font-weight:700} .tag.blue{background:#dbeafe; color:#1e40af} .tag.gold{background:#fef3c7; color:#92400e}
      .mini{border:none; padding:4px 8px; border-radius:5px; font-size:9px; cursor:pointer; margin-right:3px; font-weight:700}
      .mini.dark{background:#0a1931; color:#ffcc00} .mini.red{background:red; color:#fff} .mini.green{background:green; color:#fff} .mini.gray{background:#666; color:#fff}
      .no-result{text-align:center; padding:20px; color:#999; font-size:12px} .note{background:#fffbeb; border:1px solid #ffcc00; padding:10px; border-radius:8px; margin-top:12px; font-size:10px}
      .footer{background:#0a1931; color:#aaa; text-align:center; padding:12px; font-size:8px; margin-top:18px}
      @media(max-width:700px){ .menu-btn{display:block} .links{display:none; flex-direction:column; align-items:flex-start; padding-top:10px} .links.show{display:flex} }
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