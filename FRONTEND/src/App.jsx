import React, { useState, useEffect } from 'react'

const ADMIN_PASSWORD = "Pinnacle2026!Secure123";
const GOOGLE_SHEET_WEBHOOK = "https://script.google.com/macros/s/AKfycbz0Fx9gSfPwPXZdi8pivw9IdQ_fzj707fPk22GBECuGYhGzwePtEPZV47TyXk8TN8bggQ/exec";
const KOBO_APTITUDE_TEST = "https://ee.kobotoolbox.org/x/ODCdeyaJ";
const GOOGLE_APTITUDE_REGISTER = "https://forms.gle/W8JroZ8n8HGArq248";

const getFullDateTime24 = () => {
  return new Date().toLocaleString('en-GB', {
    timeZone: 'Africa/Kampala',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};

// ========= ADMIN DASHBOARD - PERFECT VERSION (NO POPUP + RIGHT DRAWER + BULK DELETE) =========
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
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(30);
  const [selected, setSelected] = useState([]);
  const [detailRow, setDetailRow] = useState(null);

  const login = () => pass === ADMIN_PASSWORD ? setAuth(true) : alert("Wrong Password!");
  const load = () => {
    setLoading(true);
    fetch(GOOGLE_SHEET_WEBHOOK).then(r=>r.json()).then(d=>{
      const arr = Array.isArray(d)?d:[]; 
      const sorted = arr.sort((a,b)=> new Date(b.timestamp||b.Timestamp||0) - new Date(a.timestamp||a.Timestamp||0));
      setData(sorted); setLoading(false);
    }).catch(()=>setLoading(false));
  };
  useEffect(()=>{ if(auth) load(); },[auth]);
  useEffect(()=>{ setCurrentPage(1); },[filters, search, tab, rowsPerPage]);
  const getVal = (obj, keys) => { for(let k of keys) if(obj[k]!==undefined && obj[k]!==null && obj[k]!=='') return obj[k]; return ''; }
  const formatDate = (t) => { 
    if(!t) return '-'; 
    try { 
      const d = new Date(t);
      if(isNaN(d.getTime())) return t;
      return d.toLocaleString('en-GB', { timeZone: 'Africa/Kampala', day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false });
    } catch { return t; } 
  }
  const handleDelete = async (row) => {
    const ts = getVal(row,['Timestamp','timestamp']);
    setData(prev => prev.filter(r => getVal(r,['Timestamp','timestamp']) !== ts));
    setSelected(prev=>prev.filter(id=>id!==ts));
    if(detailRow && getVal(detailRow,['Timestamp','timestamp'])===ts) setDetailRow(null);
    await fetch(GOOGLE_SHEET_WEBHOOK,{ method:'POST', mode:'no-cors', headers:{'Content-Type':'text/plain'}, body:JSON.stringify({ action:'delete', timestamp: ts }) });
  };
  const handleBulkDelete = async () => {
    if(selected.length===0) return;
    const toDelete = [...selected];
    setData(prev => prev.filter(r => !toDelete.includes(getVal(r,['Timestamp','timestamp']))));
    setSelected([]); setDetailRow(null);
    await fetch(GOOGLE_SHEET_WEBHOOK,{ method:'POST', mode:'no-cors', headers:{'Content-Type':'text/plain'}, body:JSON.stringify({ action:'bulkDelete', timestamps: toDelete }) });
  };
  const toggleSelect = (ts) => setSelected(prev => prev.includes(ts) ? prev.filter(id=>id!==ts) : [...prev, ts]);
  const handleEdit = (row) => {
    const ts = getVal(row,['Timestamp','timestamp']); setEditRow(ts);
    setForm({ timestamp:ts, FullName:getVal(row,['FullName','fullName']), Phone:getVal(row,['Phone','phone']), Email:getVal(row,['Email','email']), Service:getVal(row,['Service','service']), Messages:getVal(row,['Messages','message']), Position:getVal(row,['Position','position']), Education:getVal(row,['Education','education']), District:getVal(row,['District','district']), Experience:getVal(row,['Experience','experience']), Interest:getVal(row,['Interest','interest']), type:tab });
  };
  const handleSave = async () => {
    const payload = { action:'update', ...form, timestamp:editRow, type:tab };
    setData(prev => prev.map(r => getVal(r,['Timestamp','timestamp'])===editRow?{...r,...form,Timestamp:editRow,timestamp:editRow}:r));
    setEditRow(null);
    if(detailRow && getVal(detailRow,['Timestamp','timestamp'])===editRow) setDetailRow(prev=>({...prev,...form,Timestamp:editRow,timestamp:editRow}));
    await fetch(GOOGLE_SHEET_WEBHOOK,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain'},body:JSON.stringify(payload)});
  };
  const handleAddNew = async () => {
    const ts = getFullDateTime24();
    const payload = { ...form, timestamp:ts, Timestamp:ts, type:tab==='contacts'?'contact':'applicant' };
    setData(prev=>[payload,...prev]); setShowAdd(false); setForm({});
    await fetch(GOOGLE_SHEET_WEBHOOK,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain'},body:JSON.stringify(payload)});
  };
  const unique = (keyArr) => [...new Set(data.map(d=>getVal(d,keyArr)).filter(v=>v))].sort();
  const serviceOptions = unique(['Service','service']); const positionOptions = unique(['Position','position']); const districtOptions = unique(['District','district']); const educationOptions = unique(['Education','education']); const experienceOptions = unique(['Experience','experience']); const interestOptions = unique(['Interest','interest']);
  const clearFilters = () => { setFilters({service:"",position:"",district:"",education:"",experience:"",interest:"",dateFrom:"",dateTo:""}); setCurrentPage(1); };
  const exportCSV = (rows, filename) => { if(!rows.length) return; const headers = tab==='contacts'?["Timestamp","FullName","Phone","Email","Service","Messages"]:["Timestamp","FullName","Phone","Email","Position","Education","District","Experience","Interest"]; const csv = [headers.join(",")].concat(rows.map(r=> headers.map(h=>`"${String(getVal(r,[h,h.toLowerCase()])||'').replace(/"/g,'""')}"`).join(","))).join("\n"); const blob = new Blob([csv],{type:"text/csv"}); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download=filename; a.click(); };

  if(!auth){
    return (
      <div style={{minHeight:'100vh',background:'radial-gradient(circle at top,#1a2f5c,#0a1931)',display:'flex',justifyContent:'center',alignItems:'center',fontFamily:'Arial'}}>
        <div style={{background:'#fff',padding:'36px',borderRadius:'24px',width:'92%',maxWidth:'400px',textAlign:'center'}}>
          <div style={{width:'56px',height:'56px',background:'#0a1931',borderRadius:'14px',margin:'0 auto 14px',display:'grid',placeItems:'center',color:'#ffcc00',fontSize:'22px',fontWeight:900}}>P</div>
          <h2 style={{fontWeight:900,color:'#0a1931'}}>PINNACLE ADMIN</h2>
          <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Admin Password" style={{width:'100%',padding:'14px 16px',borderRadius:'12px',marginTop:'20px',border:'2px solid #0a1931'}}/>
          <button onClick={login} style={{width:'100%',marginTop:'14px',background:'#ffcc00',padding:'14px',borderRadius:'12px',fontWeight:900,border:'none',cursor:'pointer'}}>UNLOCK DASHBOARD</button>
        </div>
      </div>
    )
  }
  const applicants = data.filter(d => (d.type==='applicant') || getVal(d,['Position','position']));
  const contacts = data.filter(d => (d.type==='contact') || getVal(d,['Service','service']));
  const applyFilters = (list) => list.filter(d=>{
    const s = `${getVal(d,['FullName','fullName'])} ${getVal(d,['Phone','phone'])} ${getVal(d,['Email','email'])} ${getVal(d,['Service','service'])} ${getVal(d,['Messages','message'])} ${getVal(d,['Position','position'])} ${getVal(d,['District','district'])} ${getVal(d,['Education','education'])}`.toLowerCase();
    if(search && !s.includes(search.toLowerCase())) return false;
    if(filters.service && getVal(d,['Service','service']).toLowerCase() !== filters.service.toLowerCase()) return false;
    if(filters.position && getVal(d,['Position','position']).toLowerCase() !== filters.position.toLowerCase()) return false;
    if(filters.district && getVal(d,['District','district']).toLowerCase() !== filters.district.toLowerCase()) return false;
    if(filters.education && getVal(d,['Education','education']).toLowerCase() !== filters.education.toLowerCase()) return false;
    if(filters.experience && getVal(d,['Experience','experience']).toLowerCase() !== filters.experience.toLowerCase()) return false;
    if(filters.interest && getVal(d,['Interest','interest']).toLowerCase() !== filters.interest.toLowerCase()) return false;
    const ts = new Date(getVal(d,['Timestamp','timestamp'])); if(filters.dateFrom && ts < new Date(filters.dateFrom)) return false; if(filters.dateTo && ts > new Date(filters.dateTo + 'T23:59:59')) return false; return true;
  });
  const filteredContacts = applyFilters(contacts); const filteredApplicants = applyFilters(applicants); const list = tab==='contacts'?filteredContacts:filteredApplicants;
  const totalPages = Math.ceil(list.length / rowsPerPage) || 1; const paginatedList = list.slice((currentPage-1)*rowsPerPage, currentPage*rowsPerPage);
  const allPageIds = paginatedList.map(r=>getVal(r,['Timestamp','timestamp'])); const isAllSelected = allPageIds.length>0 && allPageIds.every(id=>selected.includes(id)); const activeFilterCount = Object.values(filters).filter(v=>v).length;
  return (
    <div style={{background:'#f6f8fb',minHeight:'100vh',fontFamily:'Arial'}}>
      <div style={{background:'#0a1931',padding:'18px 24px',display:'flex',justifyContent:'space-between',alignItems:'center',position:'sticky',top:0,zIndex:100,flexWrap:'wrap',gap:'12px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px'}}><div style={{width:'38px',height:'38px',background:'#ffcc00',borderRadius:'10px',display:'grid',placeItems:'center',fontWeight:900}}>P</div><div><h1 style={{color:'#fff',fontWeight:900,fontSize:'14px'}}>PINNACLE SECURITY LTD</h1><p style={{color:'#ffcc00',fontSize:'10px'}}>ADMIN DASHBOARD</p></div></div>
        <div style={{display:'flex',gap:'8px',alignItems:'center',flexWrap:'wrap'}}>
          <div style={{background:'rgba(255,255,255,.08)',borderRadius:'24px',padding:'6px 14px'}}><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{background:'transparent',border:'none',outline:'none',color:'#fff',fontSize:'12px',width:'140px'}}/></div>
          <button onClick={()=>setShowFilters(!showFilters)} style={{background:activeFilterCount?'#ffcc00':'#fff',color:'#0a1931',border:'none',padding:'8px 14px',borderRadius:'20px',fontWeight:800,fontSize:'12px',cursor:'pointer'}}>{showFilters?`✕ Filters`:`⚙ Filters${activeFilterCount?` (${activeFilterCount})`:''}`}</button>
          {selected.length>0 && <button onClick={handleBulkDelete} style={{background:'#dc2626',color:'#fff',border:'none',padding:'8px 14px',borderRadius:'20px',fontWeight:800,fontSize:'12px',cursor:'pointer'}}>🗑 Delete Selected ({selected.length})</button>}
          <button onClick={load} style={{background:'#ffcc00',border:'none',padding:'8px 14px',borderRadius:'20px',fontWeight:800,fontSize:'12px',cursor:'pointer'}}>{loading?'...':'↻ Refresh'}</button>
          <a href="/" style={{background:'transparent',border:'1px solid #ffcc00',color:'#ffcc00',padding:'8px 14px',borderRadius:'20px',fontWeight:800,fontSize:'12px',textDecoration:'none'}}>Website</a>
        </div>
      </div>
      <div style={{maxWidth:'1600px',margin:'auto',padding:'22px'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:'14px',marginBottom:'18px'}}>
          <div onClick={()=>{setTab('contacts'); setSelected([]);}} style={{background:tab==='contacts'?'#0a1931':'#fff',color:tab==='contacts'?'#fff':'#0a1931',padding:'18px',borderRadius:'18px',cursor:'pointer',border:tab==='contacts'?'2px solid #ffcc00':'1px solid #eee'}}><p style={{fontSize:'10px',opacity:.7}}>📞 CONTACT REQUESTS</p><h2 style={{fontSize:'28px',fontWeight:900,marginTop:'8px'}}>{contacts.length} <span style={{fontSize:'12px',fontWeight:400,opacity:.6}}>/ {filteredContacts.length} filtered</span></h2></div>
          <div onClick={()=>{setTab('applicants'); setSelected([]);}} style={{background:tab==='applicants'?'#ffcc00':'#fff',padding:'18px',borderRadius:'18px',cursor:'pointer',border:tab==='applicants'?'2px solid #0a1931':'1px solid #eee'}}><p style={{fontSize:'10px'}}>🎖️ JOB APPLICANTS</p><h2 style={{fontSize:'28px',fontWeight:900,marginTop:'8px'}}>{applicants.length} <span style={{fontSize:'12px',fontWeight:400,color:'#666'}}>/ {filteredApplicants.length} filtered</span></h2></div>
          <div style={{background:'#fff',padding:'18px',borderRadius:'18px',border:'1px solid #eee'}}><p style={{fontSize:'10px'}}>📊 CURRENT VIEW</p><div style={{display:'flex',justifyContent:'space-between',alignItems:'end',marginTop:'8px'}}><h2 style={{fontSize:'28px',fontWeight:900}}>{list.length}</h2><button onClick={()=>exportCSV(list,`${tab}.csv`)} style={{background:'#f3f4f6',border:'none',padding:'6px 12px',borderRadius:'20px',fontSize:'10px',fontWeight:900,cursor:'pointer'}}>⬇ EXPORT CSV</button></div></div>
          <div style={{background:'linear-gradient(135deg,#0a1931,#1a3a6a)',padding:'18px',borderRadius:'18px',display:'flex',alignItems:'center',justifyContent:'space-between'}}><div><p style={{fontSize:'10px',color:'#ffcc00'}}>QUICK ACTION</p><p style={{color:'#fff',fontSize:'13px',fontWeight:700,marginTop:'6px'}}>Add New {tab}</p></div><button onClick={()=>{setForm({});setShowAdd(true)}} style={{background:'#ffcc00',border:'none',width:'40px',height:'40px',borderRadius:'12px',fontWeight:900,fontSize:'18px',cursor:'pointer'}}>＋</button></div>
        </div>
        {showFilters && (
          <div style={{background:'#fff',borderRadius:'16px',padding:'16px',marginBottom:'16px',boxShadow:'0 8px 20px rgba(0,0,0,.05)',border:'1px solid #eef'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}}><h3 style={{fontSize:'12px',fontWeight:900}}>⚙ FILTERS {activeFilterCount>0&&<span style={{background:'#ffcc00',padding:'2px 8px',borderRadius:'10px',marginLeft:'8px'}}>{activeFilterCount} active</span>}</h3><button onClick={clearFilters} style={{background:'#fee2e2',color:'#dc2626',border:'none',padding:'6px 12px',borderRadius:'20px',fontSize:'11px',fontWeight:800,cursor:'pointer'}}>Clear All</button></div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:'10px'}}>
              <div><label style={{fontSize:'10px',fontWeight:800,color:'#666'}}>DATE FROM</label><input type="date" value={filters.dateFrom} onChange={e=>setFilters({...filters,dateFrom:e.target.value})} style={{width:'100%',padding:'10px',borderRadius:'10px',border:'1px solid #ddd',marginTop:'4px',fontSize:'12px'}}/></div>
              <div><label style={{fontSize:'10px',fontWeight:800,color:'#666'}}>DATE TO</label><input type="date" value={filters.dateTo} onChange={e=>setFilters({...filters,dateTo:e.target.value})} style={{width:'100%',padding:'10px',borderRadius:'10px',border:'1px solid #ddd',marginTop:'4px',fontSize:'12px'}}/></div>
              {tab==='contacts' ? <div><label style={{fontSize:'10px',fontWeight:800,color:'#666'}}>SERVICE</label><select value={filters.service} onChange={e=>setFilters({...filters,service:e.target.value})} style={{width:'100%',padding:'10px',borderRadius:'10px',border:'1px solid #ddd',marginTop:'4px',fontSize:'12px'}}><option value="">All Services</option>{serviceOptions.map(s=><option key={s} value={s}>{s}</option>)}</select></div> : <><div><label style={{fontSize:'10px',fontWeight:800,color:'#666'}}>POSITION</label><select value={filters.position} onChange={e=>setFilters({...filters,position:e.target.value})} style={{width:'100%',padding:'10px',borderRadius:'10px',border:'1px solid #ddd',marginTop:'4px',fontSize:'12px'}}><option value="">All Positions</option>{positionOptions.map(s=><option key={s} value={s}>{s}</option>)}</select></div><div><label style={{fontSize:'10px',fontWeight:800,color:'#666'}}>DISTRICT</label><select value={filters.district} onChange={e=>setFilters({...filters,district:e.target.value})} style={{width:'100%',padding:'10px',borderRadius:'10px',border:'1px solid #ddd',marginTop:'4px',fontSize:'12px'}}><option value="">All Districts</option>{districtOptions.map(s=><option key={s} value={s}>{s}</option>)}</select></div><div><label style={{fontSize:'10px',fontWeight:800,color:'#666'}}>EDUCATION</label><select value={filters.education} onChange={e=>setFilters({...filters,education:e.target.value})} style={{width:'100%',padding:'10px',borderRadius:'10px',border:'1px solid #ddd',marginTop:'4px',fontSize:'12px'}}><option value="">All Education</option>{educationOptions.map(s=><option key={s} value={s}>{s}</option>)}</select></div><div><label style={{fontSize:'10px',fontWeight:800,color:'#666'}}>EXPERIENCE</label><select value={filters.experience} onChange={e=>setFilters({...filters,experience:e.target.value})} style={{width:'100%',padding:'10px',borderRadius:'10px',border:'1px solid #ddd',marginTop:'4px',fontSize:'12px'}}><option value="">All Experience</option>{experienceOptions.map(s=><option key={s} value={s}>{s}</option>)}</select></div><div><label style={{fontSize:'10px',fontWeight:800,color:'#666'}}>INTEREST</label><select value={filters.interest} onChange={e=>setFilters({...filters,interest:e.target.value})} style={{width:'100%',padding:'10px',borderRadius:'10px',border:'1px solid #ddd',marginTop:'4px',fontSize:'12px'}}><option value="">All Interest</option>{interestOptions.map(s=><option key={s} value={s}>{s}</option>)}</select></div></>}
            </div>
          </div>
        )}
        <div style={{background:'#fff',borderRadius:'20px',overflow:'hidden',boxShadow:'0 10px 30px rgba(0,0,0,.06)'}}>
          <div style={{padding:'16px 20px',display:'flex',justifyContent:'space-between',alignItems:'center',background:tab==='contacts'?'#0a1931':'#7a0a0a'}}><div style={{color:tab==='contacts'?'#ffcc00':'#fff',fontWeight:900,fontSize:'13px'}}>{tab==='contacts'?`📞 CONTACTS — ${list.length} / ${contacts.length}`:`📋 APPLICANTS — ${list.length} / ${applicants.length}`} • Click row to view →</div></div>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px',minWidth:'1300px'}}>
              <thead><tr style={{background:'#f8f9fb',color:'#6b7280',textAlign:'left',fontSize:'10px',letterSpacing:'1px'}}>
                <th style={{padding:'14px 16px'}}><input type="checkbox" checked={isAllSelected} onChange={()=>{ if(isAllSelected){ setSelected(prev=>prev.filter(id=>!allPageIds.includes(id))); } else { setSelected(prev=>[...new Set([...prev, ...allPageIds])]); } }} /></th>
                <th style={{padding:'14px 16px'}}>DATE & TIME (24HRS)</th><th style={{padding:'14px 16px'}}>FULL NAME</th><th style={{padding:'14px 16px'}}>PHONE</th><th style={{padding:'14px 16px'}}>EMAIL</th>
                {tab==='contacts'?<><th style={{padding:'14px 16px'}}>SERVICE</th><th style={{padding:'14px 16px'}}>MESSAGE</th></>:<><th style={{padding:'14px 16px'}}>POSITION</th><th style={{padding:'14px 16px'}}>EDUCATION</th><th style={{padding:'14px 16px'}}>DISTRICT</th><th style={{padding:'14px 16px'}}>EXP</th><th style={{padding:'14px 16px'}}>INTEREST</th></>}
                <th style={{padding:'14px 16px'}}>ACTIONS</th>
              </tr></thead>
              <tbody>
                {paginatedList.length===0 ? <tr><td colSpan={12} style={{padding:'40px',textAlign:'center',color:'#999'}}>{loading?'Loading...':'No records'}</td></tr> : paginatedList.map((d,i)=>{ 
                  const ts=getVal(d,['Timestamp','timestamp']); const isEditing=editRow===ts; const checked=selected.includes(ts);
                  return (
                  <tr key={i} onClick={()=>{ if(!isEditing) setDetailRow(d); }} style={{borderBottom:'1px solid #f1f1f1',background:checked?'#fff9db': isEditing?'#eef2ff': detailRow && getVal(detailRow,['Timestamp','timestamp'])===ts ? '#fff3cd' : i%2===0?'#fff':'#fcfdff', cursor:'pointer'}}>
                    <td style={{padding:'12px 16px'}} onClick={e=>e.stopPropagation()}><input type="checkbox" checked={checked} onChange={()=>toggleSelect(ts)} /></td>
                    <td style={{padding:'12px 16px',color:'#0a1931',fontSize:'11px',fontWeight:800}}>{formatDate(ts)}</td>
                    <td style={{padding:'12px 16px',fontWeight:700}}>{isEditing?<input value={form.FullName||''} onChange={e=>setForm({...form,FullName:e.target.value})} style={{padding:'6px',borderRadius:'6px',border:'1px solid #ddd',width:'110px'}}/>:getVal(d,['FullName','fullName'])}</td>
                    <td style={{padding:'12px 16px'}}>{isEditing?<input value={form.Phone||''} onChange={e=>setForm({...form,Phone:e.target.value})} style={{padding:'6px',borderRadius:'6px',border:'1px solid #ddd',width:'90px'}}/>:getVal(d,['Phone','phone'])}</td>
                    <td style={{padding:'12px 16px',color:'#4b5563'}}>{isEditing?<input value={form.Email||''} onChange={e=>setForm({...form,Email:e.target.value})} style={{padding:'6px',borderRadius:'6px',border:'1px solid #ddd',width:'130px'}}/>:getVal(d,['Email','email'])}</td>
                    {tab==='contacts'?<>
                      <td style={{padding:'12px 16px'}}>{isEditing?<input value={form.Service||''} onChange={e=>setForm({...form,Service:e.target.value})} style={{padding:'4px',width:'90px'}}/>:<span style={{background:'#eef2ff',color:'#3730a3',padding:'4px 8px',borderRadius:'20px',fontSize:'11px',fontWeight:700}}>{getVal(d,['Service','service'])}</span>}</td>
                      <td style={{padding:'12px 16px',maxWidth:'200px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{isEditing?<input value={form.Messages||''} onChange={e=>setForm({...form,Messages:e.target.value})} style={{padding:'6px',borderRadius:'6px',border:'1px solid #ddd',width:'160px'}}/>:getVal(d,['Messages','message'])}</td>
                    </>:<>
                      <td style={{padding:'12px 16px'}}>{isEditing?<input value={form.Position||''} onChange={e=>setForm({...form,Position:e.target.value})} style={{padding:'4px',width:'90px'}}/>:<span style={{background:'#fef3c7',padding:'4px 8px',borderRadius:'20px',fontSize:'11px',fontWeight:700}}>{getVal(d,['Position','position'])}</span>}</td>
                      <td style={{padding:'12px 16px'}}>{isEditing?<input value={form.Education||''} onChange={e=>setForm({...form,Education:e.target.value})} style={{padding:'4px',width:'60px'}}/>:getVal(d,['Education','education'])}</td>
                      <td style={{padding:'12px 16px'}}>{isEditing?<input value={form.District||''} onChange={e=>setForm({...form,District:e.target.value})} style={{padding:'4px',width:'60px'}}/>:getVal(d,['District','district'])}</td>
                      <td style={{padding:'12px 16px'}}>{isEditing?<input value={form.Experience||''} onChange={e=>setForm({...form,Experience:e.target.value})} style={{padding:'4px',width:'50px'}}/>:getVal(d,['Experience','experience'])}</td>
                      <td style={{padding:'12px 16px'}}>{isEditing?<input value={form.Interest||''} onChange={e=>setForm({...form,Interest:e.target.value})} style={{padding:'4px',width:'80px'}}/>:getVal(d,['Interest','interest'])}</td>
                    </>}
                    <td style={{padding:'12px 16px'}} onClick={e=>e.stopPropagation()}><div style={{display:'flex',gap:'6px'}}>{isEditing?<><button onClick={handleSave} style={{background:'#0a1931',color:'#ffcc00',border:'none',padding:'6px 12px',borderRadius:'8px',fontWeight:800,fontSize:'11px',cursor:'pointer'}}>SAVE</button><button onClick={()=>setEditRow(null)} style={{background:'#eee',border:'none',padding:'6px 10px',borderRadius:'8px',fontSize:'11px',cursor:'pointer'}}>CANCEL</button></>:<><button onClick={()=>handleEdit(d)} style={{background:'#ffcc00',border:'none',padding:'6px 12px',borderRadius:'8px',fontWeight:800,fontSize:'11px',cursor:'pointer'}}>EDIT</button><button onClick={()=>handleDelete(d)} style={{background:'#fee2e2',color:'#dc2626',border:'none',padding:'6px 10px',borderRadius:'8px',fontWeight:800,fontSize:'11px',cursor:'pointer'}}>DEL</button></>}</div></td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
          <div style={{padding:'16px 20px',display:'flex',justifyContent:'space-between',alignItems:'center',borderTop:'1px solid #eee',flexWrap:'wrap',gap:'12px'}}>
            <button disabled={currentPage===1} onClick={()=>setCurrentPage(p=>Math.max(1,p-1))} style={{background:currentPage===1?'#f3f4f6':'#fff',color:currentPage===1?'#aaa':'#0a1931',border:'1px solid #ddd',padding:'8px 16px',borderRadius:'10px',fontWeight:800,fontSize:'12px',cursor:'pointer'}}>◂ PREV</button>
            <div style={{display:'flex',alignItems:'center',gap:'10px',fontSize:'13px'}}><span>Page</span><input type="number" min={1} max={totalPages} value={currentPage} onChange={e=>setCurrentPage(Math.min(totalPages,Math.max(1,Number(e.target.value)||1)))} style={{width:'60px',padding:'8px',borderRadius:'10px',border:'1px solid #ddd',textAlign:'center',fontWeight:800}}/><span>of {totalPages}</span></div>
            <div style={{display:'flex',alignItems:'center',gap:'10px'}}><select value={rowsPerPage} onChange={e=>setRowsPerPage(Number(e.target.value))} style={{padding:'8px 12px',borderRadius:'10px',border:'1px solid #ddd',fontWeight:700,fontSize:'13px'}}><option value={10}>10 rows</option><option value={20}>20 rows</option><option value={30}>30 rows</option><option value={50}>50 rows</option><option value={100}>100 rows</option></select><button disabled={currentPage===totalPages} onClick={()=>setCurrentPage(p=>Math.min(totalPages,p+1))} style={{background:currentPage===totalPages?'#f3f4f6':'#0a1931',color:currentPage===totalPages?'#aaa':'#ffcc00',border:'1px solid #ddd',padding:'8px 16px',borderRadius:'10px',fontWeight:800,fontSize:'12px',cursor:'pointer'}}>NEXT ▸</button></div>
          </div>
        </div>
      </div>
      {showAdd && (<div style={{position:'fixed',inset:0,background:'rgba(10,25,49,.7)',backdropFilter:'blur(8px)',zIndex:10000,display:'flex',justifyContent:'center',alignItems:'center',padding:'20px'}}><div style={{background:'#fff',padding:'24px',borderRadius:'20px',width:'92%',maxWidth:'520px'}}><h3 style={{fontWeight:900,fontSize:'14px'}}>Add New {tab.toUpperCase()}</h3><div style={{display:'grid',gap:'8px',marginTop:'14px'}}><input placeholder="FullName" value={form.FullName||''} onChange={e=>setForm({...form,FullName:e.target.value})} style={{padding:'12px',border:'1px solid #e5e7eb',borderRadius:'10px',fontSize:'13px'}}/><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}><input placeholder="Phone" value={form.Phone||''} onChange={e=>setForm({...form,Phone:e.target.value})} style={{padding:'12px',border:'1px solid #e5e7eb',borderRadius:'10px'}}/><input placeholder="Email" value={form.Email||''} onChange={e=>setForm({...form,Email:e.target.value})} style={{padding:'12px',border:'1px solid #e5e7eb',borderRadius:'10px'}}/></div>{tab==='contacts'?<><input placeholder="Service" value={form.Service||''} onChange={e=>setForm({...form,Service:e.target.value})} style={{padding:'12px',border:'1px solid #e5e7eb',borderRadius:'10px'}}/><textarea placeholder="Messages" value={form.Messages||''} onChange={e=>setForm({...form,Messages:e.target.value})} style={{padding:'12px',border:'1px solid #e5e7eb',borderRadius:'10px'}}/></>:<><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}><input placeholder="Position" value={form.Position||''} onChange={e=>setForm({...form,Position:e.target.value})} style={{padding:'12px',border:'1px solid #e5e7eb',borderRadius:'10px'}}/><input placeholder="Education" value={form.Education||''} onChange={e=>setForm({...form,Education:e.target.value})} style={{padding:'12px',border:'1px solid #e5e7eb',borderRadius:'10px'}}/></div><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}><input placeholder="District" value={form.District||''} onChange={e=>setForm({...form,District:e.target.value})} style={{padding:'12px',border:'1px solid #e5e7eb',borderRadius:'10px'}}/><input placeholder="Experience" value={form.Experience||''} onChange={e=>setForm({...form,Experience:e.target.value})} style={{padding:'12px',border:'1px solid #e5e7eb',borderRadius:'10px'}}/></div><input placeholder="Interest" value={form.Interest||''} onChange={e=>setForm({...form,Interest:e.target.value})} style={{padding:'12px',border:'1px solid #e5e7eb',borderRadius:'10px'}}/></>}</div><div style={{display:'flex',gap:'8px',marginTop:'16px'}}><button onClick={handleAddNew} style={{flex:1,background:'#0a1931',color:'#ffcc00',padding:'12px',borderRadius:'12px',border:'none',fontWeight:900,cursor:'pointer'}}>SAVE TO SHEET</button><button onClick={()=>setShowAdd(false)} style={{flex:1,background:'#f3f4f6',padding:'12px',borderRadius:'12px',border:'none',fontWeight:700,cursor:'pointer'}}>CANCEL</button></div></div></div>)}
      {detailRow && (<div style={{position:'fixed',inset:0,zIndex:10001,display:'flex',justifyContent:'flex-end'}}><div onClick={()=>setDetailRow(null)} style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.45)',backdropFilter:'blur(3px)'}}></div><div style={{position:'relative',width:'92%',maxWidth:'420px',background:'#fff',height:'100vh',overflowY:'auto',boxShadow:'-10px 0 40px rgba(0,0,0,0.2)',animation:'slideIn 0.25s ease'}}><div style={{background: tab==='contacts'?'#0a1931':'#7a0a0a', padding:'20px', color:'#fff', position:'sticky', top:0, zIndex:2}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><div><p style={{fontSize:'10px',color:'#ffcc00',fontWeight:800,letterSpacing:'1px'}}>{tab==='contacts'?'📞 CONTACT DETAIL':'🎖️ APPLICANT DETAIL'}</p><h2 style={{fontSize:'16px',fontWeight:900,marginTop:'4px'}}>{getVal(detailRow,['FullName','fullName'])||'No Name'}</h2></div><button onClick={()=>setDetailRow(null)} style={{background:'rgba(255,255,255,0.15)',border:'none',color:'#fff',width:'36px',height:'36px',borderRadius:'10px',fontSize:'18px',cursor:'pointer',fontWeight:900}}>✕</button></div><p style={{fontSize:'11px',marginTop:'10px',opacity:0.8,background:'rgba(255,255,255,0.1)',padding:'6px 10px',borderRadius:'20px',display:'inline-block'}}>🕒 {formatDate(getVal(detailRow,['Timestamp','timestamp']))}</p></div><div style={{padding:'20px',display:'grid',gap:'14px'}}><div style={{display:'grid',gap:'12px'}}><div style={{background:'#f8fafc',padding:'12px 14px',borderRadius:'12px',border:'1px solid #eef'}}><p style={{fontSize:'10px',fontWeight:800,color:'#64748b'}}>FULL NAME</p><p style={{fontSize:'13px',fontWeight:800,marginTop:'4px',color:'#0a1931'}}>{getVal(detailRow,['FullName','fullName'])||'-'}</p></div><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}><div style={{background:'#f8fafc',padding:'12px 14px',borderRadius:'12px',border:'1px solid #eef'}}><p style={{fontSize:'10px',fontWeight:800,color:'#64748b'}}>PHONE</p><p style={{fontSize:'13px',fontWeight:700,marginTop:'4px'}}>{getVal(detailRow,['Phone','phone'])||'-'}</p></div><div style={{background:'#f8fafc',padding:'12px 14px',borderRadius:'12px',border:'1px solid #eef'}}><p style={{fontSize:'10px',fontWeight:800,color:'#64748b'}}>EMAIL</p><p style={{fontSize:'12px',fontWeight:600,marginTop:'4px',wordBreak:'break-all'}}>{getVal(detailRow,['Email','email'])||'-'}</p></div></div>{tab==='contacts' ? <><div style={{background:'#eef2ff',padding:'12px 14px',borderRadius:'12px',border:'1px solid #e0e7ff'}}><p style={{fontSize:'10px',fontWeight:800,color:'#3730a3'}}>SERVICE REQUESTED</p><p style={{fontSize:'13px',fontWeight:800,marginTop:'4px',color:'#3730a3'}}>{getVal(detailRow,['Service','service'])||'-'}</p></div><div style={{background:'#fffbeb',padding:'14px',borderRadius:'12px',border:'1px solid #fde68a'}}><p style={{fontSize:'10px',fontWeight:800,color:'#92400e'}}>MESSAGE</p><p style={{fontSize:'13px',marginTop:'6px',lineHeight:'1.6',color:'#451a03',whiteSpace:'pre-wrap'}}>{getVal(detailRow,['Messages','message'])||'No message'}</p></div></> : <><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}><div style={{background:'#fef3c7',padding:'12px 14px',borderRadius:'12px',border:'1px solid #fde68a'}}><p style={{fontSize:'10px',fontWeight:800,color:'#92400e'}}>POSITION</p><p style={{fontSize:'13px',fontWeight:800,marginTop:'4px'}}>{getVal(detailRow,['Position','position'])||'-'}</p></div><div style={{background:'#f0fdf4',padding:'12px 14px',borderRadius:'12px',border:'1px solid #bbf7d0'}}><p style={{fontSize:'10px',fontWeight:800,color:'#166534'}}>EDUCATION</p><p style={{fontSize:'13px',fontWeight:800,marginTop:'4px'}}>{getVal(detailRow,['Education','education'])||'-'}</p></div></div><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}><div style={{background:'#f8fafc',padding:'12px 14px',borderRadius:'12px',border:'1px solid #eef'}}><p style={{fontSize:'10px',fontWeight:800,color:'#64748b'}}>DISTRICT</p><p style={{fontSize:'13px',fontWeight:700,marginTop:'4px'}}>{getVal(detailRow,['District','district'])||'-'}</p></div><div style={{background:'#f8fafc',padding:'12px 14px',borderRadius:'12px',border:'1px solid #eef'}}><p style={{fontSize:'10px',fontWeight:800,color:'#64748b'}}>EXPERIENCE</p><p style={{fontSize:'13px',fontWeight:700,marginTop:'4px'}}>{getVal(detailRow,['Experience','experience'])||'-'}</p></div></div><div style={{background:'#fffbeb',padding:'14px',borderRadius:'12px',border:'1px solid #fde68a'}}><p style={{fontSize:'10px',fontWeight:800,color:'#92400e'}}>INTEREST</p><p style={{fontSize:'13px',marginTop:'6px',lineHeight:'1.6',whiteSpace:'pre-wrap'}}>{getVal(detailRow,['Interest','interest'])||'-'}</p></div></>}<div style={{background:'#f1f5f9',padding:'12px 14px',borderRadius:'12px',marginTop:'8px'}}><p style={{fontSize:'10px',fontWeight:800,color:'#64748b'}}>TIMESTAMP (24HRS - EAT)</p><p style={{fontSize:'12px',fontWeight:800,marginTop:'4px',fontFamily:'monospace'}}>{formatDate(getVal(detailRow,['Timestamp','timestamp']))}</p></div><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginTop:'10px'}}><button onClick={()=>{ handleEdit(detailRow); }} style={{background:'#ffcc00',border:'none',padding:'12px',borderRadius:'12px',fontWeight:900,fontSize:'12px',cursor:'pointer'}}>✏️ EDIT</button><button onClick={()=>handleDelete(detailRow)} style={{background:'#fee2e2',color:'#dc2626',border:'1px solid #fecaca',padding:'12px',borderRadius:'12px',fontWeight:900,fontSize:'12px',cursor:'pointer'}}>🗑 DELETE</button></div><button onClick={()=>setDetailRow(null)} style={{background:'#0a1931',color:'#ffcc00',border:'none',padding:'12px',borderRadius:'12px',fontWeight:900,fontSize:'12px',cursor:'pointer',marginTop:'4px'}}>← CLOSE</button></div></div></div><style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style></div>)}
    </div>
  )
}

// ========= REUSABLE DROPDOWN COMPONENT =========
const Dropdown = ({ title, children, color="#0a1931" }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{background:'#fff', borderRadius:'12px', marginBottom:'12px', border:`2px solid ${color}`, overflow:'hidden'}}>
      <div onClick={()=>setOpen(!open)} style={{padding:'14px 18px', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', background: open ? color : '#fff', color: open ? '#ffcc00' : color, fontWeight:900, fontSize:'15px'}}>
        <span>{title}</span><span style={{fontSize:'20px'}}>{open ? '−' : '+'}</span>
      </div>
      {open && <div style={{padding:'16px 18px', fontSize:'16px', lineHeight:'1.8', color:'#333', background:'#f8fafc', borderTop:'1px solid #eee'}}>{children}</div>}
    </div>
  )
}

// ========= MAIN SITE =========
const Navbar = () => {
  const [open, setOpen] = useState(false);
  const scrollTo = (id) => { setOpen(false); const el = document.getElementById(id); if (el) { const offset = 75; const top = el.getBoundingClientRect().top + window.scrollY - offset; window.scrollTo({ top, behavior: 'smooth' }); } };
  return (
    <nav className="nav"><div className="nav-top"><span className="logo">PINNACLE SECURITY LTD</span><span className="menu-btn" onClick={() => setOpen(!open)}>{open ? '✕' : '☰'}</span></div>
      <div className={`links ${open ? 'show' : ''}`}><a onClick={() => scrollTo('home')}>Home</a><a onClick={() => scrollTo('about')}>About</a><a onClick={() => scrollTo('services')}>Services</a><a onClick={() => scrollTo('mission')}>Mission</a><a onClick={() => scrollTo('jobs')}>Jobs</a><a onClick={() => scrollTo('aptitude')}>Aptitude Test</a><a onClick={() => scrollTo('contact')}>Contact</a><a onClick={() => scrollTo('join')} className="btn-yellow">Apply Now</a><a href="/admin" style={{color:'#ffcc00', fontWeight:'900', border:'1px solid #ffcc00', borderRadius:'20px'}}>🛡️ Admin</a></div>
    </nav>
  )
}

const Home = () => {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI(p => (p + 1) % 3), 3500); return () => clearInterval(t) }, []);
  const slides = [{ t: "Pinnacle Security Limited", d: "Plot 442 & 443 Masionatess, Muyenga - Licensed Security Company with 60+ Sites, 150+ Officers, 24/7 Control Room" },{ t: "WE ARE RECRUITING - JOIN US TODAY", d: "SITE INCHARGE: UCE + 3yrs | SUPERVISOR: UACE + Rider Permit + 3yrs | SECURITY OFFICER: P7 & above | No Fees" },{ t: "Your Safety is Our Priority - 0776971970", d: "hr@pinnaclegroup.co.ug | Free Training | Uniform Provided | Medical Insurance | Licensed by Uganda Police" },];
  return (
    <div className="section" style={{paddingTop:'30px'}}>
      <div className="hero"><h1>{slides[i].t}</h1><p>{slides[i].d}</p><div className="dots">{[0, 1, 2].map(n => <span key={n} className={n === i ? 'dot on' : 'dot'} onClick={() => setI(n)}></span>)}</div>
        <div style={{display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap', marginTop:'12px'}}><a onClick={() => document.getElementById('join').scrollIntoView({behavior:'smooth'})} className="btn-yellow big" style={{cursor:'pointer'}}>Apply Now</a><a onClick={() => document.getElementById('aptitude').scrollIntoView({behavior:'smooth'})} className="btn-yellow big" style={{background:'#fff !important', cursor:'pointer'}}>Aptitude Test</a></div>
      </div>
      <div style={{marginTop:'22px'}}>
        <div className="home-grid-3">
          <div className="card"><h3>Who We Are - Licensed & Trusted</h3><p>Pinnacle Security Ltd is a fully licensed private security company at <b>Plot 442 & 443 Massionatees, Muyenga Hill</b>. Since 2018, we have grown to 60+ sites and 150+ trained officers. We are registered with Ministry of Internal Affairs and Uganda Police Force. We serve homes, construction sites, banks, schools, factories, and NGOs across Kampala, Entebbe, Wakiso, Mukono.</p><p style={{marginTop:'10px'}}><b>Why Choose Us:</b> 24/7 Control Room, 10-min rapid response, armed/unarmed guards, CCTV, GPS tracking, disciplined officers.</p></div>
          <div className="card gold"><h3>Core Services Explained</h3><p><b>✔ Guard Service:</b> Day/night guards for homes, shops, offices — armed with batons, radios, uniforms.</p><p><b>✔ Construction Security:</b> We protect cement, iron bars, timber, fuel — we stop theft at sites.</p><p><b>✔ CCTV:</b> Hikvision/Dahua cameras + phone viewing + 1yr warranty.</p><p><b>✔ Mobile Patrol:</b> Patrol car visits your site 3x night, checks guards.</p><p><b>✔ Event & Alarm:</b> For weddings, concerts, shops — alarms call your phone.</p></div>
          <div className="card dark"><h3>🔥 URGENT RECRUITMENT - No Fees!</h3><p><b>SITE INCHARGE:</b> UCE Certificate + 3yrs experience as supervisor in security. Must know how to write OB, manage 5-10 guards, handle client.</p><p style={{marginTop:'10px'}}><b>SUPERVISOR:</b> UACE + Valid Rider Permit (Class A) + 3yrs. Must ride motorcycle, visit 5-8 sites daily.</p><p style={{marginTop:'10px'}}><b>SECURITY OFFICER:</b> P7-UACE, 18-45yrs, no criminal record, physically fit.</p><a onClick={() => document.getElementById('join').scrollIntoView({behavior:'smooth'})} className="btn-yellow big" style={{marginTop:'18px', width:'100%', textAlign:'center', display:'block', cursor:'pointer'}}>Apply Now — Free Training</a></div>
        </div>
      </div>
    </div>
  )
}

const About = () => {
  const [active, setActive] = useState(null);
  return (
    <div className="section">
      <h2>About Pinnacle Security Ltd - Detailed</h2>
      <div className="about-hero"><h3>Pinnacle Security Ltd - Protecting What Matters Most Since 2018</h3><p>Located at Plot 442 & 443 Massionatees, Muyenga Hill, Kampala | Control Room 24/7: 0776971970 | Email: hr@pinnaclegroup.co.ug</p></div>

      <div className="home-grid-3">
        <div className="card"><h3>📜 Our History & Growth</h3><p>Pinnacle Security Ltd started in 2018 with 5 guards and 1 client in Muyenga. Founder saw theft at construction sites. Today we have 150+ officers, 60+ sites, patrol cars, CCTV team, alarm team. We are licensed by Uganda Police Private Security Unit, Interpol checked, ISO procedures. Our clients: DFCU Bank, Roofings, multiple schools in Kampala, factories in Namanve, homes in Muyenga, Munyonyo, Buziga.</p></div>
        <div className="card gold"><h3>🏆 Why Clients Trust Us</h3><p>1. <b>24/7 Control Room in Entebbe</b> — monitors guards via phone, GPS.</p><p>2. <b>10-Minute Response</b> — patrol car + supervisor comes when alarm.</p><p>3. <b>No Theft Tolerance</b> — if guard sleeps or steals, we replace immediately + compensate client.</p><p>4. <b>Trained Officers</b> — 2 weeks training at Muyenga HQ: parade, customer care, OB writing, first aid, fire.</p><p>5. <b>Affordable</b> — guard from 600k/month, CCTV from 1.2M, patrol included.</p></div>
        <div className="card dark"><h3>📊 Our Numbers & Coverage</h3><p>✔ 150+ Active Officers<br/>✔ 60+ Protected Sites<br/>✔ 15 Motorcycles + 3 Patrol Cars<br/>✔ 24/7 Control Room — Entebbe<br/>✔ 4 Years Without Major Incident<br/>✔ Licensed: Police PSU, Ministry Internal Affairs<br/>✔ Coverage: Kampala, Wakiso, Entebbe, Mukono, Mpigi</p></div>
      </div>

      <h3 style={{margin:'20px 0 12px', fontWeight:900}}>🔽 Click to Learn More About Us (Dropdowns)</h3>
      <Dropdown title="1. Our Recruitment & Training Process - Full Details" color="#0a1931">
        <p><b>Step 1: Apply Online:</b> Fill form on website — name, phone, education, position, district. No fee. Anyone asking fee is fraudster — report to 0776971970.</p>
        <p><b>Step 2: Shortlist:</b> HR calls within 3 days, checks UCE/UACE, checks rider permit for supervisors, checks experience.</p>
        <p><b>Step 3: Interview at Muyenga HQ:</b> Come with original UCE/UACE, National ID, LC1 letter, 2 passport photos. Physical test: run, pushups.</p>
        <p><b>Step 4: 2 Weeks Free Training:</b> At Plot 442 Muyenga. You learn: Parade, Swahili commands, customer care, how to write Occurrence Book (OB), how to use radio, how to handle theft, first aid, fire extinguisher, human rights. Accommodation free for upcountry.</p>
        <p><b>Step 5: Deployment:</b> Posted to site near your home if possible. Given uniform (2 pairs), boots, beret, whistle, baton, ID. Salary starts after 1st month: Officer 350k-450k, Supervisor 600k-800k, Site Incharge 800k-1.2M + motorcycle fuel.</p>
      </Dropdown>
      <Dropdown title="2. Our Management Team & Discipline" color="#1a3a6a">
        <p><b>Operations Manager:</b> Ex-UPDF Captain — 15yrs security. Visits sites weekly, checks guards.</p>
        <p><b>HR Manager:</b> Handles recruitment, no fees, no tribalism. Every Ugandan welcome.</p>
        <p><b>Control Room Commander:</b> In Entebbe, monitors all sites via phone calls every 2 hours, GPS.</p>
        <p><b>Discipline:</b> Guard who sleeps, drinks, steals — immediate interdiction + police case. Guard who is disciplined, smart, customer-friendly — promoted to Supervisor in 6 months. We have 20 supervisors promoted from guards.</p>
      </Dropdown>
      <Dropdown title="3. Licensed & Legal - Documents" color="#0a1931">
        <p>We are fully licensed:</p>
        <p>• Private Security License: <b>MoIA/PSU/2018/442</b></p>
        <p>• URSB Registered: <b>80020001234567</b></p>
        <p>• TIN: <b>1000123456</b></p>
        <p>• NSSF & URA Compliant</p>
        <p>• Officers have Interpol clearance, no criminal record</p>
        <p>• Insurance: All guards insured with UAP Old Mutual for injury</p>
      </Dropdown>
    </div>
  )
}

const Services = () => {
  return (
    <div className="section">
      <h2>Our Security Services - Full Explanation</h2>
      <p style={{textAlign:'center', marginBottom:'18px', fontSize:'18px'}}>We offer 6 main services. Each service includes guard, equipment, supervision, and 24/7 control room support. Click dropdown to see details, price, and what you get.</p>
      
      <Dropdown title="1. Security Guard Service - Armed & Unarmed (Most Popular)" color="#0a1931">
        <p><b>What you get:</b> 1-4 guards per shift (day/night), uniformed, baton, whistle, radio, torch, OB book. Supervisor visits 2x daily, patrol car 1x night.</p>
        <p><b>Best for:</b> Homes, shops, arcades, offices, schools, pharmacies, factories, warehouses.</p>
        <p><b>How we work:</b> Guard reports at 6am/pm, writes OB, checks visitors, prevents theft, calls control room every 2hrs. If problem, patrol comes in 10 mins.</p>
        <p><b>Price:</b> Unarmed guard from 600,000 UGX/month, Armed (with company gun + police license) from 900,000 UGX/month. No hidden fees.</p>
        <p><b>Includes:</b> Free replacement if guard sick, free training, free supervisor.</p>
      </Dropdown>
      <Dropdown title="2. Construction Site Security - Stop Theft of Cement, Iron Bars" color="#7a0a0a">
        <p><b>Problem we solve:</b> In Uganda, 30% of construction material is stolen by workers at night. We stop it.</p>
        <p><b>What you get:</b> 2-3 guards trained for construction: they check workers bags, count cement bags, count iron bars, check timber, record lorries in/out, prevent workers from selling materials. They write daily stock report.</p>
        <p><b>Special:</b> Guards have experience at Roofings, Namanve factories. They know how fundis steal.</p>
        <p><b>Price:</b> From 650,000 UGX per guard/month. For big site (10M+ materials), we recommend 3 guards (day + 2 night).</p>
        <p><b>Bonus:</b> Free CCTV advice, free alarm for store.</p>
      </Dropdown>
      <Dropdown title="3. CCTV Installation - Hikvision, Dahua - Watch on Phone" color="#0a1931">
        <p><b>What you get:</b> 4-8 cameras HD, DVR 1TB (stores 30 days), cables, installation, phone app setup, training, 1 year warranty.</p>
        <p><b>Features:</b> See home/shop from anywhere on phone, night vision, motion alert (phone beeps if thief enters), playback, share with family.</p>
        <p><b>Best for:</b> Homes, shops, supermarkets, schools, rentals.</p>
        <p><b>Price:</b> 4 cameras full set 1,200,000 UGX, 8 cameras 2,100,000 UGX. No monthly fee (unless you want cloud).</p>
        <p><b>Why us:</b> We also give guard + CCTV combo discount — guard checks camera, camera records guard.</p>
      </Dropdown>
      <Dropdown title="4. Mobile Patrol & Rapid Response - 10 Min Response" color="#1a3a6a">
        <p><b>What you get:</b> Patrol car with 2 armed guards visits your site 3 times per night (10pm, 1am, 4am), checks guard is awake, checks doors, signs OB, takes photo. If alarm rings, car comes in 10 mins.</p>
        <p><b>Best for:</b> Clients who have own guard but want supervision, or homes without guard but want car to pass.</p>
        <p><b>Price:</b> Patrol only 250,000 UGX/month for homes, 400,000 UGX/month for businesses.</p>
        <p><b>Includes:</b> Free alarm response, free guard check, WhatsApp report with photos nightly.</p>
      </Dropdown>
      <Dropdown title="5. Event Security - Weddings, Concerts, Conferences" color="#0a1931">
        <p><b>What you get:</b> 5-50 guards for event: bouncers at gate, parking control, VIP protection, crowd control, bag check.</p>
        <p><b>Experience:</b> We secured 200+ events: weddings in Muyenga, concerts at Serena, church conferences, political rallies.</p>
        <p><b>Price:</b> From 40,000 UGX per guard per day (12hrs).</p>
        <p><b>Includes:</b> Free radio, free supervisor, free first aid kit.</p>
      </Dropdown>
      <Dropdown title="6. Alarm Systems - Intruder Alarm Calls Your Phone" color="#7a0a0a">
        <p><b>What you get:</b> Motion sensors + door sensor + loud siren + control panel + phone dialer (calls 3 numbers when thief enters).</p>
        <p><b>Best for:</b> Shops, homes, offices, stores.</p>
        <p><b>Price:</b> From 650,000 UGX installed, no monthly fee.</p>
        <p><b>Combo:</b> Alarm + Patrol + Guard = full security. Thief enters → alarm rings → calls you + control room → patrol car comes in 10 mins + guard catches.</p>
      </Dropdown>

      <div className="card dark" style={{marginTop:'20px'}}><h3>💡 Not Sure Which Service? Contact Us for Free Survey</h3><p>We come to your site FREE in Kampala/Wakiso/Entebbe, check risk, advise best service, give written quote. Call Control 24/7: 0776971970 or fill Contact Form. We respond in 2 hours.</p></div>
    </div>
  )
}

const MissionPage = () => {
  return (
    <div className="section">
      <h2>Our Mission, Vision, Values & Objectives - Detailed</h2>
      <div className="mission-grid">
        <div className="mission-card"><h3>🎯 Our Mission - Detailed</h3><p>To provide professional, affordable, and disciplined security solutions that protect lives, property, and construction materials in Uganda. We do this through 24/7 control room, trained guards, mobile patrol, CCTV, and rapid response. Our mission is zero theft, zero tolerance to sleeping guards, 100% client satisfaction. Every day we ask: Is client safe? Is guard disciplined? Is site secure?</p></div>
        <div className="mission-card gold"><h3>👁️ Our Vision - 2030</h3><p>To be Uganda's most trusted and disciplined private security company by 2030, with 500+ officers, 200+ sites, own training school, patrol cars in all districts, and own CCTV assembly. We want every home in Muyenga, every construction site in Namanve, every shop in Kikuubo to say: Pinnacle is best. We want to promote 100 guards to supervisors, create jobs for youth, and reduce theft in Uganda.</p></div>
        <div className="mission-card dark"><h3>🛡️ Core Values - DISCIPLINE Explained</h3><div className="values-list"><div><b>D - Discipline:</b> Guard must be smart, shaved, uniform ironed, boots polished, on time. No alcohol on duty.</div><div><b>I - Integrity:</b> Never steal, never lie in OB, never ask client for money. We fire thieves immediately.</div><div><b>S - Service:</b> Client is boss. Greet, help, protect. Smile, open gate, carry bag for mama.</div><div><b>C - Courage:</b> Confront thief, not run. Call control room, blow whistle, protect client property even at risk.</div><div><b>P - Professionalism:</b> Write good OB, use radio well, know emergency numbers, first aid.</div></div></div>
      </div>

      <h3 style={{margin:'22px 0 12px', fontWeight:900}}>🔽 Our Objectives & Commitments (Dropdowns)</h3>
      <Dropdown title="1. Our 5 Main Objectives - What We Want to Achieve" color="#0a1931">
        <p>1. <b>Zero Theft:</b> Ensure no cement, iron bar, phone, money stolen at sites we protect. If theft happens due to our guard, we investigate and compensate.</p>
        <p>2. <b>100% Discipline:</b> No guard sleeps, drinks, or is rude. All guards parade weekly at Muyenga.</p>
        <p>3. <b>10-Minute Response:</b> Patrol car reaches any site in Kampala/Wakiso/Entebbe within 10 mins after call.</p>
        <p>4. <b>Promote Youth:</b> Every 6 months, promote best 5 guards to supervisors. Provide rider permit training.</p>
        <p>5. <b>Affordable Security:</b> Keep guard price at 600k so even small shop can afford. No exploitation.</p>
      </Dropdown>
      <Dropdown title="2. Our Commitment to Clients" color="#1a3a6a">
        <p>• <b>Replacement Guarantee:</b> If guard sick or misbehaves, we replace in 2 hours.</p>
        <p>• <b>Weekly Report:</b> Supervisor sends weekly OB summary + incidents via WhatsApp.</p>
        <p>• <b>No Hidden Fees:</b> Price you agree is final. No extra for uniform, boots, training.</p>
        <p>• <b>24/7 Control:</b> You can call 0776971970 anytime, even 3am, control answers.</p>
        <p>• <b>Insurance:</b> If our guard injures thief, we handle police. If guard injured on duty, UAP insurance pays.</p>
      </Dropdown>
      <Dropdown title="3. Our Commitment to Guards/Employees" color="#0a1931">
        <p>• <b>No Recruitment Fees:</b> We never charge. Anyone asking fee is conman. Report.</p>
        <p>• <b>Free Training & Uniform:</b> 2 weeks training free, 2 uniforms free, boots free.</p>
        <p>• <b>Timely Salary:</b> Salary paid by 5th of month via MTN MoMo or bank. No delays.</p>
        <p>• <b>Promotion:</b> Guard → Supervisor → Site Incharge → Operations. 20 guards promoted last year.</p>
        <p>• <b>Respect:</b> No abuse, no tribalism. All tribes, religions welcome. We have Acholi, Muganda, Munyankole, etc.</p>
      </Dropdown>
    </div>
  )
}

const Blog = () => {
  const [openJob, setOpenJob] = useState(null);
  return (
    <div className="section">
      <div className="memo-clean">
        <div className="memo-head"><h2>INTERNAL MEMO - PINNACLE SECURITY LTD - FULL DETAILS</h2><p><b>From:</b> HR Manager | <b>To:</b> All Applicants & Public | <b>Date:</b> {new Date().toLocaleDateString()} | <b>Ref:</b> PSL/HR/2026/08 | <b>Location:</b> Plot 442 & 443 Massionatees, Muyenga</p><p><b>Subject: URGENT RECRUITMENT - SITE INCHARGE, SUPERVISOR, SECURITY OFFICER - NO FEES, FREE TRAINING</b></p></div>
        <div className="memo-body-dark">
          <div className="memo-intro">Management has approved urgent recruitment of 30 officers due to new sites in Muyenga, Buziga, Namanve, Entebbe Road. We need disciplined Ugandans. <b>No Fees. Training 2 weeks at Muyenga HQ free. Uniform free. Accommodation free for upcountry. Salary starts immediately after deployment. Interview daily at 8am at Muyenga HQ.</b></div>

          <Dropdown title="POSITION 1: SITE INCHARGE - 5 Posts - UCE + 3yrs - 800k-1.2M" color="#ffcc00">
            <div style={{color:'#0a1931'}}>
              <p><b>Salary:</b> 800,000 - 1,200,000 UGX + Motorcycle + Fuel 150k/month + Airtime</p>
              <p><b>Requirements (Must Have All):</b></p>
              <p>• UCE Certificate with at least 4 passes including English</p>
              <p>• 3+ Years as Supervisor or Site Incharge in a licensed security company (Saracen, G4S, KK, etc)</p>
              <p>• Can write good English OB, incident report</p>
              <p>• Can manage 5-15 guards, make duty roster, handle client complaints</p>
              <p>• Must have National ID, LC1 letter, 2 referees</p>
              <p>• Age 25-45, no criminal record, disciplined</p>
              <p>• Must live near Muyenga or willing to relocate</p>
              <p><b>Duties:</b> Visit 3-5 sites daily, check guards, write OB, train guards, handle theft cases, report to Ops Manager daily via WhatsApp, attend client meetings.</p>
              <p><b>How to be promoted:</b> If you perform well for 6 months, promoted to Operations Supervisor with salary 1.5M.</p>
            </div>
          </Dropdown>

          <Dropdown title="POSITION 2: SUPERVISOR - 10 Posts - UACE + Rider Permit + 3yrs - 600k-800k" color="#0a1931">
            <div style={{color:'#fff'}}>
              <p><b>Salary:</b> 600,000 - 800,000 UGX + Motorcycle provided + Fuel + Airtime</p>
              <p><b>Requirements:</b></p>
              <p>• UACE Certificate (S6) with at least 2 principal passes</p>
              <p>• Valid Rider Permit Class A (must have, not learner)</p>
              <p>• 3+ Years as security guard or supervisor</p>
              <p>• Can ride motorcycle well, know Kampala roads</p>
              <p>• Can read/write English, use smartphone, WhatsApp, GPS</p>
              <p>• Age 23-40, physically fit, no criminal record</p>
              <p><b>Duties:</b> Ride to 5-8 sites per day, check if guard is awake, smart, OB written, take photo, send report to control room, handle small client issues, replace guard if sick, patrol at night.</p>
              <p><b>Promotion:</b> Best supervisors become Site Incharge in 6-12 months.</p>
            </div>
          </Dropdown>

          <Dropdown title="POSITION 3: SECURITY OFFICER / GUARD - 50 Posts - P7 & Above - 350k-450k" color="#0a1931">
            <div style={{color:'#fff'}}>
              <p><b>Salary:</b> 350,000 - 450,000 UGX (Day 350k, Night 400k, Both 450k) + NSSF + Insurance</p>
              <p><b>Requirements:</b></p>
              <p>• P7, UCE, UACE, Diploma, Degree — all accepted, but must read/write English</p>
              <p>• Age 18-45, physically fit, can stand 12hrs, no disability that prevents guarding</p>
              <p>• No criminal record, no theft history, Interpol cleared (we check)</p>
              <p>• Must have National ID, LC1 letter, 2 passport photos, next of kin ID</p>
              <p>• Must be disciplined, no alcohol on duty, no smoking on duty</p>
              <p>• Must live near site or willing to stay at site (for construction sites we provide shelter)</p>
              <p><b>Benefits:</b> Free 2-week training, 2 uniforms, boots, beret, whistle, baton, ID, free replacement if torn, salary via MoMo by 5th, free medical for injury, promotion to supervisor after 6 months if disciplined.</p>
              <p><b>Duties:</b> Guard property, check visitors, write OB, prevent theft, call control room every 2hrs, handle small issues, report theft immediately.</p>
            </div>
          </Dropdown>

          <div className="general-box"><h3>GENERAL INFORMATION - ALL APPLICANTS MUST READ</h3>
            <Dropdown title="What is NOT Allowed - No Fees, No Bribes" color="#c00">
              <div style={{color:'#0a1931', textAlign:'left'}}>
                <p>• Pinnacle Security Ltd NEVER charges recruitment fees. If anyone asks you for money for job, uniform, training — that person is a thief, not our staff. Report to HR: 0776971970 or hr@pinnaclegroup.co.ug</p>
                <p>• We never ask for your ATM card, MoMo pin, or bank details.</p>
                <p>• Interview is at Plot 442 Muyenga only, not in a cafe or park.</p>
                <p>• We don't recruit via WhatsApp groups charging money.</p>
              </div>
            </Dropdown>
            <Dropdown title="Application Process Step-by-Step" color="#0a1931">
              <div style={{color:'#0a1931', textAlign:'left'}}>
                <p>1. Fill online form on this website (Apply Now) — takes 2 mins.</p>
                <p>2. Take Aptitude Test (link in menu) — 20 mins online, tests English, maths, discipline.</p>
                <p>3. Wait for HR call within 3 days.</p>
                <p>4. Come for interview at Muyenga HQ 8am with original documents.</p>
                <p>5. If passed, start 2 weeks training next Monday.</p>
                <p>6. Deployment to site.</p>
              </div>
            </Dropdown>
            <Dropdown title="Frequently Asked Questions (FAQ)" color="#0a1931">
              <div style={{color:'#0a1931', textAlign:'left'}}>
                <p><b>Q: Do you provide accommodation?</b> A: For training, yes free for upcountry. For deployment, construction sites have shelter, homes have guard room.</p>
                <p><b>Q: Can women apply?</b> A: Yes! We have 30 female guards for schools, homes, offices. Women can be Site Incharge too.</p>
                <p><b>Q: Can I choose site?</b> A: We try to post you near home, but if no site near, you go where needed.</p>
                <p><b>Q: Salary paid when?</b> A: By 5th of next month via MoMo or Centenary Bank.</p>
                <p><b>Q: What if guard is sick?</b> A: Call control room, we bring replacement in 2hrs.</p>
                <p><b>Q: Do you need S4 only?</b> A: No, P7 to Degree all welcome for guard, but Site Incharge needs UCE, Supervisor needs UACE.</p>
              </div>
            </Dropdown>
            <a onClick={() => document.getElementById('join').scrollIntoView({behavior:'smooth'})} className="big-recruit-btn" style={{cursor:'pointer', marginTop:'16px'}}>APPLY NOW - FREE</a>
          </div>
        </div>
      </div>
    </div>
  )
}

const Aptitude = () => (
  <div className="section">
    <h2>Online Aptitude Test - Must for All Applicants</h2>
    <p style={{textAlign:'center', marginBottom:'16px'}}>We test English, basic maths, discipline, customer care. Takes 20 mins. Pass mark 50%. You can retake after 7 days if fail.</p>
    <div className="home-grid-3">
      <div className="card"><h3>Step 1: Register for Test</h3><p>Click Register, fill name, phone, position you want. You get code via SMS.</p><p><b>What you need:</b> Smartphone or computer, internet, quiet place, 20 mins.</p><a href={GOOGLE_APTITUDE_REGISTER} target="_blank" rel="noopener noreferrer" className="btn-yellow big" style={{marginTop:'18px', width:'100%', textAlign:'center', display:'block'}}>Register for Test ↗</a></div>
      <div className="card gold"><h3>Step 2: Take Test Online</h3><p>Click Start Test, enter code, answer 30 questions: English (10), Maths (5), Security (10), Discipline (5). Time 20 mins.</p><p><b>Tips:</b> Read OB sample, know Swahili commands (Halt, etc), know emergency numbers.</p><a href={KOBO_APTITUDE_TEST} target="_blank" rel="noopener noreferrer" className="btn-yellow big" style={{marginTop:'18px', width:'100%', textAlign:'center', display:'block', background:'#0a1931 !important', color:'#ffcc00 !important'}}>Start Test Now</a></div>
      <div className="card dark"><h3>Important Notes & Help</h3><p>✔ All applicants must take test — guard, supervisor, incharge.</p><p>✔ No cheating — we track.</p><p>✔ If you fail, you can retake after 7 days.</p><p>✔ Test result sent to HR automatically.</p><p>✔ If no internet, come to Muyenga HQ, we give tablet to test.</p><p style={{marginTop:'12px'}}><b>Need help?</b> Call HR: 0776971970</p></div>
    </div>
    <Dropdown title="Sample Questions - What Will Be Asked?" color="#0a1931">
      <p>1. What do you write in OB when thief tries to steal cement? (Answer: Date, time, name, what stolen, action taken, signature)</p>
      <p>2. If client shouts at you, what do you do? (Answer: Stay calm, listen, apologize, call supervisor)</p>
      <p>3. 2 guards + 3 guards = ? (Answer: 5)</p>
      <p>4. Swahili for 'Stop' is? (Answer: Simama)</p>
      <p>5. If you see fire at site, first do? (Answer: Blow whistle, call control, try extinguish if small, evacuate)</p>
    </Dropdown>
  </div>
)

const Contact = () => {
  const [f, setF] = useState({ fullName: "", email: "", phone: "", service: "", message: "" });
  const [s, setS] = useState("");
  const send = async (e) => {
    e.preventDefault(); setS("Submitting..."); const ts = getFullDateTime24();
    const payload = { type: 'contact', FullName: f.fullName, fullName: f.fullName, Phone: f.phone, phone: f.phone, Email: f.email, email: f.email, Service: f.service, service: f.service, Messages: f.message, message: f.message, Message: f.message, Timestamp: ts, timestamp: ts };
    try { await fetch(GOOGLE_SHEET_WEBHOOK, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(payload) }); setS("✅ Thank you! Message received. We will call you in 2 hours."); setF({ fullName: "", email: "", phone: "", service: "", message: "" }); } catch { setS("✅ Thank you!"); }
  };
  return (
    <div className="section"><h2>Contact Us - Free Site Survey</h2>
      <div className="form-2col"><div className="form-left-info">
        <div className="card"><h3>📍 Visit Us - Muyenga HQ</h3><p><b>Address:</b> Plot 442 & 443 Massionatees, Muyenga Hill, Kampala — Near Kabalagala, opposite Muyenga Club.</p><p><b>Control Room 24/7:</b> 0776971970 (Call/WhatsApp anytime)</p><p><b>HR/Recruitment:</b> hr@pinnaclegroup.co.ug | 0776971970</p><p><b>Operations:</b> ops@pinnaclegroup.co.ug</p><p><b>Hours:</b> Mon-Sat 8am-6pm, Control 24/7</p></div>
        <div className="card gold"><h3>Why Contact Us?</h3><p>• Free site survey in Kampala/Wakiso/Entebbe</p><p>• Free written quote in 2 hours</p><p>• Free security advice — which guard, CCTV, alarm best for you</p><p>• We come same day if urgent theft case</p></div>
      </div>
        <form className="form-big" onSubmit={send}>
          <div className="two-col"><input value={f.fullName} onChange={e => setF({ ...f, fullName: e.target.value })} required placeholder="Fullname" /><input value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} required placeholder="Phone" /></div>
          <div className="two-col"><input type="email" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} required placeholder="Email" /><select value={f.service} onChange={e => setF({ ...f, service: e.target.value })} required><option value="">Choose Service</option><option>Security Guard Service</option><option>Construction Security</option><option>CCTV Installation</option><option>Mobile Patrol</option><option>Event Security</option><option>Alarm System</option><option>Need Job</option></select></div>
          <textarea rows="5" value={f.message} onChange={e => setF({ ...f, message: e.target.value })} required placeholder="Message - e.g., I need 2 guards for construction site in Namanve, materials worth 50M"></textarea>
          <button className="big-btn">Submit - We Reply in 2 Hours</button>{s && <p className="msg">{s}</p>}
        </form>
      </div>
    </div>
  )
}

const Join = () => {
  const [f, setF] = useState({ fullName: "", phone: "", email: "", education: "", experience: "", interest: "", position: "SITE INCHARGE", district: "" });
  const [s, setS] = useState("");
  const send = async (e) => {
    e.preventDefault(); setS("Submitting..."); const ts = getFullDateTime24();
    const payload = { type: 'applicant', FullName: f.fullName, fullName: f.fullName, Phone: f.phone, phone: f.phone, Email: f.email, email: f.email, Education: f.education, education: f.education, Experience: f.experience, experience: f.experience, Interest: f.interest, interest: f.interest, Position: f.position, position: f.position, District: f.district, district: f.district, Timestamp: ts, timestamp: ts };
    try { await fetch(GOOGLE_SHEET_WEBHOOK, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(payload) }); setS("✅ Thank you! Application received. HR will call you in 3 days. Also take aptitude test."); setF({ fullName: "", phone: "", email: "", education: "", experience: "", interest: "", position: "SITE INCHARGE", district: "" }); } catch { setS("✅ Thank you!"); }
  };
  return (
    <div className="section"><h2>Apply Now - Applicant Form (No Fees)</h2><p style={{textAlign:'center', marginBottom:'12px'}}>Fill form, then take aptitude test. No fees. If anyone asks fee, report to 0776971970.</p>
      <form className="form-big" onSubmit={send}>
        <div className="two-col"><div><label>Full Name *</label><input value={f.fullName} onChange={e => setF({ ...f, fullName: e.target.value })} required placeholder="e.g., John Okello" /></div><div><label>Phone *</label><input value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} required placeholder="e.g., 0776971970" /></div></div>
        <div className="two-col"><div><label>Email *</label><input type="email" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} required placeholder="e.g., john@gmail.com" /></div><div><label>Education *</label><select value={f.education} onChange={e => setF({ ...f, education: e.target.value })} required><option value="">Choose Education</option><option>P7</option><option>UCE</option><option>UACE</option><option>Diploma</option><option>Degree</option></select></div></div>
        <div className="two-col"><div><label>Position *</label><select value={f.position} onChange={e => setF({ ...f, position: e.target.value })} required><option>SITE INCHARGE</option><option>SUPERVISOR</option><option>SECURITY OFFICER</option></select></div><div><label>District *</label><input value={f.district} onChange={e => setF({ ...f, district: e.target.value })} required placeholder="e.g., Kampala, Wakiso, Entebbe" /></div></div>
        <div className="two-col"><div><label>Why Interested? *</label><input value={f.interest} onChange={e => setF({ ...f, interest: e.target.value })} required placeholder="e.g., I want job, I have 3yrs experience" /></div><div><label>Experience *</label><input value={f.experience} onChange={e => setF({ ...f, experience: e.target.value })} required placeholder="e.g., 3yrs as guard at Saracen" /></div></div>
        <button className="big-btn">Submit Application - Free</button>{s && <p className="msg">{s}</p>}
        <p style={{fontSize:'14px', textAlign:'center', marginTop:'10px'}}>After submitting, <a href={KOBO_APTITUDE_TEST} target="_blank" style={{color:'#0a1931', fontWeight:900}}>Click here to take aptitude test</a></p>
      </form>
    </div>
  )
}

const Footer = () => {
  const scrollTo = (id) => { const el = document.getElementById(id); if (el) { const offset = 75; const top = el.getBoundingClientRect().top + window.scrollY - offset; window.scrollTo({ top, behavior: 'smooth' }); } };
  return (
    <div className="footer"><div className="footer-quick"><h4>Quick Links</h4><div className="footer-links"><a onClick={() => scrollTo('home')}>Home</a><a onClick={() => scrollTo('about')}>About</a><a onClick={() => scrollTo('services')}>Services</a><a onClick={() => scrollTo('mission')}>Mission</a><a onClick={() => scrollTo('jobs')}>Jobs</a><a onClick={() => scrollTo('aptitude')}>Aptitude Test</a><a onClick={() => scrollTo('contact')}>Contact</a><a onClick={() => scrollTo('join')}>Apply Now</a><a href="/admin" style={{background:'#ffcc00', color:'#0a1931'}}>🛡️ Admin</a></div></div><div className="footer-bottom">© 2026 Pinnacle Security Ltd | Plot 442 & 443 Massionatees, Muyenga | HR: hr@pinnaclegroup.co.ug | Control 24/7: 0776971970 | Licensed: MoIA/PSU/2018/442 | No Recruitment Fees</div></div>
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
  useEffect(() => { if (window.location.pathname === '/admin') setIsAdmin(true); }, []);
  if (isAdmin) return <AdminDashboard />;
  return <MainSite />;
}

export default App