import AdminDashboard from './pages/AdminDashboard.jsx';
import React, { useState, useEffect } from 'react'
const ADMIN_PASSWORD = "Rubangakene";

const GOOGLE_SHEET_WEBHOOK = "https://script.google.com/macros/s/AKfycbz0Fx9gSfPwPXZdi8pivw9IdQ_fzj707fPk22GBECuGYhGzwePtEPZV47TyXk8TN8bggQ/exec";
const KOBO_APTITUDE_TEST = "https://ee.kobotoolbox.org/x/ODCdeyaJ";
const GOOGLE_APTITUDE_REGISTER = "https://forms.gle/W8JroZ8n8HGArq248";

const getFullDateTime24 = () => {
  const d = new Date();
  const kampala = new Date(d.toLocaleString('en-US', {timeZone:'Africa/Kampala'}));
  return kampala.getDate().toString().padStart(2,'0') + '/' + (kampala.getMonth()+1).toString().padStart(2,'0') + '/' + kampala.getFullYear() + ' ' + kampala.getHours().toString().padStart(2,'0') + ':' + kampala.getMinutes().toString().padStart(2,'0') + ':' + kampala.getSeconds().toString().padStart(2,'0') + '.' + kampala.getMilliseconds() + '-' + Math.floor(Math.random()*900+100);
};

/* ================= DROPDOWN ================= */
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

/* ================= NAVBAR - RIGHT ALIGNED + 3 LINES ON PHONE ================= */
const Navbar = ({ theme, toggleTheme }) => {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(null);
  const scrollTo = (id) => { setOpen(false); setHover(null); const el = document.getElementById(id); if (el) { const offset = 75; const top = el.getBoundingClientRect().top + window.scrollY - offset; window.scrollTo({ top, behavior: 'smooth' }); } };
  const dropWrap = {position:'relative'};
  const dropBtn = (active) => ({color: active ? '#ffcc00' : '#fff', textDecoration:'none', fontSize:'15px', fontWeight:700, padding:'8px 10px', cursor:'pointer', display:'inline-block', whiteSpace:'nowrap'});
  const mega = {position:'absolute', top:'100%', right:'0', width:'860px', maxWidth:'92vw', background:'#fff', borderRadius:'14px', boxShadow:'0 14px 35px rgba(0,0,0,0.25)', padding:'22px', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'20px', zIndex:10000, textAlign:'left'};
  const colTitle = {color:'#0a1931', fontSize:'13px', fontWeight:900, borderBottom:'3px solid #ffcc00', paddingBottom:'6px', marginBottom:'10px', letterSpacing:'0.5px'};
  const colLink = {display:'block', color:'#333', fontSize:'14px', fontWeight:700, padding:'8px 6px', cursor:'pointer', borderRadius:'8px'};
  const colDesc = {display:'block', color:'#777', fontSize:'12px', fontWeight:400, lineHeight:'1.4'};
  const mobileLink = {display:'block', width:'100%', color:'#fff', fontSize:'16px', fontWeight:700, padding:'13px 14px', cursor:'pointer', borderBottom:'1px solid rgba(255,255,255,0.12)', textDecoration:'none'};

  return (
    <nav className="nav">
      <div className="nav-inner">
        {/* LEFT - LOGO */}
        <span className="logo" onClick={()=>scrollTo('home')} style={{cursor:'pointer'}}>PINNACLE<br className="logo-br" /> SECURITY LTD</span>

        {/* RIGHT - ALL LINKS RIGHT ALIGNED */}
        <div className="nav-right">
          {/* DESKTOP LINKS - RIGHT */}
          <div className="links desktop-links">
            <a onClick={() => scrollTo('home')}>Home</a>
            <div style={dropWrap} onMouseEnter={()=>setHover('about')} onMouseLeave={()=>setHover(null)}>
              <span style={dropBtn(hover==='about')} onClick={()=>scrollTo('about')}>About ▼</span>
              {hover==='about' && (<div style={mega}><div><div style={colTitle}>ABOUT PINNACLE</div><span style={colLink} onClick={()=>scrollTo('about')}>About Pinnacle <span style={colDesc}>Since 2009, 150+ officers, 60+ sites, UN 2013-2025, Serena Kigo. Licensed by Uganda Police, headquartered in Muyenga. We started with 5 guards and God grew us.</span></span><span style={colLink} onClick={()=>scrollTo('about')}>Our History & Welfare <span style={colDesc}>Free Food & Accommodation for all staff, started 2009 with 5 guards. A fed guard does not sleep, does not steal.</span></span><span style={colLink} onClick={()=>scrollTo('about')}>Our Numbers <span style={colDesc}>150+ officers, 15 motorcycles, 3 patrol cars, 24/7 control room. We respond in 10 minutes.</span></span></div><div><div style={colTitle}>MISSION & VALUES</div><span style={colLink} onClick={()=>scrollTo('mission')}>Mission, Vision, Values <span style={colDesc}>DISCIPLINE - Our daily life, Vision 2030: 500+ officers, 200+ sites, own training school.</span></span><span style={colLink} onClick={()=>scrollTo('mission')}>Why Clients Trust Us <span style={colDesc}>24/7 Control Room, 10-Min Response, Replacement Guarantee same day free.</span></span><span style={colLink} onClick={()=>scrollTo('mission')}>Our Promise To You <span style={colDesc}>We protect it as if it is our own. Your home, your shop, your family, your dreams.</span></span></div><div><div style={colTitle}>BIG CLIENTS</div><span style={colLink} onClick={()=>scrollTo('about')}>United Nations (UN) <span style={colDesc}>2013 to 2025 - 12 years, offices, warehouses, residences. Trusted for 12 years.</span></span><span style={colLink} onClick={()=>scrollTo('about')}>Entebbe Express Highway <span style={colDesc}>Toll areas, materials, equipment, workers day & night. No theft, full accountability.</span></span><span style={colLink} onClick={()=>scrollTo('about')}>Serena Hotel - Still in Kigo <span style={colDesc}>5-star standard, polite, smart, confidential. We are still there today.</span></span></div></div>)}
            </div>
            <div style={dropWrap} onMouseEnter={()=>setHover('services')} onMouseLeave={()=>setHover(null)}>
              <span style={dropBtn(hover==='services')} onClick={()=>scrollTo('services')}>Services ▼</span>
              {hover==='services' && (<div style={mega}><div><div style={colTitle}>🛡️ GUARDING</div><span style={colLink} onClick={()=>scrollTo('services')}>Security Guard Service <span style={colDesc}>Homes, Shops, Offices - Day / Night, 1-4 guards per shift. Free food & accommodation.</span></span><span style={colLink} onClick={()=>scrollTo('services')}>Site Incharge & Supervisor <span style={colDesc}>Manages 5-15 guards, roster, OB, client handling. Motorcycle + fuel + airtime.</span></span><span style={colLink} onClick={()=>scrollTo('services')}>Construction Site Security <span style={colDesc}>Stop cement, iron bars, timber, fuel theft - count morning & evening. Save millions.</span></span></div><div><div style={colTitle}>📹 TECHNOLOGY</div><span style={colLink} onClick={()=>scrollTo('services')}>CCTV Installation <span style={colDesc}>4 cameras 1.2M, 8 cameras 2.1M, phone viewing, 1yr warranty. See your home from anywhere.</span></span><span style={colLink} onClick={()=>scrollTo('services')}>Mobile Patrol <span style={colDesc}>Patrol car visits 3x night, checks gate, lights, windows. Thieves fear patrol.</span></span><span style={colLink} onClick={()=>scrollTo('services')}>Alarm Systems <span style={colDesc}>650k installed, calls 3 numbers, quick response. Sleep peacefully.</span></span></div><div><div style={colTitle}>⭐ SPECIAL</div><span style={colLink} onClick={()=>scrollTo('services')}>Hotel & Corporate - Serena Standard <span style={colDesc}>Polite, clean, 5-star service, customer care. Guests feel welcome, not scared.</span></span><span style={colLink} onClick={()=>scrollTo('services')}>Event Security <span style={colDesc}>40k per guard per day - weddings, concerts, crusades. Crowd control, gate, VIP.</span></span><span style={colLink} onClick={()=>scrollTo('services')}>Escort & VIP Protection <span style={colDesc}>Cash, goods, VIP escort - safe, discreet, on time. Radio to control room.</span></span></div></div>)}
            </div>
            <div style={dropWrap} onMouseEnter={()=>setHover('career')} onMouseLeave={()=>setHover(null)}>
              <span style={dropBtn(hover==='career')} onClick={()=>scrollTo('jobs')}>Career ▼</span>
              {hover==='career' && (<div style={mega}><div><div style={colTitle}>💼 JOBS - WE ARE HIRING</div><span style={colLink} onClick={()=>scrollTo('jobs')}>Site Incharge - 5 Posts <span style={colDesc}>UCE + 3yrs + Free Food & Accommodation + Motorcycle. Lead 5-15 guards.</span></span><span style={colLink} onClick={()=>scrollTo('jobs')}>Supervisor - 10 Posts <span style={colDesc}>UACE + Rider Permit + 3yrs, training on progress. Night checks, patrol.</span></span><span style={colLink} onClick={()=>scrollTo('jobs')}>Security Officer - 50 Posts <span style={colDesc}>P7 & above, Free Food & Accommodation + NSSF + Insurance. No fees.</span></span></div><div><div style={colTitle}>📝 APPLY & TEST</div><span style={colLink} onClick={()=>scrollTo('aptitude')}>Aptitude Test <span style={colDesc}>Must for all applicants - FREE online, 20-30 mins. No test = No job.</span></span><span style={colLink} onClick={()=>scrollTo('join')}>Apply Now <span style={colDesc}>No Fees - Interview daily 8am Muyenga HQ. Bring ID, CV, papers, 2 photos.</span></span><span style={colLink} onClick={()=>scrollTo('jobs')}>Training - 2 Weeks FREE <span style={colDesc}>At Muyenga HQ, discipline + OB + radio + first aid. Uniform given free.</span></span></div><div><div style={colTitle}>🎓 GROW WITH US</div><span style={colLink} onClick={()=>scrollTo('jobs')}>Interview Process <span style={colDesc}>Same day / next day, bring ID + CV + papers + 2 photos. Be early, be smart.</span></span><span style={colLink} onClick={()=>scrollTo('jobs')}>Deployment <span style={colDesc}>After training, uniform + baton + torch + radio, start earning immediately.</span></span><span style={colLink} onClick={()=>scrollTo('contact')}>Contact HR <span style={colDesc}>0776971970 - hr@pinnaclegroup.co.ug, Muyenga HQ. We answer same day.</span></span></div></div>)}
            </div>
            <a onClick={() => scrollTo('mission')}>Mission</a>
            <a onClick={() => scrollTo('jobs')}>Jobs</a>
            <a onClick={() => scrollTo('aptitude')}>Aptitude Test</a>
            <a onClick={() => scrollTo('contact')}>Contact</a>
          </div>

          {/* BUTTONS - ALWAYS RIGHT */}
          <div className="nav-buttons">
            <a onClick={() => scrollTo('join')} className="btn-yellow">Apply Now</a>
            <a href="/admin" style={{color:'#ffcc00', fontWeight:'900', border:'1px solid #ffcc00', borderRadius:'20px', padding:'8px 14px', textDecoration:'none', whiteSpace:'nowrap'}}>Admin</a>
            <button onClick={toggleTheme} style={{background: theme==='dark' ? '#ffcc00' : 'transparent', color: theme==='dark' ? '#0a1931' : '#ffcc00', border:'1px solid #ffcc00', padding:'8px 14px', borderRadius:'20px', fontWeight:900, cursor:'pointer', whiteSpace:'nowrap'}}>
              {theme==='dark' ? '☀️ Light' : '🌙 Dark'}
            </button>
            {/* 3 LINES HAMBURGER - ONLY ON PHONE */}
            <button className="menu-btn" onClick={() => setOpen(!open)} aria-label="Menu">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DROPDOWN - FULL WIDTH, ONE BY ONE */}
      {open && (
        <div className="mobile-menu">
          <span style={mobileLink} onClick={() => scrollTo('home')}>🏠 Home</span>
          <span style={mobileLink} onClick={() => scrollTo('about')}>ℹ️ About Pinnacle</span>
          <span style={mobileLink} onClick={() => scrollTo('services')}>🛡️ Services - Guard, CCTV, Patrol</span>
          <span style={mobileLink} onClick={() => scrollTo('mission')}>🎯 Mission, Vision, Values</span>
          <span style={mobileLink} onClick={() => scrollTo('jobs')}>💼 Jobs - We Are Hiring</span>
          <span style={mobileLink} onClick={() => scrollTo('aptitude')}>📝 Aptitude Test - Must Do</span>
          <span style={mobileLink} onClick={() => scrollTo('join')}>✅ Apply Now - No Fees</span>
          <span style={{...mobileLink, borderBottom:'none'}} onClick={() => scrollTo('contact')}>📞 Contact - 0776971970</span>
        </div>
      )}
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
      <p style={{textAlign:'center', marginTop:'18px', fontSize:'17px', lineHeight:'1.7'}}>Welcome to Pinnacle Security Ltd. We are not just a security company. We are your neighbours, your protectors, your partners. When you sleep at night, we are awake. When you go to work, we guard your home. When you build, we guard your materials. When you celebrate, we guard your event. That is our promise: <b>We do not just guard buildings. We guard lives, families, businesses, and dreams.</b> We have protected the United Nations for 12 years, the Entebbe Express Highway, and Serena Hotel in Kigo. If big organisations trust us, you can trust us too. Call us today for a FREE site survey on 0776971970 - no fees, no pressure, just honest advice.</p>
      <div style={{marginTop:'22px'}}>
        <div className="home-grid-3">
          <div className="card"><h3>Who We Are - Licensed & Trusted</h3><p>Pinnacle Security Ltd is a fully licensed private security company at <b>Plot 442 & 443 Massionatees, Muyenga Hill</b>. Since 2009, we have grown to 60+ sites and 150+ trained officers. We provide <b>free food and accommodation</b> to all guards, supervisors and site incharges.</p><p style={{marginTop:'10px'}}>We have served big national clients including the <b>United Nations (UN) from 2013 to 2025</b>, the <b>Entebbe Express Highway</b>, and <b>Serena Hotel</b>. We are proud of that history, and we continue to serve with the same discipline today.</p><p style={{marginTop:'10px'}}><b>More Explanation:</b> Being licensed means we are registered and approved by Uganda Police to operate as a private security company. We are not a briefcase company. You can visit our headquarters in Muyenga, see our control room, meet our managers, and check our files. We have an OB book at every site, a supervisor who visits twice daily, and a control room that answers 24/7. That is why clients stay with us for years.</p><p style={{marginTop:'10px'}}><b>What Makes Us Different:</b> Many companies give guards low pay and no food, so guards sleep and steal. We do the opposite. We feed them, house them, train them, pay NSSF and insurance. A happy guard is an alert guard. That is why our sites are safe.</p></div>
          <div className="card gold"><h3>Core Services</h3><p><b>Guard Service:</b> Day/night guards for homes, shops, offices — with free food & accommodation</p><p><b>Site Incharge & Supervisor:</b> Experienced managers with motorcycle + free food & accommodation</p><p><b>Construction Security:</b> Protect cement, iron bars, timber, fuel - count morning & evening</p><p><b>CCTV, Mobile Patrol, Alarm:</b> Affordable packages - 4 cameras 1.2M, 8 cameras 2.1M</p><p style={{marginTop:'10px'}}><b>More Explanation:</b> Each service is explained in full on the Services page. If you are not sure which service you need, call 0776971970 for a Free Site Survey. We will visit your place, check gates, walls, lights, and risk, then recommend the right number of guards. No fees for survey. No hidden fees after. Clear price, written agreement.</p><p style={{marginTop:'10px'}}><b>Example:</b> A home in Muyenga with one gate needs 1 guard day + 1 guard night. A construction site with materials needs 2 guards night + counting. A shop in town needs 1 guard + CCTV. We tailor to you.</p></div>
          <div className="card dark"><h3>URGENT RECRUITMENT - No Fees</h3><p><b>SITE INCHARGE:</b> UCE + 3yrs — Attractive salary + Free Food & Accommodation</p><p style={{marginTop:'10px'}}><b>SUPERVISOR:</b> UACE + Rider Permit + 3yrs — Attractive salary + Free Food & Accommodation</p><p style={{marginTop:'10px'}}><b>SECURITY OFFICER:</b> P7 & above — Attractive salary + Free Food & Accommodation</p><p style={{marginTop:'10px'}}><b>More Explanation:</b> All jobs are real, no fees, and interview is daily at 8am at Muyenga HQ. Bring National ID, CV, papers, 2 photos. First do Aptitude Test online (FREE), then come for interview. Training is 2 weeks FREE at Muyenga HQ. After training you get uniform, baton, torch, radio and deployment. You start earning immediately.</p><p style={{marginTop:'10px'}}><b>Warning:</b> Pinnacle NEVER asks for money to give you a job. If anyone asks you for money in our name, report to 0776971970 immediately. It is a conman.</p><a onClick={() => document.getElementById('join').scrollIntoView({behavior:'smooth'})} className="btn-yellow big" style={{marginTop:'18px', width:'100%', textAlign:'center', display:'block', cursor:'pointer'}}>Apply Now</a></div>
        </div>
      </div>
    </div>
  )
}

const About = () => {
  return (
    <div className="section">
      <h2>About Pinnacle Security Ltd - Detailed</h2>
      <div className="about-hero"><h3>Pinnacle Security Ltd - Protecting What Matters Most Since 2009</h3><p>Plot 442 & 443 Massionatees, Muyenga Hill, Kampala | Control 24/7: 0776971970 | Free Food & Accommodation For All Staff | No Recruitment Fees</p><p style={{marginTop:'10px'}}>We started small in 2009 with only 5 guards and 1 client. God has grown us step by step. Today we protect homes, businesses, construction sites, hotels and national roads across Uganda.</p><p style={{marginTop:'10px'}}>Our story is a story of discipline. We never missed a shift. We never stole from a client. We never asked for bribes. We kept OB books clean, uniforms smart, and radios charged. Clients saw that and trusted us with bigger jobs - from a small shop to the United Nations. That is how we grew, and that is how we will keep growing to Vision 2030.</p></div>
      <div className="home-grid-3">
        <div className="card"><h3>Our History & Welfare</h3><p>Started in 2009 with 5 guards and 1 client. Today 150+ officers, 60+ sites, patrol cars, CCTV team. Licensed by Uganda Police. We provide <b>free food and accommodation</b> to all staff.</p><p style={{marginTop:'10px'}}><b>1. UNITED NATIONS (UN) — 2013 to 2025:</b> For 12 years, our officers guarded UN offices, compounds, warehouses and staff residences. UN checks everything - uniform, discipline, OB, radio, reporting. We passed for 12 years.</p><p style={{marginTop:'8px'}}><b>2. ENTEBBE EXPRESS HIGHWAY:</b> Our teams guarded toll areas, construction materials, equipment, and workers day and night. Materials were counted morning and evening. No loss.</p><p style={{marginTop:'8px'}}><b>3. SERENA HOTEL:</b> We are still present and still serving in <b>Serena Hotel in Kigo</b>. Hotels need polite, clean, smart guards. We learned 5-star standard there.</p><p style={{marginTop:'10px'}}><b>Welfare:</b> Every guard gets free food (breakfast, lunch, supper), free accommodation at site or near site, uniform, NSSF, insurance, and training. We believe if you take care of your guard, your guard will take care of your property.</p></div>
        <div className="card gold"><h3>Why Clients Trust Us</h3><p>1. <b>24/7 Control Room</b> — Call 0776971970 any time, day or night, someone answers<br/>2. <b>10-Minute Response</b> — Patrol and supervisor rush to your site when you call<br/>3. <b>Free Food & Accommodation For Guards</b> — A guard who is fed and housed does not sleep, does not steal<br/>4. <b>Trained Officers:</b> 2 weeks training at Muyenga HQ - discipline, OB, radio, first aid, gate control<br/>5. <b>Affordable & Disciplined</b> — Clear price, no hidden fees, written agreement<br/>6. <b>Supervisor Visits 2x Daily</b> — Morning and evening, checks uniform, OB, site<br/>7. <b>Replacement Guarantee</b> — If a guard misbehaves, we replace him same day, free.<br/>8. <b>Daily Reporting:</b> OB book, incident report, patrol report - you see everything.</p><p style={{marginTop:'10px'}}><b>What Happens If Something Goes Wrong?</b> You call control room. Supervisor comes. We investigate. We replace guard if needed. We report to police if needed. We do not hide. We are transparent because we want long relationship, not one month.</p></div>
        <div className="card dark"><h3>Our Numbers</h3><p>150+ Active Officers<br/>60+ Protected Sites<br/>15 Motorcycles + 3 Patrol Cars<br/>24/7 Control Room<br/>Free Food & Accommodation For All Staff<br/><br/><b>Major Contracts Served:</b><br/>• UN — 2013 to 2025 (12 Years)<br/>• Entebbe Express Highway<br/>• Serena Hotel — Still in Kigo</p><p style={{marginTop:'12px'}}><b>Our Team:</b> Director, HR Manager, Operations Manager, Control Room Operators, Supervisors, Site Incharges, Guards, CCTV Technicians, Drivers. Every person is trained, checked, and supervised. No stranger is sent to your site without training and checking.</p><p style={{marginTop:'10px'}}><b>Visit Us:</b> Come to Muyenga HQ any working day. See control room, meet managers, ask questions. We are open and proud.</p></div>
      </div>
    </div>
  )
}

const Services = () => {
  return (
    <div className="section">
      <h2>Our Security Services - Full Explanation</h2>
      <p style={{textAlign:'center', marginBottom:'18px', fontSize:'18px'}}>We offer 6 main services. All guards get free food & accommodation + attractive salary. All services include FREE site survey, written agreement, and 24/7 control room support.</p>
      <div className="card"><h3>1. Security Guard Service - Homes, Shops, Offices</h3><p>What you get: 1-4 guards per shift, uniformed, baton, radio, torch, OB book. Supervisor visits 2x daily, patrol 1x night. Guards get free food & accommodation at site.</p><p style={{marginTop:'10px'}}>How it works: We visit your home or shop FREE, we check gates, walls, lights, and risk. Then we recommend 1 guard day + 1 guard night, or 2 guards if the place is big. We sign agreement, deploy guards in 24-48 hours. Guards report to control room every 2 hours. You get daily OB report.</p><p style={{marginTop:'10px'}}><b>Perfect For:</b> Homes in Muyenga, Buziga, Munyonyo, Ntinda, Kira, Naalya, Entebbe. Shops in town, offices, schools, churches, warehouses, farms.</p></div>
      <div className="card gold"><h3>2. Site Incharge & Supervisor Service</h3><p>What you get: Experienced manager manages 5-15 guards, duty roster, OB, client handling. Gets free food & accommodation + motorcycle + fuel + airtime + attractive salary.</p><p style={{marginTop:'10px'}}>When you have many guards, you need a leader. Site Incharge makes roster, checks guards are awake, handles client complaints, writes reports, and calls control room if there is problem. Supervisor moves between sites on motorcycle, does surprise night checks, and ensures no guard sleeps. This is how we keep discipline.</p></div>
      <div className="card"><h3>3. Construction Site Security</h3><p>Problem: 30% materials stolen at night - cement, iron bars, timber, fuel, tools. We stop it. Guards count cement, iron bars, check lorries, check workers in/out, and guard at night. Guards get free food & accommodation at site.</p><p style={{marginTop:'10px'}}>How we do it: Morning count + evening count, signed by guard and site engineer. Lorry checked in and out. No material leaves without permission. Night patrol every hour. If theft happens, we report immediately and help police. Many builders save millions by hiring us. One bag of cement saved per day pays for guard.</p></div>
      <div className="card gold"><h3>4. CCTV, Mobile Patrol, Event, Alarm</h3><p><b>CCTV:</b> 4 cameras 1.2M, 8 cameras 2.1M, phone viewing, 1yr warranty. See your home/shop from your phone anywhere in the world. Record 30 days.<br/><b>Mobile Patrol:</b> Patrol car visits 3x night, checks gate, lights, windows, and calls you if something wrong. Cheaper than full guard.<br/><b>Event Security:</b> 40k per guard per day - weddings, concerts, crusades, parties. Crowd control, gate, parking, VIP.<br/><b>Alarm:</b> 650k installed, calls 3 numbers when triggered, control room responds.</p><p style={{marginTop:'10px'}}>Call 0776971970 for a free quote. We explain all options honestly and recommend what fits your budget. You can start small and grow.</p></div>
      <div className="card"><h3>5. Hotel & Corporate Security — Serena Standard</h3><p>Hotels need polite, clean, smart guards who greet guests, check bags politely, control parking, and protect VIPs without disturbing guests. That is the Serena standard we learned at Serena Hotel in Kigo.</p><p style={{marginTop:'10px'}}>Our hotel guards are specially selected: tall, clean, polite, English speaking, trained in customer care. They smile, they help with luggage, they open doors, they watch CCTV, they control parking, and they keep thieves away quietly. Guests feel safe and welcome. That is why Serena still trusts us.</p></div>
      <div className="card gold"><h3>6. Escort & Cash / VIP Protection</h3><p>We escort cash, goods, and VIPs from one place to another with trained officers and radio communication to control room. Safe, discreet, on time.</p><p style={{marginTop:'10px'}}>Example: You need to take cash from bank to shop, or goods from warehouse to site, or VIP from airport to hotel. We send 2 officers, one in front, one behind, radio to control room, route planned, no stops. We have done this for many clients safely. Your movement is confidential - we do not tell anyone.</p></div>
    </div>
  )
}

const MissionPage = () => {
  return (
    <div className="section">
      <h2>Our Mission, Vision, Values</h2>
      <p style={{textAlign:'center', marginBottom:'18px', fontSize:'18px'}}>We do not just guard buildings. We guard lives, families, businesses, and dreams. When a mother sleeps knowing her children are safe, when a businessman sleeps knowing his shop is safe, when a builder sleeps knowing his materials are safe - that is our mission fulfilled.</p>
      <div className="mission-grid">
        <div className="mission-card"><h3>Our Mission</h3><p>To provide professional, affordable, disciplined security with 24/7 control room, trained guards, patrol, CCTV. We ensure all guards get free food & accommodation.</p><p style={{marginTop:'10px'}}>We believe security should not be only for rich people. Every Ugandan deserves to sleep safely. So we keep prices fair, we do free surveys, we explain honestly, and we never overcharge. Professional does not mean expensive. It means disciplined, trained, and reliable.</p></div>
        <div className="mission-card gold"><h3>Our Vision 2030</h3><p>To be Uganda's most trusted company by 2030 with 500+ officers, 200+ sites, own training school.</p><p style={{marginTop:'10px'}}>By 2030, we want every district in Uganda to know Pinnacle. We want our own training school in Muyenga where young Ugandans learn discipline, security, first aid, CCTV, and customer care, and get jobs. We want 500 officers earning well, feeding families, building houses. That is our dream, and we are working every day towards it.</p></div>
        <div className="mission-card dark"><h3>Core Values - DISCIPLINE</h3><div className="values-list"><div><b>D - Discipline:</b> On time, smart uniform, OB book, no phone on duty, no sleeping. Discipline is our first value because without it, nothing works.</div><div><b>I - Integrity:</b> We do not steal, we do not lie, we do not take bribes. If we find lost property, we return it.</div><div><b>S - Service:</b> We serve you politely. We greet, we help, we smile. You are our boss.</div><div><b>C - Courage:</b> We do not run when thieves come. We stand, we call control room, we protect.</div><div><b>P - Professionalism:</b> Trained, uniformed, radio, report. We write everything in OB book.</div><div><b>L - Loyalty:</b> Loyal to you, loyal to Pinnacle, loyal to God. We do not betray trust.</div><div><b>I - Innovation:</b> CCTV, patrol, phone reporting. We use technology to protect better.</div><div><b>N - No Fees:</b> No recruitment fees. No hidden fees. Clear price, written agreement.</div><div><b>E - Excellence:</b> Every night, every site, excellence. Not sometimes, every time.</div></div><p style={{marginTop:'10px', color:'#ffcc00', fontWeight:800}}>DISCIPLINE is not a word on the wall — it is our daily life. We parade every morning, we check uniforms, we check OB books. That is why clients trust us for years.</p></div>
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
          <div className="memo-intro">Management approved urgent recruitment of 30 officers. <b>All positions come with free food & accommodation + attractive salary + free training + uniform. No Fees. Interview daily at 8am at Muyenga HQ.</b> We need disciplined, honest, hardworking Ugandans who want to build a career in security. Security is not just a job, it is a career. You can start as guard, become supervisor, become site incharge, become manager. Many of our supervisors started as guards. If you are disciplined, you will grow. If you are lazy, you will not last. Choose discipline.</div>
          <Dropdown title="POSITION 1: SITE INCHARGE - 5 Posts" color="#ffcc00"><div style={{color:'#0a1931', textAlign:'left'}}><p><b>Benefits:</b> Attractive salary + Free Food & Accommodation + Motorcycle + Fuel + Airtime</p><p style={{marginTop:'8px'}}><b>Requirements:</b> UCE and above, 3+ years as supervisor or guard, can read/write English, can manage 5-15 guards, can write reports, can handle clients politely.</p><p style={{marginTop:'8px'}}><b>Your Work:</b> Make duty roster, check guards, check OB, visit sites, report to operations manager, handle client complaints, ensure no theft, ensure discipline.</p></div></Dropdown>
          <Dropdown title="POSITION 2: SUPERVISOR - 10 Posts" color="#0a1931"><div style={{color:'#0a1931', textAlign:'left'}}><p><b>Benefits:</b> Attractive salary + Free Food & Accommodation + Motorcycle + Fuel + Airtime</p><p style={{marginTop:'8px'}}><b>Requirements:</b> UACE and above, Rider Permit, 3+ years experience, can ride motorcycle, can do night checks, can write reports.</p><p style={{marginTop:'8px'}}><b>Your Work:</b> Move between sites on motorcycle, do surprise checks day and night, check uniforms, check OB, check guards are awake, report problems, replace guards if needed.</p></div></Dropdown>
          <Dropdown title="POSITION 3: SECURITY OFFICER - 50 Posts" color="#0a1931"><div style={{color:'#0a1931', textAlign:'left'}}><p><b>Benefits:</b> Attractive salary + Free Food & Accommodation + NSSF + Insurance + Uniform + Training</p><p style={{marginTop:'8px'}}><b>Requirements:</b> P7 and above, 18+ years, physically fit, disciplined, can read/write, no criminal record, no drugs, no alcohol on duty.</p><p style={{marginTop:'8px'}}><b>Your Work:</b> Guard gate, check visitors, write OB, patrol site, control entry, report incidents, call control room if problem. You are the first line of defence.</p></div></Dropdown>
          <div className="card" style={{marginTop:'16px', background:'#fff', color:'#0a1931'}}><h3 style={{color:'#0a1931'}}>🟡 TRAINING / INTERVIEWING — SUPERVISOR IS ON PROGRESS</h3><p><b>Please note:</b> Training and interviewing for <b>Supervisor</b> is currently <b>ON PROGRESS</b>. If you applied for Supervisor, please be patient — HR will call you. Do not pay anyone to speed up. No one can speed up except HR.</p><p style={{marginTop:'10px'}}><b>Step 1 — Application:</b> Apply online OR walk to Muyenga HQ at 8am with National ID, CV, papers, 2 photos. No fees.</p><p style={{marginTop:'8px'}}><b>Step 2 — Interview:</b> HR interviews you at Muyenga HQ. Be early, be clean, be honest. Tell truth about your history.</p><p style={{marginTop:'8px'}}><b>Step 3 — Aptitude Test:</b> You must do the Online Aptitude Test. It tests English, maths, reasoning, discipline. No test = No job.</p><p style={{marginTop:'8px'}}><b>Step 4 — Document Check & Medical:</b> We check ID, LC letter, papers, and medical fitness. We check criminal record.</p><p style={{marginTop:'8px'}}><b>Step 5 — Training (2 Weeks, FREE):</b> Discipline, parade, OB book, radio, gate control, patrol, first aid, customer care. You will be tested.</p><p style={{marginTop:'8px'}}><b>Step 6 — Deployment:</b> After training, uniform, baton, torch, radio, start earning. Supervisor will take you to your site and introduce you.</p></div>
        </div>
      </div>
    </div>
  )
}

const Aptitude = () => (
  <div className="section">
    <h2>Online Aptitude Test - Must for All Applicants</h2>
    <p style={{textAlign:'center', marginBottom:'18px', fontSize:'18px'}}>Every applicant MUST do this test. No test = No job. The test is FREE, online, from your phone. It takes only 20-30 minutes. You can do it at home, at cafe, or at Muyenga HQ with our help. Do not fear the test. It is not to fail you, it is to know you. If you can read, write, calculate, and think, you will pass.</p>
    <div className="card"><h3>What Is Aptitude Test? Why Must You Do It?</h3><p>Aptitude test is a short exam that shows us if you can think, read, write, calculate, and behave like a disciplined security officer. A guard writes OB book, counts materials, checks IDs, calls control room on radio, and reports incidents. If you cannot write OB, you cannot be a guard. If you cannot count cement, you cannot guard construction. That is why we test. The test has English, maths, reasoning, discipline, and security knowledge. Example: If 5 bags of cement are missing, what do you do? If a visitor refuses to show ID, what do you do? If you see a thief, what do you do? These are real situations. Answer honestly.</p><p style={{marginTop:'10px'}}><b>Tips To Pass:</b> 1. Read questions slowly. 2. Answer honestly, do not guess blindly. 3. Be calm. 4. Use your phone fully charged. 5. Do test alone, do not copy. 6. If you fail, you can try again after HR advice. We want you to pass.</p></div>
    <div className="home-grid-3">
      <div className="card"><h3>Step 1: Register</h3><p>First, register your name, phone, position you want (Security Officer / Supervisor / Site Incharge), and district. Registration is FREE. Use your real name as on National ID. Use your real phone - HR will call this number. If you change number, tell HR.</p><a href={GOOGLE_APTITUDE_REGISTER} target="_blank" rel="noreferrer" className="btn-yellow big" style={{display:'block', textAlign:'center', marginTop:'12px'}}>Register Now</a></div>
      <div className="card gold"><h3>Step 2: Do Test</h3><p>Do the test on KoboToolbox. 20-30 mins. English, maths, reasoning, discipline, security knowledge. Do it in a quiet place, no disturbance. Finish all questions. Submit. You will see confirmation.</p><a href={KOBO_APTITUDE_TEST} target="_blank" rel="noreferrer" className="btn-yellow big" style={{display:'block', textAlign:'center', marginTop:'12px', background:'#0a1931', color:'#ffcc00'}}>Start Test</a></div>
      <div className="card dark"><h3>Step 3: Interview</h3><p>After test, come for interview daily 8am Muyenga HQ with ID, CV, papers, 2 photos. No Fees. Tell HR you have done test. HR will check your test result and interview you same day or next day. If you pass, you go to training. If you need improvement, HR will advise you.</p></div>
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
      <p style={{textAlign:'center', marginBottom:'18px', fontSize:'17px', lineHeight:'1.7'}}>Fill this form honestly. It goes directly to Admin Dashboard. HR will call you same day or next day. After applying, you MUST do Aptitude Test, then come for interview at 8am Muyenga HQ. Bring National ID, CV, papers, 2 photos. No fees at any stage. If anyone asks you for money, it is NOT Pinnacle - report to 0776971970.</p>
      <div className="card" style={{maxWidth:'600px', margin:'0 auto'}}>
        {sent ? <p style={{textAlign:'center', fontWeight:900}}>✅ Application Sent! Now do Aptitude Test, then come for interview 8am Muyenga HQ. HR will call you on your phone. Keep your phone on. Good luck, and welcome to Pinnacle family.</p> : (
        <form onSubmit={submit} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
          <input required placeholder="Full Name - as on National ID" value={form.FullName} onChange={e=>setForm({...form, FullName:e.target.value})} style={{padding:'12px', borderRadius:'10px', border:'1px solid #ccc'}} />
          <input required placeholder="Phone e.g 0776971970" value={form.Phone} onChange={e=>setForm({...form, Phone:e.target.value})} style={{padding:'12px', borderRadius:'10px', border:'1px solid #ccc'}} />
          <input placeholder="Email (optional) e.g john@gmail.com" value={form.Email} onChange={e=>setForm({...form, Email:e.target.value})} style={{padding:'12px', borderRadius:'10px', border:'1px solid #ccc'}} />
          <select value={form.Position} onChange={e=>setForm({...form, Position:e.target.value})} style={{padding:'12px', borderRadius:'10px'}}><option>Security Officer</option><option>Supervisor</option><option>Site Incharge</option></select>
          <input placeholder="District e.g Kampala, Wakiso, Entebbe" value={form.District} onChange={e=>setForm({...form, District:e.target.value})} style={{padding:'12px', borderRadius:'10px', border:'1px solid #ccc'}} />
          <input placeholder="Education e.g UCE, UACE, P7, Diploma" value={form.Education} onChange={e=>setForm({...form, Education:e.target.value})} style={{padding:'12px', borderRadius:'10px', border:'1px solid #ccc'}} />
          <input placeholder="Experience e.g 2 years as guard at..." value={form.Experience} onChange={e=>setForm({...form, Experience:e.target.value})} style={{padding:'12px', borderRadius:'10px', border:'1px solid #ccc'}} />
          <button type="submit" className="btn-yellow big">Submit Application</button>
          <p style={{fontSize:'13px', textAlign:'center', color:'#777'}}>By submitting, you agree HR can call you. Your data is safe with Pinnacle only.</p>
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
      <p style={{textAlign:'center', marginBottom:'18px', fontSize:'17px', lineHeight:'1.7'}}>Tell us what you need. We call you back same day. No fees for survey. Whether you need 1 guard for your home, 10 guards for construction, CCTV for your shop, or security for your wedding - talk to us. We listen, we advise honestly, we give fair price. If we cannot help you, we will tell you who can. That is integrity.</p>
      <div className="contact-grid">
        <div className="card">
          <h3>📍 Visit / Call Us</h3>
          <p><b>Plot 442 & 443 Massionatees, Muyenga Hill, Kampala</b> - Just above Muyenga, near Muyenga Hill, easy to find. Ask for Pinnacle Security HQ.</p>
          <p>Control 24/7: <b>0776971970</b> | Email: <b>hr@pinnaclegroup.co.ug</b></p>
          <p>Interview: Monday - Saturday, 8am, Muyenga HQ. Bring ID + CV + Papers + 2 Photos. No Fees. Be early, be smart, be disciplined.</p>
          <p style={{marginTop:'12px'}}><b>After you send:</b><br/>1. Message goes to Admin as CONTACT<br/>2. HR calls you back same day<br/>3. We visit FREE & give fair price<br/>4. We sign agreement & deploy in 24-48 hours<br/>5. Supervisor visits you 2x daily, control room calls you weekly</p>
          <a href="tel:0776971970" className="btn-yellow big" style={{display:'block', textAlign:'center', marginTop:'14px'}}>📞 Call 0776971970 Now</a>
          <a href="https://wa.me/256776971970" target="_blank" rel="noreferrer" className="btn-yellow big" style={{display:'block', textAlign:'center', marginTop:'10px', background:'#25D366', color:'#fff'}}>💬 WhatsApp Us</a>
          <p style={{marginTop:'12px', fontSize:'14px', color:'#555'}}>Working Hours: Monday - Saturday 8am - 5pm for office. Control Room 24/7 for emergencies. If it is emergency at night, call 0776971970 - someone answers.</p>
        </div>
        <div className="card">
          <h3>✉️ Send Us A Message</h3>
          {sent ? (
            <div style={{textAlign:'center', padding:'20px'}}><div style={{fontSize:'48px'}}>✅</div><h3>Message Sent!</h3><p>Thank you {form.FullName}. We received your message about <b>{form.Service}</b>.</p><p>HR will call you on <b>{form.Phone}</b> soon. Please keep your phone on. If we do not call in 24 hours, call us on 0776971970.</p><button onClick={()=>{setSent(false); setForm({FullName:'',Phone:'',Email:'',Service:'Security Guard Service',Messages:''})}} className="btn-yellow big" style={{marginTop:'12px', cursor:'pointer'}}>Send Another Message</button></div>
          ) : (
            <form onSubmit={submit} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
              <label><b>Full Name *</b><input required placeholder="e.g John Kato" value={form.FullName} onChange={e=>setForm({...form, FullName:e.target.value})} style={inp} /></label>
              <label><b>Phone *</b><input required placeholder="e.g 0776971970" value={form.Phone} onChange={e=>setForm({...form, Phone:e.target.value})} style={inp} /></label>
              <label><b>Email (optional)</b><input placeholder="e.g john@gmail.com" value={form.Email} onChange={e=>setForm({...form, Email:e.target.value})} style={inp} /></label>
              <label><b>Service You Need *</b><select value={form.Service} onChange={e=>setForm({...form, Service:e.target.value})} style={inp}><option>Security Guard Service</option><option>Site Incharge & Supervisor</option><option>Construction Site Security</option><option>CCTV Installation</option><option>Mobile Patrol</option><option>Event Security</option><option>Alarm System</option><option>Hotel & Corporate Security</option><option>Escort & VIP Protection</option><option>Job Application / Other</option></select></label>
              <label><b>Message *</b><textarea required rows={4} placeholder="e.g I need 2 guards day and night for my home in Muyenga. Please visit for free survey." value={form.Messages} onChange={e=>setForm({...form, Messages:e.target.value})} style={{...inp, minHeight:'90px'}} /></label>
              <button type="submit" disabled={sending} className="btn-yellow big" style={{cursor:'pointer', opacity:sending?0.6:1}}>{sending?'Sending...':'Send Message →'}</button>
              <p style={{fontSize:'12px', textAlign:'center', color:'#777'}}>Goes directly to Admin Dashboard. No fees. We reply same day.</p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

/* ================= APP ================= */
export default function App(){
  const [theme, setTheme] = useState(() => localStorage.getItem('pinnacle-theme') || 'light');
  useEffect(()=>{ localStorage.setItem('pinnacle-theme', theme); },[theme]);
  const toggleTheme = () => setTheme(t => t==='light' ? 'dark' : 'light');

  if(window.location.pathname === '/admin') return <AdminDashboard />;

  return (
    <div data-theme={theme} style={{background: theme==='dark' ? '#0A1931' : '#f5f5f5', minHeight:'100vh'}}>
      <style>{`
        *{box-sizing:border-box} body{margin:0; font-family:Arial} a{cursor:pointer} html{scroll-behavior:smooth}
        /* NAVBAR - RIGHT ALIGNED */
        .nav{background:#0A1931; padding:0; position:sticky; top:0; z-index:9999; width:100%}
        .nav-inner{max-width:1280px; margin:0 auto; padding:12px 20px; display:flex; justify-content:space-between; align-items:center; gap:12px}
        .logo{color:#FFD700; font-weight:900; font-size:19px; line-height:1.15; white-space:nowrap; flex-shrink:0}
        .logo-br{display:none}
        .nav-right{display:flex; align-items:center; gap:10px; margin-left:auto; justify-content:flex-end; flex:1}
        .links{display:flex; gap:6px; align-items:center; flex-wrap:wrap; color:#fff; font-weight:700; justify-content:flex-end; margin-left:auto}
        .links a{color:#fff; text-decoration:none; font-size:15px; padding:8px 10px; white-space:nowrap}
        .nav-buttons{display:flex; gap:8px; align-items:center; flex-shrink:0}
        .btn-yellow{background:#FFD700; color:#0A1931; padding:10px 18px; border-radius:20px; font-weight:900; border:none; text-decoration:none; white-space:nowrap}
        .btn-yellow.big{padding:12px 24px; font-size:16px}
        /* 3 LINES HAMBURGER - HIDDEN ON DESKTOP */
        .menu-btn{display:none; background:transparent; border:1px solid #FFD700; width:44px; height:42px; border-radius:8px; cursor:pointer; flex-direction:column; justify-content:center; align-items:center; gap:5px; padding:0; flex-shrink:0}
        .menu-btn span{display:block; width:22px; height:2.5px; background:#FFD700; border-radius:2px}
        .mobile-menu{display:none; background:#0A1931; border-top:1px solid rgba(255,255,255,0.15); padding:6px 0 10px}
        .section{max-width:1200px; margin:0 auto; padding:20px}
        .section h2{text-align:center; color:#0A1931; font-size:28px; margin-bottom:18px}
        .hero{background:#1a2f7a; color:#fff; border-radius:16px; padding:36px 20px; textAlign:center; text-align:center}
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
        .memo-body-dark{padding:20px} .memo-intro{margin-bottom:16px; line-height:1.7}
        .contact-grid{display:grid; grid-template-columns:1fr 1fr; gap:16px}
        [data-theme="dark"] .section h2{color:#fff !important}
        [data-theme="dark"] .section{color:#fff !important}
        [data-theme="dark"] .card, [data-theme="dark"] .about-hero, [data-theme="dark"] .mission-card, [data-theme="dark"] .memo-clean{ background:#16294a !important; color:#fff !important; border-color:#2a3f66 !important; }
        [data-theme="dark"] .card p, [data-theme="dark"] .card div, [data-theme="dark"] .mission-card p, [data-theme="dark"] .about-hero p{ color:#e0e0e0 !important; }
        [data-theme="dark"] .card h3, [data-theme="dark"] .mission-card h3, [data-theme="dark"] .about-hero h3{ color:#fff !important; }
        [data-theme="dark"] .card.gold, [data-theme="dark"] .mission-card.gold{ background:#2a2a1a !important; color:#fff !important; }
        [data-theme="dark"] .card.dark, [data-theme="dark"] .mission-card.dark{ background:#000 !important; }
        [data-theme="dark"] .memo-head{ background:#000 !important; }

        /* ===== MOBILE - ALL PHONES ===== */
        @media(max-width:900px){
          .nav-inner{padding:10px 12px; gap:8px}
          .logo{font-size:15px; line-height:1.2}
          .logo-br{display:block}
          .desktop-links{display:none !important}
          .nav-buttons{margin-left:auto}
          .menu-btn{display:flex !important}
          .mobile-menu{display:block}
          .btn-yellow{padding:8px 12px; font-size:13px}
          .nav-buttons a, .nav-buttons button{font-size:12px !important; padding:7px 10px !important}
          .home-grid-3,.mission-grid,.contact-grid{grid-template-columns:1fr !important}
          .hero{padding:24px 14px} .hero h1{font-size:23px !important; line-height:1.25} .hero p{font-size:15px !important}
          .section{padding:16px 12px} .section h2{font-size:22px !important}
          .section p, .section li{font-size:15px !important; line-height:1.65 !important}
          .card{padding:16px}
        }
        @media(max-width:380px){
          .logo{font-size:13px}
          .nav-buttons a[href="/admin"]{display:none}
          .hero h1{font-size:20px !important}
        }
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
      <div style={{background:'#0A1931', color:'#fff', textAlign:'center', padding:'24px 14px', marginTop:'20px', lineHeight:'1.7'}}>PINNACLE SECURITY LTD © 2026 | Muyenga HQ - Plot 442 & 443 Massionatees, Muyenga Hill, Kampala<br/>Control 24/7: 0776971970 | hr@pinnaclegroup.co.ug | Free Food & Accommodation | No Fees | Licensed by Uganda Police<br/>We do not just guard buildings. We guard lives, families, businesses, and dreams.</div>
    </div>
  )
}