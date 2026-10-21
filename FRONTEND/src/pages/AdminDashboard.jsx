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
  const formatDate = (t) => { if(!t) return '-'; try { return new Date(t).toLocaleString(); } catch { return t; } }

  const handleDelete = async (row) => {
    const ts = getVal(row,['Timestamp','timestamp']);
    setData(prev => prev.filter(r => getVal(r,['Timestamp','timestamp']) !== ts));
    setSelected(prev=>prev.filter(id=>id!==ts));
    const payload = { action:'delete', timestamp:ts, type:tab };
    await fetch(GOOGLE_SHEET_WEBHOOK,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain'},body:JSON.stringify(payload)});
  };

  const handleBulkDelete = async () => {
    if(selected.length===0) return;
    const toDelete = [...selected];
    setData(prev => prev.filter(r => !toDelete.includes(getVal(r,['Timestamp','timestamp']))));
    setSelected([]);
    const payload = { action:'bulkDelete', timestamps: toDelete, type: tab };
    await fetch(GOOGLE_SHEET_WEBHOOK,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain'},body:JSON.stringify(payload)});
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
  const clearFilters = () => { setFilters({service:"",position:"",district:"",education:"",experience:"",interest:"",dateFrom:"",dateTo:""}); setCurrentPage(1); };
  const exportCSV = (rows, filename) => { if(!rows.length) return; const headers = tab==='contacts'?["Timestamp","FullName","Phone","Email","Service","Messages"]:["Timestamp","FullName","Phone","Email","Position","Education","District","Experience","Interest"]; const csv = [headers.join(",")].concat(rows.map(r=> headers.map(h=>`"${String(getVal(r,[h,h.toLowerCase()])||'').replace(/"/g,'""')}"`).join(","))).join("\n"); const blob = new Blob([csv],{type:"text/csv"}); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download=filename; a.click(); };

  if(!auth){
    return (
      <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#0a1931 0%,#152a5a 50%,#0a1931 100%)',display:'flex',justifyContent:'center',alignItems:'center',fontFamily:'Arial',padding:'20px'}}>
        <div style={{background:'#fff',padding:'40px 32px',borderRadius:'24px',width:'100%',maxWidth:'420px',textAlign:'center',boxShadow:'0 20px 60px rgba(0,0,0,0.4)'}}>
          <div style={{width:'64px',height:'64px',background:'linear-gradient(135deg,#0a1931,#1a3a6a)',borderRadius:'16px',margin:'0 auto 16px',display:'grid',placeItems:'center',color:'#ffcc00',fontSize:'26px',fontWeight:900,boxShadow:'0 8px 20px rgba(10,25,49,0.3)'}}>P</div>
          <h2 style={{fontWeight:900,color:'#0a1931',fontSize:'18px',letterSpacing:'-0.5px'}}>PINNACLE SECURITY</h2>
          <p style={{color:'#64748b',fontSize:'12px',marginTop:'6px',fontWeight:600,letterSpacing:'0.5px'}}>ADMIN DASHBOARD • SECURE ACCESS</p>
          <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Enter Admin Password" style={{width:'100%',padding:'14px 16px',borderRadius:'12px',marginTop:'24px',border:'2px solid #e2e8f0',outline:'none',fontSize:'13px',transition:'all 0.2s'}} onFocus={e=>e.target.style.borderColor='#0a1931'} onBlur={e=>e.target.style.borderColor='#e2e8f0'}/>
          <button onClick={login} style={{width:'100%',marginTop:'14px',background:'linear-gradient(135deg,#0a1931,#1a3a6a)',color:'#ffcc00',padding:'14px',borderRadius:'12px',fontWeight:900,border:'none',cursor:'pointer',fontSize:'13px',letterSpacing:'0.5px',boxShadow:'0 8px 20px rgba(10,25,49,0.2)'}}>UNLOCK DASHBOARD →</button>
        </div>
      </div>
    )
  }

  const applicants = data.filter(d => (d.type==='applicant') || getVal(d,['Position','position']));
  const contacts = data.filter(d => (d.type==='contact') || getVal(d,['Service','service']));
  
  const applyFilters = (list) => {
    return list.filter(d=>{
      const s = `${getVal(d,['FullName','fullName'])} ${getVal(d,['Phone','phone'])} ${getVal(d,['Email','email'])} ${getVal(d,['Service','service'])} ${getVal(d,['Messages','message'])} ${getVal(d,['Position','position'])} ${getVal(d,['District','district'])} ${getVal(d,['Education','education'])}`.toLowerCase();
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
  const totalPages = Math.ceil(list.length / rowsPerPage) || 1;
  const paginatedList = list.slice((currentPage-1)*rowsPerPage, currentPage*rowsPerPage);
  const allPageIds = paginatedList.map(r=>getVal(r,['Timestamp','timestamp']));
  const isAllSelected = allPageIds.length>0 && allPageIds.every(id=>selected.includes(id));
  const activeFilterCount = Object.values(filters).filter(v=>v).length;

  return (
    <div style={{background:'#f1f5f9',minHeight:'100vh',fontFamily:'Arial'}}>
      <div style={{background:'linear-gradient(135deg,#0a1931 0%,#132a54 100%)',padding:'16px 24px',display:'flex',justifyContent:'space-between',alignItems:'center',position:'sticky',top:0,zIndex:100,flexWrap:'wrap',gap:'12px',boxShadow:'0 4px 20px rgba(0,0,0,0.15)'}}>
        <div style={{display:'flex',alignItems:'center',gap:'14px'}}><div style={{width:'42px',height:'42px',background:'#ffcc00',borderRadius:'12px',display:'grid',placeItems:'center',fontWeight:900,fontSize:'18px',boxShadow:'0 4px 12px rgba(255,204,0,0.3)'}}>P</div><div><h1 style={{color:'#fff',fontWeight:900,fontSize:'14px',letterSpacing:'-0.3px'}}>PINNACLE SECURITY LTD</h1><p style={{color:'#ffcc00',fontSize:'10px',fontWeight:700,letterSpacing:'1px',marginTop:'2px'}}>ADMIN DASHBOARD • LIVE</p></div></div>
        <div style={{display:'flex',gap:'8px',alignItems:'center',flexWrap:'wrap'}}>
          <div style={{background:'rgba(255,255,255,0.1)',borderRadius:'24px',padding:'6px 14px',border:'1px solid rgba(255,255,255,0.1)'}}><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search name, phone, email..." style={{background:'transparent',border:'none',outline:'none',color:'#fff',fontSize:'12px',width:'200px'}}/></div>
          <button onClick={()=>setShowFilters(!showFilters)} style={{background:activeFilterCount?'#ffcc00':'#fff',color:'#0a1931',border:'none',padding:'9px 16px',borderRadius:'20px',fontWeight:800,fontSize:'12px',cursor:'pointer',boxShadow:'0 2px 8px rgba(0,0,0,0.1)'}}>{showFilters?`✕ Close`:`⚙ Filters${activeFilterCount?` • ${activeFilterCount}`:''}`}</button>
          {selected.length>0 && <button onClick={handleBulkDelete} style={{background:'#ef4444',color:'#fff',border:'none',padding:'9px 16px',borderRadius:'20px',fontWeight:800,fontSize:'12px',cursor:'pointer',boxShadow:'0 2px 8px rgba(239,68,68,0.3)'}}>🗑 Delete ({selected.length})</button>}
          <button onClick={load} style={{background:'#ffcc00',border:'none',padding:'9px 16px',borderRadius:'20px',fontWeight:800,fontSize:'12px',cursor:'pointer',boxShadow:'0 2px 8px rgba(255,204,0,0.3)'}}>{loading?'⏳':'↻ Refresh'}</button>
          <a href="/" style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,204,0,0.5)',color:'#ffcc00',padding:'9px 16px',borderRadius:'20px',fontWeight:800,fontSize:'12px',textDecoration:'none'}}>↗ Website</a>
        </div>
      </div>

      <div style={{maxWidth:'1600px',margin:'auto',padding:'20px'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:'16px',marginBottom:'20px'}}>
          <div onClick={()=>{setTab('contacts'); setSelected([]);}} style={{background:tab==='contacts'?'linear-gradient(135deg,#0a1931,#1a3a6a)':'#fff',color:tab==='contacts'?'#fff':'#0a1931',padding:'20px',borderRadius:'20px',cursor:'pointer',border:tab==='contacts'?'2px solid #ffcc00':'1px solid #e2e8f0',boxShadow:tab==='contacts'?'0 8px 30px rgba(10,25,49,0.25)':'0 4px 12px rgba(0,0,0,0.04)',transition:'all 0.2s'}}>
            <p style={{fontSize:'10px',opacity:.7,fontWeight:800,letterSpacing:'1px'}}>📞 CONTACT REQUESTS</p>
            <h2 style={{fontSize:'32px',fontWeight:900,marginTop:'10px',display:'flex',alignItems:'baseline',gap:'8px'}}>{contacts.length} <span style={{fontSize:'12px',fontWeight:600,opacity:.6}}>total / {filteredContacts.length} filtered</span></h2>
            <div style={{marginTop:'12px',height:'4px',background:tab==='contacts'?'rgba(255,204,0,0.3)':'#f1f5f9',borderRadius:'10px',overflow:'hidden'}}><div style={{width:`${contacts.length? (filteredContacts.length/contacts.length)*100 :0}%`,height:'100%',background:'#ffcc00'}}></div></div>
          </div>
          <div onClick={()=>{setTab('applicants'); setSelected([]);}} style={{background:tab==='applicants'?'linear-gradient(135deg,#ffcc00,#ffdb4d)':'#fff',color:'#0a1931',padding:'20px',borderRadius:'20px',cursor:'pointer',border:tab==='applicants'?'2px solid #0a1931':'1px solid #e2e8f0',boxShadow:tab==='applicants'?'0 8px 30px rgba(255,204,0,0.3)':'0 4px 12px rgba(0,0,0,0.04)'}}>
            <p style={{fontSize:'10px',fontWeight:800,letterSpacing:'1px'}}>🎖️ JOB APPLICANTS</p>
            <h2 style={{fontSize:'32px',fontWeight:900,marginTop:'10px',display:'flex',alignItems:'baseline',gap:'8px'}}>{applicants.length} <span style={{fontSize:'12px',fontWeight:600,color:'#57534e'}}>/ {filteredApplicants.length} filtered</span></h2>
            <div style={{marginTop:'12px',height:'4px',background:'rgba(10,25,49,0.1)',borderRadius:'10px',overflow:'hidden'}}><div style={{width:`${applicants.length? (filteredApplicants.length/applicants.length)*100 :0}%`,height:'100%',background:'#0a1931'}}></div></div>
          </div>
          <div style={{background:'#fff',padding:'20px',borderRadius:'20px',border:'1px solid #e2e8f0',boxShadow:'0 4px 12px rgba(0,0,0,0.04)'}}><p style={{fontSize:'10px',fontWeight:800,letterSpacing:'1px',color:'#64748b'}}>📊 CURRENT VIEW • {tab.toUpperCase()}</p><div style={{display:'flex',justifyContent:'space-between',alignItems:'end',marginTop:'10px'}}><h2 style={{fontSize:'32px',fontWeight:900,color:'#0a1931'}}>{list.length}</h2><button onClick={()=>exportCSV(list,`${tab}-${new Date().toISOString().slice(0,10)}.csv`)} style={{background:'#f1f5f9',border:'1px solid #e2e8f0',padding:'8px 14px',borderRadius:'20px',fontSize:'11px',fontWeight:900,cursor:'pointer',color:'#0a1931'}}>⬇ EXPORT CSV</button></div></div>
          <div style={{background:'linear-gradient(135deg,#0a1931 0%,#1e3a6a 100%)',padding:'20px',borderRadius:'20px',display:'flex',alignItems:'center',justifyContent:'space-between',boxShadow:'0 8px 30px rgba(10,25,49,0.25)',border:'1px solid rgba(255,204,0,0.2)'}}><div><p style={{fontSize:'10px',color:'#ffcc00',fontWeight:800,letterSpacing:'1px'}}>QUICK ACTION</p><p style={{color:'#fff',fontSize:'13px',fontWeight:700,marginTop:'6px'}}>Add new {tab} →</p></div><button onClick={()=>{setForm({});setShowAdd(true)}} style={{background:'#ffcc00',border:'none',width:'48px',height:'48px',borderRadius:'14px',fontWeight:900,fontSize:'22px',cursor:'pointer',boxShadow:'0 4px 15px rgba(255,204,0,0.4)'}}>＋</button></div>
        </div>

        {showFilters && (
          <div style={{background:'#fff',borderRadius:'18px',padding:'18px',marginBottom:'18px',boxShadow:'0 8px 25px rgba(0,0,0,.06)',border:'1px solid #e2e8f0'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'14px'}}><h3 style={{fontSize:'12px',fontWeight:900,letterSpacing:'0.5px',color:'#0a1931'}}>⚙ ADVANCED FILTERS {activeFilterCount>0&&<span style={{background:'#ffcc00',padding:'3px 10px',borderRadius:'20px',marginLeft:'10px',fontSize:'10px'}}>{activeFilterCount} ACTIVE</span>}</h3><button onClick={clearFilters} style={{background:'#fef2f2',color:'#dc2626',border:'1px solid #fecaca',padding:'7px 14px',borderRadius:'20px',fontSize:'11px',fontWeight:800,cursor:'pointer'}}>↺ Clear All Filters</button></div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(165px,1fr))',gap:'12px'}}>
              <div><label style={{fontSize:'10px',fontWeight:800,color:'#64748b',letterSpacing:'0.5px'}}>DATE FROM</label><input type="date" value={filters.dateFrom} onChange={e=>setFilters({...filters,dateFrom:e.target.value})} style={{width:'100%',padding:'10px 12px',borderRadius:'12px',border:'1px solid #e2e8f0',marginTop:'6px',fontSize:'12px',fontWeight:600}}/></div>
              <div><label style={{fontSize:'10px',fontWeight:800,color:'#64748b',letterSpacing:'0.5px'}}>DATE TO</label><input type="date" value={filters.dateTo} onChange={e=>setFilters({...filters,dateTo:e.target.value})} style={{width:'100%',padding:'10px 12px',borderRadius:'12px',border:'1px solid #e2e8f0',marginTop:'6px',fontSize:'12px',fontWeight:600}}/></div>
              {tab==='contacts' ? (
                <div><label style={{fontSize:'10px',fontWeight:800,color:'#64748b'}}>SERVICE TYPE</label><select value={filters.service} onChange={e=>setFilters({...filters,service:e.target.value})} style={{width:'100%',padding:'10px 12px',borderRadius:'12px',border:'1px solid #e2e8f0',marginTop:'6px',fontSize:'12px',fontWeight:600}}><option value="">All Services</option>{serviceOptions.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
              ) : (
                <>
                  <div><label style={{fontSize:'10px',fontWeight:800,color:'#64748b'}}>POSITION</label><select value={filters.position} onChange={e=>setFilters({...filters,position:e.target.value})} style={{width:'100%',padding:'10px 12px',borderRadius:'12px',border:'1px solid #e2e8f0',marginTop:'6px',fontSize:'12px',fontWeight:600}}><option value="">All Positions</option>{positionOptions.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
                  <div><label style={{fontSize:'10px',fontWeight:800,color:'#64748b'}}>DISTRICT</label><select value={filters.district} onChange={e=>setFilters({...filters,district:e.target.value})} style={{width:'100%',padding:'10px 12px',borderRadius:'12px',border:'1px solid #e2e8f0',marginTop:'6px',fontSize:'12px',fontWeight:600}}><option value="">All Districts</option>{districtOptions.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
                  <div><label style={{fontSize:'10px',fontWeight:800,color:'#64748b'}}>EDUCATION</label><select value={filters.education} onChange={e=>setFilters({...filters,education:e.target.value})} style={{width:'100%',padding:'10px 12px',borderRadius:'12px',border:'1px solid #e2e8f0',marginTop:'6px',fontSize:'12px',fontWeight:600}}><option value="">All Education</option>{educationOptions.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
                  <div><label style={{fontSize:'10px',fontWeight:800,color:'#64748b'}}>EXPERIENCE</label><select value={filters.experience} onChange={e=>setFilters({...filters,experience:e.target.value})} style={{width:'100%',padding:'10px 12px',borderRadius:'12px',border:'1px solid #e2e8f0',marginTop:'6px',fontSize:'12px',fontWeight:600}}><option value="">All Experience</option>{experienceOptions.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
                  <div><label style={{fontSize:'10px',fontWeight:800,color:'#64748b'}}>INTEREST</label><select value={filters.interest} onChange={e=>setFilters({...filters,interest:e.target.value})} style={{width:'100%',padding:'10px 12px',borderRadius:'12px',border:'1px solid #e2e8f0',marginTop:'6px',fontSize:'12px',fontWeight:600}}><option value="">All Interest</option>{interestOptions.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
                </>
              )}
            </div>
          </div>
        )}

        <div style={{background:'#fff',borderRadius:'20px',overflow:'hidden',boxShadow:'0 10px 40px rgba(0,0,0,.08)',border:'1px solid #e2e8f0'}}>
          <div style={{padding:'16px 22px',display:'flex',justifyContent:'space-between',alignItems:'center',background:tab==='contacts'?'linear-gradient(135deg,#0a1931,#1a365d)':'linear-gradient(135deg,#7f1d1d,#991b1b)'}}>
            <div style={{color:tab==='contacts'?'#ffcc00':'#fff',fontWeight:900,fontSize:'13px',letterSpacing:'0.5px'}}>{tab==='contacts'?`📞 CONTACTS — ${list.length} / ${contacts.length} RECORDS`:`🎖️ APPLICANTS — ${list.length} / ${applicants.length} RECORDS`} {activeFilterCount>0&&` • FILTERED`}</div>
            <div style={{fontSize:'10px',color:tab==='contacts'?'#ffcc00':'#fecaca',opacity:.9,background:'rgba(0,0,0,0.2)',padding:'4px 10px',borderRadius:'20px'}}>Sheet: {tab==='contacts'?'Contacts':'Applicants'}</div>
          </div>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px',minWidth:'1300px'}}>
              <thead><tr style={{background:'#f8fafc',color:'#64748b',textAlign:'left',fontSize:'10px',letterSpacing:'1px',borderBottom:'1px solid #e2e8f0'}}>
                <th style={{padding:'14px 18px'}}><input type="checkbox" checked={isAllSelected} onChange={()=>{ if(isAllSelected){ setSelected(prev=>prev.filter(id=>!allPageIds.includes(id))); } else { setSelected(prev=>[...new Set([...prev, ...allPageIds])]); } }} style={{width:'16px',height:'16px'}}/></th>
                <th style={{padding:'14px 16px',fontWeight:800}}>DATE & TIME</th><th style={{padding:'14px 16px',fontWeight:800}}>FULL NAME</th><th style={{padding:'14px 16px',fontWeight:800}}>PHONE</th><th style={{padding:'14px 16px',fontWeight:800}}>EMAIL</th>
                {tab==='contacts'?<><th style={{padding:'14px 16px',fontWeight:800}}>SERVICE</th><th style={{padding:'14px 16px',fontWeight:800}}>MESSAGE</th></>:<><th style={{padding:'14px 16px',fontWeight:800}}>POSITION</th><th style={{padding:'14px 16px',fontWeight:800}}>EDUCATION</th><th style={{padding:'14px 16px',fontWeight:800}}>DISTRICT</th><th style={{padding:'14px 16px',fontWeight:800}}>EXP</th><th style={{padding:'14px 16px',fontWeight:800}}>INTEREST</th></>}
                <th style={{padding:'14px 16px',fontWeight:800}}>ACTIONS</th>
              </tr></thead>
              <tbody>
                {paginatedList.length===0 ? <tr><td colSpan={12} style={{padding:'50px',textAlign:'center',color:'#94a3b8'}}><div style={{fontSize:'32px',marginBottom:'10px'}}>📭</div>{loading?'Loading data...':'No records match — try Clear Filters'}</td></tr> : paginatedList.map((d,i)=>{ 
                  const ts=getVal(d,['Timestamp','timestamp']); const isEditing=editRow===ts; const checked=selected.includes(ts);
                  return (
                  <tr key={i} style={{borderBottom:'1px solid #f1f5f9',background:checked?'#fefce8': isEditing?'#eff6ff': i%2===0?'#fff':'#f8fafc',transition:'all 0.15s'}}>
                    <td style={{padding:'12px 18px'}}><input type="checkbox" checked={checked} onChange={()=>toggleSelect(ts)} style={{width:'16px',height:'16px'}}/></td>
                    <td style={{padding:'12px 16px',color:'#64748b',fontSize:'11px',fontWeight:600}}>{formatDate(ts)}</td>
                    <td style={{padding:'12px 16px',fontWeight:800,color:'#0a1931'}}>{isEditing?<input value={form.FullName||''} onChange={e=>setForm({...form,FullName:e.target.value})} style={{padding:'8px 10px',borderRadius:'8px',border:'1.5px solid #0a1931',width:'120px',fontWeight:700}}/>:getVal(d,['FullName','fullName'])}</td>
                    <td style={{padding:'12px 16px',fontWeight:600}}>{isEditing?<input value={form.Phone||''} onChange={e=>setForm({...form,Phone:e.target.value})} style={{padding:'8px 10px',borderRadius:'8px',border:'1px solid #ddd',width:'100px'}}/>:getVal(d,['Phone','phone'])}</td>
                    <td style={{padding:'12px 16px',color:'#475569',fontSize:'11px'}}>{isEditing?<input value={form.Email||''} onChange={e=>setForm({...form,Email:e.target.value})} style={{padding:'8px 10px',borderRadius:'8px',border:'1px solid #ddd',width:'140px'}}/>:getVal(d,['Email','email'])}</td>
                    {tab==='contacts'?<>
                      <td style={{padding:'12px 16px'}}>{isEditing?<input value={form.Service||''} onChange={e=>setForm({...form,Service:e.target.value})} style={{padding:'6px 10px',borderRadius:'8px',border:'1px solid #ddd',width:'100px'}}/>:<span style={{background:'#eef2ff',color:'#3730a3',padding:'5px 10px',borderRadius:'20px',fontSize:'11px',fontWeight:800,border:'1px solid #e0e7ff'}}>{getVal(d,['Service','service'])}</span>}</td>
                      <td style={{padding:'12px 16px',maxWidth:'220px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',color:'#334155'}}>{isEditing?<input value={form.Messages||''} onChange={e=>setForm({...form,Messages:e.target.value})} style={{padding:'8px 10px',borderRadius:'8px',border:'1px solid #ddd',width:'180px'}}/>:getVal(d,['Messages','message'])}</td>
                    </>:<>
                      <td style={{padding:'12px 16px'}}>{isEditing?<input value={form.Position||''} onChange={e=>setForm({...form,Position:e.target.value})} style={{padding:'6px 10px',borderRadius:'8px',border:'1px solid #ddd',width:'100px'}}/>:<span style={{background:'#fef3c7',color:'#92400e',padding:'5px 10px',borderRadius:'20px',fontSize:'11px',fontWeight:800,border:'1px solid #fde68a'}}>{getVal(d,['Position','position'])}</span>}</td>
                      <td style={{padding:'12px 16px',fontWeight:600}}>{isEditing?<input value={form.Education||''} onChange={e=>setForm({...form,Education:e.target.value})} style={{padding:'6px',width:'70px',borderRadius:'8px',border:'1px solid #ddd'}}/>:getVal(d,['Education','education'])}</td>
                      <td style={{padding:'12px 16px'}}>{isEditing?<input value={form.District||''} onChange={e=>setForm({...form,District:e.target.value})} style={{padding:'6px',width:'70px',borderRadius:'8px',border:'1px solid #ddd'}}/>:getVal(d,['District','district'])}</td>
                      <td style={{padding:'12px 16px'}}>{isEditing?<input value={form.Experience||''} onChange={e=>setForm({...form,Experience:e.target.value})} style={{padding:'6px',width:'60px',borderRadius:'8px',border:'1px solid #ddd'}}/>:getVal(d,['Experience','experience'])}</td>
                      <td style={{padding:'12px 16px',maxWidth:'140px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{isEditing?<input value={form.Interest||''} onChange={e=>setForm({...form,Interest:e.target.value})} style={{padding:'6px',width:'90px',borderRadius:'8px',border:'1px solid #ddd'}}/>:getVal(d,['Interest','interest'])}</td>
                    </>}
                    <td style={{padding:'12px 16px'}}><div style={{display:'flex',gap:'6px'}}>{isEditing?<><button onClick={handleSave} style={{background:'#0a1931',color:'#ffcc00',border:'none',padding:'7px 14px',borderRadius:'10px',fontWeight:800,fontSize:'11px',cursor:'pointer'}}>✓ SAVE</button><button onClick={()=>setEditRow(null)} style={{background:'#f1f5f9',border:'1px solid #e2e8f0',padding:'7px 12px',borderRadius:'10px',fontSize:'11px',cursor:'pointer',fontWeight:700}}>✕</button></>:<><button onClick={()=>handleEdit(d)} style={{background:'#ffcc00',border:'none',padding:'7px 14px',borderRadius:'10px',fontWeight:800,fontSize:'11px',cursor:'pointer',color:'#0a1931',boxShadow:'0 2px 6px rgba(255,204,0,0.2)'}}>EDIT</button><button onClick={()=>handleDelete(d)} style={{background:'#fef2f2',color:'#dc2626',border:'1px solid #fecaca',padding:'7px 12px',borderRadius:'10px',fontWeight:800,fontSize:'11px',cursor:'pointer'}}>DEL</button></>}</div></td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
          <div style={{padding:'16px 20px',display:'flex',justifyContent:'space-between',alignItems:'center',borderTop:'1px solid #f1f5f9',flexWrap:'wrap',gap:'12px',background:'#fcfdfe'}}>
            <button disabled={currentPage===1} onClick={()=>setCurrentPage(p=>Math.max(1,p-1))} style={{background:currentPage===1?'#f1f5f9':'#fff',color:currentPage===1?'#94a3b8':'#0a1931',border:'1px solid #e2e8f0',padding:'9px 18px',borderRadius:'12px',fontWeight:800,fontSize:'12px',cursor:'pointer'}}>◂ PREV</button>
            <div style={{display:'flex',alignItems:'center',gap:'10px',fontSize:'12px',fontWeight:700,color:'#475569'}}><span>Page</span><input type="number" min={1} max={totalPages} value={currentPage} onChange={e=>setCurrentPage(Math.min(totalPages,Math.max(1,Number(e.target.value)||1)))} style={{width:'60px',padding:'9px',borderRadius:'12px',border:'1px solid #e2e8f0',textAlign:'center',fontWeight:800,background:'#fff'}}/><span>of {totalPages}</span><span style={{marginLeft:'8px',color:'#94a3b8'}}>• {list.length} records</span></div>
            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
              <select value={rowsPerPage} onChange={e=>setRowsPerPage(Number(e.target.value))} style={{padding:'9px 14px',borderRadius:'12px',border:'1px solid #e2e8f0',fontWeight:700,fontSize:'12px',background:'#fff'}}>
                <option value={10}>10 rows</option><option value={20}>20 rows</option><option value={30}>30 rows</option><option value={50}>50 rows</option><option value={100}>100 rows</option>
              </select>
              <button disabled={currentPage===totalPages} onClick={()=>setCurrentPage(p=>Math.min(totalPages,p+1))} style={{background:currentPage===totalPages?'#f1f5f9':'#0a1931',color:currentPage===totalPages?'#94a3b8':'#ffcc00',border:'1px solid #e2e8f0',padding:'9px 18px',borderRadius:'12px',fontWeight:800,fontSize:'12px',cursor:'pointer'}}>NEXT ▸</button>
            </div>
          </div>
        </div>
      </div>

      {showAdd && (
        <div style={{position:'fixed',inset:0,background:'rgba(10,25,49,0.75)',backdropFilter:'blur(10px)',zIndex:10000,display:'flex',justifyContent:'center',alignItems:'center',padding:'20px'}}>
          <div style={{background:'#fff',padding:'28px',borderRadius:'24px',width:'92%',maxWidth:'540px',boxShadow:'0 25px 80px rgba(0,0,0,0.3)'}}>
            <h3 style={{fontWeight:900,fontSize:'15px',color:'#0a1931',letterSpacing:'-0.3px'}}>✨ Add New {tab.toUpperCase()} — Save to Google Sheet</h3>
            <p style={{fontSize:'11px',color:'#64748b',marginTop:'4px'}}>This will instantly appear in your {tab} sheet</p>
            <div style={{display:'grid',gap:'10px',marginTop:'18px'}}>
              <input placeholder="Full Name *" value={form.FullName||''} onChange={e=>setForm({...form,FullName:e.target.value})} style={{padding:'12px 14px',border:'1.5px solid #e2e8f0',borderRadius:'12px',fontSize:'13px',fontWeight:600,outline:'none'}}/>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}><input placeholder="Phone *" value={form.Phone||''} onChange={e=>setForm({...form,Phone:e.target.value})} style={{padding:'12px 14px',border:'1.5px solid #e2e8f0',borderRadius:'12px',fontSize:'13px'}}/><input placeholder="Email" value={form.Email||''} onChange={e=>setForm({...form,Email:e.target.value})} style={{padding:'12px 14px',border:'1.5px solid #e2e8f0',borderRadius:'12px',fontSize:'13px'}}/></div>
              {tab==='contacts'?<><input placeholder="Service (e.g. CCTV, Guard)" value={form.Service||''} onChange={e=>setForm({...form,Service:e.target.value})} style={{padding:'12px 14px',border:'1.5px solid #e2e8f0',borderRadius:'12px',fontSize:'13px'}}/><textarea placeholder="Message" value={form.Messages||''} onChange={e=>setForm({...form,Messages:e.target.value})} style={{padding:'12px 14px',border:'1.5px solid #e2e8f0',borderRadius:'12px',fontSize:'13px',minHeight:'80px',resize:'vertical'}}/></>:<><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}><input placeholder="Position" value={form.Position||''} onChange={e=>setForm({...form,Position:e.target.value})} style={{padding:'12px 14px',border:'1.5px solid #e2e8f0',borderRadius:'12px',fontSize:'13px'}}/><input placeholder="Education (UCE/UACE)" value={form.Education||''} onChange={e=>setForm({...form,Education:e.target.value})} style={{padding:'12px 14px',border:'1.5px solid #e2e8f0',borderRadius:'12px',fontSize:'13px'}}/></div><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}><input placeholder="District" value={form.District||''} onChange={e=>setForm({...form,District:e.target.value})} style={{padding:'12px 14px',border:'1.5px solid #e2e8f0',borderRadius:'12px',fontSize:'13px'}}/><input placeholder="Experience" value={form.Experience||''} onChange={e=>setForm({...form,Experience:e.target.value})} style={{padding:'12px 14px',border:'1.5px solid #e2e8f0',borderRadius:'12px',fontSize:'13px'}}/></div><input placeholder="Interest / Why you want job" value={form.Interest||''} onChange={e=>setForm({...form,Interest:e.target.value})} style={{padding:'12px 14px',border:'1.5px solid #e2e8f0',borderRadius:'12px',fontSize:'13px'}}/></>}
            </div>
            <div style={{display:'flex',gap:'10px',marginTop:'20px'}}><button onClick={handleAddNew} style={{flex:1,background:'linear-gradient(135deg,#0a1931,#1a3a6a)',color:'#ffcc00',padding:'14px',borderRadius:'14px',border:'none',fontWeight:900,cursor:'pointer',fontSize:'13px',boxShadow:'0 8px 20px rgba(10,25,49,0.2)'}}>✓ SAVE TO SHEET</button><button onClick={()=>setShowAdd(false)} style={{flex:1,background:'#f1f5f9',padding:'14px',borderRadius:'14px',border:'1px solid #e2e8f0',fontWeight:700,cursor:'pointer',fontSize:'13px'}}>CANCEL</button></div>
          </div>
        </div>
      )}
    </div>
  )
}
export default AdminDashboard