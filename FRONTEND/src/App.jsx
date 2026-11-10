// ===== PART 1 of 4 - PINNACLE SECURITY LTD - UPGRADED =====
import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDf2F5Y9fTYDoDky3OnqMwWbI4duXPu99c",
  authDomain: "pinnacle-security.firebaseapp.com",
  projectId: "pinnacle-security",
  storageBucket: "pinnacle-security.firebasestorage.app",
  messagingSenderId: "123982360487",
  appId: "1:123982360487:web:1f9e545294271c3bb3d082",
  measurementId: "G-7SB3L9XWE6"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const SUBMISSIONS = "submissions";
const ADMIN_PASSWORD = "Pinnacle2026!Secure123";

// ===== HELPERS =====
const cleanPhone = (p) => (p||'').replace(/[^0-9]/g,'');
const waPhone = (p) => { let c = cleanPhone(p); if(c.startsWith('0')) c = '256' + c.slice(1); return c; };
const waLink = (p, msg) => `https://wa.me/${waPhone(p)}?text=${encodeURIComponent(msg||'')}`;
const mailLink = (emails, subject, body) => `mailto:${Array.isArray(emails)?emails.join(','):emails}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

const APPLICANT_STATUS = ["Under Review", "Hired", "Rejected"];
const CONTACT_STATUS = ["Under Review", "Resolved", "Rejected"];

const getReplyTemplate = (item, status) => {
  const name = item.full_name || item.fullName || 'Dear Applicant';
  if(item.formType === 'applicant'){
    if(status === 'Hired') return `Dear ${name},\n\nCongratulations! 🎉 You have been HIRED by Pinnacle Security Ltd for the position of ${item.position || 'Security Officer'}.\n\nPlease report to our HQ at Plot 442 & 443 Masajjagere, Muyenga, Kampala for 2 weeks FREE training. Come with your National ID, LC1 letter and academic documents.\n\nCall Control Room: 0754 139726\nEmail: hr@pinnaclegroup.co.ug\n\nWelcome to Pinnacle Family!`;
    if(status === 'Rejected') return `Dear ${name},\n\nThank you for applying to Pinnacle Security Ltd for ${item.position || 'Security Officer'}.\n\nAfter review, we are unable to offer you a position at this time. Please do not give up, you can re-apply after 3 months.\n\nThank you for your interest.\nPinnacle Security Ltd - HR\n0754 139726`;
    return `Dear ${name},\n\nThank you for applying to Pinnacle Security Ltd. Your application for ${item.position || 'Security Officer'} is UNDER REVIEW.\n\nOur HR team will call you very soon. Please keep your phone on.\n\nControl: 0754 139726`;
  } else {
    if(status === 'Resolved') return `Dear ${name},\n\nThank you for contacting Pinnacle Security Ltd about ${item.service || 'our services'}.\n\nYour request has been RESOLVED. Our team will call you shortly to confirm deployment / quotation.\n\nFor urgent help call 0754 139726 (24/7 Control Room).\nThank you for choosing Pinnacle!`;
    if(status === 'Rejected') return `Dear ${name},\n\nThank you for contacting Pinnacle Security Ltd.\n\nWe have reviewed your request for ${item.service || 'our services'} and we are unable to proceed at this time. Please call us on 0754 139726 for other options.\n\nThank you.`;
    return `Dear ${name},\n\nThank you for contacting Pinnacle Security Ltd. Your request for ${item.service || 'our services'} is UNDER REVIEW.\n\nOur team will call you within 24 hours.\nControl: 0754 139726`;
  }
};

// ===== THEMES: 3 COLORS =====
// gold = Navy + Yellow (default), green = Dark Green + Lime, maroon = Maroon + Gold
const THEMES = [
  { id:'gold', label:'🟡 Gold / Navy' },
  { id:'green', label:'🟢 Green' },
  { id:'maroon', label:'🔴 Maroon' },
];

// ===== NAVBAR - NO ADMIN LINK (Admin only via /admin direct link) =====
const Navbar = ({ theme, setTheme }) => {
  const loc = useLocation();
  const active = (p) => loc.pathname === p ? {color:'var(--accent)', borderBottom:'3px solid var(--accent)'} : {color:'white'};
  const [open, setOpen] = useState(false);
  return (
    <nav className="nav">
      <div className="nav-top">
        <span className="logo">🛡️ PINNACLE SECURITY LTD</span>
        <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
          <select value={theme} onChange={e=>setTheme(e.target.value)} style={{padding:'6px', borderRadius:'20px', border:'2px solid var(--accent)', fontWeight:800, fontSize:'12px'}}>
            {THEMES.map(t=><option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
          <span className="menu-btn" onClick={()=>setOpen(!open)}>{open?'✕':'☰'}</span>
        </div>
      </div>
      <div className={`links ${open?'show':''}`}>
        <Link to="/" style={active("/")} onClick={()=>setOpen(false)}>Home</Link>
        <Link to="/about" style={active("/about")} onClick={()=>setOpen(false)}>About</Link>
        <Link to="/services" style={active("/services")} onClick={()=>setOpen(false)}>Services</Link>
        <Link to="/blog" style={active("/blog")} onClick={()=>setOpen(false)}>Jobs</Link>
        <Link to="/contact" style={active("/contact")} onClick={()=>setOpen(false)}>Contact</Link>
        <Link to="/join" className="btn-yellow" onClick={()=>setOpen(false)}>Apply Now</Link>
      </div>
    </nav>
  )
}

// ===== HOME - MORE TEXT =====
const Home = () => {
  const [i, setI] = useState(0);
  useEffect(()=>{ const t=setInterval(()=>setI(p=>(p+1)%3), 3500); return()=>clearInterval(t) },[]);
  const slides=[
    {t:"Pinnacle Security Limited - 4.3★ Rated", d:"Plot 442 & 443 Masajjagere, Muyenga - Licensed Security Company"},
    {t:"🚨 WE ARE RECRUITING - JOIN US TODAY", d:"SITE INCHARGE: UCE + 3yrs experience | SUPERVISOR: UACE + Rider Permit + 3yrs"},
    {t:"60+ Sites | 150+ Officers | 24/7 Control Room 0754 139726", d:"hr@pinnaclegroup.co.ug | Free Training | No Recruitment Fees"},
  ];
  return (<>
    <div className="hero"><h1>{slides[i].t}</h1><p>{slides[i].d}</p><div className="dots">{[0,1,2].map(n=><span key={n} className={n===i?'dot on':'dot'} onClick={()=>setI(n)}></span>)}</div><Link to="/join" className="btn-yellow big">Apply Now - Free</Link></div>
    <div className="section">
      <div className="card"><h3>🛡️ Who We Are - 4.3★ Rated Security Company in Kampala</h3><p>Pinnacle Security Ltd at Plot 442 & 443 Masajjagere, Off Kironde Road Muyenga is a URSB Licensed Private Security Organization. We protect 60+ sites in Kampala, Wakiso, Mukono, Entebbe with 150+ disciplined, trained officers. Control Room 0754 139726 is 24/7. We protect homes, shops, offices, schools, hotels, churches, construction sites and events. Our guards are trained in gate control, patrol, visitor registration, OB reporting, first aid, customer care and emergency response. We do not charge recruitment fees. We do not exploit guards. We train for free and we pay on time. That is why clients trust us and guards stay with us.</p></div>
      <div className="card gold"><h3>🎯 Our Core Services</h3><p>✅ Security Guard Service - Armed & Unarmed. ✅ Construction Security - Protect cement, iron bars, timber. ✅ CCTV Installation & Monitoring - View on phone anywhere. ✅ Mobile Patrol & Rapid Response - Car patrol every 2 hours. ✅ Event Security - Weddings, concerts, conferences. ✅ Alarm Systems & Electric Fences - Intruder alarm + solar backup.</p><Link to="/services" className="btn-yellow">View All Services + Prices</Link></div>
      <div className="card"><h3>⭐ Why 100+ Clients Choose Pinnacle?</h3><p><b>1. Rapid Response in 10 Minutes:</b> Our control room and patrol car respond fast in Muyenga, Buziga, Munyonyo, Ggaba, Kansanga, Kabalagala, Makindye, Nsambya, Kololo, Nakasero, Ntinda, Kira, Naalya, Entebbe Road.<br/><b>2. Supervision 3x a Week:</b> Every site is visited by a supervisor. No sleeping guards. No absent guards without replacement.<br/><b>3. Free Replacement:</b> If your guard is sick or absent, we replace same day free.<br/><b>4. Monthly Report:</b> You get a written report of incidents, attendance and patrol.<br/><b>5. Honest Pricing:</b> No hidden fees. Quotation is free. You only pay after deployment.</p></div>
      <div className="card dark"><h3>🚨 URGENT RECRUITMENT - No Fees - Free Training 2 Weeks</h3><p><b>SITE INCHARGE:</b> UCE + 3yrs experience. <b>SUPERVISOR:</b> UACE + Rider Permit + 3yrs. <b>GENERAL GUARD:</b> P7/UCE, Age 22-45. Training: 2 weeks free at Muyenga HQ. Come with National ID, LC1 letter, academic papers. No fees at any stage. If anyone asks you for money to get a job, report to 0754 139726 immediately - it is a scam.</p><Link to="/join" className="btn-yellow">Apply Now Online - Free</Link></div>
      <div className="card"><h3>📍 Areas We Cover</h3><p>Muyenga, Buziga, Munyonyo, Ggaba, Kansanga, Kabalagala, Makindye, Nsambya, Kololo, Nakasero, Kampala Central, Ntinda, Kira, Naalya, Bukoto, Naguru, Muyenga Hill, Entebbe, Kajjansi, Wakiso, Mukono, Seeta, Sonde, Gayaza, Matugga. If your area is not listed, call us - we can still deploy.</p></div>
      <div className="card gold"><h3>💬 What Our Clients Say</h3><p><i>"Since Pinnacle took over our construction site in Muyenga, theft stopped completely. Very disciplined guards." - Mr. Kato, Construction Client</i><br/><i>"Their patrol car comes every night. I sleep well now." - Mrs. Nakato, Home Client, Buziga</i><br/><i>"I applied free, trained free, and got deployed in 3 weeks. No bribe." - Officer Denis, Site Incharge</i></p></div>
    </div>
  </>)
}

const About = () => (
  <div className="section">
    <h2>About Pinnacle Security Ltd</h2>
    <div className="about-hero">
      <h3>🛡️ Pinnacle Security Ltd - Protecting What Matters Most Since 2018</h3>
      <p>Located at <b>Plot 442 & 443 Masajjagere, Off Kironde Road, Muyenga Hill, Kampala - Uganda</b>, Pinnacle Security Limited is a fully licensed Private Security Organization registered under URSB and Ministry of Internal Affairs.</p>
      <p>With <b>4.3★ Google Rating, 60+ Active Sites, 150+ Trained Officers</b> and 24/7 Control Room <b>0754 139726</b>, we are one of the fastest growing security companies in Kampala, Wakiso, Mukono and Entebbe corridor.</p>
      <p>We started small in 2018 with 10 guards. Today we protect homes, shops, schools, hotels, hospitals, churches, warehouses and construction sites across Uganda. Our secret is simple: Discipline, Integrity, Service, Courage, Professionalism. We treat every client like family and every guard like a brother/sister. We believe security is not just standing at a gate - it is protecting lives, property, dreams and investments.</p>
    </div>
    <div className="about-grid">
      <div className="card about-card"><div className="about-icon">🎯</div><h3>Our Mission</h3><p>To provide <b>professional, affordable, and reliable security solutions</b> to homes, businesses, construction sites, schools, hotels and events. We are committed to protecting lives, property and investments with discipline, integrity and rapid response. <b>No Hidden Fees, No Exploitation, Free Training for all recruits</b>.</p></div>
      <div className="card about-card gold"><div className="about-icon">👁️</div><h3>Our Vision</h3><p>To be <b>Uganda's most trusted and most respected security company by 2030</b>. A company where every client feels safe, every guard feels valued, and every site is protected with technology + manpower. We want to combine CCTV, alarms, electric fences, patrol cars and well-trained manpower to make Uganda safer, one site at a time.</p></div>
      <div className="card about-card dark-card"><div className="about-icon">💎</div><h3>Core Values</h3><ul className="about-list"><li><b>D</b> - Discipline: We obey orders, we keep time, we respect uniform.</li><li><b>I</b> - Integrity: We do not steal, we do not lie, we do not take bribes.</li><li><b>S</b> - Service: Client comes first, always.</li><li><b>C</b> - Courage: We stand firm in danger to protect you.</li><li><b>P</b> - Professionalism: Smart uniform, clean report, polite language.</li></ul></div>
    </div>
    <div className="card"><h3>📋 Our Licenses & Compliance</h3><p>✅ Registered with URSB (Uganda Registration Services Bureau). ✅ Licensed Private Security Organization under Ministry of Internal Affairs. ✅ Guards vetted with LC1 and Police. ✅ Uniformed, ID cards, radios. ✅ Monthly supervision and training refresher. When you hire Pinnacle, you hire a legal, compliant, accountable company - not a briefcase company.</p></div>
    <div className="card gold"><h3>🤝 How We Work With You - 4 Easy Steps</h3><p><b>Step 1:</b> Call 0754 139726 or fill Contact Form - Free site visit.<br/><b>Step 2:</b> We visit your site, assess risk, give free quotation same day.<br/><b>Step 3:</b> You approve, we deploy trained guards within 24-48 hours.<br/><b>Step 4:</b> Supervisor visits 3x a week, you get monthly report, we replace guards free if needed.</p></div>
  </div>
)// ===== PART 2 of 4 - SERVICES + JOBS + CONTACT + JOIN =====

const Services = () => {
  const [open,setOpen]=useState(null);
  const list=[
    {n:"1. Security Guard Service", short:"Armed & Unarmed guards for homes, shops, offices", full:["We deploy disciplined guards with uniform, ID, radio. Duties: Gate control, patrol, visitor register, night vigilance, OB report, customer care.", "Includes supervisor visits 3x a week, free replacement if guard absent, monthly report, 10 min rapid response.", "Best for: Homes, shops, offices, schools, hotels, hospitals, churches, warehouses, apartments. Call 0754 139726 for FREE quotation."]},
    {n:"2. Construction Site Security", short:"Special guards for building sites - protect cement, iron bars", full:["We understand construction theft: cement, D12/D16, timber, tools, Yaka, water tanks. Guards trained to check materials in/out, store management, night torch patrol.", "We keep a materials register: every bag of cement, every bar, every trip is recorded. Theft drops to zero when Pinnacle is on site.", "Best for: Building sites in Muyenga, Buziga, Munyonyo, Ggaba, Kira, Naalya, Entebbe Road, Wakiso, Mukono."]},
    {n:"3. CCTV Installation & Monitoring", short:"4 cameras from 2.5M with phone viewing", full:["We supply & install: DVR, 4 HD cameras, 1TB HDD, cables, installation. You view on phone anywhere. Night vision, motion alert.", "Brands: Hikvision, Dahua - 2 years warranty. We also do maintenance, repair, upgrade, and monitoring from our Control Room.", "Best for: Homes, shops, offices, schools, bars, rentals. Protect your property even when you are abroad."]},
    {n:"4. Mobile Patrol & Rapid Response", short:"Our car patrols your area every 2 hours", full:["Best for homes without full-time guard. Our patrol car with 2 officers patrols your zone. 3 visits day, 3 visits night. Random timing.", "Includes 10-min rapid response if alarm. Coverage: Muyenga, Buziga, Munyonyo, Ggaba, Kansanga, Kabalagala.", "If thieves try your home, our patrol will find them. If you press alarm, we come. You sleep, we watch."]},
    {n:"5. Event Security & Bouncers", short:"Weddings, concerts, conferences", full:["We provide: Crowd control, gate, VIP protection, parking control, anti-theft. Uniform: Smart suits for corporate, t-shirts for concerts.", "We handle: Weddings, introduction, graduation, concerts, football matches, church crusades, conferences, political rallies.", "Book early - 1 week before event for best planning. Call 0754 139726."]},
    {n:"6. Alarm Systems & Electric Fences", short:"Intruder alarm and electric fence protection", full:["Alarm: Magnetic sensors on doors/windows, motion inside, loud siren + call to your phone + control room.", "Electric Fence: 5 lines, energizer, battery backup, warning signs. Works on Yaka & solar.", "Best for: Homes, shops, schools, factories. Alarm + Fence + Guard = Maximum Protection. Ask for combined discount."]},
    {n:"7. VIP & Executive Protection", short:"Bodyguards for VIPs, businessmen, politicians", full:["Discreet, trained, polite bodyguards for VIP movement, airport pickup, hotel, meetings, events.", "We plan routes, check venues, and keep you safe without disturbing your business."]},
    {n:"8. Cash Escort & Bank Escort", short:"Safe movement of cash and valuables", full:["We escort cash from shop to bank, from bank to site, payroll escort, valuables escort. Armed + patrol car.", "Your money is safe with Pinnacle. We do not joke with cash."]},
  ];
  return (
    <div className="section"><h2>Our Services - Click + to Expand</h2>
      <p style={{textAlign:'center', marginBottom:'16px', background:'#fff3cd', padding:'12px', borderRadius:'10px'}}><b>All services include FREE site visit + FREE quotation.</b> Call 0754 139726 or fill Contact Form. No hidden fees. You only pay after deployment.</p>
      {list.map((s,i)=><div key={i} className="service-box"><div className="service-head" onClick={()=>setOpen(open===i?null:i)}><div><strong>{s.n}</strong><p className="service-short">{s.short}</p></div><span className="expand-btn">{open===i?'Close −':'Open +'}</span></div>{open===i&&<div className="service-body">{s.full.map((p,k)=><p key={k}>• {p}</p>)}</div>}</div>)}
      <div className="card dark" style={{marginTop:'16px'}}><h3>❓ Not Sure Which Service You Need?</h3><p>Tell us your problem: "Thieves steal at night", "My site loses cement", "I travel a lot", "My wedding needs security". We will advise you FREE. No pressure. Call 0754 139726 or WhatsApp us. We will visit your site and recommend the cheapest solution that actually works.</p><Link to="/contact" className="btn-yellow">Get Free Advice</Link></div>
    </div>
  )
}

const Blog = () => (
  <div className="section">
    <div className="memo">
      <div className="memo-head">
        <h2 style={{border:'none', marginBottom:'5px'}}>📋 INTERNAL MEMO - PINNACLE SECURITY LTD</h2>
        <p><b>From:</b> Human Resource Manager | <b>To:</b> All Applicants | <b>Date:</b> {new Date().toLocaleDateString()} | <b>Ref:</b> PSL/HR/2026/08</p>
        <p><b>Subject: URGENT RECRUITMENT - SITE INCHARGE, SUPERVISOR & GENERAL GUARDS</b></p>
      </div>
      <div className="memo-body">
        <p>Management has approved recruitment for immediate deployment. Applications are <b>FREE, No Fees</b>. Training is <b>2 weeks FREE at Muyenga HQ Plot 442/443</b>. If anyone asks you for money, it is a SCAM. Report to 0754 139726.</p>
        <div className="job-card">
          <h3>🔹 POSITION 1: SITE INCHARGE</h3>
          <p><b>Requirements:</b></p>
          <ul>
            <li> Minimum UCE Certificate (S4) with at least 4 passes</li>
            <li> 3+ Years experience in security (must have recommendation letter)</li>
            <li> Age 25-45 years, physically fit</li>
            <li> Can read/write English, can make daily OB reports</li>
            <li> No criminal record (we shall verify with LC1 & Police)</li>
            <li> Leadership skills - will manage 5-10 guards</li>
          </ul>
          <p><b>Duties:</b> Supervise guards, write daily report, handle client complaints, check attendance, ensure uniform discipline.</p>
          <p><b>What you get:</b> Salary on time, free uniform, free training, promotion to Supervisor if you perform well.</p>
        </div>
        <div className="job-card gold">
          <h3>🔹 POSITION 2: SUPERVISOR</h3>
          <p><b>Requirements:</b></p>
          <ul>
            <li> Minimum UACE Certificate (S6) - 2 principal passes</li>
            <li> Valid Rider Permit Class A - Must know how to ride motorcycle</li>
            <li> 3+ Years as security supervisor or site incharge (with proof)</li>
            <li> Age 27-40, must have smartphone for reports</li>
            <li> Can ride long distance: Kampala-Entebbe, Kampala-Mukono</li>
            <li> Honest, not drunkard, no accident history</li>
            <li> Can train new guards</li>
          </ul>
          <p><b>Duties:</b> Visit sites per day, check guards, handle emergencies, recruit new guards, report to Operations Manager.</p>
        </div>
        <div className="general-recruit">
          <h3>🔹 GENERAL RECRUITMENT: SECURITY OFFICER</h3>
          <p>We are ALWAYS recruiting disciplined men & women to join our team. You can apply as general guard and be called when vacancy comes.</p>
          <p><b>Requirements:</b> P7/UCE, Age 22-45, No crime, Physically fit, Willing to work day/night, Training FREE.</p>
          <p style={{fontSize:'13px', marginTop:'8px'}}>Women are highly encouraged to apply. We have many sites that need female guards for schools, hotels and homes.</p>
          <Link to="/join" className="big-recruit-btn">👮 APPLY NOW FOR GENERAL RECRUITMENT - FREE</Link>
        </div>
        <p style={{marginTop:'20px', background:'#fff3cd', padding:'12px', borderRadius:'8px'}}><b>How to Apply:</b> Click Apply Now, fill form. Or come physically to Plot 442/443 Masajjagere, Muyenga. Contact HR: <b>hr@pinnaclegroup.co.ug</b> / Control: 0754 139726. <b>Bring:</b> National ID, LC1 Letter, Academic Papers, 2 Passport Photos.</p>
        <p style={{marginTop:'10px', background:'#d4edda', padding:'12px', borderRadius:'8px'}}><b>After You Apply:</b> 1) HR reviews your form. 2) We call you for interview. 3) You do 2 weeks free training at Muyenga. 4) You get deployed to a site near you. 5) You start earning. Simple, free, fair.</p>
      </div>
    </div>
  </div>
)

const Contact = () => {
  const [f,setF]=useState({fullName:"",email:"",phone:"",service:"",message:""}); const [s,setS]=useState("");
  const send=async(e)=>{ e.preventDefault(); setS("Submitting..."); try{
    await addDoc(collection(db, SUBMISSIONS), { formType: "contact", status: "Under Review", fullName: f.fullName, full_name: f.fullName, email: f.email, phone: f.phone, service: f.service, message: f.message, createdAt: serverTimestamp(), created_at: new Date().toISOString() });
    setS("✅ Submitted! Our team will call you within 24 hours. Control: 0754 139726"); setF({fullName:"",email:"",phone:"",service:"",message:""})
  }catch(err){ console.log(err); setS("❌ Error - check Firebase Rules") } };
  return (
    <div className="section"><h2>Contact Us - Free Quotation</h2>
      <p style={{textAlign:'center', marginBottom:'14px'}}>Tell us what you need. We will call you back within 24 hours. For emergencies, call Control Room 0754 139726 (24/7).</p>
      <div className="form-2col">
        <div className="form-left-info">
          <div className="card"><h3>📍 Visit Us</h3><p>Plot 442 & 443 Masajjagere, Off Kironde Road, Muyenga Hill, Kampala.<br/>Mon-Sat 8am-6pm. Control Room 24/7.</p><p>📞 0754 139726<br/>📧 hr@pinnaclegroup.co.ug<br/>🌐 Pinnacle Security Ltd</p></div>
          <div className="card gold"><h3>⚡ Need Urgent Guard?</h3><p>If you need a guard TODAY, call 0754 139726 directly. Do not wait for form. We can deploy within 24-48 hours in Kampala.</p></div>
          <div className="card"><h3>💬 WhatsApp Us</h3><p>Click below to WhatsApp us your location and service needed. We reply fast.</p><a href="https://wa.me/256754139726?text=Hello%20Pinnacle%2C%20I%20need%20security%20service" target="_blank" rel="noreferrer" className="btn-yellow">WhatsApp 0754 139726</a></div>
        </div>
        <form className="form-big" onSubmit={send}>
          <div className="two-col">
            <input value={f.fullName} onChange={e=>setF({...f,fullName:e.target.value})} required placeholder="Enter your fullname"/>
            <input value={f.phone} onChange={e=>setF({...f,phone:e.target.value})} required placeholder="Enter your phone number"/>
          </div>
          <div className="two-col">
            <input type="email" value={f.email} onChange={e=>setF({...f,email:e.target.value})} required placeholder="Enter your email"/>
            <select value={f.service} onChange={e=>setF({...f,service:e.target.value})} required><option value="">Choose Service</option><option>Security Guard Service</option><option>Construction Security</option><option>CCTV Installation</option><option>Mobile Patrol</option><option>Event Security</option><option>Alarm System</option><option>VIP Protection</option><option>Cash Escort</option></select>
          </div>
          <textarea rows="5" value={f.message} onChange={e=>setF({...f,message:e.target.value})} required placeholder="Message / Location - e.g. I need 2 guards in Buziga for my home, starting next week"></textarea>
          <button className="big-btn">Submit - Get Free Quotation</button>{s&&<p className="msg">{s}</p>}
          <p style={{fontSize:'12px', textAlign:'center'}}>Your details are private. We will only use them to call you back about your request.</p>
        </form>
      </div>
    </div>
  )
}

const Join = () => {
  const [f,setF]=useState({fullName:"",phone:"",email:"",education:"",experience:"",interest:"",position:"SITE INCHARGE",district:""}); const [s,setS]=useState("");
  const send=async(e)=>{ e.preventDefault(); setS("Submitting..."); try{
    await addDoc(collection(db, SUBMISSIONS), { formType: "applicant", status: "Under Review", fullName: f.fullName, full_name: f.fullName, phone: f.phone, email: f.email, education: f.education, experience: f.experience, interest: f.interest, position: f.position, district: f.district, createdAt: serverTimestamp(), created_at: new Date().toISOString() });
    setS("✅ Submitted! HR will call you soon. Keep your phone on. Control: 0754 139726"); setF({fullName:"",phone:"",email:"",education:"",experience:"",interest:"",position:"SITE INCHARGE",district:""})
  }catch(err){ console.log(err); setS("❌ Error - check Firebase Rules") } };
  return (
    <div className="section"><h2>Apply Now - Free Training - No Fees</h2>
      <p style={{textAlign:'center', background:'#fff3cd', padding:'12px', borderRadius:'10px', marginBottom:'14px'}}><b>⚠️ WARNING:</b> Pinnacle NEVER charges fees. If anyone asks you for money for a job, it is a scam. Report to 0754 139726.</p>
      <form className="form-big" onSubmit={send}>
        <div className="two-col">
          <div><label>Full Name *</label><input value={f.fullName} onChange={e=>setF({...f,fullName:e.target.value})} required placeholder="Enter your fullname"/></div>
          <div><label>Phone *</label><input value={f.phone} onChange={e=>setF({...f,phone:e.target.value})} required placeholder="Enter your phone number"/></div>
        </div>
        <div className="two-col">
          <div><label>Email *</label><input type="email" value={f.email} onChange={e=>setF({...f,email:e.target.value})} required placeholder="Enter your email"/></div>
          <div><label>Education *</label><select value={f.education} onChange={e=>setF({...f,education:e.target.value})} required><option value="">Choose Education</option><option>P7</option><option>UCE</option><option>UACE</option><option>Diploma</option><option>Degree</option></select></div>
        </div>
        <div className="two-col">
          <div><label>Position Applying For *</label><select value={f.position} onChange={e=>setF({...f,position:e.target.value})} required><option>SITE INCHARGE</option><option>SUPERVISOR</option><option>SECURITY OFFICER - General</option></select></div>
          <div><label>District *</label><input value={f.district} onChange={e=>setF({...f,district:e.target.value})} required placeholder="Enter your district"/></div>
        </div>
        <div className="two-col">
          <div><label>Why Interested? *</label><input value={f.interest} onChange={e=>setF({...f,interest:e.target.value})} required placeholder="Why are you interested?"/></div>
          <div><label>Experience *</label><input value={f.experience} onChange={e=>setF({...f,experience:e.target.value})} required placeholder="Years & where you worked"/></div>
        </div>
        <button className="big-btn">Submit Application - Free</button>{s&&<p className="msg">{s}</p>}
        <p style={{fontSize:'12px', textAlign:'center', color:'#666'}}>After submit: HR reviews → Calls you for interview → 2 weeks free training at Muyenga → Deployment near you.</p>
      </form>
    </div>
  )
}// ===== PART 3A of 4 - ADMIN LOGIN + ADMIN START =====

const AdminLogin = ({ theme, setTheme }) => {
  const [pass, setPass] = useState(""); const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const login = (e) => {
    e.preventDefault();
    if (pass === ADMIN_PASSWORD) {
      localStorage.setItem("pinnacle_admin_token", pass);
      setMsg("✅ Correct! Opening admin...");
      setTimeout(()=> navigate("/admin"), 500);
    } else { setMsg(`❌ Wrong password.`); }
  };
  return (
    <div className="section" style={{maxWidth:'520px', margin:'60px auto'}}>
      <div className="form-big" style={{border:'3px solid var(--accent)', textAlign:'center'}}>
        <h2>🔐 Admin Login</h2>
        <p style={{background:'#fff3cd', padding:'10px', borderRadius:'8px', margin:'10px 0'}}>Protected - Manager Only<br/>Go to: pinnacle-security-bice.vercel.app/admin</p>
        <div style={{display:'flex', gap:'6px', justifyContent:'center', flexWrap:'wrap'}}>
          {THEMES.map(t=><button key={t.id} type="button" onClick={()=>setTheme(t.id)} className="tab" style={{borderColor:'var(--accent)', color: theme===t.id ? '#fff' : 'var(--nav)', background: theme===t.id ? 'var(--nav)' : '#fff'}}>{t.label}</button>)}
        </div>
        <form onSubmit={login} style={{display:'flex', flexDirection:'column', gap:'15px', marginTop:'20px'}}>
          <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Enter Admin Password" required style={{padding:'16px'}} />
          <button className="big-btn">Login to Dashboard</button>
          {msg && <p className="msg">{msg}</p>}
        </form>
        <Link to="/" style={{fontSize:'13px', fontWeight:800}}>← Back to Website</Link>
      </div>
    </div>
  )
}

// ===== ADMIN - PART 3A: State + Load + Helpers =====
const Admin = ({ theme, setTheme }) => {
  const [all, setAll] = useState([]);
  const [tab, setTab] = useState("applicants"); // applicants | contacts | trash
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [replyItem, setReplyItem] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyStatus, setReplyStatus] = useState("");
  const [bulkMsg, setBulkMsg] = useState("");
  const [showBulk, setShowBulk] = useState(false);
  const [showPrint, setShowPrint] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("pinnacle_admin_token");

  const load = async () => {
    setLoading(true); setError("");
    try {
      const snap = await getDocs(collection(db, SUBMISSIONS));
      const list = snap.docs.map(d => {
        const data = d.data();
        let t = 0;
        if (data.createdAt?.toDate) t = data.createdAt.toDate().getTime();
        else if (data.created_at) t = new Date(data.created_at).getTime();
        else if (data.createdAt?.seconds) t = data.createdAt.seconds * 1000;
        return { id: d.id, ...data, status: data.status || "Under Review", deleted: data.deleted || false, _time: t, createdAt: data.createdAt?.toDate?.() || data.created_at || new Date() };
      });
      list.sort((a,b)=> b._time - a._time);
      setAll(list);
    } catch(err){ console.log("Load error", err); setError("Load failed: " + (err.message||err)); }
    setLoading(false);
  };

  useEffect(()=>{ if(!token) navigate("/admin-login"); else load(); },[]);
  useEffect(()=>{ setPage(1); setSelected([]); },[tab, search, statusFilter, filterType, perPage]);

  const logout = () => { localStorage.removeItem("pinnacle_admin_token"); navigate("/admin-login"); };

  // Filtering - trash shows only deleted, others hide deleted
  const baseList = all.filter(x => {
    if(tab === 'trash') return x.deleted === true;
    if(x.deleted) return false;
    if(tab === 'contacts') return (x.formType||'').toLowerCase() === 'contact';
    return (x.formType||'').toLowerCase() === 'applicant';
  });

  const filtered = baseList.filter(item => {
    const q = search.toLowerCase();
    const name = (item.full_name||item.fullName||"").toLowerCase();
    const hay = `${name} ${item.email||''} ${item.phone||''} ${item.service||''} ${item.education||''} ${item.position||''} ${item.district||''} ${item.message||''} ${item.interest||''}`.toLowerCase();
    if(q && !hay.includes(q)) return false;
    if(statusFilter !== 'all' && (item.status||'') !== statusFilter) return false;
    if(filterType !== 'all'){
      if(tab === 'contacts' && !(item.service||'').toLowerCase().includes(filterType.toLowerCase())) return false;
      if(tab !== 'contacts' && tab !== 'trash' && (item.education||'') !== filterType) return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / perPage) || 1;
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage-1)*perPage, safePage*perPage);
  const contactsCount = all.filter(x=>!x.deleted && x.formType==='contact').length;
  const applicantsCount = all.filter(x=>!x.deleted && x.formType==='applicant').length;
  const trashCount = all.filter(x=>x.deleted).length;
  const hiredCount = all.filter(x=>!x.deleted && x.status==='Hired').length;
    // ===== PART 3B - ADMIN ACTIONS: Status + Auto Reply + Edit + Trash + Bulk + Export =====

  // Change status + open auto-reply box
  const changeStatus = async (item, newStatus) => {
    try {
      await updateDoc(doc(db, SUBMISSIONS, item.id), { status: newStatus });
      setAll(prev => prev.map(p => p.id === item.id ? { ...p, status: newStatus } : p));
      setReplyStatus(newStatus);
      setReplyItem({ ...item, status: newStatus });
      setReplyText(getReplyTemplate(item, newStatus));
    } catch(e){ alert("Status failed: " + e.message); }
  };

  // Send single reply - Email / WhatsApp / Copy
  const sendReplyEmail = () => {
    if(!replyItem) return;
    const subj = replyItem.formType === 'applicant' ? `Pinnacle Security - Your Application Status: ${replyStatus}` : `Pinnacle Security - Your Request Status: ${replyStatus}`;
    window.open(mailLink(replyItem.email, subj, replyText), '_blank');
  };
  const sendReplyWhatsApp = () => {
    if(!replyItem) return;
    window.open(waLink(replyItem.phone, replyText), '_blank');
  };
  const sendReplySMS = () => {
    if(!replyItem) return;
    window.open(`sms:${waPhone(replyItem.phone)}?body=${encodeURIComponent(replyText)}`, '_blank');
  };

  // Edit
  const saveEdit = async (e) => {
    e.preventDefault();
    if(!editItem) return;
    try {
      const { id, _time, createdAt, ...rest } = editItem;
      await updateDoc(doc(db, SUBMISSIONS, id), rest);
      setAll(prev => prev.map(p => p.id === id ? { ...p, ...rest } : p));
      setEditItem(null);
      alert("✅ Saved!");
    } catch(err){ alert("Edit failed: " + err.message); }
  };

  // Trash / Restore / Permanent Delete
  const moveToTrash = async (id) => {
    if(!window.confirm("Move to Trash? You can restore later.")) return;
    await updateDoc(doc(db, SUBMISSIONS, id), { deleted: true, deletedAt: new Date().toISOString() });
    setAll(prev => prev.map(p => p.id === id ? { ...p, deleted: true } : p));
    setSelected(prev => prev.filter(x => x !== id));
  };
  const restoreItem = async (id) => {
    await updateDoc(doc(db, SUBMISSIONS, id), { deleted: false });
    setAll(prev => prev.map(p => p.id === id ? { ...p, deleted: false } : p));
  };
  const deleteForever = async (id) => {
    if(!window.confirm("Delete FOREVER? Cannot restore.")) return;
    await deleteDoc(doc(db, SUBMISSIONS, id));
    setAll(prev => prev.filter(p => p.id !== id));
  };

  // Multi-select
  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  const toggleSelectAll = () => {
    if(selected.length === paged.length) setSelected([]);
    else setSelected(paged.map(p => p.id));
  };
  const bulkTrash = async () => {
    if(!selected.length) return alert("Select at least 1 first (tick checkbox)");
    if(!window.confirm(`Move ${selected.length} to Trash?`)) return;
    for(const id of selected){ await updateDoc(doc(db, SUBMISSIONS, id), { deleted: true }); }
    setAll(prev => prev.map(p => selected.includes(p.id) ? { ...p, deleted: true } : p));
    setSelected([]);
  };
  const bulkRestore = async () => {
    if(!selected.length) return alert("Select at least 1");
    for(const id of selected){ await updateDoc(doc(db, SUBMISSIONS, id), { deleted: false }); }
    setAll(prev => prev.map(p => selected.includes(p.id) ? { ...p, deleted: false } : p));
    setSelected([]);
  };
  const bulkDeleteForever = async () => {
    if(!selected.length) return alert("Select at least 1");
    if(!window.confirm(`Delete ${selected.length} FOREVER?`)) return;
    for(const id of selected){ await deleteDoc(doc(db, SUBMISSIONS, id)); }
    setAll(prev => prev.filter(p => !selected.includes(p.id)));
    setSelected([]);
  };

  // Bulk Email / WhatsApp / SMS - uses selected or all filtered
  const getBulkTargets = () => {
    const list = selected.length ? filtered.filter(x => selected.includes(x.id)) : filtered;
    return list;
  };
  const bulkEmail = () => {
    const list = getBulkTargets();
    if(!list.length) return alert("No one to email");
    const emails = [...new Set(list.map(x => x.email).filter(Boolean))];
    if(!emails.length) return alert("No emails found");
    window.open(mailLink(emails, "Message from Pinnacle Security Ltd", bulkMsg || "Hello, this is Pinnacle Security Ltd. Thank you for contacting / applying to us. Call 0754 139726."), '_blank');
  };
  const bulkWhatsApp = () => {
    const list = getBulkTargets();
    if(!list.length) return alert("No one selected");
    // WhatsApp only opens one by one - we open first 5, rest can be copied
    if(!window.confirm(`This will open WhatsApp for ${list.length} people one by one (first one now). Continue?`)) return;
    window.open(waLink(list[0].phone, bulkMsg || "Hello, this is Pinnacle Security Ltd. Thank you! Call 0754 139726."), '_blank');
  };
  const bulkSMS = () => {
    const list = getBulkTargets();
    if(!list.length) return alert("No one selected");
    window.open(`sms:${waPhone(list[0].phone)}?body=${encodeURIComponent(bulkMsg || "Hello from Pinnacle Security Ltd")}`, '_blank');
  };

  // Export CSV / PDF
  const exportExcel = () => {
    const data = filtered;
    if (!data.length) return alert("No data");
    const headers = ["Name","Email","Phone","Type","Service/Education","Position","District","Status","Message/Interest","Date"];
    const rows = data.map(r => [
      r.full_name||r.fullName||'', r.email||'', r.phone||'', r.formType||'', r.service||r.education||'', r.position||'', r.district||'', r.status||'', (r.message||r.interest||r.experience||'').replace(/\n/g,' '), new Date(r.createdAt||Date.now()).toLocaleString()
    ]);
    const csv = [headers.join(",")].concat(rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(","))).join("\n");
    const blob = new Blob([csv], {type:'text/csv'}); const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download=`pinnacle_${tab}.csv`; a.click();
  };
  const exportPDF = () => {
    const data = filtered;
    if(!data.length) return alert("No data to print");
    const html = `<html><head><title>Pinnacle - ${tab}</title><style>body{font-family:Arial} table{width:100%;border-collapse:collapse} th,td{border:1px solid #333;padding:8px;font-size:12px} th{background:#0a1931;color:#ffcc00}</style></head><body><h2>PINNACLE SECURITY LTD - ${tab.toUpperCase()} (${data.length})</h2><p>Generated: ${new Date().toLocaleString()} | Control: 0754 139726</p><table><tr><th>#</th><th>Name</th><th>Phone</th><th>Email</th><th>Service / Position</th><th>Status</th><th>Date</th></tr>${data.map((r,i)=>`<tr><td>${i+1}</td><td>${r.full_name||r.fullName||''}</td><td>${r.phone||''}</td><td>${r.email||''}</td><td>${r.service||r.education||''} ${r.position||''}</td><td>${r.status||''}</td><td>${new Date(r.createdAt||Date.now()).toLocaleDateString()}</td></tr>`).join('')}</table></body></html>`;
    const w = window.open('', '_blank'); w.document.write(html); w.document.close(); setTimeout(()=>w.print(), 500);
  };

  const statusColor = (s) => {
    if(s==='Hired' || s==='Resolved') return {background:'#dcfce7', color:'#166534'};
    if(s==='Rejected') return {background:'#fee2e2', color:'#991b1b'};
    return {background:'#fef9c3', color:'#854d0e'};
  };// PART 4A - Admin Actions
  const changeStatus = async (item, newStatus) => {
    try {
      await updateDoc(doc(db, SUBMISSIONS, item.id), { status: newStatus });
      setAll(p => p.map(x => x.id===item.id ? {...x, status:newStatus} : x));
    } catch(e){ alert("Failed: "+e.message); }
  };
  const moveToTrash = async (item) => {
    if(!window.confirm("Move to trash?")) return;
    await updateDoc(doc(db, SUBMISSIONS, item.id), { deleted:true });
    setAll(p => p.map(x=>x.id===item.id?{...x, deleted:true}:x));
  };
  const restoreItem = async (item) => {
    await updateDoc(doc(db, SUBMISSIONS, item.id), { deleted:false });
    setAll(p => p.map(x=>x.id===item.id?{...x, deleted:false}:x));
  };
  const deleteForever = async (item) => {
    if(!window.confirm("Delete FOREVER?")) return;
    await deleteDoc(doc(db, SUBMISSIONS, item.id));
    setAll(p => p.filter(x=>x.id!==item.id));
  };// PART 4B
  const emptyTrash = async () => {
    if(!window.confirm("Empty trash forever?")) return;
    const trash = all.filter(x=>x.deleted);
    for(const t of trash) await deleteDoc(doc(db, SUBMISSIONS, t.id));
    setAll(p=>p.filter(x=>!x.deleted));
  };
  const toggleSelect = (id) => setSelected(p=> p.includes(id) ? p.filter(x=>x!==id) : [...p, id]);
  const toggleAllPaged = () => {
    const ids = paged.map(x=>x.id);
    const allSel = ids.every(id=>selected.includes(id));
    setSelected(p=> allSel ? p.filter(x=>!ids.includes(x)) : [...new Set([...p, ...ids])]);
  };
  const bulkDelete = async () => {
    if(!selected.length) return alert("Select items first");
    if(!window.confirm(`Move ${selected.length} to trash?`)) return;
    for(const id of selected) await updateDoc(doc(db, SUBMISSIONS, id), { deleted:true });
    setAll(p=>p.map(x=>selected.includes(x.id)?{...x, deleted:true}:x)); setSelected([]);
  };// PART 4C
  const bulkStatus = async (st) => {
    if(!selected.length) return alert("Select items first");
    for(const id of selected) await updateDoc(doc(db, SUBMISSIONS, id), { status:st });
    setAll(p=>p.map(x=>selected.includes(x.id)?{...x, status:st}:x)); setSelected([]);
  };
  const saveEdit = async () => {
    if(!editItem) return;
    const {id, ...rest} = editItem; const clean = {...rest}; delete clean._time;
    await updateDoc(doc(db, SUBMISSIONS, id), clean);
    setAll(p=>p.map(x=>x.id===id?{...x, ...clean}:x)); setEditItem(null); alert("✅ Saved");
  };
  const openReply = (item) => {
    setReplyItem(item); setReplyStatus(item.status||"Under Review");
    setReplyText(getReplyTemplate(item, item.status||"Under Review"));
  };
  const sendReply = async (type) => {
    if(!replyItem) return;
    if(replyStatus !== replyItem.status) await changeStatus(replyItem, replyStatus);
    const msg = replyText;
    if(type==='whatsapp') window.open(waLink(replyItem.phone, msg), '_blank');
    if(type==='email') window.open(mailLink([replyItem.email, 'hr@pinnaclegroup.co.ug'], `Pinnacle - ${replyItem.formType} - ${replyStatus}`, msg), '_blank');
    if(type==='sms') window.open(`sms:${replyItem.phone}?body=${encodeURIComponent(msg)}`, '_blank');
    setReplyItem(null);
  };// PART 4D
  const exportCSV = () => {
    const rows = filtered.map(x=>[x.full_name||x.fullName||'', x.phone||'', x.email||'', x.status||'', x.position||x.service||'', new Date(x._time).toLocaleDateString()].join(','));
    const blob = new Blob([["Name,Phone,Email,Status,Position/Service,Date"].concat(rows).join("\n")], {type:'text/csv'});
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='pinnacle.csv'; a.click();
  };

  if(!token) return null;
  if(loading) return <div className="section"><h2>Loading admin...</h2></div>;

  return (
    <div className="section admin-wrap">
      <div className="admin-top">
        <div><h2>📊 Admin Dashboard</h2><p>Applicants: {applicantsCount} | Contacts: {contactsCount} | Hired: {hiredCount} | Trash: {trashCount}</p></div>
        <div style={{display:'flex', gap:'6px', flexWrap:'wrap'}}>
          <select value={theme} onChange={e=>setTheme(e.target.value)}>{THEMES.map(t=><option key={t.id} value={t.id}>{t.label}</option>)}</select>
          <button className="tab" onClick={load}>🔄 Refresh</button>
          <button className="tab" onClick={exportCSV}>⬇ CSV</button>
          <button className="tab" onClick={()=>window.print()}>🖨 Print / PDF</button>
          <button className="tab" onClick={logout}>Logout</button>
          <Link to="/" className="tab">← Website</Link>
        </div>
      </div>// PART 4E
      <div className="tabs">
        <button className={tab==='applicants'?'tab on':'tab'} onClick={()=>setTab('applicants')}>👮 Applicants ({applicantsCount})</button>
        <button className={tab==='contacts'?'tab on':'tab'} onClick={()=>setTab('contacts')}>📩 Contacts ({contactsCount})</button>
        <button className={tab==='trash'?'tab on':'tab'} onClick={()=>setTab('trash')}>🗑 Trash ({trashCount})</button>
      </div>

      <div className="filters">
        <input placeholder="🔍 Search name, phone, email, district..." value={search} onChange={e=>setSearch(e.target.value)} style={{flex:2}} />
        <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}><option value="all">All Status</option>{(tab==='contacts'?CONTACT_STATUS:APPLICANT_STATUS).map(s=><option key={s} value={s}>{s}</option>)}</select>
        <select value={filterType} onChange={e=>setFilterType(e.target.value)}><option value="all">All Types</option>{tab==='contacts'?["Security Guard Service","Construction Security","CCTV Installation","Mobile Patrol","Event Security","Alarm System","VIP Protection","Cash Escort"].map(s=><option key={s} value={s}>{s}</option>):["P7","UCE","UACE","Diploma","Degree"].map(s=><option key={s} value={s}>{s}</option>)}</select>
        <select value={perPage} onChange={e=>setPerPage(Number(e.target.value))}><option value={10}>10 / page</option><option value={20}>20 / page</option><option value={50}>50 / page</option></select>
      </div>

      {selected.length>0 && <div className="bulk-bar">✅ {selected.length} selected: <button onClick={()=>bulkStatus('Hired')}>Mark Hired</button><button onClick={()=>bulkStatus('Under Review')}>Mark Review</button><button onClick={()=>bulkStatus('Rejected')}>Mark Rejected</button><button onClick={bulkDelete}>🗑 Move to Trash</button><button onClick={()=>setSelected([])}>Clear</button></div>}
      {tab==='trash' && trashCount>0 && <div style={{margin:'10px 0'}}><button className="tab" onClick={emptyTrash}>Empty Trash Forever</button></div>}
      {error && <p style={{color:'red'}}>{error}</p>}// PART 4F
      <div className="table-wrap"><table className="admin-table">
        <thead><tr><th><input type="checkbox" checked={paged.length>0 && paged.every(x=>selected.includes(x.id))} onChange={toggleAllPaged}/></th><th>Name</th><th>Phone / Email</th><th>{tab==='contacts'?'Service':'Position / Edu'}</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
        <tbody>
          {paged.length===0 && <tr><td colSpan="7" style={{textAlign:'center', padding:'20px'}}>No records. Try clear search.</td></tr>}
          {paged.map(item=>(
            <tr key={item.id}>
              <td><input type="checkbox" checked={selected.includes(item.id)} onChange={()=>toggleSelect(item.id)}/></td>
              <td><b>{item.full_name||item.fullName||'No Name'}</b><br/><small>{item.district||''} {item.experience?`• ${item.experience}`:''}</small></td>
              <td><a href={`tel:${item.phone}`}>{item.phone||''}</a><br/><small>{item.email||''}</small></td>
              <td>{tab==='contacts'?item.service:item.position}<br/><small>{tab!=='contacts'?item.education:''} {item.message?`• ${String(item.message).slice(0,60)}`:''} {item.interest?`• ${String(item.interest).slice(0,60)}`:''}</small></td>
              <td><select value={item.status||'Under Review'} onChange={e=>changeStatus(item, e.target.value)} style={{padding:'6px', borderRadius:'6px', fontWeight:800}}>{(item.formType==='contact'?CONTACT_STATUS:APPLICANT_STATUS).map(s=><option key={s} value={s}>{s}</option>)}</select></td>
              <td><small>{new Date(item._time||Date.now()).toLocaleDateString()}</small></td>
              <td><div style={{display:'flex', gap:'4px', flexWrap:'wrap'}}>
                <button className="mini" onClick={()=>openReply(item)}>💬 Reply</button>
                <button className="mini" onClick={()=>setEditItem({...item})}>✏ Edit</button>
                {item.deleted ? <><button className="mini" onClick={()=>restoreItem(item)}>↩ Restore</button><button className="mini danger" onClick={()=>deleteForever(item)}>Delete Forever</button></> : <button className="mini danger" onClick={()=>moveToTrash(item)}>🗑 Trash</button>}
              </div></td>
            </tr>
          ))}
        </tbody>
      </table></div>

      <div style={{display:'flex', justifyContent:'center', gap:'8px', marginTop:'14px', alignItems:'center'}}>
        <button className="tab" disabled={safePage<=1} onClick={()=>setPage(safePage-1)}>← Prev</button>
        <span>Page {safePage} / {totalPages} — {filtered.length} total</span>
        <button className="tab" disabled={safePage>=totalPages} onClick={()=>setPage(safePage+1)}>Next →</button>
      </div>// PART 4G
      {editItem && <div className="modal"><div className="modal-box"><h3>✏ Edit Record</h3>
        <label>Full Name</label><input value={editItem.full_name||editItem.fullName||''} onChange={e=>setEditItem({...editItem, full_name:e.target.value, fullName:e.target.value})}/>
        <label>Phone</label><input value={editItem.phone||''} onChange={e=>setEditItem({...editItem, phone:e.target.value})}/>
        <label>Email</label><input value={editItem.email||''} onChange={e=>setEditItem({...editItem, email:e.target.value})}/>
        <label>District / Message</label><input value={editItem.district||editItem.message||''} onChange={e=>setEditItem({...editItem, district:e.target.value, message:e.target.value})}/>
        <label>Status</label><select value={editItem.status} onChange={e=>setEditItem({...editItem, status:e.target.value})}>{(editItem.formType==='contact'?CONTACT_STATUS:APPLICANT_STATUS).map(s=><option key={s} value={s}>{s}</option>)}</select>
        <div style={{display:'flex', gap:'8px', marginTop:'10px'}}><button className="big-btn" onClick={saveEdit}>Save</button><button className="tab" onClick={()=>setEditItem(null)}>Cancel</button></div>
      </div></div>}

      {replyItem && <div className="modal"><div className="modal-box"><h3>💬 Reply to {replyItem.full_name||replyItem.fullName}</h3>
        <p><b>Phone:</b> {replyItem.phone} | <b>Email:</b> {replyItem.email}</p>
        <label>Change Status</label><select value={replyStatus} onChange={e=>{setReplyStatus(e.target.value); setReplyText(getReplyTemplate(replyItem, e.target.value));}}>{(replyItem.formType==='contact'?CONTACT_STATUS:APPLICANT_STATUS).map(s=><option key={s} value={s}>{s}</option>)}</select>
        <label>Message (you can edit)</label><textarea rows="10" value={replyText} onChange={e=>setReplyText(e.target.value)} style={{width:'100%'}}/>
        <div style={{display:'flex', gap:'8px', flexWrap:'wrap', marginTop:'10px'}}>
          <button className="big-btn" onClick={()=>sendReply('whatsapp')}>🟢 Send WhatsApp</button>
          <button className="tab" onClick={()=>sendReply('email')}>📧 Send Email</button>
          <button className="tab" onClick={()=>sendReply('sms')}>📱 Send SMS</button>
          <button className="tab" onClick={()=>setReplyItem(null)}>Close</button>
        </div>
      </div></div>}
    </div>
  )
}// PART 5A - Footer + App
const Footer = () => (
  <footer className="footer">
    <div><h3>🛡️ PINNACLE SECURITY LTD</h3><p>Plot 442 & 443 Masajjagere, Off Kironde Road, Muyenga, Kampala<br/>📞 0754 139726 (24/7 Control Room) | 📧 hr@pinnaclegroup.co.ug</p><p>4.3★ Rated | 60+ Sites | 150+ Officers | URSB Licensed</p></div>
    <div><h4>Quick Links</h4><Link to="/">Home</Link> | <Link to="/services">Services</Link> | <Link to="/join">Apply</Link> | <Link to="/contact">Contact</Link></div>
    <div><h4>Services</h4><p>Guards • Construction • CCTV • Patrol • Events • Alarm • VIP • Cash Escort</p></div>
    <p className="copy">© {new Date().getFullYear()} Pinnacle Security Ltd. All Rights Reserved. No Recruitment Fees. | Admin: /admin (Manager Only)</p>
  </footer>
)

export default function App(){
  const [theme, setTheme] = useState(localStorage.getItem('pinnacle_theme')||'gold');
  useEffect(()=>{ localStorage.setItem('pinnacle_theme', theme); document.body.setAttribute('data-theme', theme); },[theme]);
  useEffect(()=>{ document.body.setAttribute('data-theme', theme); },[]);
  return (
    <div className="app">
      <style>{`// PART 5B
      `}</style>
      <Navbar/>
      <div className="top-strip">🚨 24/7 Control Room: 0754 139726 | No Recruitment Fees — Never Pay To Apply | Now Hiring in Kampala, Jinja, Mbarara, Gulu</div>
      <Routes>
        <Route path="/" element={<><Hero/><TrustBar/><HomeServices/><Stats/><About/><Gallery/><Testimonials/><ContactCTA/></>}/>
        <Route path="/services" element={<ServicesPage/>}/>
        <Route path="/join" element={<JoinPage/>}/>
        <Route path="/contact" element={<ContactPage/>}/>
        <Route path="/admin" element={<Admin/>}/>
        <Route path="*" element={<div className="section"><h2>Page not found</h2><Link to="/">Go Home</Link></div>}/>
      </Routes>
      <Footer/>
    </div>
  )
}