import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom'

const API_URL = "https://pinnacle-security-backend.vercel.app";
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbz0Fx9gSfPwPXZdi8pivw9IdQ_fzj707fPk22GBECuGYhGzwePtEPZV47TyXk8TN8bggQ/exec";

const sendToSheet = async (payload) => {
  try {
    await fetch(GOOGLE_SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify(payload)
    });
  } catch (e) {}
};

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
    <div className="section"><div className="card"><h3>Who We Are - 4.3 Rated</h3><p>Pinnacle Security Ltd Plot 442 & 443 Masajjagere, Muyenga - URSB Licensed. 60+ sites, 150+ officers, Control Room 0754 139726 24/7.</p></div><div className="card gold"><h3>Core Services</h3><p>Guard Service, Construction Security, CCTV, Mobile Patrol, Event Security, Alarm & Electric Fence.</p></div><div className="card dark"><h3>URGENT RECRUITMENT - No Fees</h3><p>SITE INCHARGE: UCE + 3yrs | SUPERVISOR: UACE + Rider Permit + 3yrs. Free 2 weeks training.</p><Link to="/join" className="btn-yellow">Apply Now</Link></div></div></>)
}

const About = () => {
  const [open,setOpen]=useState(null);
  const items=[
    {t:"Our History Since 2018", d:"Founded in 2018 in Muyenga, started with 5 guards, now 150+ officers, 60+ sites across Kampala, Wakiso, Mukono, Entebbe. Licensed by Ministry of Internal Affairs & URSB."},
    {t:"Our Mission & Vision", d:"Mission: To protect lives and property with discipline. Vision: To be Uganda's most trusted security company. Core values: Integrity, Discipline, Vigilance, Professionalism."},
    {t:"Why Choose Pinnacle? - 4.3 Google Rated", d:"4.3 Rated, 24/7 Control Room 0754 139726, Free 2 weeks training at HQ, No recruitment fees, Uniform + ID + Radio provided, Supervisor visits 3x a week, Quick replacement."},
    {t:"Our Leadership Team", d:"Managing Director + Operations Manager + HR Manager + Training Commander. All ex-servicemen with 15+ years security experience."},
    {t:"Licenses & Certificates", d:"URSB Registered, Ministry of Internal Affairs Private Security License, PSFU Member, Tax Compliant, NSSF Compliant."},
    {t:"Our Coverage Areas", d:"Kampala, Muyenga, Buziga, Kololo, Nakawa, Wakiso, Entebbe, Mukono, Industrial Area, Construction sites, Homes, Offices, Warehouses, Schools, Churches."},
  ];
  return (
    <div className="section">
      <h2>About Pinnacle Security Ltd</h2>
      <div className="about-hero">
        <h3>Protecting What Matters Most Since 2018 - Plot 442 & 443 Masajjagere, Muyenga</h3>
        <p>150+ Trained Officers | 60+ Active Sites | 4.3 Google Rating | Control Room 0754 139726 24/7 | hr@pinnaclegroup.co.ug</p>
      </div>
      {items.map((it,i)=>(
        <div key={i} className="service-box">
          <div className="service-head" onClick={()=>setOpen(open===i?null:i)}>
            <div><strong>{it.t}</strong></div><span className="expand-btn">{open===i?'Close -':'Open +'}</span>
          </div>
          {open===i && <div className="service-body"><p>{it.d}</p></div>}
        </div>
      ))}
    </div>
  )
}

const Services = () => {
  const [open,setOpen]=useState(null);
  const list=[
    {n:"1. Security Guard Service", short:"Armed & Unarmed", full:["Disciplined guards, uniform, ID, radio, baton, torch. Supervisor visits 3x week. Day & Night shift."]},
    {n:"2. Construction Site Security", short:"For building sites", full:["Material in/out check, store management, night patrol, anti-theft."]},
    {n:"3. CCTV Installation", short:"4 cameras from 2.5M", full:["DVR, 4 HD cameras, 1TB HDD, Mobile phone view, 1 year warranty."]},
    {n:"4. Mobile Patrol", short:"Car patrols every 2 hours", full:["3 visits day, 3 night, alarm response in 15 mins."]},
    {n:"5. Event Security", short:"Weddings, concerts", full:["Crowd control, VIP protection, bouncers, parking."]},
    {n:"6. Alarm & Electric Fence", short:"Intruder alarm", full:["Sensors, siren + phone call + electric fence energizer."]},
  ];
  return (<div className="section"><h2>Our Services</h2>{list.map((s,i)=><div key={i} className="service-box"><div className="service-head" onClick={()=>setOpen(open===i?null:i)}><div><strong>{s.n}</strong><p className="service-short">{s.short}</p></div><span className="expand-btn">{open===i?'Close':'Open +'}</span></div>{open===i&&<div className="service-body">{s.full.map((p,k)=><p key={k}>- {p}</p>)}</div>}</div>)}</div>)
}

const Blog = () => {
  const [open,setOpen]=useState(0);
  const jobs=[
    {title:"SITE INCHARGE - UCE + 3 Years Experience", body:["Must have UCE certificate", "3 years experience as security guard", "Able to manage 5-10 guards", "Salary 500k-700k + allowance", "Free training 2 weeks at Muyenga"]},
    {title:"SUPERVISOR - UACE + Rider Permit + 3 Years", body:["Must have UACE certificate", "Valid rider permit", "Own motorcycle is added advantage", "3 years experience", "Salary 700k-900k + fuel allowance", "Manage 15-20 sites"]},
    {title:"SECURITY OFFICER - General Recruitment - No Fees", body:["P7, S4, S6 accepted", "18-45 years, disciplined", "No criminal record", "Free training, free uniform", "Deployment within 1 week", "Salary 250k-350k starting"]},
    {title:"CCTV TECHNICIAN - Internship Available", body:["Diploma in Electrical / IT", "Can install CCTV, alarms", "1 year experience", "Salary negotiable"]},
  ];
  return (
    <div className="section">
      <div className="memo">
        <div className="memo-head"><h2 style={{border:'none', margin:0}}>INTERNAL MEMO - RECRUITMENT 2026</h2><p>From: HR Manager | Date: {new Date().toLocaleDateString()} | Location: Plot 442 & 443 Muyenga</p></div>
        <div className="memo-body">
          {jobs.map((j,i)=>(
            <div key={i} className={`job-card ${i===1?'gold':''}`}>
              <div className="service-head" onClick={()=>setOpen(open===i?null:i)} style={{padding:0}}><h3 style={{margin:0}}>{j.title}</h3><span className="expand-btn">{open===i?'Close':'Open'}</span></div>
              {open===i && <ul style={{marginTop:'12px'}}>{j.body.map((b,k)=><li key={k}>{b}</li>)}</ul>}
            </div>
          ))}
          <div className="general-recruit"><h3>How to Apply - No Fees - No Agent</h3><p>Come to HQ Plot 442 & 443 Muyenga with CV, National ID, Academic docs. Or apply online below - FREE.</p><Link to="/join" className="big-recruit-btn">APPLY NOW FREE - ONLINE FORM</Link></div>
        </div>
      </div>
    </div>
  )
}

const Contact = () => {
  const [f,setF]=useState({fullName:"",email:"",phone:"",service:"",message:""});
  const [s,setS]=useState("");
  const send=async(e)=>{
    e.preventDefault(); setS("Submitting...");
    const payload = { type: "contact", date: new Date().toLocaleString(), fullName: f.fullName, email: f.email, phone: f.phone, service: f.service, message: f.message };
    await sendToSheet(payload);
    try{
      const r=await fetch(`${API_URL}/api/contact`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      if(r.ok) setS("✅ Saved to Admin + Sheet");
      else setS("✅ Saved to Sheet!");
      setF({fullName:"",email:"",phone:"",service:"",message:""})
    }catch{ setS("✅ Saved to Sheet!"); setF({fullName:"",email:"",phone:"",service:"",message:""}) }
  };
  const inputStyle={width:'100%',padding:'14px 16px',borderRadius:'12px',border:'2px solid #d1d5db',outline:'none',fontSize:'15px',background:'white',color:'#1e293b'};
  return (
    <div className="contact-full">
      <h2>Contact Us</h2>
      <div className="form-2col">
        <div className="card" style={{height:'fit-content'}}><h3>Visit Us</h3><p>Plot 442 & 443 Masajjagere, Off Kironde Road, Muyenga Hill, Kampala<br/>0754 139726 / 0782 000000<br/>hr@pinnaclegroup.co.ug<br/>Mon-Sat 8am-6pm</p></div>
        <form className="form-big" onSubmit={send} style={{background:'white'}}>
          <div className="two-col">
            <input style={inputStyle} value={f.fullName} onChange={e=>setF({...f,fullName:e.target.value})} required placeholder="Fullname"/>
            <input style={inputStyle} value={f.phone} onChange={e=>setF({...f,phone:e.target.value})} required placeholder="Phone e.g 0754139726"/>
          </div>
          <div className="two-col">
            <input style={inputStyle} type="email" value={f.email} onChange={e=>setF({...f,email:e.target.value})} required placeholder="Email"/>
            <select style={inputStyle} value={f.service} onChange={e=>setF({...f,service:e.target.value})} required><option value="">Choose Service</option><option>Security Guard Service</option><option>Construction Security</option><option>CCTV Installation</option><option>Mobile Patrol</option><option>Event Security</option><option>Alarm System</option></select>
          </div>
          <textarea style={{...inputStyle,minHeight:'130px',resize:'vertical'}} rows="5" value={f.message} onChange={e=>setF({...f,message:e.target.value})} required placeholder="Message - I need to..."></textarea>
          <button type="submit" style={{width:'100%',padding:'16px',borderRadius:'12px',border:'none',background:'#0a1931',color:'#ffcc00',fontWeight:'800',fontSize:'18px',cursor:'pointer'}}>Submit</button>
          {s&&<p className="msg">{s}</p>}
        </form>
      </div>
    </div>
  )
}

const Join = () => {
  const [f,setF]=useState({fullName:"",phone:"",email:"",education:"",position:"SITE INCHARGE",district:"",experience:""});
  const [s,setS]=useState("");
  const inputStyle={width:'100%',padding:'14px 16px',borderRadius:'12px',border:'2px solid #d1d5db',outline:'none',fontSize:'15px',background:'white',color:'#1e293b'};
  const send=async(e)=>{
    e.preventDefault(); setS("Submitting...");
    const payload = { type: "applicant", date: new Date().toLocaleString(), fullName: f.fullName, phone: f.phone, email: f.email, education: f.education, position: f.position, district: f.district, experience: f.experience };
    await sendToSheet(payload);
    try{
      const r=await fetch(`${API_URL}/api/applicants`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      if(r.ok) setS("✅ Saved to Admin + Sheet!");
      else setS("✅ Saved to Sheet!");
      setF({fullName:"",phone:"",email:"",education:"",position:"SITE INCHARGE",district:"",experience:""})
    }catch{ setS("✅ Saved to Sheet!") }
  };
  return (
    <div className="section"><h2>Apply Now - Free Training - No Fees</h2>
      <form className="form-big" onSubmit={send} style={{background:'white'}}>
        <div className="two-col"><div><label>Full Name *</label><input style={inputStyle} value={f.fullName} onChange={e=>setF({...f,fullName:e.target.value})} required placeholder="Fullname"/></div><div><label>Phone *</label><input style={inputStyle} value={f.phone} onChange={e=>setF({...f,phone:e.target.value})} required placeholder="0754..."/></div></div>
        <div className="two-col"><div><label>Email *</label><input style={inputStyle} type="email" value={f.email} onChange={e=>setF({...f,email:e.target.value})} required placeholder="Email"/></div><div><label>Education *</label><select style={inputStyle} value={f.education} onChange={e=>setF({...f,education:e.target.value})} required><option value="">Choose</option><option>P7</option><option>UCE</option><option>UACE</option><option>Diploma</option><option>Degree</option></select></div></div>
        <div className="two-col"><div><label>Position *</label><select style={inputStyle} value={f.position} onChange={e=>setF({...f,position:e.target.value})} required><option>SITE INCHARGE</option><option>SUPERVISOR</option><option>SECURITY OFFICER - General</option></select></div><div><label>District *</label><input style={inputStyle} value={f.district} onChange={e=>setF({...f,district:e.target.value})} required placeholder="District"/></div></div>
        <div><label>Experience *</label><input style={inputStyle} value={f.experience} onChange={e=>setF({...f,experience:e.target.value})} placeholder="e.g 3 years"/></div>
        <button style={{width:'100%',padding:'16px',borderRadius:'12px',border:'none',background:'#0a1931',color:'#ffcc00',fontWeight:'800',fontSize:'18px',cursor:'pointer'}}>Submit</button>{s&&<p className="msg">{s}</p>}
      </form>
    </div>
  )
}

const AdminLogin = () => {
  const [pass, setPass] = useState(""); const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const login = (e) => { e.preventDefault(); if (pass === ADMIN_PASSWORD) { localStorage.setItem("pinnacle_admin_token", pass); navigate("/admin"); } else { setMsg(`Wrong password.`); } };
  return (<div className="section" style={{maxWidth:'520px', margin:'60px auto'}}><div className="form-big light-form" style={{border:'3px solid #ffcc00', textAlign:'center'}}><h2>Admin Login</h2><form onSubmit={login} style={{display:'flex', flexDirection:'column', gap:'15px', marginTop:'20px'}}><input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Password" required style={{padding:'16px'}} /><button className="big-btn">Login</button>{msg && <p className="msg">{msg}</p>}</form></div></div>)
}

const Admin = () => {
  const [contacts, setContacts] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [tab, setTab] = useState("contacts");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(30);
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
  useEffect(()=>{ load(); const interval=setInterval(load, 10000); return()=>clearInterval(interval); },[]);
  useEffect(()=>{ setPage(1); }, [tab, rowsPerPage]);

  const list = tab==="contacts"? contacts : applicants;
  const totalPages = Math.max(1, Math.ceil(list.length / rowsPerPage));
  const start = (page - 1) * rowsPerPage;
  const paginated = list.slice(start, start + rowsPerPage);

  const handleDelete = async (id, type) => {
    if (!window.confirm("Delete this?")) return;
    const url = type==='contacts'? `${API_URL}/api/contact/${id}` : `${API_URL}/api/applicants/${id}`;
    await fetch(url, {method:'DELETE', headers:{'x-admin-secret': token}});
    load();
  }
  const exportExcel = () => {
    if (!list.length) return alert(`No data`);
    const headers = Object.keys(list[0]);
    const csv = [headers.join(",")].concat(list.map(r=>headers.map(h=>`"${(r[h]||'').toString().replace(/"/g,'""')}"`).join(","))).join("\n");
    const blob = new Blob([csv], {type:'text/csv'}); const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download=`pinnacle_${tab}.csv`; a.click();
  }
  const logout = () => { localStorage.removeItem("pinnacle_admin_token"); navigate("/admin-login"); }

  return (
    <div className="admin-full">
      <div className="admin-top-full">
        <h2>Admin - {contacts.length} Contacts | {applicants.length} Applicants | Sheet: 8bggQ</h2>
        <div className="tabs">
          <button onClick={()=>setTab("contacts")} className={tab==="contacts"?"tab on":"tab"}>Contacts ({contacts.length})</button>
          <button onClick={()=>setTab("applicants")} className={tab==="applicants"?"tab on":"tab"}>Applicants ({applicants.length})</button>
          <button onClick={exportExcel} className="tab white">Export Excel</button>
          <button onClick={load} className="tab">Refresh</button>
          <button onClick={logout} className="tab red">Logout</button>
        </div>
      </div>
      <div className="table-wrap">
        <table className="admin-table">
          <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>{tab==='contacts'?'Service':'Position'}</th><th>Message</th><th>Date</th><th>Action</th></tr></thead>
          <tbody>
            {paginated.map((item, idx)=>(
              <tr key={item.id}>
                <td>{start + idx + 1}</td>
                <td><b>{item.full_name||item.fullName||'-'}</b></td>
                <td>{item.email||'-'}</td>
                <td style={{color:'#0a1931', fontWeight:'800'}}>{item.phone||item.phone_number||'-'}</td>
                <td>{item.service||item.education||item.position||'-'} {item.district?`(${item.district})`:''}</td>
                <td className="msg-cell">{item.message||item.experience||'-'}</td>
                <td>{new Date(item.created_at||Date.now()).toLocaleString()}</td>
                <td><div className="row-actions"><a href={`tel:${item.phone||item.phone_number}`} className="mini-btn call">Call</a><a href={`https://wa.me/${(item.phone||'').toString().replace(/[^0-9]/g,'')}`} target="_blank" rel="noreferrer" className="mini-btn wa">WA</a><button onClick={()=>handleDelete(item.id,tab)} className="mini-btn del">X</button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length===0 && <div style={{textAlign:'center', padding:'20px'}}>No {tab} yet</div>}

        {/* LIKE YOUR SCREENSHOT - PAGE + 30 ROWS */}
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 16px', background:'#f8fafc', borderTop:'1px solid #e2e8f0'}}>
          <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
            <span style={{fontSize:'14px'}}>Page</span>
            <input type="number" value={page} min={1} max={totalPages} onChange={e=>setPage(Math.min(totalPages, Math.max(1, Number(e.target.value)||1)))} style={{width:'65px', padding:'8px', borderRadius:'8px', border:'1.5px solid #cbd5e1', textAlign:'center', fontWeight:'800'}}/>
            <span style={{fontSize:'14px'}}>of {totalPages}</span>
          </div>
          <select value={rowsPerPage} onChange={e=>setRowsPerPage(Number(e.target.value))} style={{padding:'8px 12px', borderRadius:'8px', border:'1.5px solid #cbd5e1', fontWeight:'800'}}>
            <option value={10}>10 rows</option>
            <option value={30}>30 rows</option>
            <option value={50}>50 rows</option>
            <option value={100}>100 rows</option>
          </select>
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
      html,body{width:100%; overflow-x:hidden; background:#f1f5f9; margin:0}
      body{font-family:'Inter', sans-serif; font-size:15px; line-height:1.7; color:#1e293b}
      h1,h2,h3,h4,.logo{font-family:'Poppins', sans-serif; line-height:1.3}
.nav{background:#0a1931; padding:14px 16px; position:sticky; top:0; z-index:999; width:100%}.nav-top{display:flex; justify-content:space-between; align-items:center}.logo{color:#ffcc00; font-weight:800; font-size:16px}.menu-btn{color:#fff; font-size:26px; cursor:pointer; display:none}.links{display:flex; gap:10px; align-items:center; justify-content:center; flex-wrap:wrap}.links a{color:#e2e8f0; text-decoration:none; font-size:14px; font-weight:600; padding:8px 10px}.btn-yellow{background:#ffcc00!important; color:#0a1931!important; padding:9px 18px!important; border-radius:25px!important; font-weight:800!important; text-decoration:none}.btn-yellow.big{padding:13px 26px!important; font-size:15px}.btn-admin{border:2px solid #ffcc00!important; color:#ffcc00!important; padding:7px 16px!important; border-radius:25px!important; font-weight:800!important; text-decoration:none; font-size:12px}
.hero{background:linear-gradient(135deg,#0a1931 0%,#1e3a8a 100%); color:#fff; padding:40px 16px; text-align:center; width:100%}.hero h1{color:#ffcc00; font-size:24px; margin-bottom:10px; font-weight:800}.hero p{font-size:14px; color:#cbd5e1}.dots{margin:14px 0}.dot{width:9px; height:9px; background:#475569; border-radius:50%; display:inline-block; margin:0 4px; cursor:pointer}.dot.on{background:#ffcc00}
.section{padding:18px 14px; max-width:1250px; margin:auto; width:100%}.section h2{text-align:center; color:#0a1931; border-bottom:4px solid #ffcc00; padding-bottom:8px; margin-bottom:16px; font-size:22px; font-weight:800}.card{background:#fff; padding:18px; border-radius:14px; margin-bottom:12px; box-shadow:0 4px 12px rgba(0,0,0,0.05); border-left:4px solid #0a1931}.card.gold{border-left-color:#ffcc00; background:#fffbeb}.card.dark{background:linear-gradient(135deg,#1e293b,#0f172a); color:#fff; border-left-color:#ffcc00}.card h3{font-size:17px; margin-bottom:8px}
.about-hero{background:linear-gradient(135deg,#0a1931,#1e3a8a); color:#fff; padding:22px; border-radius:14px; margin-bottom:14px; border:2px solid #ffcc00}.service-box{background:#fff; border-radius:12px; margin-bottom:10px; box-shadow:0 3px 10px rgba(0,0,0,0.04); border-left:4px solid #0a1931}.service-head{display:flex; justify-content:space-between; align-items:center; padding:14px; cursor:pointer}.service-short{font-size:13px; color:#64748b}.expand-btn{background:#0a1931; color:#ffcc00; padding:6px 12px; border-radius:20px; font-size:11px; font-weight:800}.service-body{background:#f8fafc; padding:12px; border-top:1px solid #e2e8f0}
.memo{background:#fff; border-radius:14px; padding:18px; border:2px solid #0a1931}.memo-head{background:#0a1931; color:#fff; padding:16px; border-radius:12px; margin:-18px -18px 16px -18px; text-align:center}.job-card{background:#f8fafc; border:2px solid #e2e8f0; border-radius:12px; padding:14px; margin-bottom:12px}.job-card.gold{background:#fffbeb; border-color:#ffcc00}.big-recruit-btn{background:#ffcc00; color:#0a1931; padding:14px 24px; border-radius:30px; font-weight:800; text-decoration:none; display:inline-block; margin-top:12px; text-align:center}
.contact-full{padding:0; margin:0; width:100vw; margin-left:calc(-50vw + 50%); background:#f1f5f9; padding:20px 16px 30px 16px}.contact-full h2{text-align:center; color:#0a1931; border-bottom:4px solid #ffcc00; padding-bottom:8px; margin-bottom:18px; font-size:22px; font-weight:800; max-width:1250px; margin-left:auto; margin-right:auto}
.form-big{max-width:900px; margin:14px auto; background:#fff; padding:22px; border-radius:14px; display:flex; flex-direction:column; gap:14px; box-shadow:0 4px 12px rgba(0,0,0,0.06)}.light-form input,.light-form select,.light-form textarea{background:#ffffff!important; color:#0a1931!important; border:2px solid #cbd5e1!important}.light-form input::placeholder,.light-form textarea::placeholder{color:#64748b!important}.form-big input,.form-big select,.form-big textarea{padding:12px 14px; border-radius:10px; font-size:14px; width:100%; font-family:'Inter'}.form-big label{font-size:13px; font-weight:700; color:#0a1931; margin-bottom:4px; display:block}.two-col{display:grid; grid-template-columns:1fr 1fr; gap:12px} @media(max-width:700px){.two-col{grid-template-columns:1fr}}.form-2col{display:grid; grid-template-columns:320px 1fr; gap:16px; max-width:1250px; margin:auto} @media(max-width:900px){.form-2col{grid-template-columns:1fr}}.big-btn{background:#0a1931; color:#ffcc00; padding:14px; border:none; border-radius:10px; font-weight:800; cursor:pointer; font-size:15px}.msg{padding:12px; background:#d4edda; border-radius:10px; font-size:13px; text-align:center; font-weight:700}
.admin-full{width:100vw; margin-left:calc(-50vw + 50%); margin-right:calc(-50vw + 50%); background:#ffffff; min-height:70vh; padding:0; margin-top:0; margin-bottom:0}
.admin-top-full{background:linear-gradient(135deg,#0a1931,#1e3a8a); color:#fff; padding:16px 10px; text-align:center; border-bottom:4px solid #ffcc00; width:100%}.admin-top-full h2{color:#ffcc00; font-size:16px; border:none; margin-bottom:10px}
.tabs{display:flex; gap:6px; justify-content:center; flex-wrap:wrap}.tab{padding:8px 12px; border-radius:20px; border:1.5px solid #ffcc00; background:transparent; color:#ffcc00; font-weight:700; font-size:11px; cursor:pointer}.tab.on{background:#ffcc00; color:#0a1931}.tab.white{background:#fff; color:#0a1931; border-color:#fff}.tab.red{border-color:#ff4444; color:#ff4444}
.table-wrap{width:100%; overflow-x:auto; background:#fff; -webkit-overflow-scrolling:touch}
.admin-table{width:100%; border-collapse:collapse; min-width:900px; font-size:13px}
.admin-table th{background:#0a1931; color:#ffcc00; padding:11px 8px; text-align:left; font-weight:800; font-size:11.5px; text-transform:uppercase; position:sticky; top:0; white-space:nowrap}
.admin-table td{padding:9px 8px; border-bottom:1px solid #e2e8f0; vertical-align:top; max-width:220px; word-wrap:break-word}
.admin-table tr:hover{background:#f8fafc}.admin-table tr:nth-child(even){background:#fffbeb}
.msg-cell{max-width:220px; font-size:12px; color:#334155}.row-actions{display:flex; gap:4px}.mini-btn{padding:5px 9px; border-radius:7px; font-size:10px; font-weight:800; text-decoration:none; border:none; cursor:pointer}.mini-btn.call{background:#0a1931; color:#ffcc00}.mini-btn.wa{background:#22c55e; color:#fff}.mini-btn.del{background:#fee2e2; color:#dc2626}
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