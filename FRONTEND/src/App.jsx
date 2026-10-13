import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom'

const API_URL = "https://pinnacle-security-backend.vercel.app";
const ADMIN_PASSWORD = "Pinnacle2026!Secure123";
const KOBO_LINK = "https://ee.kobotoolbox.org/x/ODCdeyaJ";

const Navbar = () => {
  const loc = useLocation();
  const active = (p) => loc.pathname === p? {color:'#ffcc00', borderBottom:'3px solid #ffcc00'} : {color:'white'};
  const [open, setOpen] = useState(false);
  return (
    <nav className="nav">
      <div className="nav-top"><span className="logo">PINNACLE SECURITY LTD</span><span className="menu-btn" onClick={()=>setOpen(!open)}>{open?'X':'☰'}</span></div>
      <div className={`links ${open?'show':''}`}>
        <Link to="/" style={active("/")} onClick={()=>setOpen(false)}>Home</Link>
        <Link to="/about" style={active("/about")} onClick={()=>setOpen(false)}>About</Link>
        <Link to="/services" style={active("/services")} onClick={()=>setOpen(false)}>Services</Link>
        <Link to="/blog" style={active("/blog")} onClick={()=>setOpen(false)}>Jobs</Link>
        <Link to="/contact" style={active("/contact")} onClick={()=>setOpen(false)}>Contact</Link>
        <Link to="/join" className="btn-yellow" onClick={()=>setOpen(false)}>Apply Now</Link>
        <Link to="/admin" className="btn-admin" onClick={()=>setOpen(false)}>Admin</Link>
      </div>
    </nav>
  )
}

const Home = () => {
  const [i, setI] = useState(0);
  useEffect(()=>{ const t=setInterval(()=>setI(p=>(p+1)%3), 3500); return()=>clearInterval(t) },[]);
  const slides=[
    {t:"Pinnacle Security Limited - 4.3 Rated", d:"Plot 442 & 443 Masajjagere, Muyenga - Licensed Security Company"},
    {t:"WE ARE RECRUITING - JOIN US TODAY", d:"SITE INCHARGE: UCE + 3yrs experience | SUPERVISOR: UACE + Rider Permit + 3yrs"},
    {t:"60+ Sites | 150+ Officers | 24/7 Control Room 0754 139726", d:"hr@pinnaclegroup.co.ug | Free Training | No Recruitment Fees"},
  ];
  return (<><div className="hero"><h1>{slides[i].t}</h1><p>{slides[i].d}</p><div className="dots">{[0,1,2].map(n=><span key={n} className={n===i?'dot on':'dot'} onClick={()=>setI(n)}></span>)}</div><Link to="/join" className="btn-yellow big">Apply Now - Free</Link></div>
    <div className="section"><div className="card"><h3>Who We Are - 4.3 Rated Security Company</h3><p>Pinnacle Security Ltd at Plot 442 & 443 Masajjagere, Off Kironde Road Muyenga is a URSB Licensed Private Security Organization. We protect 60+ sites in Kampala, Wakiso, Mukono, Entebbe with 150+ disciplined, trained officers. Control Room 0754 139726 is 24/7.</p></div><div className="card gold"><h3>Our Core Services</h3><p>Security Guard Service - Armed & Unarmed. Construction Security. CCTV Installation & Monitoring. Mobile Patrol & Rapid Response. Event Security. Alarm Systems & Electric Fences.</p></div><div className="card dark"><h3>URGENT RECRUITMENT - No Fees - Free Training 2 Weeks</h3><p><b>SITE INCHARGE:</b> UCE + 3yrs experience. <b>SUPERVISOR:</b> UACE + Rider Permit + 3yrs. Training: 2 weeks free at Muyenga HQ.</p><Link to="/join" className="btn-yellow">Apply Now Online - Free</Link></div></div></>)
}

const About = () => (
  <div className="section">
    <h2>About Pinnacle Security Ltd</h2>
    <div className="about-hero">
      <h3>Pinnacle Security Ltd - Protecting What Matters Most Since 2018</h3>
      <p>Located at <b>Plot 442 & 443 Masajjagere, Off Kironde Road, Muyenga Hill, Kampala - Uganda</b>, Pinnacle Security Limited is a fully licensed Private Security Organization registered under URSB and Ministry of Internal Affairs.</p>
      <p>With <b>4.3 Google Rating, 60+ Active Sites, 150+ Trained Officers</b> and 24/7 Control Room <b>0754 139726</b>, we are one of the fastest growing security companies in Kampala, Wakiso, Mukono and Entebbe corridor.</p>
    </div>
    <div className="about-grid">
      <div className="card about-card"><h3>Our Mission</h3><p>To provide <b>professional, affordable, and reliable security solutions</b> to homes, businesses, construction sites, schools, hotels and events.</p></div>
      <div className="card about-card gold"><h3>Our Vision</h3><p>To be <b>Uganda's most trusted and most respected security company by 2030</b>.</p></div>
      <div className="card about-card dark-card"><h3>Core Values</h3><ul className="about-list"><li><b>D</b> - Discipline</li><li><b>I</b> - Integrity</li><li><b>S</b> - Service</li><li><b>C</b> - Courage</li><li><b>P</b> - Professionalism</li></ul></div>
    </div>
  </div>
)

const Services = () => {
  const [open,setOpen]=useState(null);
  const list=[
    {n:"1. Security Guard Service", short:"Armed & Unarmed guards for homes, shops, offices", full:["We deploy disciplined guards with uniform, ID, radio.", "Includes supervisor visits 3x a week, free replacement, monthly report."]},
    {n:"2. Construction Site Security", short:"Special guards for building sites", full:["Check materials in/out, store management, night torch patrol."]},
    {n:"3. CCTV Installation & Monitoring", short:"4 cameras from 2.5M with phone viewing", full:["DVR, 4 HD cameras, 1TB HDD, cables. Hikvision, Dahua - 2 years warranty."]},
    {n:"4. Mobile Patrol & Rapid Response", short:"Our car patrols your area every 2 hours", full:["3 visits day, 3 visits night. Random timing, 10-min rapid response."]},
    {n:"5. Event Security & Bouncers", short:"Weddings, concerts, conferences", full:["Crowd control, gate, VIP protection, parking control."]},
    {n:"6. Alarm Systems & Electric Fences", short:"Intruder alarm and electric fence", full:["Magnetic sensors, motion, loud siren + call to your phone + control room."]},
  ];
  return (
    <div className="section"><h2>Our Services - Click + to Expand</h2>
      {list.map((s,i)=><div key={i} className="service-box"><div className="service-head" onClick={()=>setOpen(open===i?null:i)}><div><strong>{s.n}</strong><p className="service-short">{s.short}</p></div><span className="expand-btn">{open===i?'Close -':'Open +'}</span></div>{open===i&&<div className="service-body">{s.full.map((p,k)=><p key={k}>- {p}</p>)}</div>}</div>)}
    </div>
  )
}

const Blog = () => (
  <div className="section">
    <div className="memo">
      <div className="memo-head">
        <h2 style={{border:'none', marginBottom:'5px'}}>INTERNAL MEMO - PINNACLE SECURITY LTD</h2>
        <p><b>From:</b> HR Manager | <b>Date:</b> {new Date().toLocaleDateString()} | <b>Ref:</b> PSL/HR/2026/08</p>
        <p><b>Subject: URGENT RECRUITMENT - SITE INCHARGE, SUPERVISOR & GENERAL GUARDS</b></p>
      </div>
      <div className="memo-body">
        <p>Management has approved recruitment. Applications are <b>FREE, No Fees</b>. Training is <b>2 weeks FREE at Muyenga HQ</b>.</p>
        <div className="job-card"><h3>POSITION 1: SITE INCHARGE</h3><ul><li>UCE + 3yrs experience</li><li>Age 25-45, physically fit</li><li>No criminal record</li></ul></div>
        <div className="job-card gold"><h3>POSITION 2: SUPERVISOR</h3><ul><li>UACE + Rider Permit Class A</li><li>3+ Years supervisor experience</li><li>Smartphone for reports</li></ul></div>
        <div className="general-recruit"><h3>GENERAL RECRUITMENT: SECURITY OFFICER</h3><p>P7/UCE, Age 22-45, No crime, Training FREE.</p><Link to="/join" className="big-recruit-btn"> APPLY NOW FOR GENERAL RECRUITMENT - FREE</Link></div>
      </div>
    </div>
  </div>
)

const Contact = () => {
  const [f,setF]=useState({fullName:"",email:"",phone:"",service:"",message:""}); const [s,setS]=useState("");
  const send=async(e)=>{ e.preventDefault(); setS("Submitting..."); try{ const r=await fetch(`${API_URL}/api/contact`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(f)}); if(r.ok){ setS("Submitted!"); setF({fullName:"",email:"",phone:"",service:"",message:""}) } else setS("Error"); }catch{ setS("Error") } };
  return (
    <div className="section"><h2>Contact Us</h2>
      <div className="form-2col">
        <div className="form-left-info"><div className="card"><h3>Visit Us</h3><p>Plot 442 & 443 Masajjagere, Off Kironde Road, Muyenga Hill, Kampala.<br/>0754 139726<br/>hr@pinnaclegroup.co.ug</p></div></div>
        <form className="form-big" onSubmit={send}>
          <div className="two-col"><input value={f.fullName} onChange={e=>setF({...f,fullName:e.target.value})} required placeholder="Enter your fullname"/><input value={f.phone} onChange={e=>setF({...f,phone:e.target.value})} required placeholder="Enter your phone number"/></div>
          <div className="two-col"><input type="email" value={f.email} onChange={e=>setF({...f,email:e.target.value})} required placeholder="Enter your email"/><select value={f.service} onChange={e=>setF({...f,service:e.target.value})} required><option value="">Choose Service</option><option>Security Guard Service</option><option>Construction Security</option><option>CCTV Installation</option><option>Mobile Patrol</option><option>Event Security</option><option>Alarm System</option></select></div>
          <textarea rows="5" value={f.message} onChange={e=>setF({...f,message:e.target.value})} required placeholder="Message / Location"></textarea>
          <button className="big-btn">Submit</button>{s&&<p className="msg">{s}</p>}
        </form>
      </div>
    </div>
  )
}

const Join = () => {
  const [f,setF]=useState({fullName:"",phone:"",email:"",education:"",experience:"",interest:"",position:"SITE INCHARGE",district:""}); const [s,setS]=useState("");
  const send=async(e)=>{ e.preventDefault(); setS("Submitting..."); try{ const r=await fetch(`${API_URL}/api/applicants`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...f, full_name:f.fullName})}); if(r.ok){ setS("Submitted!"); setF({fullName:"",phone:"",email:"",education:"",experience:"",interest:"",position:"SITE INCHARGE",district:""}) } else setS("Error") }catch{ setS("Error") } };
  return (
    <div className="section"><h2>Apply Now - Free Training - No Fees</h2>
      <form className="form-big" onSubmit={send}>
        <div className="two-col"><div><label>Full Name *</label><input value={f.fullName} onChange={e=>setF({...f,fullName:e.target.value})} required placeholder="Enter your fullname"/></div><div><label>Phone *</label><input value={f.phone} onChange={e=>setF({...f,phone:e.target.value})} required placeholder="Enter your phone number"/></div></div>
        <div className="two-col"><div><label>Email *</label><input type="email" value={f.email} onChange={e=>setF({...f,email:e.target.value})} required placeholder="Enter your email"/></div><div><label>Education *</label><select value={f.education} onChange={e=>setF({...f,education:e.target.value})} required><option value="">Choose Education</option><option>P7</option><option>UCE</option><option>UACE</option><option>Diploma</option><option>Degree</option></select></div></div>
        <div className="two-col"><div><label>Position *</label><select value={f.position} onChange={e=>setF({...f,position:e.target.value})} required><option>SITE INCHARGE</option><option>SUPERVISOR</option><option>SECURITY OFFICER - General</option></select></div><div><label>District *</label><input value={f.district} onChange={e=>setF({...f,district:e.target.value})} required placeholder="Enter your district"/></div></div>
        <div className="two-col"><div><label>Why Interested? *</label><input value={f.interest} onChange={e=>setF({...f,interest:e.target.value})} required placeholder="Why interested?"/></div><div><label>Experience *</label><input value={f.experience} onChange={e=>setF({...f,experience:e.target.value})} required placeholder="Years & where"/></div></div>
        <button className="big-btn">Submit</button>{s&&<p className="msg">{s}</p>}
      </form>
    </div>
  )
}

const AdminLogin = () => {
  const [pass, setPass] = useState(""); const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const login = (e) => {
    e.preventDefault();
    if (pass === ADMIN_PASSWORD) {
      localStorage.setItem("pinnacle_admin_token", pass);
      setMsg("Correct! Opening admin...");
      setTimeout(()=> navigate("/admin"), 500);
    } else { setMsg(`Wrong password.`); }
  };
  return (
    <div className="section" style={{maxWidth:'520px', margin:'60px auto'}}>
      <div className="form-big" style={{border:'3px solid #ffcc00', textAlign:'center'}}>
        <h2>Admin Login</h2><form onSubmit={login} style={{display:'flex', flexDirection:'column', gap:'15px', marginTop:'20px'}}><input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Enter Admin Password" required style={{padding:'16px'}} /><button className="big-btn">Login</button>{msg && <p className="msg">{msg}</p>}</form>
      </div>
    </div>
  )
}

const Admin = () => {
  const [contacts, setContacts] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [tab, setTab] = useState("contacts");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date_new");
  const [page, setPage] = useState(1); const perPage = 10;
  const navigate = useNavigate();
  const token = localStorage.getItem("pinnacle_admin_token");
  const load = async () => {
    try {
      const headers = {'x-admin-secret': token, 'Content-Type':'application/json'};
      const [cRes, aRes] = await Promise.all([fetch(`${API_URL}/api/contact`, {headers}), fetch(`${API_URL}/api/applicants`, {headers})]);
      if (cRes.status===401) { localStorage.removeItem("pinnacle_admin_token"); navigate("/admin-login"); return; }
      const cData = await cRes.json(); const aData = await aRes.json();
      if (Array.isArray(cData)) setContacts(cData); if (Array.isArray(aData)) setApplicants(aData);
    } catch(err){}
  }
  useEffect(()=>{ load(); },[]);
  useEffect(()=>{ setPage(1); },[tab, search, filterType, sortBy]);
  const handleDelete = async (id, type) => {
    if (!window.confirm("Delete this?")) return;
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

  const applyFilterSort = (list) => {
    let filtered = list.filter(c => {
      const q = search.toLowerCase();
      const match = (c.full_name||c.fullName||"").toLowerCase().includes(q) || (c.email||"").toLowerCase().includes(q) || (c.phone||"").toLowerCase().includes(q) || (c.service||c.education||"").toLowerCase().includes(q);
      if (filterType==="all") return match;
      return match && ((c.service||"").toLowerCase().includes(filterType.toLowerCase()) || (c.education||"").toLowerCase()===filterType.toLowerCase());
    });
    filtered.sort((a,b)=>{
      const nameA=(a.full_name||a.fullName||"").toLowerCase(); const nameB=(b.full_name||b.fullName||"").toLowerCase();
      const dateA=new Date(a.created_at||a.createdAt||0); const dateB=new Date(b.created_at||b.createdAt||0);
      if(sortBy==="az") return nameA.localeCompare(nameB);
      if(sortBy==="za") return nameB.localeCompare(nameA);
      if(sortBy==="date_new") return dateB-dateA;
      if(sortBy==="date_old") return dateA-dateB;
      if(sortBy==="small_large") return (a.id||0)-(b.id||0);
      if(sortBy==="large_small") return (b.id||0)-(a.id||0);
      return 0;
    });
    return filtered;
  }
  const filteredContacts = applyFilterSort(contacts);
  const filteredApplicants = applyFilterSort(applicants);
  const currentList = tab==="contacts"? filteredContacts : filteredApplicants;
  const totalPages = Math.ceil(currentList.length / perPage) || 1;
  const paged = currentList.slice((page-1)*perPage, page*perPage);

  return (
    <div className="admin-page">
      <div className="admin-top">
        <h2>Admin Dashboard</h2>
        <div className="stats"><span>{contacts.length} Contacts</span><span>{applicants.length} Applicants</span><span>Page {page}/{totalPages}</span></div>
        <div className="tabs">
          <button onClick={()=>setTab("contacts")} className={tab==="contacts"?"tab on":"tab"}>Contacts</button>
          <button onClick={()=>setTab("applicants")} className={tab==="applicants"?"tab on":"tab"}>Applicants</button>
          <button onClick={exportExcel} className="tab white">Export Excel</button>
          <button onClick={logout} className="tab red">Logout</button>
        </div>
      </div>
      <div className="filter-bar-visible">
        <input className="search-input-visible" placeholder="Search name, phone..." value={search} onChange={e=>setSearch(e.target.value)} />
        <select className="dropdown-filter-visible" value={filterType} onChange={e=>setFilterType(e.target.value)}><option value="all">All</option>{tab==="contacts"? (<><option>Security Guard Service</option><option>Construction Security</option><option>CCTV Installation</option><option>Mobile Patrol</option><option>Event Security</option><option>Alarm System</option></>):(<><option>P7</option><option>UCE</option><option>UACE</option><option>Diploma</option><option>Degree</option></>)}</select>
        <select className="dropdown-filter-visible" value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{background:'#e0f2fe'}}>
          <option value="date_new">Date: New → Old</option>
          <option value="date_old">Date: Old → New</option>
          <option value="az">A to Z</option>
          <option value="za">Z to A</option>
          <option value="small_large">Small to Large</option>
          <option value="large_small">Large to Small</option>
        </select>
        <div className="filter-btns"><button className="btn-yellow small" onClick={load}>Refresh</button><button className="btn-dark small" onClick={()=>setPage(p=>Math.max(1,p-1))}>Prev</button><button className="btn-dark small" onClick={()=>setPage(p=>Math.min(totalPages,p+1))}>Next</button></div>
      </div>
      <div className="mobile-cards">
        {paged.map((item,i)=>(
          <div key={item.id||i} className="m-card">
            <div className="m-head"><b>{item.full_name||item.fullName}</b><small>{new Date(item.created_at||item.createdAt||Date.now()).toLocaleString()}</small></div>
            <div className="m-line">{item.email||'-'}</div><div className="m-line">{item.phone||'-'}</div>
            <div className="m-tag"><span className="tag blue">{item.service||item.education||item.position||'General'}</span></div>
            <div className="m-msg">{(item.message||item.interest||item.experience||'').substring(0,120)}</div>
            <div className="m-actions-3"><a href={`tel:${item.phone}`} className="m-btn call">Call</a><a href={`https://wa.me/${(item.phone||'').replace(/[^0-9]/g,'')}`} target="_blank" rel="noreferrer" className="m-btn wa">WhatsApp</a><button onClick={()=>handleDelete(item.id,tab)} className="m-btn del">Delete</button></div>
          </div>
        ))}
        {paged.length===0 && <p className="no-data">No data found</p>}
      </div>
    </div>
  )
}

const ProtectedAdmin = () => {
  const token = localStorage.getItem("pinnacle_admin_token");
  if (token!== ADMIN_PASSWORD) return <Navigate to="/admin-login" replace />;
  return <Admin />;
}

// FOOTER - CENTERED + SOCIAL ICONS + SINGLE TEST LINK ONLY
const Footer = () => (
  <div className="footer-new">
    <div className="footer-inner">
      <h4>PINNACLE SECURITY LTD</h4>
      <p>Plot 442 & 443 Masajjagere, Muyenga | HR: hr@pinnaclegroup.co.ug | Control Room 24/7: 0754 139726</p>
      <a href={KOBO_LINK} target="_blank" rel="noopener noreferrer" className="footer-test-btn">Click to Attempt Online Test</a>
      <div className="footer-socials">
        <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon fb">f</a>
        <a href="https://wa.me/256754139726" target="_blank" rel="noreferrer" className="social-icon wa">W</a>
        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon ig">Ig</a>
        <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon li">in</a>
        <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon tw">X</a>
      </div>
    </div>
    <div className="footer-copy">2026 Pinnacle Security Ltd - All Rights Reserved</div>
  </div>
)

const App = () => (
  <BrowserRouter>
    <style>{`
      *{margin:0;padding:0;box-sizing:border-box} body{font-family:Arial,sans-serif; background:#f4f6f9; line-height:1.6; overflow-x:hidden; font-size:13.8px}
     .nav{background:#0a1931; padding:14px 15px; position:sticky; top:0; z-index:999}.nav-top{display:flex; justify-content:space-between; align-items:center}.logo{color:#ffcc00; font-weight:900; font-size:16px}.menu-btn{color:#fff; font-size:26px; cursor:pointer; display:none}.links{display:flex; gap:10px; align-items:center; justify-content:center; flex-wrap:wrap}.links a{color:#fff; text-decoration:none; font-size:13.8px; font-weight:700; padding:8px 10px}.btn-yellow{background:#ffcc00!important; color:#0a1931!important; padding:10px 18px!important; border-radius:25px!important; font-weight:900!important; border:none; cursor:pointer; text-decoration:none; display:inline-block; font-size:13.8px}.btn-yellow.big{padding:14px 26px!important; font-size:15px}.btn-yellow.small{padding:10px 16px!important; font-size:13px}.btn-admin{background:#1e3a8a!important; color:#ffcc00!important; border:2px solid #ffcc00!important; padding:8px 16px!important; border-radius:25px!important; font-weight:900!important; text-decoration:none; font-size:13px}.btn-dark{background:#0a1931; color:#ffcc00; border:none; padding:12px 18px; border-radius:10px; font-weight:800; cursor:pointer; font-size:13px}.btn-dark.small{padding:10px 14px}.hero{background:linear-gradient(135deg,#0a1931,#1e3a8a); color:#fff; padding:35px 15px; text-align:center; border-radius:0 0 20px 20px}.hero h1{color:#ffcc00; font-size:22px; margin-bottom:10px; line-height:1.3}.hero p{font-size:13.8px}.dots{margin:12px 0}.dot{width:10px; height:10px; background:#555; border-radius:50%; display:inline-block; margin:0 5px; cursor:pointer}.dot.on{background:#ffcc00}.section{padding:18px 12px; max-width:1250px; margin:auto}.section h2{text-align:center; color:#0a1931; border-bottom:4px solid #ffcc00; padding-bottom:8px; margin-bottom:16px; font-size:22px}.card{background:#fff; padding:18px; border-radius:14px; margin-bottom:14px; box-shadow:0 4px 12px rgba(0,0,0,0.06); border-left:5px solid #0a1931; font-size:13.8px; line-height:1.7}.card.gold{border-left-color:#ffcc00; background:#fffbeb}.card.dark{background:linear-gradient(135deg,#1e293b,#0f172a); color:#fff; border-left-color:#ffcc00}.card h3{font-size:18px; margin-bottom:10px; color:#0a1931}.card.dark h3{color:#ffcc00}
     .about-hero{background:linear-gradient(135deg,#0a1931,#1e3a8a); color:#fff; padding:22px; border-radius:16px; margin-bottom:16px; border:2px solid #ffcc00}.about-hero h3{color:#ffcc00; font-size:20px; margin-bottom:12px}.about-hero p{margin-bottom:10px; line-height:1.8; font-size:13.8px}.about-grid{display:grid; grid-template-columns:1fr; gap:14px; margin-bottom:16px}.about-card{text-align:center}.about-list{list-style:none; text-align:left; margin-top:10px}.about-list li{padding:4px 0; font-size:13.8px}
     .service-box{background:#fff; border-radius:12px; margin-bottom:10px; box-shadow:0 2px 8px rgba(0,0,0,0.05); border-left:4px solid #0a1931; overflow:hidden}.service-head{display:flex; justify-content:space-between; align-items:center; padding:14px; cursor:pointer; background:#fff}.service-short{font-size:13.8px; color:#666; margin-top:3px}.expand-btn{background:#0a1931; color:#ffcc00; padding:6px 12px; border-radius:20px; font-size:12px; font-weight:800}.service-body{background:#f8fafc; padding:14px; border-top:1px solid #e2e8f0}.service-body p{margin-bottom:8px; font-size:13.8px}
     .memo{background:#fff; border-radius:16px; padding:20px; box-shadow:0 6px 20px rgba(0,0,0,0.08); border:3px solid #0a1931}.memo-head{background:#0a1931; color:#fff; padding:16px; border-radius:12px; margin:-20px -20px 20px -20px; text-align:center}.memo-head h2{color:#ffcc00; font-size:18px}.memo-head p{font-size:13.8px; margin-top:4px}.memo-body{line-height:1.7; font-size:13.8px}.job-card{background:#f0f7ff; border-left:5px solid #1e40af; padding:16px; border-radius:12px; margin-bottom:14px}.job-card.gold{background:#fffbeb; border-left-color:#ffcc00}.job-card h3{color:#0a1931; font-size:16px; margin-bottom:8px}.job-card ul{margin-left:20px; margin-top:8px}.job-card li{font-size:13.8px; margin-bottom:4px}.general-recruit{background:linear-gradient(135deg,#0a1931,#1e3a8a); color:#fff; padding:18px; border-radius:14px; text-align:center; border:2px solid #ffcc00}.general-recruit h3{color:#ffcc00}.big-recruit-btn{display:block; background:#ffcc00; color:#0a1931; padding:16px; border-radius:12px; font-weight:900; text-decoration:none; margin-top:12px; font-size:15px}
     .form-big{max-width:900px; margin:16px auto; background:#fff; padding:22px; border-radius:16px; display:flex; flex-direction:column; gap:14px; box-shadow:0 6px 20px rgba(0,0,0,0.08)}.form-big input,.form-big select,.form-big textarea{padding:14px; border:2px solid #0a1931; border-radius:10px; font-size:13.8px; width:100%; outline:none}.form-big label{font-size:13.8px; font-weight:800; color:#0a1931; margin-bottom:4px; display:block}.two-col{display:grid; grid-template-columns:1fr 1fr; gap:14px} @media(max-width:700px){.two-col{grid-template-columns:1fr}}.form-2col{display:grid; grid-template-columns:300px 1fr; gap:16px} @media(max-width:900px){.form-2col{grid-template-columns:1fr}}.big-btn{background:#0a1931; color:#ffcc00; padding:16px; border:none; border-radius:12px; font-weight:900; cursor:pointer; font-size:15px}.msg{padding:12px; background:#d4edda; border-radius:10px; font-size:13.8px; text-align:center; font-weight:700}
     .admin-page{padding:10px; max-width:1300px; margin:auto}
     .admin-top{background:linear-gradient(135deg,#0a1931,#1e3a8a); color:#fff; padding:16px; border-radius:16px; text-align:center; margin-bottom:10px; border:2px solid #ffcc00}.admin-top h2{color:#ffcc00; border:none; margin-bottom:6px; font-size:18px}.stats{display:flex; gap:8px; justify-content:center; margin:10px 0; flex-wrap:wrap}.stats span{background:rgba(255,204,0,0.15); border:1.5px solid #ffcc00; padding:6px 12px; border-radius:20px; font-size:13.8px; font-weight:800; color:#ffcc00}.tabs{display:flex; gap:8px; justify-content:center; margin-top:10px; flex-wrap:wrap}.tab{padding:8px 16px; border-radius:20px; border:1.5px solid #ffcc00; background:transparent; color:#ffcc00; font-weight:800; font-size:12px; cursor:pointer}.tab.on{background:#ffcc00; color:#0a1931}.tab.white{background:#fff; color:#0a1931}.tab.red{border-color:#ff4444; color:#ff4444}
     .filter-bar-visible{display:flex; gap:8px; margin-bottom:12px; background:#ffffff; padding:14px; border-radius:14px; flex-wrap:wrap; align-items:center; border:3px solid #0a1931; box-shadow:0 4px 12px rgba(0,0,0,0.1)}.search-input-visible{flex:1; padding:14px 16px; border-radius:10px; border:3px solid #0a1931; font-size:13.8px; min-width:200px; background:#ffffff; color:#0a1931; font-weight:800}.dropdown-filter-visible{padding:14px; border-radius:10px; border:3px solid #0a1931; font-size:13.8px; font-weight:800; background:#fffbeb; min-width:150px; color:#0a1931}.filter-btns{display:flex; gap:6px; flex-wrap:wrap}
     .mobile-cards{display:flex; flex-direction:column; gap:10px}.m-card{background:#fff; border-radius:12px; padding:14px; box-shadow:0 2px 10px rgba(0,0,0,0.07); border-left:4px solid #ffcc00; border-top:2px solid #0a1931; border-right:2px solid #0a1931; border-bottom:2px solid #0a1931}.m-head{display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:4px}.m-head b{font-size:13.8px; color:#0a1931}.m-head small{font-size:10px; color:#0a1931; background:#ffcc00; padding:4px 8px; border-radius:10px; font-weight:800}.m-line{font-size:13.8px; color:#334155; margin:2px 0; word-break:break-all}.m-tag{margin:6px 0}.m-msg{font-size:13.8px; color:#475569; background:#f8fafc; padding:8px; border-radius:8px; margin:6px 0; border:1px solid #cbd5e1}.m-actions-3{display:grid; grid-template-columns:1fr 1fr 0.8fr; gap:6px; margin-top:8px}.m-btn{text-align:center; padding:10px 8px; border-radius:8px; font-size:13.8px; font-weight:800; text-decoration:none; border:none; cursor:pointer}.m-btn.call{background:#0a1931; color:#ffcc00}.m-btn.wa{background:#22c55e; color:#fff}.m-btn.del{background:#fee2e2; color:#dc2626}
     .table-card{background:#fff; border-radius:14px; padding:12px; box-shadow:0 4px 14px rgba(0,0,0,0.06); border:3px solid #0a1931}.scroll{overflow-x:auto}.clear-table{width:100%; border-collapse:collapse; font-size:13.8px; min-width:950px}.clear-table th{background:#0a1931; color:#ffcc00; padding:14px 10px; text-align:left; border:2px solid #0a1931}.clear-table td{padding:12px 10px; border:2px solid #94a3b8; vertical-align:top}.clear-table tr:nth-child(even){background:#f8fafc}.tag{padding:4px 10px; border-radius:12px; font-size:11px; font-weight:800}.tag.blue{background:#dbeafe; color:#1e40af}.del-btn{background:#e11d48; color:#fff; border:none; padding:7px 12px; border-radius:6px; cursor:pointer; font-weight:800; font-size:12px}.no-data{text-align:center; padding:20px; color:#888}
     .desktop-only{display:none} @media(min-width:768px){.mobile-cards{display:none}.desktop-only{display:block}.about-grid{grid-template-columns:1fr 1fr 1fr}}
     .footer-new{background:#0a1931; color:#fff; margin-top:25px; border-top:4px solid #ffcc00; text-align:center}
     .footer-inner{max-width:1250px; margin:auto; padding:24px 15px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px; text-align:center}
     .footer-inner h4{color:#ffcc00; font-size:18px; letter-spacing:1px}
     .footer-inner p{font-size:13.8px; color:#cbd5e1; max-width:600px}
     .footer-test-btn{display:inline-block; margin-top:8px; background:#ffcc00; color:#0a1931; padding:13px 26px; border-radius:25px; font-weight:900; text-decoration:none; font-size:13.8px}
     .footer-socials{display:flex; gap:12px; justify-content:center; align-items:center; margin-top:10px}
     .social-icon{width:44px; height:44px; border-radius:50%; display:flex; align-items:center; justify-content:center; text-decoration:none; font-weight:900; font-size:14px; color:#fff}
     .social-icon.fb{background:#1877f2}.social-icon.wa{background:#25d366}.social-icon.ig{background:linear-gradient(45deg,#feda75,#fa7e1e,#d62976,#962fbf,#4f5bd5)}.social-icon.li{background:#0a66c2}.social-icon.tw{background:#000}
     .footer-copy{text-align:center; font-size:13.8px; color:#94a3b8; padding:14px; border-top:1px solid rgba(255,255,255,0.1)}
      @media(max-width:850px){.menu-btn{display:block}.links{display:none; flex-direction:column; align-items:flex-start; padding-top:12px}.links.show{display:flex}}
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