import React, { useState, useEffect } from 'react'

const ADMIN_PASSWORD = "Pinnacle2026!Secure123";
const GOOGLE_SHEET_WEBHOOK = "https://script.google.com/macros/s/AKfycbz0Fx9gSfPwPXZdi8pivw9IdQ_fzj707fPk22GBECuGYhGzwePtEPZV47TyXk8TN8bggQ/exec";

const AdminDashboard = () => {
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState("");
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("contacts"); // contacts | applicants
  const [loading, setLoading] = useState(false);

  const login = () => {
    if (pass === ADMIN_PASSWORD) setAuth(true);
    else alert("Wrong Password!");
  };

  const load = () => {
    setLoading(true);
    fetch(GOOGLE_SHEET_WEBHOOK)
      .then(r => r.json())
      .then(d => {
        const arr = Array.isArray(d) ? d : (d.contacts || d.applicants ? [...(d.contacts||[]), ...(d.applicants||[])] : []);
        // Sort newest first
        const sorted = arr.sort((a,b)=> new Date(b.timestamp || b.Timestamp || 0) - new Date(a.timestamp || a.Timestamp || 0));
        setData(sorted);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { if (auth) load(); }, [auth]);

  const formatDate = (t) => {
    if(!t) return '';
    try { return new Date(t).toLocaleString(); } catch { return t; }
  }

  if (!auth) {
    return (
      <div style={{minHeight:'100vh', background:'#0a1931', display:'flex', justifyContent:'center', alignItems:'center', fontFamily:'Arial'}}>
        <div style={{background:'#fff', padding:'30px', borderRadius:'16px', width:'90%', maxWidth:'380px', textAlign:'center'}}>
          <h2 style={{fontWeight:'900', color:'#0a1931'}}>🛡️ PINNACLE ADMIN</h2>
          <p style={{fontSize:'12px', color:'#666', marginTop:'6px'}}>PSL db - Contacts & Applicants</p>
          <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Admin Password" style={{width:'100%', padding:'14px', borderRadius:'10px', marginTop:'15px', border:'2px solid #0a1931'}}/>
          <button onClick={login} style={{width:'100%', marginTop:'12px', background:'#ffcc00', padding:'14px', borderRadius:'10px', fontWeight:'900', border:'none', cursor:'pointer'}}>LOGIN</button>
          <a href="/" style={{display:'block', marginTop:'14px', color:'#0a1931', fontSize:'13px', textDecoration:'none', fontWeight:'800'}}>← Back to Website</a>
        </div>
      </div>
    )
  }

  // Separate by type - support both lower and upper case keys from sheet
  const getVal = (obj, keys) => {
    for(let k of keys) if(obj[k] !== undefined) return obj[k];
    return '';
  }

  const applicants = data.filter(d => (d.type==='applicant') || getVal(d, ['Position','position']));
  const contacts = data.filter(d => (d.type==='contact') || getVal(d, ['Service','service']));

  const filteredContacts = contacts.filter(d => {
    const row = `${getVal(d,['FullName','fullName'])} ${getVal(d,['Phone','phone'])} ${getVal(d,['Email','email'])} ${getVal(d,['Service','service'])} ${getVal(d,['Messages','message','Message'])}`.toLowerCase();
    return row.includes(search.toLowerCase());
  });

  const filteredApplicants = applicants.filter(d => {
    const row = `${getVal(d,['FullName','fullName'])} ${getVal(d,['Phone','phone'])} ${getVal(d,['Email','email'])} ${getVal(d,['Position','position'])} ${getVal(d,['Education','education'])} ${getVal(d,['District','district'])} ${getVal(d,['Experience','experience'])} ${getVal(d,['Interest','interest'])}`.toLowerCase();
    return row.includes(search.toLowerCase());
  });

  return (
    <div style={{background:'#f4f6f9', minHeight:'100vh', fontFamily:'Arial', padding:'20px'}}>
      <div style={{maxWidth:'1600px', margin:'auto'}}>
        
        <div style={{display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'12px', alignItems:'center', marginBottom:'20px'}}>
          <h1 style={{fontWeight:'900', color:'#0a1931', fontSize:'22px'}}>PSL db - Admin</h1>
          <div style={{display:'flex', gap:'8px', flexWrap:'wrap'}}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search..." style={{padding:'10px 16px', borderRadius:'20px', border:'1px solid #ddd', width:'260px'}}/>
            <button onClick={load} style={{background:'#0a1931', color:'#ffcc00', padding:'10px 18px', borderRadius:'20px', fontWeight:'800', border:'none', cursor:'pointer'}}>{loading?'Loading...':'🔄 Refresh'}</button>
            <a href="/" style={{background:'#fff', color:'#0a1931', padding:'10px 18px', borderRadius:'20px', fontWeight:'800', textDecoration:'none', border:'2px solid #0a1931'}}>Website</a>
          </div>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px', marginBottom:'20px'}}>
          <div onClick={()=>setTab('contacts')} style={{background:tab==='contacts'?'#0a1931':'#fff', color:tab==='contacts'?'#ffcc00':'#0a1931', padding:'16px', borderRadius:'12px', cursor:'pointer', borderLeft:'5px solid #0a1931'}}>
            <p style={{fontSize:'11px', fontWeight:'800'}}>CONTACTS</p><h2 style={{fontSize:'26px', fontWeight:'900'}}>{contacts.length}</h2>
          </div>
          <div onClick={()=>setTab('applicants')} style={{background:tab==='applicants'?'#ffcc00':'#fff', padding:'16px', borderRadius:'12px', cursor:'pointer', borderLeft:'5px solid #ffcc00'}}>
            <p style={{fontSize:'11px', fontWeight:'800'}}>APPLICANTS</p><h2 style={{fontSize:'26px', fontWeight:'900'}}>{applicants.length}</h2>
          </div>
          <div style={{background:'#fff', padding:'16px', borderRadius:'12px', borderLeft:'5px solid #0a1931'}}>
            <p style={{fontSize:'11px', fontWeight:'800'}}>TOTAL</p><h2 style={{fontSize:'26px', fontWeight:'900', color:'#0a1931'}}>{data.length}</h2>
          </div>
        </div>

        {/* CONTACTS TABLE - EXACTLY AS SCREENSHOT 1 */}
        {tab === 'contacts' && (
          <div style={{background:'#fff', borderRadius:'16px', overflow:'hidden', boxShadow:'0 4px 12px rgba(0,0,0,0.06)'}}>
            <div style={{background:'#0a1931', padding:'14px 20px', fontWeight:'900', color:'#ffcc00'}}>📞 CONTACTS - {filteredContacts.length} Records</div>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%', borderCollapse:'collapse', fontSize:'13px', minWidth:'1200px'}}>
                <thead>
                  <tr style={{background:'#e8f0e8', color:'#0a1931', textAlign:'left', borderBottom:'2px solid #0a1931'}}>
                    <th style={{padding:'12px', border:'1px solid #ccc'}}>Timestamp</th>
                    <th style={{padding:'12px', border:'1px solid #ccc'}}>FullName</th>
                    <th style={{padding:'12px', border:'1px solid #ccc'}}>Phone</th>
                    <th style={{padding:'12px', border:'1px solid #ccc'}}>Email</th>
                    <th style={{padding:'12px', border:'1px solid #ccc'}}>Service</th>
                    <th style={{padding:'12px', border:'1px solid #ccc'}}>Messages</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.map((d,i)=>
                    <tr key={i} style={{borderBottom:'1px solid #eee'}}>
                      <td style={{padding:'10px', border:'1px solid #eee', fontSize:'11px'}}>{formatDate(getVal(d,['Timestamp','timestamp']))}</td>
                      <td style={{padding:'10px', border:'1px solid #eee', fontWeight:'700'}}>{getVal(d,['FullName','fullName'])}</td>
                      <td style={{padding:'10px', border:'1px solid #eee'}}>{getVal(d,['Phone','phone'])}</td>
                      <td style={{padding:'10px', border:'1px solid #eee'}}>{getVal(d,['Email','email'])}</td>
                      <td style={{padding:'10px', border:'1px solid #eee'}}>{getVal(d,['Service','service'])}</td>
                      <td style={{padding:'10px', border:'1px solid #eee', whiteSpace:'normal', wordBreak:'break-word'}}>{getVal(d,['Messages','message','Message'])}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* APPLICANTS TABLE - EXACTLY AS SCREENSHOT 2 */}
        {tab === 'applicants' && (
          <div style={{background:'#fff', borderRadius:'16px', overflow:'hidden', boxShadow:'0 4px 12px rgba(0,0,0,0.06)'}}>
            <div style={{background:'#7a0a0a', padding:'14px 20px', fontWeight:'900', color:'#fff'}}>📋 APPLICANTS - {filteredApplicants.length} Records</div>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%', borderCollapse:'collapse', fontSize:'13px', minWidth:'1450px'}}>
                <thead>
                  <tr style={{background:'#7a0a0a', color:'#fff', textAlign:'left'}}>
                    <th style={{padding:'12px', border:'1px solid #a00'}}>Timestamp</th>
                    <th style={{padding:'12px', border:'1px solid #a00'}}>FullName</th>
                    <th style={{padding:'12px', border:'1px solid #a00'}}>Phone</th>
                    <th style={{padding:'12px', border:'1px solid #a00'}}>Email</th>
                    <th style={{padding:'12px', border:'1px solid #a00'}}>Position</th>
                    <th style={{padding:'12px', border:'1px solid #a00'}}>Education</th>
                    <th style={{padding:'12px', border:'1px solid #a00'}}>District</th>
                    <th style={{padding:'12px', border:'1px solid #a00'}}>Experience</th>
                    <th style={{padding:'12px', border:'1px solid #a00'}}>Interest</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplicants.map((d,i)=>
                    <tr key={i} style={{borderBottom:'1px solid #90EE90', background: i%2===0?'#fff':'#f0fff0'}}>
                      <td style={{padding:'10px', border:'1px solid #90EE90', fontSize:'11px'}}>{formatDate(getVal(d,['Timestamp','timestamp']))}</td>
                      <td style={{padding:'10px', border:'1px solid #90EE90', fontWeight:'700'}}>{getVal(d,['FullName','fullName'])}</td>
                      <td style={{padding:'10px', border:'1px solid #90EE90'}}>{getVal(d,['Phone','phone'])}</td>
                      <td style={{padding:'10px', border:'1px solid #90EE90'}}>{getVal(d,['Email','email'])}</td>
                      <td style={{padding:'10px', border:'1px solid #90EE90', fontWeight:'600'}}>{getVal(d,['Position','position'])}</td>
                      <td style={{padding:'10px', border:'1px solid #90EE90'}}>{getVal(d,['Education','education'])}</td>
                      <td style={{padding:'10px', border:'1px solid #90EE90'}}>{getVal(d,['District','district'])}</td>
                      <td style={{padding:'10px', border:'1px solid #90EE90'}}>{getVal(d,['Experience','experience'])}</td>
                      <td style={{padding:'10px', border:'1px solid #90EE90'}}>{getVal(d,['Interest','interest'])}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default AdminDashboard