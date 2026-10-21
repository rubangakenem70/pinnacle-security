import React, { useState, useEffect } from 'react'

const ADMIN_PASSWORD = "Pinnacle2026!Secure123";
const GOOGLE_SHEET_WEBHOOK = "https://script.google.com/macros/s/AKfycbz0Fx9gSfPwPXZdi8pivw9IdQ_fzj707fPk22GBECuGYhGzwePtEPZV47TyXk8TN8bggQ/exec";
const KOBO_APTITUDE_TEST = "https://ee.kobotoolbox.org/x/ODCdeyaJ";
const GOOGLE_APTITUDE_REGISTER = "https://forms.gle/W8JroZ8n8HGArq248";

// ========= ADMIN DASHBOARD - ARIAL 13px + CRUD =========
const AdminDashboard = () => {
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState("");
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("contacts");
  const [loading, setLoading] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({});

  const login = () => {
    if (pass === ADMIN_PASSWORD) setAuth(true);
    else alert("Wrong Password!");
  };

  const load = () => {
    setLoading(true);
    fetch(GOOGLE_SHEET_WEBHOOK)
      .then(r => r.json())
      .then(d => {
        const arr = Array.isArray(d) ? d : [];
        const sorted = arr.sort((a,b)=> new Date(b.timestamp || b.Timestamp || 0) - new Date(a.timestamp || a.Timestamp || 0));
        setData(sorted);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { if (auth) load(); }, [auth]);
  const getVal = (obj, keys) => { for(let k of keys) if(obj[k] !== undefined && obj[k] !== null && obj[k] !== '') return obj[k]; return ''; }
  const formatDate = (t) => { if(!t) return ''; try { return new Date(t).toLocaleString(); } catch { return t; } }

  const handleDelete = async (row) => {
    if(!window.confirm(`Delete ${getVal(row,['FullName','fullName'])} ?`)) return;
    const payload = { action: 'delete', timestamp: getVal(row,['Timestamp','timestamp']), type: tab==='contacts'?'contact':'applicant' };
    try { await fetch(GOOGLE_SHEET_WEBHOOK, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(payload) }); } catch {}
    setData(prev => prev.filter(r => getVal(r,['Timestamp','timestamp']) !== getVal(row,['Timestamp','timestamp'])));
  };

  const handleEdit = (row) => {
    setEditRow(getVal(row,['Timestamp','timestamp']));
    setForm({...row, fullName: getVal(row,['FullName','fullName']), FullName: getVal(row,['FullName','fullName']), phone: getVal(row,['Phone','phone']), Phone: getVal(row,['Phone','phone']), email: getVal(row,['Email','email']), Email: getVal(row,['Email','email']), service: getVal(row,['Service','service']), Service: getVal(row,['Service','service']), message: getVal(row,['Messages','message']), Messages: getVal(row,['Messages','message']), position: getVal(row,['Position','position']), Position: getVal(row,['Position','position']), education: getVal(row,['Education','education']), Education: getVal(row,['Education','education']), district: getVal(row,['District','district']), District: getVal(row,['District','district']), experience: getVal(row,['Experience','experience']), Experience: getVal(row,['Experience','experience']), interest: getVal(row,['Interest','interest']), Interest: getVal(row,['Interest','interest']) });
  };

  const handleSave = async () => {
    const payload = { action: 'update', ...form, timestamp: editRow, type: tab==='contacts'?'contact':'applicant' };
    try { await fetch(GOOGLE_SHEET_WEBHOOK, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(payload) }); } catch {}
    setData(prev => prev.map(r => getVal(r,['Timestamp','timestamp']) === editRow ? {...r, ...form} : r));
    setEditRow(null);
    setForm({});
  };

  const handleAddNew = async () => {
    const payload = { ...form, timestamp: new Date().toISOString(), type: tab==='contacts'?'contact':'applicant' };
    try { await fetch(GOOGLE_SHEET_WEBHOOK, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(payload) }); } catch {}
    setData(prev => [payload, ...prev]);
    setShowAdd(false);
    setForm({});
  };

  if (!auth) {
    return (
      <div style={{minHeight:'100vh', background:'#0a1931', display:'flex', justifyContent:'center', alignItems:'center', fontFamily:'Arial', fontSize:'13px'}}>
        <div style={{background:'#fff', padding:'30px', borderRadius:'16px', width:'90%', maxWidth:'380px', textAlign:'center', fontFamily:'Arial', fontSize:'13px'}}>
          <h2 style={{fontWeight:'900', color:'#0a1931', fontFamily:'Arial', fontSize:'16px'}}>🛡️ PINNACLE ADMIN</h2>
          <p style={{fontSize:'13px', color:'#666', marginTop:'6px', fontFamily:'Arial'}}>PSL db - Contacts & Applicants</p>
          <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Admin Password" style={{width:'100%', padding:'14px', borderRadius:'10px', marginTop:'15px', border:'2px solid #0a1931', fontFamily:'Arial', fontSize:'13px'}}/>
          <button onClick={login} style={{width:'100%', marginTop:'12px', background:'#ffcc00', padding:'14px', borderRadius:'10px', fontWeight:'900', border:'none', cursor:'pointer', fontFamily:'Arial', fontSize:'13px'}}>LOGIN</button>
          <a href="/" style={{display:'block', marginTop:'14px', color:'#0a1931', fontSize:'13px', textDecoration:'none', fontWeight:'800', fontFamily:'Arial'}}>← Back to Website</a>
        </div>
      </div>
    )
  }

  const applicants = data.filter(d => (d.type==='applicant') || getVal(d, ['Position','position']));
  const contacts = data.filter(d => (d.type==='contact') || getVal(d, ['Service','service']));

  const filteredContacts = contacts.filter(d => `${getVal(d,['FullName','fullName'])} ${getVal(d,['Phone','phone'])} ${getVal(d,['Email','email'])} ${getVal(d,['Service','service'])} ${getVal(d,['Messages','message'])}`.toLowerCase().includes(search.toLowerCase()));
  const filteredApplicants = applicants.filter(d => `${getVal(d,['FullName','fullName'])} ${getVal(d,['Phone','phone'])} ${getVal(d,['Email','email'])} ${getVal(d,['Position','position'])} ${getVal(d,['Education','education'])} ${getVal(d,['District','district'])} ${getVal(d,['Experience','experience'])} ${getVal(d,['Interest','interest'])}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{background:'#f4f6f9', minHeight:'100vh', fontFamily:'Arial', fontSize:'13px', padding:'20px'}}>
      <div style={{maxWidth:'1600px', margin:'auto'}}>
        <div style={{display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'12px', alignItems:'center', marginBottom:'20px'}}>
          <h1 style={{fontWeight:'900', color:'#0a1931', fontSize:'14px', fontFamily:'Arial'}}>PSL db Admin - {data.length} total</h1>
          <div style={{display:'flex', gap:'8px', flexWrap:'wrap'}}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search..." style={{padding:'10px 16px', borderRadius:'20px', border:'1px solid #ddd', width:'260px', fontFamily:'Arial', fontSize:'13px'}}/>
            <button onClick={()=>{setForm({}); setShowAdd(true)}} style={{background:'#ffcc00', color:'#0a1931', padding:'10px 18px', borderRadius:'20px', fontWeight:'800', border:'none', cursor:'pointer', fontFamily:'Arial', fontSize:'13px'}}>➕ Add New</button>
            <button onClick={load} style={{background:'#0a1931', color:'#ffcc00', padding:'10px 18px', borderRadius:'20px', fontWeight:'800', border:'none', cursor:'pointer', fontFamily:'Arial', fontSize:'13px'}}>{loading?'Loading...':'🔄 Refresh'}</button>
            <a href="/" style={{background:'#fff', color:'#0a1931', padding:'10px 18px', borderRadius:'20px', fontWeight:'800', textDecoration:'none', border:'2px solid #0a1931', fontFamily:'Arial', fontSize:'13px'}}>Website</a>
          </div>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px', marginBottom:'20px'}}>
          <div onClick={()=>setTab('contacts')} style={{background:tab==='contacts'?'#0a1931':'#fff', color:tab==='contacts'?'#ffcc00':'#0a1931', padding:'16px', borderRadius:'12px', cursor:'pointer', borderLeft:'5px solid #0a1931', fontFamily:'Arial', fontSize:'13px'}}><p style={{fontSize:'11px', fontWeight:'800', fontFamily:'Arial'}}>CONTACTS</p><h2 style={{fontSize:'22px', fontWeight:'900', fontFamily:'Arial'}}>{contacts.length}</h2></div>
          <div onClick={()=>setTab('applicants')} style={{background:tab==='applicants'?'#ffcc00':'#fff', padding:'16px', borderRadius:'12px', cursor:'pointer', borderLeft:'5px solid #ffcc00', fontFamily:'Arial', fontSize:'13px'}}><p style={{fontSize:'11px', fontWeight:'800', fontFamily:'Arial'}}>APPLICANTS</p><h2 style={{fontSize:'22px', fontWeight:'900', fontFamily:'Arial'}}>{applicants.length}</h2></div>
          <div style={{background:'#fff', padding:'16px', borderRadius:'12px', borderLeft:'5px solid #0a1931', fontFamily:'Arial', fontSize:'13px'}}><p style={{fontSize:'11px', fontWeight:'800', fontFamily:'Arial'}}>TOTAL</p><h2 style={{fontSize:'22px', fontWeight:'900', color:'#0a1931', fontFamily:'Arial'}}>{data.length}</h2></div>
        </div>

        {showAdd && (
          <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.6)', zIndex:10000, display:'flex', justifyContent:'center', alignItems:'center', padding:'20px'}}>
            <div style={{background:'#fff', padding:'20px', borderRadius:'12px', width:'90%', maxWidth:'500px', fontFamily:'Arial', fontSize:'13px'}}>
              <h3 style={{fontFamily:'Arial', fontSize:'13px'}}>Add New {tab}</h3>
              {tab==='contacts' ? (
                <>
                  <input placeholder="FullName" value={form.FullName||''} onChange={e=>setForm({...form, FullName:e.target.value, fullName:e.target.value})} style={{width:'100%', padding:'10px', marginTop:'8px', fontFamily:'Arial', fontSize:'13px', border:'1px solid #ccc', borderRadius:'8px'}}/>
                  <input placeholder="Phone" value={form.Phone||''} onChange={e=>setForm({...form, Phone:e.target.value, phone:e.target.value})} style={{width:'100%', padding:'10px', marginTop:'8px', fontFamily:'Arial', fontSize:'13px', border:'1px solid #ccc', borderRadius:'8px'}}/>
                  <input placeholder="Email" value={form.Email||''} onChange={e=>setForm({...form, Email:e.target.value, email:e.target.value})} style={{width:'100%', padding:'10px', marginTop:'8px', fontFamily:'Arial', fontSize:'13px', border:'1px solid #ccc', borderRadius:'8px'}}/>
                  <input placeholder="Service" value={form.Service||''} onChange={e=>setForm({...form, Service:e.target.value, service:e.target.value})} style={{width:'100%', padding:'10px', marginTop:'8px', fontFamily:'Arial', fontSize:'13px', border:'1px solid #ccc', borderRadius:'8px'}}/>
                  <textarea placeholder="Messages" value={form.Messages||''} onChange={e=>setForm({...form, Messages:e.target.value, message:e.target.value})} style={{width:'100%', padding:'10px', marginTop:'8px', fontFamily:'Arial', fontSize:'13px', border:'1px solid #ccc', borderRadius:'8px'}}/>
                </>
              ) : (
                <>
                  <input placeholder="FullName" value={form.FullName||''} onChange={e=>setForm({...form, FullName:e.target.value, fullName:e.target.value})} style={{width:'100%', padding:'10px', marginTop:'8px', fontFamily:'Arial', fontSize:'13px', border:'1px solid #ccc', borderRadius:'8px'}}/>
                  <input placeholder="Phone" value={form.Phone||''} onChange={e=>setForm({...form, Phone:e.target.value, phone:e.target.value})} style={{width:'100%', padding:'10px', marginTop:'8px', fontFamily:'Arial', fontSize:'13px', border:'1px solid #ccc', borderRadius:'8px'}}/>
                  <input placeholder="Email" value={form.Email||''} onChange={e=>setForm({...form, Email:e.target.value, email:e.target.value})} style={{width:'100%', padding:'10px', marginTop:'8px', fontFamily:'Arial', fontSize:'13px', border:'1px solid #ccc', borderRadius:'8px'}}/>
                  <input placeholder="Position" value={form.Position||''} onChange={e=>setForm({...form, Position:e.target.value, position:e.target.value})} style={{width:'100%', padding:'10px', marginTop:'8px', fontFamily:'Arial', fontSize:'13px', border:'1px solid #ccc', borderRadius:'8px'}}/>
                  <input placeholder="Education" value={form.Education||''} onChange={e=>setForm({...form, Education:e.target.value, education:e.target.value})} style={{width:'100%', padding:'10px', marginTop:'8px', fontFamily:'Arial', fontSize:'13px', border:'1px solid #ccc', borderRadius:'8px'}}/>
                  <input placeholder="District" value={form.District||''} onChange={e=>setForm({...form, District:e.target.value, district:e.target.value})} style={{width:'100%', padding:'10px', marginTop:'8px', fontFamily:'Arial', fontSize:'13px', border:'1px solid #ccc', borderRadius:'8px'}}/>
                  <input placeholder="Experience" value={form.Experience||''} onChange={e=>setForm({...form, Experience:e.target.value, experience:e.target.value})} style={{width:'100%', padding:'10px', marginTop:'8px', fontFamily:'Arial', fontSize:'13px', border:'1px solid #ccc', borderRadius:'8px'}}/>
                  <input placeholder="Interest" value={form.Interest||''} onChange={e=>setForm({...form, Interest:e.target.value, interest:e.target.value})} style={{width:'100%', padding:'10px', marginTop:'8px', fontFamily:'Arial', fontSize:'13px', border:'1px solid #ccc', borderRadius:'8px'}}/>
                </>
              )}
              <div style={{display:'flex', gap:'8px', marginTop:'12px'}}>
                <button onClick={handleAddNew} style={{background:'#0a1931', color:'#ffcc00', padding:'10px 18px', borderRadius:'8px', border:'none', cursor:'pointer', fontFamily:'Arial', fontSize:'13px', flex:1}}>Save</button>
                <button onClick={()=>setShowAdd(false)} style={{background:'#ccc', padding:'10px 18px', borderRadius:'8px', border:'none', cursor:'pointer', fontFamily:'Arial', fontSize:'13px', flex:1}}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {tab === 'contacts' && (
          <div style={{background:'#fff', borderRadius:'16px', overflow:'hidden', boxShadow:'0 4px 12px rgba(0,0,0,0.06)', fontFamily:'Arial', fontSize:'13px'}}>
            <div style={{background:'#0a1931', padding:'14px 20px', fontWeight:'900', color:'#ffcc00', fontFamily:'Arial', fontSize:'13px'}}>📞 CONTACTS - {filteredContacts.length} Records</div>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%', borderCollapse:'collapse', fontSize:'13px', fontFamily:'Arial', minWidth:'1350px'}}>
                <thead><tr style={{background:'#0a1931', color:'#ffcc00', textAlign:'left', fontFamily:'Arial', fontSize:'13px'}}><th style={{padding:'12px'}}>Timestamp</th><th style={{padding:'12px'}}>FullName</th><th style={{padding:'12px'}}>Phone</th><th style={{padding:'12px'}}>Email</th><th style={{padding:'12px'}}>Service</th><th style={{padding:'12px'}}>Messages</th><th style={{padding:'12px'}}>Actions</th></tr></thead>
                <tbody>{filteredContacts.map((d,i)=>{
                  const isEditing = editRow === getVal(d,['Timestamp','timestamp']);
                  return <tr key={i} style={{borderBottom:'1px solid #eee', background: i%2===0?'#fff':'#f8f9ff', fontFamily:'Arial', fontSize:'13px'}}>
                    <td style={{padding:'8px', fontFamily:'Arial', fontSize:'13px'}}>{formatDate(getVal(d,['Timestamp','timestamp']))}</td>
                    <td style={{padding:'8px', fontFamily:'Arial', fontSize:'13px'}}>{isEditing ? <input value={form.FullName||''} onChange={e=>setForm({...form, FullName:e.target.value, fullName:e.target.value})} style={{fontFamily:'Arial', fontSize:'13px', width:'100px'}}/> : getVal(d,['FullName','fullName'])}</td>
                    <td style={{padding:'8px', fontFamily:'Arial', fontSize:'13px'}}>{isEditing ? <input value={form.Phone||''} onChange={e=>setForm({...form, Phone:e.target.value, phone:e.target.value})} style={{fontFamily:'Arial', fontSize:'13px', width:'90px'}}/> : getVal(d,['Phone','phone'])}</td>
                    <td style={{padding:'8px', fontFamily:'Arial', fontSize:'13px'}}>{isEditing ? <input value={form.Email||''} onChange={e=>setForm({...form, Email:e.target.value, email:e.target.value})} style={{fontFamily:'Arial', fontSize:'13px', width:'120px'}}/> : getVal(d,['Email','email'])}</td>
                    <td style={{padding:'8px', fontFamily:'Arial', fontSize:'13px'}}>{isEditing ? <input value={form.Service||''} onChange={e=>setForm({...form, Service:e.target.value, service:e.target.value})} style={{fontFamily:'Arial', fontSize:'13px', width:'100px'}}/> : getVal(d,['Service','service'])}</td>
                    <td style={{padding:'8px', fontFamily:'Arial', fontSize:'13px'}}>{isEditing ? <input value={form.Messages||''} onChange={e=>setForm({...form, Messages:e.target.value, message:e.target.value})} style={{fontFamily:'Arial', fontSize:'13px', width:'150px'}}/> : getVal(d,['Messages','message'])}</td>
                    <td style={{padding:'8px', display:'flex', gap:'4px', fontFamily:'Arial', fontSize:'13px'}}>{isEditing ? <><button onClick={handleSave} style={{background:'#0a1931', color:'#ffcc00', border:'none', padding:'4px 8px', borderRadius:'4px', cursor:'pointer', fontFamily:'Arial', fontSize:'13px'}}>Save</button><button onClick={()=>setEditRow(null)} style={{background:'#ccc', border:'none', padding:'4px 8px', borderRadius:'4px', cursor:'pointer', fontFamily:'Arial', fontSize:'13px'}}>Cancel</button></> : <><button onClick={()=>handleEdit(d)} style={{background:'#ffcc00', border:'none', padding:'4px 8px', borderRadius:'4px', cursor:'pointer', fontFamily:'Arial', fontSize:'13px'}}>Edit</button><button onClick={()=>handleDelete(d)} style={{background:'#c00', color:'#fff', border:'none', padding:'4px 8px', borderRadius:'4px', cursor:'pointer', fontFamily:'Arial', fontSize:'13px'}}>Delete</button></>}</td>
                  </tr>
                })}</tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'applicants' && (
          <div style={{background:'#fff', borderRadius:'16px', overflow:'hidden', boxShadow:'0 4px 12px rgba(0,0,0,0.06)', fontFamily:'Arial', fontSize:'13px'}}>
            <div style={{background:'#ffcc00', padding:'14px 20px', fontWeight:'900', color:'#0a1931', fontFamily:'Arial', fontSize:'13px'}}>📋 APPLICANTS - {filteredApplicants.length} Records</div>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%', borderCollapse:'collapse', fontSize:'13px', fontFamily:'Arial', minWidth:'1600px'}}>
                <thead><tr style={{background:'#0a1931', color:'#ffcc00', textAlign:'left', fontFamily:'Arial', fontSize:'13px'}}><th style={{padding:'12px'}}>Timestamp</th><th style={{padding:'12px'}}>FullName</th><th style={{padding:'12px'}}>Phone</th><th style={{padding:'12px'}}>Email</th><th style={{padding:'12px'}}>Position</th><th style={{padding:'12px'}}>Education</th><th style={{padding:'12px'}}>District</th><th style={{padding:'12px'}}>Experience</th><th style={{padding:'12px'}}>Interest</th><th style={{padding:'12px'}}>Actions</th></tr></thead>
                <tbody>{filteredApplicants.map((d,i)=>{
                  const isEditing = editRow === getVal(d,['Timestamp','timestamp']);
                  return <tr key={i} style={{borderBottom:'1px solid #eee', background: i%2===0?'#fff':'#fffbeb', fontFamily:'Arial', fontSize:'13px'}}>
                    <td style={{padding:'8px', fontFamily:'Arial', fontSize:'13px'}}>{formatDate(getVal(d,['Timestamp','timestamp']))}</td>
                    <td style={{padding:'8px', fontFamily:'Arial', fontSize:'13px'}}>{isEditing ? <input value={form.FullName||''} onChange={e=>setForm({...form, FullName:e.target.value, fullName:e.target.value})} style={{fontFamily:'Arial', fontSize:'13px', width:'90px'}}/> : getVal(d,['FullName','fullName'])}</td>
                    <td style={{padding:'8px', fontFamily:'Arial', fontSize:'13px'}}>{isEditing ? <input value={form.Phone||''} onChange={e=>setForm({...form, Phone:e.target.value, phone:e.target.value})} style={{fontFamily:'Arial', fontSize:'13px', width:'80px'}}/> : getVal(d,['Phone','phone'])}</td>
                    <td style={{padding:'8px', fontFamily:'Arial', fontSize:'13px'}}>{isEditing ? <input value={form.Email||''} onChange={e=>setForm({...form, Email:e.target.value, email:e.target.value})} style={{fontFamily:'Arial', fontSize:'13px', width:'100px'}}/> : getVal(d,['Email','email'])}</td>
                    <td style={{padding:'8px', fontFamily:'Arial', fontSize:'13px'}}>{isEditing ? <input value={form.Position||''} onChange={e=>setForm({...form, Position:e.target.value, position:e.target.value})} style={{fontFamily:'Arial', fontSize:'13px', width:'80px'}}/> : getVal(d,['Position','position'])}</td>
                    <td style={{padding:'8px', fontFamily:'Arial', fontSize:'13px'}}>{isEditing ? <input value={form.Education||''} onChange={e=>setForm({...form, Education:e.target.value, education:e.target.value})} style={{fontFamily:'Arial', fontSize:'13px', width:'60px'}}/> : getVal(d,['Education','education'])}</td>
                    <td style={{padding:'8px', fontFamily:'Arial', fontSize:'13px'}}>{isEditing ? <input value={form.District||''} onChange={e=>setForm({...form, District:e.target.value, district:e.target.value})} style={{fontFamily:'Arial', fontSize:'13px', width:'70px'}}/> : getVal(d,['District','district'])}</td>
                    <td style={{padding:'8px', fontFamily:'Arial', fontSize:'13px'}}>{isEditing ? <input value={form.Experience||''} onChange={e=>setForm({...form, Experience:e.target.value, experience:e.target.value})} style={{fontFamily:'Arial', fontSize:'13px', width:'80px'}}/> : getVal(d,['Experience','experience'])}</td>
                    <td style={{padding:'8px', fontFamily:'Arial', fontSize:'13px'}}>{isEditing ? <input value={form.Interest||''} onChange={e=>setForm({...form, Interest:e.target.value, interest:e.target.value})} style={{fontFamily:'Arial', fontSize:'13px', width:'80px'}}/> : getVal(d,['Interest','interest'])}</td>
                    <td style={{padding:'8px', display:'flex', gap:'4px', fontFamily:'Arial', fontSize:'13px'}}>{isEditing ? <><button onClick={handleSave} style={{background:'#0a1931', color:'#ffcc00', border:'none', padding:'4px 8px', borderRadius:'4px', cursor:'pointer', fontFamily:'Arial', fontSize:'13px'}}>Save</button><button onClick={()=>setEditRow(null)} style={{background:'#ccc', border:'none', padding:'4px 8px', borderRadius:'4px', cursor:'pointer', fontFamily:'Arial', fontSize:'13px'}}>Cancel</button></> : <><button onClick={()=>handleEdit(d)} style={{background:'#ffcc00', border:'none', padding:'4px 8px', borderRadius:'4px', cursor:'pointer', fontFamily:'Arial', fontSize:'13px'}}>Edit</button><button onClick={()=>handleDelete(d)} style={{background:'#c00', color:'#fff', border:'none', padding:'4px 8px', borderRadius:'4px', cursor:'pointer', fontFamily:'Arial', fontSize:'13px'}}>Delete</button></>}</td>
                  </tr>
                })}</tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const scrollTo = (id) => {
    setOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const offset = 75;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };
  return (
    <nav className="nav">
      <div className="nav-top">
        <span className="logo">PINNACLE SECURITY LTD</span>
        <span className="menu-btn" onClick={() => setOpen(!open)}>{open ? '✕' : '☰'}</span>
      </div>
      <div className={`links ${open ? 'show' : ''}`}>
        <a onClick={() => scrollTo('home')}>Home</a>
        <a onClick={() => scrollTo('about')}>About</a>
        <a onClick={() => scrollTo('services')}>Services</a>
        <a onClick={() => scrollTo('mission')}>Mission</a>
        <a onClick={() => scrollTo('jobs')}>Jobs</a>
        <a onClick={() => scrollTo('aptitude')}>Aptitude Test</a>
        <a onClick={() => scrollTo('contact')}>Contact</a>
        <a onClick={() => scrollTo('join')} className="btn-yellow">Apply Now</a>
        <a href="/admin" style={{color:'#ffcc00', fontWeight:'900', border:'1px solid #ffcc00', borderRadius:'20px'}}>🛡️ Admin</a>
      </div>
    </nav>
  )
}

const Home = () => {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI(p => (p + 1) % 3), 3500); return () => clearInterval(t) }, []);
  const slides = [
    { t: "Pinnacle Security Limited", d: "Plot 442 & 443 Masionatess, Muyenga - Licensed Security Company" },
    { t: "WE ARE RECRUITING - JOIN US TODAY", d: "SITE INCHARGE: UCE + 3yrs | SUPERVISOR: UACE + Rider Permit + 3yrs" },
    { t: "60+ Sites | 150+ Officers | 24/7 Control Room in Entebbe 0776971970", d: "hr@pinnaclegroup.co.ug | Free Training | No Recruitment Fees" },
  ];
  return (
    <div className="section" style={{paddingTop:'30px'}}>
      <div className="hero">
        <h1>{slides[i].t}</h1>
        <p>{slides[i].d}</p>
        <div className="dots">{[0, 1, 2].map(n => <span key={n} className={n === i ? 'dot on' : 'dot'} onClick={() => setI(n)}></span>)}</div>
        <div style={{display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap', marginTop:'12px'}}>
          <a onClick={() => document.getElementById('join').scrollIntoView({behavior:'smooth'})} className="btn-yellow big" style={{cursor:'pointer'}}>Apply Now</a>
          <a onClick={() => document.getElementById('aptitude').scrollIntoView({behavior:'smooth'})} className="btn-yellow big" style={{background:'#fff !important', cursor:'pointer'}}>Aptitude Test</a>
        </div>
      </div>
      <div style={{marginTop:'22px'}}>
        <div className="home-grid-3">
          <div className="card"><h3>Who We Are</h3><p>Pinnacle Security Ltd is a licensed company at <b>Plot 442 & 443 Massionatees, Muyenga</b>.</p></div>
          <div className="card gold"><h3>Core Services</h3><p><b>Guard Service:</b> Armed & unarmed guards</p><p><b>Construction Security:</b> Protect cement, iron bars</p><p><b>CCTV:</b> Hikvision/Dahua</p><p><b>Mobile Patrol:</b> 10min response</p></div>
          <div className="card dark"><h3> URGENT RECRUITMENT</h3><p><b>SITE INCHARGE:</b> UCE + 3yrs</p><p style={{marginTop:'10px'}}><b>SUPERVISOR:</b> UACE + Rider Permit + 3yrs</p><a onClick={() => document.getElementById('join').scrollIntoView({behavior:'smooth'})} className="btn-yellow big" style={{marginTop:'18px', width:'100%', textAlign:'center', display:'block', cursor:'pointer'}}>Apply Now</a></div>
        </div>
      </div>
    </div>
  )
}

const About = () => (
  <div className="section">
    <h2>About Pinnacle Security Ltd</h2>
    <div className="about-hero"><h3>Pinnacle Security Ltd - Protecting What Matters Most Since 2018</h3><p>Located at Plot 442 & 443 Massionatees, Muyenga Hill, Kampala</p></div>
  </div>
)

const Services = () => (
  <div className="section">
    <h2>Our Security Services</h2>
    <div className="services-grid">
      <div className="service-card-full"><h3>1. Security Guard Service</h3><p>Best for homes, shops, offices</p></div>
      <div className="service-card-full"><h3>2. Construction Site Security</h3><p>Special guards for building sites</p></div>
      <div className="service-card-full"><h3>3. CCTV Installation</h3><p>Watch on phone from anywhere</p></div>
      <div className="service-card-full"><h3>4. Mobile Patrol</h3><p>Patrol car with rapid response</p></div>
      <div className="service-card-full"><h3>5. Event Security</h3><p>For weddings, concerts</p></div>
      <div className="service-card-full"><h3>6. Alarm Systems</h3><p>Intruder alarm calls your phone</p></div>
    </div>
  </div>
)

const MissionPage = () => (
  <div className="section">
    <h2>Our Mission, Vision & Values</h2>
    <div className="mission-grid">
      <div className="mission-card"><h3>Our Mission</h3><p>To provide professional security solutions</p></div>
      <div className="mission-card gold"><h3>Our Vision</h3><p>To be Uganda's most trusted company by 2030</p></div>
      <div className="mission-card dark"><h3>Core Values - DISCIPLINE</h3><div className="values-list"><div><b>D - Discipline</b></div><div><b>I - Integrity</b></div><div><b>S - Service</b></div><div><b>C - Courage</b></div><div><b>P - Professionalism</b></div></div></div>
    </div>
  </div>
)

const Blog = () => (
  <div className="section">
    <div className="memo-clean">
      <div className="memo-head"><h2>INTERNAL MEMO - PINNACLE SECURITY LTD</h2><p><b>From:</b> HR Manager | <b>To:</b> All Applicants | <b>Date:</b> {new Date().toLocaleDateString()} | <b>Ref:</b> PSL/HR/2026/08</p><p><b>Subject: URGENT RECRUITMENT</b></p></div>
      <div className="memo-body-dark"><div className="memo-intro">Management has approved recruitment. No Fees. Training 2 weeks at Muyenga HQ</div>
        <div className="job-box"><div className="job-header">POSITION 1: SITE INCHARGE</div><div className="job-content"><p><b>Requirements:</b> UCE, 3+ Years security</p></div></div>
        <div className="job-box gold-border"><div className="job-header gold">POSITION 2: SUPERVISOR</div><div className="job-content"><p><b>Requirements:</b> UACE, Rider Permit</p></div></div>
        <div className="general-box"><h3>GENERAL RECRUITMENT: SECURITY OFFICER</h3><a onClick={() => document.getElementById('join').scrollIntoView({behavior:'smooth'})} className="big-recruit-btn" style={{cursor:'pointer'}}>APPLY NOW</a></div>
      </div>
    </div>
  </div>
)

const Aptitude = () => (
  <div className="section">
    <h2>Online Aptitude Test</h2>
    <div className="home-grid-3">
      <div className="card"><h3>Step 1: Register</h3><a href={GOOGLE_APTITUDE_REGISTER} target="_blank" rel="noopener noreferrer" className="btn-yellow big" style={{marginTop:'18px', width:'100%', textAlign:'center', display:'block'}}>Register ↗</a></div>
      <div className="card gold"><h3>Step 2: Take Test</h3><a href={KOBO_APTITUDE_TEST} target="_blank" rel="noopener noreferrer" className="btn-yellow big" style={{marginTop:'18px', width:'100%', textAlign:'center', display:'block', background:'#0a1931 !important', color:'#ffcc00 !important'}}>Start Test</a></div>
      <div className="card dark"><h3>Important</h3><p>All applicants must take test</p></div>
    </div>
  </div>
)

const Contact = () => {
  const [f, setF] = useState({ fullName: "", email: "", phone: "", service: "", message: "" });
  const [s, setS] = useState("");
  const send = async (e) => {
    e.preventDefault();
    setS("Submitting...");
    const payload = { type: 'contact', fullName: f.fullName, phone: f.phone, email: f.email, service: f.service, message: f.message, timestamp: new Date().toISOString() };
    try { await fetch(GOOGLE_SHEET_WEBHOOK, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(payload) }); setS("✅ Thank you!"); setF({ fullName: "", email: "", phone: "", service: "", message: "" }); } catch { setS("✅ Thank you!"); }
  };
  return (
    <div className="section"><h2>Contact Us</h2>
      <div className="form-2col"><div className="form-left-info"><div className="card"><h3>Visit Us</h3><p>Plot 442 & 443 Massionatees, Muyenga Hill, Kampala. Control 24/7: 0776971970</p></div></div>
        <form className="form-big" onSubmit={send}>
          <div className="two-col"><input value={f.fullName} onChange={e => setF({ ...f, fullName: e.target.value })} required placeholder="Fullname" /><input value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} required placeholder="Phone" /></div>
          <div className="two-col"><input type="email" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} required placeholder="Email" /><select value={f.service} onChange={e => setF({ ...f, service: e.target.value })} required><option value="">Choose Service</option><option>Security Guard Service</option><option>Construction Security</option><option>CCTV Installation</option><option>Mobile Patrol</option><option>Event Security</option><option>Alarm System</option></select></div>
          <textarea rows="5" value={f.message} onChange={e => setF({ ...f, message: e.target.value })} required placeholder="Message"></textarea>
          <button className="big-btn">Submit</button>{s && <p className="msg">{s}</p>}
        </form>
      </div>
    </div>
  )
}

const Join = () => {
  const [f, setF] = useState({ fullName: "", phone: "", email: "", education: "", experience: "", interest: "", position: "SITE INCHARGE", district: "" });
  const [s, setS] = useState("");
  const send = async (e) => {
    e.preventDefault();
    setS("Submitting...");
    const payload = { type: 'applicant', fullName: f.fullName, phone: f.phone, email: f.email, education: f.education, experience: f.experience, interest: f.interest, position: f.position, district: f.district, timestamp: new Date().toISOString() };
    try { await fetch(GOOGLE_SHEET_WEBHOOK, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(payload) }); setS("✅ Thank you!"); setF({ fullName: "", phone: "", email: "", education: "", experience: "", interest: "", position: "SITE INCHARGE", district: "" }); } catch { setS("✅ Thank you!"); }
  };
  return (
    <div className="section"><h2>Apply Now - Applicant Form</h2>
      <form className="form-big" onSubmit={send}>
        <div className="two-col"><div><label>Full Name *</label><input value={f.fullName} onChange={e => setF({ ...f, fullName: e.target.value })} required placeholder="Fullname" /></div><div><label>Phone *</label><input value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} required placeholder="Phone" /></div></div>
        <div className="two-col"><div><label>Email *</label><input type="email" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} required placeholder="Email" /></div><div><label>Education *</label><select value={f.education} onChange={e => setF({ ...f, education: e.target.value })} required><option value="">Choose</option><option>P7</option><option>UCE</option><option>UACE</option><option>Diploma</option><option>Degree</option></select></div></div>
        <div className="two-col"><div><label>Position *</label><select value={f.position} onChange={e => setF({ ...f, position: e.target.value })} required><option>SITE INCHARGE</option><option>SUPERVISOR</option><option>SECURITY OFFICER</option></select></div><div><label>District *</label><input value={f.district} onChange={e => setF({ ...f, district: e.target.value })} required placeholder="District" /></div></div>
        <div className="two-col"><div><label>Why Interested? *</label><input value={f.interest} onChange={e => setF({ ...f, interest: e.target.value })} required placeholder="Why interested?" /></div><div><label>Experience *</label><input value={f.experience} onChange={e => setF({ ...f, experience: e.target.value })} required placeholder="Years & where" /></div></div>
        <button className="big-btn">Submit Application</button>{s && <p className="msg">{s}</p>}
      </form>
    </div>
  )
}

const Footer = () => {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 75;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };
  return (
    <div className="footer">
      <div className="footer-quick">
        <h4>Quick Links</h4>
        <div className="footer-links">
          <a onClick={() => scrollTo('home')}>Home</a><a onClick={() => scrollTo('about')}>About</a><a onClick={() => scrollTo('services')}>Services</a><a onClick={() => scrollTo('mission')}>Mission</a><a onClick={() => scrollTo('jobs')}>Jobs</a><a onClick={() => scrollTo('aptitude')}>Aptitude Test</a><a onClick={() => scrollTo('contact')}>Contact</a><a onClick={() => scrollTo('join')}>Apply Now</a><a href="/admin" style={{background:'#ffcc00', color:'#0a1931'}}>🛡️ Admin</a>
        </div>
      </div>
      <div className="footer-bottom">© 2026 Pinnacle Security Ltd | Plot 442 & 443 Massionatees, Muyenga | HR: hr@pinnaclegroup.co.ug | Control 24/7: 0776971970</div>
    </div>
  )
}

const MainSite = () => (
  <>
    <style>{`
      *{margin:0;padding:0;box-sizing:border-box; font-family: Arial, Helvetica, sans-serif !important}
      html{scroll-behavior:smooth}
      body{font-family: Arial, Helvetica, sans-serif !important; background:#f4f6f9; line-height:1.8; overflow-x:hidden; padding-top:75px; font-size:17px}
      .nav{background:#0a1931; padding:16px 18px; position:fixed; top:0; left:0; right:0; width:100%; z-index:9999; box-shadow:0 4px 12px rgba(0,0,0,0.3)}
      .nav-top{display:flex; justify-content:space-between; align-items:center}.logo{color:#ffcc00; font-weight:900; font-size:18px}.menu-btn{color:#fff; font-size:28px; cursor:pointer; display:none}.links{display:flex; gap:12px; align-items:center; justify-content:center; flex-wrap:wrap}.links a{color:#fff; text-decoration:none; font-size:16px; font-weight:700; padding:8px 12px; cursor:pointer}
      .btn-yellow{background:#ffcc00!important; color:#0a1931!important; padding:11px 20px!important; border-radius:25px!important; fontWeight:900!important; border:none; cursor:pointer; text-decoration:none; display:inline-block; font-size:16px}.btn-yellow.big{padding:16px 28px!important; font-size:18px}
      .hero{background:linear-gradient(135deg,#0a1931,#1e3a8a); color:#fff; padding:40px 18px; text-align:center; border-radius:0 0 20px 20px}.hero h1{color:#ffcc00; font-size:28px; margin-bottom:12px; font-weight:900}.hero p{font-size:18px}.dots{margin:14px 0}.dot{width:12px; height:12px; background:#555; border-radius:50%; display:inline-block; margin:0 6px; cursor:pointer}.dot.on{background:#ffcc00}
      .section{padding:22px 14px; max-width:1280px; margin:auto}.section h2{text-align:center; color:#0a1931; border-bottom:4px solid #ffcc00; padding-bottom:10px; margin-bottom:18px; font-size:26px; font-weight:900}
      .card{background:#fff; padding:20px; border-radius:14px; margin-bottom:16px; box-shadow:0 4px 12px rgba(0,0,0,0.06); border-left:6px solid #0a1931; font-size:17px; line-height:1.8; color:#0a1931}.card.gold{border-left-color:#ffcc00; background:#fffbeb}.card.dark{background:linear-gradient(135deg,#1e293b,#0f172a); color:#fff; border-left-color:#ffcc00}.card h3{font-size:20px; margin-bottom:12px; color:#0a1931; font-weight:900}.card.dark h3{color:#ffcc00}
      .home-grid-3{display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px} @media(max-width:900px){.home-grid-3{grid-template-columns:1fr}}
      .about-hero{background:linear-gradient(135deg,#0a1931,#1e3a8a); color:#fff; padding:24px; border-radius:16px; margin-bottom:18px; border:2px solid #ffcc00}.about-hero h3{color:#ffcc00; font-size:24px; margin-bottom:16px; text-align:center; font-weight:900}.about-hero p{margin-bottom:18px; line-height:1.9; color:#fff; font-size:17px; background:rgba(255,255,255,0.07); padding:14px; border-radius:10px}
      .form-big{max-width:900px; margin:18px auto; background:#fff; padding:24px; border-radius:16px; display:flex; flex-direction:column; gap:16px; box-shadow:0 6px 20px rgba(0,0,0,0.08)}.form-big input,.form-big select,.form-big textarea{padding:16px; border:2px solid #0a1931; border-radius:10px; font-size:17px; width:100%; background:#ffffff !important; color:#0a1931 !important}.form-big label{font-size:15px; font-weight:800; color:#0a1931; margin-bottom:4px; display:block}.two-col{display:grid; grid-template-columns:1fr 1fr; gap:16px} @media(max-width:700px){.two-col{grid-template-columns:1fr}}.form-2col{display:grid; grid-template-columns:300px 1fr; gap:18px} @media(max-width:900px){.form-2col{grid-template-columns:1fr}}.big-btn{background:#0a1931; color:#ffcc00; padding:18px; border:none; border-radius:12px; font-weight:900; cursor:pointer; font-size:19px}.msg{padding:14px; background:#d4edda; border-radius:10px; font-size:16px; text-align:center; font-weight:700}
      .footer{background:#0a1931; color:#aaa; text-align:center; padding:0; font-size:13px; margin-top:24px; line-height:1.8}.footer-quick{background:#0f2040; padding:20px 18px; border-bottom:1px solid #1e3a5f}.footer-quick h4{color:#ffcc00; font-size:16px; font-weight:900; margin-bottom:12px; letter-spacing:1px}.footer-links{display:flex; gap:14px; justify-content:center; flex-wrap:wrap}.footer-links a{color:#fff; text-decoration:none; font-size:14px; font-weight:700; padding:6px 12px; border:1px solid #1e3a5f; border-radius:20px; transition:all 0.2s; cursor:pointer}.footer-links a:hover{background:#ffcc00; color:#0a1931; border-color:#ffcc00}.footer-bottom{padding:18px; background:#0a1931}
      @media(max-width:850px){.menu-btn{display:block}.links{display:none; flex-direction:column; align-items:flex-start; padding-top:14px}.links.show{display:flex} body{padding-top:68px}}
      .service-card-full{background:#fff; padding:20px; border-radius:12px; margin-bottom:14px; border-left:5px solid #0a1931}.service-card-full h3{color:#0a1931; font-weight:900; margin-bottom:8px}
      .mission-grid{display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px} @media(max-width:900px){.mission-grid{grid-template-columns:1fr}}.mission-card{background:#fff; padding:18px; border-radius:12px; border-left:5px solid #0a1931}.mission-card.gold{border-left-color:#ffcc00; background:#fffbeb}.mission-card.dark{background:linear-gradient(135deg,#1e293b,#0f172a); color:#fff; border-left-color:#ffcc00}.values-list div{margin-bottom:8px; font-size:15px}
      .memo-clean{max-width:1000px; margin:auto}.memo-head{background:#fff; padding:16px; border-radius:12px 12px 0 0; border:2px solid #0a1931; border-bottom:none; text-align:center}.memo-head h2{font-size:18px; border:none; margin-bottom:8px}.memo-body-dark{background:linear-gradient(135deg,#1e293b,#0f172a); color:#fff; padding:18px; border-radius:0 0 12px 12px}.memo-intro{background:rgba(255,255,255,0.08); padding:12px; border-radius:8px; margin-bottom:14px}.job-box{background:#fff; color:#0a1931; border-radius:10px; margin-bottom:14px; overflow:hidden}.job-box.gold-border{border:2px solid #ffcc00}.job-header{background:#0a1931; color:#ffcc00; padding:12px; font-weight:900; text-align:center}.job-header.gold{background:#ffcc00; color:#0a1931}.job-content{padding:14px}.general-box{background:#fff; color:#0a1931; padding:14px; border-radius:10px; text-align:center; margin-bottom:14px; border:2px dashed #0a1931}.big-recruit-btn{background:#ffcc00; color:#0a1931; padding:12px 20px; border-radius:25px; font-weight:900; display:inline-block; margin-top:10px; text-decoration:none}
      .services-grid{display:grid; grid-template-columns:1fr; gap:12px}
    `}</style>
    <Navbar />
    <div id="home"><Home /></div>
    <div id="about"><About /></div>
    <div id="services"><Services /></div>
    <div id="mission"><MissionPage /></div>
    <div id="jobs"><Blog /></div>
    <div id="aptitude"><Aptitude /></div>
    <div id="contact"><Contact /></div>
    <div id="join"><Join /></div>
    <Footer />
  </>
)

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    if (window.location.pathname === '/admin') setIsAdmin(true);
  }, []);
  if (isAdmin) return <AdminDashboard />;
  return <MainSite />;
}

export default App