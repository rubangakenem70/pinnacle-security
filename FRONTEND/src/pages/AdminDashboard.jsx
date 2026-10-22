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
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(30);
  const [selected, setSelected] = useState([]);
  const [detailRow, setDetailRow] = useState(null);

  // NEW - TABLE OPTIONS LIKE YOUR SCREENSHOT
  const [showOptions, setShowOptions] = useState(false);
  const [tableOptions, setTableOptions] = useState({
    gridlines: true,
    alternating: true,
    condensed: false,
    footer: false
  });
  const [tempOptions, setTempOptions] = useState(tableOptions);

  const openOptions = () => {
    setTempOptions(tableOptions);
    setShowOptions(true);
  }

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
  const applicants = data.filter(d => (d.type==='applicant') || getVal(d,['Position','position'])); const contacts = data.filter(d => (d.type==='contact') || getVal(d,['Service','service']));
  const applyFilters = (list) => list.filter(d=>{ const s = `${getVal(d,['FullName','fullName'])} ${getVal(d,['Phone','phone'])} ${getVal(d,['Email','email'])} ${getVal(d,['Service','service'])} ${getVal(d,['Messages','message'])} ${getVal(d,['Position','position'])} ${getVal(d,['District','district'])} ${getVal(d,['Education','education'])}`.toLowerCase(); if(search && !s.includes(search.toLowerCase())) return false; if(filters.service && getVal(d,['Service','service']).toLowerCase() !== filters.service.toLowerCase()) return false; if(filters.position && getVal(d,['Position','position']).toLowerCase() !== filters.position.toLowerCase()) return false; if(filters.district && getVal(d,['District','district']).toLowerCase() !== filters.district.toLowerCase()) return false; if(filters.education && getVal(d,['Education','education']).toLowerCase() !== filters.education.toLowerCase()) return false; if(filters.experience && getVal(d,['Experience','experience']).toLowerCase() !== filters.experience.toLowerCase()) return false; if(filters.interest && getVal(d,['Interest','interest']).toLowerCase() !== filters.interest.toLowerCase()) return false; const ts = new Date(getVal(d,['Timestamp','timestamp'])); if(filters.dateFrom && ts < new Date(filters.dateFrom)) return false; if(filters.dateTo && ts > new Date(filters.dateTo + 'T23:59:59')) return false; return true; });
  const filteredContacts = applyFilters(contacts); const filteredApplicants = applyFilters(applicants); const list = tab==='contacts'?filteredContacts:filteredApplicants; const totalPages = Math.ceil(list.length / rowsPerPage) || 1; const paginatedList = list.slice((currentPage-1)*rowsPerPage, currentPage*rowsPerPage); const allPageIds = paginatedList.map(r=>getVal(r,['Timestamp','timestamp'])); const isAllSelected = allPageIds.length>0 && allPageIds.every(id=>selected.includes(id)); const activeFilterCount = Object.values(filters).filter(v=>v).length;

  // TABLE STYLES BASED ON OPTIONS
  const rowPadding = tableOptions.condensed ? '8px 12px' : '14px 16px';
  const tableBorder = tableOptions.gridlines ? '1px solid #e5e7eb' : 'none';

  return (
    <div style={{background:'#f6f8fb',minHeight:'100vh',fontFamily:'Arial'}}>
      <div style={{background:'#0a1931',padding:'18px 24px',display:'flex',justifyContent:'space-between',alignItems:'center',position:'sticky',top:0,zIndex:100,flexWrap:'wrap',gap:'12px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px'}}><div style={{width:'38px',height:'38px',background:'#ffcc00',borderRadius:'10px',display:'grid',placeItems:'center',fontWeight:900}}>P</div><div><h1 style={{color:'#fff',fontWeight:900,fontSize:'14px'}}>PINNACLE SECURITY LTD</h1><p style={{color:'#ffcc00',fontSize:'10px'}}>ADMIN DASHBOARD</p></div></div>
        <div style={{display:'flex',gap:'8px',alignItems:'center',flexWrap:'wrap'}}>
          <div style={{background:'rgba(255,255,255,.08)',borderRadius:'24px',padding:'6px 14px'}}><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{background:'transparent',border:'none',outline:'none',color:'#fff',fontSize:'12px',width:'140px'}}/></div>
          <button onClick={()=>setShowFilters(!showFilters)} style={{background:activeFilterCount?'#ffcc00':'#fff',color:'#0a1931',border:'none',padding:'8px 14px',borderRadius:'20px',fontWeight:800,fontSize:'12px',cursor:'pointer'}}>{showFilters?`✕ Filters`:`⚙ Filters${activeFilterCount?` (${activeFilterCount})`:''}`}</button>
          <button onClick={openOptions} style={{background:'#fff',color:'#0a1931',border:'none',padding:'8px 14px',borderRadius:'20px',fontWeight:800,fontSize:'12px',cursor:'pointer'}}>⚙ Options</button>
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

        <div style={{background:'#fff',borderRadius:'20px',overflow:'hidden',boxShadow:'0 10px 30px rgba(0,0,0,.06)', border: tableOptions.gridlines ? '1px solid #e5e7eb' : 'none'}}>
          <div style={{padding:'16px 20px',display:'flex',justifyContent:'space-between',alignItems:'center',background:tab==='contacts'?'#0a1931':'#7a0a0a'}}><div style={{color:tab==='contacts'?'#ffcc00':'#fff',fontWeight:900,fontSize:'13px'}}>{tab==='contacts'?`📞 CONTACTS — ${list.length} / ${contacts.length}`:`📋 APPLICANTS — ${list.length} / ${applicants.length}`} • Click row to view →</div></div>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse: tableOptions.gridlines ? 'collapse' : 'separate', borderSpacing: tableOptions.gridlines ? 0 : 0, fontSize:'12px',minWidth:'1300px'}}>
              <thead><tr style={{background:'#f8f9fb',color:'#6b7280',textAlign:'left',fontSize:'10px',letterSpacing:'1px'}}>
                <th style={{padding:rowPadding, borderRight: tableBorder, borderBottom: tableBorder}}><input type="checkbox" checked={isAllSelected} onChange={()=>{ if(isAllSelected){ setSelected(prev=>prev.filter(id=>!allPageIds.includes(id))); } else { setSelected(prev=>[...new Set([...prev, ...allPageIds])]); } }} /></th>
                <th style={{padding:rowPadding, borderRight: tableBorder, borderBottom: tableBorder}}>DATE & TIME (24HRS)</th><th style={{padding:rowPadding, borderRight: tableBorder, borderBottom: tableBorder}}>FULL NAME</th><th style={{padding:rowPadding, borderRight: tableBorder, borderBottom: tableBorder}}>PHONE</th><th style={{padding:rowPadding, borderRight: tableBorder, borderBottom: tableBorder}}>EMAIL</th>
                {tab==='contacts'?<><th style={{padding:rowPadding, borderRight: tableBorder, borderBottom: tableBorder}}>SERVICE</th><th style={{padding:rowPadding, borderBottom: tableBorder}}>MESSAGE</th></>:<><th style={{padding:rowPadding, borderRight: tableBorder, borderBottom: tableBorder}}>POSITION</th><th style={{padding:rowPadding, borderRight: tableBorder, borderBottom: tableBorder}}>EDUCATION</th><th style={{padding:rowPadding, borderRight: tableBorder, borderBottom: tableBorder}}>DISTRICT</th><th style={{padding:rowPadding, borderRight: tableBorder, borderBottom: tableBorder}}>EXP</th><th style={{padding:rowPadding, borderBottom: tableBorder}}>INTEREST</th></>}
                <th style={{padding:rowPadding, borderLeft: tableBorder, borderBottom: tableBorder}}>ACTIONS</th>
              </tr></thead>
              <tbody>
                {paginatedList.length===0 ? <tr><td colSpan={12} style={{padding:'40px',textAlign:'center',color:'#999'}}>{loading?'Loading...':'No records'}</td></tr> : paginatedList.map((d,i)=>{ 
                  const ts=getVal(d,['Timestamp','timestamp']); const isEditing=editRow===ts; const checked=selected.includes(ts);
                  const altColor = tableOptions.alternating ? (i%2===0?'#fff':'#f8fafc') : '#fff';
                  return (
                  <tr key={i} onClick={()=>{ if(!isEditing) setDetailRow(d); }} style={{borderBottom: tableOptions.gridlines ? '1px solid #f1f1f1' : 'none', background:checked?'#fff9db': isEditing?'#eef2ff': detailRow && getVal(detailRow,['Timestamp','timestamp'])===ts ? '#fff3cd' : altColor, cursor:'pointer'}}>
                    <td style={{padding:rowPadding, borderRight: tableBorder}} onClick={e=>e.stopPropagation()}><input type="checkbox" checked={checked} onChange={()=>toggleSelect(ts)} /></td>
                    <td style={{padding:rowPadding, borderRight: tableBorder, color:'#0a1931',fontSize:'11px',fontWeight:800}}>{formatDate(ts)}</td>
                    <td style={{padding:rowPadding, borderRight: tableBorder, fontWeight:700}}>{isEditing?<input value={form.FullName||''} onChange={e=>setForm({...form,FullName:e.target.value})} style={{padding:'6px',borderRadius:'6px',border:'1px solid #ddd',width:'110px'}}/>:getVal(d,['FullName','fullName'])}</td>
                    <td style={{padding:rowPadding, borderRight: tableBorder}}>{isEditing?<input value={form.Phone||''} onChange={e=>setForm({...form,Phone:e.target.value})} style={{padding:'6px',borderRadius:'6px',border:'1px solid #ddd',width:'90px'}}/>:getVal(d,['Phone','phone'])}</td>
                    <td style={{padding:rowPadding, borderRight: tableBorder, color:'#4b5563'}}>{isEditing?<input value={form.Email||''} onChange={e=>setForm({...form,Email:e.target.value})} style={{padding:'6px',borderRadius:'6px',border:'1px solid #ddd',width:'130px'}}/>:getVal(d,['Email','email'])}</td>
                    {tab==='contacts'?<>
                      <td style={{padding:rowPadding, borderRight: tableBorder}}>{isEditing?<input value={form.Service||''} onChange={e=>setForm({...form,Service:e.target.value})} style={{padding:'4px',width:'90px'}}/>:<span style={{background:'#eef2ff',color:'#3730a3',padding:'4px 8px',borderRadius:'20px',fontSize:'11px',fontWeight:700}}>{getVal(d,['Service','service'])}</span>}</td>
                      <td style={{padding:rowPadding}}>{isEditing?<input value={form.Messages||''} onChange={e=>setForm({...form,Messages:e.target.value})} style={{padding:'6px',borderRadius:'6px',border:'1px solid #ddd',width:'160px'}}/>:getVal(d,['Messages','message'])}</td>
                    </>:<>
                      <td style={{padding:rowPadding, borderRight: tableBorder}}>{isEditing?<input value={form.Position||''} onChange={e=>setForm({...form,Position:e.target.value})} style={{padding:'4px',width:'90px'}}/>:<span style={{background:'#fef3c7',padding:'4px 8px',borderRadius:'20px',fontSize:'11px',fontWeight:700}}>{getVal(d,['Position','position'])}</span>}</td>
                      <td style={{padding:rowPadding, borderRight: tableBorder}}>{isEditing?<input value={form.Education||''} onChange={e=>setForm({...form,Education:e.target.value})} style={{padding:'4px',width:'60px'}}/>:getVal(d,['Education','education'])}</td>
                      <td style={{padding:rowPadding, borderRight: tableBorder}}>{isEditing?<input value={form.District||''} onChange={e=>setForm({...form,District:e.target.value})} style={{padding:'4px',width:'60px'}}/>:getVal(d,['District','district'])}</td>
                      <td style={{padding:rowPadding, borderRight: tableBorder}}>{isEditing?<input value={form.Experience||''} onChange={e=>setForm({...form,Experience:e.target.value})} style={{padding:'4px',width:'50px'}}/>:getVal(d,['Experience','experience'])}</td>
                      <td style={{padding:rowPadding}}>{isEditing?<input value={form.Interest||''} onChange={e=>setForm({...form,Interest:e.target.value})} style={{padding:'4px',width:'80px'}}/>:getVal(d,['Interest','interest'])}</td>
                    </>}
                    <td style={{padding:rowPadding, borderLeft: tableBorder}} onClick={e=>e.stopPropagation()}><div style={{display:'flex',gap:'6px'}}>{isEditing?<><button onClick={handleSave} style={{background:'#0a1931',color:'#ffcc00',border:'none',padding:'6px 12px',borderRadius:'8px',fontWeight:800,fontSize:'11px',cursor:'pointer'}}>SAVE</button><button onClick={()=>setEditRow(null)} style={{background:'#eee',border:'none',padding:'6px 10px',borderRadius:'8px',fontSize:'11px',cursor:'pointer'}}>CANCEL</button></>:<><button onClick={()=>handleEdit(d)} style={{background:'#ffcc00',border:'none',padding:'6px 12px',borderRadius:'8px',fontWeight:800,fontSize:'11px',cursor:'pointer'}}>EDIT</button><button onClick={()=>handleDelete(d)} style={{background:'#fee2e2',color:'#dc2626',border:'none',padding:'6px 10px',borderRadius:'8px',fontWeight:800,fontSize:'11px',cursor:'pointer'}}>DEL</button></>}</div></td>
                  </tr>
                )})}
              </tbody>
              {tableOptions.footer && (
                <tfoot><tr style={{background:'#f1f5f9', fontWeight:900, fontSize:'11px'}}><td colSpan={12} style={{padding:'12px 16px', borderTop:'2px solid #0a1931', textAlign:'center'}}>Total Records: {list.length} — Showing {paginatedList.length} on page {currentPage} of {totalPages} — {tab.toUpperCase()}</td></tr></tfoot>
              )}
            </table>
          </div>
          <div style={{padding:'16px 20px',display:'flex',justifyContent:'space-between',alignItems:'center',borderTop:'1px solid #eee',flexWrap:'wrap',gap:'12px'}}>
            <button disabled={currentPage===1} onClick={()=>setCurrentPage(p=>Math.max(1,p-1))} style={{background:currentPage===1?'#f3f4f6':'#fff',color:currentPage===1?'#aaa':'#0a1931',border:'1px solid #ddd',padding:'8px 16px',borderRadius:'10px',fontWeight:800,fontSize:'12px',cursor:'pointer'}}>◂ PREV</button>
            <div style={{display:'flex',alignItems:'center',gap:'10px',fontSize:'13px'}}><span>Page</span><input type="number" min={1} max={totalPages} value={currentPage} onChange={e=>setCurrentPage(Math.min(totalPages,Math.max(1,Number(e.target.value)||1)))} style={{width:'60px',padding:'8px',borderRadius:'10px',border:'1px solid #ddd',textAlign:'center',fontWeight:800}}/><span>of {totalPages}</span></div>
            <div style={{display:'flex',alignItems:'center',gap:'10px'}}><select value={rowsPerPage} onChange={e=>setRowsPerPage(Number(e.target.value))} style={{padding:'8px 12px',borderRadius:'10px',border:'1px solid #ddd',fontWeight:700,fontSize:'13px'}}><option value={10}>10 rows</option><option value={20}>20 rows</option><option value={30}>30 rows</option><option value={50}>50 rows</option><option value={100}>100 rows</option></select><button disabled={currentPage===totalPages} onClick={()=>setCurrentPage(p=>Math.min(totalPages,p+1))} style={{background:currentPage===totalPages?'#f3f4f6':'#0a1931',color:currentPage===totalPages?'#aaa':'#ffcc00',border:'1px solid #ddd',padding:'8px 16px',borderRadius:'10px',fontWeight:800,fontSize:'12px',cursor:'pointer'}}>NEXT ▸</button></div>
          </div>
        </div>
      </div>

      {/* OPTIONS MODAL - EXACTLY LIKE YOUR SCREENSHOT */}
      {showOptions && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.35)',backdropFilter:'blur(4px)',zIndex:10002,display:'flex',justifyContent:'center',alignItems:'center',padding:'20px'}}>
          <div style={{background:'#fff',borderRadius:'16px',width:'100%',maxWidth:'380px',boxShadow:'0 20px 60px rgba(0,0,0,0.2)',overflow:'hidden',fontFamily:'Arial'}}>
            <div style={{padding:'24px 24px 12px 24px'}}>
              <h3 style={{fontSize:'16px',fontWeight:400,color:'#202124',marginBottom:'20px'}}>Options</h3>
              <div style={{display:'grid',gap:'18px'}}>
                <label style={{display:'flex',alignItems:'center',gap:'12px',cursor:'pointer'}}>
                  <div onClick={()=>setTempOptions({...tempOptions, gridlines: !tempOptions.gridlines})} style={{width:'20px',height:'20px',borderRadius:'4px',border: tempOptions.gridlines ? '2px solid #1e8e3e' : '2px solid #5f6368',background: tempOptions.gridlines ? '#1e8e3e' : '#fff',display:'grid',placeItems:'center',color:'#fff',fontSize:'12px',fontWeight:900}}>{tempOptions.gridlines ? '✓' : ''}</div>
                  <span style={{fontSize:'14px',color:'#202124'}}>Show table gridlines</span>
                </label>
                <label style={{display:'flex',alignItems:'center',gap:'12px',cursor:'pointer'}}>
                  <div onClick={()=>setTempOptions({...tempOptions, alternating: !tempOptions.alternating})} style={{width:'20px',height:'20px',borderRadius:'4px',border: tempOptions.alternating ? '2px solid #1e8e3e' : '2px solid #5f6368',background: tempOptions.alternating ? '#1e8e3e' : '#fff',display:'grid',placeItems:'center',color:'#fff',fontSize:'12px',fontWeight:900}}>{tempOptions.alternating ? '✓' : ''}</div>
                  <span style={{fontSize:'14px',color:'#202124'}}>Show alternating colours</span>
                </label>
                <label style={{display:'flex',alignItems:'center',gap:'12px',cursor:'pointer', background: tempOptions.condensed ? '#e8f0fe' : 'transparent', padding:'6px', borderRadius:'20px', marginLeft:'-6px'}}>
                  <div onClick={()=>setTempOptions({...tempOptions, condensed: !tempOptions.condensed})} style={{width:'20px',height:'20px',borderRadius:'4px',border: tempOptions.condensed ? '2px solid #1e8e3e' : '2px solid #5f6368',background: tempOptions.condensed ? '#1e8e3e' : '#fff',display:'grid',placeItems:'center',color:'#fff',fontSize:'12px',fontWeight:900}}>{tempOptions.condensed ? '✓' : ''}</div>
                  <span style={{fontSize:'14px',color:'#202124'}}>Show condensed view</span>
                </label>
                <label style={{display:'flex',alignItems:'center',gap:'12px',cursor:'pointer'}}>
                  <div onClick={()=>setTempOptions({...tempOptions, footer: !tempOptions.footer})} style={{width:'20px',height:'20px',borderRadius:'4px',border: tempOptions.footer ? '2px solid #1e8e3e' : '2px solid #5f6368',background: tempOptions.footer ? '#1e8e3e' : '#fff',display:'grid',placeItems:'center',color:'#fff',fontSize:'12px',fontWeight:900}}>{tempOptions.footer ? '✓' : ''}</div>
                  <span style={{fontSize:'14px',color:'#202124'}}>Show table footer</span>
                </label>
              </div>
            </div>
            <div style={{display:'flex',justifyContent:'flex-end',gap:'12px',padding:'16px 24px 20px 24px'}}>
              <button onClick={()=>setShowOptions(false)} style={{background:'#fff',border:'1px solid #dadce0',color:'#1a73e8',padding:'10px 24px',borderRadius:'8px',fontWeight:500,fontSize:'14px',cursor:'pointer'}}>Cancel</button>
              <button onClick={()=>{ setTableOptions(tempOptions); setShowOptions(false); }} style={{background:'#1e8e3e',border:'none',color:'#fff',padding:'10px 24px',borderRadius:'8px',fontWeight:500,fontSize:'14px',cursor:'pointer'}}>Done</button>
            </div>
          </div>
        </div>
      )}

      {showAdd && (<div style={{position:'fixed',inset:0,background:'rgba(10,25,49,.7)',backdropFilter:'blur(8px)',zIndex:10000,display:'flex',justifyContent:'center',alignItems:'center',padding:'20px'}}><div style={{background:'#fff',padding:'24px',borderRadius:'20px',width:'92%',maxWidth:'520px'}}><h3 style={{fontWeight:900,fontSize:'14px'}}>Add New {tab.toUpperCase()}</h3><div style={{display:'grid',gap:'8px',marginTop:'14px'}}><input placeholder="FullName" value={form.FullName||''} onChange={e=>setForm({...form,FullName:e.target.value})} style={{padding:'12px',border:'1px solid #e5e7eb',borderRadius:'10px',fontSize:'13px'}}/><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}><input placeholder="Phone" value={form.Phone||''} onChange={e=>setForm({...form,Phone:e.target.value})} style={{padding:'12px',border:'1px solid #e5e7eb',borderRadius:'10px'}}/><input placeholder="Email" value={form.Email||''} onChange={e=>setForm({...form,Email:e.target.value})} style={{padding:'12px',border:'1px solid #e5e7eb',borderRadius:'10px'}}/></div>{tab==='contacts'?<><input placeholder="Service" value={form.Service||''} onChange={e=>setForm({...form,Service:e.target.value})} style={{padding:'12px',border:'1px solid #e5e7eb',borderRadius:'10px'}}/><textarea placeholder="Messages" value={form.Messages||''} onChange={e=>setForm({...form,Messages:e.target.value})} style={{padding:'12px',border:'1px solid #e5e7eb',borderRadius:'10px'}}/></>:<><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}><input placeholder="Position" value={form.Position||''} onChange={e=>setForm({...form,Position:e.target.value})} style={{padding:'12px',border:'1px solid #e5e7eb',borderRadius:'10px'}}/><input placeholder="Education" value={form.Education||''} onChange={e=>setForm({...form,Education:e.target.value})} style={{padding:'12px',border:'1px solid #e5e7eb',borderRadius:'10px'}}/></div><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}><input placeholder="District" value={form.District||''} onChange={e=>setForm({...form,District:e.target.value})} style={{padding:'12px',border:'1px solid #e5e7eb',borderRadius:'10px'}}/><input placeholder="Experience" value={form.Experience||''} onChange={e=>setForm({...form,Experience:e.target.value})} style={{padding:'12px',border:'1px solid #e5e7eb',borderRadius:'10px'}}/></div><input placeholder="Interest" value={form.Interest||''} onChange={e=>setForm({...form,Interest:e.target.value})} style={{padding:'12px',border:'1px solid #e5e7eb',borderRadius:'10px'}}/></>}</div><div style={{display:'flex',gap:'8px',marginTop:'16px'}}><button onClick={handleAddNew} style={{flex:1,background:'#0a1931',color:'#ffcc00',padding:'12px',borderRadius:'12px',border:'none',fontWeight:900,cursor:'pointer'}}>SAVE TO SHEET</button><button onClick={()=>setShowAdd(false)} style={{flex:1,background:'#f3f4f6',padding:'12px',borderRadius:'12px',border:'none',fontWeight:700,cursor:'pointer'}}>CANCEL</button></div></div></div>)}
      {detailRow && (<div style={{position:'fixed',inset:0,zIndex:10001,display:'flex',justifyContent:'flex-end'}}><div onClick={()=>setDetailRow(null)} style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.45)',backdropFilter:'blur(3px)'}}></div><div style={{position:'relative',width:'92%',maxWidth:'420px',background:'#fff',height:'100vh',overflowY:'auto',boxShadow:'-10px 0 40px rgba(0,0,0,0.2)',animation:'slideIn 0.25s ease'}}><div style={{background: tab==='contacts'?'#0a1931':'#7a0a0a', padding:'20px', color:'#fff', position:'sticky', top:0, zIndex:2}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><div><p style={{fontSize:'10px',color:'#ffcc00',fontWeight:800,letterSpacing:'1px'}}>{tab==='contacts'?'📞 CONTACT DETAIL':'🎖️ APPLICANT DETAIL'}</p><h2 style={{fontSize:'16px',fontWeight:900,marginTop:'4px'}}>{getVal(detailRow,['FullName','fullName'])||'No Name'}</h2></div><button onClick={()=>setDetailRow(null)} style={{background:'rgba(255,255,255,0.15)',border:'none',color:'#fff',width:'36px',height:'36px',borderRadius:'10px',fontSize:'18px',cursor:'pointer',fontWeight:900}}>✕</button></div><p style={{fontSize:'11px',marginTop:'10px',opacity:0.8,background:'rgba(255,255,255,0.1)',padding:'6px 10px',borderRadius:'20px',display:'inline-block'}}>🕒 {formatDate(getVal(detailRow,['Timestamp','timestamp']))}</p></div><div style={{padding:'20px',display:'grid',gap:'14px'}}><div style={{display:'grid',gap:'12px'}}><div style={{background:'#f8fafc',padding:'12px 14px',borderRadius:'12px',border:'1px solid #eef'}}><p style={{fontSize:'10px',fontWeight:800,color:'#64748b'}}>FULL NAME</p><p style={{fontSize:'13px',fontWeight:800,marginTop:'4px',color:'#0a1931'}}>{getVal(detailRow,['FullName','fullName'])||'-'}</p></div><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}><div style={{background:'#f8fafc',padding:'12px 14px',borderRadius:'12px',border:'1px solid #eef'}}><p style={{fontSize:'10px',fontWeight:800,color:'#64748b'}}>PHONE</p><p style={{fontSize:'13px',fontWeight:700,marginTop:'4px'}}>{getVal(detailRow,['Phone','phone'])||'-'}</p></div><div style={{background:'#f8fafc',padding:'12px 14px',borderRadius:'12px',border:'1px solid #eef'}}><p style={{fontSize:'10px',fontWeight:800,color:'#64748b'}}>EMAIL</p><p style={{fontSize:'12px',fontWeight:600,marginTop:'4px',wordBreak:'break-all'}}>{getVal(detailRow,['Email','email'])||'-'}</p></div></div>{tab==='contacts' ? <><div style={{background:'#eef2ff',padding:'12px 14px',borderRadius:'12px',border:'1px solid #e0e7ff'}}><p style={{fontSize:'10px',fontWeight:800,color:'#3730a3'}}>SERVICE REQUESTED</p><p style={{fontSize:'13px',fontWeight:800,marginTop:'4px',color:'#3730a3'}}>{getVal(detailRow,['Service','service'])||'-'}</p></div><div style={{background:'#fffbeb',padding:'14px',borderRadius:'12px',border:'1px solid #fde68a'}}><p style={{fontSize:'10px',fontWeight:800,color:'#92400e'}}>MESSAGE</p><p style={{fontSize:'13px',marginTop:'6px',lineHeight:'1.6',color:'#451a03',whiteSpace:'pre-wrap'}}>{getVal(detailRow,['Messages','message'])||'No message'}</p></div></> : <><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}><div style={{background:'#fef3c7',padding:'12px 14px',borderRadius:'12px',border:'1px solid #fde68a'}}><p style={{fontSize:'10px',fontWeight:800,color:'#92400e'}}>POSITION</p><p style={{fontSize:'13px',fontWeight:800,marginTop:'4px'}}>{getVal(detailRow,['Position','position'])||'-'}</p></div><div style={{background:'#f0fdf4',padding:'12px 14px',borderRadius:'12px',border:'1px solid #bbf7d0'}}><p style={{fontSize:'10px',fontWeight:800,color:'#166534'}}>EDUCATION</p><p style={{fontSize:'13px',fontWeight:800,marginTop:'4px'}}>{getVal(detailRow,['Education','education'])||'-'}</p></div></div><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}><div style={{background:'#f8fafc',padding:'12px 14px',borderRadius:'12px',border:'1px solid #eef'}}><p style={{fontSize:'10px',fontWeight:800,color:'#64748b'}}>DISTRICT</p><p style={{fontSize:'13px',fontWeight:700,marginTop:'4px'}}>{getVal(detailRow,['District','district'])||'-'}</p></div><div style={{background:'#f8fafc',padding:'12px 14px',borderRadius:'12px',border:'1px solid #eef'}}><p style={{fontSize:'10px',fontWeight:800,color:'#64748b'}}>EXPERIENCE</p><p style={{fontSize:'13px',fontWeight:700,marginTop:'4px'}}>{getVal(detailRow,['Experience','experience'])||'-'}</p></div></div><div style={{background:'#fffbeb',padding:'14px',borderRadius:'12px',border:'1px solid #fde68a'}}><p style={{fontSize:'10px',fontWeight:800,color:'#92400e'}}>INTEREST</p><p style={{fontSize:'13px',marginTop:'6px',lineHeight:'1.6',whiteSpace:'pre-wrap'}}>{getVal(detailRow,['Interest','interest'])||'-'}</p></div></>}<div style={{background:'#f1f5f9',padding:'12px 14px',borderRadius:'12px',marginTop:'8px'}}><p style={{fontSize:'10px',fontWeight:800,color:'#64748b'}}>TIMESTAMP (24HRS - EAT)</p><p style={{fontSize:'12px',fontWeight:800,marginTop:'4px',fontFamily:'monospace'}}>{formatDate(getVal(detailRow,['Timestamp','timestamp']))}</p></div><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginTop:'10px'}}><button onClick={()=>{ handleEdit(detailRow); }} style={{background:'#ffcc00',border:'none',padding:'12px',borderRadius:'12px',fontWeight:900,fontSize:'12px',cursor:'pointer'}}>✏️ EDIT</button><button onClick={()=>handleDelete(detailRow)} style={{background:'#fee2e2',color:'#dc2626',border:'1px solid #fecaca',padding:'12px',borderRadius:'12px',fontWeight:900,fontSize:'12px',cursor:'pointer'}}>🗑 DELETE</button></div><button onClick={()=>setDetailRow(null)} style={{background:'#0a1931',color:'#ffcc00',border:'none',padding:'12px',borderRadius:'12px',fontWeight:900,fontSize:'12px',cursor:'pointer',marginTop:'4px'}}>← CLOSE</button></div></div></div><style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style></div>)}
    </div>
  )
}
export default AdminDashboard