import AdminDashboard from './pages/AdminDashboard.jsx';
import React, { useState, useEffect } from 'react'

const GOOGLE_SHEET_WEBHOOK = "https://script.google.com/macros/s/AKfycbz0Fx9gSfPwPXZdi8pivw9IdQ_fzj707fPk22GBECuGYhGzwePtEPZV47TyXk8TN8bggQ/exec";
const KOBO_APTITUDE_TEST = "https://ee.kobotoolbox.org/x/ODCdeyaJ";
const GOOGLE_APTITUDE_REGISTER = "https://forms.gle/W8JroZ8n8HGArq248";

const getFullDateTime24 = () => {
  const d = new Date();
  const kampala = new Date(d.toLocaleString('en-US', {timeZone:'Africa/Kampala'}));
  return kampala.getDate().toString().padStart(2,'0') + '/' + (kampala.getMonth()+1).toString().padStart(2,'0') + '/' + kampala.getFullYear() + ' ' + kampala.getHours().toString().padStart(2,'0') + ':' + kampala.getMinutes().toString().padStart(2,'0') + ':' + kampala.getSeconds().toString().padStart(2,'0') + '.' + kampala.getMilliseconds() + '-' + Math.floor(Math.random()*900+100);
};

const useIsMobile = () => {
  const [m, setM] = useState(false);
  useEffect(() => {
    const check = () => setM(window.innerWidth <= 900);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return m;
};

const Dropdown = ({ title, children, color="#0a1931", t }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{background: t.card, borderRadius:'12px', marginBottom:'12px', border:'2px solid '+color, overflow:'hidden'}}>
      <div onClick={()=>setOpen(!open)} style={{padding:'14px 18px', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', background: open ? color : t.card, color: open ? '#ffcc00' : t.text, fontWeight:900, fontSize:'15px'}}>
        <span>{title}</span><span style={{fontSize:'20px'}}>{open ? '-' : '+'}</span>
      </div>
      {open && <div style={{padding:'16px 18px', fontSize:'16px', lineHeight:'1.8', color: t.muted, background: t.card2}}>{children}</div>}
    </div>
  )
}

const Navbar = ({ theme, toggleTheme }) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(null);
  const scrollTo = (id) => { setOpen(false); setHover(null); const el = document.getElementById(id); if (el) { const offset = 78; const top = el.getBoundingClientRect().top + window.scrollY - offset; window.scrollTo({ top, behavior: 'smooth' }); } };
  const dropWrap = {position:'relative'};
  const dropBtn = (active) => ({color: active ? '#ffcc00' : '#fff', textDecoration:'none', fontSize:'13.5px', fontWeight:700, padding:'8px 6px', cursor:'pointer', display:'inline-block', whiteSpace:'nowrap'});
  const mega = {position:'absolute', top:'100%', right:'0', width:'860px', maxWidth:'92vw', background:'#fff', borderRadius:'14px', boxShadow:'0 14px 35px rgba(0,0,0,0.25)', padding:'22px', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'20px', zIndex:10000, textAlign:'left'};
  const colTitle = {color:'#0a1931', fontSize:'13px', fontWeight:900, borderBottom:'3px solid #ffcc00', paddingBottom:'6px', marginBottom:'10px'};
  const colLink = {display:'block', color:'#333', fontSize:'14px', fontWeight:700, padding:'8px 6px', cursor:'pointer'};
  const colDesc = {display:'block', color:'#777', fontSize:'12px', fontWeight:400, lineHeight:'1.4'};
  const pcLink = {color:'#fff', textDecoration:'none', fontSize:'13.5px', padding:'8px 6px', cursor:'pointer', fontWeight:700, whiteSpace:'nowrap'};
  const mobileLink = {display:'block', width:'100%', color:'#fff', fontSize:'16px', fontWeight:700, padding:'14px', cursor:'pointer', background:'transparent', textAlign:'left', border:'none', borderBottom:'1px solid rgba(255,255,255,0.12)'};

  return (
    <nav style={{background:'#0A1931', position:'fixed', top:0, left:0, right:0, zIndex:9999, width:'100%', boxShadow:'0 4px 16px rgba(0,0,0,0.35)', borderBottom:'2px solid #FFD700'}}>
      <div style={{maxWidth:'1440px', margin:'0 auto', padding: isMobile ? '10px 12px' : '10px 14px', display:'flex', justifyContent:'space-between', alignItems:'center', gap:'8px', flexWrap:'nowrap'}}>
        <span onClick={()=>scrollTo('home')} style={{color:'#FFD700', fontWeight:900, fontSize: isMobile ? '14px' : '17px', lineHeight:'1.15', whiteSpace:'nowrap', cursor:'pointer', flexShrink:0}}>PINNACLE<br/>SECURITY LTD</span>

        {!isMobile && (
          <div style={{display:'flex', alignItems:'center', gap:'2px', marginLeft:'auto', justifyContent:'flex-end', flex:1, flexWrap:'nowrap'}}>
            <div style={{display:'flex', gap:'2px', alignItems:'center', justifyContent:'flex-end', flexWrap:'nowrap'}}>
              <a onClick={() => scrollTo('home')} style={pcLink}>Home</a>
              <div style={dropWrap} onMouseEnter={()=>setHover('about')} onMouseLeave={()=>setHover(null)}>
                <span style={dropBtn(hover==='about')} onClick={()=>scrollTo('about')}>About ▼</span>
                {hover==='about' && (<div style={mega}><div><div style={colTitle}>ABOUT PINNACLE</div><span style={colLink} onClick={()=>scrollTo('about')}>About Pinnacle <span style={colDesc}>Since 2009, 150+ officers, 60+ sites, UN 2013-2025, Serena Kigo.</span></span><span style={colLink} onClick={()=>scrollTo('about')}>Our History & Welfare <span style={colDesc}>Free Food & Accommodation for all staff.</span></span></div><div><div style={colTitle}>MISSION & VALUES</div><span style={colLink} onClick={()=>scrollTo('mission')}>Mission, Vision, Values <span style={colDesc}>DISCIPLINE - Our daily life, Vision 2030.</span></span><span style={colLink} onClick={()=>scrollTo('mission')}>Why Clients Trust Us <span style={colDesc}>24/7 Control, 10-Min Response, Replacement Guarantee.</span></span></div><div><div style={colTitle}>BIG CLIENTS</div><span style={colLink} onClick={()=>scrollTo('about')}>United Nations (UN) <span style={colDesc}>2013 to 2025 - 12 years.</span></span><span style={colLink} onClick={()=>scrollTo('about')}>Serena Hotel - Still in Kigo <span style={colDesc}>5-star standard, polite, smart.</span></span></div></div>)}
              </div>
              <div style={dropWrap} onMouseEnter={()=>setHover('services')} onMouseLeave={()=>setHover(null)}>
                <span style={dropBtn(hover==='services')} onClick={()=>scrollTo('services')}>Services ▼</span>
                {hover==='services' && (<div style={mega}><div><div style={colTitle}>🛡️ GUARDING</div><span style={colLink} onClick={()=>scrollTo('services')}>Security Guard Service <span style={colDesc}>Homes, Shops, Offices - Day / Night.</span></span><span style={colLink} onClick={()=>scrollTo('services')}>Construction Site Security <span style={colDesc}>Stop cement, iron bars, fuel theft.</span></span></div><div><div style={colTitle}>📹 TECHNOLOGY</div><span style={colLink} onClick={()=>scrollTo('services')}>CCTV Installation <span style={colDesc}>4 cameras 1.2M, 8 cameras 2.1M, phone viewing.</span></span><span style={colLink} onClick={()=>scrollTo('services')}>Mobile Patrol <span style={colDesc}>Patrol car visits 3x night.</span></span></div><div><div style={colTitle}>⭐ SPECIAL</div><span style={colLink} onClick={()=>scrollTo('services')}>Event Security <span style={colDesc}>40k per guard per day.</span></span><span style={colLink} onClick={()=>scrollTo('services')}>Escort & VIP Protection <span style={colDesc}>Cash, goods, VIP - safe, discreet.</span></span></div></div>)}
              </div>
              <div style={dropWrap} onMouseEnter={()=>setHover('career')} onMouseLeave={()=>setHover(null)}>
                <span style={dropBtn(hover==='career')} onClick={()=>scrollTo('jobs')}>Career ▼</span>
                {hover==='career' && (<div style={mega}><div><div style={colTitle}>💼 JOBS</div><span style={colLink} onClick={()=>scrollTo('jobs')}>Site Incharge - 5 Posts <span style={colDesc}>UCE + 3yrs + Free Food & Accommodation.</span></span><span style={colLink} onClick={()=>scrollTo('jobs')}>Security Officer - 50 Posts <span style={colDesc}>P7 & above, Free Food & Accommodation.</span></span></div><div><div style={colTitle}>📝 APPLY & TEST</div><span style={colLink} onClick={()=>scrollTo('aptitude')}>Aptitude Test <span style={colDesc}>Must for all - FREE, 20-30 mins.</span></span><span style={colLink} onClick={()=>scrollTo('join')}>Apply Now <span style={colDesc}>No Fees - Interview daily 8am Muyenga.</span></span></div><div><div style={colTitle}>🎓 GROW</div><span style={colLink} onClick={()=>scrollTo('jobs')}>Training - 2 Weeks FREE <span style={colDesc}>Discipline + OB + radio + first aid.</span></span><span style={colLink} onClick={()=>scrollTo('contact')}>Contact HR <span style={colDesc}>0776971970 - hr@pinnaclegroup.co.ug</span></span></div></div>)}
              </div>
              <a onClick={() => scrollTo('mission')} style={pcLink}>Mission</a>
              <a onClick={() => scrollTo('jobs')} style={pcLink}>Jobs</a>
              <a onClick={() => scrollTo('aptitude')} style={pcLink}>Aptitude Test</a>
              <a onClick={() => scrollTo('contact')} style={pcLink}>Contact</a>
            </div>
          </div>
        )}

        <div style={{display:'flex', gap: isMobile ? '5px' : '6px', alignItems:'center', flexShrink:0, marginLeft: isMobile ? 'auto' : '8px', flexWrap:'nowrap'}}>
          <a onClick={() => scrollTo('join')} style={{background:'#FFD700', color:'#0A1931', padding: isMobile ? '8px 10px' : '8px 12px', borderRadius:'20px', fontWeight:900, textDecoration:'none', whiteSpace:'nowrap', cursor:'pointer', fontSize: isMobile ? '12px' : '13px'}}>Apply Now</a>
          <a href="/admin" style={{color:'#ffcc00', fontWeight:'900', border:'1px solid #ffcc00', borderRadius:'20px', padding: isMobile ? '7px 9px' : '7px 10px', textDecoration:'none', whiteSpace:'nowrap', fontSize: isMobile ? '12px' : '12.5px'}}>Admin</a>
          <button onClick={toggleTheme} style={{background: theme==='dark' ? '#ffcc00' : 'transparent', color: theme==='dark' ? '#0a1931' : '#ffcc00', border:'1px solid #ffcc00', padding: isMobile ? '7px 9px' : '7px 10px', borderRadius:'20px', fontWeight:900, cursor:'pointer', whiteSpace:'nowrap', fontSize: isMobile ? '12px' : '12.5px'}}>
            {theme==='dark' ? '☀️ Light' : '🌙 Dark'}
          </button>
          {isMobile && (
            <button onClick={() => setOpen(!open)} aria-label="Menu" style={{background:'transparent', border:'1px solid #FFD700', width:'42px', height:'42px', borderRadius:'8px', cursor:'pointer', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', gap:'5px', padding:0, flexShrink:0}}>
              <span style={{display:'block', width:'22px', height:'2.5px', background:'#FFD700', borderRadius:'2px'}}></span>
              <span style={{display:'block', width:'22px', height:'2.5px', background:'#FFD700', borderRadius:'2px'}}></span>
              <span style={{display:'block', width:'22px', height:'2.5px', background:'#FFD700', borderRadius:'2px'}}></span>
            </button>
          )}
        </div>
      </div>

      {isMobile && open && (
        <div style={{background:'#0A1931', borderTop:'1px solid rgba(255,255,255,0.15)', padding:'6px 0 10px', display:'flex', flexDirection:'column', maxHeight:'70vh', overflowY:'auto'}}>
          <button style={mobileLink} onClick={() => scrollTo('home')}>🏠 Home</button>
          <button style={mobileLink} onClick={() => scrollTo('about')}>ℹ️ About Pinnacle</button>
          <button style={mobileLink} onClick={() => scrollTo('services')}>🛡️ Services - Guard, CCTV, Patrol</button>
          <button style={mobileLink} onClick={() => scrollTo('mission')}>🎯 Mission, Vision, Values</button>
          <button style={mobileLink} onClick={() => scrollTo('jobs')}>💼 Jobs - We Are Hiring</button>
          <button style={mobileLink} onClick={() => scrollTo('aptitude')}>📝 Aptitude Test - Must Do</button>
          <button style={mobileLink} onClick={() => scrollTo('join')}>✅ Apply Now - No Fees</button>
          <button style={{...mobileLink, borderBottom:'none'}} onClick={() => scrollTo('contact')}>📞 Contact - 0776971970</button>
        </div>
      )}
    </nav>
  )
}

const Home = ({ t }) => {
  const isMobile = useIsMobile();
  const [i, setI] = useState(0);
  useEffect(() => { const t2 = setInterval(() => setI(p => (p + 1) % 3), 3500); return () => clearInterval(t2) }, []);
  const slides = [
    { t: "Pinnacle Security Limited", d: "Plot 442 & 443 Masionatess, Muyenga - Licensed Security Company | 60+ Sites | 150+ Officers | 24/7 Control Room" },
    { t: "WE ARE RECRUITING - JOIN US TODAY", d: "SITE INCHARGE, SUPERVISOR, SECURITY OFFICER - Free Food & Accommodation + Free Training + No Fees" },
    { t: "Your Safety is Our Priority - 0776971970", d: "hr@pinnaclegroup.co.ug | Free Food & Accommodation | Free Training | No Recruitment Fees | Licensed by Uganda Police" },
  ];
  const card = {background: t.card, padding: isMobile ? '16px' : '20px', borderRadius:'12px', color: t.text, lineHeight:'1.7'};
  const cardGold = {...card, background: t.cardGold};
  const cardDark = {...card, background:'#000', color:'#fff', borderLeft:'4px solid #FFD700'};
  return (
    <div style={{maxWidth:'1200px', margin:'0 auto', padding: isMobile ? '16px 12px' : '20px', paddingTop:'30px'}}>
      <div style={{background:'#1a2f7a', color:'#fff', borderRadius:'16px', padding: isMobile ? '24px 14px' : '36px 20px', textAlign:'center'}}>
        <h1 style={{color:'#FFD700', fontSize: isMobile ? '23px' : '32px', lineHeight:'1.25', margin:'0 0 10px'}}>{slides[i].t}</h1>
        <p style={{fontSize: isMobile ? '15px' : '18px', color:'#fff', lineHeight:'1.6'}}>{slides[i].d}</p>
        <div style={{display:'flex', gap:'8px', justifyContent:'center', marginTop:'14px'}}>{[0,1,2].map(n => <span key={n} onClick={() => setI(n)} style={{width:'10px', height:'10px', borderRadius:'50%', background: n===i ? '#FFD700' : '#fff', opacity: n===i ? 1 : 0.5, cursor:'pointer'}}></span>)}</div>
        <div style={{display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap', marginTop:'12px'}}><a onClick={() => document.getElementById('join').scrollIntoView({behavior:'smooth'})} style={{background:'#FFD700', color:'#0A1931', padding:'12px 24px', borderRadius:'20px', fontWeight:900, cursor:'pointer'}}>Apply Now</a><a onClick={() => document.getElementById('aptitude').scrollIntoView({behavior:'smooth'})} style={{background:'#fff', color:'#0A1931', padding:'12px 24px', borderRadius:'20px', fontWeight:900, cursor:'pointer'}}>Aptitude Test</a></div>
      </div>
      <p style={{textAlign:'center', marginTop:'18px', fontSize:'17px', lineHeight:'1.7', color: t.muted}}>Welcome to Pinnacle Security Ltd. We are not just a security company. We are your neighbours, your protectors, your partners. When you sleep at night, we are awake. When you go to work, we guard your home. When you build, we guard your materials. When you celebrate, we guard your event. That is our promise: <b style={{color: t.text}}>We do not just guard buildings. We guard lives, families, businesses, and dreams.</b> We have protected the United Nations for 12 years, the Entebbe Express Highway, and Serena Hotel in Kigo. If big organisations trust us, you can trust us too. Call us today for a FREE site survey on 0776971970 - no fees, no pressure, just honest advice.</p>
      <div style={{marginTop:'22px', display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap:'16px'}}>
        <div style={card}><h3 style={{color: t.text}}>Who We Are - Licensed & Trusted</h3><p style={{color: t.muted}}>Pinnacle Security Ltd is a fully licensed private security company at <b style={{color: t.text}}>Plot 442 & 443 Massionatees, Muyenga Hill</b>. Since 2009, we have grown to 60+ sites and 150+ trained officers. We provide <b style={{color: t.text}}>free food and accommodation</b> to all guards, supervisors and site incharges.</p><p style={{color: t.muted, marginTop:'10px'}}>We have served big national clients including the <b style={{color: t.text}}>United Nations (UN) from 2013 to 2025</b>, the <b style={{color: t.text}}>Entebbe Express Highway</b>, and <b style={{color: t.text}}>Serena Hotel</b>. We are proud of that history, and we continue to serve with the same discipline today.</p><p style={{color: t.muted, marginTop:'10px'}}><b style={{color: t.text}}>More Explanation:</b> Being licensed means we are registered and approved by Uganda Police. We are not a briefcase company. You can visit our headquarters in Muyenga, see our control room, meet our managers, and check our files. We have an OB book at every site, a supervisor who visits twice daily, and a control room that answers 24/7.</p><p style={{color: t.muted, marginTop:'10px'}}><b style={{color: t.text}}>What Makes Us Different:</b> Many companies give guards low pay and no food, so guards sleep and steal. We do the opposite. We feed them, house them, train them, pay NSSF and insurance. A happy guard is an alert guard.</p></div>
        <div style={cardGold}><h3 style={{color: t.text}}>Core Services</h3><p style={{color: t.muted}}><b style={{color: t.text}}>Guard Service:</b> Day/night guards for homes, shops, offices — with free food & accommodation</p><p style={{color: t.muted}}><b style={{color: t.text}}>Site Incharge & Supervisor:</b> Experienced managers with motorcycle + free food & accommodation</p><p style={{color: t.muted}}><b style={{color: t.text}}>Construction Security:</b> Protect cement, iron bars, timber, fuel - count morning & evening</p><p style={{color: t.muted}}><b style={{color: t.text}}>CCTV, Mobile Patrol, Alarm:</b> Affordable packages - 4 cameras 1.2M, 8 cameras 2.1M</p><p style={{color: t.muted, marginTop:'10px'}}><b style={{color: t.text}}>More Explanation:</b> Each service is explained in full on the Services page. If you are not sure which service you need, call 0776971970 for a Free Site Survey. We will visit your place, check gates, walls, lights, and risk, then recommend the right number of guards. No fees for survey.</p></div>
        <div style={cardDark}><h3 style={{color:'#FFD700'}}>URGENT RECRUITMENT - No Fees</h3><p style={{color:'#fff'}}><b>SITE INCHARGE:</b> UCE + 3yrs — Attractive salary + Free Food & Accommodation</p><p style={{color:'#fff', marginTop:'10px'}}><b>SUPERVISOR:</b> UACE + Rider Permit + 3yrs — Attractive salary + Free Food & Accommodation</p><p style={{color:'#fff', marginTop:'10px'}}><b>SECURITY OFFICER:</b> P7 & above — Attractive salary + Free Food & Accommodation</p><p style={{color:'#fff', marginTop:'10px'}}><b>More Explanation:</b> All jobs are real, no fees, and interview is daily at 8am at Muyenga HQ. Bring National ID, CV, papers, 2 photos. First do Aptitude Test online (FREE), then come for interview. Training is 2 weeks FREE.</p><p style={{color:'#FFD700', marginTop:'10px'}}><b>Warning:</b> Pinnacle NEVER asks for money to give you a job. If anyone asks you for money in our name, report to 0776971970 immediately.</p><a onClick={() => document.getElementById('join').scrollIntoView({behavior:'smooth'})} style={{marginTop:'18px', width:'100%', textAlign:'center', display:'block', cursor:'pointer', background:'#FFD700', color:'#0A1931', padding:'12px 24px', borderRadius:'20px', fontWeight:900}}>Apply Now</a></div>
      </div>
    </div>
  )
}

const About = ({ t }) => {
  const isMobile = useIsMobile();
  const card = {background: t.card, padding:'20px', borderRadius:'12px', color: t.text, lineHeight:'1.7'};
  return (
    <div style={{maxWidth:'1200px', margin:'0 auto', padding: isMobile ? '16px 12px' : '20px'}}>
      <h2 style={{textAlign:'center', color: t.text, fontSize: isMobile ? '22px' : '28px'}}>About Pinnacle Security Ltd - Detailed</h2>
      <div style={{...card, textAlign:'center', marginBottom:'16px'}}><h3 style={{color: t.text}}>Pinnacle Security Ltd - Protecting What Matters Most Since 2009</h3><p style={{color: t.muted}}>Plot 442 & 443 Massionatees, Muyenga Hill, Kampala | Control 24/7: 0776971970 | Free Food & Accommodation For All Staff | No Recruitment Fees</p><p style={{color: t.muted, marginTop:'10px'}}>We started small in 2009 with only 5 guards and 1 client. God has grown us step by step. Today we protect homes, businesses, construction sites, hotels and national roads across Uganda.</p><p style={{color: t.muted, marginTop:'10px'}}>Our story is a story of discipline. We never missed a shift. We never stole from a client. We never asked for bribes. We kept OB books clean, uniforms smart, and radios charged. Clients saw that and trusted us with bigger jobs - from a small shop to the United Nations.</p></div>
      <div style={{display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap:'16px'}}>
        <div style={card}><h3 style={{color: t.text}}>Our History & Welfare</h3><p style={{color: t.muted}}>Started in 2009 with 5 guards and 1 client. Today 150+ officers, 60+ sites, patrol cars, CCTV team. Licensed by Uganda Police. We provide <b style={{color: t.text}}>free food and accommodation</b> to all staff.</p><p style={{color: t.muted, marginTop:'10px'}}><b style={{color: t.text}}>1. UNITED NATIONS (UN) — 2013 to 2025:</b> For 12 years, our officers guarded UN offices, compounds, warehouses and staff residences. UN checks everything - we passed for 12 years.</p><p style={{color: t.muted, marginTop:'8px'}}><b style={{color: t.text}}>2. ENTEBBE EXPRESS HIGHWAY:</b> Our teams guarded toll areas, construction materials, equipment, and workers day and night.</p><p style={{color: t.muted, marginTop:'8px'}}><b style={{color: t.text}}>3. SERENA HOTEL:</b> We are still present and still serving in <b style={{color: t.text}}>Serena Hotel in Kigo</b>.</p></div>
        <div style={{...card, background: t.cardGold}}><h3 style={{color: t.text}}>Why Clients Trust Us</h3><p style={{color: t.muted}}>1. <b style={{color: t.text}}>24/7 Control Room</b> — Call 0776971970 any time<br/>2. <b style={{color: t.text}}>10-Minute Response</b> — Patrol and supervisor rush to your site<br/>3. <b style={{color: t.text}}>Free Food & Accommodation</b> — A fed guard does not sleep, does not steal<br/>4. <b style={{color: t.text}}>Trained Officers:</b> 2 weeks training at Muyenga HQ<br/>5. <b style={{color: t.text}}>Affordable & Disciplined</b> — Clear price, no hidden fees<br/>6. <b style={{color: t.text}}>Supervisor Visits 2x Daily</b><br/>7. <b style={{color: t.text}}>Replacement Guarantee</b> — Replace same day, free.</p><p style={{color: t.muted, marginTop:'10px'}}><b style={{color: t.text}}>What Happens If Something Goes Wrong?</b> You call control room. Supervisor comes. We investigate. We replace guard if needed. We do not hide.</p></div>
        <div style={{...card, background:'#000', color:'#fff'}}><h3 style={{color:'#FFD700'}}>Our Numbers</h3><p style={{color:'#fff'}}>150+ Active Officers<br/>60+ Protected Sites<br/>15 Motorcycles + 3 Patrol Cars<br/>24/7 Control Room<br/>Free Food & Accommodation For All Staff<br/><br/><b>Major Contracts:</b><br/>• UN — 2013 to 2025 (12 Years)<br/>• Entebbe Express Highway<br/>• Serena Hotel — Still in Kigo</p><p style={{color:'#fff', marginTop:'12px'}}><b>Visit Us:</b> Come to Muyenga HQ any working day. See control room, meet managers, ask questions. We are open and proud.</p></div>
      </div>
    </div>
  )
}

const Services = ({ t }) => {
  const isMobile = useIsMobile();
  const card = {background: t.card, padding:'20px', borderRadius:'12px', color: t.text, lineHeight:'1.7', marginBottom:'12px'};
  return (
    <div style={{maxWidth:'1200px', margin:'0 auto', padding: isMobile ? '16px 12px' : '20px'}}>
      <h2 style={{textAlign:'center', color: t.text, fontSize: isMobile ? '22px' : '28px'}}>Our Security Services - Full Explanation</h2>
      <p style={{textAlign:'center', marginBottom:'18px', fontSize:'17px', color: t.muted}}>We offer 6 main services. All guards get free food & accommodation + attractive salary. All services include FREE site survey, written agreement, and 24/7 control room support.</p>
      <div style={card}><h3 style={{color: t.text}}>1. Security Guard Service - Homes, Shops, Offices</h3><p style={{color: t.muted}}>What you get: 1-4 guards per shift, uniformed, baton, radio, torch, OB book. Supervisor visits 2x daily, patrol 1x night. Guards get free food & accommodation at site.</p><p style={{color: t.muted, marginTop:'10px'}}>How it works: We visit your home or shop FREE, we check gates, walls, lights, and risk. Then we recommend 1 guard day + 1 guard night, or 2 guards if the place is big. We sign agreement, deploy guards in 24-48 hours.</p><p style={{color: t.muted, marginTop:'10px'}}><b style={{color: t.text}}>Perfect For:</b> Homes in Muyenga, Buziga, Munyonyo, Ntinda, Kira, Naalya, Entebbe. Shops, offices, schools, churches, warehouses, farms.</p></div>
      <div style={{...card, background: t.cardGold}}><h3 style={{color: t.text}}>2. Site Incharge & Supervisor Service</h3><p style={{color: t.muted}}>What you get: Experienced manager manages 5-15 guards, duty roster, OB, client handling. Gets free food & accommodation + motorcycle + fuel + airtime + attractive salary. When you have many guards, you need a leader.</p></div>
      <div style={card}><h3 style={{color: t.text}}>3. Construction Site Security</h3><p style={{color: t.muted}}>Problem: 30% materials stolen at night - cement, iron bars, timber, fuel, tools. We stop it. Guards count cement, iron bars, check lorries, check workers in/out, and guard at night. Morning count + evening count, signed by guard and site engineer. One bag of cement saved per day pays for guard.</p></div>
      <div style={{...card, background: t.cardGold}}><h3 style={{color: t.text}}>4. CCTV, Mobile Patrol, Event, Alarm</h3><p style={{color: t.muted}}><b style={{color: t.text}}>CCTV:</b> 4 cameras 1.2M, 8 cameras 2.1M, phone viewing, 1yr warranty.<br/><b style={{color: t.text}}>Mobile Patrol:</b> Patrol car visits 3x night.<br/><b style={{color: t.text}}>Event Security:</b> 40k per guard per day.<br/><b style={{color: t.text}}>Alarm:</b> 650k installed, calls 3 numbers.</p><p style={{color: t.muted, marginTop:'10px'}}>Call 0776971970 for a free quote. We explain all options honestly and recommend what fits your budget.</p></div>
      <div style={card}><h3 style={{color: t.text}}>5. Hotel & Corporate Security — Serena Standard</h3><p style={{color: t.muted}}>Hotels need polite, clean, smart guards who greet guests, check bags politely, control parking, and protect VIPs without disturbing guests. That is the Serena standard we learned at Serena Hotel in Kigo. Guests feel safe and welcome.</p></div>
      <div style={{...card, background: t.cardGold}}><h3 style={{color: t.text}}>6. Escort & Cash / VIP Protection</h3><p style={{color: t.muted}}>We escort cash, goods, and VIPs from one place to another with trained officers and radio communication to control room. Safe, discreet, on time. Your movement is confidential - we do not tell anyone.</p></div>
    </div>
  )
}

const MissionPage = ({ t }) => {
  const isMobile = useIsMobile();
  const card = {background: t.card, padding:'20px', borderRadius:'12px', lineHeight:'1.7'};
  return (
    <div style={{maxWidth:'1200px', margin:'0 auto', padding: isMobile ? '16px 12px' : '20px'}}>
      <h2 style={{textAlign:'center', color: t.text, fontSize: isMobile ? '22px' : '28px'}}>Our Mission, Vision, Values</h2>
      <p style={{textAlign:'center', marginBottom:'18px', fontSize:'17px', color: t.muted}}>We do not just guard buildings. We guard lives, families, businesses, and dreams. When a mother sleeps knowing her children are safe, when a businessman sleeps knowing his shop is safe - that is our mission fulfilled.</p>
      <div style={{display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap:'16px'}}>
        <div style={card}><h3 style={{color: t.text}}>Our Mission</h3><p style={{color: t.muted}}>To provide professional, affordable, disciplined security with 24/7 control room, trained guards, patrol, CCTV. We ensure all guards get free food & accommodation.</p><p style={{color: t.muted, marginTop:'10px'}}>We believe security should not be only for rich people. Every Ugandan deserves to sleep safely. So we keep prices fair, we do free surveys, we explain honestly, and we never overcharge.</p></div>
        <div style={{...card, background: t.cardGold}}><h3 style={{color: t.text}}>Our Vision 2030</h3><p style={{color: t.muted}}>To be Uganda's most trusted company by 2030 with 500+ officers, 200+ sites, own training school.</p><p style={{color: t.muted, marginTop:'10px'}}>By 2030, we want every district in Uganda to know Pinnacle. We want our own training school in Muyenga where young Ugandans learn discipline, security, first aid, CCTV, and customer care, and get jobs.</p></div>
        <div style={{...card, background:'#000', color:'#fff'}}><h3 style={{color:'#FFD700'}}>Core Values - DISCIPLINE</h3><div style={{color:'#fff', lineHeight:'1.7'}}><div><b>D - Discipline:</b> On time, smart uniform, OB book, no phone on duty, no sleeping.</div><div><b>I - Integrity:</b> We do not steal, we do not lie, we do not take bribes.</div><div><b>S - Service:</b> We serve you politely.</div><div><b>C - Courage:</b> We do not run when thieves come.</div><div><b>P - Professionalism:</b> Trained, uniformed, radio, report.</div><div><b>L - Loyalty:</b> Loyal to you, loyal to Pinnacle, loyal to God.</div><div><b>I - Innovation:</b> CCTV, patrol, phone reporting.</div><div><b>N - No Fees:</b> No recruitment fees. No hidden fees.</div><div><b>E - Excellence:</b> Every night, every site, excellence.</div></div><p style={{marginTop:'10px', color:'#ffcc00', fontWeight:800}}>DISCIPLINE is not a word on the wall — it is our daily life.</p></div>
      </div>
    </div>
  )
}

const Blog = ({ t }) => {
  const isMobile = useIsMobile();
  return (
    <div style={{maxWidth:'1200px', margin:'0 auto', padding: isMobile ? '16px 12px' : '20px'}}>
      <div style={{background: t.card, borderRadius:'14px', overflow:'hidden'}}>
        <div style={{background:'#0A1931', color:'#fff', padding:'20px'}}><h2 style={{color:'#FFD700', textAlign:'left', fontSize:'20px', margin:'0 0 8px'}}>INTERNAL MEMO - PINNACLE SECURITY LTD</h2><p style={{color:'#fff'}}><b>From:</b> HR Manager | <b>To:</b> All Applicants | <b>Date:</b> {new Date().toLocaleDateString()} | <b>Ref:</b> PSL/HR/2026/08</p><p style={{color:'#fff'}}><b>Subject: URGENT RECRUITMENT - SITE INCHARGE, SUPERVISOR, SECURITY OFFICER - FREE FOOD & ACCOMMODATION - NO FEES</b></p></div>
        <div style={{padding:'20px'}}>
          <div style={{marginBottom:'16px', lineHeight:'1.7', color: t.muted}}>Management approved urgent recruitment of 30 officers. <b style={{color: t.text}}>All positions come with free food & accommodation + attractive salary + free training + uniform. No Fees. Interview daily at 8am at Muyenga HQ.</b> Security is not just a job, it is a career. You can start as guard, become supervisor, become site incharge, become manager. Many of our supervisors started as guards.</div>
          <Dropdown t={t} title="POSITION 1: SITE INCHARGE - 5 Posts" color="#ffcc00"><div style={{color: t.muted, textAlign:'left'}}><p><b style={{color: t.text}}>Benefits:</b> Attractive salary + Free Food & Accommodation + Motorcycle + Fuel + Airtime</p><p style={{marginTop:'8px'}}><b style={{color: t.text}}>Requirements:</b> UCE and above, 3+ years as supervisor or guard, can read/write English, can manage 5-15 guards.</p></div></Dropdown>
          <Dropdown t={t} title="POSITION 2: SUPERVISOR - 10 Posts" color="#0a1931"><div style={{color: t.muted, textAlign:'left'}}><p><b style={{color: t.text}}>Benefits:</b> Attractive salary + Free Food & Accommodation + Motorcycle + Fuel + Airtime</p><p style={{marginTop:'8px'}}><b style={{color: t.text}}>Requirements:</b> UACE and above, Rider Permit, 3+ years experience, can ride motorcycle, can do night checks.</p></div></Dropdown>
          <Dropdown t={t} title="POSITION 3: SECURITY OFFICER - 50 Posts" color="#0a1931"><div style={{color: t.muted, textAlign:'left'}}><p><b style={{color: t.text}}>Benefits:</b> Attractive salary + Free Food & Accommodation + NSSF + Insurance + Uniform + Training</p><p style={{marginTop:'8px'}}><b style={{color: t.text}}>Requirements:</b> P7 and above, 18+ years, physically fit, disciplined, can read/write, no criminal record.</p></div></Dropdown>
          <div style={{marginTop:'16px', background:'#fff', color:'#0a1931', padding:'20px', borderRadius:'12px', lineHeight:'1.7'}}><h3 style={{color:'#0a1931'}}>🟡 TRAINING / INTERVIEWING — SUPERVISOR IS ON PROGRESS</h3><p><b>Please note:</b> Training and interviewing for <b>Supervisor</b> is currently <b>ON PROGRESS</b>. If you applied for Supervisor, please be patient — HR will call you.</p><p style={{marginTop:'10px'}}><b>Step 1 — Application:</b> Apply online OR walk to Muyenga HQ at 8am with National ID, CV, papers, 2 photos. No fees.</p><p style={{marginTop:'8px'}}><b>Step 2 — Interview:</b> HR interviews you at Muyenga HQ.</p><p style={{marginTop:'8px'}}><b>Step 3 — Aptitude Test:</b> You must do the Online Aptitude Test.</p><p style={{marginTop:'8px'}}><b>Step 4 — Document Check & Medical:</b> We check ID, LC letter, papers.</p><p style={{marginTop:'8px'}}><b>Step 5 — Training (2 Weeks, FREE):</b> Discipline, parade, OB book, radio, gate control, patrol, first aid.</p><p style={{marginTop:'8px'}}><b>Step 6 — Deployment:</b> After training, uniform, baton, torch, radio, start earning.</p></div>
        </div>
      </div>
    </div>
  )
}

const Aptitude = ({ t }) => {
  const isMobile = useIsMobile();
  const card = {background: t.card, padding:'20px', borderRadius:'12px', lineHeight:'1.7'};
  return (
    <div style={{maxWidth:'1200px', margin:'0 auto', padding: isMobile ? '16px 12px' : '20px'}}>
      <h2 style={{textAlign:'center', color: t.text, fontSize: isMobile ? '22px' : '28px'}}>Online Aptitude Test - Must for All Applicants</h2>
      <p style={{textAlign:'center', marginBottom:'18px', fontSize:'17px', color: t.muted}}>Every applicant MUST do this test. No test = No job. The test is FREE, online, from your phone. It takes only 20-30 minutes. Do not fear the test. It is not to fail you, it is to know you.</p>
      <div style={card}><h3 style={{color: t.text}}>What Is Aptitude Test? Why Must You Do It?</h3><p style={{color: t.muted}}>Aptitude test is a short exam that shows us if you can think, read, write, calculate, and behave like a disciplined security officer. A guard writes OB book, counts materials, checks IDs, calls control room on radio, and reports incidents. If you cannot write OB, you cannot be a guard.</p><p style={{color: t.muted, marginTop:'10px'}}><b style={{color: t.text}}>Tips To Pass:</b> 1. Read questions slowly. 2. Answer honestly. 3. Be calm. 4. Use your phone fully charged. 5. Do test alone. 6. If you fail, you can try again after HR advice.</p></div>
      <div style={{display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap:'16px', marginTop:'16px'}}>
        <div style={card}><h3 style={{color: t.text}}>Step 1: Register</h3><p style={{color: t.muted}}>First, register your name, phone, position you want, and district. Use your real name as on National ID. Use your real phone - HR will call this number.</p><a href={GOOGLE_APTITUDE_REGISTER} target="_blank" rel="noreferrer" style={{display:'block', textAlign:'center', marginTop:'12px', background:'#FFD700', color:'#0A1931', padding:'12px 24px', borderRadius:'20px', fontWeight:900, textDecoration:'none'}}>Register Now</a></div>
        <div style={{...card, background: t.cardGold}}><h3 style={{color: t.text}}>Step 2: Do Test</h3><p style={{color: t.muted}}>Do the test on KoboToolbox. 20-30 mins. English, maths, reasoning, discipline, security knowledge. Do it in a quiet place, no disturbance.</p><a href={KOBO_APTITUDE_TEST} target="_blank" rel="noreferrer" style={{display:'block', textAlign:'center', marginTop:'12px', background:'#0a1931', color:'#ffcc00', padding:'12px 24px', borderRadius:'20px', fontWeight:900, textDecoration:'none'}}>Start Test</a></div>
        <div style={{...card, background:'#000', color:'#fff'}}><h3 style={{color:'#FFD700'}}>Step 3: Interview</h3><p style={{color:'#fff'}}>After test, come for interview daily 8am Muyenga HQ with ID, CV, papers, 2 photos. No Fees. Tell HR you have done test.</p></div>
      </div>
    </div>
  )
}

const Join = ({ t }) => {
  const isMobile = useIsMobile();
  const [form, setForm] = useState({FullName:'', Phone:'', Email:'', Position:'Security Officer', District:'', Education:'', Experience:''});
  const [sent, setSent] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    const payload = Object.assign({}, form, {timestamp: getFullDateTime24(), Timestamp: getFullDateTime24(), type:'applicant'});
    try { await fetch(GOOGLE_SHEET_WEBHOOK,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain'},body:JSON.stringify(payload)}); } catch(err){}
    setSent(true);
  };
  const inp = {padding:'12px', borderRadius:'10px', border:'1px solid #ccc', width:'100%', fontSize:'15px', background:'#fff', color:'#0a1931', boxSizing:'border-box'};
  return (
    <div style={{maxWidth:'1200px', margin:'0 auto', padding: isMobile ? '16px 12px' : '20px'}} id="join">
      <h2 style={{textAlign:'center', color: t.text, fontSize: isMobile ? '22px' : '28px'}}>Apply Now - No Fees</h2>
      <p style={{textAlign:'center', marginBottom:'18px', fontSize:'16px', lineHeight:'1.7', color: t.muted}}>Fill this form honestly. It goes directly to Admin Dashboard. HR will call you same day or next day. After applying, you MUST do Aptitude Test, then come for interview at 8am Muyenga HQ. No fees at any stage. If anyone asks you for money, it is NOT Pinnacle - report to 0776971970.</p>
      <div style={{background: t.card, padding:'20px', borderRadius:'12px', maxWidth:'600px', margin:'0 auto', color: t.text}}>
        {sent ? <p style={{textAlign:'center', fontWeight:900, color: t.text}}>✅ Application Sent! Now do Aptitude Test, then come for interview 8am Muyenga HQ. HR will call you. Keep your phone on.</p> : (
        <form onSubmit={submit} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
          <input required placeholder="Full Name - as on National ID" value={form.FullName} onChange={e=>setForm({...form, FullName:e.target.value})} style={inp} />
          <input required placeholder="Phone e.g 0776971970" value={form.Phone} onChange={e=>setForm({...form, Phone:e.target.value})} style={inp} />
          <input placeholder="Email (optional)" value={form.Email} onChange={e=>setForm({...form, Email:e.target.value})} style={inp} />
          <select value={form.Position} onChange={e=>setForm({...form, Position:e.target.value})} style={inp}><option>Security Officer</option><option>Supervisor</option><option>Site Incharge</option></select>
          <input placeholder="District e.g Kampala, Wakiso, Entebbe" value={form.District} onChange={e=>setForm({...form, District:e.target.value})} style={inp} />
          <input placeholder="Education e.g UCE, UACE, P7, Diploma" value={form.Education} onChange={e=>setForm({...form, Education:e.target.value})} style={inp} />
          <input placeholder="Experience e.g 2 years as guard at..." value={form.Experience} onChange={e=>setForm({...form, Experience:e.target.value})} style={inp} />
          <button type="submit" style={{background:'#FFD700', color:'#0A1931', padding:'12px 24px', borderRadius:'20px', fontWeight:900, border:'none', cursor:'pointer'}}>Submit Application</button>
        </form>)}
      </div>
    </div>
  )
}

const Contact = ({ t }) => {
  const isMobile = useIsMobile();
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
  const inp = { padding:'12px 14px', borderRadius:'10px', border:'1px solid #ccc', width:'100%', fontSize:'15px', background:'#fff', color:'#0a1931', boxSizing:'border-box' };
  return (
    <div style={{maxWidth:'1200px', margin:'0 auto', padding: isMobile ? '16px 12px' : '20px'}} id="contact">
      <h2 style={{textAlign:'center', color: t.text, fontSize: isMobile ? '22px' : '28px'}}>Contact Us - Free Site Survey</h2>
      <p style={{textAlign:'center', marginBottom:'18px', fontSize:'16px', lineHeight:'1.7', color: t.muted}}>Tell us what you need. We call you back same day. No fees for survey. Whether you need 1 guard for your home, 10 guards for construction, CCTV for your shop, or security for your wedding - talk to us.</p>
      <div style={{display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap:'16px'}}>
        <div style={{background: t.card, padding:'20px', borderRadius:'12px', color: t.text, lineHeight:'1.7'}}>
          <h3 style={{color: t.text}}>📍 Visit / Call Us</h3>
          <p style={{color: t.muted}}><b style={{color: t.text}}>Plot 442 & 443 Massionatees, Muyenga Hill, Kampala</b> - Just above Muyenga, easy to find.</p>
          <p style={{color: t.muted}}>Control 24/7: <b style={{color: t.text}}>0776971970</b> | Email: <b style={{color: t.text}}>hr@pinnaclegroup.co.ug</b></p>
          <p style={{color: t.muted}}>Interview: Monday - Saturday, 8am, Muyenga HQ. Bring ID + CV + Papers + 2 Photos. No Fees.</p>
          <p style={{color: t.muted, marginTop:'12px'}}><b style={{color: t.text}}>After you send:</b><br/>1. Message goes to Admin as CONTACT<br/>2. HR calls you back same day<br/>3. We visit FREE & give fair price<br/>4. We sign agreement & deploy in 24-48 hours</p>
          <a href="tel:0776971970" style={{display:'block', textAlign:'center', marginTop:'14px', background:'#FFD700', color:'#0A1931', padding:'12px 24px', borderRadius:'20px', fontWeight:900, textDecoration:'none'}}>📞 Call 0776971970 Now</a>
          <a href="https://wa.me/256776971970" target="_blank" rel="noreferrer" style={{display:'block', textAlign:'center', marginTop:'10px', background:'#25D366', color:'#fff', padding:'12px 24px', borderRadius:'20px', fontWeight:900, textDecoration:'none'}}>💬 WhatsApp Us</a>
        </div>
        <div style={{background: t.card, padding:'20px', borderRadius:'12px', color: t.text}}>
          <h3 style={{color: t.text}}>✉️ Send Us A Message</h3>
          {sent ? (
            <div style={{textAlign:'center', padding:'20px'}}><div style={{fontSize:'48px'}}>✅</div><h3 style={{color: t.text}}>Message Sent!</h3><p style={{color: t.muted}}>Thank you {form.FullName}. We received your message about <b style={{color: t.text}}>{form.Service}</b>.</p><p style={{color: t.muted}}>HR will call you on <b style={{color: t.text}}>{form.Phone}</b> soon.</p><button onClick={()=>{setSent(false); setForm({FullName:'',Phone:'',Email:'',Service:'Security Guard Service',Messages:''})}} style={{background:'#FFD700', color:'#0A1931', padding:'12px 24px', borderRadius:'20px', fontWeight:900, border:'none', marginTop:'12px', cursor:'pointer'}}>Send Another Message</button></div>
          ) : (
            <form onSubmit={submit} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
              <label style={{color: t.text}}><b>Full Name *</b><input required placeholder="e.g John Kato" value={form.FullName} onChange={e=>setForm({...form, FullName:e.target.value})} style={inp} /></label>
              <label style={{color: t.text}}><b>Phone *</b><input required placeholder="e.g 0776971970" value={form.Phone} onChange={e=>setForm({...form, Phone:e.target.value})} style={inp} /></label>
              <label style={{color: t.text}}><b>Email (optional)</b><input placeholder="e.g john@gmail.com" value={form.Email} onChange={e=>setForm({...form, Email:e.target.value})} style={inp} /></label>
              <label style={{color: t.text}}><b>Service You Need *</b><select value={form.Service} onChange={e=>setForm({...form, Service:e.target.value})} style={inp}><option>Security Guard Service</option><option>Site Incharge & Supervisor</option><option>Construction Site Security</option><option>CCTV Installation</option><option>Mobile Patrol</option><option>Event Security</option><option>Alarm System</option><option>Hotel & Corporate Security</option><option>Escort & VIP Protection</option><option>Job Application / Other</option></select></label>
              <label style={{color: t.text}}><b>Message *</b><textarea required rows={4} placeholder="e.g I need 2 guards day and night for my home in Muyenga. Please visit for free survey." value={form.Messages} onChange={e=>setForm({...form, Messages:e.target.value})} style={{...inp, minHeight:'90px'}} /></label>
              <button type="submit" disabled={sending} style={{background:'#FFD700', color:'#0A1931', padding:'12px 24px', borderRadius:'20px', fontWeight:900, border:'none', cursor:'pointer', opacity:sending?0.6:1}}>{sending?'Sending...':'Send Message →'}</button>
              <p style={{fontSize:'12px', textAlign:'center', color: t.muted}}>Goes directly to Admin Dashboard. No fees.</p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default function App(){
  const [theme, setTheme] = useState(() => { try{ return localStorage.getItem('pinnacle-theme') || 'light'; }catch(e){ return 'light'; } });
  useEffect(()=>{ try{ localStorage.setItem('pinnacle-theme', theme); }catch(e){} },[theme]);
  const toggleTheme = () => setTheme(t => t==='light' ? 'dark' : 'light');
  const isDark = theme==='dark';
  const t = isDark
    ? { bg:'#0A1931', card:'#16294a', card2:'#0f2040', cardGold:'#2a2a1a', text:'#ffffff', muted:'#e2e8f0' }
    : { bg:'#f5f5f5', card:'#ffffff', card2:'#f8fafc', cardGold:'#fffbe6', text:'#0A1931', muted:'#334155' };

  if(window.location.pathname === '/admin') return <AdminDashboard />;

  return (
    <div style={{background: t.bg, minHeight:'100vh', color: t.text, fontFamily:'Arial', overflowX:'hidden'}}>
      <style>{`* {box-sizing:border-box} body{margin:0} html{scroll-behavior:smooth} img{max-width:100%}`}</style>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      {/* SPACER FOR FIXED NAVBAR - SO HERO IS NOT HIDDEN */}
      <div style={{height:'64px'}}></div>
      <div id="home"><Home t={t} /></div>
      <div id="about"><About t={t} /></div>
      <div id="services"><Services t={t} /></div>
      <div id="mission"><MissionPage t={t} /></div>
      <div id="jobs"><Blog t={t} /></div>
      <div id="aptitude"><Aptitude t={t} /></div>
      <Join t={t} />
      <Contact t={t} />
      <div style={{background:'#0A1931', color:'#fff', textAlign:'center', padding:'24px 14px', marginTop:'20px', lineHeight:'1.7', fontSize:'14px'}}>PINNACLE SECURITY LTD © 2026 | Muyenga HQ - Plot 442 & 443 Massionatees, Muyenga Hill, Kampala<br/>Control 24/7: 0776971970 | hr@pinnaclegroup.co.ug | Free Food & Accommodation | No Fees | Licensed by Uganda Police<br/>We do not just guard buildings. We guard lives, families, businesses, and dreams.</div>
    </div>
  )
}