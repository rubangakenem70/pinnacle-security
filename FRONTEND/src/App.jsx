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
    {t:"Pinnacle Security Limited - 4.3★ Rated Security Company in Uganda", d:"Licensed & Registered at Plot 442 & 443 Masajjagere, Off Kironde Road Muyenga, P.O.Box 124853 Kampala, Uganda - Your Safety Is Our Priority"},
    {t:"🚨 WE ARE RECRUITING - Join Our Professional Team Today - Apply Free", d:"SITE INCHARGE: UCE Certificate + 3 Years Security Experience | SUPERVISOR: UACE + Valid Rider Permit + 3 Years Deployment Experience"},
    {t:"Security Guard Service ISIC 8010 | Construction Security Category F | 60+ Sites Protected | 150+ Disciplined Officers | 24/7 Response", d:"24/7 Control Room: 0754 139726 | HR: hr@pinnaclegroup.co.ug | Website: www.pinnaclegroup.co.ug | Open 8AM-4PM Daily"},
  ];
  return (
    <>
      <div className="hero"><h1>{slides[i].t}</h1><p>{slides[i].d}</p>
        <div className="dots">{[0,1,2].map(n=><span key={n} className={n===i?'dot on':'dot'} onClick={()=>setI(n)}></span>)}</div>
        <Link to="/join" className="btn-yellow big">Apply Now - Free Application</Link>
      </div>
      <div className="section">
        <div className="card"><h3>🛡️ Who We Are - Trusted Security Since Many Years</h3><p>Pinnacle Security Limited is a fully licensed and registered private security organization operating at Plot 442 & 443 Masajjagere, Off Kironde Road Muyenga, Kampala. We are recognized by Uganda Registration Services Bureau under ISIC Code 8010 for Security Guard Services and Category F for Construction Security. We have protected over 60 sites across Kampala, Wakiso, Mukono, Entebbe with more than 150 disciplined, vetted and well-trained security officers. Our officers are vetted by Uganda Police, trained for 2 weeks free at our headquarters, and equipped with radio communication, uniforms, and incident reporting skills. We are rated 4.3 stars by 92+ happy clients on Google Maps.</p><Link to="/about" className="link-more">Read More About Us →</Link></div>
        <div className="card gold"><h3>🎯 Our Professional Services - Complete Protection Solutions</h3><p>We provide comprehensive security solutions tailored to your needs: 1) Security Guard Service - Armed and unarmed guards for offices, banks, NGOs, schools, hospitals, residential homes, apartments, warehouses. 2) Construction Security - Protecting cement, iron bars, equipment, materials and workers on building sites, preventing theft, controlling access. 3) CCTV Installation, Alarm Systems, Access Control, Electric Fences - Supply, installation, monitoring, cloud storage, phone viewing. 4) Mobile Patrol & Quick Response - 3 patrol vehicles with GPS tracking, 10 minutes response time within Kampala, 24/7 control room at 0754 139726. 5) Event Security, Escort Services, VIP Protection, Dog Services. All services available 24 hours a day, 7 days a week with professional supervision.</p><Link to="/services" className="link-more">View All Services →</Link></div>
        <div className="card dark"><h3>🚨 Urgent Recruitment - Join Pinnacle Family Today - No Fees Required</h3><p>We are currently recruiting disciplined Ugandans for two positions: SITE INCHARGE - Must have UCE certificate, 3+ years security experience, Age 25-45 years, Must have LC1 and LC3 letters, National ID, Good English, No criminal record, Physically fit. Salary: 500,000 - 700,000 UGX plus accommodation, medical, uniform, training. SUPERVISOR / DEPLOYMENT OFFICER - Must have UACE certificate, Valid Rider Permit with 3+ years riding experience, 3+ years deployment experience, Age 23-40 years, Must know Kampala routes, Motorcycle maintenance knowledge. Salary: 600,000 - 800,000 UGX plus fuel, motorcycle, airtime, accommodation. Free training for 2 weeks at Muyenga HQ from 8AM-4PM daily. No application fees! Bring original documents, CV, LC letters. Apply now!</p><Link to="/join" className="btn-yellow">Apply Now - It's Free</Link></div>
      </div>
    </>
  )
}

// ========== ABOUT US - MORE TEXT + BIGGER FONT ==========
const About = () => (
  <div className="section">
    <h2>About Pinnacle Security Limited - Uganda's Trusted Security Partner</h2>
    <div className="card"> 
      <h3>📍 Our Head Office Location, Branch Offices & Licensing Details</h3>
      <p><strong>Head Office Physical Address:</strong> Plot 442 & 443 Masajjagere, Off Kironde Road, Muyenga, Kampala, Uganda. P.O.Box 124853 Kampala, Uganda. This is our main operational headquarters where all recruitment, training, deployment and administration is handled. The office is easily accessible from Muyenga Road, near Kabalagala.</p>
      <p><strong>Branch Offices:</strong> We have branches at 256 Bukasa Road, Kampala (Rated 4.3 stars with 92 reviews from satisfied clients) and also on Kironde Road itself (Rated 4.3 stars with 11 reviews). Both branches operate daily from 8:00 AM to 4:00 PM including weekends, with wheelchair accessible parking and entrance for people with disabilities.</p>
      <p><strong>Official Licensing & Registration:</strong> Pinnacle Security Limited is fully licensed and registered by Uganda Registration Services Bureau (URSB) under ISIC Code 8010 which is the international classification for Security Guard Service activities, and also Category F which covers Construction Security services. Our license number is verified and up to date. We comply with all regulations from Ministry of Internal Affairs, Uganda Police Force Private Security Department, and Private Security Companies Regulations.</p>
      <p><strong>Operating Hours & Accessibility:</strong> Our administrative office is open 8:00 AM - 4:00 PM daily Monday to Sunday. However our Control Room operates 24 hours a day, 7 days a week at 0754 139726 for emergency response, incident reporting and client support. We have wheelchair accessible parking and entrance.</p>
    </div>
    <div className="card gold">
      <h3>🎯 Our Mission, Vision, Core Values & Company History</h3>
      <p><strong>Our Mission Statement:</strong> To provide reliable, professional, disciplined and affordable security services that exceed client expectations, protect lives and property, and contribute to peace and development in Uganda. We achieve this through well-trained personnel, modern technology, quick response and strict supervision.</p>
      <p><strong>Our Vision Statement:</strong> To be the leading, most trusted and most respected security company in Uganda and East Africa at large, known for integrity, excellence, discipline, innovation and client satisfaction. We aim to expand to all regions of Uganda and beyond while maintaining quality.</p>
      <p><strong>Our Core Values:</strong> 1) Integrity - We are honest, transparent and ethical in all dealings. 2) Discipline - Our officers are highly disciplined, punctual and respectful. 3) Professionalism - We maintain high professional standards in conduct, dress, communication. 4) Quick Response - We respond to emergencies within 10 minutes in Kampala. 5) Client Satisfaction - Client needs come first. 6) Teamwork - We work as one family. 7) Continuous Training - We train continuously to improve.</p>
      <p><strong>Company History & Growth:</strong> Pinnacle Security Limited started as a small security firm with few officers protecting few sites in Muyenga. Through hard work, discipline and client trust, we have grown to protect over 60 sites across Kampala, Wakiso, Mukono, Entebbe, with over 150 disciplined officers. We have served banks, NGOs, schools, hospitals, residential apartments, construction companies, government institutions, and private homes. Our 4.3 star rating from 92+ clients proves our quality service.</p>
    </div>
    <div className="card dark">
      <h3>📊 Our Capacity, Team Strength, Training & Contact Information</h3>
      <p><strong>Current Capacity & Coverage:</strong> As of 2026, we protect 60+ active sites across Central Region including Kampala City, Muyenga, Bukasa, Kabalagala, Kansanga, Muyenga, Munyonyo, Buziga, Wakiso, Mukono, Entebbe Road, and surrounding areas. We have 150+ disciplined, vetted, trained and uniformed security officers, 10+ supervisors, 5+ site incharges, 3 patrol vehicles with GPS tracking, radio communication equipment, and 24/7 control room monitoring.</p>
      <p><strong>Recruitment & Free Training:</strong> We recruit Ugandans aged 23-45 years with minimum UCE/UACE education, good English, physically fit, no criminal record, with LC1 and LC3 recommendation letters. Training is FREE for 2 weeks at our headquarters at Plot 442 & 443 Masajjagere, Off Kironde Road Muyenga from 8AM-4PM daily. Training includes security guarding, access control, incident reporting, first aid, fire safety, customer care, discipline, radio communication, and physical fitness. No training fees charged - completely free! After training, successful candidates are deployed to sites with salary, accommodation, medical, uniform.</p>
      <p><strong>Contact Details For Business & Recruitment:</strong> For security services quotation call Control Room 0754 139726 or visit our office. For recruitment and jobs: HR Email: hr@pinnaclegroup.co.ug, hrassistant@pinnaclegroup.co.ug, info@pinnaclegroup.co.ug, Website: www.pinnaclegroup.co.ug, P.O.Box 124853 Kampala. Bring original documents, CV, National ID, LC letters, education certificates, 2 passport photos when applying. We are an equal opportunity employer - both men and women can apply.</p>
      <p><strong>Why Choose Pinnacle Security:</strong> Because we are licensed, rated 4.3 stars by many clients, we have 60+ sites experience, 150+ officers, 24/7 control room, quick 10-minute response, affordable rates, free training, no hidden fees, disciplined officers vetted by police, GPS tracked patrol, modern CCTV technology, and we put client satisfaction first. Your safety is our priority - we don't sleep so you can sleep peacefully!</p>
    </div>
  </div>
)

const Services = () => {
  const [open, setOpen] = useState(null);
  const list=[
    {n:"1. Security Guard Service (ISIC 8010) - Licensed Professional Guards", d:["We are fully licensed under ISIC Code 8010 at Plot 442 & 443 Masajjagere, Off Kironde Road Muyenga, Kampala. ISIC 8010 is the international standard for Security Guard Service activities. Our license is verified by Uganda Registration Services Bureau and Uganda Police Private Security Department. We have been operating for years with clean record and 4.3 star rating.", "Our Security Guard Service Details: We provide both armed and unarmed professional security guards for various clients including corporate offices, banks, NGOs, international organizations, schools, universities, hospitals, clinics, residential homes, apartments, warehouses, factories, shops, supermarkets, and private properties. Our guards work in shifts - day and night - ensuring 24/7 vigilance and protection. Duties include access control (checking IDs, visitor logs), patrolling premises, monitoring CCTV, incident reporting, fire safety, first aid, customer care, and quick reporting to control room via radio at 0754 139726.", "Our Coverage, Team & Technology: We currently protect 60+ active sites across Kampala City, Muyenga, Bukasa, Kabalagala, Kansanga, Munyonyo, Buziga, Wakiso District, Mukono, Entebbe Road, and surrounding areas. We have 150+ disciplined officers, all vetted by Uganda Police Force for criminal record, trained for 2 weeks free at HQ, uniformed, equipped with radio communication, torches, whistles, incident books. We use GPS tracking for supervision, control room monitoring 24/7, and monthly supervision visits to all sites. Clients get daily, weekly, monthly reports."]},
    {n:"2. Construction Security (Category F) - Protecting Building Sites & Materials", d:["We are licensed under Category F for Construction Security. This is special security for construction and building sites. Construction sites have expensive materials like cement, iron bars, timber, paint, electrical equipment, plumbing materials, tools, and machinery that can be stolen especially at night. We protect these materials and also protect workers and ensure safety compliance.", "Our Duties On Construction Sites: Our officers prevent theft of materials, control access to site (only authorized workers allowed), monitor CCTV cameras if installed, enforce safety rules like wearing helmets, safety boots, reflector jackets, log all materials entering and exiting site with delivery notes, conduct night patrols around site perimeter, report incidents, prevent vandalism, protect equipment like mixers, generators, and ensure site is locked properly after work. We work closely with site engineer and foreman.", "Our Experience & Clients: We have experience protecting construction sites for real estate developers, building contractors, road contractors, housing estates, apartment construction, commercial buildings, and private house construction across Kampala. Our officers receive additional training in construction safety, material handling, and site safety regulations. We understand construction site risks and provide reliable protection so contractor can focus on building without worrying about theft."]},
    {n:"3. CCTV Installation, Alarm Systems, Access Control, Electric Fences & Mobile Patrol Quick Response", d:["We are not just guards - we also supply, install, monitor and maintain modern electronic security systems. This includes: CCTV Cameras (both analog and IP cameras, indoor and outdoor, night vision, HD recording), Alarm Systems (burglar alarms, motion detectors, door sensors, panic buttons), Access Control Systems (biometric fingerprint, card access, keypad), Electric Fences and Razor Wire for perimeter protection, Intercom Systems, and Security Lights. We use quality brands and give warranty.", "Mobile Patrol & Quick Response Team: We have 3 patrol vehicles equipped with GPS tracking, radio communication, first aid kits, and trained response team. Our quick response time is 10 minutes within Kampala area when client calls control room at 0754 139726 for emergency. Control room operates 24/7. Our patrol team does random night patrols to client premises, checks if guards are alert, responds to alarm triggers, and provides backup to guards during incidents. This gives clients extra protection beyond static guards.", "Installation & After-Sales Service & Maintenance: We do professional installation with proper cabling, configuration, and testing. We provide training to client on how to use system, view on phone, playback recording. We offer monthly maintenance checks, cleaning cameras, checking recording, backup, cloud storage options, phone viewing setup. We give 1 year warranty on equipment and installation. Our technicians are qualified and experienced. We provide affordable rates and can customize package based on client budget and needs. Contact us for free site survey and quotation at 0754 139726 or hr@pinnaclegroup.co.ug."]},
  ];
  return (
    <div className="section"><h2>Our Professional Security Services - Complete Protection</h2>
      {list.map((s,i)=><div key={i} className="service-box"><div className="service-head" onClick={()=>setOpen(open===i?null:i)}><strong>{s.n}</strong><span>{open===i?'Close -':'Open +'}</span></div>{open===i&&<div className="service-body">{s.d.map((p,k)=><p key={k}>{p}</p>)}</div>}</div>)}
      <div className="recruit"><h3>🚨 URGENT RECRUITMENT - JOIN US NOW</h3><p>We are urgently recruiting disciplined Ugandans: SITE INCHARGE requires UCE certificate plus 3 years security experience | SUPERVISOR / DEPLOYMENT OFFICER requires UACE plus Valid Rider Permit with 3 years riding plus 3 years deployment experience | Free Training 2 weeks at Muyenga HQ 8AM-4PM | No fees charged | Salary 500k-800k + benefits</p><Link to="/join" className="btn-yellow">Apply Now - Free Application</Link></div>
    </div>
  )
}

const Contact = () => {
  const [f,setF]=useState({fullName:"",email:"",service:"",message:""}); const [s,setS]=useState("");
  const send=async(e)=>{ e.preventDefault(); setS("Sending..."); try{ const r=await fetch(`${API_URL}/api/contact`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(f)}); if(r.ok){ setS("✅ Saved to Live DB!"); setF({fullName:"",email:"",service:"",message:""}) } }catch{ setS("❌ Error") } };
  return (<div className="section"><h2>Contact Us - Get Free Quotation & Security Advice</h2><p style={{textAlign:'center', fontSize:'15px', marginBottom:'15px'}}>Visit us at Plot 442 & 443 Masajjagere, Off Kironde Road Muyenga, Kampala. Control Room 0754 139726 (24/7). HR: hr@pinnaclegroup.co.ug. We are open 8AM-4PM daily. Wheelchair accessible. We respond within 24 hours to all inquiries.</p><form className="form" onSubmit={send}><label>Full Names *</label><input value={f.fullName} onChange={e=>setF({...f,fullName:e.target.value})} required/><label>Email Address *</label><input type="email" value={f.email} onChange={e=>setF({...f,email:e.target.value})} required/><label>Which Service Do You Need? *</label><select value={f.service} onChange={e=>setF({...f,service:e.target.value})} required><option value="">Choose Service</option><option>Security Guard Service</option><option>Construction Security</option><option>CCTV Installation</option><option>Mobile Patrol & Quick Response</option><option>Event Security</option><option>Alarm System</option><option>Electric Fence</option></select><label>Your Message / Inquiry Details *</label><textarea rows="5" value={f.message} onChange={e=>setF({...f,message:e.target.value})} required></textarea><button>Submit Inquiry</button>{s&&<p className="msg">{s}</p>}</form></div>)
}

const Join = () => {
  const [f,setF]=useState({fullName:"",phone:"",email:"",position:"SITE INCHARGE",education:"",experience:"",interest:"",appliedBy:""}); const [s,setS]=useState("");
  const send=async(e)=>{ e.preventDefault(); setS("Sending..."); try{ const r=await fetch(`${API_URL}/api/applicants`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(f)}); if(r.ok){ setS("✅ Application Saved to Live DB! We will call you soon."); setF({fullName:"",phone:"",email:"",position:"SITE INCHARGE",education:"",experience:"",interest:"",appliedBy:""}) } }catch{ setS("❌ Error") } };
  return (<div className="section"><h2>Apply Now - Join Pinnacle Security - Free Recruitment</h2><p style={{textAlign:'center', fontSize:'15px', marginBottom:'15px', background:'#fff3cd', padding:'12px', borderRadius:'10px', border:'2px dashed #ffcc00'}}>Requirements: SITE INCHARGE = UCE Certificate + 3 years security experience + Age 25-45 + LC1/LC3 letters | SUPERVISOR = UACE + Valid Rider Permit 3+ years + 3 years deployment experience + Age 23-40 + Knows Kampala routes | Training FREE for 2 weeks at Muyenga HQ 8AM-4PM daily | No application fees | Bring original documents, CV, National ID, LC letters, 2 photos | Salary 500k-800k + accommodation + medical + uniform</p><form className="form" onSubmit={send}><label>Position You Apply For *</label><select value={f.position} onChange={e=>setF({...f,position:e.target.value})}><option>SITE INCHARGE</option><option>SUPERVISOR / DEPLOYMENT OFFICER</option></select><label>Full Name As On National ID *</label><input value={f.fullName} onChange={e=>setF({...f,fullName:e.target.value})} required/><label>Phone Number (MTN/Airtel) *</label><input value={f.phone} onChange={e=>setF({...f,phone:e.target.value})} required/><label>Email Address *</label><input type="email" value={f.email} onChange={e=>setF({...f,email:e.target.value})} required/><label>Highest Education Level *</label><select value={f.education} onChange={e=>setF({...f,education:e.target.value})} required><option value="">Choose Education</option><option>P7</option><option>O-Level</option><option>UCE</option><option>UACE</option><option>Diploma</option><option>Degree</option><option>Master</option></select><label>Why Are You Interested In This Security Job? *</label><input placeholder="Example: I want to serve and protect..." value={f.interest} onChange={e=>setF({...f,interest:e.target.value})} required/><label>Are You New Applicant or Ongoing? *</label><input placeholder="New or Ongoing" value={f.appliedBy} onChange={e=>setF({...f,appliedBy:e.target.value})} required/><label>Your Experience Details - Explain Where You Worked Before *</label><textarea rows="4" placeholder="Example: I worked at XYZ Security for 3 years as guard..." value={f.experience} onChange={e=>setF({...f,experience:e.target.value})} required></textarea><button>Submit Application - It's Free</button>{s&&<p className="msg">{s}</p>}</form></div>)
}

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
      if(r.ok){ alert("✅ Deleted!"); load(); } else { alert("❌ Backend needs DELETE route") }
    } catch { alert("❌ Backend error") }
  };

  const handleSave = async (id, type) => {
    const url = type==="contact" ? `${API_URL}/api/contact/${id}` : `${API_URL}/api/applicants/${id}`;
    try {
      const r = await fetch(url, {method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(editData)});
      if(r.ok){ alert("✅ Updated!"); setEditId(null); load(); } else { alert("❌ Backend needs PUT route") }
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
      <div className="admin-top"><h2>🔐 Admin Dashboard - Search & CRUD</h2><p>Live Database - Pinnacle Security</p><div className="stats"><span>📩 {contacts.length} Contacts</span><span>👮 {applicants.length} Applicants</span></div>
        <div className="tabs"><button onClick={()=>{setTab("contacts"); setSearch("")}} className={tab==="contacts"?"tab on":"tab"}>Contacts</button><button onClick={()=>{setTab("applicants"); setSearch("")}} className={tab==="applicants"?"tab on":"tab"}>Applicants</button></div>
      </div>
      <div className="search-bar"><input placeholder={tab==="contacts" ? "🔍 Search name, email, service..." : "🔍 Search name, phone, position..."} value={search} onChange={e=>setSearch(e.target.value)} /><button onClick={()=>setSearch("")} className="btn-dark">Clear</button><button onClick={load} className="btn-yellow">🔄 Refresh</button></div>
      <div className="table-card"><h3>{tab==="contacts"?`📩 Contacts (${filteredContacts.length}/${contacts.length})`:`👮 Applicants (${filteredApplicants.length}/${applicants.length})`}</h3><div className="scroll">
        {tab==="contacts" ? (<table><thead><tr><th>#</th><th>Name</th><th>Email</th><th>Service</th><th>Message</th><th>Action</th></tr></thead><tbody>{filteredContacts.map((c,i)=>(<tr key={c.id||i}><td>{i+1}</td><td>{editId===c.id ? <input value={editData.full_name||""} onChange={e=>setEditData({...editData, full_name:e.target.value})}/> : <b>{c.full_name||c.fullName}</b>}</td><td>{editId===c.id ? <input value={editData.email||""} onChange={e=>setEditData({...editData, email:e.target.value})}/> : c.email}</td><td>{editId===c.id ? <input value={editData.service||""} onChange={e=>setEditData({...editData, service:e.target.value})}/> : <span className="tag blue">{c.service}</span>}</td><td>{editId===c.id ? <input value={editData.message||""} onChange={e=>setEditData({...editData, message:e.target.value})}/> : c.message}</td><td>{editId===c.id ? <><button onClick={()=>handleSave(c.id,"contact")} className="mini green">Save</button><button onClick={()=>setEditId(null)} className="mini gray">Cancel</button></> : <><button onClick={()=>{setEditId(c.id); setEditData(c)}} className="mini dark">Edit</button><button onClick={()=>handleDelete(c.id,"contact")} className="mini red">Del</button></>}</td></tr>))}</tbody></table>) : (<table><thead><tr><th>#</th><th>Name</th><th>Position</th><th>Phone</th><th>Email</th><th>Edu</th><th>Action</th></tr></thead><tbody>{filteredApplicants.map((a,i)=>(<tr key={a.id||i}><td>{i+1}</td><td>{editId===a.id ? <input value={editData.full_name||""} onChange={e=>setEditData({...editData, full_name:e.target.value})}/> : <b>{a.full_name||a.fullName}</b>}</td><td>{editId===a.id ? <input value={editData.position||""} onChange={e=>setEditData({...editData, position:e.target.value})}/> : <span className="tag gold">{a.position}</span>}</td><td>{editId===a.id ? <input value={editData.phone||""} onChange={e=>setEditData({...editData, phone:e.target.value})}/> : a.phone}</td><td>{editId===a.id ? <input value={editData.email||""} onChange={e=>setEditData({...editData, email:e.target.value})}/> : a.email}</td><td>{a.education}</td><td>{editId===a.id ? <><button onClick={()=>handleSave(a.id,"applicant")} className="mini green">Save</button><button onClick={()=>setEditId(null)} className="mini gray">Cancel</button></> : <><button onClick={()=>{setEditId(a.id); setEditData(a)}} className="mini dark">Edit</button><button onClick={()=>handleDelete(a.id,"applicant")} className="mini red">Del</button></>}</td></tr>))}</tbody></table>)}
      </div></div>
    </div>
  )
}

// ========== JOBS PAGE - MORE TEXT + BIGGER FONT ==========
const Blog = () => (
  <div className="section"><h2>Jobs & Careers - We Are Recruiting - Join Pinnacle Security Family</h2>
    <p style={{textAlign:'center', fontSize:'16px', marginBottom:'20px', background:'#fff', padding:'15px', borderRadius:'10px'}}>Pinnacle Security Limited at Plot 442 & 443 Masajjagere, Off Kironde Road Muyenga, Kampala is urgently recruiting disciplined, hardworking Ugandans for immediate deployment. We are a licensed security company rated 4.3 stars with 60+ sites and 150+ officers. We provide free training, accommodation, medical, uniform. No fees required. Read below for full details of available positions, requirements, salary and how to apply. All applications are handled at our head office 8AM-4PM daily.</p>
    
    <div className="card"><h3>1. SITE INCHARGE - 5 Positions Available - UCE Certificate Required</h3>
      <p><strong>Job Title:</strong> Site Incharge / Security Supervisor for Client Sites</p>
      <p><strong>Number of Positions:</strong> 5 positions available immediately for deployment in Kampala, Wakiso, Mukono areas</p>
      <p><strong>Education Requirements:</strong> Minimum UCE certificate (O-Level) with at least 3 passes. Must have original certificate. Higher education like UACE, Diploma, Degree is added advantage but not required. Must be able to read, write and speak English fluently, plus Luganda or other local languages is advantage.</p>
      <p><strong>Experience Requirements:</strong> Must have minimum 3 years working experience as security guard, security supervisor, site incharge, or similar role in a recognized security company or organization. Must provide reference letters from previous employers. Must have knowledge of security guarding, access control, incident reporting, supervision of guards, client handling, and report writing.</p>
      <p><strong>Age & Other Requirements:</strong> Age must be between 25-45 years. Must have National ID, LC1 letter and LC3 letter from your village, must have no criminal record (police clearance will be done), must be physically fit and healthy, must be disciplined, punctual, honest, respectful, and must have good communication skills. Must be willing to work day and night shifts, including weekends.</p>
      <p><strong>Duties & Responsibilities:</strong> As Site Incharge you will be in charge of a client site, supervising 5-20 security guards, ensuring guards are at work on time, in proper uniform, alert, patrolling, controlling access, checking visitor IDs, writing occurrence book, reporting incidents to control room at 0754 139726, handling client complaints, ensuring site is secure, conducting parade, and submitting daily reports to supervisor.</p>
      <p><strong>Salary & Benefits:</strong> Monthly salary 500,000 - 700,000 UGX depending on site and experience, plus free accommodation at site or nearby, free medical treatment, free uniform (2 pairs), free training, opportunity for promotion to supervisor, and job security. Salary paid monthly on time via mobile money or bank.</p>
    </div>

    <div className="card gold"><h3>2. SUPERVISOR / DEPLOYMENT OFFICER - 3 Positions - UACE + Rider Permit Required</h3>
      <p><strong>Job Title:</strong> Field Supervisor / Deployment Officer / Patrol Rider</p>
      <p><strong>Number of Positions:</strong> 3 positions available immediately for field operations in Kampala and surrounding districts</p>
      <p><strong>Education Requirements:</strong> Minimum UACE certificate (A-Level) with at least 2 principal passes. Must have original certificate. Diploma or Degree in any field is added advantage. Must be able to read, write and speak English fluently, good report writing skills required.</p>
      <p><strong>Experience & License Requirements:</strong> Must have valid Rider Permit (Motorcycle License) with at least 3 years riding experience, must have minimum 3 years experience in security deployment, supervision, or field operations in security company. Must know Kampala roads and routes very well - Muyenga, Bukasa, Kabalagala, Kansanga, Wakiso, Mukono, Entebbe Road, etc. Must have experience in motorcycle maintenance, deployment of guards, client visits, site inspections, and handling guard discipline issues.</p>
      <p><strong>Age & Other Requirements:</strong> Age must be between 23-40 years. Must have National ID, LC1 and LC3 letters, no criminal record, physically fit, able to ride motorcycle for long distances, disciplined, honest, able to work under pressure, good communication, able to handle guards firmly but fairly, willing to work day and night, weekends inclusive.</p>
      <p><strong>Duties & Responsibilities:</strong> As Supervisor/Deployment Officer you will be responsible for deploying guards to client sites, visiting sites day and night to check if guards are alert, responding to emergencies within 10 minutes, handling guard replacements when guard is absent, handling client complaints, conducting night patrols with patrol vehicle, inspecting sites, writing supervision reports, training guards on site, ensuring guards have uniforms and equipment, collecting occurrence books, and reporting to operations manager. You will ride motorcycle daily covering many sites.</p>
      <p><strong>Salary & Benefits:</strong> Monthly salary 600,000 - 800,000 UGX plus fuel allowance, company motorcycle provided, airtime allowance, free accommodation, medical, uniform, and opportunity for promotion to operations manager. Salary paid monthly on time. This is a responsible position with growth opportunity.</p>
    </div>

    <div className="card dark"><h3>📋 How To Apply - Free Recruitment - No Fees - Bring Documents</h3>
      <p><strong>Application Process - Step By Step:</strong> Step 1 - Prepare your documents: Original National ID, Original education certificates (UCE/UACE), CV with 2 referees, LC1 letter, LC3 letter, 2 passport photos, Reference letters from previous employers if any, Rider Permit if applying for Supervisor. Step 2 - Visit our head office at Plot 442 & 443 Masajjagere, Off Kironde Road Muyenga, Kampala from 8AM-4PM daily Monday to Sunday. Step 3 - Fill application form at reception - it's free. Step 4 - Attend interview same day or next day. Step 5 - If selected, attend free training for 2 weeks at HQ 8AM-4PM. Step 6 - After training, get deployed to site with salary and benefits. No fees at any stage! We do not charge for application, training or deployment.</p>
      <p><strong>Important Warning:</strong> Pinnacle Security Limited does NOT charge any fees for recruitment. If anyone asks you for money for job, report immediately to HR at hr@pinnaclegroup.co.ug or control room 0754 139726. We are equal opportunity employer - both men and women can apply. Persons with disabilities who meet requirements are encouraged to apply. For inquiries call 0754 139726 or email hr@pinnaclegroup.co.ug, hrassistant@pinnaclegroup.co.ug. You can also apply online via our website Apply Now page - fill form and we will call you within 24-48 hours.</p>
      <p><strong>Training Details:</strong> Free training for 2 weeks at our headquarters at Plot 442 & 443 Masajjagere, Off Kironde Road Muyenga from 8:00 AM to 4:00 PM daily. Training covers: Security guarding, Access control, Incident and occurrence book writing, Radio communication, First aid, Fire safety and fire extinguisher use, Customer care and client handling, Discipline and code of conduct, Physical fitness and parade, Patrol techniques, CCTV monitoring, Report writing. Training is conducted by experienced security professionals and Uganda Police trainers. After training you get certificate and deployment.</p>
    </div>

    <div style={{textAlign:'center', marginTop:'20px'}}>
      <Link to="/join" className="btn-yellow big">Apply Now Online - It's Free & Swift</Link>
      <p style={{fontSize:'14px', marginTop:'12px', background:'#fff', padding:'12px', borderRadius:'10px'}}>Training FREE 2 weeks at Plot 442 & 443 Masajjagere Muyenga 8AM-4PM | No fees at any stage | Bring original documents, CV, National ID, LC1/LC3 letters, 2 photos | HR: hr@pinnaclegroup.co.ug | Control Room: 0754 139726 | P.O.Box 124853 Kampala | www.pinnaclegroup.co.ug | Apply today and start your security career with Uganda's trusted company!</p>
    </div>
  </div>
)

const Footer = () => <div className="footer">© 2026 Pinnacle Security Limited | Plot 442 & 443 Masajjagere, Off Kironde Road Muyenga, P.O.Box 124853 Kampala | HR: hr@pinnaclegroup.co.ug | Control Room: 0754 139726 | Website: pinnaclegroup.co.ug | Licensed ISIC 8010 & Category F | 60+ Sites | 150+ Officers | 4.3★ Rated</div>

const App = () => (
  <BrowserRouter>
    <style>{`
      *{margin:0;padding:0;box-sizing:border-box}
      html,body{overflow:auto!important; height:auto!important}
      body{font-family:Arial,sans-serif; background:#f4f6f9; line-height:1.6}
      .nav{background:#0a1931; padding:12px 15px; position:sticky; top:0; z-index:999}
      .nav-top{display:flex; justify-content:space-between; align-items:center}
      .logo{color:#ffcc00; font-weight:900; font-size:16px}
      .menu-btn{color:#fff; font-size:24px; cursor:pointer; display:none}
      .links{display:flex; gap:10px; align-items:center; justify-content:center; flex-wrap:wrap}
      .links a{color:#fff; text-decoration:none; font-size:13px; font-weight:700; padding:6px 10px}
      .btn-yellow{background:#ffcc00!important; color:#0a1931!important; padding:8px 18px!important; border-radius:20px!important; font-weight:900!important; border:none; cursor:pointer; text-decoration:none; display:inline-block; font-size:13px}
      .btn-yellow.big{padding:12px 24px!important; font-size:14px}
      .btn-admin{background:#1e3a8a!important; color:#ffcc00!important; border:2px solid #ffcc00!important; padding:8px 18px!important; border-radius:20px!important; font-weight:900!important; text-decoration:none; font-size:13px}
      .btn-dark{background:#0a1931; color:#ffcc00; border:none; padding:10px 14px; border-radius:8px; font-weight:800; cursor:pointer; font-size:12px}
      .hero{background:linear-gradient(135deg,#0a1931,#1e3a8a); color:#fff; padding:40px 15px; text-align:center; border-radius:0 0 20px 20px}
      .hero h1{color:#ffcc00; font-size:22px; margin-bottom:10px; line-height:1.3} .hero p{font-size:14px; opacity:0.95; line-height:1.5}
      .dots{margin:12px 0} .dot{width:10px; height:10px; background:#555; border-radius:50%; display:inline-block; margin:0 5px; cursor:pointer} .dot.on{background:#ffcc00}
      .section{padding:20px 12px; max-width:1100px; margin:auto}
      .section h2{text-align:center; color:#0a1931; border-bottom:4px solid #ffcc00; padding-bottom:8px; margin-bottom:18px; font-size:20px; line-height:1.3}
      .card{background:#fff; padding:18px; border-radius:12px; margin-bottom:14px; box-shadow:0 3px 10px rgba(0,0,0,0.06); border-left:5px solid #0a1931; font-size:14px; line-height:1.7; text-align:justify}
      .card.gold{border-left-color:#ffcc00; background:#fffbeb} .card.dark{background:linear-gradient(135deg,#1e293b,#0f172a); color:#fff; border-left-color:#ffcc00}
      .card h3{font-size:16px; margin-bottom:10px; color:#0a1931; line-height:1.4} .card.dark h3{color:#ffcc00} .card p{margin-bottom:10px} .link-more{color:#0a1931; font-weight:800; font-size:13px; text-decoration:none}
      .service-box{background:#fff; border-radius:12px; margin-bottom:10px; overflow:hidden; box-shadow:0 3px 8px rgba(0,0,0,0.05)}
      .service-head{background:#0a1931; color:#ffcc00; padding:14px 15px; display:flex; justify-content:space-between; cursor:pointer; font-size:14px}
      .service-body{padding:14px 15px; font-size:14px; background:#f8fafc; line-height:1.7; text-align:justify} .service-body p{margin-bottom:12px}
      .recruit{background:#fff3cd; border:2px dashed #ffcc00; padding:15px; border-radius:12px; text-align:center; margin-top:15px; font-size:14px; line-height:1.6}
      .form{max-width:550px; margin:15px auto; background:#fff; padding:18px; border-radius:14px; display:flex; flex-direction:column; gap:8px; box-shadow:0 4px 15px rgba(0,0,0,0.07)}
      .form label{font-size:13px; font-weight:700; color:#0a1931} .form input,.form select,.form textarea{padding:11px; border:1px solid #ddd; border-radius:8px; font-size:13px}
      .form button{background:#0a1931; color:#fff; padding:12px; border:none; border-radius:10px; font-weight:800; cursor:pointer; font-size:14px} .msg{padding:10px; background:#d4edda; border-radius:8px; font-size:13px; text-align:center}
      .admin-top{background:linear-gradient(135deg,#0a1931,#1e3a8a); color:#fff; padding:20px; border-radius:16px; text-align:center; margin-bottom:14px}
      .admin-top h2{color:#ffcc00; border:none; margin-bottom:6px; font-size:18px} .admin-top p{font-size:13px; opacity:0.9}
      .stats{display:flex; gap:10px; justify-content:center; margin:12px 0; flex-wrap:wrap} .stats span{background:rgba(255,204,0,0.15); border:1px solid #ffcc00; padding:6px 12px; border-radius:20px; font-size:12px; font-weight:800; color:#ffcc00}
      .tabs{display:flex; gap:10px; justify-content:center; margin-top:12px} .tab{padding:8px 18px; border-radius:20px; border:2px solid #ffcc00; background:transparent; color:#ffcc00; font-weight:800; font-size:12px; cursor:pointer} .tab.on{background:#ffcc00; color:#0a1931}
      .search-bar{display:flex; gap:8px; margin-bottom:14px; background:#fff; padding:12px; border-radius:12px; box-shadow:0 3px 10px rgba(0,0,0,0.06); flex-wrap:wrap}
      .search-bar input{flex:1; padding:11px; border-radius:10px; border:2px solid #0a1931; font-size:13px; min-width:200px}
      .table-card{background:#fff; border-radius:14px; padding:12px; box-shadow:0 4px 15px rgba(0,0,0,0.07)}
      .table-card h3{font-size:14px; margin-bottom:10px; color:#0a1931} .scroll{overflow-x:auto; -webkit-overflow-scrolling:touch}
      .table-card table{width:100%; border-collapse:collapse; font-size:12px; min-width:700px}
      .table-card th{background:#0a1931; color:#ffcc00; padding:10px 8px; text-align:left; font-size:11px}
      .table-card td{padding:9px; border-bottom:1px solid #f1f5f9; border-right:1px solid #f1f5f9; font-size:12px}
      .table-card tr:hover{background:#fffbeb} .table-card td input{width:85px; padding:5px; border:1px solid #ccc; border-radius:5px; font-size:11px}
      .tag{padding:3px 8px; border-radius:12px; font-size:10px; font-weight:700} .tag.blue{background:#dbeafe; color:#1e40af} .tag.gold{background:#fef3c7; color:#92400e}
      .mini{border:none; padding:5px 10px; border-radius:6px; font-size:10px; cursor:pointer; margin-right:4px; font-weight:700}
      .mini.dark{background:#0a1931; color:#ffcc00} .mini.red{background:red; color:#fff} .mini.green{background:green; color:#fff} .mini.gray{background:#666; color:#fff}
      .footer{background:#0a1931; color:#aaa; text-align:center; padding:15px; font-size:10px; margin-top:20px; line-height:1.6}
      @media(max-width:700px){ .menu-btn{display:block} .links{display:none; flex-direction:column; align-items:flex-start; padding-top:12px} .links.show{display:flex} .hero h1{font-size:18px} .card{font-size:13px} }
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