import React, { useState, useEffect } from 'react'

const ADMIN_PASSWORD = "Pinnacle2026!Secure123";
const GOOGLE_SHEET_WEBHOOK = "https://script.google.com/macros/s/AKfycbz0Fx9gSfPwPXZdi8pivw9IdQ_fzj707fPk22GBECuGYhGzwePtEPZV47TyXk8TN8bggQ/exec";

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

  // === CRUD ===
  const handleDelete = async (row) => {
    if(!window.confirm(`Delete ${getVal(row,['FullName','fullName'])} ?`)) return;
    const payload = { action: 'delete', timestamp: getVal(row,['Timestamp','timestamp']), type: tab==='contacts'?'contact':'applicant' };
    try { await fetch(GOOGLE_SHEET_WEBHOOK, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(payload) }); } catch {}
    setData(prev => prev.filter(r => getVal(r,['Timestamp','timestamp']) !== getVal(row,['Timestamp','timestamp'])));
  };

  const handleEdit = (row) => {
    setEditRow(getVal(row,['Timestamp','timestamp']));
    setForm({ ...row, FullName: getVal(row,['FullName','fullName']), Phone: getVal(row,['Phone','phone']), Email: getVal(row,['Email','email']), Service: getVal(row,['Service','service']), Messages: getVal(row,['Messages','message']), Position: getVal(row,['Position','position']), Education: getVal(row,['Education','education']), District: getVal(row,['District','district']), Experience: getVal(row,['Experience','experience']), Interest: getVal(row,['Interest','interest']) });
  };

  const handleSave = async () => {
    const payload = { action: 'update', ...form, timestamp: form.timestamp || form.Timestamp || editRow, type: tab==='contacts'?'contact':'applicant' };
    try { await fetch(GOOGLE_SHEET_WEBHOOK, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(payload) }); } catch {}
    setData(prev => prev.map(r => getVal(r,['Timestamp','timestamp']) === editRow ? {...r, ...form, timestamp: editRow} : r));
    setEditRow(null);
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
      <div style={{maxWidth:'1600px', margin:'auto', fontFamily:'Arial', fontSize:'13px'}}>
        <div style={{display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'12px', alignItems:'center', marginBottom:'20px'}}>
          <h1 style={{fontWeight:'900', color:'#0a1931', fontSize:'16px', fontFamily:'Arial'}}>PSL db - Admin</h1>
          <div style={{display:'flex', gap:'8px', flexWrap:'wrap'}}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search..." style={{padding:'10px 16px', borderRadius:'20px', border:'1px solid #ddd', width:'260px', fontFamily:'Arial', fontSize:'13px'}}/>
            <button onClick={()=>{setForm({}); setShowAdd(true)}} style={{background:'#ffcc00', color:'#0a1931', padding:'10px 18px', borderRadius:'20px', fontWeight:'800', border:'none', cursor:'pointer', fontFamily:'Arial', fontSize:'13px'}}>➕ Add</button>
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
              <input placeholder="FullName" value={form.FullName||''} onChange={e=>setForm({...form, FullName:e.target.value, fullName:e.target.value})} style={{width:'100%', padding:'10px', marginTop:'8px', fontFamily:'Arial', fontSize:'13px', border:'1px solid #ccc', borderRadius:'8px'}}/>
              <input placeholder="Phone" value={form.Phone||''} onChange={e=>setForm({...form, Phone:e.target.value, phone:e.target.value})} style={{width:'100%', padding:'10px', marginTop:'8px', fontFamily:'Arial', fontSize:'13px', border:'1px solid #ccc', borderRadius:'8px'}}/>
              <input placeholder="Email" value={form.Email||''} onChange={e=>setForm({...form, Email:e.target.value, email:e.target.value})} style={{width:'100%', padding:'10px', marginTop:'8px', fontFamily:'Arial', fontSize:'13px', border:'1px solid #ccc', borderRadius:'8px'}}/>
              {tab==='contacts' ? <>
                <input placeholder="Service" value={form.Service||''} onChange={e=>setForm({...form, Service:e.target.value, service:e.target.value})} style={{width:'100%', padding:'10px', marginTop:'8px', fontFamily:'Arial', fontSize:'13px', border:'1px solid #ccc', borderRadius:'8px'}}/>
                <textarea placeholder="Messages" value={form.Messages||''} onChange={e=>setForm({...form, Messages:e.target.value, message:e.target.value})} style={{width:'100%', padding:'10px', marginTop:'8px', fontFamily:'Arial', fontSize:'13px', border:'1px solid #ccc', borderRadius:'8px'}}/>
              </> : <>
                <input placeholder="Position" value={form.Position||''} onChange={e=>setForm({...form, Position:e.target.value, position:e.target.value})} style={{width:'100%', padding:'10px', marginTop:'8px', fontFamily:'Arial', fontSize:'13px', border:'1px solid #ccc', borderRadius:'8px'}}/>
                <input placeholder="Education" value={form.Education||''} onChange={e=>setForm({...form, Education:e.target.value, education:e.target.value})} style={{width:'100%', padding:'10px', marginTop:'8px', fontFamily:'Arial', fontSize:'13px', border:'1px solid #ccc', borderRadius:'8px'}}/>
                <input placeholder="District" value={form.District||''} onChange={e=>setForm({...form, District:e.target.value, district:e.target.value})} style={{width:'100%', padding:'10px', marginTop:'8px', fontFamily:'Arial', fontSize:'13px', border:'1px solid #ccc', borderRadius:'8px'}}/>
                <input placeholder="Experience" value={form.Experience||''} onChange={e=>setForm({...form, Experience:e.target.value, experience:e.target.value})} style={{width:'100%', padding:'10px', marginTop:'8px', fontFamily:'Arial', fontSize:'13px', border:'1px solid #ccc', borderRadius:'8px'}}/>
                <input placeholder="Interest" value={form.Interest||''} onChange={e=>setForm({...form, Interest:e.target.value, interest:e.target.value})} style={{width:'100%', padding:'10px', marginTop:'8px', fontFamily:'Arial', fontSize:'13px', border:'1px solid #ccc', borderRadius:'8px'}}/>
              </>}
              <div style={{display:'flex', gap:'8px', marginTop:'12px'}}><button onClick={handleAddNew} style={{background:'#0a1931', color:'#ffcc00', padding:'10px 18px', borderRadius:'8px', border:'none', cursor:'pointer', fontFamily:'Arial', fontSize:'13px', flex:1}}>Save</button><button onClick={()=>setShowAdd(false)} style={{background:'#ccc', padding:'10px 18px', borderRadius:'8px', border:'none', cursor:'pointer', fontFamily:'Arial', fontSize:'13px', flex:1}}>Cancel</button></div>
            </div>
          </div>
        )}

        {tab === 'contacts' && (
          <div style={{background:'#fff', borderRadius:'16px', overflow:'hidden', boxShadow:'0 4px 12px rgba(0,0,0,0.06)', fontFamily:'Arial', fontSize:'13px'}}>
            <div style={{background:'#0a1931', padding:'14px 20px', fontWeight:'900', color:'#ffcc00', fontFamily:'Arial', fontSize:'13px'}}>📞 CONTACTS - {filteredContacts.length} Records</div>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%', borderCollapse:'collapse', fontSize:'13px', fontFamily:'Arial', minWidth:'1350px'}}>
                <thead><tr style={{background:'#e8f0e8', color:'#0a1931', textAlign:'left', fontFamily:'Arial', fontSize:'13px'}}><th style={{padding:'12px', border:'1px solid #ccc', fontFamily:'Arial', fontSize:'13px'}}>Timestamp</th><th style={{padding:'12px', border:'1px solid #ccc', fontFamily:'Arial', fontSize:'13px'}}>FullName</th><th style={{padding:'12px', border:'1px solid #ccc', fontFamily:'Arial', fontSize:'13px'}}>Phone</th><th style={{padding:'12px', border:'1px solid #ccc', fontFamily:'Arial', fontSize:'13px'}}>Email</th><th style={{padding:'12px', border:'1px solid #ccc', fontFamily:'Arial', fontSize:'13px'}}>Service</th><th style={{padding:'12px', border:'1px solid #ccc', fontFamily:'Arial', fontSize:'13px'}}>Messages</th><th style={{padding:'12px', border:'1px solid #ccc', fontFamily:'Arial', fontSize:'13px'}}>Actions</th></tr></thead>
                <tbody>{filteredContacts.map((d,i)=>{
                  const ts = getVal(d,['Timestamp','timestamp']); const isEditing = editRow===ts;
                  return <tr key={i} style={{borderBottom:'1px solid #eee', fontFamily:'Arial', fontSize:'13px'}}>
                    <td style={{padding:'10px', border:'1px solid #eee', fontSize:'13px', fontFamily:'Arial'}}>{formatDate(ts)}</td>
                    <td style={{padding:'10px', border:'1px solid #eee', fontFamily:'Arial', fontSize:'13px'}}>{isEditing?<input value={form.FullName||''} onChange={e=>setForm({...form, FullName:e.target.value})} style={{fontFamily:'Arial', fontSize:'13px', width:'110px'}}/>:getVal(d,['FullName','fullName'])}</td>
                    <td style={{padding:'10px', border:'1px solid #eee', fontFamily:'Arial', fontSize:'13px'}}>{isEditing?<input value={form.Phone||''} onChange={e=>setForm({...form, Phone:e.target.value})} style={{fontFamily:'Arial', fontSize:'13px', width:'90px'}}/>:getVal(d,['Phone','phone'])}</td>
                    <td style={{padding:'10px', border:'1px solid #eee', fontFamily:'Arial', fontSize:'13px'}}>{isEditing?<input value={form.Email||''} onChange={e=>setForm({...form, Email:e.target.value})} style={{fontFamily:'Arial', fontSize:'13px', width:'120px'}}/>:getVal(d,['Email','email'])}</td>
                    <td style={{padding:'10px', border:'1px solid #eee', fontFamily:'Arial', fontSize:'13px'}}>{isEditing?<input value={form.Service||''} onChange={e=>setForm({...form, Service:e.target.value})} style={{fontFamily:'Arial', fontSize:'13px', width:'100px'}}/>:getVal(d,['Service','service'])}</td>
                    <td style={{padding:'10px', border:'1px solid #eee', fontFamily:'Arial', fontSize:'13px'}}>{isEditing?<input value={form.Messages||''} onChange={e=>setForm({...form, Messages:e.target.value})} style={{fontFamily:'Arial', fontSize:'13px', width:'150px'}}/>:getVal(d,['Messages','message'])}</td>
                    <td style={{padding:'10px', border:'1px solid #eee', display:'flex', gap:'4px', fontFamily:'Arial', fontSize:'13px'}}>{isEditing?<><button onClick={handleSave} style={{background:'#0a1931', color:'#ffcc00', border:'none', padding:'5px 10px', borderRadius:'4px', cursor:'pointer', fontFamily:'Arial', fontSize:'13px'}}>Save</button><button onClick={()=>setEditRow(null)} style={{background:'#ccc', border:'none', padding:'5px 10px', borderRadius:'4px', cursor:'pointer', fontFamily:'Arial', fontSize:'13px'}}>Cancel</button></>:<><button onClick={()=>handleEdit(d)} style={{background:'#ffcc00', border:'none', padding:'5px 10px', borderRadius:'4px', cursor:'pointer', fontFamily:'Arial', fontSize:'13px'}}>Edit</button><button onClick={()=>handleDelete(d)} style={{background:'#c00', color:'#fff', border:'none', padding:'5px 10px', borderRadius:'4px', cursor:'pointer', fontFamily:'Arial', fontSize:'13px'}}>Delete</button></>}</td>
                  </tr>
                })}</tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'applicants' && (
          <div style={{background:'#fff', borderRadius:'16px', overflow:'hidden', boxShadow:'0 4px 12px rgba(0,0,0,0.06)', fontFamily:'Arial', fontSize:'13px'}}>
            <div style={{background:'#7a0a0a', padding:'14px 20px', fontWeight:'900', color:'#fff', fontFamily:'Arial', fontSize:'13px'}}>📋 APPLICANTS - {filteredApplicants.length} Records</div>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%', borderCollapse:'collapse', fontSize:'13px', fontFamily:'Arial', minWidth:'1600px'}}>
                <thead><tr style={{background:'#7a0a0a', color:'#fff', textAlign:'left', fontFamily:'Arial', fontSize:'13px'}}><th style={{padding:'12px', fontFamily:'Arial', fontSize:'13px'}}>Timestamp</th><th style={{padding:'12px', fontFamily:'Arial', fontSize:'13px'}}>FullName</th><th style={{padding:'12px', fontFamily:'Arial', fontSize:'13px'}}>Phone</th><th style={{padding:'12px', fontFamily:'Arial', fontSize:'13px'}}>Email</th><th style={{padding:'12px', fontFamily:'Arial', fontSize:'13px'}}>Position</th><th style={{padding:'12px', fontFamily:'Arial', fontSize:'13px'}}>Education</th><th style={{padding:'12px', fontFamily:'Arial', fontSize:'13px'}}>District</th><th style={{padding:'12px', fontFamily:'Arial', fontSize:'13px'}}>Experience</th><th style={{padding:'12px', fontFamily:'Arial', fontSize:'13px'}}>Interest</th><th style={{padding:'12px', fontFamily:'Arial', fontSize:'13px'}}>Actions</th></tr></thead>
                <tbody>{filteredApplicants.map((d,i)=>{
                  const ts = getVal(d,['Timestamp','timestamp']); const isEditing = editRow===ts;
                  return <tr key={i} style={{borderBottom:'1px solid #90EE90', background: i%2===0?'#fff':'#f0fff0', fontFamily:'Arial', fontSize:'13px'}}>
                    <td style={{padding:'10px', fontFamily:'Arial', fontSize:'13px'}}>{formatDate(ts)}</td>
                    <td style={{padding:'10px', fontFamily:'Arial', fontSize:'13px'}}>{isEditing?<input value={form.FullName||''} onChange={e=>setForm({...form, FullName:e.target.value})} style={{fontFamily:'Arial', fontSize:'13px', width:'90px'}}/>:getVal(d,['FullName','fullName'])}</td>
                    <td style={{padding:'10px', fontFamily:'Arial', fontSize:'13px'}}>{isEditing?<input value={form.Phone||''} onChange={e=>setForm({...form, Phone:e.target.value})} style={{fontFamily:'Arial', fontSize:'13px', width:'80px'}}/>:getVal(d,['Phone','phone'])}</td>
                    <td style={{padding:'10px', fontFamily:'Arial', fontSize:'13px'}}>{isEditing?<input value={form.Email||''} onChange={e=>setForm({...form, Email:e.target.value})} style={{fontFamily:'Arial', fontSize:'13px', width:'100px'}}/>:getVal(d,['Email','email'])}</td>
                    <td style={{padding:'10px', fontFamily:'Arial', fontSize:'13px'}}>{isEditing?<input value={form.Position||''} onChange={e=>setForm({...form, Position:e.target.value})} style={{fontFamily:'Arial', fontSize:'13px', width:'80px'}}/>:getVal(d,['Position','position'])}</td>
                    <td style={{padding:'10px', fontFamily:'Arial', fontSize:'13px'}}>{isEditing?<input value={form.Education||''} onChange={e=>setForm({...form, Education:e.target.value})} style={{fontFamily:'Arial', fontSize:'13px', width:'60px'}}/>:getVal(d,['Education','education'])}</td>
                    <td style={{padding:'10px', fontFamily:'Arial', fontSize:'13px'}}>{isEditing?<input value={form.District||''} onChange={e=>setForm({...form, District:e.target.value})} style={{fontFamily:'Arial', fontSize:'13px', width:'60px'}}/>:getVal(d,['District','district'])}</td>
                    <td style={{padding:'10px', fontFamily:'Arial', fontSize:'13px'}}>{isEditing?<input value={form.Experience||''} onChange={e=>setForm({...form, Experience:e.target.value})} style={{fontFamily:'Arial', fontSize:'13px', width:'70px'}}/>:getVal(d,['Experience','experience'])}</td>
                    <td style={{padding:'10px', fontFamily:'Arial', fontSize:'13px'}}>{isEditing?<input value={form.Interest||''} onChange={e=>setForm({...form, Interest:e.target.value})} style={{fontFamily:'Arial', fontSize:'13px', width:'70px'}}/>:getVal(d,['Interest','interest'])}</td>
                    <td style={{padding:'10px', display:'flex', gap:'4px', fontFamily:'Arial', fontSize:'13px'}}>{isEditing?<><button onClick={handleSave} style={{background:'#0a1931', color:'#ffcc00', border:'none', padding:'5px 10px', borderRadius:'4px', cursor:'pointer', fontFamily:'Arial', fontSize:'13px'}}>Save</button><button onClick={()=>setEditRow(null)} style={{background:'#ccc', border:'none', padding:'5px 10px', borderRadius:'4px', cursor:'pointer', fontFamily:'Arial', fontSize:'13px'}}>Cancel</button></>:<><button onClick={()=>handleEdit(d)} style={{background:'#ffcc00', border:'none', padding:'5px 10px', borderRadius:'4px', cursor:'pointer', fontFamily:'Arial', fontSize:'13px'}}>Edit</button><button onClick={()=>handleDelete(d)} style={{background:'#c00', color:'#fff', border:'none', padding:'5px 10px', borderRadius:'4px', cursor:'pointer', fontFamily:'Arial', fontSize:'13px'}}>Delete</button></>}</td>
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

export default AdminDashboard