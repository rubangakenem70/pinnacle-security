import React, { useState, useEffect } from 'react'

const ADMIN_PASSWORD = "Pinnacle2026!Secure123";
const GOOGLE_SHEET_WEBHOOK = "https://script.google.com/macros/s/AKfycbz0Fx9gSfPwPXZdi8pivw9IdQ_fzj707fPk22GBECuGYhGzwePtEPZV47TyXk8TN8bggQ/exec";

const getFullDateTime24 = () => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}.${d.getMilliseconds()}-${Math.floor(Math.random()*900)+100}`;
};

const AdminDashboard = () => {
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState("");
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("contacts");
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ service:"", position:"", district:"", education:"", experience:"", interest:"", dateFrom:"", dateTo:"" });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [selected, setSelected] = useState([]);
  const [detailRow, setDetailRow] = useState(null);
  const [editRow, setEditRow] = useState(null);
  const [form, setForm] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(""), 3000); }
  const login = () => pass === ADMIN_PASSWORD ? setAuth(true) : alert("Wrong Password!");
  
  const load = () => {
    setLoading(true);
    fetch(GOOGLE_SHEET_WEBHOOK).then(r=>r.json()).then(d=>{
      const arr = Array.isArray(d)?d:[];
      const map = new Map();
      arr.forEach(row=>{
        const ts = (row.Timestamp || row.timestamp || '').trim();
        if(!ts) return;
        if(!map.has(ts)) map.set(ts, row);
      });
      const uniqueArr = Array.from(map.values());
      const withId = uniqueArr.map((row,i)=>({ ...row, _uid: `${row.Timestamp||row.timestamp}_${i}`, _index: i }));
      const sorted = withId.sort((a,b)=> new Date(b.timestamp||b.Timestamp||0) - new Date(a.timestamp||a.Timestamp||0));
      setData(sorted); setLoading(false);
    }).catch(()=>setLoading(false));
  };
  
  useEffect(()=>{ if(auth) load(); },[auth]);
  useEffect(()=>{ setCurrentPage(1); },[filters, search, tab, rowsPerPage]);

  const getVal = (obj, keys) => { for(let k of keys) if(obj[k]!==undefined && obj[k]!==null && obj[k]!=='') return obj[k]; return ''; }

  const handleDelete = async (row) => {
    if(!confirm(`Delete ${getVal(row,['FullName','fullName'])}?`)) return;
    const uid = row._uid;
    const ts = getVal(row,['Timestamp','timestamp']);
    setData(prev => prev.filter(r => r._uid !== uid));
    setSelected(prev=>prev.filter(id=>id!==uid));
    if(detailRow && detailRow._uid===uid) setDetailRow(null);
    showToast("🗑 Deleted");
    await fetch(GOOGLE_SHEET_WEBHOOK,{ method:'POST', mode:'no-cors', headers:{'Content-Type':'text/plain'}, body:JSON.stringify({ action:'delete', timestamp: ts }) });
  };

  const handleBulkDelete = async () => {
    if(selected.length===0) return;
    if(!confirm(`Delete ${selected.length} selected?`)) return;
    const toDeleteRows = data.filter(r=>selected.includes(r._uid));
    const timestamps = [...new Set(toDeleteRows.map(r=>getVal(r,['Timestamp','timestamp'])))];
    setData(prev => prev.filter(r => !selected.includes(r._uid)));
    setSelected([]); setDetailRow(null);
    showToast(`🗑 ${selected.length} deleted`);
    await fetch(GOOGLE_SHEET_WEBHOOK,{ method:'POST', mode:'no-cors', headers:{'Content-Type':'text/plain'}, body:JSON.stringify({ action:'bulkDelete', timestamps }) });
  };

  const handleEdit = (row) => {
    setEditRow(row);
    setForm({
      FullName:getVal(row,['FullName','fullName']), Phone:getVal(row,['Phone','phone']), Email:getVal(row,['Email','email']),
      Service:getVal(row,['Service','service']), Messages:getVal(row,['Messages','message']), Position:getVal(row,['Position','position']),
      Education:getVal(row,['Education','education']), District:getVal(row,['District','district']), Experience:getVal(row,['Experience','experience']),
      Interest:getVal(row,['Interest','interest']), timestamp:getVal(row,['Timestamp','timestamp']), type: row.type|| (tab==='contacts'?'contact':'applicant')
    });
  };

  const handleSave = async () => {
    const ts = form.timestamp;
    setData(prev => prev.map(r => r._uid===editRow._uid ? { ...r, ...form, Timestamp: ts, timestamp: ts } : r));
    if(detailRow && detailRow._uid===editRow._uid) setDetailRow({...detailRow, ...form});
    setEditRow(null); showToast("✅ Updated");
    await fetch(GOOGLE_SHEET_WEBHOOK,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain'},body:JSON.stringify({ action:'update', ...form, timestamp: ts, type: form.type })});
  };

  const handleAddNew = async () => {
    const ts = getFullDateTime24();
    const payload = { ...form, timestamp:ts, Timestamp:ts, type:tab==='contacts'?'contact':'applicant' };
    setData(prev=>[{...payload, _uid:`${ts}_${Date.now()}`},...prev]);
    setShowAdd(false); setForm({}); showToast("✅ Added");
    await fetch(GOOGLE_SHEET_WEBHOOK,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain'},body:JSON.stringify(payload)});
  };

  const unique = (keyArr) => [...new Set(data.map(d=>getVal(d,keyArr)).filter(v=>v))].sort();
  const serviceOptions = unique(['Service','service']); 
  const positionOptions = unique(['Position','position']); 
  const districtOptions = unique(['District','district']); 
  const educationOptions = unique(['Education','education']); 
  const experienceOptions = unique(['Experience','experience']); 
  const interestOptions = unique(['Interest','interest']);

  if(!auth){
    return ( <div style={{minHeight:'100vh',background:'radial-gradient(circle at 20% 30%,#1a3a6a,#0a1931 70%)',display:'flex',justifyContent:'center',alignItems:'center',fontFamily:'Arial'}}>
      <div style={{background:'#fff',padding:'40px',borderRadius:'28px',width:'92%',maxWidth:'380px',textAlign:'center',boxShadow:'0 20px 60px rgba(0,0,0,.3)'}}>
        <div style={{width:'64px',height:'64px',background:'#0a1931',borderRadius:'18px',margin:'0 auto 16px',display:'grid',placeItems:'center',color:'#ffcc00',fontSize:'26px',fontWeight:900}}>P</div>
        <h2 style={{fontWeight:900,color:'#0a1931'}}>PINNACLE ADMIN</h2>
        <input type="password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&login()} placeholder="Admin Password" style={{width:'100%',padding:'14px 16px',borderRadius:'14px',marginTop:'22px',border:'2px solid #e5e7eb'}}/>
        <button onClick={login} style={{width:'100%',marginTop:'14px',background:'#ffcc00',padding:'14px',borderRadius:'14px',fontWeight:900,border:'none',cursor:'pointer'}}>UNLOCK DASHBOARD →</button>
      </div>
    </div> )
  }

  const applicants = data.filter(d => (d.type==='applicant') || getVal(d,['Position','position']));
  const contacts = data.filter(d => (d.type==='contact') || getVal(d,['Service','service']));
  const applyFilters = (list) => list.filter(d=>{
    const s = `${getVal(d,['FullName','fullName'])} ${getVal(d,['Phone','phone'])} ${getVal(d,['Email','email'])} ${getVal(d,['Service','service'])} ${getVal(d,['Position','position'])} ${getVal(d,['District','district'])}`.toLowerCase();
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

  const filteredContacts = applyFilters(contacts); 
  const filteredApplicants = applyFilters(applicants);
  const list = tab==='contacts'?filteredContacts:filteredApplicants;
  const totalPages = Math.ceil(list.length / rowsPerPage) || 1;
  const paginatedList = list.slice((currentPage-1)*rowsPerPage, currentPage*rowsPerPage);
  const allPageIds = paginatedList.map(r=>r._uid);
  const isAllSelected = allPageIds.length>0 && allPageIds.every(id=>selected.includes(id));
  const activeFilterCount = Object.values(filters).filter(v=>v).length;
  const clearFilters = () => setFilters({ service:"", position:"", district:"", education:"", experience:"", interest:"", dateFrom:"", dateTo:"" });

  const exportCSV = (rows, filename) => {
    if(!rows.length) return;
    const headers = tab==='contacts'?["Timestamp","FullName","Phone","Email","Service","Messages"]:["Timestamp","FullName","Phone","Email","Position","Education","District","Experience","Interest"];
    const csv = [headers.join(",")].concat(rows.map(r=> headers.map(h=>`"${String(getVal(r,[h,h.toLowerCase()])||'').replace(/"/g,'""')}"`).join(","))).join("\n");
    const blob = new Blob([csv],{type:"text/csv"}); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download=filename; a.click();
    showToast("📥 Exported CSV");
  };

  return (
    <div style={{background:'#eef2f7',minHeight:'100vh',fontFamily:'Arial'}}>
      {toast && <div style={{position:'fixed',top:'20px',right:'20px',background:'#0a1931',color:'#ffcc00',padding:'12px 20px',borderRadius:'30px',fontWeight:900,fontSize:'13px',zIndex:99999,boxShadow:'0 8px 20px rgba(0,0,0,.2)'}}>{toast}</div>}
      
      <div style={{background:'#0a1931',padding:'14px 20px',display:'flex',justifyContent:'space-between',alignItems:'center',position:'sticky',top:0,zIndex:100,borderBottom:'4px solid #ffcc00',flexWrap:'wrap',gap:'10px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
          <div style={{width:'42px',height:'42px',background:'#ffcc00',borderRadius:'12px',display:'grid',placeItems:'center',fontWeight:900,color:'#0a1931',fontSize:'18px'}}>P</div>
          <div><h1 style={{color:'#fff',fontWeight:900,fontSize:'15px'}}>PINNACLE SECURITY LTD</h1><p style={{color:'#ffcc00',fontSize:'10px',fontWeight:700,letterSpacing:'1px'}}>ADMIN CONTROL CENTER • {data.length} TOTAL</p></div>
        </div>
        <div style={{display:'flex',gap:'8px',alignItems:'center',flexWrap:'wrap'}}>
          <a href="/" style={{background:'#ffcc00',color:'#0a1931',padding:'9px 16px',borderRadius:'24px',fontWeight:900,fontSize:'12px',textDecoration:'none'}}>🏠 WEBSITE</a>
          <button onClick={()=>{setForm({}); setShowAdd(true)}} style={{background:'#fff',color:'#0a1931',border:'none',padding:'9px 16px',borderRadius:'24px',fontWeight:900,fontSize:'12px',cursor:'pointer'}}>＋ ADD NEW</button>
          <button onClick={load} style={{background:'rgba(255,255,255,.15)',color:'#fff',border:'1px solid rgba(255,255,255,.2)',padding:'9px 16px',borderRadius:'24px',fontWeight:800,fontSize:'12px',cursor:'pointer'}}>{loading?'⏳':'↻ REFRESH'}</button>
        </div>
      </div>

      <div style={{background:'#fff',margin:'16px 20px',padding:'14px 16px',borderRadius:'16px',display:'flex',gap:'10px',alignItems:'center',flexWrap:'wrap',boxShadow:'0 4px 12px rgba(0,0,0,.06)',border:'1px solid #e5e7eb'}}>
        <div style={{display:'flex',alignItems:'center',background:'#f3f4f6',borderRadius:'24px',padding:'0 14px',border:'1px solid #e5e7eb',flex:1,minWidth:'220px'}}>
          <span style={{fontSize:'14px'}}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name, phone, email, service, position..." style={{background:'transparent',border:'none',outline:'none',padding:'10px 8px',fontSize:'13px',width:'100%'}}/>
          {search && <button onClick={()=>setSearch("")} style={{background:'transparent',border:'none',cursor:'pointer',fontSize:'14px'}}>✕</button>}
        </div>
        <button onClick={()=>setShowFilters(!showFilters)} style={{background:activeFilterCount?'#0a1931':'#fff',color:activeFilterCount?'#ffcc00':'#0a1931',border:'1px solid #e5e7eb',padding:'10px 16px',borderRadius:'24px',fontWeight:800,fontSize:'12px',cursor:'pointer',whiteSpace:'nowrap'}}>{showFilters?'✕ CLOSE FILTERS':`⚙ FILTERS ${activeFilterCount?`(${activeFilterCount})`:''}`}</button>
        {activeFilterCount>0 && <button onClick={clearFilters} style={{background:'#fee2e2',color:'#dc2626',border:'none',padding:'10px 14px',borderRadius:'24px',fontWeight:700,fontSize:'12px',cursor:'pointer'}}>Clear</button>}
        {selected.length>0 && <button onClick={handleBulkDelete} style={{background:'#dc2626',color:'#fff',border:'none',padding:'10px 16px',borderRadius:'24px',fontWeight:800,fontSize:'12px',cursor:'pointer'}}>🗑 DELETE SELECTED ({selected.length})</button>}
        <div style={{marginLeft:'auto',display:'flex',gap:'8px',alignItems:'center'}}>
          <span style={{fontSize:'12px',color:'#6b7280',fontWeight:700}}>ROWS:</span>
          <select value={rowsPerPage} onChange={e=>setRowsPerPage(Number(e.target.value))} style={{padding:'8px 12px',borderRadius:'20px',border:'1px solid #e5e7eb',fontWeight:700,fontSize:'12px'}}><option value={10}>10</option><option value={15}>15</option><option value={30}>30</option><option value={50}>50</option><option value={100}>100</option></select>
        </div>
      </div>

      {showFilters && (
        <div style={{background:'#fff',margin:'0 20px 16px',padding:'18px',borderRadius:'16px',boxShadow:'0 4px 12px rgba(0,0,0,.06)',border:'1px solid #e5e7eb'}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:'12px'}}>
            <div><label style={{fontSize:'10px',fontWeight:800,color:'#6b7280'}}>DATE FROM</label><input type="date" value={filters.dateFrom} onChange={e=>setFilters({...filters,dateFrom:e.target.value})} style={{width:'100%',padding:'10px',borderRadius:'10px',border:'1px solid #e5e7eb',marginTop:'4px'}}/></div>
            <div><label style={{fontSize:'10px',fontWeight:800,color:'#6b7280'}}>DATE TO</label><input type="date" value={filters.dateTo} onChange={e=>setFilters({...filters,dateTo:e.target.value})} style={{width:'100%',padding:'10px',borderRadius:'10px',border:'1px solid #e5e7eb',marginTop:'4px'}}/></div>
            {tab==='contacts' ? (
              <div><label style={{fontSize:'10px',fontWeight:800,color:'#6b7280'}}>SERVICE</label><select value={filters.service} onChange={e=>setFilters({...filters,service:e.target.value})} style={{width:'100%',padding:'10px',borderRadius:'10px',border:'1px solid #e5e7eb',marginTop:'4px'}}><option value="">All Services</option>{serviceOptions.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
            ) : (
              <>
                <div><label style={{fontSize:'10px',fontWeight:800,color:'#6b7280'}}>POSITION</label><select value={filters.position} onChange={e=>setFilters({...filters,position:e.target.value})} style={{width:'100%',padding:'10px',borderRadius:'10px',border:'1px solid #e5e7eb',marginTop:'4px'}}><option value="">All Positions</option>{positionOptions.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
                <div><label style={{fontSize:'10px',fontWeight:800,color:'#6b7280'}}>DISTRICT</label><select value={filters.district} onChange={e=>setFilters({...filters,district:e.target.value})} style={{width:'100%',padding:'10px',borderRadius:'10px',border:'1px solid #e5e7eb',marginTop:'4px'}}><option value="">All Districts</option>{districtOptions.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
                <div><label style={{fontSize:'10px',fontWeight:800,color:'#6b7280'}}>EDUCATION</label><select value={filters.education} onChange={e=>setFilters({...filters,education:e.target.value})} style={{width:'100%',padding:'10px',borderRadius:'10px',border:'1px solid #e5e7eb',marginTop:'4px'}}><option value="">All Education</option>{educationOptions.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
                <div><label style={{fontSize:'10px',fontWeight:800,color:'#6b7280'}}>EXPERIENCE</label><select value={filters.experience} onChange={e=>setFilters({...filters,experience:e.target.value})} style={{width:'100%',padding:'10px',borderRadius:'10px',border:'1px solid #e5e7eb',marginTop:'4px'}}><option value="">All Experience</option>{experienceOptions.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
                <div><label style={{fontSize:'10px',fontWeight:800,color:'#6b7280'}}>INTEREST</label><select value={filters.interest} onChange={e=>setFilters({...filters,interest:e.target.value})} style={{width:'100%',padding:'10px',borderRadius:'10px',border:'1px solid #e5e7eb',marginTop:'4px'}}><option value="">All Interest</option>{interestOptions.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
              </>
            )}
          </div>
        </div>
      )}

      <div style={{maxWidth:'1600px',margin:'auto',padding:'0 20px 20px'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:'12px',marginBottom:'16px'}}>
          <div onClick={()=>{setTab('contacts'); setSelected([]); setCurrentPage(1)}} style={{background:tab==='contacts'?'#0a1931':'#fff',color:tab==='contacts'?'#fff':'#0a1931',padding:'18px 20px',borderRadius:'16px',cursor:'pointer',border:tab==='contacts'?'2px solid #ffcc00':'1px solid #e5e7eb'}}><p style={{fontSize:'11px',fontWeight:700}}>📞 CONTACTS</p><h2 style={{fontSize:'30px',fontWeight:900,marginTop:'6px'}}>{contacts.length}</h2></div>
          <div onClick={()=>{setTab('applicants'); setSelected([]); setCurrentPage(1)}} style={{background:tab==='applicants'?'#ffcc00':'#fff',color:'#0a1931',padding:'18px 20px',borderRadius:'16px',cursor:'pointer',border:tab==='applicants'?'2px solid #0a1931':'1px solid #e5e7eb'}}><p style={{fontSize:'11px',fontWeight:800}}>🎖️ APPLICANTS</p><h2 style={{fontSize:'30px',fontWeight:900,marginTop:'6px'}}>{applicants.length}</h2></div>
          <div style={{background:'#fff',padding:'18px 20px',borderRadius:'16px',border:'1px solid #e5e7eb'}}><p style={{fontSize:'11px',fontWeight:700,color:'#6b7280'}}>📊 CURRENT VIEW</p><h2 style={{fontSize:'30px',fontWeight:900,marginTop:'6px'}}>{list.length}</h2><button onClick={()=>exportCSV(list,`${tab}.csv`)} style={{marginTop:'8px',background:'#0a1931',color:'#ffcc00',border:'none',padding:'8px 14px',borderRadius:'20px',fontSize:'11px',fontWeight:900,cursor:'pointer'}}>⬇ EXPORT CSV</button></div>
        </div>

        <div style={{background:'#fff',borderRadius:'16px',overflow:'hidden',boxShadow:'0 8px 24px rgba(0,0,0,.08)',border:'2px solid #0a1931'}}>
          <div style={{padding:'14px 18px',display:'flex',justifyContent:'space-between',alignItems:'center',background:tab==='contacts'?'#0a1931':'#111827',color:tab==='contacts'?'#ffcc00':'#fff'}}>
            <div style={{fontWeight:900,fontSize:'13px'}}>{tab==='contacts'?`📞 CONTACTS — ${list.length}`:`🎖️ APPLICANTS — ${list.length}`} • Page {currentPage}/{totalPages}</div>
          </div>
          
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px',minWidth:'1450px'}}>
              <thead>
                <tr style={{background:'#0a1931',color:'#fff'}}>
                  <th style={{padding:'12px 10px',border:'2px solid #1e3a5f',fontSize:'10px'}}><input type="checkbox" checked={isAllSelected} onChange={()=>{ if(isAllSelected) setSelected(prev=>prev.filter(id=>!allPageIds.includes(id))); else setSelected(prev=>[...new Set([...prev, ...allPageIds])]); }}/></th>
                  <th style={{padding:'12px 10px',border:'2px solid #1e3a5f',fontSize:'10px',fontWeight:900,textAlign:'left'}}>DATE (EAT)</th>
                  <th style={{padding:'12px 10px',border:'2px solid #1e3a5f',fontSize:'10px',fontWeight:900,textAlign:'left'}}>FULL NAME</th>
                  <th style={{padding:'12px 10px',border:'2px solid #1e3a5f',fontSize:'10px',fontWeight:900,textAlign:'left'}}>PHONE</th>
                  <th style={{padding:'12px 10px',border:'2px solid #1e3a5f',fontSize:'10px',fontWeight:900,textAlign:'left'}}>EMAIL</th>
                  {tab==='contacts' ? (
                    <>
                      <th style={{padding:'12px 10px',border:'2px solid #1e3a5f',fontSize:'10px',fontWeight:900,textAlign:'left'}}>SERVICE</th>
                      <th style={{padding:'12px 10px',border:'2px solid #1e3a5f',fontSize:'10px',fontWeight:900,textAlign:'left'}}>MESSAGE</th>
                    </>
                  ) : (
                    <>
                      <th style={{padding:'12px 10px',border:'2px solid #1e3a5f',fontSize:'10px',fontWeight:900,textAlign:'left'}}>POSITION</th>
                      <th style={{padding:'12px 10px',border:'2px solid #ffcc00',fontSize:'10px',fontWeight:900,textAlign:'left',background:'#ffcc00',color:'#0a1931'}}>DISTRICT</th>
                      <th style={{padding:'12px 10px',border:'2px solid #1e3a5f',fontSize:'10px',fontWeight:900,textAlign:'left'}}>EDUCATION</th>
                      <th style={{padding:'12px 10px',border:'2px solid #ffcc00',fontSize:'10px',fontWeight:900,textAlign:'center',background:'#ffcc00',color:'#0a1931'}}>EXP</th>
                      <th style={{padding:'12px 10px',border:'2px solid #1e3a5f',fontSize:'10px',fontWeight:900,textAlign:'left'}}>INTEREST</th>
                    </>
                  )}
                  <th style={{padding:'12px 10px',border:'2px solid #1e3a5f',fontSize:'10px',fontWeight:900,textAlign:'center'}}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {paginatedList.length===0 ? (
                  <tr><td colSpan={tab==='contacts'?7:10} style={{padding:'40px',textAlign:'center',border:'1px solid #e5e7eb'}}>No records</td></tr>
                ) : paginatedList.map((d,i)=>{
                  const checked=selected.includes(d._uid);
                  return (
                    <tr key={d._uid} style={{background:checked?'#fff9db':i%2===0?'#fff':'#f8fafb'}}>
                      <td style={{padding:'10px',border:'1px solid #cbd5e1'}}><input type="checkbox" checked={checked} onChange={()=>setSelected(prev=>prev.includes(d._uid)?prev.filter(id=>id!==d._uid):[...prev,d._uid])} /></td>
                      <td style={{padding:'10px',border:'1px solid #cbd5e1',fontSize:'11px',fontWeight:700}}>{getVal(d,['Timestamp','timestamp'])?.slice(0,19)}</td>
                      <td style={{padding:'10px',border:'1px solid #cbd5e1',fontWeight:800,cursor:'pointer'}} onClick={()=>setDetailRow(d)}>{getVal(d,['FullName','fullName'])}</td>
                      <td style={{padding:'10px',border:'1px solid #cbd5e1'}}>{getVal(d,['Phone','phone'])}</td>
                      <td style={{padding:'10px',border:'1px solid #cbd5e1'}}>{getVal(d,['Email','email'])}</td>
                      {tab==='contacts' ? (
                        <>
                          <td style={{padding:'10px',border:'1px solid #cbd5e1'}}>{getVal(d,['Service','service'])}</td>
                          <td style={{padding:'10px',border:'1px solid #cbd5e1',maxWidth:'200px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{getVal(d,['Messages','message'])}</td>
                        </>
                      ) : (
                        <>
                          <td style={{padding:'10px',border:'1px solid #cbd5e1'}}><span style={{background:'#fef3c7',padding:'4px 8px',borderRadius:'12px',fontWeight:700,fontSize:'11px',border:'1px solid #fde68a'}}>{getVal(d,['Position','position'])}</span></td>
                          <td style={{padding:'10px',border:'2px solid #ffcc00',background:'#fffbeb',fontWeight:800}}>{getVal(d,['District','district'])||'-'}</td>
                          <td style={{padding:'10px',border:'1px solid #cbd5e1'}}>{getVal(d,['Education','education'])||'-'}</td>
                          <td style={{padding:'10px',border:'2px solid #ffcc00',background:'#fffbeb',fontWeight:800,textAlign:'center'}}>{getVal(d,['Experience','experience'])||'-'}</td>
                          <td style={{padding:'10px',border:'1px solid #cbd5e1'}}>{getVal(d,['Interest','interest'])||'-'}</td>
                        </>
                      )}
                      <td style={{padding:'10px',border:'1px solid #cbd5e1'}}><div style={{display:'flex',gap:'4px'}}><button onClick={()=>setDetailRow(d)} style={{padding:'5px 8px',borderRadius:'6px',border:'1px solid #e5e7eb',fontSize:'10px',fontWeight:700,cursor:'pointer'}}>VIEW</button><button onClick={()=>handleEdit(d)} style={{padding:'5px 8px',borderRadius:'6px',background:'#ffcc00',border:'1px solid #eab308',fontSize:'10px',fontWeight:800,cursor:'pointer'}}>EDIT</button><button onClick={()=>handleDelete(d)} style={{padding:'5px 8px',borderRadius:'6px',background:'#fee2e2',color:'#dc2626',border:'1px solid #fecaca',fontSize:'10px',fontWeight:800,cursor:'pointer'}}>DEL</button></div></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div style={{padding:'14px 18px',display:'flex',justifyContent:'space-between',alignItems:'center',borderTop:'2px solid #0a1931',background:'#f9fafb',flexWrap:'wrap',gap:'10px'}}>
            <div style={{display:'flex',gap:'6px',alignItems:'center'}}>
              <button disabled={currentPage===1} onClick={()=>setCurrentPage(p=>Math.max(1,p-1))} style={{background:currentPage===1?'#e5e7eb':'#fff',border:'1px solid #cbd5e1',padding:'8px 14px',borderRadius:'10px',fontWeight:800,cursor:'pointer'}}>◂ PREV</button>
              <span style={{background:'#0a1931',color:'#ffcc00',padding:'8px 12px',borderRadius:'10px',fontWeight:800,minWidth:'36px',textAlign:'center'}}>{currentPage}</span>
              <button disabled={currentPage===totalPages} onClick={()=>setCurrentPage(p=>Math.min(totalPages,p+1))} style={{background:currentPage===totalPages?'#e5e7eb':'#0a1931',color:currentPage===totalPages?'#aaa':'#ffcc00',border:'1px solid #cbd5e1',padding:'8px 14px',borderRadius:'10px',fontWeight:800,cursor:'pointer'}}>NEXT ▸</button>
            </div>
            <div style={{fontSize:'12px',color:'#6b7280',fontWeight:600}}>Page {currentPage} of {totalPages} • {list.length} rows • {selected.length} selected • Go to: <input type="number" min={1} max={totalPages} value={currentPage} onChange={e=>setCurrentPage(Math.min(totalPages,Math.max(1,Number(e.target.value)||1)))} style={{width:'50px',padding:'4px',borderRadius:'6px',border:'1px solid #cbd5e1',textAlign:'center'}}/></div>
          </div>
        </div>
      </div>

      {detailRow && (
        <div onClick={()=>setDetailRow(null)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.55)',zIndex:10000,display:'flex',justifyContent:'center',alignItems:'center',padding:'20px'}}>
          <div onClick={e=>e.stopPropagation()} style={{background:'#fff',borderRadius:'20px',width:'100%',maxWidth:'520px',maxHeight:'90vh',overflowY:'auto'}}>
            <div style={{background:'#0a1931',padding:'18px 22px',color:'#fff',display:'flex',justifyContent:'space-between'}}><h3>👤 {getVal(detailRow,['FullName','fullName'])}</h3><button onClick={()=>setDetailRow(null)} style={{background:'rgba(255,255,255,.15)',border:'none',color:'#fff',width:'32px',height:'32px',borderRadius:'10px',cursor:'pointer'}}>✕</button></div>
            <div style={{padding:'20px',display:'grid',gap:'10px'}}>
              {Object.entries(detailRow).filter(([k])=>!k.startsWith('_')).map(([k,v])=><div key={k} style={{display:'flex',justifyContent:'space-between',padding:'10px 12px',border:'1px solid #f3f4f6',borderRadius:'10px',background:'#f9fafb'}}><span style={{fontWeight:800,fontSize:'11px',color:'#6b7280'}}>{k}</span><span style={{fontSize:'12px',fontWeight:600,maxWidth:'60%',textAlign:'right',wordBreak:'break-word'}}>{String(v)}</span></div>)}
              <button onClick={()=>setDetailRow(null)} style={{background:'#0a1931',color:'#ffcc00',border:'none',padding:'12px',borderRadius:'12px',fontWeight:900,cursor:'pointer'}}>CLOSE</button>
            </div>
          </div>
        </div>
      )}

      {editRow && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.55)',zIndex:10001,display:'flex',justifyContent:'center',alignItems:'center',padding:'20px'}}>
          <div style={{background:'#fff',borderRadius:'20px',width:'100%',maxWidth:'520px',padding:'24px'}}>
            <h3 style={{fontWeight:900,marginBottom:'16px'}}>✏️ Edit {form.FullName}</h3>
            <div style={{display:'grid',gap:'10px'}}>{["FullName","Phone","Email","Service","Messages","Position","Education","District","Experience","Interest"].map(f=><div key={f}><label style={{fontSize:'11px',fontWeight:800,color:'#6b7280'}}>{f}</label><input value={form[f]||''} onChange={e=>setForm({...form,[f]:e.target.value})} style={{width:'100%',padding:'10px 12px',borderRadius:'10px',border:'1px solid #e5e7eb',marginTop:'4px'}}/></div>)}</div>
            <div style={{display:'flex',gap:'8px',marginTop:'16px'}}><button onClick={()=>setEditRow(null)} style={{flex:1,padding:'12px',borderRadius:'12px'}}>CANCEL</button><button onClick={handleSave} style={{flex:1,background:'#0a1931',color:'#ffcc00',padding:'12px',borderRadius:'12px',fontWeight:900}}>SAVE</button></div>
          </div>
        </div>
      )}

      {showAdd && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.55)',zIndex:10001,display:'flex',justifyContent:'center',alignItems:'center',padding:'20px'}}>
          <div style={{background:'#fff',borderRadius:'20px',width:'100%',maxWidth:'520px',padding:'24px'}}>
            <h3 style={{fontWeight:900,marginBottom:'16px'}}>➕ Add New {tab.toUpperCase()}</h3>
            <div style={{display:'grid',gap:'10px'}}>{["FullName","Phone","Email","Service","Messages","Position","Education","District","Experience","Interest"].map(f=><div key={f}><label style={{fontSize:'11px',fontWeight:800,color:'#6b7280'}}>{f}</label><input value={form[f]||''} onChange={e=>setForm({...form,[f]:e.target.value})} placeholder={f} style={{width:'100%',padding:'10px 12px',borderRadius:'10px',border:'1px solid #e5e7eb',marginTop:'4px'}}/></div>)}</div>
            <div style={{display:'flex',gap:'8px',marginTop:'16px'}}><button onClick={()=>setShowAdd(false)} style={{flex:1,padding:'12px',borderRadius:'12px'}}>CANCEL</button><button onClick={handleAddNew} style={{flex:1,background:'#ffcc00',padding:'12px',borderRadius:'12px',fontWeight:900}}>ADD</button></div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard;