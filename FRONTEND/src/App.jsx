import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom'

const API_URL = "https://pinnacle-security-backend.vercel.app";

// ============ NAVBAR - ADMIN LINK STAYS BUT PROTECTED ============
const Navbar = () => {
  const loc = useLocation();
  const active = (p) => loc.pathname === p? {color:'#ffcc00', borderBottom:'3px solid #ffcc00'} : {color:'white'};
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
    {t:"Pinnacle Security Limited - 4.3★ Rated", d:"Plot 442 & 443 Masajjagere, Muyenga - Licensed ISIC 8010 & F"},
    {t:"🚨 WE ARE RECRUITING - 8 POSITIONS", d:"SITE INCHARGE: UCE + 3yrs | SUPERVISOR: UACE + Rider Permit + 3yrs"},
    {t:"ISIC 8010 | 60+ Sites | 150+ Officers | 24/7 Control Room 0754 139726", d:"hr@pinnaclegroup.co.ug | Free Training | No Recruitment Fees"},
  ];
  return (<><div className="hero"><h1>{slides[i].t}</h1><p>{slides[i].d}</p><div className="dots">{[0,1,2].map(n=><span key={n} className={n===i?'dot on':'dot'} onClick={()=>setI(n)}></span>)}</div><Link to="/join" className="btn-yellow big">Apply Now - Free</Link></div>
    <div className="section"><div className="card"><h3>🛡️ Who We Are - 4.3★ Rated Security Company</h3><p>Pinnacle Security Ltd at Plot 442 & 443 Masajjagere, Off Kironde Road Muyenga is a URSB Licensed Private Security Organization under ISIC 8010 Security Guard Service and Category F Construction Security. We protect 60+ sites in Kampala, Wakiso, Mukono, Entebbe with 150+ disciplined, trained officers. Control Room 0754 139726 is 24/7. HR Email hr@pinnaclegroup.co.ug. P.O.Box 124853 Kampala. We are trusted by banks, NGOs, schools, hospitals, construction companies and private homes.</p></div><div className="card gold"><h3>🎯 Our Core Services</h3><p>✅ Security Guard Service (ISIC 8010) - Armed & Unarmed for offices, banks, NGOs, schools, hospitals, factories, homes. ✅ Construction Security (Category F) - Protect cement, iron bars, equipment, workers, prevent theft, night patrol. ✅ CCTV Installation & Monitoring - HD cameras, NVR, remote phone viewing. ✅ Mobile Patrol & Rapid Response - 3 patrol vehicles, 10 mins response in Kampala. ✅ Event Security - Weddings, concerts, conferences, sports. ✅ Alarm Systems & Electric Fences. All with 24/7 Control Room support.</p></div><div className="card dark"><h3>🚨 URGENT RECRUITMENT - No Fees - Free Training 2 Weeks</h3><p><b>SITE INCHARGE (5 Positions):</b> UCE + 3 years experience as security guard/supervisor. Salary 500,000-700,000 + accommodation + medical + uniform + NSSF. <b>SUPERVISOR / DEPLOYMENT OFFICER (3 Positions):</b> UACE + Valid Rider Permit 3+ years + 3 years deployment experience. Salary 600,000-800,000 + fuel + motorcycle + airtime + accommodation + medical. Training: 2 weeks free at Muyenga HQ 8AM-4PM. Bring Original National ID, Academic Papers, LC1 Letter, 2 Passport Photos. No recruitment fees! Visit Plot 442 & 443 Masajjagere Muyenga.</p><Link to="/join" className="btn-yellow">Apply Now Online - Free</Link></div></div></>)
}

const About = () => (
  <div className="section">
    <h2>About Pinnacle Security Ltd</h2>
    <div className="card">
      <h3>📍 Who We Are & Where We Are</h3>
      <p>Pinnacle Security Limited is a Ugandan owned Private Security Organization headquartered at <b>Plot 442 & 443 Masajjagere, Off Kironde Road, Muyenga Hill, Makindye Division, Kampala</b> - P.O.Box 124853 Kampala, Uganda. Branch at 256 Bukasa Road, Muyenga. We are fully licensed by Uganda Registration Services Bureau (URSB) and Uganda Police Force Private Security Department under <b>ISIC 8010 - Security Guard Service</b> and <b>Category F - Construction Site Security</b>. We are rated 4.3★ by clients on Google Business. We operate 8AM-4PM office hours for visitors, but our <b>Control Room 0754 139726 / 0200 900 700 is 24/7, 365 days</b>.</p>
    </div>
    <div className="card gold">
      <h3>🎯 Our Mission, Vision & Core Values</h3>
      <p><b>Our Mission:</b> To provide professional, affordable, technology-driven private security solutions that protect lives, property, and businesses across Uganda with discipline, integrity, and 24/7 rapid response.</p>
      <p><b>Our Vision:</b> To be Uganda's most trusted, licensed, and client-rated (4.5★+) security company with 500+ officers protecting 200+ sites by 2028.</p>
      <p><b>Our Core Values:</b> Discipline & Integrity, Professionalism, Rapid Response, Client Focus, Innovation, Welfare.</p>
    </div>
    <div className="card">
      <h3>📜 History & Experience</h3>
      <p>Founded in 2018, Pinnacle Security started with 10 guards. Today 2026 we have 150+ officers, 60+ active sites in Kampala, Wakiso, Mukono, Entebbe. Our clients include: 12 Private Schools, 8 Clinics/Hospitals, 15 Construction Sites, 10 NGOs, 5 Banks, 10 Factories, and 20+ Private Residences.</p>
    </div>
  </div>
)

const Services = () => {
  const [open,setOpen]=useState(0);
  const list=[
    {n:"1. Security Guard Service (ISIC 8010) - Our Core Business", d:["Licensed under ISIC 8010 to provide armed and unarmed security guard services for: Offices, Banks & Microfinances, NGOs & Embassies, Schools & Universities, Hospitals & Clinics, Hotels & Restaurants, Factories & Warehouses, Supermarkets & Shops, Private Homes. Our guards are trained for 2 weeks at Muyenga HQ. Duty: 12 hours day/night with relief. Price: Starting from 700,000 UGX per guard per month."]},
    {n:"2. Construction Site Security (Category F Licensed)", d:["Licensed Category F to protect construction sites. We protect: Cement, Iron Bars, Timber, Tiles, Paint, Electrical wires, Tools & Machinery. Price: 800,000-1,200,000 per guard per month."]},
    {n:"3. CCTV Installation, Monitoring & Maintenance", d:["We supply, install, and maintain: HD CCTV Cameras, NVR/DVR, Hard Disk, Remote viewing on phone. Price: 4-camera system from 2,500,000 UGX full installation."]},
    {n:"4. Mobile Patrol, Rapid Response & Alarm Response - 10 Minutes", d:["We have 3 patrol vehicles covering Muyenga, Bukasa, Buziga, Munyonyo, Kololo, Nakawa, Bunga, Ggaba, Kansanga, Kabalagala, Lubowa. Price: Patrol only 200,000 per month for homes."]},
    {n:"5. Event Security Management", d:["We provide trained event security for: Weddings, Introduction Ceremonies, Birthday Parties, Concerts, Church Crusades, Conferences. Price: 50,000 per guard per day."]},
    {n:"6. Alarm Systems, Electric Fences & Access Control", d:["We install: Intruder Alarm System, Electric Fence, Access Control, Barrier Gates, Razor Wire. Price: Alarm from 1,800,000 UGX. Electric fence 80,000 per meter."]}
  ];
  return (
    <div className="section">
      <h2>Our Professional Security Services - ISIC 8010 & F Licensed</h2>
      {list.map((s,i)=><div key={i} className="service-box"><div className="service-head" onClick={()=>setOpen(open===i?null:i)}><strong>{s.n}</strong><span>{open===i?'Close -':'Open +'}</span></div>{open===i&&<div className="service-body">{s.d.map((p,k)=><p key={k}>{p}</p>)}<div style={{marginTop:'12px', textAlign:'center'}}><Link to="/contact" className="btn-yellow">Get Free Quotation</Link></div></div>}</div>)}
    </div>
  )
}

const Contact = () => {
  const [f,setF]=useState({fullName:"",email:"",service:"",message:""}); const [s,setS]=useState("");
  const send=async(e)=>{ e.preventDefault(); setS("Sending..."); try{ const r=await fetch(`${API_URL}/api/contact`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(f)}); if(r.ok){ setS("✅ Message Saved! We will call you within 2 hours."); setF({fullName:"",email:"",service:"",message:""}) } }catch{ setS("❌ Error - Check internet") } };
  return (
    <div className="section">
      <h2>Contact Us - Get Free Security Quotation in 2 Hours</h2>
      <form className="form-big" onSubmit={send}>
        <div className="form-row-2">
          <div><label>Full Names *</label><input value={f.fullName} onChange={e=>setF({...f,fullName:e.target.value})} required placeholder="Your full name"/></div>
          <div><label>Email Address *</label><input type="email" value={f.email} onChange={e=>setF({...f,email:e.target.value})} required placeholder="your@email.com"/></div>
        </div>
        <label>Which Service Do You Need? *</label>
        <select value={f.service} onChange={e=>setF({...f,service:e.target.value})} required><option value="">Choose Service Needed</option><option>Security Guard Service - 700k per guard</option><option>Construction Security - 800k-1.2M</option><option>CCTV Installation - From 2.5M</option><option>Mobile Patrol - 200k monthly</option><option>Event Security - 50k per guard per day</option><option>Alarm System - From 1.8M</option><option>Electric Fence - 80k per meter</option><option>All Services Package</option></select>
        <label>Your Message / Location / Number of Guards Needed *</label>
        <textarea rows="6" value={f.message} onChange={e=>setF({...f,message:e.target.value})} required placeholder="Example: I need 2 guards for my construction site in Kigo..."></textarea>
        <button className="big-btn">Submit Inquiry - Get Free Quotation Today</button>
        {s&&<p className="msg">{s}</p>}
      </form>
    </div>
  )
}

const Join = () => {
  const [f,setF]=useState({fullName:"",phone:"",email:"",education:"",experience:"",interest:"",appliedBy:""}); const [s,setS]=useState("");
  const send=async(e)=>{ e.preventDefault(); setS("Sending..."); try{ const r=await fetch(`${API_URL}/api/applicants`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...f, position: "Not Specified"})}); if(r.ok){ setS("✅ Application Saved! We will call you soon."); setF({fullName:"",phone:"",email:"",education:"",experience:"",interest:"",appliedBy:""}) } }catch{ setS("❌ Error") } };
  return (
    <div className="section">
      <h2>Apply Now - Join Pinnacle Security - Free Training - No Fees</h2>
      <form className="form-big" onSubmit={send}>
        <div className="form-row-2">
          <div><label>Full Name As On National ID *</label><input value={f.fullName} onChange={e=>setF({...f,fullName:e.target.value})} required placeholder="MUKASA JOHN BOSCO"/></div>
          <div><label>Phone Number *</label><input value={f.phone} onChange={e=>setF({...f,phone:e.target.value})} required placeholder="07XXXXXXXX"/></div>
        </div>
        <div className="form-row-2">
          <div><label>Email Address *</label><input type="email" value={f.email} onChange={e=>setF({...f,email:e.target.value})} required placeholder="your@email.com"/></div>
          <div><label>Highest Education Level *</label><select value={f.education} onChange={e=>setF({...f,education:e.target.value})} required><option value="">Choose</option><option>P7</option><option>O-Level</option><option>UCE</option><option>UACE</option><option>Diploma</option><option>Degree</option><option>Master</option></select></div>
        </div>
        <div className="form-row-2">
          <div><label>New or Ongoing? *</label><input value={f.appliedBy} onChange={e=>setF({...f,appliedBy:e.target.value})} required placeholder="New or Ongoing"/></div>
          <div><label>Why Interested? *</label><input value={f.interest} onChange={e=>setF({...f,interest:e.target.value})} required placeholder="I want to protect people..."/></div>
        </div>
        <label>Experience Details *</label>
        <textarea rows="3" value={f.experience} onChange={e=>setF({...f,experience:e.target.value})} required placeholder="I worked as security guard at Saracen 2022-2024..."></textarea>
        <button className="big-btn">Submit Application - FREE</button>
        {s&&<p className="msg">{s}</p>}
      </form>
    </div>
  )
}

const Blog = () => (
  <div className="section">
    <h2>🚨 Jobs - We Are Recruiting - 8 Positions - Free Training - No Fees</h2>
    <div className="card"><h3>📌 Job 1: SITE INCHARGE - 5 Positions - 500k-700k</h3><p>Location: Kampala, Wakiso, Mukono. Salary 500k-700k + accommodation. Requirements: UCE + 3 years experience. Apply online or visit Plot 442 Muyenga.</p><Link to="/join" className="btn-yellow big">Apply for SITE INCHARGE</Link></div>
    <div className="card gold"><h3>📌 Job 2: SUPERVISOR - 3 Positions - 600k-800k + Motorcycle</h3><p>Requirements: UACE + Rider Permit 3+ years + 3 years deployment experience. Salary 600k-800k + fuel + motorcycle.</p><Link to="/join" className="btn-yellow big">Apply for SUPERVISOR</Link></div>
  </div>
)

// ============ NEW: ADMIN LOGIN PAGE ============
const AdminLogin = () => {
  const [pass, setPass] = useState(""); const [msg, setMsg] = useState(""); const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = async (e) => {
    e.preventDefault(); setLoading(true); setMsg("Checking password...");
    try {
      const r = await fetch(`${API_URL}/api/admin/login`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({password: pass})});
      const d = await r.json();
      if (d.success) {
        localStorage.setItem("pinnacle_admin_token", d.token);
        setMsg("✅ Login success! Opening dashboard...");
        setTimeout(()=> navigate("/admin"), 600);
      } else { setMsg("❌ Wrong password - Check Vercel ADMIN_SECRET"); }
    } catch { setMsg("❌ Cannot connect to backend - Check API_URL"); }
    setLoading(false);
  };
  return (
    <div className="section" style={{maxWidth:'520px', margin:'40px auto'}}>
      <div className="form-big" style={{textAlign:'center', border:'3px solid #ffcc00'}}>
        <h2>🔐 Admin Login</h2><p style={{margin:'10px 0', background:'#fff3cd', padding:'10px', borderRadius:'8px'}}>This page is protected. Only Pinnacle Manager can login.</p>
        <form onSubmit={login} style={{display:'flex', flexDirection:'column', gap:'15px', marginTop:'20px'}}>
          <label>Enter Admin Password *</label>
          <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="ADMIN_SECRET from Vercel" required style={{padding:'16px'}} />
          <button className="big-btn" disabled={loading}>{loading? 'Verifying...' : 'Login to Dashboard'}</button>
          {msg && <p className="msg">{msg}</p>}
        </form>
        <p style={{marginTop:'15px', fontSize:'12px', color:'#888'}}>Set ADMIN_SECRET in Vercel Backend > Settings > Env Variables</p>
      </div>
    </div>
  )
}

// ============ NEW: SECURE ADMIN WITH DELETE + EXCEL + PAGINATION ============
const Admin = () => {
  const [contacts, setContacts] = useState([]); const [applicants, setApplicants] = useState([]);
  const [tab, setTab] = useState("contacts"); const [searchName, setSearchName] = useState("");
  const [eduFilter, setEduFilter] = useState(""); const [serviceFilter, setServiceFilter] = useState("");
  const [page, setPage] = useState(1); const perPage = 10;
  const navigate = useNavigate();
  const token = localStorage.getItem("pinnacle_admin_token");

  const load = async () => {
    try {
      const headers = {'x-admin-secret': token};
      const cRes = await fetch(`${API_URL}/api/contact`, {headers});
      const aRes = await fetch(`${API_URL}/api/applicants`, {headers});
      if (cRes.status===401 || aRes.status===401) { localStorage.removeItem("pinnacle_admin_token"); navigate("/admin-login"); return; }
      const cData = await cRes.json(); const aData = await aRes.json();
      if (Array.isArray(cData)) setContacts(cData); if (Array.isArray(aData)) setApplicants(aData);
    } catch(e){ console.log(e); }
  }
  useEffect(()=>{ load() },[]);
  useEffect(()=>{ setPage(1); },[tab, searchName, eduFilter, serviceFilter]);

  const handleDelete = async (id, type) => {
    if (!window.confirm("Delete this record? You already handled this quotation/applicant?")) return;
    const url = type==='contacts'? `${API_URL}/api/contact/${id}` : `${API_URL}/api/applicants/${id}`;
    await fetch(url, {method:'DELETE', headers:{'x-admin-secret': token}});
    load();
  }

  const exportExcel = () => {
    const data = tab==='contacts'? filteredContacts : filteredApplicants;
    if (data.length===0) return alert("No data to export");
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(",")];
    data.forEach(row => {
      const values = headers.map(h => {
        let val = row[h]===null||row[h]===undefined? '' : row[h].toString();
        val = val.replace(/"/g, '""');
        return `"${val}"`;
      });
      csvRows.push(values.join(","));
    });
    const csv = csvRows.join("\n");
    const blob = new Blob([csv], {type:'text/csv'}); const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download=`pinnacle_${tab}_${new Date().toISOString().slice(0,10)}.csv`; a.click();
  }

  const logout = () => { localStorage.removeItem("pinnacle_admin_token"); navigate("/admin-login"); }

  const filteredContacts = contacts.filter(c => {
    const matchName = searchName? (c.full_name||"").toLowerCase().includes(searchName.toLowerCase()) || (c.email||"").toLowerCase().includes(searchName.toLowerCase()) : true;
    const matchService = serviceFilter? (c.service||"")===serviceFilter : true;
    return matchName && matchService;
  });

  const filteredApplicants = applicants.filter(a => {
    const matchName = searchName? (a.full_name||"").toLowerCase().includes(searchName.toLowerCase()) || (a.phone||"").toLowerCase().includes(searchName.toLowerCase()) : true;
    const matchEdu = eduFilter? (a.education||"")===eduFilter : true;
    return matchName && matchEdu;
  });

  const currentList = tab==="contacts"? filteredContacts : filteredApplicants;
  const totalPages = Math.ceil(currentList.length / perPage) || 1;
  const paged = currentList.slice((page-1)*perPage, page*perPage);

  return (
    <div className="section">
      <div className="admin-top">
        <h2>🔐 Admin Dashboard - Protected & Secure</h2>
        <div className="stats"><span>📩 {contacts.length} Contacts</span><span>👮 {applicants.length} Applicants</span><span>Page {page}/{totalPages}</span></div>
        <div className="tabs">
          <button onClick={()=>setTab("contacts")} className={tab==="contacts"?"tab on":"tab"}>Contacts</button>
          <button onClick={()=>setTab("applicants")} className={tab==="applicants"?"tab on":"tab"}>Applicants</button>
          <button onClick={exportExcel} className="tab" style={{background:'#fff', color:'#0a1931'}}>📊 Export Excel</button>
          <button onClick={logout} className="tab" style={{borderColor:'#ff4444', color:'#ff4444'}}>Logout</button>
        </div>
      </div>

      <div className="filter-bar-clean">
        <input className="search-visible" placeholder={tab==="contacts"?"🔍 Search Name/Email...":"🔍 Search Name/Phone..."} value={searchName} onChange={e=>setSearchName(e.target.value)} />
        {tab==="contacts"? (
          <select className="search-visible-dropdown" value={serviceFilter} onChange={e=>setServiceFilter(e.target.value)}>
            <option value="">🔍 All Services ▼</option>
            <option value="Security Guard Service - 700k per guard">Security Guard Service</option>
            <option value="Construction Security - 800k-1.2M">Construction Security</option>
            <option value="CCTV Installation - From 2.5M">CCTV Installation</option>
            <option value="Mobile Patrol - 200k monthly">Mobile Patrol</option>
            <option value="Event Security - 50k per guard per day">Event Security</option>
            <option value="Alarm System - From 1.8M">Alarm System</option>
          </select>
        ) : (
          <select className="search-visible-dropdown" value={eduFilter} onChange={e=>setEduFilter(e.target.value)}>
            <option value="">🎓 All Education ▼</option><option value="P7">P7</option><option value="O-Level">O-Level</option><option value="UCE">UCE</option><option value="UACE">UACE</option><option value="Diploma">Diploma</option><option value="Degree">Degree</option><option value="Master">Master</option>
          </select>
        )}
        <button className="btn-dark" onClick={()=>{setSearchName(""); setEduFilter(""); setServiceFilter("");}}>Clear</button>
        <button className="btn-yellow" onClick={load}>🔄 Refresh</button>
        <button className="btn-dark" onClick={()=>setPage(p=>Math.max(1,p-1))}>‹ Prev</button>
        <button className="btn-dark" onClick={()=>setPage(p=>Math.min(totalPages,p+1))}>Next ›</button>
      </div>

      <div className="table-card">
        <h3>{tab==="contacts"? `📩 Showing ${paged.length} of ${filteredContacts.length} Contacts` : `👮 Showing ${paged.length} of ${filteredApplicants.length} Applicants`} - Delete after handling</h3>
        <div className="scroll">
          {tab==="contacts"? (
            <table><thead><tr><th>#</th><th>Full Name</th><th>Email</th><th>Service</th><th>Message</th><th>Date</th><th>Action</th></tr></thead>
              <tbody>{paged.map((c,i)=>(<tr key={c.id}><td>{(page-1)*perPage+i+1}</td><td><b>{c.full_name}</b></td><td>{c.email}</td><td><span className="tag blue">{c.service}</span></td><td>{c.message?.substring(0,100)}</td><td>{c.created_at?.substring(0,10)}</td><td><button onClick={()=>handleDelete(c.id,'contacts')} style={{background:'#e11d48',color:'#fff',border:'none',padding:'6px 10px',borderRadius:'6px',cursor:'pointer',fontWeight:800}}>Delete</button></td></tr>))}</tbody></table>
          ) : (
            <table><thead><tr><th>#</th><th>Full Name</th><th>Phone</th><th>Email</th><th>Education</th><th>Interest</th><th>Action</th></tr></thead>
              <tbody>{paged.map((a,i)=>(<tr key={a.id}><td>{(page-1)*perPage+i+1}</td><td><b>{a.full_name}</b></td><td>{a.phone}</td><td>{a.email}</td><td><span className="tag dark">{a.education}</span></td><td>{a.interest?.substring(0,60)}</td><td><button onClick={()=>handleDelete(a.id,'applicants')} style={{background:'#e11d48',color:'#fff',border:'none',padding:'6px 10px',borderRadius:'6px',cursor:'pointer',fontWeight:800}}>Delete</button></td></tr>))}</tbody></table>
          )}
        </div>
      </div>
    </div>
  )
}

const ProtectedAdmin = () => {
  const token = localStorage.getItem("pinnacle_admin_token");
  if (!token) return <Navigate to="/admin-login" replace />;
  return <Admin />;
}

const Footer = () => <div className="footer">© 2026 Pinnacle Security Ltd | Plot 442 & 443 Masajjagere, Muyenga | HR: hr@pinnaclegroup.co.ug | Ops: ops@pinnaclegroup.co.ug | Control Room 24/7: 0754 139726 / 0200 900 700 | Licensed ISIC 8010 & F | 4.3★ Rated | 60+ Sites | 150+ Officers</div>

const App = () => (
  <BrowserRouter>
    <style>{`
      *{margin:0;padding:0;box-sizing:border-box}
      body{font-family:Arial,sans-serif; background:#f4f6f9; line-height:1.9}
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
     .hero h1{color:#ffcc00; font-size:26px; margin-bottom:12px}.hero p{font-size:17px}
     .dots{margin:14px 0}.dot{width:12px; height:12px; background:#555; border-radius:50%; display:inline-block; margin:0 6px; cursor:pointer}.dot.on{background:#ffcc00}
     .section{padding:22px 14px; max-width:1250px; margin:auto}
     .section h2{text-align:center; color:#0a1931; border-bottom:4px solid #ffcc00; padding-bottom:10px; margin-bottom:20px; font-size:26px}
     .card{background:#fff; padding:22px; border-radius:14px; margin-bottom:18px; box-shadow:0 4px 12px rgba(0,0,0,0.07); border-left:6px solid #0a1931; font-size:17px; line-height:1.9}
     .card.gold{border-left-color:#ffcc00; background:#fffbeb}.card.dark{background:linear-gradient(135deg,#1e293b,#0f172a); color:#fff; border-left-color:#ffcc00}
     .card h3{font-size:20px; margin-bottom:14px; color:#0a1931; line-height:1.5}.card.dark h3{color:#ffcc00}.card p{margin-bottom:10px}
     .service-box{background:#fff; border-radius:12px; margin-bottom:14px; box-shadow:0 3px 10px rgba(0,0,0,0.06); overflow:hidden; border:2px solid #0a1931}
     .service-head{display:flex; justify-content:space-between; align-items:center; padding:16px 18px; background:#0a1931; color:#ffcc00; cursor:pointer; font-size:16px; font-weight:800}
     .service-body{padding:18px; background:#fff; font-size:16px; line-height:1.9}
     .form-big{max-width:900px; margin:20px auto; background:#fff; padding:28px; border-radius:18px; display:flex; flex-direction:column; gap:16px; box-shadow:0 6px 20px rgba(0,0,0,0.09)}
     .form-big label{font-size:17px; font-weight:800; color:#0a1931; display:block; margin-bottom:4px}
     .form-big input,.form-big select,.form-big textarea{padding:15px; border:2px solid #0a1931; border-radius:12px; font-size:17px; width:100%; outline:none}
     .form-row-2{display:grid; grid-template-columns:1fr 1fr; gap:18px}
     .big-btn{background:#0a1931; color:#ffcc00; padding:18px; border:none; border-radius:14px; font-weight:900; cursor:pointer; font-size:19px}
     .msg{padding:14px; background:#d4edda; border-radius:12px; font-size:17px; text-align:center; font-weight:700}
     .admin-top{background:linear-gradient(135deg,#0a1931,#1e3a8a); color:#fff; padding:24px; border-radius:18px; text-align:center; margin-bottom:18px}
     .admin-top h2{color:#ffcc00; border:none; margin-bottom:8px; font-size:24px}
     .stats{display:flex; gap:12px; justify-content:center; margin:14px 0; flex-wrap:wrap}.stats span{background:rgba(255,204,0,0.15); border:2px solid #ffcc00; padding:8px 16px; border-radius:25px; font-size:15px; font-weight:800; color:#ffcc00}
     .tabs{display:flex; gap:12px; justify-content:center; margin-top:14px; flex-wrap:wrap}.tab{padding:10px 22px; border-radius:25px; border:2px solid #ffcc00; background:transparent; color:#ffcc00; font-weight:800; font-size:15px; cursor:pointer}.tab.on{background:#ffcc00; color:#0a1931}
     .filter-bar-clean{display:flex; gap:12px; margin-bottom:18px; background:#0a1931; padding:20px; border-radius:16px; box-shadow:0 6px 18px rgba(0,0,0,0.15); flex-wrap:wrap; align-items:center; border:3px solid #ffcc00}
     .search-visible{flex:1; padding:16px 20px; border-radius:12px; border:3px solid #ffcc00; font-size:17px; min-width:260px; outline:none; background:#ffffff; color:#0a1931; font-weight:900; box-shadow:0 4px 12px rgba(255,204,0,0.3)}
     .search-visible::placeholder{color:#1e3a8a; font-weight:700; opacity:1}
     .search-visible-dropdown{padding:16px 20px; border-radius:12px; border:3px solid #ffcc00; font-size:17px; background:#ffcc00; font-weight:900; min-width:260px; cursor:pointer; outline:none; color:#0a1931; box-shadow:0 4px 12px rgba(255,204,0,0.3)}
     .table-card{background:#fff; border-radius:16px; padding:16px; box-shadow:0 5px 18px rgba(0,0,0,0.08)}
     .table-card h3{font-size:17px; margin-bottom:12px; color:#0a1931}.scroll{overflow-x:auto}
     .table-card table{width:100%; border-collapse:collapse; font-size:16px; min-width:850px}
     .table-card th{background:#0a1931; color:#ffcc00; padding:14px 10px; text-align:left; font-size:14px; font-weight:800}
     .table-card td{padding:12px 10px; border-bottom:1px solid #f1f5f9; font-size:16px}
     .tag{padding:5px 12px; border-radius:15px; font-size:13px; font-weight:800}.tag.blue{background:#dbeafe; color:#1e40af}.tag.gold{background:#fef3c7; color:#92400e}.tag.dark{background:#1e293b; color:#ffcc00}
     .footer{background:#0a1931; color:#aaa; text-align:center; padding:18px; font-size:13px; margin-top:24px; line-height:1.7}
      @media(max-width:850px){.form-row-2{grid-template-columns:1fr}.menu-btn{display:block}.links{display:none; flex-direction:column; align-items:flex-start; padding-top:14px}.links.show{display:flex}.filter-bar-clean{flex-direction:column; align-items:stretch}.search-visible,.search-visible-dropdown{width:100%} }
    `}</style>
    <Navbar/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/about" element={<About/>}/>
      <Route path="/services" element={<Services/>}/>
      <Route path="/blog" element={<Blog/>}/>
      <Route path="/contact" element={<Contact/>}/>
      <Route path="/join" element={<Join/>}/>
      <Route path="/admin-login" element={<AdminLogin/>}/>
      <Route path="/admin" element={<ProtectedAdmin/>}/>
    </Routes>
    <Footer/>
  </BrowserRouter>
)

export default App