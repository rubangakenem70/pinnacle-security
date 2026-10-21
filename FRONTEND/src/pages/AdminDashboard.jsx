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
  const [showFilters, setShowFilters] = useState(true);
  const [form, setForm] = useState({});
  const [filters, setFilters] = useState({ service: "", position: "", district: "", education: "", experience: "", interest: "", dateFrom: "", dateTo: "" });

  const login = () => pass === ADMIN_PASSWORD ? setAuth(true) : alert("Wrong Password!");
  const load = () => {
    setLoading(true);
    fetch(GOOGLE_SHEET_WEBHOOK).then(r=>r.json()).then(d=>{
      const arr = Array.isArray(d)?d:[]; const sorted = arr.sort((a,b)=> new Date(b.timestamp||b.Timestamp||0) - new Date(a.timestamp||a.Timestamp||0));
      setData(sorted); setLoading(false);
    }).catch(()=>setLoading(false));
  };
  useEffect(()=>{ if(auth) load(); },[auth]);
  const getVal = (obj, keys) => { for(let k of keys) if(obj[k]!==undefined && obj[k]!==null && obj[k]!=='') return obj[k]; return ''; }
  const formatDate = (t) => { if(!t) return '-'; try { return new Date(t).toLocaleString(); } catch { return t; } }

  // DELETE - INSTANT, NO POPUP AT ALL
  const handleDelete = async (row) => {
    const ts = getVal(row,['Timestamp','timestamp']);
    setData(prev => prev.filter(r => getVal(r,['Timestamp','timestamp']) !== ts));
    const payload = { action:'delete', timestamp:ts, fullName:getVal(row,['FullName','fullName']), phone:getVal(row,['Phone','phone']), email:getVal(row,['Email','email']), type:tab };
    await fetch(GOOGLE_SHEET_WEBHOOK,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain'},body:JSON.stringify(payload)});
  };

  const handleEdit = (row) => {
    const ts = getVal(row,['Timestamp','timestamp']); setEditRow(ts);
    setForm({ timestamp:ts, FullName:getVal(row,['FullName','fullName']), Phone:getVal(row,['Phone','phone']), Email:getVal(row,['Email','email']), Service:getVal(row,['Service','service']), Messages:getVal(row,['Messages','message']), Position:getVal(row,['Position','position']), Education:getVal(row,['Education','education']), District:getVal(row,['District','district']), Experience:getVal(row,['Experience','experience']), Interest:getVal(row,['Interest','interest']), type:tab });
  };
  const handleSave = async () => {
    const payload = { action:'update', ...form, timestamp:editRow, type:tab };
    setData(prev => prev.map(r => getVal(r,['Timestamp','timestamp'])===editRow?{...r,...form,Timestamp:editRow,timestamp:editRow}:r));
    setEditRow(null);
    await fetch(GOOGLE_SHEET_WEBHOOK,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain'},body:JSON.stringify(payload)});
  };
  const handleAddNew = async () => {
    const ts = new Date().toISOString();
    const payload = { ...form, timestamp:ts, Timestamp:ts, type:tab==='contacts'?'contact':'applicant' };
    setData(prev=>[payload,...prev]); setShowAdd(false); setForm({});
    await fetch(GOOGLE_SHEET_WEBHOOK,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain'},body:JSON.stringify(payload)});
  };

  const unique = (keyArr) => [...new Set(data.map(d=>getVal(d,keyArr)).filter(v=>v))].sort();
  const serviceOptions = unique(['Service','service']);
  const positionOptions = unique(['Position','position']);
  const districtOptions = unique(['District','district']);
  const educationOptions = unique(['Education','education']);
  const experienceOptions = unique(['Experience','experience']);
  const interestOptions = unique(['Interest','interest']);
  const clearFilters = () => setFilters({service:"",position:"",district:"",education:"",experience:"",interest:"",dateFrom:"",dateTo:""});
  const exportCSV = (rows, filename) => { if(!rows.length) return; const headers = tab==='contacts'?["Timestamp","FullName","Phone","Email","Service","Messages"]:["Timestamp","FullName","Phone","Email","Position","Education","District","Experience","Interest"]; const csv = [headers.join(",")].concat(rows.map(r=> headers.map(h=>`"${String(getVal(r,[h,h.toLowerCase()])||'').replace(/"/g,'""')}"`).join(","))).join("\n"); const blob = new Blob([csv],{type:"text/csv"}); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download=filename; a.click(); };

  if(!auth){
    return (
      <div style={{minHeight:'100vh',background:'radial-gradient(circle at top,#1a2f5c,#0a1931)',display:'flex',justifyContent:'center',alignItems:'center',fontFamily:'Arial'}}>
        <div style={{background:'#fff',padding:'36px',borderRadius:'24px',width:'92%',maxWidth:'400px',boxShadow:'0 20px 60px rgba(0,0,0,.3)',textAlign:'center'}}>
          <div style={{width:'56px',height:'56px',background:'#0a1931',borderRadius:'14px',margin:'0 auto 14px',display:'grid',placeItems:'center',color:'#ffcc00',fontSize:'22px',fontWeight:900}}>P</div>
          <h2 style={{fontWeight:900,color:'#0a1931',fontSize:'18px'}}>PINNACLE ADMIN</h2>
          <p style={{fontSize:'12px',color:'#8a8a8a',marginTop:'6px'}}>Secure access to Contacts & Applicants</p>
          <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Admin Password" style={{width:'100%',padding:'14px 16px',borderRadius:'12px',marginTop:'20px',border:'2px solid #0a1931',fontSize:'13px',outline:'none'}}/>
          <button onClick={login} style={{width:'100%',marginTop:'14px',background:'#ffcc00',padding:'14px',borderRadius:'12px',fontWeight:900,border:'none',cursor:'pointer'}}>UNLOCK DASHBOARD</button>
        </div>
      </div>
    )
  }

  const applicants = data.filter(d => (d.type==='applicant') || getVal(d,['Position','position']));
  const contacts = data.filter(d => (d.type==='contact') || getVal(d,['Service','service']));
  const applyFilters = (list) => {
    return list.filter(d=>{
      const s = `${getVal(d,['FullName','fullName'])} ${getVal(d,['Phone','phone'])} ${getVal(d,['Email','email'])} ${getVal(d,['Service','service'])} ${getVal(d,['Messages','message'])} ${getVal(d,['Position','position'])} ${getVal(d,['District','district'])}`.toLowerCase();
      if(search && !s.includes(search.toLowerCase())) return false;
      if(filters.service && getVal(d,['Service','service']).toLowerCase() !== filters.service.toLowerCase()) return false;
      if(filters.position && getVal(d,['Position','position']).toLowerCase() !== filters.position.toLowerCase()) return false;
      if(filters.district && getVal(d,['District','district']).toLowerCase() !== filters.district.toLowerCase()) return false;
      if(filters.education && getVal(d,['Education','education']).toLowerCase() !== filters.education.toLowerCase()) return false;
      if(filters.experience && getVal(d,['Experience','experience']).toLowerCase() !== filters.experience.toLowerCase()) return false;
      if(filters.interest && getVal(d,['Interest','interest']).toLowerCase() !== filters.interest.toLowerCase()) return false;
      const ts = new Date(getVal(d,['Timestamp','timestamp']));
      if(filters.dateFrom && ts < new Date(filters.dateFrom)) return false;
      if(filters.dateTo && ts > new Date(filters.dateTo + 'T23:59:59')) return false;
      return true;
    });
  };
  const filteredContacts = applyFilters(contacts);
  const filteredApplicants = applyFilters(applicants);
  const list = tab==='contacts'?filteredContacts:filteredApplicants;
  const activeFilterCount = Object.values(filters).filter(v=>v).length;

  return (
    <div style={{background:'#f6f8fb',minHeight:'100vh',fontFamily:'Arial'}}>
      <div style={{background:'#0a1931',padding:'18px 24px',display:'flex',justifyContent:'space-between',alignItems:'center',position:'sticky',top:0,zIndex:100,flexWrap:'wrap',gap:'12px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px'}}><div style={{width:'38px',height:'38px',background:'#ffcc00',borderRadius:'10px',display:'grid',placeItems:'center',fontWeight:900}}>P</div><div><h1 style={{color:'#fff',fontWeight:900,fontSize:'14px',letterSpacing:'1px'}}>PINNACLE SECURITY LTD</h1><p style={{color:'#ffcc00',fontSize:'10px',letterSpacing:'1px'}}>ADMIN DASHBOARD</p></div></div>
        <div style={{display:'flex',gap:'8px',alignItems:'center',flexWrap:'wrap'}}>
          <div style={{background:'rgba(255,255,255,.08)',borderRadius:'24px',padding:'6px 14px',display:'flex',alignItems:'center'}}><span style={{color:'#aaa',fontSize:'12px'}}>🔍</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{background:'transparent',border:'none',outline:'none',color:'#fff',fontSize:'12px',width:'160px',marginLeft:'8px'}}/></div>
          <button onClick={()=>setShowFilters(!showFilters)} style={{background:activeFilterCount?'#ffcc00':'#fff',color:'#0a1931',border:'none',padding:'8px 14px',borderRadius:'20px',fontWeight:800,fontSize:'12px',cursor:'pointer'}}>{showFilters?'✕ Filters':`⚙ Filters${activeFilterCount?` (${activeFilterCount})`:''}`}</button>
          <button onClick={load} style={{background:'#ffcc00',border:'none',padding:'8px 14px',borderRadius:'20px',fontWeight:800,fontSize:'12px',cursor:'pointer'}}>{loading?'...':'↻ Refresh'}</button>
          <a href="/" style={{background:'transparent',border:'1px solid #ffcc00',color:'#ffcc00',padding:'8px 14px',borderRadius:'20px',fontWeight:800,fontSize:'12px',textDecoration:'none'}}>Website</a>
        </div>
      </div>

      <div style={{maxWidth:'1600px',margin:'auto',padding:'22px'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:'14px',marginBottom:'18px'}}>
          <div onClick={()=>setTab('contacts')} style={{background:tab==='contacts'?'#0a1931':'#fff',color:tab==='contacts'?'#fff':'#0a1931',padding:'18px',borderRadius:'18px',cursor:'pointer',boxShadow:'0 8px 20px rgba(0,0,0,.06)',border:tab==='contacts'?'2px solid #ffcc00':'1px solid #eee'}}><p style={{fontSize:'10px',letterSpacing:'1px',opacity:.7}}>📞 CONTACT REQUESTS</p><div style={{display:'flex',justifyContent:'space-between',alignItems:'end',marginTop:'8px'}}><h2 style={{fontSize:'28px',fontWeight:900}}>{contacts.length}</h2><span style={{background:tab==='contacts'?'#ffcc00':'#0a1931',color:tab==='contacts'?'#0a1931':'#ffcc00',padding:'4px 10px',borderRadius:'20px',fontSize:'10px',fontWeight:900}}>VIEW</span></div></div>
          <div onClick={()=>setTab('applicants')} style={{background:tab==='applicants'?'#ffcc00':'#fff',padding:'18px',borderRadius:'18px',cursor:'pointer',boxShadow:'0 8px 20px rgba(0,0,0,.06)',border:tab==='applicants'?'2px solid #0a1931':'1px solid #eee'}}><p style={{fontSize:'10px',letterSpacing:'1px',color:'#666'}}>🎖️ JOB APPLICANTS</p><div style={{display:'flex',justifyContent:'space-between',alignItems:'end',marginTop:'8px'}}><h2 style={{fontSize:'28px',fontWeight:900,color:'#0a1931'}}>{applicants.length}</h2><span style={{background:'#0a1931',color:'#ffcc00',padding:'4px 10px',borderRadius:'20px',fontSize:'10px',fontWeight:900}}>VIEW</span></div></div>
          <div style={{background:'#fff',padding:'18px',borderRadius:'18px',boxShadow:'0 8px 20px rgba(0,0,0,.06)',border:'1px solid #eee'}}><p style={{fontSize:'10px',letterSpacing:'1px',color:'#666'}}>📊 CURRENT VIEW</p><div style={{display:'flex',justifyContent:'space-between',alignItems:'end',marginTop:'8px'}}><h2 style={{fontSize:'28px',fontWeight:900,color:'#0a1931'}}>{list.length}</h2><button onClick={()=>exportCSV(list,`${tab}.csv`)} style={{background:'#f3f4f6',border:'none',padding:'6px 12px',borderRadius:'20px',fontSize:'10px',fontWeight:900,cursor:'pointer'}}>⬇ EXPORT CSV</button></div></div>
          <div style={{background:'linear-gradient(135deg,#0a1931,#1a3a6a)',padding:'18px',borderRadius:'18px',display:'flex',alignItems:'center',justifyContent:'space-between'}}><div><p style={{fontSize:'10px',color:'#ffcc00'}}>QUICK ACTION</p><p style={{color:'#fff',fontSize:'13px',fontWeight:700,marginTop:'6px'}}>Add New {tab}</p></div><button onClick={()=>{setForm({});setShowAdd(true)}} style={{background:'#ffcc00',border:'none',width:'40px',height:'40px',borderRadius:'12px',fontWeight:900,fontSize:'18px',cursor:'pointer'}}>＋</button></div>
        </div>

        {showFilters && (
          <div style={{background:'#fff',borderRadius:'16px',padding:'16px',marginBottom:'16px',boxShadow:'0 8px 20px rgba(0,0,0,.05)',border:'1px solid #eef'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}}><h3 style={{fontSize:'12px',fontWeight:900}}>⚙ FILTERS {activeFilterCount>0&&<span style={{background:'#ffcc00',padding:'2px 8px',borderRadius:'10px',marginLeft:'8px'}}>{activeFilterCount} active</span>}</h3><button onClick={clearFilters} style={{background:'#fee2e2',color:'#dc2626',border:'none',padding:'6px 12px',borderRadius:'20px',fontSize:'11px',fontWeight:800,cursor:'pointer'}}>Clear All</button></div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:'10px'}}>
              <div><label style={{fontSize:'10px',fontWeight:800,color:'#666'}}>DATE FROM</label><input type="date" value={filters.dateFrom} onChange={e=>setFilters({...filters,dateFrom:e.target.value})} style={{width:'100%',padding:'10px',borderRadius:'10px',border:'1px solid #ddd',marginTop:'4px'}}/></div>
              <div><label style={{fontSize:'10px',fontWeight:800,color:'#666'}}>DATE TO</label><input type="date" value={filters.dateTo} onChange={e=>setFilters({...filters,dateTo:e.target.value})} style={{width:'100%',padding:'10px',borderRadius:'10px',border:'1px solid #ddd',marginTop:'4px'}}/></div>
              {tab==='contacts' ? <div><label style={{fontSize:'10px',fontWeight:800,color:'#666'}}>SERVICE</label><select value={filters.service} onChange={e=>setFilters({...filters,service:e.target.value})} style={{width:'100%',padding:'10px',borderRadius:'10px',border:'1px solid #ddd',marginTop:'4px'}}><option value="">All Services</option>{serviceOptions.map(s=><option key={s} value={s}>{s}</option>)}</select></div> : <><div><label style={{fontSize:'10px',fontWeight:800,color:'#666'}}>POSITION</label><select value={filters.position} onChange={e=>setFilters({...filters,position:e.target.value})} style={{width:'100%',padding:'10px',borderRadius:'10px',border:'1px solid #ddd',marginTop:'4px'}}><option value="">All Positions</option>{positionOptions.map(s=><option key={s} value={s}>{s}</option>)}</select></div><div><label style={{fontSize:'10px',fontWeight:800,color:'#666'}}>DISTRICT</label><select value={filters.district} onChange={e=>setFilters({...filters,district:e.target.value})} style={{width:'100%',padding:'10px',borderRadius:'10px',border:'1px solid #ddd',marginTop:'4px'}}><option value="">All Districts</option>{districtOptions.map(s=><option key={s} value={s}>{s}</option>)}</select></div></>}
            </div>
          </div>
        )}

        <div style={{background:'#fff',borderRadius:'20px',overflow:'hidden',boxShadow:'0 10px 30px rgba(0,0,0,.06)'}}>
          <div style={{padding:'16px 20px',display:'flex',justifyContent:'space-between',alignItems:'center',background:tab==='contacts'?'#0a1931':'#7a0a0a'}}><div style={{color:tab==='contacts'?'#ffcc00':'#fff',fontWeight:900,fontSize:'13px'}}>{tab==='contacts'?`📞 CONTACTS — ${list.length}`:`📋 APPLICANTS — ${list.length}`}</div></div>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px',minWidth:'1100px'}}>
              <thead><tr style={{background:'#f8f9fb',color:'#6b7280',textAlign:'left',fontSize:'10px'}}><th style={{padding:'14px 16px'}}>DATE</th><th style={{padding:'14px 16px'}}>FULL NAME</th><th style={{padding:'14px 16px'}}>PHONE</th><th style={{padding:'14px 16px'}}>EMAIL</th>{tab==='contacts'?<><th style={{padding:'14px 16px'}}>SERVICE</th><th style={{padding:'14px 16px'}}>MESSAGE</th></>:<><th style={{padding:'14px 16px'}}>POSITION</th><th style={{padding:'14px 16px'}}>EDUCATION</th><th style={{padding:'14px 16px'}}>DISTRICT</th><th style={{padding:'14px 16px'}}>EXP</th><th style={{padding:'14px 16px'}}>INTEREST</th></>}<th style={{padding:'14px 16px'}}>ACTIONS</th></tr></thead>
              <tbody>{list.map((d,i)=>{ const ts=getVal(d,['Timestamp','timestamp']); const isEditing=editRow===ts; return (<tr key={i} style={{borderBottom:'1px solid #f1f1',background:isEditing?'#fff9db': i%2===0?'#fff':'#fcfdff'}}><td style={{padding:'12px 16px',color:'#6b7280',fontSize:'11px'}}>{formatDate(ts)}</td><td style={{padding:'12px 16px',fontWeight:700}}>{isEditing?<input value={form.FullName||''} onChange={e=>setForm({...form,FullName:e.target.value})} style={{padding:'6px',borderRadius:'6px',border:'1px solid #ddd',width:'110px'}}/>:getVal(d,['FullName','fullName'])}</td><td style={{padding:'12px 16px'}}>{isEditing?<input value={form.Phone||''} onChange={e=>setForm({...form,Phone:e.target.value})} style={{padding:'6px',borderRadius:'6px',border:'1px solid #ddd',width:'90px'}}/>:getVal(d,['Phone','phone'])}</td><td style={{padding:'12px 16px'}}>{isEditing?<input value={form.Email||''} onChange={e=>setForm({...form,Email:e.target.value})} style={{padding:'6px',borderRadius:'6px',border:'1px solid #ddd',width:'130px'}}/>:getVal(d,['Email','email'])}</td>{tab==='contacts'?<><td style={{padding:'12px 16px'}}>{isEditing?<input value={form.Service||''} onChange={e=>setForm({...form,Service:e.target.value})} style={{padding:'4px',width:'90px'}}/>:getVal(d,['Service','service'])}</td><td style={{padding:'12px 16px'}}>{isEditing?<input value={form.Messages||''} onChange={e=>setForm({...form,Messages:e.target.value})} style={{padding:'6px',width:'160px'}}/>:getVal(d,['Messages','message'])}</td></>:<><td style={{padding:'12px 16px'}}>{isEditing?<input value={form.Position||''} onChange={e=>setForm({...form,Position:e.target.value})} style={{padding:'4px',width:'90px'}}/>:getVal(d,['Position','position'])}</td><td style={{padding:'12px 16px'}}>{isEditing?<input value={form.Education||''} onChange={e=>setForm({...form,Education:e.target.value})} style={{padding:'4px',width:'60px'}}/>:getVal(d,['Education','education'])}</td><td style={{padding:'12px 16px'}}>{isEditing?<input value={form.District||''} onChange={e=>setForm({...form,District:e.target.value})} style={{padding:'4px',width:'60px'}}/>:getVal(d,['District','district'])}</td><td style={{padding:'12px 16px'}}>{isEditing?<input value={form.Experience||''} onChange={e=>setForm({...form,Experience:e.target.value})} style={{padding:'4px',width:'50px'}}/>:getVal(d,['Experience','experience'])}</td><td style={{padding:'12px 16px'}}>{isEditing?<input value={form.Interest||''} onChange={e=>setForm({...form,Interest:e.target.value})} style={{padding:'4px',width:'80px'}}/>:getVal(d,['Interest','interest'])}</td></>}<td style={{padding:'12px 16px'}}><div style={{display:'flex',gap:'6px'}}>{isEditing?<><button onClick={handleSave} style={{background:'#0a1931',color:'#ffcc00',border:'none',padding:'6px 12px',borderRadius:'8px',fontWeight:800,fontSize:'11px',cursor:'pointer'}}>SAVE</button><button onClick={()=>setEditRow(null)} style={{background:'#eee',border:'none',padding:'6px 10px',borderRadius:'8px',fontSize:'11px',cursor:'pointer'}}>CANCEL</button></>:<><button onClick={()=>handleEdit(d)} style={{background:'#ffcc00',border:'none',padding:'6px 12px',borderRadius:'8px',fontWeight:800,fontSize:'11px',cursor:'pointer'}}>EDIT</button><button onClick={()=>handleDelete(d)} style={{background:'#c00',color:'#fff',border:'none',padding:'6px 10px',borderRadius:'8px',fontWeight:800,fontSize:'11px',cursor:'pointer'}}>Delete</button></>}</div></td></tr>)})}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
export default AdminDashboard