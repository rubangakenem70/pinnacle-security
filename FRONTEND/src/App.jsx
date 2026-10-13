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
      <p>Located at <b>Plot 442 & 443 Masajjagere, Off Kironde Road, Muyenga Hill, Kampala - Uganda</b>, Pinnacle Security Limited is a fully licensed Private Security Organization.</p>
      <p>With <b>4.3 Google Rating, 60+ Active Sites, 150+ Trained Officers</b> and 24/7 Control Room <b>0754 139726</b>.</p>
    </div>
  </div>
)

const Services = () => {
  const [open,setOpen]=useState(null);
  const list=[
    {n:"1. Security Guard Service", short:"Armed & Unarmed guards", full:["Disciplined guards with uniform, ID, radio.", "Supervisor visits 3x week."]},
    {n:"2. Construction Site Security", short:"Special guards for building sites", full:["Check materials in/out, store management."]},
    {n:"3. CCTV Installation", short:"4 cameras from 2.5M", full:["DVR, 4 HD cameras, 1TB HDD."]},
    {n:"4. Mobile Patrol", short:"Car patrols every 2 hours", full:["3 visits day, 3 night."]},
    {n:"5. Event Security", short:"Weddings, concerts", full:["Crowd control, VIP protection."]},
    {n:"6. Alarm Systems", short:"Intruder alarm", full:["Sensors, siren + phone call."]},
  ];
  return (
    <div className="section"><h2>Our Services</h2>
      {list.map((s,i)=><div key={i} className="service-box"><div className="service-head" onClick={()=>setOpen(open===i?null:i)}><div><strong>{s.n}</strong><p className="service-short">{s.short}</p></div><span className="expand-btn">{open===i?'Close':'Open +'}</span></div>{open===i&&<div className="service-body">{s.full.map((p,k)=><p key={k}>- {p}</p>)}</div>}</div>)}
    </div>
  )
}

const Blog = () => (
  <div className="section">
    <div className="memo">
      <div className="memo-head">
        <h2 style={{border:'none', marginBottom:'5px'}}>INTERNAL MEMO - PINNACLE SECURITY LTD</h2>
        <p><b>From:</b> HR Manager | <b>Date:</b> {new Date().toLocaleDateString()}</p>
      </div>
      <div className="memo-body">
        <div className="job-card"><h3>POSITION 1: SITE INCHARGE</h3><ul><li>UCE + 3yrs experience</li></ul></div>
        <div className="job-card gold"><h3>POSITION 2: SUPERVISOR</h3><ul><li>UACE + Rider Permit</li></ul></div>
        <div className="general-recruit"><h3>GENERAL RECRUITMENT</h3><Link to="/join" className="big-recruit-btn">APPLY NOW FREE</Link></div>
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
        <div className="form-left-info"><div className="card"><h3>Visit Us</h3><p>Plot 442 & 443 Masajjagere, Muyenga<br/>0754 139726<br/>hr@pinnaclegroup.co.ug</p></div></div>
        <form className="form-big" onSubmit={send}>
          <div className="two-col"><input value={f.fullName} onChange={e=>setF({...f,fullName:e.target.value})} required placeholder="Fullname"/><input value={f.phone} onChange={e=>setF({...f,phone:e.target.value})} required placeholder="Phone"/></div>
          <div className="two-col"><input type="email" value={f.email} onChange={e=>setF({...f,email:e.target.value})} required placeholder="Email"/><select value={f.service} onChange={e=>setF({...f,service:e.target.value})} required><option value="">Choose Service</option><option>Security Guard Service</option><option>Construction Security</option><option>CCTV Installation</option><option>Mobile Patrol</option><option>Event Security</option><option>Alarm System</option></select></div>
          <textarea rows="5" value={f.message} onChange={e=>setF({...f,message:e.target.value})} required placeholder="Message"></textarea>
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
    <div className="section"><h2>Apply Now - Free Training</h2>
      <form className="form-big" onSubmit={send}>
        <div className="two-col"><div><label>Full Name *</label><input value={f.fullName} onChange={e=>setF({...f,fullName:e.target.value})} required placeholder="Fullname"/></div><div><label>Phone *</label><input value={f.phone} onChange={e=>setF({...f,phone:e.target.value})} required placeholder="Phone"/></div></div>
        <div className="two-col"><div><label>Email *</label><input type="email" value={f.email} onChange={e=>setF({...f,email:e.target.value})} required placeholder="Email"/></div><div><label>Education *</label><select value={f.education} onChange={e=>setF({...f,education:e.target.value})} required><option value="">Choose</option><option>P7</option><option>UCE</option><option>UACE</option><option>Diploma</option><option>Degree</option></select></div></div>
        <div className="two-col"><div><label>Position *</label><select value={f.position} onChange={e=>setF({...f,position:e.target.value})} required><option>SITE INCHARGE</option><option>SUPERVISOR</option><option>SECURITY OFFICER - General</option></select></div><div><label>District *</label><input value={f.district} onChange={e=>setF({...f,district:e.target.value})} required placeholder="District"/></div></div>
        <div className="two-col"><div><label>Why Interested? *</label><input value={f.interest} onChange={e=>setF({...f,interest:e.target.value})} required placeholder="Why?"/></div><div><label>Experience *</label><input value={f.experience} onChange={e=>setF({...f,experience:e.target.value})} required placeholder="Experience"/></div></div>
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
    <div style={{padding:'0', margin:'0'}}>
      <div className="admin-top">
        <h2>Admin - {contacts.length} Contacts | {applicants.length} Applicants</h2>
        <div className="tabs">
          <button onClick={()=>setTab("contacts")} className={tab==="contacts"?"tab on":"tab"}>Contacts ({contacts.length})</button>
          <button onClick={()=>setTab("applicants")} className={tab==="applicants"?"tab on":"tab"}>Applicants ({applicants.length})</button>
          <button onClick={exportExcel} className="tab white">Export CSV</button>
          <button onClick={load} className="tab">Refresh</button>
          <button onClick={logout} className="tab red">Logout</button>
        </div>
      </div>
      <div style={{display:'flex', flexDirection:'column', gap:'10px', padding:'10px'}}>
        {list.map((item,i)=>(
          <div key={item.id||i} className="m-card">
            <div className="m-head"><b>{item.full_name||item.fullName||'No Name'}</b><small>ID:{item.id} | {new Date(item.created_at||item.createdAt||Date.now()).toLocaleString()}</small></div>
            <div className="m-line"><b>Email:</b> {item.email||'-'}</div>
            <div className="m-line"><b>Phone:</b> {item.phone||'-'}</div>
            <div className="m-line"><b>Info:</b> {item.service||item.education||item.position||'-'} | {item.district||''}</div>
            <div className="m-msg">{item.message||item.interest||item.experience||'No message'}</div>
            <div className="m-actions-3"><a href={`tel:${item.phone}`} className="m-btn call">Call</a><a href={`https://wa.me/${(item.phone||'').replace(/[^0-9]/g,'')}`} target="_blank" rel="noreferrer" className="m-btn wa">WhatsApp</a><button onClick={()=>handleDelete(item.id,tab)} className="m-btn del">Delete</button></div>
          </div>
        ))}
        {list.length===0 && <div className="card" style={{textAlign:'center', margin:'10px'}}>No {tab} found — Click Refresh</div>}
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
      body{font-family:'Inter', system-ui, sans-serif; background:#f4f6f9; line-height:1.75; overflow-x:hidden; font-size:15.5px; color:#1e293b; letter-spacing:0.15px}
      h1,h2,h3,h4,.logo{font-family:'Poppins','Inter', sans-serif; line-height:1.3; letter-spacing:-0.3px}
     .nav{background:#0a1931; padding:16px 18px; position:sticky; top:0; z-index:999}.nav-top{display:flex; justify-content:space-between; align-items:center}.logo{color:#ffcc00; font-weight:800; font-size:17px}.menu-btn{color:#fff; font-size:26px; cursor:pointer; display:none}.links{display:flex; gap:12px; align-items:center; justify-content:center; flex-wrap:wrap}.links a{color:#e2e8f0; text-decoration:none; font-size:14.5px; font-weight:600; padding:8px 12px}.btn-yellow{background:#ffcc00!important; color:#0a1931!important; padding:10px 20px!important; border-radius:25px!important; font-weight:800!important; border:none; cursor:pointer; text-decoration:none; display:inline-block; font-size:14.5px}.btn-yellow.big{padding:14px 28px!important; font-size:16px}.btn-admin{background:transparent!important; color:#ffcc00!important; border:2px solid #ffcc00!important; padding:8px 18px!important; border-radius:25px!important; font-weight:800!important; text-decoration:none; font-size:13px}.btn-dark{background:#0a1931; color:#ffcc00; border:none; padding:12px 18px; border-radius:10px; font-weight:700; cursor:pointer; font-size:13.5px}
     .hero{background:linear-gradient(135deg,#0a1931 0%,#1e3a8a 100%); color:#fff; padding:45px 18px; text-align:center; border-radius:0 0 24px 24px}.hero h1{color:#ffcc00; font-size:26px; margin-bottom:12px; font-weight:800}.hero p{font-size:15.5px; color:#cbd5e1}.dots{margin:16px 0}.dot{width:10px; height:10px; background:#475569; border-radius:50%; display:inline-block; margin:0 5px; cursor:pointer}.dot.on{background:#ffcc00; transform:scale(1.3)}
     .section{padding:22px 14px; max-width:1250px; margin:auto}.section h2{text-align:center; color:#0a1931; border-bottom:4px solid #ffcc00; padding-bottom:10px; margin-bottom:20px; font-size:26px; font-weight:800}.card{background:#fff; padding:20px 22px; border-radius:16px; margin-bottom:16px; box-shadow:0 6px 18px rgba(0,0,0,0.06); border-left:5px solid #0a1931; font-size:15px; line-height:1.75}.card.gold{border-left-color:#ffcc00; background:#fffbeb}.card.dark{background:linear-gradient(135deg,#1e293b,#0f172a); color:#fff; border-left-color:#ffcc00}.card h3{font-size:19px; margin-bottom:10px; color:#0a1931; font-weight:700}.card.dark h3{color:#ffcc00}
     .about-hero{background:linear-gradient(135deg,#0a1931,#1e3a8a); color:#fff; padding:26px; border-radius:18px; margin-bottom:18px; border:2px solid #ffcc00}.about-hero h3{color:#ffcc00; font-size:21px; margin-bottom:14px}
     .service-box{background:#fff; border-radius:14px; margin-bottom:12px; box-shadow:0 4px 12px rgba(0,0,0,0.05); border-left:4px solid #0a1931; overflow:hidden}.service-head{display:flex; justify-content:space-between; align-items:center; padding:16px; cursor:pointer}.service-short{font-size:14px; color:#64748b}.expand-btn{background:#0a1931; color:#ffcc00; padding:7px 14px; border-radius:20px; font-size:12.5px; font-weight:800}.service-body{background:#f8fafc; padding:16px; border-top:1px solid #e2e8f0}
     .memo{background:#fff; border-radius:18px; padding:22px; box-shadow:0 8px 24px rgba(0,0,0,0.08); border:3px solid #0a1931}.memo-head{background:#0a1931; color:#fff; padding:18px; border-radius:14px; margin:-22px -22px 22px -22px; text-align:center}.memo-head h2{color:#ffcc00; font-size:19px}
     .form-big{max-width:900px; margin:18px auto; background:#fff; padding:26px; border-radius:18px; display:flex; flex-direction:column; gap:16px; box-shadow:0 8px 24px rgba(0,0,0,0.08)}.form-big input,.form-big select,.form-big textarea{padding:14px 16px; border:2px solid #cbd5e1; border-radius:12px; font-size:15px; width:100%; outline:none; font-family:'Inter'}.form-big label{font-size:14px; font-weight:700; color:#0a1931; margin-bottom:5px; display:block}.two-col{display:grid; grid-template-columns:1fr 1fr; gap:16px} @media(max-width:700px){.two-col{grid-template-columns:1fr}}.form-2col{display:grid; grid-template-columns:300px 1fr; gap:18px} @media(max-width:900px){.form-2col{grid-template-columns:1fr}}.big-btn{background:#0a1931; color:#ffcc00; padding:16px; border:none; border-radius:12px; font-weight:800; cursor:pointer; font-size:16px}.msg{padding:14px; background:#d4edda; border-radius:12px; font-size:14.5px; text-align:center; font-weight:700}
     .admin-top{background:linear-gradient(135deg,#0a1931,#1e3a8a); color:#fff; padding:18px; border-radius:0; text-align:center; border-bottom:4px solid #ffcc00}.admin-top h2{color:#ffcc00; border:none; margin-bottom:8px; font-size:20px}.tabs{display:flex; gap:8px; justify-content:center; margin-top:12px; flex-wrap:wrap}.tab{padding:9px 18px; border-radius:22px; border:1.5px solid #ffcc00; background:transparent; color:#ffcc00; font-weight:700; font-size:13px; cursor:pointer}.tab.on{background:#ffcc00; color:#0a1931}.tab.white{background:#fff; color:#0a1931}.tab.red{border-color:#ff4444; color:#ff4444}
     .m-card{background:#fff; border-radius:14px; padding:16px; box-shadow:0 4px 14px rgba(0,0,0,0.07); border-left:5px solid #ffcc00; border-top:2px solid #e2e8f0; border-right:2px solid #e2e8f0; border-bottom:2px solid #e2e8f0}.m-head{display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; flex-wrap:wrap; gap:6px}.m-head b{font-size:15px; color:#0a1931; font-family:'Poppins'}.m-head small{font-size:11px; color:#0a1931; background:#ffcc00; padding:5px 10px; border-radius:12px; font-weight:800}.m-line{font-size:14.5px; color:#334155; margin:3px 0}.m-msg{font-size:14px; color:#475569; background:#f8fafc; padding:10px; border-radius:10px; margin:8px 0; border:1px solid #e2e8f0}.m-actions-3{display:grid; grid-template-columns:1fr 1fr 0.8fr; gap:8px; margin-top:10px}.m-btn{text-align:center; padding:11px 8px; border-radius:10px; font-size:14px; font-weight:700; text-decoration:none; border:none; cursor:pointer}.m-btn.call{background:#0a1931; color:#ffcc00}.m-btn.wa{background:#22c55e; color:#fff}.m-btn.del{background:#fee2e2; color:#dc2626}
     .footer-new{background:#0a1931; color:#fff; margin-top:20px; border-top:4px solid #ffcc00; text-align:center}
     .footer-inner{max-width:1250px; margin:auto; padding:32px 18px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:16px; text-align:center}
     .footer-inner h4{color:#ffcc00; font-size:19px; letter-spacing:1px; font-weight:800}
     .footer-inner p{font-size:14.5px; color:#94a3b8; max-width:650px; line-height:1.7}
     .footer-test-btn{display:inline-block; background:#ffcc00; color:#0a1931; padding:14px 28px; border-radius:30px; font-weight:800; text-decoration:none; font-size:15px}
     .footer-socials{display:flex; gap:14px; justify-content:center; align-items:center; margin-top:12px}
     .social-icon{width:46px; height:46px; border-radius:50%; display:flex; align-items:center; justify-content:center; text-decoration:none; font-weight:800; font-size:15px; color:#fff}
     .social-icon.fb{background:#1877f2}.social-icon.wa{background:#25d366}.social-icon.ig{background:linear-gradient(45deg,#feda75,#fa7e1e,#d62976,#962fbf,#4f5bd5)}.social-icon.li{background:#0a66c2}.social-icon.tw{background:#111}
     .footer-copy{text-align:center; font-size:13px; color:#64748b; padding:16px; border-top:1px solid rgba(255,255,255,0.08)}
      @media(max-width:850px){.menu-btn{display:block}.links{display:none; flex-direction:column; align-items:flex-start; padding-top:14px}.links.show{display:flex}}
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