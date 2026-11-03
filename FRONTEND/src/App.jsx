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

// ===== 2-STEP VERIFICATION + DOUBLE GIT AT ONCE =====
const VerificationGate = ({ onVerified }) => {
  const [step, setStep] = useState(1);
  const [checked, setChecked] = useState(false);
  const [answer, setAnswer] = useState("");
  const [gitMsg, setGitMsg] = useState(false);
  const isMobile = useIsMobile();
  const num1 = 5;
  const num2 = 3;
  const correct = num1 + num2;

  const handleCheck = () => {
    if(checked) return;
    setChecked(true);
    setTimeout(() => setStep(2), 800);
  };

  const handleVerify2 = () => {
    if(parseInt(answer) !== correct){
      alert("Wrong answer! What is "+num1+" + "+num2+" ?");
      return;
    }
    setGitMsg(true);
    setTimeout(() => {
      sessionStorage.setItem('pinnacle_verified', 'true');
      onVerified();
    }, 2500);
  };

  return (
    <div style={{position:'fixed', inset:0, zIndex:99999, background:'#0A1931', display:'flex', alignItems:'center', justifyContent:'center', padding: isMobile ? '16px' : '20px'}}>
      <div style={{background:'#fff', borderRadius:'16px', maxWidth:'460px', width:'100%', padding: isMobile ? '20px 16px' : '28px 24px', boxShadow:'0 20px 60px rgba(0,0,0,0.5)', textAlign:'center'}}>
        <div style={{color:'#0A1931', fontWeight:900, fontSize:'19px'}}>PINNACLE SECURITY LTD</div>
        <div style={{color:'#666', fontSize:'11px', marginTop:'4px', fontWeight:700}}>Step {step} of 2 - Secure Access</div>
        <div style={{marginTop:'12px', display:'flex', gap:'6px', justifyContent:'center'}}>
          <div style={{width:'40px', height:'4px', borderRadius:'4px', background: step>=1 ? '#0A1931' : '#ddd'}}></div>
          <div style={{width:'40px', height:'4px', borderRadius:'4px', background: step>=2 ? '#0A1931' : '#ddd'}}></div>
        </div>

        {step===1 && (
          <>
            <div style={{marginTop:'18px', textAlign:'left', fontWeight:900, color:'#0A1931', fontSize:'14px'}}>Step 1: Confirm you are not a robot</div>
            <div onClick={handleCheck} style={{marginTop:'10px', background: checked ? '#e6f4ea' : '#f8fafc', border: checked ? '2px solid #0A1931' : '1px solid #ddd', borderRadius:'12px', padding:'14px', display:'flex', alignItems:'center', gap:'12px', cursor:'pointer', textAlign:'left'}}>
              <div style={{width:'28px', height:'28px', border:'2px solid #0A1931', borderRadius:'4px', display:'flex', alignItems:'center', justifyContent:'center', background: checked ? '#0A1931' : '#fff'}}>
                {checked && <span style={{color:'#FFD700', fontWeight:900, fontSize:'18px'}}>✓</span>}
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:900, color:'#0A1931', fontSize:'14px'}}>I'm not a robot</div>
                <div style={{fontSize:'11px', color:'#888'}}>Tap to verify</div>
              </div>
              <div style={{fontSize:'20px'}}>🛡️</div>
            </div>
            {checked && <div style={{marginTop:'12px', fontSize:'12px', color:'#0A1931'}}>✓ Checked - Loading next verification...</div>}
          </>
        )}

        {step===2 && !gitMsg && (
          <>
            <div style={{marginTop:'18px', textAlign:'left', fontWeight:900, color:'#0A1931', fontSize:'14px'}}>Step 2: Human Check - Quick Math</div>
            <div style={{marginTop:'10px', background:'#fffbe6', border:'1px solid #FFD700', borderRadius:'12px', padding:'14px', textAlign:'left'}}>
              <div style={{fontSize:'14px', color:'#0A1931', fontWeight:700}}>What is {num1} + {num2} ? (Prove you are human)</div>
              <input type="number" value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="Enter answer" style={{marginTop:'10px', padding:'10px', borderRadius:'8px', border:'1px solid #ccc', width:'100%', fontSize:'16px'}} />
              <button onClick={handleVerify2} style={{marginTop:'10px', width:'100%', background:'#0A1931', color:'#FFD700', padding:'10px', borderRadius:'20px', fontWeight:900, border:'none', cursor:'pointer'}}>VERIFY & SHOW GIT</button>
            </div>
          </>
        )}

        {gitMsg && (
          <div style={{marginTop:'16px', background:'#0A1931', color:'#00ff88', borderRadius:'10px', padding:'12px', textAlign:'left', fontFamily:'monospace', fontSize:'11.5px', lineHeight:'1.5'}}>
            <div style={{color:'#FFD700'}}>$ git log --oneline -2</div>
            <div style={{color:'#fff'}}>8f9a2c1 (HEAD -&gt; main) feat: step 1 - robot check passed</div>
            <div style={{color:'#fff'}}>a1b2c3d feat: step 2 - human math verified ({num1}+{num2}={correct})</div>
            <div style={{marginTop:'8px', color:'#FFD700'}}>$ git status</div>
            <div>✔ All checks passed - Human confirmed</div>
            <div style={{marginTop:'8px', color:'#FFD700'}}>$ git commit -m "secure: verified access"</div>
            <div>[main 9z8y7x6] secure: verified human access - Welcome to Pinnacle</div>
            <div style={{marginTop:'8px', color:'#fff', fontWeight:900}}>✓ Access Granted - Loading Pinnacle Security LTD...</div>
            <div style={{marginTop:'8px', width:'100%', height:'4px', background:'rgba(255,255,255,0.2)', borderRadius:'4px', overflow:'hidden'}}>
              <div style={{width:'100%', height:'100%', background:'#FFD700', animation:'load 2s ease forwards'}}></div>
            </div>
          </div>
        )}

        <div style={{marginTop:'12px', fontSize:'10px', color:'#999'}}>Protected by Pinnacle • 2-Step Verification • 0776971970</div>
      </div>
      <style>{`@keyframes load{0%{width:0}100%{width:100%}}`}</style>
    </div>
  )
}

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
        <span onClick={()=>scrollTo('home')} style={{color:'#FFD700', fontWeight:900, fontSize: isMobile ? '15px' : '17px', lineHeight:'1.15', whiteSpace:'nowrap', cursor:'pointer', flexShrink:0}}>PINNACLE<br/>SECURITY LTD</span>
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
        {!isMobile && (
          <div style={{display:'flex', gap:'6px', alignItems:'center', flexShrink:0, marginLeft:'8px', flexWrap:'nowrap'}}>
            <a onClick={() => scrollTo('join')} style={{background:'#FFD700', color:'#0A1931', padding:'8px 12px', borderRadius:'20px', fontWeight:900, textDecoration:'none', whiteSpace:'nowrap', cursor:'pointer', fontSize:'13px'}}>Apply Now</a>
            <a href="/admin" style={{color:'#ffcc00', fontWeight:'900', border:'1px solid #ffcc00', borderRadius:'20px', padding:'7px 10px', textDecoration:'none', whiteSpace:'nowrap', fontSize:'12.5px'}}>Admin</a>
            <button onClick={toggleTheme} style={{background: theme==='dark' ? '#ffcc00' : 'transparent', color: theme==='dark' ? '#0a1931' : '#ffcc00', border:'1px solid #ffcc00', padding:'7px 10px', borderRadius:'20px', fontWeight:900, cursor:'pointer', whiteSpace:'nowrap', fontSize:'12.5px'}}>
              {theme==='dark' ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
        )}
        {isMobile && (
          <button onClick={() => setOpen(!open)} aria-label="Menu" style={{background:'transparent', border:'1px solid #FFD700', width:'44px', height:'42px', borderRadius:'8px', cursor:'pointer', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', gap:'5px', padding:0, flexShrink:0, marginLeft:'auto'}}>
            <span style={{display:'block', width:'22px', height:'2.5px', background:'#FFD700', borderRadius:'2px'}}></span>
            <span style={{display:'block', width:'22px', height:'2.5px', background:'#FFD700', borderRadius:'2px'}}></span>
            <span style={{display:'block', width:'22px', height:'2.5px', background:'#FFD700', borderRadius:'2px'}}></span>
          </button>
        )}
      </div>
      {isMobile && open && (
        <div style={{background:'#0A1931', borderTop:'1px solid rgba(255,255,255,0.15)', padding:'6px 0 10px', display:'flex', flexDirection:'column', maxHeight:'75vh', overflowY:'auto'}}>
          <button style={{display:'block', width:'100%', fontSize:'16px', fontWeight:700, padding:'14px', cursor:'pointer', background:'#FFD700', color:'#0A1931', fontWeight:900, borderRadius:'10px', margin:'8px 12px', width:'auto', textAlign:'center', border:'none'}} onClick={() => scrollTo('join')}>✅ Apply Now - No Fees</button>
          <a href="/admin" style={{display:'block', width:'100%', color:'#ffcc00', fontSize:'16px', fontWeight:700, padding:'14px', cursor:'pointer', background:'transparent', textAlign:'center', border:'none', borderBottom:'1px solid rgba(255,255,255,0.12)', textDecoration:'none'}}>🔐 Admin</a>
          <button style={{display:'block', width:'100%', fontSize:'16px', fontWeight:700, padding:'14px', cursor:'pointer', background:'transparent', textAlign:'center', border:'none', color:'#ffcc00'}} onClick={toggleTheme}>{theme==='dark' ? '☀️ Switch to Light Mode' : '🌙 Switch to Dark Mode'}</button>
          <div style={{height:'1px', background:'rgba(255,255,255,0.2)', margin:'8px 0'}}></div>
          <button style={mobileLink} onClick={() => scrollTo('home')}>🏠 Home</button>
          <button style={mobileLink} onClick={() => scrollTo('about')}>ℹ️ About Pinnacle</button>
          <button style={mobileLink} onClick={() => scrollTo('services')}>🛡️ Services - Guard, CCTV, Patrol</button>
          <button style={mobileLink} onClick={() => scrollTo('mission')}>🎯 Mission, Vision, Values</button>
          <button style={mobileLink} onClick={() => scrollTo('jobs')}>💼 Jobs - We Are Hiring</button>
          <button style={mobileLink} onClick={() => scrollTo('aptitude')}>📝 Aptitude Test - Must Do</button>
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
        <div style={card}><h3 style={{color: t.text}}>Who We Are - Licensed & Trusted</h3><p style={{color: t.muted}}>Pinnacle Security Ltd is a fully licensed private security company at <b style={{color: t.text}}>Plot 442 & 443 Massionatees, Muyenga Hill</b>. Since 2009, we have grown to 60+ sites and 150+ trained officers. We provide <b style={{color: t.text}}>free food and accommodation</b> to all guards, supervisors and site incharges.</p></div>
        <div style={cardGold}><h3 style={{color: t.text}}>Core Services</h3><p style={{color: t.muted}}><b style={{color: t.text}}>Guard Service:</b> Day/night guards for homes, shops, offices — with free food & accommodation</p></div>
        <div style={cardDark}><h3 style={{color:'#FFD700'}}>URGENT RECRUITMENT - No Fees</h3><p style={{color:'#fff'}}><b>SITE INCHARGE:</b> UCE + 3yrs — Attractive salary + Free Food & Accommodation</p><p style={{color:'#fff', marginTop:'10px'}}><b>SUPERVISOR:</b> UACE + Rider Permit + 3yrs — Attractive salary + Free Food & Accommodation</p><p style={{color:'#fff', marginTop:'10px'}}><b>SECURITY OFFICER:</b> P7 & above — Attractive salary + Free Food & Accommodation</p><a onClick={() => document.getElementById('join').scrollIntoView({behavior:'smooth'})} style={{marginTop:'18px', width:'100%', textAlign:'center', display:'block', cursor:'pointer', background:'#FFD700', color:'#0A1931', padding:'12px 24px', borderRadius:'20px', fontWeight:900}}>Apply Now</a></div>
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
      <div style={{display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap:'16px'}}>
        <div style={card}><h3 style={{color: t.text}}>Our History & Welfare</h3><p style={{color: t.muted}}>Started in 2009. Today 150+ officers, 60+ sites. Free food & accommodation to all staff.</p></div>
        <div style={{...card, background: t.cardGold}}><h3 style={{color: t.text}}>Why Clients Trust Us</h3><p style={{color: t.muted}}>24/7 Control, 10-Min Response, Free Food & Accommodation, Replacement Guarantee.</p></div>
        <div style={{...card, background:'#000', color:'#fff'}}><h3 style={{color:'#FFD700'}}>Our Numbers</h3><p style={{color:'#fff'}}>150+ Officers<br/>60+ Sites<br/>UN 2013-2025, Serena Kigo</p></div>
      </div>
    </div>
  )
}

const Services = ({ t }) => {
  const isMobile = useIsMobile();
  const card = {background: t.card, padding:'20px', borderRadius:'12px', color: t.text, lineHeight:'1.7', marginBottom:'12px'};
  return (
    <div style={{maxWidth:'1200px', margin:'0 auto', padding: isMobile ? '16px 12px' : '20px'}}>
      <h2 style={{textAlign:'center', color: t.text, fontSize: isMobile ? '22px' : '28px'}}>Our Security Services</h2>
      <div style={card}><h3 style={{color: t.text}}>1. Security Guard Service</h3><p style={{color: t.muted}}>Homes, Shops, Offices - Day/night guards with free food & accommodation.</p></div>
      <div style={{...card, background: t.cardGold}}><h3 style={{color: t.text}}>2. Construction & CCTV & Patrol</h3><p style={{color: t.muted}}>CCTV 4 cam 1.2M, Patrol 3x night, Event 40k per guard.</p></div>
    </div>
  )
}

const MissionPage = ({ t }) => {
  const isMobile = useIsMobile();
  const card = {background: t.card, padding:'20px', borderRadius:'12px', lineHeight:'1.7'};
  return (
    <div style={{maxWidth:'1200px', margin:'0 auto', padding: isMobile ? '16px 12px' : '20px'}}>
      <h2 style={{textAlign:'center', color: t.text}}>Our Mission, Vision, Values</h2>
      <div style={{display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap:'16px'}}>
        <div style={card}><h3 style={{color: t.text}}>Mission</h3><p style={{color: t.muted}}>Professional, affordable, disciplined security.</p></div>
        <div style={{...card, background: t.cardGold}}><h3 style={{color: t.text}}>Vision 2030</h3><p style={{color: t.muted}}>500+ officers, 200+ sites.</p></div>
        <div style={{...card, background:'#000', color:'#fff'}}><h3 style={{color:'#FFD700'}}>DISCIPLINE</h3><p style={{color:'#fff'}}>Discipline is our daily life.</p></div>
      </div>
    </div>
  )
}

const Blog = ({ t }) => {
  const isMobile = useIsMobile();
  return (
    <div style={{maxWidth:'1200px', margin:'0 auto', padding: isMobile ? '16px 12px' : '20px'}}>
      <div style={{background: t.card, borderRadius:'14px', overflow:'hidden'}}>
        <div style={{background:'#0A1931', color:'#fff', padding:'20px'}}><h2 style={{color:'#FFD700', fontSize:'20px', margin:'0 0 8px'}}>INTERNAL MEMO - PINNACLE</h2><p style={{color:'#fff'}}>URGENT RECRUITMENT - Free Food & Accommodation - No Fees</p></div>
        <div style={{padding:'20px'}}>
          <Dropdown t={t} title="POSITION 1: SITE INCHARGE - 5 Posts" color="#ffcc00"><div style={{color: t.muted}}>Attractive salary + Free Food & Accommodation + Motorcycle</div></Dropdown>
          <Dropdown t={t} title="POSITION 2: SUPERVISOR - 10 Posts" color="#0a1931"><div style={{color: t.muted}}>Attractive salary + Free Food & Accommodation</div></Dropdown>
          <Dropdown t={t} title="POSITION 3: SECURITY OFFICER - 50 Posts" color="#0a1931"><div style={{color: t.muted}}>Attractive salary + Free Food & Accommodation</div></Dropdown>
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
      <h2 style={{textAlign:'center', color: t.text}}>Online Aptitude Test</h2>
      <div style={{display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap:'16px', marginTop:'16px'}}>
        <div style={card}><h3 style={{color: t.text}}>Step 1: Register</h3><a href={GOOGLE_APTITUDE_REGISTER} target="_blank" rel="noreferrer" style={{display:'block', textAlign:'center', marginTop:'12px', background:'#FFD700', color:'#0A1931', padding:'12px 24px', borderRadius:'20px', fontWeight:900, textDecoration:'none'}}>Register Now</a></div>
        <div style={{...card, background: t.cardGold}}><h3 style={{color: t.text}}>Step 2: Do Test</h3><a href={KOBO_APTITUDE_TEST} target="_blank" rel="noreferrer" style={{display:'block', textAlign:'center', marginTop:'12px', background:'#0a1931', color:'#ffcc00', padding:'12px 24px', borderRadius:'20px', fontWeight:900, textDecoration:'none'}}>Start Test</a></div>
        <div style={{...card, background:'#000', color:'#fff'}}><h3 style={{color:'#FFD700'}}>Step 3: Interview</h3><p style={{color:'#fff'}}>8am Muyenga HQ</p></div>
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
      <h2 style={{textAlign:'center', color: t.text}}>Apply Now - No Fees</h2>
      <div style={{background: t.card, padding:'20px', borderRadius:'12px', maxWidth:'600px', margin:'0 auto', color: t.text}}>
        {sent ? <p style={{textAlign:'center', fontWeight:900, color: t.text}}>✅ Application Sent!</p> : (
        <form onSubmit={submit} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
          <input required placeholder="Full Name" value={form.FullName} onChange={e=>setForm({...form, FullName:e.target.value})} style={inp} />
          <input required placeholder="Phone" value={form.Phone} onChange={e=>setForm({...form, Phone:e.target.value})} style={inp} />
          <input placeholder="Email" value={form.Email} onChange={e=>setForm({...form, Email:e.target.value})} style={inp} />
          <select value={form.Position} onChange={e=>setForm({...form, Position:e.target.value})} style={inp}><option>Security Officer</option><option>Supervisor</option><option>Site Incharge</option></select>
          <input placeholder="District" value={form.District} onChange={e=>setForm({...form, District:e.target.value})} style={inp} />
          <input placeholder="Education" value={form.Education} onChange={e=>setForm({...form, Education:e.target.value})} style={inp} />
          <input placeholder="Experience" value={form.Experience} onChange={e=>setForm({...form, Experience:e.target.value})} style={inp} />
          <button type="submit" style={{background:'#FFD700', color:'#0A1931', padding:'12px 24px', borderRadius:'20px', fontWeight:900, border:'none', cursor:'pointer'}}>Submit</button>
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
      <h2 style={{textAlign:'center', color: t.text}}>Contact Us</h2>
      <div style={{display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap:'16px'}}>
        <div style={{background: t.card, padding:'20px', borderRadius:'12px', color: t.text}}>
          <h3>📍 Visit / Call</h3><p>0776971970 | hr@pinnaclegroup.co.ug</p>
        </div>
        <div style={{background: t.card, padding:'20px', borderRadius:'12px', color: t.text}}>
          <h3>✉️ Send Message</h3>
          {sent ? <div style={{textAlign:'center'}}>✅ Sent!</div> : (
            <form onSubmit={submit} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
              <input required placeholder="Full Name" value={form.FullName} onChange={e=>setForm({...form, FullName:e.target.value})} style={inp} />
              <input required placeholder="Phone" value={form.Phone} onChange={e=>setForm({...form, Phone:e.target.value})} style={inp} />
              <input placeholder="Email" value={form.Email} onChange={e=>setForm({...form, Email:e.target.value})} style={inp} />
              <select value={form.Service} onChange={e=>setForm({...form, Service:e.target.value})} style={inp}><option>Security Guard Service</option><option>Construction</option><option>CCTV</option><option>Other</option></select>
              <textarea required rows={4} placeholder="Message" value={form.Messages} onChange={e=>setForm({...form, Messages:e.target.value})} style={{...inp, minHeight:'90px'}} />
              <button type="submit" disabled={sending} style={{background:'#FFD700', color:'#0A1931', padding:'12px 24px', borderRadius:'20px', fontWeight:900, border:'none', cursor:'pointer'}}>{sending?'Sending...':'Send'}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default function App(){
  const [theme, setTheme] = useState(() => { try{ return localStorage.getItem('pinnacle-theme') || 'light'; }catch(e){ return 'light'; } });
  const [verified, setVerified] = useState(() => { try{ return sessionStorage.getItem('pinnacle_verified') === 'true'; }catch(e){ return false; } });
  useEffect(()=>{ try{ localStorage.setItem('pinnacle-theme', theme); }catch(e){} },[theme]);
  const toggleTheme = () => setTheme(t => t==='light' ? 'dark' : 'light');
  const isDark = theme==='dark';
  const t = isDark ? { bg:'#0A1931', card:'#16294a', card2:'#0f2040', cardGold:'#2a2a1a', text:'#ffffff', muted:'#e2e8f0' } : { bg:'#f5f5f5', card:'#ffffff', card2:'#f8fafc', cardGold:'#fffbe6', text:'#0A1931', muted:'#334155' };
  if(window.location.pathname === '/admin') return <AdminDashboard />;
  return (
    <div style={{background: t.bg, minHeight:'100vh', color: t.text, fontFamily:'Arial', overflowX:'hidden'}}>
      <style>{`* {box-sizing:border-box} body{margin:0} html{scroll-behavior:smooth} img{max-width:100%}`}</style>
      {!verified && <VerificationGate onVerified={()=>setVerified(true)} />}
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <div style={{height:'64px'}}></div>
      <div id="home"><Home t={t} /></div>
      <div id="about"><About t={t} /></div>
      <div id="services"><Services t={t} /></div>
      <div id="mission"><MissionPage t={t} /></div>
      <div id="jobs"><Blog t={t} /></div>
      <div id="aptitude"><Aptitude t={t} /></div>
      <Join t={t} />
      <Contact t={t} />
      <div style={{background:'#0A1931', color:'#fff', textAlign:'center', padding:'24px 14px', marginTop:'20px'}}>PINNACLE SECURITY LTD © 2026 | 0776971970</div>
    </div>
  )
}