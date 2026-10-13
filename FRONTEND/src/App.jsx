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
    {t:"WE ARE RECRUITING - JOIN US TODAY", d:"SITE INCHARGE: UCE + 3yrs | SUPERVISOR: UACE + Rider Permit + 3yrs"},
    {t:"60+ Sites | 150+ Officers | 24/7 Control Room 0754 139726", d:"hr@pinnaclegroup.co.ug | Free Training | No Fees"},
  ];
  return (<><div className="hero"><h1>{slides[i].t}</h1><p>{slides[i].d}</p><div className="dots">{[0,1,2].map(n=><span key={n} className={n===i?'dot on':'dot'} onClick={()=>setI(n)}></span>)}</div><Link to="/join" className="btn-yellow big">Apply Now - Free</Link></div>
    <div className="section"><div className="card"><h3>Who We Are - 4.3 Rated</h3><p>Pinnacle Security Ltd Plot 442 & 443 Masajjagere, Off Kironde Road Muyenga - URSB Licensed. 60+ sites, 150+ officers, Control Room 0754 139726 24/7.</p></div><div className="card gold"><h3>Core Services</h3><p>Guard Service, Construction Security, CCTV, Mobile Patrol, Event Security, Alarm & Electric Fence.</p></div><div className="card dark"><h3>URGENT RECRUITMENT - No Fees</h3><p>SITE INCHARGE: UCE + 3yrs | SUPERVISOR: UACE + Rider Permit + 3yrs. Free 2 weeks training at Muyenga.</p><Link to="/join" className="btn-yellow">Apply Now</Link></div></div></>)
}
const About = () => (
  <div className="section"><h2>About Pinnacle Security Ltd</h2><div className="about-hero"><h3>Protecting What Matters Most Since 2018</h3><p>Plot 442 & 443 Masajjagere, Off Kironde Road, Muyenga Hill, Kampala. 4.3 Rated, 60+ Sites, 150+ Officers, 0754 139726 24/7.</p></div></div>
)
const Services = () => {
  const [open,setOpen]=useState(null);
  const list=[
    {n:"1. Security Guard Service", short:"Armed & Unarmed", full:["Uniform, ID, radio, supervisor 3x week."]},
    {n:"2. Construction Security", short:"Building sites", full:["Material check in/out."]},
    {n:"3. CCTV Installation", short:"4 cameras 2.5M", full:["DVR, 4 HD, 1TB, phone view."]},
    {n:"4. Mobile Patrol", short:"Every 2 hours", full:["3 day, 3 night visits."]},
    {n:"5. Event Security", short:"Weddings, concerts", full:["Crowd control, VIP."]},
    {n:"6. Alarm System", short:"Intruder alarm", full:["Sensors + siren + call."]},
  ];
  return (<div className="section"><h2>Our Services</h2>{list.map((s,i)=><div key={i} className="service-box"><div className="service-head" onClick={()=>setOpen(open===i?null:i)}><div><strong>{s.n}</strong><p className="service-short">{s.short}</p></div><span className="expand-btn">{open===i?'Close':'Open +'}</span></div>{open===i&&<div className="service-body">{s.full.map((p,k)=><p key={k}>- {p}</p>)}</div>}</div>)}</div>)
}
const Blog = () => (
  <div className="section"><div className="memo"><div className="memo-head"><h2 style={{border:'none'}}>INTERNAL MEMO - PINNACLE SECURITY LTD</h2><p>HR Manager | {new Date().toLocaleDateString()}</p></div><div className="memo-body"><div className="job-card"><h3>SITE INCHARGE - UCE + 3yrs</h3></div><div className="job-card gold"><h3>SUPERVISOR - UACE + Rider Permit</h3></div><div className="general-recruit"><h3>GENERAL RECRUITMENT</h3><Link to="/join" className="big-recruit-btn">APPLY NOW FREE</Link></div></div></div></div>
)
const Contact = () => {
  const [f,setF]=useState({fullName:"",email:"",phone:"",service:"",message:""}); const [s,setS]=useState("");
  const send=async(e)=>{ e.preventDefault(); setS("Submitting..."); try{ const r=await fetch(`${API_URL}/api/contact`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(f)}); if(r.ok){ setS("Submitted!"); setF({fullName:"",email:"",phone:"",service:"",message:""}) } else setS("Error"); }catch{ setS("Error") } };
  return (<div className="section"><h2>Contact Us</h2><div className="form-2col"><div className="card"><h3>Visit Us</h3><p>Plot 442 & 443 Muyenga<br/>0754 139726<br/>hr@pinnaclegroup.co.ug</p></div><form className="form-big" onSubmit={send}><div className="two-col"><input value={f.fullName} onChange={e=>setF({...f,fullName:e.target.value})} required placeholder="Fullname"/><input value={f.phone} onChange={e=>setF({...f,phone:e.target.value})} required placeholder="Phone"/></div><div className="two-col"><input type="email" value={f.email} onChange={e=>setF({...f,email:e.target.value})} required placeholder="Email"/><select value={f.service} onChange={e=>setF({...f,service:e.target.value})} required><option value="">Choose Service</option><option>Security Guard Service</option><option>Construction Security</option><option>CCTV Installation</option><option>Mobile Patrol</option><option>Event Security</option><option>Alarm System</option></select></div><textarea rows="5" value={f.message} onChange={e=>setF({...f,message:e.target.value})} required placeholder="Message"></textarea><button className="big-btn">Submit</button>{s&&<p className="msg">{s}</p>}</form></div></div>)
}
const Join = () => {
  const [f,setF]=useState({fullName:"",phone:"",email:"",education:"",experience:"",interest:"",position:"SITE INCHARGE",district:""}); const [s,setS]=useState("");
  const send=async(e)=>{ e.preventDefault(); setS("Submitting..."); try{ const r=await fetch(`${API_URL}/api/applicants`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...f, full_name:f.fullName})}); if(r.ok){ setS("Submitted!"); setF({fullName:"",phone:"",email:"",education:"",experience:"",interest:"",position:"SITE INCHARGE",district:""}) } else setS("Error") }catch{ setS("Error") } };
  return (<div className="section"><h2>Apply Now</h2><form className="form-big" onSubmit={send}><div className="two-col"><div><label>Full Name *</label><input value={f.fullName} onChange={e=>setF({...f,fullName:e.target.value})} required placeholder="Fullname"/></div><div><label>Phone *</label><input value={f.phone} onChange={e=>setF({...f,phone:e.target.value})} required placeholder="Phone"/></div></div><div className="two-col"><div><label>Email *</label><input type="email" value={f.email} onChange={e=>setF({...f,email:e.target.value})} required placeholder="Email"/></div><div><label>Education *</label><select value={f.education} onChange={e=>setF({...f,education:e.target.value})} required><option value="">Choose</option><option>P7</option><option>UCE</option><option>UACE</option><option>Diploma</option><option>Degree</option></select></div></div><div className="two-col"><div><label>Position *</label><select value={f.position} onChange={e=>setF({...f,position:e.target.value})} required><option>SITE INCHARGE</option><option>SUPERVISOR</option><option>SECURITY OFFICER - General</option></select></div><div><label>District *</label><input value={f.district} onChange={e=>setF({...f,district:e.target.value})} required placeholder="District"/></div></div><button className="big-btn">Submit</button>{s&&<p className="msg">{s}</p>}</form></div>)
}
const AdminLogin = () => {
  const [pass, setPass] = useState(""); const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const login = (e) => { e.preventDefault(); if (pass === ADMIN_PASSWORD) { localStorage.setItem("pinnacle_admin_token", pass); setTimeout(()=> navigate("/admin"), 300); } else { setMsg(`Wrong password.`); } };
  return (<div className="section" style={{maxWidth:'520px', margin:'60px auto'}}><div className="form-big" style={{border:'3px solid #ffcc00', textAlign:'center'}}><h2>Admin Login</h2><form onSubmit={login} style={{display:'flex', flexDirection:'column', gap:'15px', marginTop:'20px'}}><input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Password" required style={{padding:'16px'}} /><button className="big-btn">Login</button>{msg && <p className="msg">{msg}</p>}</form></div></div>)
}

// TABLE ADMIN - NO WHITE SPACE - FULL WIDTH
const Admin = () => {
  const [contacts, setContacts] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [tab, setTab] = useState("contacts");
  const navigate = useNavigate();
  const token = localStorage.getItem("pinnacle_admin_token");
  const load = async () => {
    try {
      const headers = {'x-admin-secret': token, 'Content-Type':'application/json'};
      const [cRes, aRes] = await Promise.all([fetch(`${API_URL}/api/contact`, {headers}), fetch(`${API_URL}/api/applicants`, {headers})]);
      if (cRes.status===401) { localStorage.removeItem("pinnacle_admin_token"); navigate("/admin-login"); return; }
      const cData = await cRes.json(); const aData = await aRes.json();
      if (Array.isArray(cData)) setContacts(cData);
      if (Array.isArray(aData)) setApplicants(aData);
    } catch(err){}
  }
  useEffect(()=>{ load(); },[]);
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
  const list = tab==="contacts"? contacts : applicants;

  return (
    <div className="admin-full">
      <div className="admin-top-full">
        <h2>Admin - {contacts.length} Contacts | {applicants.length} Applicants</h2>
        <div className="tabs">
          <button onClick={()=>setTab("contacts")} className={tab==="contacts"?"tab on":"tab"}>Contacts ({contacts.length})</button>
          <button onClick={()=>setTab("applicants")} className={tab==="applicants"?"tab on":"tab"}>Applicants ({applicants.length})</button>
          <button onClick={exportExcel} className="tab white">Export CSV</button>
          <button onClick={load} className="tab">Refresh</button>
          <button onClick={logout} className="tab red">Logout</button>
        </div>
      </div>

      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>{tab==='contacts'?'Service':'Education / Position'}</th>
              <th>Message</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item)=>(
              <tr key={item.id}>
                <td><b>{item.full_name||item.fullName}</b></td>
                <td>{item.email||'-'}</td>
                <td>{item.phone||'-'}</td>
                <td>{item.service||item.education||item.position||'-'}</td>
                <td className="msg-cell">{item.message||item.interest||item.experience||item.district||'-'}</td>
                <td>{new Date(item.created_at||item.createdAt||Date.now()).toLocaleDateString()}</td>
                <td>
                  <div className="row-actions">
                    <a href={`tel:${item.phone}`} className="mini-btn call">Call</a>
                    <a href={`https://wa.me/${(item.phone||'').replace(/[^0-9]/g,'')}`} target="_blank" rel="noreferrer" className="mini-btn wa">WA</a>
                    <button onClick={()=>handleDelete(item.id,tab)} className="mini-btn del">X</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length===0 && <div style={{textAlign:'center', padding:'20px'}}>No {tab} found</div>}
      </div>
    </div>
  )
}

const ProtectedAdmin = () => {
  const token = localStorage.getItem("pinnacle_admin_token");
  if (token!== ADMIN_PASSWORD) return <Navigate to="/admin-login" replace />;
  return <Admin />;
}

const Footer = () => (
  <div className="footer-new">
    <div className="footer-inner">
      <h4>PINNACLE SECURITY LTD</h4>
      <p>Plot 442 & 443 Masajjagere, Muyenga | hr@pinnaclegroup.co.ug | 0754 139726</p>
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
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@600;700;800&display=swap');
      *{margin:0;padding:0;box-sizing:border-box}
      html,body{width:100%; overflow-x:hidden; background:#f4f6f9}
      body{font-family:'Inter', sans-serif; font-size:15px; line-height:1.7; color:#1e293b}
      h1,h2,h3,h4,.logo{font-family:'Poppins', sans-serif; line-height:1.3}
     .nav{background:#0a1931; padding:14px 16px; position:sticky; top:0; z-index:999; width:100%}.nav-top{display:flex; justify-content:space-between; align-items:center}.logo{color:#ffcc00; font-weight:800; font-size:16px}.menu-btn{color:#fff; font-size:26px; cursor:pointer; display:none}.links{display:flex; gap:10px; align-items:center; justify-content:center; flex-wrap:wrap}.links a{color:#e2e8f0; text-decoration:none; font-size:14px; font-weight:600; padding:8px 10px}.btn-yellow{background:#ffcc00!important; color:#0a1931!important; padding:9px 18px!important; border-radius:25px!important; font-weight:800!important; text-decoration:none}.btn-yellow.big{padding:13px 26px!important; font-size:15px}.btn-admin{border:2px solid #ffcc00!important; color:#ffcc00!important; padding:7px 16px!important; border-radius:25px!important; font-weight:800!important; text-decoration:none; font-size:12px}
     .hero{background:linear-gradient(135deg,#0a1931 0%,#1e3a8a 100%); color:#fff; padding:40px 16px; text-align:center; width:100%}.hero h1{color:#ffcc00; font-size:24px; margin-bottom:10px; font-weight:800}.hero p{font-size:14px; color:#cbd5e1}.dots{margin:14px 0}.dot{width:9px; height:9px; background:#475569; border-radius:50%; display:inline-block; margin:0 4px; cursor:pointer}.dot.on{background:#ffcc00}
     .section{padding:18px 14px; max-width:1250px; margin:auto; width:100%}.section h2{text-align:center; color:#0a1931; border-bottom:4px solid #ffcc00; padding-bottom:8px; margin-bottom:16px; font-size:22px; font-weight:800}.card{background:#fff; padding:18px; border-radius:14px; margin-bottom:12px; box-shadow:0 4px 12px rgba(0,0,0,0.05); border-left:4px solid #0a1931}.card.gold{border-left-color:#ffcc00; background:#fffbeb}.card.dark{background:linear-gradient(135deg,#1e293b,#0f172a); color:#fff; border-left-color:#ffcc00}.card h3{font-size:17px; margin-bottom:8px}
     .about-hero{background:linear-gradient(135deg,#0a1931,#1e3a8a); color:#fff; padding:22px; border-radius:14px; margin-bottom:14px; border:2px solid #ffcc00}.service-box{background:#fff; border-radius:12px; margin-bottom:10px; box-shadow:0 3px 10px rgba(0,0,0,0.04); border-left:4px solid #0a1931}.service-head{display:flex; justify-content:space-between; align-items:center; padding:14px; cursor:pointer}.service-short{font-size:13px; color:#64748b}.expand-btn{background:#0a1931; color:#ffcc00; padding:6px 12px; border-radius:20px; font-size:11px; font-weight:800}.service-body{background:#f8fafc; padding:12px; border-top:1px solid #e2e8f0}
     .memo{background:#fff; border-radius:14px; padding:18px; border:2px solid #0a1931}.memo-head{background:#0a1931; color:#fff; padding:16px; border-radius:12px; margin:-18px -18px 16px -18px; text-align:center}.form-big{max-width:900px; margin:14px auto; background:#fff; padding:22px; border-radius:14px; display:flex; flex-direction:column; gap:14px; box-shadow:0 4px 12px rgba(0,0,0,0.06)}.form-big input,.form-big select,.form-big textarea{padding:12px 14px; border:2px solid #cbd5e1; border-radius:10px; font-size:14px; width:100%; font-family:'Inter'}.form-big label{font-size:13px; font-weight:700; color:#0a1931; margin-bottom:4px; display:block}.two-col{display:grid; grid-template-columns:1fr 1fr; gap:12px} @media(max-width:700px){.two-col{grid-template-columns:1fr}}.form-2col{display:grid; grid-template-columns:280px 1fr; gap:14px} @media(max-width:900px){.form-2col{grid-template-columns:1fr}}.big-btn{background:#0a1931; color:#ffcc00; padding:14px; border:none; border-radius:10px; font-weight:800; cursor:pointer; font-size:15px}.msg{padding:12px; background:#d4edda; border-radius:10px; font-size:13px; text-align:center; font-weight:700}

      /* ADMIN FULL WIDTH - NO WHITE SPACE */
     .admin-full{width:100vw; margin-left:calc(-50vw + 50%); margin-right:calc(-50vw + 50%); background:#ffffff; min-height:70vh; padding:0}
     .admin-top-full{background:linear-gradient(135deg,#0a1931,#1e3a8a); color:#fff; padding:16px 10px; text-align:center; border-bottom:4px solid #ffcc00; width:100%; border-radius:0}.admin-top-full h2{color:#ffcc00; font-size:18px; border:none; margin-bottom:10px}
     .tabs{display:flex; gap:6px; justify-content:center; flex-wrap:wrap}.tab{padding:8px 14px; border-radius:20px; border:1.5px solid #ffcc00; background:transparent; color:#ffcc00; font-weight:700; font-size:12px; cursor:pointer}.tab.on{background:#ffcc00; color:#0a1931}.tab.white{background:#fff; color:#0a1931}.tab.red{border-color:#ff4444; color:#ff4444}
     .table-wrap{width:100%; overflow-x:auto; background:#fff; -webkit-overflow-scrolling:touch}
     .admin-table{width:100%; border-collapse:collapse; min-width:850px; font-size:13.5px}
     .admin-table th{background:#0a1931; color:#ffcc00; padding:12px 8px; text-align:left; font-weight:800; font-size:12.5px; text-transform:uppercase; letter-spacing:0.5px; position:sticky; top:0; white-space:nowrap}
     .admin-table td{padding:10px 8px; border-bottom:1px solid #e2e8f0; vertical-align:top; max-width:250px; word-wrap:break-word; white-space:normal}
     .admin-table tr:hover{background:#f8fafc}
     .admin-table tr:nth-child(even){background:#fffbeb}
     .msg-cell{max-width:220px; font-size:12.5px; color:#334155}
     .row-actions{display:flex; gap:4px}
     .mini-btn{padding:6px 10px; border-radius:8px; font-size:11px; font-weight:800; text-decoration:none; border:none; cursor:pointer}
     .mini-btn.call{background:#0a1931; color:#ffcc00}
     .mini-btn.wa{background:#22c55e; color:#fff}
     .mini-btn.del{background:#fee2e2; color:#dc2626}

     .footer-new{background:#0a1931; color:#fff; width:100vw; margin-left:calc(-50vw + 50%); border-top:4px solid #ffcc00; text-align:center; margin-top:0}
     .footer-inner{max-width:1250px; margin:auto; padding:28px 16px; display:flex; flex-direction:column; align-items:center; gap:14px; text-align:center}
     .footer-inner h4{color:#ffcc00; font-size:18px; font-weight:800}.footer-inner p{font-size:13.5px; color:#94a3b8; line-height:1.6}
     .footer-test-btn{background:#ffcc00; color:#0a1931; padding:12px 24px; border-radius:30px; font-weight:800; text-decoration:none; font-size:14px}
     .footer-socials{display:flex; gap:12px; justify-content:center; margin-top:10px}
     .social-icon{width:42px; height:42px; border-radius:50%; display:flex; align-items:center; justify-content:center; text-decoration:none; font-weight:800; font-size:13px; color:#fff}
     .social-icon.fb{background:#1877f2}.social-icon.wa{background:#25d366}.social-icon.ig{background:linear-gradient(45deg,#feda75,#fa7e1e,#d62976,#962fbf,#4f5bd5)}.social-icon.li{background:#0a66c2}.social-icon.tw{background:#111}
     .footer-copy{text-align:center; font-size:12px; color:#64748b; padding:14px; border-top:1px solid rgba(255,255,255,0.08); width:100%}
      @media(max-width:850px){.menu-btn{display:block}.links{display:none; flex-direction:column; align-items:flex-start; padding-top:12px; width:100%}.links.show{display:flex}.admin-table{min-width:700px}}
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