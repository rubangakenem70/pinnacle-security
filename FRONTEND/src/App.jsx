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
    <div className="about-hero">
      <h3>🛡️ Pinnacle Security Ltd - Protecting What Matters Most Since 2018</h3>
      <p>Located at <b>Plot 442 & 443 Masajjagere, Off Kironde Road, Muyenga Hill, Kampala - Uganda</b>, Pinnacle Security Limited is a fully licensed Private Security Organization registered under URSB and Ministry of Internal Affairs. We operate under <b>ISIC Code 8010 (Private Security Activities)</b> and <b>Category F (Construction & Site Security)</b>.</p>
      <p>With <b>4.3★ Google Rating, 60+ Active Sites, 150+ Trained Officers</b> and 24/7 Control Room <b>0754 139726</b>, we are one of the fastest growing security companies in Kampala, Wakiso, Mukono and Entebbe corridor.</p>
    </div>

    <div className="about-grid">
      <div className="card about-card">
        <div className="about-icon">🎯</div>
        <h3>Our Mission</h3>
        <p>To provide <b>professional, affordable, and reliable security solutions</b> to homes, businesses, construction sites, schools, hotels and events. We are committed to protecting lives, property and investments with discipline, integrity and rapid response. We promise <b>No Hidden Fees, No Exploitation, Free Training for all recruits</b>.</p>
      </div>
      <div className="card about-card gold">
        <div className="about-icon">👁️</div>
        <h3>Our Vision</h3>
        <p>To be <b>Uganda's most trusted and most respected security company by 2030</b>. A company where every client feels safe, every guard feels valued, and every site is protected with technology + manpower. We envision a Uganda where private security is professional, not casual labour.</p>
      </div>
      <div className="card about-card dark-card">
        <div className="about-icon">💎</div>
        <h3>Core Values - D.I.S.C.I.P.L.I.N.E</h3>
        <ul className="about-list">
          <li><b>D</b> - Discipline: Time keeping & uniform</li>
          <li><b>I</b> - Integrity: No theft, no bribe</li>
          <li><b>S</b> - Service: Client is king</li>
          <li><b>C</b> - Courage: Face danger bravely</li>
          <li><b>P</b> - Professionalism: Trained & licensed</li>
          <li><b>L</b> - Loyalty: To company & client</li>
          <li><b>N</b> - Neutral: No politics</li>
        </ul>
      </div>
    </div>

    <div className="card">
      <h3>📍 Why Choose Us?</h3>
      <div className="why-grid">
        <div><b>✅ Licensed:</b> URSB, ISIC 8010, Category F</div>
        <div><b>✅ 24/7 Control Room:</b> 0754 139726</div>
        <div><b>✅ 150+ Officers:</b> Vetted, trained, uniformed</div>
        <div><b>✅ 60+ Sites:</b> Proof of trust</div>
        <div><b>✅ Technology:</b> CCTV, GPS patrol, radios</div>
        <div><b>✅ No Recruitment Fee:</b> Free 2 weeks training</div>
      </div>
    </div>
  </div>
)

const Services = () => {
  const [open,setOpen]=useState(null);
  const list=[
    {n:"1. Security Guard Service (ISIC 8010)", short:"Armed & Unarmed guards for homes, shops, offices", full:["Licensed under ISIC 8010. We deploy disciplined guards with uniform, ID, radio. Duties: Gate control, patrol, visitor register, night vigilance.", "Price: Starting from 700,000 UGX per guard per month (12hrs day or night). 1.2M for 24hrs (2 guards). Includes supervisor visits 3x a week.", "Benefits: Free replacement if guard absent, monthly report, 10 min rapid response."]},
    {n:"2. Construction Site Security (Category F)", short:"Special guards for building sites - protect cement, iron bars", full:["Category F licensed for construction security. We understand construction theft: cement, D12/D16, timber, tools.", "Guards trained to check materials in/out, store management, night torch patrol, anti-trespass.", "Price: 800k-1.2M per guard. For big site we recommend 2 guards + supervisor @ 2.5M package."]},
    {n:"3. CCTV Installation & Monitoring", short:"4 cameras from 2.5M with phone viewing", full:["We supply & install: DVR, 4 HD cameras, 1TB HDD, cables, installation. You view on phone anywhere in world.", "Brands: Hikvision, Dahua - 2 years warranty. Night vision, motion alert.", "Price: 4-camera 2.5M, 8-camera 4.2M. Monitoring: 150k/month we watch for you in control room.", "Add-ons: Solar backup 600k, extra camera 450k."]},
    {n:"4. Mobile Patrol & Rapid Response - 10 Min Promise", short:"Our car patrols your area every 2 hours", full:["Best for homes without full-time guard. Our patrol car with 2 officers patrols your zone.", "Schedule: 3 visits day, 3 visits night. Random timing so thieves don't know. Check doors, windows, compound.", "Price: 200k monthly for homes, 350k for businesses. Includes 10-min rapid response if alarm.", "Coverage: Muyenga, Buziga, Munyonyo, Ggaba, Kansanga, Kabalagala."]},
    {n:"5. Event Security & Bouncers", short:"Weddings, concerts, conferences - 50k per guard per day", full:["We provide: Crowd control, gate, VIP protection, parking control, anti-theft.", "Uniform: Smart suits for corporate, t-shirts for concerts.", "Price: 50k per guard per day (8hrs). Minimum 5 guards. Supervisor free for 10+ guards.", "We handled: Church events, graduation parties, music shows."]},
    {n:"6. Alarm Systems & Electric Fences", short:"Intruder alarm from 1.8M, fence 80k per meter", full:["Alarm: Magnetic sensors on doors/windows, motion inside, loud siren + call to your phone + control room.", "Price: Alarm 1.8M (3 doors + 2 motions). Electric Fence: 80k per meter - 5 lines, energizer, battery backup, warning signs.", "Maintenance: 100k per quarter. Works on Yaka & solar."]},
  ];
  return (
    <div className="section"><h2>Our Services - ISIC 8010 & F Licensed - Click + to Expand</h2>
      {list.map((s,i)=><div key={i} className="service-box"><div className="service-head" onClick={()=>setOpen(open===i?null:i)}><div><strong>{s.n}</strong><p className="service-short">{s.short}</p></div><span className="expand-btn">{open===i?'Close −':'Open +'}</span></div>{open===i&&<div className="service-body">{s.full.map((p,k)=><p key={k}>• {p}</p>)}</div>}</div>)}
    </div>
  )
}

const Blog = () => (
  <div className="section">
    <div className="memo">
      <div className="memo-head">
        <h2 style={{border:'none', marginBottom:'5px'}}>📋 INTERNAL MEMO - PINNACLE SECURITY LTD</h2>
        <p><b>From:</b> Human Resource Manager | <b>To:</b> All Applicants | <b>Date:</b> {new Date().toLocaleDateString()} | <b>Ref:</b> PSL/HR/2026/08</p>
        <p><b>Subject: URGENT RECRUITMENT - 8 POSITIONS + GENERAL RECRUITMENT</b></p>
      </div>

      <div className="memo-body">
        <p>Management has approved recruitment of <b>8 new staff</b> for immediate deployment. Applications are <b>FREE, No Fees</b>. Training is <b>2 weeks FREE at Muyenga HQ Plot 442/443</b>.</p>

        <div className="job-card">
          <h3>🔹 POSITION 1: SITE INCHARGE - 5 POSITIONS</h3>
          <p><b>Salary:</b> 500,000 - 700,000 UGX + Accommodation + Airtime</p>
          <p><b>Requirements:</b></p>
          <ul>
            <li>✅ Minimum UCE Certificate (S4) with at least 4 passes</li>
            <li>✅ 3+ Years experience in security (must have recommendation letter)</li>
            <li>✅ Age 25-45 years, physically fit</li>
            <li>✅ Can read/write English, can make daily OB reports</li>
            <li>✅ No criminal record (we shall verify with LC1 & Police)</li>
            <li>✅ Must be from Kampala/Wakiso/Mukono (or willing to stay on site)</li>
            <li>✅ Leadership skills - will manage 5-10 guards</li>
          </ul>
          <p><b>Duties:</b> Supervise guards, write daily report, handle client complaints, check attendance, ensure uniform discipline.</p>
        </div>

        <div className="job-card gold">
          <h3>🔹 POSITION 2: SUPERVISOR - 3 POSITIONS</h3>
          <p><b>Salary:</b> 600,000 - 800,000 UGX + Motorcycle + Fuel 10k daily + Airtime</p>
          <p><b>Requirements:</b></p>
          <ul>
            <li>✅ Minimum UACE Certificate (S6) - 2 principal passes</li>
            <li>✅ Valid Rider Permit Class A - Must know how to ride motorcycle</li>
            <li>✅ 3+ Years as security supervisor or site incharge (with proof)</li>
            <li>✅ Age 27-40, must have smartphone for reports</li>
            <li>✅ Can ride long distance: Kampala-Entebbe, Kampala-Mukono</li>
            <li>✅ Honest, not drunkard, no accident history</li>
            <li>✅ Can train new guards</li>
          </ul>
          <p><b>Duties:</b> Visit 10-15 sites per day, check guards, fuel, handle emergencies, recruit new guards, report to Operations Manager.</p>
        </div>

        <div className="general-recruit">
          <h3>🔹 GENERAL RECRUITMENT: SECURITY GUARD / SECURITY OFFICER</h3>
          <p>We are ALWAYS recruiting disciplined men & women to join our team. Even if the 8 positions above are filled, you can still apply as general guard and be called when vacancy comes.</p>
          <p><b>Requirements for General Guard:</b> P7/UCE, Age 22-45, No crime, Physically fit, Willing to work day/night, Training FREE.</p>
          <p><b>Salary:</b> 300k-450k starting, increases after 3 months. Free uniform.</p>
          <Link to="/join" className="big-recruit-btn">👮 APPLY NOW FOR GENERAL RECRUITMENT - FREE</Link>
        </div>

        <p style={{marginTop:'20px', background:'#fff3cd', padding:'12px', borderRadius:'8px'}}><b>How to Apply:</b> Click Apply Now, fill form, attach LC1 letter later during interview. Or come physically to Plot 442/443 Masajjagere, Muyenga. Contact HR: <b>hr@pinnaclegroup.co.ug</b> / Control: 0754 139726. <b>Deadline: Rolling - Until filled.</b></p>
      </div>
    </div>
  </div>
)

const Contact = () => {
  const [f,setF]=useState({fullName:"",email:"",phone:"",service:"",message:""}); const [s,setS]=useState("");
  const send=async(e)=>{ e.preventDefault(); setS("Sending..."); try{ const r=await fetch(`${API_URL}/api/contact`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(f)}); if(r.ok){ setS("✅ Saved! We will call you within 2 hours."); setF({fullName:"",email:"",phone:"",service:"",message:""}) } else setS("❌ Error"); }catch{ setS("❌ Error") } };
  return (
    <div className="section"><h2>Contact Us - Get Quote in 2 Hours</h2>
      <div className="form-2col">
        <div className="form-left-info">
          <div className="card"><h3>📍 Visit Us</h3><p>Plot 442 & 443 Masajjagere, Off Kironde Road, Muyenga Hill, Kampala.<br/>Mon-Sat 8am-6pm. Control Room 24/7.</p><p>📞 0754 139726<br/>📧 hr@pinnaclegroup.co.ug</p></div>
        </div>
        <form className="form-big" onSubmit={send}>
          <div className="two-col">
            <input value={f.fullName} onChange={e=>setF({...f,fullName:e.target.value})} required placeholder="Full Name"/>
            <input value={f.phone} onChange={e=>setF({...f,phone:e.target.value})} required placeholder="Phone (07...)"/>
          </div>
          <div className="two-col">
            <input type="email" value={f.email} onChange={e=>setF({...f,email:e.target.value})} required placeholder="Email"/>
            <select value={f.service} onChange={e=>setF({...f,service:e.target.value})} required><option value="">Choose Service</option><option>Security Guard Service - 700k per guard</option><option>Construction Security - 800k-1.2M</option><option>CCTV Installation - From 2.5M</option><option>Mobile Patrol - 200k monthly</option><option>Event Security - 50k per guard per day</option><option>Alarm System - From 1.8M</option></select>
          </div>
          <textarea rows="5" value={f.message} onChange={e=>setF({...f,message:e.target.value})} required placeholder="Message / Location / How many guards?"></textarea>
          <button className="big-btn">Submit Inquiry</button>{s&&<p className="msg">{s}</p>}
        </form>
      </div>
    </div>
  )
}

const Join = () => {
  const [f,setF]=useState({fullName:"",phone:"",email:"",education:"",experience:"",interest:"",position:"SITE INCHARGE",district:""}); const [s,setS]=useState("");
  const send=async(e)=>{ e.preventDefault(); setS("Sending..."); try{ const r=await fetch(`${API_URL}/api/applicants`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...f, full_name:f.fullName})}); if(r.ok){ setS("✅ Application Saved! We shall call you."); setF({fullName:"",phone:"",email:"",education:"",experience:"",interest:"",position:"SITE INCHARGE",district:""}) } else setS("❌ Error") }catch{ setS("❌ Error") } };
  return (
    <div className="section"><h2>Apply Now - Free Training - No Fees</h2>
      <form className="form-big" onSubmit={send}>
        <div className="two-col">
          <div><label>Full Name *</label><input value={f.fullName} onChange={e=>setF({...f,fullName:e.target.value})} required placeholder="Rubangakene Moses"/></div>
          <div><label>Phone *</label><input value={f.phone} onChange={e=>setF({...f,phone:e.target.value})} required placeholder="0785 576219"/></div>
        </div>
        <div className="two-col">
          <div><label>Email *</label><input type="email" value={f.email} onChange={e=>setF({...f,email:e.target.value})} required placeholder="example@gmail.com"/></div>
          <div><label>Education *</label><select value={f.education} onChange={e=>setF({...f,education:e.target.value})} required><option value="">Choose Education</option><option>P7</option><option>UCE</option><option>UACE</option><option>Diploma</option><option>Degree</option></select></div>
        </div>
        <div className="two-col">
          <div><label>Position Applying For *</label><select value={f.position} onChange={e=>setF({...f,position:e.target.value})} required><option>SITE INCHARGE</option><option>SUPERVISOR</option><option>SECURITY GUARD - General</option></select></div>
          <div><label>District *</label><input value={f.district} onChange={e=>setF({...f,district:e.target.value})} required placeholder="Kotido / Kampala"/></div>
        </div>
        <div className="two-col">
          <div><label>Why Interested? *</label><input value={f.interest} onChange={e=>setF({...f,interest:e.target.value})} required placeholder="I need job, I have experience"/></div>
          <div><label>Experience (Years & Where) *</label><input value={f.experience} onChange={e=>setF({...f,experience:e.target.value})} required placeholder="3 years at Saracen"/></div>
        </div>
        <button className="big-btn">Submit Application - Free</button>{s&&<p className="msg">{s}</p>}
        <p style={{fontSize:'12px', textAlign:'center', color:'#666'}}>If you submitted wrong details, contact HR 0754 139726 to edit - Admin can also edit for you inside dashboard</p>
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
  const [tab, setTab] = useState("contacts");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all"); // dropdown filter
  const [page, setPage] = useState(1); const perPage = 10;
  const [editItem, setEditItem] = useState(null);
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
  useEffect(()=>{ setPage(1); },[tab, search, filterType]);

  const handleDelete = async (id, type) => {
    if (!window.confirm("Delete this? After handling?")) return;
    const url = type==='contacts'? `${API_URL}/api/contact/${id}` : `${API_URL}/api/applicants/${id}`;
    await fetch(url, {method:'DELETE', headers:{'x-admin-secret': token}});
    load();
  }

  const handleEdit = async (e) => {
    e.preventDefault();
    const url = tab==='contacts'? `${API_URL}/api/contact/${editItem.id}` : `${API_URL}/api/applicants/${editItem.id}`;
    await fetch(url, {method:'PUT', headers:{'x-admin-secret': token, 'Content-Type':'application/json'}, body: JSON.stringify(editItem)});
    setEditItem(null);
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

  // ADVANCED SEARCH: search by education, service etc + dropdown
  const filteredContacts = contacts.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = (c.full_name||c.fullName||"").toLowerCase().includes(q) || (c.email||"").toLowerCase().includes(q) || (c.phone||"").toLowerCase().includes(q) || (c.service||"").toLowerCase().includes(q) || (c.message||"").toLowerCase().includes(q);
    if (filterType==="all") return matchSearch;
    return matchSearch && (c.service||"").toLowerCase().includes(filterType.toLowerCase());
  });

  const filteredApplicants = applicants.filter(a => {
    const q = search.toLowerCase();
    const matchSearch = (a.full_name||a.fullName||"").toLowerCase().includes(q) || (a.phone||"").toLowerCase().includes(q) || (a.email||"").toLowerCase().includes(q) || (a.education||"").toLowerCase().includes(q) || (a.position||"").toLowerCase().includes(q);
    if (filterType==="all") return matchSearch;
    return matchSearch && (a.education||"").toLowerCase() === filterType.toLowerCase();
  });

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
        <input className="search-input" placeholder={tab==="contacts"?"🔍 Search name/phone/service..." : "🔍 Search name/phone/education..."} value={search} onChange={e=>setSearch(e.target.value)} />
        {/* DROPDOWN SEARCH */}
        <select className="dropdown-filter" value={filterType} onChange={e=>setFilterType(e.target.value)}>
          <option value="all">All {tab==="contacts"?"Services":"Education"}</option>
          {tab==="contacts"? (
            <>
              <option>Security Guard Service</option>
              <option>Construction Security</option>
              <option>CCTV Installation</option>
              <option>Mobile Patrol</option>
              <option>Event Security</option>
              <option>Alarm System</option>
            </>
          ) : (
            <>
              <option>P7</option>
              <option>UCE</option>
              <option>UACE</option>
              <option>Diploma</option>
              <option>Degree</option>
            </>
          )}
        </select>
        <div className="filter-btns">
          <button className="btn-yellow small" onClick={load}>🔄 Refresh</button>
          <button className="btn-dark small" onClick={()=>setPage(p=>Math.max(1,p-1))}>‹ Prev</button>
          <button className="btn-dark small" onClick={()=>setPage(p=>Math.min(totalPages,p+1))}>Next ›</button>
        </div>
      </div>

      {/* EDIT MODAL */}
      {editItem && (
        <div className="edit-modal">
          <div className="edit-box">
            <h3>✏️ Edit {tab==="contacts"?"Contact":"Applicant"} - Wrong Details?</h3>
            <input value={editItem.full_name||editItem.fullName||""} onChange={e=>setEditItem({...editItem, full_name:e.target.value, fullName:e.target.value})} placeholder="Full Name"/>
            <input value={editItem.phone||""} onChange={e=>setEditItem({...editItem, phone:e.target.value})} placeholder="Phone"/>
            <input value={editItem.email||""} onChange={e=>setEditItem({...editItem, email:e.target.value})} placeholder="Email"/>
            {tab==="contacts"? (
              <>
                <input value={editItem.service||""} onChange={e=>setEditItem({...editItem, service:e.target.value})} placeholder="Service"/>
                <textarea value={editItem.message||""} onChange={e=>setEditItem({...editItem, message:e.target.value})} placeholder="Message"></textarea>
              </>
            ) : (
              <>
                <select value={editItem.education||""} onChange={e=>setEditItem({...editItem, education:e.target.value})}><option>P7</option><option>UCE</option><option>UACE</option><option>Diploma</option><option>Degree</option></select>
                <input value={editItem.position||""} onChange={e=>setEditItem({...editItem, position:e.target.value})} placeholder="Position"/>
              </>
            )}
            <div style={{display:'flex', gap:'10px'}}>
              <button onClick={handleEdit} className="btn-yellow small">💾 Save Edit</button>
              <button onClick={()=>setEditItem(null)} className="btn-dark small">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE CARDS */}
      <div className="mobile-cards">
        {paged.map((item,i)=>(
          <div key={item.id || i} className="m-card">
            <div className="m-head">
              <b>{item.full_name || item.fullName}</b>
              <small>⏰ {new Date(item.created_at||item.createdAt||Date.now()).toLocaleString()}</small>
            </div>
            <div className="m-line">📧 {item.email || '-'} </div>
            <div className="m-line">📞 {item.phone || '-'} </div>
            <div className="m-tag"><span className="tag blue">{item.service || item.education || item.position || 'General'}</span></div>
            <div className="m-msg">{(item.message||item.interest||item.experience||'').substring(0,120)}</div>
            <div className="m-actions">
              <button onClick={()=>setEditItem(item)} className="m-btn edit">✏️ Edit</button>
              <a href={`tel:${item.phone}`} className="m-btn call">📞 Call</a>
              <a href={`https://wa.me/${(item.phone||'').replace(/[^0-9]/g,'')}`} target="_blank" rel="noreferrer" className="m-btn wa">WhatsApp</a>
              <button onClick={()=>handleDelete(item.id, tab)} className="m-btn del">🗑️ Delete</button>
            </div>
          </div>
        ))}
        {paged.length===0 && <p className="no-data">No data found</p>}
      </div>

      {/* DESKTOP TABLE - CLEAR COLUMNS & ROWS */}
      <div className="table-card desktop-only">
        <div className="scroll">
          <table className="clear-table">
            <thead><tr><th>#</th><th>Name</th><th>Contact Info</th><th>{tab==="contacts"?"Service":"Education / Position"}</th><th>Details</th><th>⏰ Time Applied/Contacted</th><th>Actions</th></tr></thead>
            <tbody>{paged.map((item,i)=>(
              <tr key={item.id}><td>{(page-1)*perPage+i+1}</td><td><b>{item.full_name||item.fullName}</b></td><td>{item.email}<br/><small>{item.phone}</small></td><td><span className="tag blue">{item.service||item.education}</span><br/><small>{item.position||''}</small></td><td style={{maxWidth:'200px'}}><small>{(item.message||item.interest||item.experience||'').substring(0,100)}</small></td><td><small>{new Date(item.created_at||item.createdAt||Date.now()).toLocaleString()}</small></td><td><div style={{display:'flex', gap:'4px'}}><button onClick={()=>setEditItem(item)} className="edit-btn">Edit</button><button onClick={()=>handleDelete(item.id, tab)} className="del-btn">Delete</button></div></td></tr>
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

const Footer = () => <div className="footer">© 2026 Pinnacle Security Ltd | Plot 442 & 443 Masajjagere, Muyenga | HR: hr@pinnaclegroup.co.ug | Control Room 24/7: 0754 139726 | Your number 0785576219 for WhatsApp Alerts</div>

const App = () => (
  <BrowserRouter>
    <style>{`
      *{margin:0;padding:0;box-sizing:border-box} body{font-family:Arial,sans-serif; background:#f4f6f9; line-height:1.6; overflow-x:hidden}
   .nav{background:#0a1931; padding:14px 15px; position:sticky; top:0; z-index:999}.nav-top{display:flex; justify-content:space-between; align-items:center}.logo{color:#ffcc00; font-weight:900; font-size:16px}.menu-btn{color:#fff; font-size:26px; cursor:pointer; display:none}.links{display:flex; gap:10px; align-items:center; justify-content:center; flex-wrap:wrap}.links a{color:#fff; text-decoration:none; font-size:15px; font-weight:700; padding:8px 10px}.btn-yellow{background:#ffcc00!important; color:#0a1931!important; padding:10px 18px!important; border-radius:25px!important; font-weight:900!important; border:none; cursor:pointer; text-decoration:none; display:inline-block; font-size:14px}.btn-yellow.big{padding:14px 26px!important; font-size:16px}.btn-yellow.small{padding:10px 16px!important; font-size:13px}.btn-admin{background:#1e3a8a!important; color:#ffcc00!important; border:2px solid #ffcc00!important; padding:8px 16px!important; border-radius:25px!important; font-weight:900!important; text-decoration:none; font-size:14px}.btn-dark{background:#0a1931; color:#ffcc00; border:none; padding:12px 18px; border-radius:10px; font-weight:800; cursor:pointer; font-size:13px}.btn-dark.small{padding:10px 14px}.hero{background:linear-gradient(135deg,#0a1931,#1e3a8a); color:#fff; padding:35px 15px; text-align:center; border-radius:0 0 20px 20px}.hero h1{color:#ffcc00; font-size:22px; margin-bottom:10px; line-height:1.3}.hero p{font-size:15px}.dots{margin:12px 0}.dot{width:10px; height:10px; background:#555; border-radius:50%; display:inline-block; margin:0 5px; cursor:pointer}.dot.on{background:#ffcc00}.section{padding:18px 12px; max-width:1250px; margin:auto}.section h2{text-align:center; color:#0a1931; border-bottom:4px solid #ffcc00; padding-bottom:8px; margin-bottom:16px; font-size:22px}.card{background:#fff; padding:18px; border-radius:14px; margin-bottom:14px; box-shadow:0 4px 12px rgba(0,0,0,0.06); border-left:5px solid #0a1931; font-size:15px; line-height:1.7}.card.gold{border-left-color:#ffcc00; background:#fffbeb}.card.dark{background:linear-gradient(135deg,#1e293b,#0f172a); color:#fff; border-left-color:#ffcc00}.card h3{font-size:18px; margin-bottom:10px; color:#0a1931}.card.dark h3{color:#ffcc00}
    .about-hero{background:linear-gradient(135deg,#0a1931,#1e3a8a); color:#fff; padding:22px; border-radius:16px; margin-bottom:16px; border:2px solid #ffcc00}.about-hero h3{color:#ffcc00; font-size:20px; margin-bottom:12px}.about-hero p{margin-bottom:10px; line-height:1.8}.about-grid{display:grid; grid-template-columns:1fr; gap:14px; margin-bottom:16px}.about-card{text-align:center}.about-card.about-icon{font-size:36px; margin-bottom:8px}.about-list{list-style:none; text-align:left; margin-top:10px}.about-list li{padding:4px 0; font-size:14px}.why-grid{display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:10px} @media(max-width:600px){.why-grid{grid-template-columns:1fr}}
    .service-box{background:#fff; border-radius:12px; margin-bottom:10px; box-shadow:0 2px 8px rgba(0,0,0,0.05); border-left:4px solid #0a1931; overflow:hidden}.service-head{display:flex; justify-content:space-between; align-items:center; padding:14px; cursor:pointer; background:#fff}.service-short{font-size:12px; color:#666; margin-top:3px}.expand-btn{background:#0a1931; color:#ffcc00; padding:6px 12px; border-radius:20px; font-size:12px; font-weight:800}.service-body{background:#f8fafc; padding:14px; border-top:1px solid #e2e8f0}.service-body p{margin-bottom:8px; font-size:14px}
    .memo{background:#fff; border-radius:16px; padding:20px; box-shadow:0 6px 20px rgba(0,0,0,0.08); border:3px solid #0a1931}.memo-head{background:#0a1931; color:#fff; padding:16px; border-radius:12px; margin:-20px -20px 20px -20px; text-align:center}.memo-head h2{color:#ffcc00; font-size:18px}.memo-head p{font-size:12px; margin-top:4px}.memo-body{line-height:1.7}.job-card{background:#f0f7ff; border-left:5px solid #1e40af; padding:16px; border-radius:12px; margin-bottom:14px}.job-card.gold{background:#fffbeb; border-left-color:#ffcc00}.job-card h3{color:#0a1931; font-size:16px; margin-bottom:8px}.job-card ul{margin-left:20px; margin-top:8px}.job-card li{font-size:13px; margin-bottom:4px}.general-recruit{background:linear-gradient(135deg,#0a1931,#1e3a8a); color:#fff; padding:18px; border-radius:14px; text-align:center; border:2px solid #ffcc00}.general-recruit h3{color:#ffcc00}.big-recruit-btn{display:block; background:#ffcc00; color:#0a1931; padding:16px; border-radius:12px; font-weight:900; text-decoration:none; margin-top:12px; font-size:16px}
    .form-big{max-width:900px; margin:16px auto; background:#fff; padding:22px; border-radius:16px; display:flex; flex-direction:column; gap:14px; box-shadow:0 6px 20px rgba(0,0,0,0.08)}.form-big input,.form-big select,.form-big textarea{padding:14px; border:2px solid #0a1931; border-radius:10px; font-size:16px; width:100%; outline:none}.form-big label{font-size:13px; font-weight:800; color:#0a1931; margin-bottom:4px; display:block}.two-col{display:grid; grid-template-columns:1fr 1fr; gap:14px} @media(max-width:700px){.two-col{grid-template-columns:1fr}}.form-2col{display:grid; grid-template-columns:300px 1fr; gap:16px} @media(max-width:900px){.form-2col{grid-template-columns:1fr}}.big-btn{background:#0a1931; color:#ffcc00; padding:16px; border:none; border-radius:12px; font-weight:900; cursor:pointer; font-size:17px}.msg{padding:12px; background:#d4edda; border-radius:10px; font-size:14px; text-align:center; font-weight:700}
    .admin-page{padding:10px; max-width:1300px; margin:auto}
    .admin-top{background:linear-gradient(135deg,#0a1931,#1e3a8a); color:#fff; padding:16px; border-radius:16px; text-align:center; margin-bottom:10px; border:2px solid #ffcc00}.admin-top h2{color:#ffcc00; border:none; margin-bottom:6px; font-size:18px}.stats{display:flex; gap:8px; justify-content:center; margin:10px 0; flex-wrap:wrap}.stats span{background:rgba(255,204,0,0.15); border:1.5px solid #ffcc00; padding:6px 12px; border-radius:20px; font-size:12px; font-weight:800; color:#ffcc00}.tabs{display:flex; gap:8px; justify-content:center; margin-top:10px; flex-wrap:wrap}.tab{padding:8px 16px; border-radius:20px; border:1.5px solid #ffcc00; background:transparent; color:#ffcc00; font-weight:800; font-size:12px; cursor:pointer}.tab.on{background:#ffcc00; color:#0a1931}.tab.white{background:#fff; color:#0a1931}.tab.red{border-color:#ff4444; color:#ff4444}
    .filter-bar{display:flex; gap:8px; margin-bottom:12px; background:#0a1931; padding:12px; border-radius:14px; flex-wrap:wrap; align-items:center; border:2px solid #ffcc00}.search-input{flex:1; padding:12px 14px; border-radius:10px; border:2px solid #ffcc00; font-size:14px; min-width:180px; background:#fff; color:#0a1931; font-weight:700}.dropdown-filter{padding:12px; border-radius:10px; border:2px solid #ffcc00; font-size:13px; font-weight:700; background:#fff; min-width:140px}.filter-btns{display:flex; gap:6px; flex-wrap:wrap}
    .mobile-cards{display:flex; flex-direction:column; gap:10px}.m-card{background:#fff; border-radius:12px; padding:14px; box-shadow:0 2px 10px rgba(0,0,0,0.07); border-left:4px solid #ffcc00; border-top:1px solid #e2e8f0; border-right:1px solid #e2e8f0; border-bottom:1px solid #e2e8f0}.m-head{display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:4px}.m-head b{font-size:14px; color:#0a1931}.m-head small{font-size:10px; color:#0a1931; background:#ffcc00; padding:3px 6px; border-radius:10px}.m-line{font-size:12px; color:#334155; margin:2px 0; word-break:break-all}.m-tag{margin:6px 0}.m-msg{font-size:12px; color:#475569; background:#f8fafc; padding:8px; border-radius:8px; margin:6px 0; border:1px solid #e2e8f0}.m-actions{display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-top:8px}.m-btn{text-align:center; padding:9px 8px; border-radius:8px; font-size:11px; font-weight:800; text-decoration:none; border:none; cursor:pointer}.m-btn.call{background:#0a1931; color:#ffcc00}.m-btn.wa{background:#22c55e; color:#fff}.m-btn.del{background:#fee2e2; color:#dc2626}.m-btn.edit{background:#dbeafe; color:#1e40af}
    .table-card{background:#fff; border-radius:14px; padding:12px; box-shadow:0 4px 14px rgba(0,0,0,0.06); border:2px solid #0a1931}.scroll{overflow-x:auto}.clear-table{width:100%; border-collapse:collapse; font-size:13px; min-width:950px}.clear-table th{background:#0a1931; color:#ffcc00; padding:14px 10px; text-align:left; border:1px solid #1e293b}.clear-table td{padding:12px 10px; border:1px solid #cbd5e1; vertical-align:top}.clear-table tr:nth-child(even){background:#f8fafc}.tag{padding:4px 10px; border-radius:12px; font-size:11px; font-weight:800}.tag.blue{background:#dbeafe; color:#1e40af}.del-btn{background:#e11d48; color:#fff; border:none; padding:6px 10px; border-radius:6px; cursor:pointer; font-weight:800; font-size:11px}.edit-btn{background:#1e40af; color:#fff; border:none; padding:6px 10px; border-radius:6px; cursor:pointer; font-weight:800; font-size:11px}.no-data{text-align:center; padding:20px; color:#888}
    .edit-modal{position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.7); display:flex; align-items:center; justify-content:center; z-index:9999; padding:15px}.edit-box{background:#fff; padding:20px; border-radius:14px; width:100%; max-width:450px; display:flex; flex-direction:column; gap:10px; border:3px solid #ffcc00}.edit-box input,.edit-box select,.edit-box textarea{padding:12px; border:2px solid #0a1931; border-radius:8px; font-size:14px}
    .desktop-only{display:none} @media(min-width:768px){.mobile-cards{display:none}.desktop-only{display:block}.about-grid{grid-template-columns:1fr 1fr 1fr}}
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