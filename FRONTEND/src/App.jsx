import AdminDashboard from './pages/AdminDashboard.jsx';
import React, { useState, useEffect } from 'react'

const ADMIN_PASSWORD = "Pinnacle2026!Secure123";
const GOOGLE_SHEET_WEBHOOK = "https://script.google.com/macros/s/AKfycbz0Fx9gSfPwPXZdi8pivw9IdQ_fzj707fPk22GBECuGYhGzwePtEPZV47TyXk8TN8bggQ/exec";
const KOBO_APTITUDE_TEST = "https://ee.kobotoolbox.org/x/ODCdeyaJ";
const GOOGLE_APTITUDE_REGISTER = "https://forms.gle/W8JroZ8n8HGArq248";

const getFullDateTime24 = () => {
  const d = new Date();
  const kampala = new Date(d.toLocaleString('en-US', {timeZone:'Africa/Kampala'}));
  return kampala.getDate().toString().padStart(2,'0') + '/' + (kampala.getMonth()+1).toString().padStart(2,'0') + '/' + kampala.getFullYear() + ' ' + kampala.getHours().toString().padStart(2,'0') + ':' + kampala.getMinutes().toString().padStart(2,'0') + ':' + kampala.getSeconds().toString().padStart(2,'0') + '.' + kampala.getMilliseconds() + '-' + Math.floor(Math.random()*900+100);
};

/* ================= ADMIN - NOW FROM pages/AdminDashboard.jsx ================= */

const Dropdown = ({ title, children, color="#0a1931" }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{background:'#fff', borderRadius:'12px', marginBottom:'12px', border:'2px solid '+color, overflow:'hidden'}}>
      <div onClick={()=>setOpen(!open)} style={{padding:'14px 18px', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', background: open ? color : '#fff', color: open ? '#ffcc00' : color, fontWeight:900, fontSize:'15px'}}>
        <span>{title}</span><span style={{fontSize:'20px'}}>{open ? '-' : '+'}</span>
      </div>
      {open && <div style={{padding:'16px 18px', fontSize:'16px', lineHeight:'1.8', color:'#333', background:'#f8fafc', borderTop:'1px solid #eee'}}>{children}</div>}
    </div>
  )
}

/* ================= NAVBAR - THEME ADDED HERE ONLY ================= */
const Navbar = ({ theme, toggleTheme }) => {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(null);
  const scrollTo = (id) => { setOpen(false); setHover(null); const el = document.getElementById(id); if (el) { const offset = 75; const top = el.getBoundingClientRect().top + window.scrollY - offset; window.scrollTo({ top, behavior: 'smooth' }); } };
  const dropWrap = {position:'relative'};
  const dropBtn = (active) => ({color: active ? '#ffcc00' : '#fff', textDecoration:'none', fontSize:'16px', fontWeight:700, padding:'8px 12px', cursor:'pointer', display:'inline-block'});
  const mega = {position:'absolute', top:'100%', left:'50%', transform:'translateX(-50%)', width:'860px', maxWidth:'92vw', background:'#fff', borderRadius:'14px', boxShadow:'0 14px 35px rgba(0,0,0,0.25)', padding:'22px', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'20px', zIndex:10000, textAlign:'left'};
  const colTitle = {color:'#0a1931', fontSize:'13px', fontWeight:900, borderBottom:'3px solid #ffcc00', paddingBottom:'6px', marginBottom:'10px', letterSpacing:'0.5px'};
  const colLink = {display:'block', color:'#333', fontSize:'14px', fontWeight:700, padding:'8px 6px', cursor:'pointer', borderRadius:'8px'};
  const colDesc = {display:'block', color:'#777', fontSize:'12px', fontWeight:400, lineHeight:'1.4'};
  return (
    <nav className="nav"><div className="nav-top"><span className="logo">PINNACLE SECURITY LTD</span><span className="menu-btn" onClick={() => setOpen(!open)}>{open ? 'X' : 'M'}</span></div>
      <div className={'links '+(open ? 'show' : '')}>
        <a onClick={() => scrollTo('home')}>Home</a>
        <div style={dropWrap} onMouseEnter={()=>setHover('about')} onMouseLeave={()=>setHover(null)}>
          <span style={dropBtn(hover==='about')} onClick={()=>scrollTo('about')}>About ▼</span>
          {hover==='about' && (<div style={mega}><div><div style={colTitle}>ABOUT PINNACLE</div><span style={colLink} onClick={()=>scrollTo('about')}>About Pinnacle <span style={colDesc}>Since 2009, 150+ officers, 60+ sites, UN 2013-2025, Serena Kigo</span></span><span style={colLink} onClick={()=>scrollTo('about')}>Our History & Welfare <span style={colDesc}>Free Food & Accommodation for all staff, started 2009 with 5 guards</span></span><span style={colLink} onClick={()=>scrollTo('about')}>Our Numbers <span style={colDesc}>150+ officers, 15 motorcycles, 3 patrol cars, 24/7 control</span></span></div><div><div style={colTitle}>MISSION & VALUES</div><span style={colLink} onClick={()=>scrollTo('mission')}>Mission, Vision, Values <span style={colDesc}>DISCIPLINE - Our daily life, Vision 2030</span></span><span style={colLink} onClick={()=>scrollTo('mission')}>Why Clients Trust Us <span style={colDesc}>24/7 Control Room, 10-Min Response, Replacement Guarantee</span></span><span style={colLink} onClick={()=>scrollTo('mission')}>Our Promise To You <span style={colDesc}>We protect it as if it is our own</span></span></div><div><div style={colTitle}>BIG CLIENTS</div><span style={colLink} onClick={()=>scrollTo('about')}>United Nations (UN) <span style={colDesc}>2013 to 2025 - 12 years, offices, warehouses, residences</span></span><span style={colLink} onClick={()=>scrollTo('about')}>Entebbe Express Highway <span style={colDesc}>Toll areas, materials, equipment, workers day & night</span></span><span style={colLink} onClick={()=>scrollTo('about')}>Serena Hotel - Still in Kigo <span style={colDesc}>5-star standard, polite, smart, confidential</span></span></div></div>)}
        </div>
        <div style={dropWrap} onMouseEnter={()=>setHover('services')} onMouseLeave={()=>setHover(null)}>
          <span style={dropBtn(hover==='services')} onClick={()=>scrollTo('services')}>Services ▼</span>
          {hover==='services' && (<div style={mega}><div><div style={colTitle}>🛡️ GUARDING</div><span style={colLink} onClick={()=>scrollTo('services')}>Security Guard Service <span style={colDesc}>Homes, Shops, Offices - Day / Night, 1-4 guards per shift</span></span><span style={colLink} onClick={()=>scrollTo('services')}>Site Incharge & Supervisor <span style={colDesc}>Manages 5-15 guards, roster, OB, client handling</span></span><span style={colLink} onClick={()=>scrollTo('services')}>Construction Site Security <span style={colDesc}>Stop cement, iron bars, timber, fuel theft - count morning & evening</span></span></div><div><div style={colTitle}>📹 TECHNOLOGY</div><span style={colLink} onClick={()=>scrollTo('services')}>CCTV Installation <span style={colDesc}>4 cameras 1.2M, 8 cameras 2.1M, phone viewing, 1yr warranty</span></span><span style={colLink} onClick={()=>scrollTo('services')}>Mobile Patrol <span style={colDesc}>Patrol car visits 3x night, checks gate, lights, windows</span></span><span style={colLink} onClick={()=>scrollTo('services')}>Alarm Systems <span style={colDesc}>650k installed, calls 3 numbers, quick response</span></span></div><div><div style={colTitle}>⭐ SPECIAL</div><span style={colLink} onClick={()=>scrollTo('services')}>Hotel & Corporate - Serena Standard <span style={colDesc}>Polite, clean, 5-star service, customer care</span></span><span style={colLink} onClick={()=>scrollTo('services')}>Event Security <span style={colDesc}>40k per guard per day - weddings, concerts, crusades</span></span><span style={colLink} onClick={()=>scrollTo('services')}>Escort & VIP Protection <span style={colDesc}>Cash, goods, VIP escort - safe, discreet, on time</span></span></div></div>)}
        </div>
        <div style={dropWrap} onMouseEnter={()=>setHover('career')} onMouseLeave={()=>setHover(null)}>
          <span style={dropBtn(hover==='career')} onClick={()=>scrollTo('jobs')}>Career ▼</span>
          {hover==='career' && (<div style={mega}><div><div style={colTitle}>💼 JOBS - WE ARE HIRING</div><span style={colLink} onClick={()=>scrollTo('jobs')}>Site Incharge - 5 Posts <span style={colDesc}>UCE + 3yrs + Free Food & Accommodation + Motorcycle</span></span><span style={colLink} onClick={()=>scrollTo('jobs')}>Supervisor - 10 Posts <span style={colDesc}>UACE + Rider Permit + 3yrs, training on progress</span></span><span style={colLink} onClick={()=>scrollTo('jobs')}>Security Officer - 50 Posts <span style={colDesc}>P7 & above, Free Food & Accommodation + NSSF + Insurance</span></span></div><div><div style={colTitle}>📝 APPLY & TEST</div><span style={colLink} onClick={()=>scrollTo('aptitude')}>Aptitude Test <span style={colDesc}>Must for all applicants - FREE online, 20-30 mins</span></span><span style={colLink} onClick={()=>scrollTo('join')}>Apply Now <span style={colDesc}>No Fees - Interview daily 8am Muyenga HQ</span></span><span style={colLink} onClick={()=>scrollTo('jobs')}>Training - 2 Weeks FREE <span style={colDesc}>At Muyenga HQ, discipline + OB + radio + first aid</span></span></div><div><div style={colTitle}>🎓 GROW WITH US</div><span style={colLink} onClick={()=>scrollTo('jobs')}>Interview Process <span style={colDesc}>Same day / next day, bring ID + CV + papers + 2 photos</span></span><span style={colLink} onClick={()=>scrollTo('jobs')}>Deployment <span style={colDesc}>After training, uniform + baton + torch + radio, start earning</span></span><span style={colLink} onClick={()=>scrollTo('contact')}>Contact HR <span style={colDesc}>0776971970 - hr@pinnaclegroup.co.ug, Muyenga HQ</span></span></div></div>)}
        </div>
        <a onClick={() => scrollTo('mission')}>Mission</a>
        <a onClick={() => scrollTo('jobs')}>Jobs</a>
        <a onClick={() => scrollTo('aptitude')}>Aptitude Test</a>
        <a onClick={() => scrollTo('contact')}>Contact</a>
        <a onClick={() => scrollTo('join')} className="btn-yellow">Apply Now</a>
        <a href="/admin" style={{color:'#ffcc00', fontWeight:'900', border:'1px solid #ffcc00', borderRadius:'20px'}}>Admin</a>
        <button onClick={toggleTheme} style={{background: theme==='dark' ? '#ffcc00' : 'transparent', color: theme==='dark' ? '#0a1931' : '#ffcc00', border:'1px solid #ffcc00', padding:'8px 14px', borderRadius:'20px', fontWeight:900, cursor:'pointer'}}>
          {theme==='dark' ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>
    </nav>
  )
}

const Home = () => {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI(p => (p + 1) % 3), 3500); return () => clearInterval(t) }, []);
  const slides = [
    { t: "Pinnacle Security Limited", d: "Plot 442 & 443 Masionatess, Muyenga - Licensed Security Company | 60+ Sites | 150+ Officers | 24/7 Control Room" },
    { t: "WE ARE RECRUITING - JOIN US TODAY", d: "SITE INCHARGE, SUPERVISOR, SECURITY OFFICER - Free Food & Accommodation + Free Training + No Fees" },
    { t: "Your Safety is Our Priority - 0776971970", d: "hr@pinnaclegroup.co.ug | Free Food & Accommodation | Free Training | No Recruitment Fees | Licensed by Uganda Police" },
  ];
  return (
    <div className="section" style={{paddingTop:'30px'}}>
      <div className="hero"><h1>{slides[i].t}</h1><p>{slides[i].d}</p><div className="dots">{[0, 1, 2].map(n => <span key={n} className={n === i ? 'dot on' : 'dot'} onClick={() => setI(n)}></span>)}</div>
        <div style={{display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap', marginTop:'12px'}}><a onClick={() => document.getElementById('join').scrollIntoView({behavior:'smooth'})} className="btn-yellow big" style={{cursor:'pointer'}}>Apply Now</a><a onClick={() => document.getElementById('aptitude').scrollIntoView({behavior:'smooth'})} className="btn-yellow big" style={{background:'#fff', cursor:'pointer'}}>Aptitude Test</a></div>
      </div>
      <div style={{marginTop:'22px'}}>
        <div className="home-grid-3">
          <div className="card"><h3>Who We Are - Licensed & Trusted</h3><p>Pinnacle Security Ltd is a fully licensed private security company at <b>Plot 442 & 443 Massionatees, Muyenga Hill</b>. Since 2009, we have grown to 60+ sites and 150+ trained officers. We provide <b>free food and accommodation</b> to all guards, supervisors and site incharges.</p><p style={{marginTop:'10px'}}>We have served big national clients including the <b>United Nations (UN) from 2013 to 2025</b>, the <b>Entebbe Express Highway</b>, and <b>Serena Hotel</b>. We are proud of that history, and we continue to serve with the same discipline today.</p><p style={{marginTop:'10px'}}><b>More Explanation:</b> Being licensed means we are registered and approved by Uganda Police to operate as a private security company. We are not a briefcase company. You can visit our headquarters in Muyenga, see our control room, meet our managers, and check our files.</p></div>
          <div className="card gold"><h3>Core Services</h3><p><b>Guard Service:</b> Day/night guards for homes, shops, offices — with free food & accommodation</p><p><b>Site Incharge & Supervisor:</b> Experienced managers with motorcycle + free food & accommodation</p><p><b>Construction Security:</b> Protect cement, iron bars, timber, fuel</p><p><b>CCTV, Mobile Patrol, Alarm:</b> Affordable packages</p><p style={{marginTop:'10px'}}><b>More Explanation:</b> Each service is explained in full on the Services page. If you are not sure which service you need, call 0776971970 for a Free Site Survey.</p></div>
          <div className="card dark"><h3>URGENT RECRUITMENT - No Fees</h3><p><b>SITE INCHARGE:</b> UCE + 3yrs — Attractive salary + Free Food & Accommodation</p><p style={{marginTop:'10px'}}><b>SUPERVISOR:</b> UACE + Rider Permit + 3yrs — Attractive salary + Free Food & Accommodation</p><p style={{marginTop:'10px'}}><b>SECURITY OFFICER:</b> P7 & above — Attractive salary + Free Food & Accommodation</p><p style={{marginTop:'10px'}}><b>More Explanation:</b> All jobs are real, no fees, and interview is daily at 8am at Muyenga HQ.</p><a onClick={() => document.getElementById('join').scrollIntoView({behavior:'smooth'})} className="btn-yellow big" style={{marginTop:'18px', width:'100%', textAlign:'center', display:'block', cursor:'pointer'}}>Apply Now</a></div>
        </div>
      </div>
    </div>
  )
}

const About = () => {
  return (
    <div className="section">
      <h2>About Pinnacle Security Ltd - Detailed</h2>
      <div className="about-hero"><h3>Pinnacle Security Ltd - Protecting What Matters Most Since 2009</h3><p>Plot 442 & 443 Massionatees, Muyenga Hill, Kampala | Control 24/7: 0776971970 | Free Food & Accommodation For All Staff | No Recruitment Fees</p><p style={{marginTop:'10px'}}>We started small in 2009 with only 5 guards and 1 client. God has grown us step by step. Today we protect homes, businesses, construction sites, hotels and national roads across Uganda.</p></div>
      <div className="home-grid-3">
        <div className="card"><h3>Our History & Welfare</h3><p>Started in 2009 with 5 guards and 1 client. Today 150+ officers, 60+ sites, patrol cars, CCTV team. Licensed by Uganda Police. We provide <b>free food and accommodation</b> to all staff.</p><p style={{marginTop:'10px'}}><b>1. UNITED NATIONS (UN) — 2013 to 2025:</b> For 12 years, our officers guarded UN offices, compounds, warehouses and staff residences.</p><p style={{marginTop:'8px'}}><b>2. ENTEBBE EXPRESS HIGHWAY:</b> Our teams guarded toll areas, construction materials, equipment, and workers day and night.</p><p style={{marginTop:'8px'}}><b>3. SERENA HOTEL:</b> We are still present and still serving in <b>Serena Hotel in Kigo</b>.</p></div>
        <div className="card gold"><h3>Why Clients Trust Us</h3><p>1. <b>24/7 Control Room</b> — Call 0776971970 any time<br/>2. <b>10-Minute Response</b> — Patrol and supervisor rush to your site<br/>3. <b>Free Food & Accommodation For Guards</b> — A guard who is fed and housed does not sleep, does not steal<br/>4. <b>Trained Officers:</b> 2 weeks training at Muyenga HQ<br/>5. <b>Affordable & Disciplined</b> — Clear price, no hidden fees<br/>6. <b>Supervisor Visits 2x Daily</b><br/>7. <b>Replacement Guarantee</b> — If a guard misbehaves, we replace him same day, free.</p></div>
        <div className="card dark"><h3>Our Numbers</h3><p>150+ Active Officers<br/>60+ Protected Sites<br/>15 Motorcycles + 3 Patrol Cars<br/>24/7 Control Room<br/>Free Food & Accommodation For All Staff<br/><br/><b>Major Contracts Served:</b><br/>• UN — 2013 to 2025 (12 Years)<br/>• Entebbe Express Highway<br/>• Serena Hotel — Still in Kigo</p></div>
      </div>
    </div>
  )
}

const Services = () => {
  return (
    <div className="section">
      <h2>Our Security Services - Full Explanation</h2>
      <p style={{textAlign:'center', marginBottom:'18px', fontSize:'18px'}}>We offer 6 main services. All guards get free food & accommodation + attractive salary.</p>
      <div className="card"><h3>1. Security Guard Service - Homes, Shops, Offices</h3><p>What you get: 1-4 guards per shift, uniformed, baton, radio, torch, OB book. Supervisor visits 2x daily, patrol 1x night. Guards get free food & accommodation at site.</p><p style={{marginTop:'10px'}}>How it works: We visit your home or shop FREE, we check gates, walls, lights, and risk. Then we recommend 1 guard day + 1 guard night, or 2 guards if the place is big.</p></div>
      <div className="card gold"><h3>2. Site Incharge & Supervisor Service</h3><p>What you get: Experienced manager manages 5-15 guards, duty roster, OB, client handling. Gets free food & accommodation + motorcycle + fuel + airtime + attractive salary.</p></div>
      <div className="card"><h3>3. Construction Site Security</h3><p>Problem: 30% materials stolen at night. We stop it. Guards count cement, iron bars, check lorries. Guards get free food & accommodation at site.</p></div>
      <div className="card gold"><h3>4. CCTV, Mobile Patrol, Event, Alarm</h3><p><b>CCTV:</b> 4 cameras 1.2M, 8 cameras 2.1M, phone viewing, 1yr warranty.<br/><b>Mobile Patrol:</b> Patrol car visits 3x night.<br/><b>Event Security:</b> 40k per guard per day.<br/><b>Alarm:</b> 650k installed, calls 3 numbers.</p><p style={{marginTop:'10px'}}>Call 0776971970 for a free quote.</p></div>
      <div className="card"><h3>5. Hotel & Corporate Security — Serena Standard</h3><p>Hotels need polite, clean, smart guards who greet guests, check bags politely, control parking, and protect VIPs without disturbing guests. That is the Serena standard we learned at Serena Hotel in Kigo.</p></div>
      <div className="card gold"><h3>6. Escort & Cash / VIP Protection</h3><p>We escort cash, goods, and VIPs from one place to another with trained officers and radio communication to control room. Safe, discreet, on time.</p></div>
    </div>
  )
}

const MissionPage = () => {
  return (
    <div className="section">
      <h2>Our Mission, Vision, Values</h2>
      <p style={{textAlign:'center', marginBottom:'18px', fontSize:'18px'}}>We do not just guard buildings. We guard lives, families, businesses, and dreams.</p>
      <div className="mission-grid">
        <div className="mission-card"><h3>Our Mission</h3><p>To provide professional, affordable, disciplined security with 24/7 control room, trained guards, patrol, CCTV. We ensure all guards get free food & accommodation.</p></div>
        <div className="mission-card gold"><h3>Our Vision 2030</h3><p>To be Uganda's most trusted company by 2030 with 500+ officers, 200+ sites, own training school.</p></div>
        <div className="mission-card dark"><h3>Core Values - DISCIPLINE</h3><div className="values-list"><div><b>D - Discipline:</b> On time, smart uniform, OB book, no phone on duty, no sleeping.</div><div><b>I - Integrity:</b> We do not steal, we do not lie, we do not take bribes.</div><div><b>S - Service:</b> We serve you politely.</div><div><b>C - Courage:</b> We do not run when thieves come.</div><div><b>P - Professionalism:</b> Trained, uniformed, radio, report.</div><div><b>L - Loyalty:</b> Loyal to you, loyal to Pinnacle, loyal to God.</div><div><b>I - Innovation:</b> CCTV, patrol, phone reporting.</div><div><b>N - No Fees:</b> No recruitment fees. No hidden fees.</div><div><b>E - Excellence:</b> Every night, every site, excellence.</div></div><p style={{marginTop:'10px', color:'#ffcc00', fontWeight:800}}>DISCIPLINE is not a word on the wall — it is our daily life.</p></div>
      </div>
    </div>
  )
}

const Blog = () => {
  return (
    <div className="section">
      <div className="memo-clean">
        <div className="memo-head"><h2>INTERNAL MEMO - PINNACLE SECURITY LTD</h2><p><b>From:</b> HR Manager | <b>To:</b> All Applicants | <b>Date:</b> {new Date().toLocaleDateString()} | <b>Ref:</b> PSL/HR/2026/08</p><p><b>Subject: URGENT RECRUITMENT - SITE INCHARGE, SUPERVISOR, SECURITY OFFICER - FREE FOOD & ACCOMMODATION - NO FEES</b></p></div>
        <div className="memo-body-dark">
          <div className="memo-intro">Management approved urgent recruitment of 30 officers. <b>All positions come with free food & accommodation + attractive salary + free training + uniform. No Fees. Interview daily at 8am at Muyenga HQ.</b></div>
          <Dropdown title="POSITION 1: SITE INCHARGE - 5 Posts" color="#ffcc00"><div style={{color:'#0a1931', textAlign:'left'}}><p><b>Benefits:</b> Attractive salary + Free Food & Accommodation + Motorcycle + Fuel + Airtime</p><p style={{marginTop:'8px'}}><b>Requirements:</b> UCE and above, 3+ years as supervisor or guard, can read/write English, can manage 5-15 guards.</p></div></Dropdown>
          <Dropdown title="POSITION 2: SUPERVISOR - 10 Posts" color="#0a1931"><div style={{color:'#0a1931', textAlign:'left'}}><p><b>Benefits:</b> Attractive salary + Free Food & Accommodation + Motorcycle + Fuel + Airtime</p><p style={{marginTop:'8px'}}><b>Requirements:</b> UACE and above, Rider Permit, 3+ years experience, can ride motorcycle, can do night checks.</p></div></Dropdown>
          <Dropdown title="POSITION 3: SECURITY OFFICER - 50 Posts" color="#0a1931"><div style={{color:'#0a1931', textAlign:'left'}}><p><b>Benefits:</b> Attractive salary + Free Food & Accommodation + NSSF + Insurance + Uniform + Training</p><p style={{marginTop:'8px'}}><b>Requirements:</b> P7 and above, 18+ years, physically fit, disciplined, can read/write, no criminal record.</p></div></Dropdown>
          <div className="card" style={{marginTop:'16px', background:'#fff', color:'#0a1931'}}><h3 style={{color:'#0a1931'}}>🟡 TRAINING / INTERVIEWING — SUPERVISOR IS ON PROGRESS</h3><p><b>Please note:</b> Training and interviewing for <b>Supervisor</b> is currently <b>ON PROGRESS</b>. If you applied for Supervisor, please be patient — HR will call you.</p><p style={{marginTop:'10px'}}><b>Step 1 — Application:</b> Apply online OR walk to Muyenga HQ at 8am with National ID, CV, papers, 2 photos. No fees.</p><p style={{marginTop:'8px'}}><b>Step 2 — Interview:</b> HR interviews you at Muyenga HQ.</p><p style={{marginTop:'8px'}}><b>Step 3 — Aptitude Test:</b> You must do the Online Aptitude Test.</p><p style={{marginTop:'8px'}}><b>Step 4 — Document Check & Medical:</b> We check ID, LC letter, papers.</p><p style={{marginTop:'8px'}}><b>Step 5 — Training (2 Weeks, FREE):</b> Discipline, parade, OB book, radio, gate control, patrol, first aid.</p><p style={{marginTop:'8px'}}><b>Step 6 — Deployment:</b> After training, uniform, baton, torch, radio, start earning.</p></div>
        </div>
      </div>
    </div>
  )
}

const Aptitude = () => (
  <div className="section">
    <h2>Online Aptitude Test - Must for All Applicants</h2>
    <p style={{textAlign:'center', marginBottom:'18px', fontSize:'18px'}}>Every applicant MUST do this test. No test = No job. The test is FREE, online, from your phone.</p>
    <div className="card"><h3>What Is Aptitude Test? Why Must You Do It?</h3><p>Aptitude test is a short exam that shows us if you can think, read, write, calculate, and behave like a disciplined security officer. A guard writes OB book, counts materials, checks IDs, calls control room on radio, and reports incidents.</p></div>
    <div className="home-grid-3">
      <div className="card"><h3>Step 1: Register</h3><p>First, register your name, phone, position you want (Security Officer / Supervisor / Site Incharge), and district.</p><a href={GOOGLE_APTITUDE_REGISTER} target="_blank" rel="noreferrer" className="btn-yellow big" style={{display:'block', textAlign:'center', marginTop:'12px'}}>Register Now</a></div>
      <div className="card gold"><h3>Step 2: Do Test</h3><p>Do the test on KoboToolbox. 20-30 mins. English, maths, reasoning, discipline, security knowledge.</p><a href={KOBO_APTITUDE_TEST} target="_blank" rel="noreferrer" className="btn-yellow big" style={{display:'block', textAlign:'center', marginTop:'12px', background:'#0a1931', color:'#ffcc00'}}>Start Test</a></div>
      <div className="card dark"><h3>Step 3: Interview</h3><p>After test, come for interview daily 8am Muyenga HQ with ID, CV, papers, 2 photos. No Fees.</p></div>
    </div>
  </div>
)

const Join = () => {
  const [form, setForm] = useState({FullName:'', Phone:'', Email:'', Position:'Security Officer', District:'', Education:'', Experience:''});
  const [sent, setSent] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    const payload = Object.assign({}, form, {timestamp: getFullDateTime24(), Timestamp: getFullDateTime24(), type:'applicant'});
    try { await fetch(GOOGLE_SHEET_WEBHOOK,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain'},body:JSON.stringify(payload)}); } catch(err){}
    setSent(true);
  };
  return (
    <div className="section" id="join">
      <h2>Apply Now - No Fees</h2>
      <div className="card" style={{maxWidth:'600px', margin:'0 auto'}}>
        {sent ? <p style={{textAlign:'center', fontWeight:900}}>✅ Application Sent! Now do Aptitude Test, then come for interview 8am Muyenga HQ.</p> : (
        <form onSubmit={submit} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
          <input required placeholder="Full Name" value={form.FullName} onChange={e=>setForm({...form, FullName:e.target.value})} style={{padding:'12px', borderRadius:'10px', border:'1px solid #ccc'}} />
          <input required placeholder="Phone e.g 0776971970" value={form.Phone} onChange={e=>setForm({...form, Phone:e.target.value})} style={{padding:'12px', borderRadius:'10px', border:'1px solid #ccc'}} />
          <input placeholder="Email (optional)" value={form.Email} onChange={e=>setForm({...form, Email:e.target.value})} style={{padding:'12px', borderRadius:'10px', border:'1px solid #ccc'}} />
          <select value={form.Position} onChange={e=>setForm({...form, Position:e.target.value})} style={{padding:'12px', borderRadius:'10px'}}><option>Security Officer</option><option>Supervisor</option><option>Site Incharge</option></select>
          <input placeholder="District" value={form.District} onChange={e=>setForm({...form, District:e.target.value})} style={{padding:'12px', borderRadius:'10px', border:'1px solid #ccc'}} />
          <input placeholder="Education e.g UCE, UACE, P7" value={form.Education} onChange={e=>setForm({...form, Education:e.target.value})} style={{padding:'12px', borderRadius:'10px', border:'1px solid #ccc'}} />
          <input placeholder="Experience" value={form.Experience} onChange={e=>setForm({...form, Experience:e.target.value})} style={{padding:'12px', borderRadius:'10px', border:'1px solid #ccc'}} />
          <button type="submit" className="btn-yellow big">Submit Application</button>
        </form>)}
      </div>
    </div>
  )
}

const Contact = () => {
  const [form, setForm] = useState({ FullName:'', Phone:'', Email:'', Service:'Security Guard Service', Messages:'' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if(!form.FullName || !form.Phone || !form.Messages){ alert("Fill Name, Phone and Message"); return; }
    setSending(true);
    const ts = getFullDateTime24();
    const payload = Object.assign({}, form, { timestamp:ts, Timestamp:ts, type:'contact', Type:'contact' });
    try { await fetch(GOOGLE_SHEET_WEBHOOK,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain'},body:JSON.stringify(payload)}); } catch(err){}
    setSending(false); setSent(true);
  };
  const inp = { padding:'12px 14px', borderRadius:'10px', border:'1px solid #ccc', width:'100%', fontSize:'15px', background:'#fff', color:'#0a1931' };
  return (
    <div className="section" id="contact">
      <h2>Contact Us - Free Site Survey</h2>
      <p style={{textAlign:'center', marginBottom:'18px'}}>Tell us what you need. We call you back same day. No fees for survey.</p>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px'}} className="contact-grid">
        <div className="card">
          <h3>📍 Visit / Call Us</h3>
          <p><b>Plot 442 & 443 Massionatees, Muyenga Hill, Kampala</b></p>
          <p>Control 24/7: <b>0776971970</b> | Email: <b>hr@pinnaclegroup.co.ug</b></p>
          <p>Interview: Monday - Saturday, 8am, Muyenga HQ. Bring ID + CV + Papers + 2 Photos. No Fees.</p>
          <p style={{marginTop:'12px'}}><b>After you send:</b><br/>1. Message goes to Admin as CONTACT<br/>2. HR calls you back same day<br/>3. We visit FREE & give fair price</p>
          <a href="tel:0776971970" className="btn-yellow big" style={{display:'block', textAlign:'center', marginTop:'14px'}}>📞 Call 0776971970 Now</a>
          <a href="https://wa.me/256776971970" target="_blank" rel="noreferrer" className="btn-yellow big" style={{display:'block', textAlign:'center', marginTop:'10px', background:'#25D366', color:'#fff'}}>💬 WhatsApp Us</a>
        </div>
        <div className="card">
          <h3>✉️ Send Us A Message</h3>
          {sent ? (
            <div style={{textAlign:'center', padding:'20px'}}><div style={{fontSize:'48px'}}>✅</div><h3>Message Sent!</h3><p>Thank you {form.FullName}. We received your message about <b>{form.Service}</b>.</p><p>HR will call you on <b>{form.Phone}</b> soon.</p><button onClick={()=>{setSent(false); setForm({FullName:'',Phone:'',Email:'',Service:'Security Guard Service',Messages:''})}} className="btn-yellow big" style={{marginTop:'12px', cursor:'pointer'}}>Send Another Message</button></div>
          ) : (
            <form onSubmit={submit} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
              <label><b>Full Name *</b><input required placeholder="e.g John Kato" value={form.FullName} onChange={e=>setForm({...form, FullName:e.target.value})} style={inp} /></label>
              <label><b>Phone *</b><input required placeholder="e.g 0776971970" value={form.Phone} onChange={e=>setForm({...form, Phone:e.target.value})} style={inp} /></label>
              <label><b>Email (optional)</b><input placeholder="e.g john@gmail.com" value={form.Email} onChange={e=>setForm({...form, Email:e.target.value})} style={inp} /></label>
              <label><b>Service You Need *</b><select value={form.Service} onChange={e=>setForm({...form, Service:e.target.value})} style={inp}><option>Security Guard Service</option><option>Site Incharge & Supervisor</option><option>Construction Site Security</option><option>CCTV Installation</option><option>Mobile Patrol</option><option>Event Security</option><option>Alarm System</option><option>Hotel & Corporate Security</option><option>Escort & VIP Protection</option><option>Job Application / Other</option></select></label>
              <label><b>Message *</b><textarea required rows={4} placeholder="e.g I need 2 guards day and night for my home in Muyenga. Please visit for free survey." value={form.Messages} onChange={e=>setForm({...form, Messages:e.target.value})} style={{...inp, minHeight:'90px'}} /></label>
              <button type="submit" disabled={sending} className="btn-yellow big" style={{cursor:'pointer', opacity:sending?0.6:1}}>{sending?'Sending...':'Send Message →'}</button>
              <p style={{fontSize:'12px', textAlign:'center', color:'#777'}}>Goes directly to Admin Dashboard. No fees.</p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

/* ================= APP - THEME FIXED AT ONCE ================= */
export default function App(){
  const [theme, setTheme] = useState(() => localStorage.getItem('pinnacle-theme') || 'light');
  useEffect(()=>{ localStorage.setItem('pinnacle-theme', theme); },[theme]);
  const toggleTheme = () => setTheme(t => t==='light' ? 'dark' : 'light');

  if(window.location.pathname === '/admin') return <AdminDashboard />;

  return (
    <div data-theme={theme} style={{background: theme==='dark' ? '#0A1931' : '#f5f5f5', minHeight:'100vh'}}>
      <style>{`
        *{box-sizing:border-box} body{margin:0; font-family:Arial} a{cursor:pointer}
        .nav{background:#0A1931; padding:14px 20px; position:sticky; top:0; z-index:9999}
        .nav-top{display:flex; justify-content:space-between; align-items:center}
        .logo{color:#FFD700; font-weight:900; font-size:20px} .menu-btn{display:none; color:#FFD700; font-size:22px; cursor:pointer}
        .links{display:flex; gap:14px; align-items:center; flex-wrap:wrap; color:#fff; font-weight:700}
        .links a{color:#fff; text-decoration:none}
        .btn-yellow{background:#FFD700; color:#0A1931; padding:10px 18px; border-radius:20px; font-weight:900; border:none; text-decoration:none}
        .btn-yellow.big{padding:12px 24px; font-size:16px}
        .section{max-width:1200px; margin:0 auto; padding:20px}
        .section h2{text-align:center; color:#0A1931; font-size:28px; margin-bottom:'18px}
        .hero{background:#1a2f7a; color:#fff; border-radius:16px; padding:36px 20px; text-align:center}
        .hero h1{color:#FFD700; font-size:32px} .hero p{font-size:18px}
        .dots{display:flex; gap:8px; justify-content:center; margin-top:14px} .dot{width:10px; height:10px; border-radius:50%; background:#fff; opacity:.5; cursor:pointer} .dot.on{opacity:1; background:#FFD700}
        .home-grid-3{display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px}
        .card{background:#fff; padding:20px; border-radius:12px; color:#0A1931; line-height:1.7}
        .card.gold{background:#fffbe6} .card.dark{background:#1a1a1a; color:#fff; border-left:4px solid #FFD700}
        .card.dark h3{color:#FFD700}
        .about-hero{background:#fff; padding:20px; border-radius:12px; margin-bottom:16px; text-align:center}
        .mission-grid{display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px}
        .mission-card{background:#fff; padding:20px; border-radius:12px; line-height:1.7} .mission-card.gold{background:#fffbe6} .mission-card.dark{background:#1a1a1a; color:#fff}
        .memo-clean{background:#fff; border-radius:14px; overflow:hidden}
        .memo-head{background:#0A1931; color:#fff; padding:20px} .memo-head h2{color:#FFD700; text-align:left; font-size:20px}
        .memo-body-dark{padding:20px} .memo-intro{margin-bottom:16px}
        @media(max-width:800px){ .home-grid-3,.mission-grid{grid-template-columns:1fr} .menu-btn{display:block} .links{display:none} .links.show{display:flex; flex-direction:column; align-items:flex-start; margin-top:12px} .hero h1{font-size:24px} }
        [data-theme="dark"] .section h2{color:#fff !important}
        [data-theme="dark"] .section{color:#fff !important}
        [data-theme="dark"] .card, [data-theme="dark"] .about-hero, [data-theme="dark"] .mission-card, [data-theme="dark"] .memo-clean{ background:#16294a !important; color:#fff !important; border-color:#2a3f66 !important; }
        [data-theme="dark"] .card p, [data-theme="dark"] .card div, [data-theme="dark"] .mission-card p, [data-theme="dark"] .about-hero p{ color:#e0e0e0 !important; }
        [data-theme="dark"] .card h3, [data-theme="dark"] .mission-card h3, [data-theme="dark"] .about-hero h3{ color:#fff !important; }
        [data-theme="dark"] .card.gold, [data-theme="dark"] .mission-card.gold{ background:#2a2a1a !important; color:#fff !important; }
        [data-theme="dark"] .card.dark, [data-theme="dark"] .mission-card.dark{ background:#000 !important; }
        [data-theme="dark"] .memo-head{ background:#000 !important; }
      `}</style>

      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <div id="home"><Home /></div>
      <div id="about"><About /></div>
      <div id="services"><Services /></div>
      <div id="mission"><MissionPage /></div>
      <div id="jobs"><Blog /></div>
      <div id="aptitude"><Aptitude /></div>
      <Join />
      <Contact />
      <div style={{background:'#0A1931', color:'#fff', textAlign:'center', padding:'20px', marginTop:'20px'}}>PINNACLE SECURITY LTD © 2026 | Muyenga HQ | 0776971970 | hr@pinnaclegroup.co.ug | Free Food & Accommodation | No Fees</div>
    </div>
  )
}