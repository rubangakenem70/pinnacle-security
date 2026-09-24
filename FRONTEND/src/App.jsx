import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'

const API_URL = "https://pinnacle-security-backend.vercel.app";

const Navbar = () => {
  const loc = useLocation();
  const active = (p) => loc.pathname === p ? {color:'#ffcc00', borderBottom:'3px solid #ffcc00'} : {color:'white'};
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

// ABOUT PAGE - MORE CONTENT
const About = () => (
  <div className="section">
    <h2>About Pinnacle Security Ltd</h2>
    
    <div className="card">
      <h3>📍 Who We Are & Where We Are</h3>
      <p>Pinnacle Security Limited is a Ugandan owned Private Security Organization headquartered at <b>Plot 442 & 443 Masajjagere, Off Kironde Road, Muyenga Hill, Makindye Division, Kampala</b> - P.O.Box 124853 Kampala, Uganda. Branch at 256 Bukasa Road, Muyenga. We are fully licensed by Uganda Registration Services Bureau (URSB) and Uganda Police Force Private Security Department under <b>ISIC 8010 - Security Guard Service</b> and <b>Category F - Construction Site Security</b>. We are rated 4.3★ by clients on Google Business. We operate 8AM-4PM office hours for visitors, but our <b>Control Room 0754 139726 / 0200 900 700 is 24/7, 365 days</b>.</p>
      <p><b>Contact:</b> HR: hr@pinnaclegroup.co.ug | Operations: ops@pinnaclegroup.co.ug | Phone: 0754 139726 / 0776 123 456 | WhatsApp: 0754 139726 | Location: Search "Pinnacle Security Muyenga" on Google Maps - We are 200 meters from Muyenga Tank Hill Road.</p>
    </div>

    <div className="card gold">
      <h3>🎯 Our Mission, Vision & Core Values</h3>
      <p><b>Our Mission:</b> To provide professional, affordable, technology-driven private security solutions that protect lives, property, and businesses across Uganda with discipline, integrity, and 24/7 rapid response.</p>
      <p><b>Our Vision:</b> To be Uganda's most trusted, licensed, and client-rated (4.5★+) security company with 500+ officers protecting 200+ sites by 2028, known for zero tolerance to theft, corruption, and indiscipline.</p>
      <p><b>Our Core Values:</b> 1) Discipline & Integrity - No bribery, no sleeping on duty, no theft. 2) Professionalism - Uniformed, trained, licensed. 3) Rapid Response - 10 minutes in Kampala, 30 minutes in Wakiso/Mukono. 4) Client Focus - We listen, we report daily, we solve. 5) Innovation - CCTV + Mobile App + GPS + Radio. 6) Welfare - NSSF, Medical, Accommodation, Fair Salary 500k-800k.</p>
    </div>

    <div className="card">
      <h3>📜 History & Experience</h3>
      <p>Founded in 2018, Pinnacle Security started with 10 guards protecting 2 construction sites in Muyenga. By 2020, we grew to 50 guards protecting 15 sites including schools and clinics. In 2022 we got ISIC 8010 license and added CCTV installation division. In 2023 we got Category F construction license and added Mobile Patrol with 3 vehicles. Today 2026 we have 150+ officers, 60+ active sites in Kampala, Wakiso, Mukono, Entebbe, and we have never lost a client due to theft in 2 years. Our clients include: 12 Private Schools, 8 Clinics/Hospitals, 15 Construction Sites (Chinese and Ugandan contractors), 10 NGOs, 5 Banks/Microfinances, 10 Factories, and 20+ Private Residences in Muyenga, Munyonyo, Buziga, Kololo.</p>
      <p><b>Management Team:</b> Director - Ex-UPDF with 15 years security experience. Operations Manager - Ex-Police with Diploma in Security Management. Training Manager - Ex-PSO with 10 years guard training. Control Room Manager - 24/7 monitoring of all sites via radio and CCTV.</p>
    </div>

    <div className="card dark">
      <h3>💎 Why Choose Pinnacle Security Ltd?</h3>
      <p>✅ <b>Licensed & Legal:</b> URSB ISIC 8010 & F, Uganda Police PSO License, URA TIN, NSSF Registered.<br/>
      ✅ <b>4.3★ Rated:</b> Google Business rated by real clients for professionalism and low theft cases.<br/>
      ✅ <b>150+ Officers, 60+ Sites:</b> Proven track record, not a briefcase company.<br/>
      ✅ <b>24/7 Control Room 0754 139726:</b> Not just phone - radio, CCTV, GPS tracking, patrol vehicles.<br/>
      ✅ <b>10 Minutes Rapid Response:</b> 3 patrol vehicles covering Kampala, Wakiso, Entebbe.<br/>
      ✅ <b>Technology:</b> HD CCTV with phone viewing, electric fences, alarm systems, guard tour system.<br/>
      ✅ <b>No Hidden Fees:</b> Quotation is free, deployment within 48 hours, no extra charges.<br/>
      ✅ <b>Welfare for Guards:</b> Paid on 28th monthly via bank/mobile money, NSSF, medical, accommodation for distant sites, free uniform, free training 2 weeks at Muyenga HQ.<br/>
      ✅ <b>Daily Reporting:</b> OB book, incident reports, WhatsApp group with client, monthly security assessment.<br/>
      ✅ <b>Insurance:</b> Public liability insurance, guards insured for accidents.</p>
    </div>

    <div className="card">
      <h3>📞 Compliance & Documents</h3>
      <p>We have: URSB Certificate of Incorporation, URSB License ISIC 8010 & Category F, Uganda Police PSO Operating License 2026, URA TIN, NSSF Certificate, Public Liability Insurance, Client Contracts, Guard Training Certificates, Radio Frequency License. All available at office Plot 442 & 443 Masajjagere Muyenga for verification. We do not charge recruitment fees - any person asking money using our name is a fraud - Report to 0754 139726.</p>
    </div>
  </div>
)

// SERVICES PAGE - MORE CONTENT
const Services = () => { 
  const [open,setOpen]=useState(0); 
  const list=[
    {n:"1. Security Guard Service (ISIC 8010) - Our Core Business", d:["Pinnacle Security Ltd is licensed under ISIC 8010 to provide armed and unarmed security guard services for: Offices, Banks & Microfinances, NGOs & Embassies, Schools & Universities, Hospitals & Clinics, Hotels & Restaurants, Factories & Warehouses, Supermarkets & Shops, Private Homes in Muyenga, Munyonyo, Buziga, Kololo, Lubowa, Apartments and Estates. Our guards are trained for 2 weeks at Muyenga HQ covering: parade, discipline, customer care, access control, OB writing, incident reporting, first aid, fire fighting, radio communication, human rights. Uniform: Navy blue with Pinnacle logo, boots, cap, whistle, baton, torch, radio. Duty: 12 hours day/night with relief. Supervision: Site Incharge visits daily, Supervisor visits 3 times weekly, Operations Manager visits weekly. Reporting: Daily OB, weekly incident summary, monthly security assessment. Control Room 0754 139726 monitors via radio every 2 hours. Price: Starting from 700,000 UGX per guard per month for unarmed in Kampala (negotiable for many guards). Deployment within 48 hours after contract."]},
    {n:"2. Construction Site Security (Category F Licensed)", d:["Licensed Category F to protect construction sites. We protect: Cement, Iron Bars, Timber, Tiles, Paint, Electrical wires, Plumbing materials, Tools & Machinery, Workers' safety, Client's site office. Challenges we solve: Theft of materials by workers/thugs, unauthorized entry, vandalism, night theft, fighting among workers. Our solution: Day & Night guards, material register (in/out), vehicle search, worker ID cards, perimeter patrol, torch at night, OB book, store lock verification, photo reporting via WhatsApp group with foreman and client. Clients: Chinese contractors, Ugandan contractors, private house builders in Muyenga, Munyonyo, Kigo, Lubowa, Akright. Price: 800,000-1,200,000 per guard per month depending on risk. We have protected 15+ construction sites with zero material loss in 2024-2025."]},
    {n:"3. CCTV Installation, Monitoring & Maintenance", d:["We supply, install, and maintain: HD CCTV Cameras (Dome, Bullet, PTZ), NVR/DVR 4/8/16 channels, 1TB-4TB Hard Disk, Remote viewing on phone (Hikvision, Dahua, HiLook), Solar cameras for no power sites, Installation with cabling, configuration, and training. Monitoring: 24/7 control room can monitor client CCTV if internet available. Maintenance: Monthly cleaning, backup check, warranty 1 year. Price: 4-camera system from 2,500,000 UGX full installation in Kampala. 8-camera from 4,500,000 UGX. We also install for guards - CCTV at site reduces guard theft. Benefits: Evidence for theft, remote monitoring when abroad, night recording with IR, motion detection alerts on phone. Contact 0754 139726 for free site survey and quotation."]},
    {n:"4. Mobile Patrol, Rapid Response & Alarm Response - 10 Minutes", d:["We have 3 patrol vehicles (Toyota Premio with Pinnacle branding and light) covering Muyenga, Bukasa, Buziga, Munyonyo, Kololo, Nakawa, Bunga, Ggaba, Kansanga, Kabalagala, Lubowa, and Entebbe Road. Service: Night patrol for homes/businesses without guards - our vehicle passes 3 times per night, checks doors, reports via WhatsApp. Rapid Response: If alarm triggers or client calls 0754 139726, patrol team arrives within 10 minutes in Kampala, 20-30 minutes Wakiso/Mukono. Alarm Response: We install wireless alarm with siren and connect to control room - when triggered, patrol responds. Price: Patrol only 200,000 per month for homes, 500,000 for businesses. Rapid response included for guard clients free. For non-guard clients 300,000 monthly retainer."]},
    {n:"5. Event Security Management", d:["We provide trained event security for: Weddings, Introduction Ceremonies (Kwanjula), Birthday Parties, Concerts & Music Shows, Church Crusades, Conferences & Seminars, Sports Events, Political Rallies (licensed), School Events. Services: Access control, ticket checking, parking management, crowd control, VIP protection, stage security, perimeter security, emergency evacuation. Our team: Supervisor + 10-50 guards depending on event size, uniformed, with radios, whistles, reflector jackets. Past events: 2024-2025 we secured 20+ weddings in Munyonyo, 5 concerts in Kampala, 10 church crusades. Price: 50,000 per guard per day for events (minimum 10 guards). Supervisor 100,000 per day. Book 1 week early via 0754 139726."]},
    {n:"6. Alarm Systems, Electric Fences & Access Control", d:["We install: Intruder Alarm System (wireless with siren, phone alert, control room alert), Electric Fence (1,000V non-lethal deterrent, approved by Police, with warning signs), Access Control (biometric fingerprint, card reader, PIN code for offices), Barrier Gates for estates, Razor Wire. Installation: Professional, clean wiring, warranty 1 year, training on use. Integration: Alarm can trigger CCTV recording and patrol response. Electric fence can be connected to alarm. Price: Alarm system from 1,800,000 UGX. Electric fence 80,000 per meter installed. Access control 2,500,000 for 2 doors. Free site survey. Call 0754 139726."]}
  ]; 
  return (
    <div className="section">
      <h2>Our Professional Security Services - ISIC 8010 & F Licensed</h2>
      <p style={{textAlign:'center', background:'#fff3cd', padding:'12px', borderRadius:'12px', marginBottom:'16px', border:'2px dashed #ffcc00', fontWeight:'700'}}>All services include 24/7 Control Room 0754 139726, Daily Reporting, Supervisor Visits, Radio Communication, Free Quotation & Site Survey. Licensed, Insured, 4.3★ Rated.</p>
      {list.map((s,i)=><div key={i} className="service-box"><div className="service-head" onClick={()=>setOpen(open===i?null:i)}><strong>{s.n}</strong><span>{open===i?'Close -':'Open +'}</span></div>{open===i&&<div className="service-body">{s.d.map((p,k)=><p key={k}>{p}</p>)}<div style={{marginTop:'12px', textAlign:'center'}}><Link to="/contact" className="btn-yellow">Get Free Quotation for {s.n.split('-')[0]}</Link></div></div>}</div>)}
    </div>
  )
}

const Contact = () => {
  const [f,setF]=useState({fullName:"",email:"",service:"",message:""}); const [s,setS]=useState("");
  const send=async(e)=>{ e.preventDefault(); setS("Sending..."); try{ const r=await fetch(`${API_URL}/api/contact`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(f)}); if(r.ok){ setS("✅ Message Saved to Live DB! We will call you within 2 hours."); setF({fullName:"",email:"",service:"",message:""}) } }catch{ setS("❌ Error - Check internet") } };
  return (
    <div className="section">
      <h2>Contact Us - Get Free Security Quotation in 2 Hours</h2>
      <p style={{textAlign:'center', fontSize:'18px', marginBottom:'20px', background:'#fff', padding:'15px', borderRadius:'12px', lineHeight:'1.7', border:'2px solid #0a1931'}}>We are at <b>Plot 442 & 443 Masajjagere, Off Kironde Road Muyenga, Kampala</b>. Control Room <b>0754 139726</b> is 24/7. HR Email <b>hr@pinnaclegroup.co.ug</b>. Ops: ops@pinnaclegroup.co.ug. WhatsApp: 0754 139726. Visit us 8AM-4PM daily. Free site survey in Kampala/Wakiso. Quotation within 2 hours. Deployment within 48 hours.</p>
      <form className="form-big" onSubmit={send}>
        <div className="form-row-2">
          <div><label>Full Names *</label><input value={f.fullName} onChange={e=>setF({...f,fullName:e.target.value})} required placeholder="Your full name"/></div>
          <div><label>Email Address *</label><input type="email" value={f.email} onChange={e=>setF({...f,email:e.target.value})} required placeholder="your@email.com"/></div>
        </div>
        <label>Which Service Do You Need? *</label>
        <select value={f.service} onChange={e=>setF({...f,service:e.target.value})} required><option value="">Choose Service Needed</option><option>Security Guard Service - 700k per guard</option><option>Construction Security - 800k-1.2M</option><option>CCTV Installation - From 2.5M</option><option>Mobile Patrol - 200k monthly</option><option>Event Security - 50k per guard per day</option><option>Alarm System - From 1.8M</option><option>Electric Fence - 80k per meter</option><option>All Services Package</option></select>
        <label>Your Message / Location / Number of Guards Needed *</label>
        <textarea rows="6" value={f.message} onChange={e=>setF({...f,message:e.target.value})} required placeholder="Example: I need 2 guards for my construction site in Kigo, night only, starting next week. Or I need 4 cameras for my home in Munyonyo..."></textarea>
        <button className="big-btn">Submit Inquiry - Get Free Quotation Today</button>
        {s&&<p className="msg">{s}</p>}
      </form>
    </div>
  )
}

const Join = () => {
  const [f,setF]=useState({fullName:"",phone:"",email:"",education:"",experience:"",interest:"",appliedBy:""}); const [s,setS]=useState("");
  const send=async(e)=>{ e.preventDefault(); setS("Sending..."); try{ const r=await fetch(`${API_URL}/api/applicants`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...f, position: "Not Specified"})}); if(r.ok){ setS("✅ Application Saved! We will call you soon for interview at Muyenga HQ."); setF({fullName:"",phone:"",email:"",education:"",experience:"",interest:"",appliedBy:""}) } }catch{ setS("❌ Error") } };
  return (
    <div className="section">
      <h2>Apply Now - Join Pinnacle Security - Free Training - No Fees</h2>
      <p style={{textAlign:'center', fontSize:'17px', marginBottom:'20px', background:'#fff3cd', padding:'15px', borderRadius:'12px', border:'2px dashed #ffcc00', lineHeight:'1.7'}}><b>IMPORTANT: We NEVER charge recruitment fees!</b> Anyone asking money using Pinnacle name is a thief - Report to 0754 139726. Training is FREE 2 weeks at Plot 442 & 443 Masajjagere Muyenga HQ 8AM-4PM. Bring Original National ID, Academic Papers (UCE/UACE/Diploma/Degree), LC1 Letter, 2 Passport Photos, CV. Transport & lunch for training is on you, but training, uniform, and deployment are FREE. Salary 500k-800k paid on 28th via bank/mobile money + NSSF + medical + accommodation for far sites.</p>
      <form className="form-big" onSubmit={send}>
        <div className="form-row-2">
          <div><label>Full Name As On National ID *</label><input value={f.fullName} onChange={e=>setF({...f,fullName:e.target.value})} required placeholder="Example: MUKASA JOHN BOSCO"/></div>
          <div><label>Phone Number (MTN/Airtel) *</label><input value={f.phone} onChange={e=>setF({...f,phone:e.target.value})} required placeholder="07XXXXXXXX - Must be active for calls"/></div>
        </div>
        <div className="form-row-2">
          <div><label>Email Address *</label><input type="email" value={f.email} onChange={e=>setF({...f,email:e.target.value})} required placeholder="your@email.com"/></div>
          <div><label>Highest Education Level *</label><select value={f.education} onChange={e=>setF({...f,education:e.target.value})} required><option value="">Choose Education Level</option><option>P7</option><option>O-Level</option><option>UCE</option><option>UACE</option><option>Diploma</option><option>Degree</option><option>Master</option></select></div>
        </div>
        <div className="form-row-2">
          <div><label>New or Ongoing Applicant? *</label><input value={f.appliedBy} onChange={e=>setF({...f,appliedBy:e.target.value})} required placeholder="New or Ongoing - Have you applied before?"/></div>
          <div><label>Why Are You Interested In Security Job? *</label><input value={f.interest} onChange={e=>setF({...f,interest:e.target.value})} required placeholder="Example: I want to protect people and I am disciplined..."/></div>
        </div>
        <label>Your Experience Details (Where you worked before, years, position) *</label>
        <textarea rows="3" value={f.experience} onChange={e=>setF({...f,experience:e.target.value})} required placeholder="Example: I worked as security guard at Saracen 2022-2024, 2 years, protected bank. Or I worked at construction site in Kigo 2023..."></textarea>
        <button className="big-btn">Submit Application - FREE - We Will Call You For Interview</button>
        {s&&<p className="msg">{s}</p>}
      </form>
    </div>
  )
}

const Admin = () => {
  const [contacts, setContacts] = useState([]); 
  const [applicants, setApplicants] = useState([]); 
  const [tab, setTab] = useState("contacts");
  const [searchName, setSearchName] = useState("");
  const [eduFilter, setEduFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");

  const load = () => {
    fetch(`${API_URL}/api/contact`).then(r=>r.json()).then(d=>Array.isArray(d)&&setContacts(d));
    fetch(`${API_URL}/api/applicants`).then(r=>r.json()).then(d=>Array.isArray(d)&&setApplicants(d));
  }
  useEffect(()=>{ load() },[]);

  const filteredContacts = contacts.filter(c => {
    const matchName = searchName ? (c.full_name||c.fullName||"").toLowerCase().includes(searchName.toLowerCase()) || (c.email||"").toLowerCase().includes(searchName.toLowerCase()) : true;
    const matchService = serviceFilter ? (c.service||"").toLowerCase() === serviceFilter.toLowerCase() : true;
    return matchName && matchService;
  });

  const filteredApplicants = applicants.filter(a => {
    const matchName = searchName ? (a.full_name||a.fullName||"").toLowerCase().includes(searchName.toLowerCase()) || (a.phone||"").toLowerCase().includes(searchName.toLowerCase()) : true;
    const matchEdu = eduFilter ? (a.education||"").toLowerCase() === eduFilter.toLowerCase() : true;
    return matchName && matchEdu;
  });

  return (
    <div className="section">
      <div className="admin-top">
        <h2>🔐 Admin Dashboard - Live Database</h2>
        <div className="stats"><span>📩 {contacts.length} Contacts</span><span>👮 {applicants.length} Applicants</span></div>
        <div className="tabs">
          <button onClick={()=>{setTab("contacts"); setSearchName(""); setServiceFilter("");}} className={tab==="contacts"?"tab on":"tab"}>Contacts - Service Quotations</button>
          <button onClick={()=>{setTab("applicants"); setSearchName(""); setEduFilter("");}} className={tab==="applicants"?"tab on":"tab"}>Applicants - Job Seekers</button>
        </div>
      </div>

      <div className="filter-bar-clean">
        {tab==="contacts" ? (
          <>
            <input className="search-visible" placeholder="🔍 Search by Name or Email..." value={searchName} onChange={e=>setSearchName(e.target.value)} />
            <select className="search-visible-dropdown" value={serviceFilter} onChange={e=>setServiceFilter(e.target.value)}>
              <option value="">🔍 Search by Service ▼</option>
              <option value="Security Guard Service - 700k per guard">Security Guard Service</option>
              <option value="Construction Security - 800k-1.2M">Construction Security</option>
              <option value="CCTV Installation - From 2.5M">CCTV Installation</option>
              <option value="Mobile Patrol - 200k monthly">Mobile Patrol</option>
              <option value="Event Security - 50k per guard per day">Event Security</option>
              <option value="Alarm System - From 1.8M">Alarm System</option>
            </select>
          </>
        ) : (
          <>
            <input className="search-visible" placeholder="🔍 Search by Name, Phone or Email..." value={searchName} onChange={e=>setSearchName(e.target.value)} />
            <select className="search-visible-dropdown" value={eduFilter} onChange={e=>setEduFilter(e.target.value)}>
              <option value="">🎓 Search by Education Level ▼</option>
              <option value="P7">P7</option><option value="O-Level">O-Level</option><option value="UCE">UCE</option><option value="UACE">UACE</option><option value="Diploma">Diploma</option><option value="Degree">Degree</option><option value="Master">Master</option>
            </select>
          </>
        )}
        <button className="btn-dark" onClick={()=>{setSearchName(""); setEduFilter(""); setServiceFilter("");}}>Clear</button>
        <button className="btn-yellow" onClick={load}>🔄 Refresh Live Data</button>
      </div>

      <div className="table-card">
        <h3>{tab==="contacts" ? `📩 Showing ${filteredContacts.length} of ${contacts.length} Contacts Needing Quotation` : `👮 Showing ${filteredApplicants.length} of ${applicants.length} Applicants For Interview`}</h3>
        <div className="scroll">
          {tab==="contacts" ? (
            <table><thead><tr><th>#</th><th>Full Name</th><th>Email</th><th>Service Needed</th><th>Message / Location</th><th>Date</th></tr></thead>
              <tbody>{filteredContacts.map((c,i)=>(<tr key={c.id||i}><td>{i+1}</td><td><b>{c.full_name||c.fullName}</b></td><td>{c.email}</td><td><span className="tag blue">{c.service}</span></td><td>{c.message?.substring(0,100)}</td><td>{c.created_at?.substring(0,10)}</td></tr>))}</tbody></table>
          ) : (
            <table><thead><tr><th>#</th><th>Full Name</th><th>Phone</th><th>Email</th><th>Education</th><th>Why Interested</th><th>Experience</th></tr></thead>
              <tbody>{filteredApplicants.map((a,i)=>(<tr key={a.id||i}><td>{i+1}</td><td><b>{a.full_name||a.fullName}</b></td><td>{a.phone}</td><td>{a.email}</td><td><span className="tag dark">{a.education}</span></td><td>{a.interest?.substring(0,60)}</td><td>{a.experience?.substring(0,80)}</td></tr>))}</tbody></table>
          )}
        </div>
      </div>
    </div>
  )
}

// JOBS PAGE - MORE CONTENT - DETAILED
const Blog = () => (
  <div className="section">
    <h2>🚨 Jobs - We Are Recruiting - 8 Positions - Free Training - No Fees</h2>
    
    <p style={{textAlign:'center', background:'#d4edda', padding:'16px', borderRadius:'12px', marginBottom:'20px', border:'3px solid #28a745', fontWeight:'800', fontSize:'18px', color:'#155724'}}>⚠️ IMPORTANT: Pinnacle Security Ltd NEVER charges recruitment fees! Training is FREE! Uniform is FREE! Anyone asking for money using our name is a CONMAN - Report immediately to 0754 139726 or hr@pinnaclegroup.co.ug. We only recruit at Plot 442 & 443 Masajjagere, Muyenga HQ 8AM-4PM.</p>

    <div className="card">
      <h3>📌 Job 1: SITE INCHARGE - 5 Positions Available - Salary 500k-700k</h3>
      <p><b>Location:</b> Kampala, Wakiso, Mukono, Entebbe sites. Must be ready to stay at site if far.<br/>
      <b>Salary & Benefits:</b> 500,000 - 700,000 UGX net per month (paid on 28th via bank/mobile money) + Accommodation if site is far + Medical allowance 50k + Free Uniform (2 shirts, 2 trousers, boots, cap, belt) + NSSF + 1 day off weekly + Lunch for day shift at some sites.<br/>
      <b>Requirements:</b> 1) UCE Certificate minimum (with at least 3 passes) - Must show original at interview. 2) 3+ years experience as security guard or site incharge in licensed PSO (Saracen, G4S, KK, Securex, etc.) - Must have reference letter. 3) Age 25-45 years. 4) Physically fit - No chronic disease. 5) No criminal record - Must have LC1 letter. 6) Must be able to read and write English, write OB book, use radio, report incidents via WhatsApp. 7) Must be disciplined - No alcohol on duty, no sleeping on duty.<br/>
      <b>Duties:</b> Manage 5-15 guards at site, make duty roster, check guard turnout, write OB, report incidents to Supervisor and Control Room 0754 139726, ensure guards don't sleep, handle client complaints, do site patrol at night, keep store register for construction sites.<br/>
      <b>Training:</b> Free 2 weeks at Muyenga HQ - Parade, discipline, OB writing, incident reporting, first aid, fire fighting, radio call, customer care.<br/>
      <b>How to Apply:</b> Apply online via Apply Now button OR come physically to Plot 442 & 443 Masajjagere, Muyenga HQ Monday-Saturday 8AM-4PM with: Original National ID, UCE Certificate, LC1 Letter, 2 Passport Photos, CV, Reference Letter from previous PSO. Interview same day if you qualify.</p>
      <div style={{textAlign:'center', marginTop:'12px'}}><Link to="/join" className="btn-yellow big">Apply Online for SITE INCHARGE</Link></div>
    </div>

    <div className="card gold">
      <h3>📌 Job 2: SUPERVISOR / DEPLOYMENT OFFICER - 3 Positions - Salary 600k-800k + Motorcycle</h3>
      <p><b>Location:</b> Must have own motorcycle OR company will give motorcycle after probation. Must ride in Kampala, Wakiso, Mukono, Entebbe daily - 100-150km per day.<br/>
      <b>Salary & Benefits:</b> 600,000 - 800,000 UGX net + Fuel allowance 200k monthly + Company Motorcycle (after 3 months probation) + Airtime 30k + Accommodation if deployed far + Medical + NSSF + Free Uniform + 1 day off weekly.<br/>
      <b>Requirements:</b> 1) UACE Certificate minimum - Must show original. 2) Valid Rider Permit with at least 3 years riding experience in Kampala - Must know routes. 3) 3+ years experience as Supervisor/Deployment Officer in licensed PSO - Must have deployed 50+ guards before. 4) Age 28-40 years. 5) Must have smartphone for WhatsApp reporting and GPS tracking. 6) Must be able to write reports, do guard deployment, handle client complaints, discipline guards. 7) No criminal record, LC1 letter required. 8) Physically fit, able to work night sometimes.<br/>
      <b>Duties:</b> Deploy guards to new sites, check guards at sites (day and night surprise checks), handle client complaints, discipline or replace lazy guards, write daily supervision report to Operations Manager, ensure all sites have enough guards, handle guard welfare issues, recruit new guards at Muyenga HQ, train guards.<br/>
      <b>Training:</b> Free 2 weeks at Muyenga HQ plus 1 week on job with Operations Manager.<br/>
      <b>How to Apply:</b> Apply online OR come to Plot 442 & 443 Masajjagere Muyenga HQ 8AM-4PM with: Original National ID, UACE Certificate, Valid Rider Permit, LC1 Letter, 2 Passport Photos, CV, Reference Letters, Logbook if you have motorcycle.</p>
      <div style={{textAlign:'center', marginTop:'12px'}}><Link to="/join" className="btn-yellow big">Apply Online for SUPERVISOR</Link></div>
    </div>

    <div className="card">
      <h3>📋 Recruitment Process - How We Hire</h3>
      <p><b>Step 1 - Application:</b> Apply online via Apply Now OR walk-in at Muyenga HQ 8AM-4PM Monday-Saturday.<br/>
      <b>Step 2 - Screening:</b> HR checks your papers, calls your references, checks LC1 letter, verifies certificates.<br/>
      <b>Step 3 - Interview:</b> Face to face with Operations Manager at Muyenga HQ - We ask about experience, discipline, salary expectation, willingness to work night/far.<br/>
      <b>Step 4 - Training:</b> If you pass interview, you join 2 weeks free training at Muyenga HQ 8AM-4PM. You cater for your transport and lunch, we provide training, uniform for training, and knowledge. No fees!<br/>
      <b>Step 5 - Deployment:</b> After training, you are deployed to site. First 3 months probation - If you are disciplined, you are confirmed and get NSSF, medical, salary increment.<br/>
      <b>Duration:</b> Whole process 3-5 days for Site Incharge, 1 week for Supervisor.</p>
    </div>

    <div className="card dark">
      <h3>⚠️ Warning Against Conmen - Read This!</h3>
      <p>Many conmen use Pinnacle Security name to con job seekers - They ask for 20k, 50k, 100k for "interview", "uniform", "training". <b>WE NEVER ASK FOR MONEY!</b> Our recruitment is FREE. Our training is FREE. Our uniform is FREE. We only recruit at <b>Plot 442 & 443 Masajjagere, Muyenga HQ</b> - NOT at other places, NOT on WhatsApp, NOT via agents. If someone asks money, he is a thief - Call Police or our Control Room <b>0754 139726</b> immediately. All our HR numbers are only: 0754 139726 and hr@pinnaclegroup.co.ug. We do NOT use personal numbers for recruitment.</p>
    </div>

    <div style={{textAlign:'center', marginTop:'20px'}}>
      <Link to="/join" className="btn-yellow big">Apply Now Online - FREE - No Fees - 2 Weeks Free Training</Link>
      <p style={{marginTop:'12px', fontWeight:'700'}}>Or Visit: Plot 442 & 443 Masajjagere, Off Kironde Road, Muyenga, Kampala - 8AM-4PM Mon-Sat - Bring Original Documents</p>
    </div>
  </div>
)

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
      .hero h1{color:#ffcc00; font-size:26px; margin-bottom:12px} .hero p{font-size:17px}
      .dots{margin:14px 0} .dot{width:12px; height:12px; background:#555; border-radius:50%; display:inline-block; margin:0 6px; cursor:pointer} .dot.on{background:#ffcc00}
      .section{padding:22px 14px; max-width:1250px; margin:auto}
      .section h2{text-align:center; color:#0a1931; border-bottom:4px solid #ffcc00; padding-bottom:10px; margin-bottom:20px; font-size:26px}
      .card{background:#fff; padding:22px; border-radius:14px; margin-bottom:18px; box-shadow:0 4px 12px rgba(0,0,0,0.07); border-left:6px solid #0a1931; font-size:17px; line-height:1.9}
      .card.gold{border-left-color:#ffcc00; background:#fffbeb} .card.dark{background:linear-gradient(135deg,#1e293b,#0f172a); color:#fff; border-left-color:#ffcc00}
      .card h3{font-size:20px; margin-bottom:14px; color:#0a1931; line-height:1.5} .card.dark h3{color:#ffcc00} .card p{margin-bottom:10px}
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
      .stats{display:flex; gap:12px; justify-content:center; margin:14px 0; flex-wrap:wrap} .stats span{background:rgba(255,204,0,0.15); border:2px solid #ffcc00; padding:8px 16px; border-radius:25px; font-size:15px; font-weight:800; color:#ffcc00}
      .tabs{display:flex; gap:12px; justify-content:center; margin-top:14px} .tab{padding:10px 22px; border-radius:25px; border:2px solid #ffcc00; background:transparent; color:#ffcc00; font-weight:800; font-size:15px; cursor:pointer} .tab.on{background:#ffcc00; color:#0a1931}
      .filter-bar-clean{display:flex; gap:12px; margin-bottom:18px; background:#0a1931; padding:20px; border-radius:16px; box-shadow:0 6px 18px rgba(0,0,0,0.15); flex-wrap:wrap; align-items:center; border:3px solid #ffcc00}
      .search-visible{flex:1; padding:16px 20px; border-radius:12px; border:3px solid #ffcc00; font-size:17px; min-width:260px; outline:none; background:#ffffff; color:#0a1931; font-weight:900; box-shadow:0 4px 12px rgba(255,204,0,0.3)}
      .search-visible::placeholder{color:#1e3a8a; font-weight:700; opacity:1}
      .search-visible-dropdown{padding:16px 20px; border-radius:12px; border:3px solid #ffcc00; font-size:17px; background:#ffcc00; font-weight:900; min-width:260px; cursor:pointer; outline:none; color:#0a1931; box-shadow:0 4px 12px rgba(255,204,0,0.3)}
      .table-card{background:#fff; border-radius:16px; padding:16px; box-shadow:0 5px 18px rgba(0,0,0,0.08)}
      .table-card h3{font-size:17px; margin-bottom:12px; color:#0a1931} .scroll{overflow-x:auto}
      .table-card table{width:100%; border-collapse:collapse; font-size:16px; min-width:850px}
      .table-card th{background:#0a1931; color:#ffcc00; padding:14px 10px; text-align:left; font-size:14px; font-weight:800}
      .table-card td{padding:12px 10px; border-bottom:1px solid #f1f5f9; font-size:16px}
      .tag{padding:5px 12px; border-radius:15px; font-size:13px; font-weight:800} .tag.blue{background:#dbeafe; color:#1e40af} .tag.gold{background:#fef3c7; color:#92400e} .tag.dark{background:#1e293b; color:#ffcc00}
      .footer{background:#0a1931; color:#aaa; text-align:center; padding:18px; font-size:13px; margin-top:24px; line-height:1.7}
      @media(max-width:850px){ .form-row-2{grid-template-columns:1fr} .menu-btn{display:block} .links{display:none; flex-direction:column; align-items:flex-start; padding-top:14px} .links.show{display:flex} .filter-bar-clean{flex-direction:column; align-items:stretch} .search-visible,.search-visible-dropdown{width:100%} }
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