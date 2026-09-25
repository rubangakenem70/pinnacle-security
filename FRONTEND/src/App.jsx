import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom'

const API_URL = "https://pinnacle-security-backend.vercel.app";
const ADMIN_PASSWORD = "Pinnacle2026!Secure123";

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
    <div className="section"><div className="card"><h3>🛡️ Who We Are - 4.3★ Rated Security Company</h3><p>Pinnacle Security Ltd at Plot 442 & 443 Masajjagere, Off Kironde Road Muyenga is a URSB Licensed Private Security Organization under ISIC 8010 Security Guard Service and Category F Construction Security. We protect 60+ sites in Kampala, Wakiso, Mukono, Entebbe with 150+ disciplined, trained officers. Control Room 0754 139726 is 24/7.</p></div><div className="card gold"><h3>🎯 Our Core Services</h3><p>✅ Security Guard Service (ISIC 8010) - Armed & Unarmed. ✅ Construction Security (Category F). ✅ CCTV Installation & Monitoring. ✅ Mobile Patrol & Rapid Response. ✅ Event Security. ✅ Alarm Systems & Electric Fences.</p></div><div className="card dark"><h3>🚨 URGENT RECRUITMENT - No Fees - Free Training 2 Weeks</h3><p><b>SITE INCHARGE (5 Positions):</b> Salary 500,000-700,000 + accommodation. <b>SUPERVISOR (3 Positions):</b> Salary 600,000-800,000 + fuel + motorcycle. Training: 2 weeks free at Muyenga HQ.</p><Link to="/join" className="btn-yellow">Apply Now Online - Free</Link></div></div></>)
}

const About = () => (
  <div className="section">
    <h2>About Pinnacle Security Ltd</h2>
    <div className="card"><h3>📍 Who We Are & Where We Are</h3><p>Pinnacle Security Limited is at <b>Plot 442 & 443 Masajjagere, Off Kironde Road, Muyenga Hill, Kampala</b>. Licensed ISIC 8010 & Category F. Control Room 0754 139726 is 24/7.</p></div>
    <div className="card gold"><h3>🎯 Our Mission, Vision & Core Values</h3><p><b>Mission:</b> To provide professional, affordable security solutions. <b>Vision:</b> To be Uganda's most trusted security company.</p></div>
  </div>
)

const Services = () => {
  const [open,setOpen]=useState(0);
  const list=[
    {n:"1. Security Guard Service (ISIC 8010)", d:["Licensed under ISIC 8010. Price: Starting from 700,000 UGX per guard per month."]},
    {n:"2. Construction Site Security (Category F)", d:["Protect cement, iron bars, equipment. Price: 800k-1.2M per guard."]},
    {n:"3. CCTV Installation", d:["4-camera from 2,500,000 UGX."]},
    {n:"4. Mobile Patrol - 10 Minutes", d:["Patrol 200k monthly for homes."]},
    {n:"5. Event Security", d:["50k per guard per day."]},
    {n:"6. Alarm Systems & Electric Fences", d:["Alarm from 1.8M. Fence 80k per meter."]}
  ];
  return (
    <div className="section"><h2>Our Services - ISIC 8010 & F Licensed</h2>
      {list.map((s,i)=><div key={i} className="service-box"><div className="service-head" onClick={()=>setOpen(open===i?null:i)}><strong>{s.n}</strong><span>{open===i?'Close -':'Open +'}</span></div>{open===i&&<div className="service-body">{s.d.map((p,k)=><p key={k}>{p}</p>)}</div>}</div>)}
    </div>
  )
}

const Contact = () => {
  const [f,setF]=useState({fullName:"",email:"",service:"",message:""}); const [s,setS]=useState("");
  const send=async(e)=>{ e.preventDefault(); setS("Sending..."); try{ const r=await fetch(`${API_URL}/api/contact`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(f)}); if(r.ok){ setS("✅ Saved! We will call you within 2 hours."); setF({fullName:"",email:"",service:"",message:""}) } }catch{ setS("❌ Error") } };
  return (
    <div className="section"><h2>Contact Us</h2>
      <form className="form-big" onSubmit={send}>
        <input value={f.fullName} onChange={e=>setF({...f,fullName:e.target.value})} required placeholder="Full Name"/>
        <input type="email" value={f.email} onChange={e=>setF({...f,email:e.target.value})} required placeholder="Email"/>
        <select value={f.service} onChange={e=>setF({...f,service:e.target.value})} required><option value="">Choose Service</option><option>Security Guard Service - 700k per guard</option><option>Construction Security - 800k-1.2M</option><option>CCTV Installation - From 2.5M</option><option>Mobile Patrol - 200k monthly</option><option>Event Security - 50k per guard per day</option><option>Alarm System - From 1.8M</option></select>
        <textarea rows="5" value={f.message} onChange={e=>setF({...f,message:e.target.value})} required placeholder="Message / Location"></textarea>
        <button className="big-btn">Submit Inquiry</button>{s&&<p className="msg">{s}</p>}
      </form>
    </div>
  )
}

const Join = () => {
  const [f,setF]=useState({fullName:"",phone:"",email:"",education:"",experience:"",interest:"",appliedBy:""}); const [s,setS]=useState("");
  const send=async(e)=>{ e.preventDefault(); setS("Sending..."); try{ const r=await fetch(`${API_URL}/api/applicants`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...f, position: "Not Specified"})}); if(r.ok){ setS("✅ Application Saved!"); setF({fullName:"",phone:"",email:"",education:"",experience:"",interest:"",appliedBy:""}) } }catch{ setS("❌ Error") } };
  return (
    <div className="section"><h2>Apply Now - Free Training</h2>
      <form className="form-big" onSubmit={send}>
        <input value={f.fullName} onChange={e=>setF({...f,fullName:e.target.value})} required placeholder="Full Name"/>
        <input value={f.phone} onChange={e=>setF({...f,phone:e.target.value})} required placeholder="Phone"/>
        <input type="email" value={f.email} onChange={e=>setF({...f,email:e.target.value})} required placeholder="Email"/>
        <select value={f.education} onChange={e=>setF({...f,education:e.target.value})} required><option value="">Education</option><option>P7</option><option>UCE</option><option>UACE</option><option>Diploma</option><option>Degree</option></select>
        <input value={f.interest} onChange={e=>setF({...f,interest:e.target.value})} required placeholder="Why interested?"/>
        <textarea value={f.experience} onChange={e=>setF({...f,experience:e.target.value})} required placeholder="Experience"></textarea>
        <button className="big-btn">Submit Application</button>{s&&<p className="msg">{s}</p>}
      </form>
    </div>
  )
}

const Blog = () => (
  <div className="section"><h2>Jobs - 8 Positions</h2>
    <div className="card"><h3>SITE INCHARGE - 5 Positions - 500k-700k</h3><p>UCE + 3 years experience.</p><Link to="/join" className="btn-yellow big">Apply</Link></div>
    <div className="card gold"><h3>SUPERVISOR - 3 Positions - 600k-800k + Motorcycle</h3><p>UACE + Rider Permit + 3 years.</p><Link to="/join" className="btn-yellow big">Apply</Link></div>
  </div>
)

const AdminLogin = () => {
  const [pass, setPass] = useState(""); const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const login = (e) => {
    e.preventDefault();
    if (pass === ADMIN_PASSWORD) {
      localStorage.setItem("pinnacle_admin_token", pass);
      setMsg("✅ Correct! Opening admin...");
      setTimeout(()=> navigate("/admin"), 500);
    } else {
      setMsg(`❌ Wrong password.`);
    }
  };
  return (
    <div className="section" style={{maxWidth:'520px', margin:'60px auto'}}>
      <div className="form-big" style={{border:'3px solid #ffcc00', textAlign:'center'}}>
        <h2>🔐 Admin Login</h2>
        <p style={{background:'#fff3cd', padding:'10px', borderRadius:'8px', margin:'10px 0'}}>Protected - Manager Only</p>
        <form onSubmit={login} style={{display:'flex', flexDirection:'column', gap:'15px', marginTop:'20px'}}>
          <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Enter Admin Password" required style={{padding:'16px'}} />
          <button className="big-btn">Login to Dashboard</button>
          {msg && <p className="msg">{msg}</p>}
        </form>
      </div>
    </div>
  )
}

const Admin = () => {
  const [contacts, setContacts] = useState([]); const [applicants, setApplicants] = useState([]);
  const [tab, setTab] = useState("contacts"); const [search, setSearch] = useState("");
  const [page, setPage] = useState(1); const perPage = 10;
  const navigate = useNavigate();
  const token = localStorage.getItem("pinnacle_admin_token");

  const load = async () => {
    try {
      const headers = {'x-admin-secret': token, 'Content-Type':'application/json'};
      const [cRes, aRes] = await Promise.all([
        fetch(`${API_URL}/api/contact`, {headers}),
        fetch(`${API_URL}/api/applicants`, {headers})
      ]);
      if (cRes.status===401) { localStorage.removeItem("pinnacle_admin_token"); navigate("/admin-login"); return; }
      const cData = await cRes.json(); const aData = await aRes.json();
      if (Array.isArray(cData)) setContacts(cData); if (Array.isArray(aData)) setApplicants(aData);
    } catch(err){ console.log("Load error", err); }
  }
  useEffect(()=>{ load(); },[]);
  useEffect(()=>{ setPage(1); },[tab, search]);

  const handleDelete = async (id, type) => {
    if (!window.confirm("Delete after handling?")) return;
    const url = type==='contacts'? `${API_URL}/api/contact/${id}` : `${API_URL}/api/applicants/${id}`;
    await fetch(url, {method:'DELETE', headers:{'x-admin-secret': token}});
    load();
  }
  const exportExcel = () => {
    const data = tab==='contacts'? contacts : applicants;
    if (!data.length) return alert("No data");
    const headers = Object.keys(data[0]);
    const csv = [headers.join(",")].concat(data.map(r=>headers.map(h=>`"${(r[h]||'').toString().replace(/"/g,'""')}"`).join(","))).join("\n");
    const blob = new Blob([csv], {type:'text/csv'}); const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download=`pinnacle_${tab}.csv`; a.click();
  }
  const logout = () => { localStorage.removeItem("pinnacle_admin_token"); navigate("/admin-login"); }

  const filteredContacts = contacts.filter(c => (c.full_name||c.fullName||"").toLowerCase().includes(search.toLowerCase()) || (c.email||"").toLowerCase().includes(search.toLowerCase()) || (c.phone||"").toLowerCase().includes(search.toLowerCase()));
  const filteredApplicants = applicants.filter(a => (a.full_name||a.fullName||"").toLowerCase().includes(search.toLowerCase()) || (a.phone||"").toLowerCase().includes(search.toLowerCase()));
  const currentList = tab==="contacts"? filteredContacts : filteredApplicants;
  const totalPages = Math.ceil(currentList.length / perPage) || 1;
  const paged = currentList.slice((page-1)*perPage, page*perPage);

  return (
    <div className="admin-page">
      <div className="admin-top">
        <h2>🔐 Admin Dashboard - Secure</h2>
        <div className="stats">
          <span>📩 {contacts.length} Contacts</span>
          <span>👮 {applicants.length} Applicants</span>
          <span>Page {page}/{totalPages}</span>
        </div>
        <div className="tabs">
          <button onClick={()=>setTab("contacts")} className={tab==="contacts"?"tab on":"tab"}>Contacts</button>
          <button onClick={()=>setTab("applicants")} className={tab==="applicants"?"tab on":"tab"}>Applicants</button>
          <button onClick={exportExcel} className="tab white">📊 Export Excel</button>
          <button onClick={logout} className="tab red">Logout</button>
        </div>
      </div>

      <div className="filter-bar">
        <input className="search-input" placeholder="🔍 Search name/email/phone..." value={search} onChange={e=>setSearch(e.target.value)} />
        <div className="filter-btns">
          <button className="btn-yellow small" onClick={load}>🔄 Refresh</button>
          <button className="btn-dark small" onClick={()=>setPage(p=>Math.max(1,p-1))}>‹ Prev</button>
          <button className="btn-dark small" onClick={()=>setPage(p=>Math.min(totalPages,p+1))}>Next ›</button>
        </div>
      </div>

      {/* MOBILE CARDS */}
      <div className="mobile-cards">
        {paged.map((item,i)=>(
          <div key={item.id || i} className="m-card">
            <div className="m-head">
              <b>{item.full_name || item.fullName}</b>
              <small>{(item.created_at||'').substring(0,10)}</small>
            </div>
            <div className="m-line">📧 {item.email || '-'} </div>
            <div className="m-line">📞 {item.phone || '-'} </div>
            <div className="m-tag"><span className="tag blue">{item.service || item.education || item.interest || 'General'}</span></div>
            <div className="m-msg">{(item.message||item.interest||item.experience||'').substring(0,120)}</div>
            <div className="m-actions">
              <a href={`tel:${item.phone}`} className="m-btn call">📞 Call</a>
              <a href={`https://wa.me/${(item.phone||'').replace(/[^0-9]/g,'')}`} target="_blank" rel="noreferrer" className="m-btn wa">WhatsApp</a>
              <button onClick={()=>handleDelete(item.id, tab)} className="m-btn del">🗑️</button>
            </div>
          </div>
        ))}
        {paged.length===0 && <p className="no-data">No data found</p>}
      </div>

      {/* DESKTOP TABLE */}
      <div className="table-card desktop-only">
        <div className="scroll">
          <table>
            <thead><tr><th>#</th><th>Name</th><th>Contact</th><th>Details</th><th>Date</th><th>Action</th></tr></thead>
            <tbody>{paged.map((item,i)=>(
              <tr key={item.id}><td>{(page-1)*perPage+i+1}</td><td><b>{item.full_name}</b></td><td>{item.email||item.phone}<br/><small>{item.phone||''}</small></td><td><span className="tag blue">{item.service||item.education}</span><br/><small>{(item.message||item.interest||'').substring(0,80)}</small></td><td>{(item.created_at||'').substring(0,10)}</td><td><button onClick={()=>handleDelete(item.id, tab)} className="del-btn">Delete</button></td></tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const ProtectedAdmin = () => {
  const token = localStorage.getItem("pinnacle_admin_token");
  if (token!== ADMIN_PASSWORD) return <Navigate to="/admin-login" replace />;
  return <Admin />;
}

const Footer = () => <div className="footer">© 2026 Pinnacle Security Ltd | Plot 442 & 443 Masajjagere, Muyenga | HR: hr@pinnaclegroup.co.ug | Control Room 24/7: 0754 139726</div>

const App = () => (
  <BrowserRouter>
    <style>{`
      *{margin:0;padding:0;box-sizing:border-box} body{font-family:Arial,sans-serif; background:#f4f6f9; line-height:1.6; overflow-x:hidden}
    .nav{background:#0a1931; padding:14px 15px; position:sticky; top:0; z-index:999}.nav-top{display:flex; justify-content:space-between; align-items:center}.logo{color:#ffcc00; font-weight:900; font-size:16px}.menu-btn{color:#fff; font-size:26px; cursor:pointer; display:none}.links{display:flex; gap:10px; align-items:center; justify-content:center; flex-wrap:wrap}.links a{color:#fff; text-decoration:none; font-size:15px; font-weight:700; padding:8px 10px}.btn-yellow{background:#ffcc00!important; color:#0a1931!important; padding:10px 18px!important; border-radius:25px!important; font-weight:900!important; border:none; cursor:pointer; text-decoration:none; display:inline-block; font-size:14px}.btn-yellow.big{padding:14px 26px!important; font-size:16px}.btn-yellow.small{padding:10px 16px!important; font-size:13px}.btn-admin{background:#1e3a8a!important; color:#ffcc00!important; border:2px solid #ffcc00!important; padding:8px 16px!important; border-radius:25px!important; font-weight:900!important; text-decoration:none; font-size:14px}.btn-dark{background:#0a1931; color:#ffcc00; border:none; padding:12px 18px; border-radius:10px; font-weight:800; cursor:pointer; font-size:13px}.btn-dark.small{padding:10px 14px}.hero{background:linear-gradient(135deg,#0a1931,#1e3a8a); color:#fff; padding:35px 15px; text-align:center; border-radius:0 0 20px 20px}.hero h1{color:#ffcc00; font-size:22px; margin-bottom:10px; line-height:1.3}.hero p{font-size:15px}.dots{margin:12px 0}.dot{width:10px; height:10px; background:#555; border-radius:50%; display:inline-block; margin:0 5px; cursor:pointer}.dot.on{background:#ffcc00}.section{padding:18px 12px; max-width:1250px; margin:auto}.section h2{text-align:center; color:#0a1931; border-bottom:4px solid #ffcc00; padding-bottom:8px; margin-bottom:16px; font-size:22px}.card{background:#fff; padding:18px; border-radius:14px; margin-bottom:14px; box-shadow:0 4px 12px rgba(0,0,0,0.06); border-left:5px solid #0a1931; font-size:15px; line-height:1.7}.card.gold{border-left-color:#ffcc00; background:#fffbeb}.card.dark{background:linear-gradient(135deg,#1e293b,#0f172a); color:#fff; border-left-color:#ffcc00}.card h3{font-size:18px; margin-bottom:10px; color:#0a1931}.card.dark h3{color:#ffcc00}.form-big{max-width:900px; margin:16px auto; background:#fff; padding:22px; border-radius:16px; display:flex; flex-direction:column; gap:14px; box-shadow:0 6px 20px rgba(0,0,0,0.08)}.form-big input,.form-big select,.form-big textarea{padding:14px; border:2px solid #0a1931; border-radius:10px; font-size:16px; width:100%; outline:none}.big-btn{background:#0a1931; color:#ffcc00; padding:16px; border:none; border-radius:12px; font-weight:900; cursor:pointer; font-size:17px}.msg{padding:12px; background:#d4edda; border-radius:10px; font-size:14px; text-align:center; font-weight:700}
     .admin-page{padding:12px; max-width:1250px; margin:auto}
     .admin-top{background:linear-gradient(135deg,#0a1931,#1e3a8a); color:#fff; padding:16px; border-radius:16px; text-align:center; margin-bottom:12px; border:2px solid #ffcc00}.admin-top h2{color:#ffcc00; border:none; margin-bottom:6px; font-size:18px}.stats{display:flex; gap:8px; justify-content:center; margin:10px 0; flex-wrap:wrap}.stats span{background:rgba(255,204,0,0.15); border:1.5px solid #ffcc00; padding:6px 12px; border-radius:20px; font-size:12px; font-weight:800; color:#ffcc00}.tabs{display:flex; gap:8px; justify-content:center; margin-top:10px; flex-wrap:wrap}.tab{padding:8px 16px; border-radius:20px; border:1.5px solid #ffcc00; background:transparent; color:#ffcc00; font-weight:800; font-size:12px; cursor:pointer}.tab.on{background:#ffcc00; color:#0a1931}.tab.white{background:#fff; color:#0a1931}.tab.red{border-color:#ff4444; color:#ff4444}
     .filter-bar{display:flex; gap:8px; margin-bottom:12px; background:#0a1931; padding:12px; border-radius:14px; flex-wrap:wrap; align-items:center; border:2px solid #ffcc00}.search-input{flex:1; padding:12px 14px; border-radius:10px; border:2px solid #ffcc00; font-size:14px; min-width:200px; background:#fff; color:#0a1931; font-weight:700}.filter-btns{display:flex; gap:6px; flex-wrap:wrap}
     .mobile-cards{display:flex; flex-direction:column; gap:10px}.m-card{background:#fff; border-radius:12px; padding:14px; box-shadow:0 2px 10px rgba(0,0,0,0.07); border-left:4px solid #ffcc00}.m-head{display:flex; justify-content:space-between; align-items:center; margin-bottom:6px}.m-head b{font-size:14px; color:#0a1931}.m-head small{font-size:10px; color:#888}.m-line{font-size:12px; color:#334155; margin:2px 0; word-break:break-all}.m-tag{margin:6px 0}.m-msg{font-size:12px; color:#475569; background:#f8fafc; padding:8px; border-radius:8px; margin:6px 0}.m-actions{display:flex; gap:6px; margin-top:8px}.m-btn{flex:1; text-align:center; padding:9px 8px; border-radius:8px; font-size:12px; font-weight:800; text-decoration:none; border:none; cursor:pointer}.m-btn.call{background:#0a1931; color:#ffcc00}.m-btn.wa{background:#22c55e; color:#fff}.m-btn.del{background:#fee2e2; color:#dc2626; flex:0 0 45px}
     .table-card{background:#fff; border-radius:14px; padding:12px; box-shadow:0 4px 14px rgba(0,0,0,0.06)}.scroll{overflow-x:auto}.table-card table{width:100%; border-collapse:collapse; font-size:14px; min-width:700px}.table-card th{background:#0a1931; color:#ffcc00; padding:12px 8px; text-align:left}.table-card td{padding:10px 8px; border-bottom:1px solid #f1f5f9}.tag{padding:4px 10px; border-radius:12px; font-size:11px; font-weight:800}.tag.blue{background:#dbeafe; color:#1e40af}.del-btn{background:#e11d48; color:#fff; border:none; padding:6px 10px; border-radius:6px; cursor:pointer; font-weight:800; font-size:12px}.no-data{text-align:center; padding:20px; color:#888}
     .desktop-only{display:none} @media(min-width:768px){.mobile-cards{display:none}.desktop-only{display:block}.logo{font-size:18px}.hero h1{font-size:26px}.section{padding:22px 14px}}
     .footer{background:#0a1931; color:#aaa; text-align:center; padding:16px; font-size:11px; margin-top:20px; line-height:1.6} @media(max-width:850px){.menu-btn{display:block}.links{display:none; flex-direction:column; align-items:flex-start; padding-top:12px}.links.show{display:flex} }
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