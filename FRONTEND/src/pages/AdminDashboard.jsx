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
  const [filters, setFilters] = useState({ service:"", position:"", district:"", education:"", experience:"", interest:"", status:"", dateFrom:"", dateTo:"" });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);
  const [detailRow, setDetailRow] = useState(null);
  const [editRow, setEditRow] = useState(null);
  const [form, setForm] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState("");
  // NEW FEATURES - ADDED, NOT CHANGED OLD
  const [darkMode, setDarkMode] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(true);

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(""), 3000); }
  const login = () => pass === ADMIN_PASSWORD ? setAuth(true) : alert("Wrong Password!");
  
  const load = () => {
    setLoading(true);
    fetch(GOOGLE_SHEET_WEBHOOK).then(r=>r.json()).then(d=>{
      const arr = Array.isArray(d)?d:[];
      const map = new Map();
      arr.forEach(row=>{ const ts = (row.Timestamp || row.timestamp || '').trim(); if(!ts) return; if(!map.has(ts)) map.set(ts, row); });
      const uniqueArr = Array.from(map.values());
      const withId = uniqueArr.map((row,i)=>{ 
        // Load status/notes from localStorage to keep without changing sheet
        const saved = JSON.parse(localStorage.getItem(`psl_${row.Timestamp||row.timestamp}`) || '{}');
        return { ...row, Status: saved.Status || row.Status || row.status || 'New', Notes: saved.Notes || row.Notes || row.notes || '', Assigned: saved.Assigned || row.Assigned || '', _uid: `${row.Timestamp||row.timestamp}_${i}`, _index: i }
      });
      const sorted = withId.sort((a,b)=> new Date(b.timestamp||b.Timestamp||0) - new Date(a.timestamp||a.Timestamp||0));
      setData(sorted); setLoading(false);
    }).catch(()=>setLoading(false));
  };
  
  useEffect(()=>{ if(auth) load(); },[auth]);
  useEffect(()=>{ setCurrentPage(1); },[filters, search, tab, rowsPerPage]);
  const getVal = (obj, keys) => { for(let k of keys) if(obj[k]!==undefined && obj[k]!==null && obj[k]!=='') return obj[k]; return ''; }
  
  const handleDelete = async (row) => {
    const uid = row._uid;
    const ts = getVal(row,['Timestamp','timestamp']);
    const fn = getVal(row,['FullName','fullName']);
    const ph = getVal(row,['Phone','phone']);
    setData(prev => prev.filter(r => r._uid !== uid));
    setSelected(prev=>prev.filter(id=>id!==uid));
    if(detailRow && detailRow._uid===uid) setDetailRow(null);
    localStorage.removeItem(`psl_${ts}`);
    showToast("🗑 Deleted from Admin & Sheet");
    await fetch(GOOGLE_SHEET_WEBHOOK,{ method:'POST', mode:'no-cors', headers:{'Content-Type':'text/plain'}, body:JSON.stringify({ action:'delete', timestamp: ts, Timestamp: ts, FullName: fn, Phone: ph }) });
  };
  const handleBulkDelete = async () => {
    if(selected.length===0) return;
    const toDeleteRows = data.filter(r=>selected.includes(r._uid));
    const timestamps = [...new Set(toDeleteRows.map(r=>getVal(r,['Timestamp','timestamp'])))].filter(Boolean);
    const items = toDeleteRows.map(r=>({ FullName:getVal(r,['FullName','fullName']), Phone:getVal(r,['Phone','phone']), timestamp:getVal(r,['Timestamp','timestamp']) }));
    timestamps.forEach(t=>localStorage.removeItem(`psl_${t}`));
    setData(prev => prev.filter(r => !selected.includes(r._uid)));
    setSelected([]); setDetailRow(null);
    showToast(`🗑 ${timestamps.length} deleted from both sides`);
    await fetch(GOOGLE_SHEET_WEBHOOK,{ method:'POST', mode:'no-cors', headers:{'Content-Type':'text/plain'}, body:JSON.stringify({ action:'bulkDelete', timestamps, items }) });
  };
  // NEW: UPDATE STATUS
  const updateStatus = (row, newStatus) => {
    const ts = getVal(row,['Timestamp','timestamp']);
    const saved = JSON.parse(localStorage.getItem(`psl_${ts}`) || '{}');
    localStorage.setItem(`psl_${ts}`, JSON.stringify({...saved, Status:newStatus}));
    setData(prev=>prev.map(r=> r._uid===row._uid ? {...r, Status:newStatus} : r));
    if(detailRow && detailRow._uid===row._uid) setDetailRow({...detailRow, Status:newStatus});
    showToast(`✅ Status: ${newStatus}`);
  };
  const updateNotes = (row, notes, assigned) => {
    const ts = getVal(row,['Timestamp','timestamp']);
    const saved = JSON.parse(localStorage.getItem(`psl_${ts}`) || '{}');
    localStorage.setItem(`psl_${ts}`, JSON.stringify({...saved, Notes:notes, Assigned:assigned}));
    setData(prev=>prev.map(r=> r._uid===row._uid ? {...r, Notes:notes, Assigned:assigned} : r));
  };

  const handleEdit = (row) => {
    setEditRow(row);
    setForm({ FullName:getVal(row,['FullName','fullName']), Phone:getVal(row,['Phone','phone']), Email:getVal(row,['Email','email']), Service:getVal(row,['Service','service']), Message:getVal(row,['Message','Messages','message']), Position:getVal(row,['Position','position']), Education:getVal(row,['Education','education']), District:getVal(row,['District','district']), Experience:getVal(row,['Experience','experience']), Interest:getVal(row,['Interest','interest']), Status:getVal(row,['Status','status'])||'New', Notes:getVal(row,['Notes','notes'])||'', Assigned:getVal(row,['Assigned','assigned'])||'', timestamp:getVal(row,['Timestamp','timestamp']), type: row.type|| (tab==='contacts'?'contact':'applicant') });
  };
  const handleSave = async () => {
    const ts = form.timestamp;
    const saved = JSON.parse(localStorage.getItem(`psl_${ts}`) || '{}');
    localStorage.setItem(`psl_${ts}`, JSON.stringify({...saved, Status:form.Status, Notes:form.Notes, Assigned:form.Assigned}));
    setData(prev => prev.map(r => r._uid===editRow._uid ? { ...r, ...form, Timestamp: ts, timestamp: ts, Status:form.Status, Notes:form.Notes, Assigned:form.Assigned } : r));
    if(detailRow && detailRow._uid===editRow._uid) setDetailRow({...detailRow, ...form});
    setEditRow(null); showToast("✅ Updated");
    await fetch(GOOGLE_SHEET_WEBHOOK,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain'},body:JSON.stringify({ action:'update', ...form, timestamp: ts, type: form.type })});
  };
  const handleAddNew = async () => {
    const ts = getFullDateTime24();
    const payload = { ...form, timestamp:ts, Timestamp:ts, type:tab==='contacts'?'contact':'applicant' };
    setData(prev=>[{...payload, _uid:`${ts}_${Date.now()}`, Status:'New'},...prev]);
    setShowAdd(false); setForm({}); showToast("✅ Added");
    await fetch(GOOGLE_SHEET_WEBHOOK,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain'},body:JSON.stringify(payload)});
  };
  const unique = (keyArr) => [...new Set(data.map(d=>getVal(d,keyArr)).filter(v=>v))].sort();

  if(!auth){
    return ( 
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#0f172a 0%,#1e293b 50%,#0f172a 100%)',display:'flex',justifyContent:'center',alignItems:'center',fontFamily:'Inter, Arial'}}>
      <div style={{background:'#ffffff',padding:'44px 36px',borderRadius:'24px',width:'92%',maxWidth:'400px',textAlign:'center',boxShadow:'0 25px 80px rgba(0,0,0,.4)',border:'1px solid rgba(255,255,255,.1)'}}>
        <div style={{width:'72px',height:'72px',background:'linear-gradient(135deg,#facc15,#eab308)',borderRadius:'20px',margin:'0 auto 18px',display:'grid',placeItems:'center',color:'#0f172a',fontSize:'30px',fontWeight:900,boxShadow:'0 8px 20px rgba(250,204,21,.4)'}}>P</div>
        <h2 style={{fontWeight:900,color:'#0f172a',fontSize:'22px',letterSpacing:'-0.5px'}}>PINNACLE ADMIN</h2>
        <p style={{color:'#64748b',fontSize:'12px',marginTop:'6px',fontWeight:600,letterSpacing:'1px'}}>SECURITY LTD • CONTROL CENTER</p>
        <input type="password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&login()} placeholder="Admin Password" style={{width:'100%',padding:'15px 18px',borderRadius:'14px',marginTop:'26px',border:'2px solid #e2e8f0',outline:'none',fontSize:'14px'}}/>
        <button onClick={login} style={{width:'100%',marginTop:'16px',background:'linear-gradient(135deg,#facc15,#eab308)',padding:'15px',borderRadius:'14px',fontWeight:900,border:'none',cursor:'pointer',color:'#0f172a',letterSpacing:'0.5px',boxShadow:'0 6px 16px rgba(250,204,21,.4)'}}>UNLOCK DASHBOARD →</button>
      </div>
    </div> )
  }

  const applicants = data.filter(d => (d.type==='applicant') || getVal(d,['Position','position']));
  const contacts = data.filter(d => (d.type==='contact') || getVal(d,['Service','service']));
  const total = data.length;
  const applyFilters = (list) => list.filter(d=>{
    const s = `${getVal(d,['FullName','fullName'])} ${getVal(d,['Phone','phone'])} ${getVal(d,['Email','email'])} ${getVal(d,['Service','service'])} ${getVal(d,['Position','position'])} ${getVal(d,['District','district'])} ${getVal(d,['Status','status'])}`.toLowerCase();
    if(search && !s.includes(search.toLowerCase())) return false;
    if(filters.service && getVal(d,['Service','service']).toLowerCase() !== filters.service.toLowerCase()) return false;
    if(filters.position && getVal(d,['Position','position']).toLowerCase() !== filters.position.toLowerCase()) return false;
    if(filters.district && getVal(d,['District','district']).toLowerCase() !== filters.district.toLowerCase()) return false;
    if(filters.education && getVal(d,['Education','education']).toLowerCase() !== filters.education.toLowerCase()) return false;
    if(filters.experience && getVal(d,['Experience','experience']).toLowerCase() !== filters.experience.toLowerCase()) return false;
    if(filters.interest && getVal(d,['Interest','interest']).toLowerCase() !== filters.interest.toLowerCase()) return false;
    if(filters.status && getVal(d,['Status','status']).toLowerCase() !== filters.status.toLowerCase()) return false;
    const ts = new Date(getVal(d,['Timestamp','timestamp']));
    if(filters.dateFrom && ts < new Date(filters.dateFrom)) return false;
    if(filters.dateTo && ts > new Date(filters.dateTo + 'T23:59:59')) return false;
    return true;
  });
  const filteredContacts = applyFilters(contacts); 
  const filteredApplicants = applyFilters(applicants);
  const list = tab==='contacts'?filteredContacts:filteredApplicants;
  const paginatedList = list.slice((currentPage-1)*rowsPerPage, currentPage*rowsPerPage);
  const clearFilters = () => setFilters({ service:"", position:"", district:"", education:"", experience:"", interest:"", status:"", dateFrom:"", dateTo:"" });

  // ANALYTICS DATA
  const statusCounts = {New: data.filter(d=>getVal(d,['Status','status'])==='New' || !getVal(d,['Status','status'])).length, Contacted: data.filter(d=>getVal(d,['Status','status'])==='Contacted').length, Interviewed: data.filter(d=>getVal(d,['Status','status'])==='Interviewed').length, Hired: data.filter(d=>getVal(d,['Status','status'])==='Hired').length, Rejected: data.filter(d=>getVal(d,['Status','status'])==='Rejected').length };
  const topDistricts = [...new Set(data.map(d=>getVal(d,['District','district'])).filter(Boolean))].map(dist=>({name:dist, count:data.filter(d=>getVal(d,['District','district'])===dist).length})).sort((a,b)=>b.count-a.count).slice(0,5);
  const topServices = [...new Set(data.map(d=>getVal(d,['Service','service'])).filter(Boolean))].map(s=>({name:s, count:data.filter(d=>getVal(d,['Service','service'])===s).length})).sort((a,b)=>b.count-a.count).slice(0,5);

  const getStatusColor = (s) => {
    if(s==='New') return {bg:'#e0f2fe', color:'#0369a1', border:'#7dd3fc'};
    if(s==='Contacted') return {bg:'#fef9c3', color:'#a16207', border:'#fde68a'};
    if(s==='Interviewed') return {bg:'#e0e7ff', color:'#4338ca', border:'#a5b4fc'};
    if(s==='Hired') return {bg:'#dcfce7', color:'#15803d', border:'#86efac'};
    if(s==='Rejected') return {bg:'#fee2e2', color:'#b91c1c', border:'#fca5a5'};
    return {bg:'#f1f5f9', color:'#475569', border:'#e2e8f0'};
  };

  const exportCSV = (rows, filename) => {
    if(!rows.length) return;
    const headers = tab==='contacts'?["Timestamp","FullName","Phone","Email","Service","Message","Status","Notes","Assigned"]:["Timestamp","FullName","Phone","Email","Position","Education","District","Experience","Interest","Status","Notes","Assigned"];
    const csv = [headers.join(",")].concat(rows.map(r=> headers.map(h=>`"${String(getVal(r,[h,h.toLowerCase()])||'').replace(/"/g,'""')}"`).join(","))).join("\n");
    const blob = new Blob([csv],{type:"text/csv"}); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download=filename; a.click();
    showToast("📥 Exported CSV");
  };

  const bgMain = darkMode ? '#0f172a' : '#f1f5f9';
  const bgCard = darkMode ? '#1e293b' : '#ffffff';
  const textMain = darkMode ? '#f1f5f9' : '#0f172a';

  return (
    <div style={{background:bgMain,minHeight:'100vh',fontFamily:'Inter, Arial',color:textMain,transition:'0.3s'}}>
      {toast && <div style={{position:'fixed',top:'22px',right:'22px',background:'#0f172a',color:'#facc15',padding:'13px 22px',borderRadius:'30px',fontWeight:900,fontSize:'13px',zIndex:99999,boxShadow:'0 8px 24px rgba(0,0,0,.2)',border:'1px solid #facc15'}}>{toast}</div>}
      
      <div style={{background:'linear-gradient(90deg,#0f172a 0%,#1e293b 100%)',padding:'16px 22px',display:'flex',justifyContent:'space-between',alignItems:'center',position:'sticky',top:0,zIndex:100,borderBottom:'4px solid #facc15',flexWrap:'wrap',gap:'12px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'14px'}}>
          <div style={{width:'46px',height:'46px',background:'linear-gradient(135deg,#facc15,#eab308)',borderRadius:'14px',display:'grid',placeItems:'center',fontWeight:900,color:'#0f172a',fontSize:'20px',boxShadow:'0 4px 12px rgba(250,204,21,.3)'}}>P</div>
          <div><h1 style={{color:'#fff',fontWeight:900,fontSize:'16px',letterSpacing:'-0.3px'}}>PINNACLE SECURITY LTD</h1><p style={{color:'#facc15',fontSize:'11px',fontWeight:700,letterSpacing:'1px'}}>ADMIN • {total} TOTAL RECORDS • {statusCounts.Hired} HIRED</p></div>
        </div>
        <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
          <button onClick={()=>setDarkMode(!darkMode)} style={{background:darkMode?'#facc15':'rgba(255,255,255,.12)',color:darkMode?'#0f172a':'#fff',border:'none',padding:'10px 14px',borderRadius:'24px',fontWeight:900,fontSize:'12px',cursor:'pointer'}}>{darkMode?'☀️ LIGHT':'🌙 DARK'}</button>
          <button onClick={()=>setShowAnalytics(!showAnalytics)} style={{background:'rgba(255,255,255,.12)',color:'#fff',border:'1px solid rgba(255,255,255,.15)',padding:'10px 14px',borderRadius:'24px',fontWeight:800,fontSize:'11px',cursor:'pointer'}}>{showAnalytics?'📊 HIDE CHARTS':'📊 SHOW CHARTS'}</button>
          <a href="/" style={{background:'#facc15',color:'#0f172a',padding:'10px 18px',borderRadius:'24px',fontWeight:900,fontSize:'12px',textDecoration:'none',boxShadow:'0 4px 10px rgba(250,204,21,.3)'}}>🏠 WEBSITE</a>
          <button onClick={()=>{setForm({}); setShowAdd(true)}} style={{background:'#fff',color:'#0f172a',border:'none',padding:'10px 18px',borderRadius:'24px',fontWeight:900,fontSize:'12px',cursor:'pointer'}}>＋ ADD</button>
          <button onClick={load} style={{background:'rgba(255,255,255,.12)',color:'#fff',border:'1px solid rgba(255,255,255,.15)',padding:'10px 18px',borderRadius:'24px',fontWeight:800,fontSize:'12px',cursor:'pointer',backdropFilter:'blur(10px)'}}>{loading?'⏳':'↻ REFRESH'}</button>
        </div>
      </div>

      {showAnalytics && (
        <div style={{maxWidth:'1600px',margin:'18px auto 0',padding:'0 20px',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:'14px'}}>
          <div style={{background:bgCard,padding:'18px 20px',borderRadius:'18px',border:`1px solid ${darkMode?'#334155':'#e2e8f0'}`,boxShadow:'0 4px 16px rgba(0,0,0,.06)'}}>
            <h4 style={{fontWeight:900,fontSize:'12px',letterSpacing:'1px',marginBottom:'12px'}}>📊 STATUS OVERVIEW</h4>
            {Object.entries(statusCounts).map(([k,v])=>{ const c=getStatusColor(k); const pct = total?Math.round((v/total)*100):0; return <div key={k} style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'8px'}}><span style={{width:'80px',fontSize:'11px',fontWeight:800}}>{k}</span><div style={{flex:1,height:'10px',background:'#f1f5f9',borderRadius:'10px',overflow:'hidden'}}><div style={{width:`${pct}%`,height:'100%',background:c.border,transition:'0.5s'}}/></div><span style={{fontSize:'11px',fontWeight:900,width:'60px',textAlign:'right'}}>{v} ({pct}%)</span></div> })}
          </div>
          <div style={{background:bgCard,padding:'18px 20px',borderRadius:'18px',border:`1px solid ${darkMode?'#334155':'#e2e8f0'}`,boxShadow:'0 4px 16px rgba(0,0,0,.06)'}}>
            <h4 style={{fontWeight:900,fontSize:'12px',letterSpacing:'1px',marginBottom:'12px'}}>🗺️ TOP DISTRICTS</h4>
            {topDistricts.map(d=> <div key={d.name} style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'8px'}}><span style={{width:'90px',fontSize:'11px',fontWeight:800,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d.name}</span><div style={{flex:1,height:'10px',background:'#f1f5f9',borderRadius:'10px',overflow:'hidden'}}><div style={{width:`${Math.round((d.count/(topDistricts[0]?.count||1))*100)}%`,height:'100%',background:'#facc15'}}/></div><span style={{fontSize:'11px',fontWeight:900}}>{d.count}</span></div> )}
            {topDistricts.length===0 && <p style={{fontSize:'11px',color:'#94a3b8'}}>No district data</p>}
          </div>
          <div style={{background:bgCard,padding:'18px 20px',borderRadius:'18px',border:`1px solid ${darkMode?'#334155':'#e2e8f0'}`,boxShadow:'0 4px 16px rgba(0,0,0,.06)'}}>
            <h4 style={{fontWeight:900,fontSize:'12px',letterSpacing:'1px',marginBottom:'12px'}}>🛡️ TOP SERVICES</h4>
            {topServices.map(s=> <div key={s.name} style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'8px'}}><span style={{width:'110px',fontSize:'11px',fontWeight:800,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{s.name}</span><div style={{flex:1,height:'10px',background:'#f1f5f9',borderRadius:'10px',overflow:'hidden'}}><div style={{width:`${Math.round((s.count/(topServices[0]?.count||1))*100)}%`,height:'100%',background:'#0f172a'}}/></div><span style={{fontSize:'11px',fontWeight:900}}>{s.count}</span></div> )}
            {topServices.length===0 && <p style={{fontSize:'11px',color:'#94a3b8'}}>No service data</p>}
          </div>
        </div>
      )}

      <div style={{background:bgCard,margin:'18px 20px',padding:'16px 18px',borderRadius:'18px',display:'flex',gap:'12px',alignItems:'center',flexWrap:'wrap',boxShadow:'0 4px 20px rgba(15,23,42,.06)',border:`1px solid ${darkMode?'#334155':'#e2e8f0'}`}}>
        <div style={{display:'flex',alignItems:'center',background:darkMode?'#0f172a':'#f8fafc',borderRadius:'24px',padding:'0 16px',border:`1px solid ${darkMode?'#334155':'#e2e8f0'}`,flex:1,minWidth:'240px'}}>
          <span>🔍</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name, phone, email, service..." style={{background:'transparent',border:'none',outline:'none',padding:'12px 10px',width:'100%',fontSize:'13px',color:textMain}}/>
          {search && <button onClick={()=>setSearch("")} style={{background:'transparent',border:'none',cursor:'pointer'}}>✕</button>}
        </div>
        <button onClick={()=>setShowFilters(!showFilters)} style={{background:filters.service||filters.district||filters.status?'#0f172a':'#fff',color:filters.service||filters.district||filters.status?'#facc15':'#0f172a',border:'1px solid #e2e8f0',padding:'11px 18px',borderRadius:'24px',fontWeight:800,fontSize:'12px',cursor:'pointer'}}>{showFilters?'✕ CLOSE FILTERS':`⚙ FILTERS ${Object.values(filters).filter(Boolean).length?`(${Object.values(filters).filter(Boolean).length})`:''}`}</button>
        {selected.length>0 && <button onClick={handleBulkDelete} style={{background:'linear-gradient(135deg,#dc2626,#b91c1c)',color:'#fff',border:'none',padding:'11px 18px',borderRadius:'24px',fontWeight:800,fontSize:'12px',cursor:'pointer',boxShadow:'0 4px 12px rgba(220,38,38,.3)'}}>🗑 DELETE SELECTED ({selected.length})</button>}
        <div style={{marginLeft:'auto',display:'flex',gap:'10px',alignItems:'center'}}><span style={{fontSize:'12px',color:'#64748b',fontWeight:700}}>ROWS:</span><select value={rowsPerPage} onChange={e=>setRowsPerPage(Number(e.target.value))} style={{padding:'9px 14px',borderRadius:'20px',border:'1px solid #e2e8f0',fontWeight:700,background:'#fff'}}><option value={5}>5</option><option value={10}>10</option><option value={15}>15</option><option value={20}>20</option><option value={30}>30</option><option value={50}>50</option><option value={100}>100</option></select></div>
      </div>

      {showFilters && (
        <div style={{background:bgCard,margin:'0 20px 18px',padding:'18px 20px',borderRadius:'18px',border:`1px solid ${darkMode?'#334155':'#e2e8f0'}`,display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:'12px'}}>
          <select value={filters.service} onChange={e=>setFilters({...filters, service:e.target.value})} style={{padding:'11px 14px',borderRadius:'12px',border:'1px solid #e2e8f0'}}><option value="">All Services</option>{[...new Set(data.map(d=>getVal(d,['Service','service'])).filter(Boolean))].map(o=><option key={o} value={o}>{o}</option>)}</select>
          <select value={filters.position} onChange={e=>setFilters({...filters, position:e.target.value})} style={{padding:'11px 14px',borderRadius:'12px',border:'1px solid #e2e8f0'}}><option value="">All Positions</option>{[...new Set(data.map(d=>getVal(d,['Position','position'])).filter(Boolean))].map(o=><option key={o} value={o}>{o}</option>)}</select>
          <select value={filters.district} onChange={e=>setFilters({...filters, district:e.target.value})} style={{padding:'11px 14px',borderRadius:'12px',border:'1px solid #e2e8f0'}}><option value="">All Districts</option>{[...new Set(data.map(d=>getVal(d,['District','district'])).filter(Boolean))].map(o=><option key={o} value={o}>{o}</option>)}</select>
          <select value={filters.status} onChange={e=>setFilters({...filters, status:e.target.value})} style={{padding:'11px 14px',borderRadius:'12px',border:'1px solid #e2e8f0'}}><option value="">All Status</option><option>New</option><option>Contacted</option><option>Interviewed</option><option>Hired</option><option>Rejected</option></select>
          <input type="date" value={filters.dateFrom} onChange={e=>setFilters({...filters, dateFrom:e.target.value})} style={{padding:'11px 14px',borderRadius:'12px',border:'1px solid #e2e8f0'}}/>
          <input type="date" value={filters.dateTo} onChange={e=>setFilters({...filters, dateTo:e.target.value})} style={{padding:'11px 14px',borderRadius:'12px',border:'1px solid #e2e8f0'}}/>
          <button onClick={clearFilters} style={{padding:'11px',borderRadius:'12px',background:'#fee2e2',color:'#dc2626',border:'1px solid #fecaca',fontWeight:800,cursor:'pointer'}}>Clear Filters</button>
        </div>
      )}

      <div style={{maxWidth:'1600px',margin:'auto',padding:'0 20px 20px'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:'14px',marginBottom:'18px'}}>
          <div onClick={()=>{setTab('contacts'); setSelected([]); setCurrentPage(1)}} style={{background:tab==='contacts'?'linear-gradient(135deg,#0f172a,#1e293b)':'#fff',color:tab==='contacts'?'#fff':'#0f172a',padding:'20px 22px',borderRadius:'18px',cursor:'pointer',border:tab==='contacts'?'2px solid #facc15':'1px solid #e2e8f0',boxShadow:'0 4px 16px rgba(0,0,0,.06)'}}><p style={{fontSize:'11px',fontWeight:800,letterSpacing:'1px',opacity:.8}}>📞 CONTACTS</p><h2 style={{fontSize:'32px',fontWeight:900,marginTop:'6px'}}>{contacts.length}</h2><p style={{fontSize:'10px',marginTop:'4px',opacity:.7}}>Click to view</p></div>
          <div onClick={()=>{setTab('applicants'); setSelected([]); setCurrentPage(1)}} style={{background:tab==='applicants'?'linear-gradient(135deg,#facc15,#eab308)':'#fff',color:'#0f172a',padding:'20px 22px',borderRadius:'18px',cursor:'pointer',border:tab==='applicants'?'2px solid #0f172a':'1px solid #e2e8f0',boxShadow:'0 4px 16px rgba(0,0,0,.06)'}}><p style={{fontSize:'11px',fontWeight:900,letterSpacing:'1px'}}>🎖️ APPLICANTS</p><h2 style={{fontSize:'32px',fontWeight:900,marginTop:'6px'}}>{applicants.length}</h2></div>
          <div style={{background:'#fff',padding:'20px 22px',borderRadius:'18px',border:'2px dashed #0f172a'}}><p style={{fontSize:'11px',fontWeight:800,color:'#0f172a',letterSpacing:'1px'}}>📊 TOTAL</p><h2 style={{fontSize:'32px',fontWeight:900,color:'#0f172a',marginTop:'6px'}}>{total}</h2><p style={{fontSize:'11px',color:'#64748b',marginTop:'4px'}}>{statusCounts.Hired} hired • {statusCounts.New} new</p></div>
          <div style={{background:'#fff',padding:'20px 22px',borderRadius:'18px',border:'1px solid #e2e8f0'}}><p style={{fontSize:'11px',fontWeight:700,color:'#64748b',letterSpacing:'1px'}}>👁 CURRENT VIEW</p><h2 style={{fontSize:'32px',fontWeight:900,marginTop:'6px'}}>{list.length}</h2><div style={{display:'flex',gap:'6px',marginTop:'10px'}}><button onClick={()=>exportCSV(list,`${tab}.csv`)} style={{background:'#0f172a',color:'#facc15',border:'none',padding:'8px 12px',borderRadius:'20px',fontSize:'10px',fontWeight:900,cursor:'pointer'}}>⬇ CSV</button><button onClick={()=>window.print()} style={{background:'#fff',color:'#0f172a',border:'1px solid #e2e8f0',padding:'8px 12px',borderRadius:'20px',fontSize:'10px',fontWeight:800,cursor:'pointer'}}>🖨️ PRINT</button></div></div>
        </div>

        <div style={{background:bgCard,borderRadius:'18px',overflow:'hidden',border:`2px solid ${darkMode?'#334155':'#0f172a'}`,boxShadow:'0 12px 32px rgba(15,23,42,.12)'}}>
          <div style={{padding:'16px 20px',background:tab==='contacts'?'linear-gradient(90deg,#0f172a,#1e293b)':'linear-gradient(90deg,#1e293b,#334155)',color:tab==='contacts'?'#facc15':'#fff',fontWeight:900,fontSize:'13px',display:'flex',justifyContent:'space-between'}}>
            <span>{tab==='contacts'?`📞 CONTACTS — ${list.length}`:`🎖️ APPLICANTS — ${list.length}`} • Page {currentPage}/{Math.ceil(list.length/rowsPerPage)||1}</span><span style={{opacity:.7}}>{selected.length} selected • {statusCounts.New} new</span>
          </div>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px',minWidth:'1650px'}}>
              <thead><tr style={{background:'#0f172a',color:'#fff'}}>
                <th style={{padding:'13px 12px',border:'1px solid #1e293b'}}><input type="checkbox" checked={paginatedList.length>0 && paginatedList.every(r=>selected.includes(r._uid))} onChange={()=>{ const ids=paginatedList.map(r=>r._uid); if(ids.every(id=>selected.includes(id))) setSelected(prev=>prev.filter(id=>!ids.includes(id))); else setSelected(prev=>[...new Set([...prev,...ids])]); }}/></th>
                <th style={{padding:'13px 12px',border:'1px solid #1e293b',textAlign:'left',fontWeight:900}}>DATE</th><th style={{padding:'13px 12px',border:'1px solid #1e293b',textAlign:'left',fontWeight:900}}>FULL NAME</th><th style={{padding:'13px 12px',border:'1px solid #1e293b',textAlign:'left',fontWeight:900}}>PHONE</th><th style={{padding:'13px 12px',border:'1px solid #1e293b',textAlign:'left',fontWeight:900}}>STATUS</th>
                {tab==='contacts'?<><th style={{padding:'13px 12px',border:'1px solid #1e293b',textAlign:'left',fontWeight:900}}>SERVICE</th><th style={{padding:'13px 12px',border:'1px solid #1e293b',textAlign:'left',fontWeight:900}}>MESSAGE</th></>:<><th style={{padding:'13px 12px',border:'1px solid #1e293b',textAlign:'left',fontWeight:900}}>POSITION</th><th style={{padding:'13px 12px',border:'1px solid #facc15',background:'#facc15',color:'#0f172a',fontWeight:900}}>DISTRICT</th><th style={{padding:'13px 12px',border:'1px solid #1e293b',fontWeight:900}}>EDU</th><th style={{padding:'13px 12px',border:'1px solid #facc15',background:'#facc15',color:'#0f172a',fontWeight:900}}>EXP</th></>}
                <th style={{padding:'13px 12px',border:'1px solid #1e293b',fontWeight:900}}>QUICK</th>
                <th style={{padding:'13px 12px',border:'1px solid #1e293b',fontWeight:900}}>ACTIONS</th>
              </tr></thead>
              <tbody>{paginatedList.map((d,i)=>{ const checked=selected.includes(d._uid); const st=getVal(d,['Status','status'])||'New'; const sc=getStatusColor(st); return (<tr key={d._uid} style={{background:checked?'#fef9c3':i%2===0?bgCard:darkMode?'#0f172a':'#f8fafc',transition:'0.2s'}}><td style={{padding:'11px',border:'1px solid #e2e8f0'}}><input type="checkbox" checked={checked} onChange={()=>setSelected(prev=>prev.includes(d._uid)?prev.filter(id=>id!==d._uid):[...prev,d._uid])}/></td><td style={{padding:'11px',border:'1px solid #e2e8f0',fontWeight:600}}>{getVal(d,['Timestamp','timestamp'])?.slice(0,19)}</td><td style={{padding:'11px',border:'1px solid #e2e8f0',fontWeight:800}}>{getVal(d,['FullName','fullName'])}<div style={{fontSize:'10px',color:'#64748b',fontWeight:600}}>{getVal(d,['Assigned','assigned'])?`👤 ${getVal(d,['Assigned','assigned'])}`:''}</div></td><td style={{padding:'11px',border:'1px solid #e2e8f0'}}>{getVal(d,['Phone','phone'])}</td><td style={{padding:'11px',border:'1px solid #e2e8f0'}}><select value={st} onChange={e=>updateStatus(d,e.target.value)} style={{padding:'5px 8px',borderRadius:'12px',fontSize:'10px',fontWeight:800,background:sc.bg,color:sc.color,border:`1px solid ${sc.border}`,cursor:'pointer'}}><option>New</option><option>Contacted</option><option>Interviewed</option><option>Hired</option><option>Rejected</option></select></td>{tab==='contacts'?<><td style={{padding:'11px',border:'1px solid #e2e8f0'}}>{getVal(d,['Service','service'])}</td><td style={{padding:'11px',border:'1px solid #e2e8f0',maxWidth:'160px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}} title={getVal(d,['Message','Messages','message'])}>{getVal(d,['Message','Messages','message'])}</td></>:<><td style={{padding:'11px',border:'1px solid #e2e8f0'}}><span style={{background:'#fef9c3',padding:'5px 10px',borderRadius:'12px',fontWeight:700,border:'1px solid #fde68a',fontSize:'11px'}}>{getVal(d,['Position','position'])}</span></td><td style={{padding:'11px',border:'1px solid #facc15',background:'#fffbeb',fontWeight:800}}>{getVal(d,['District','district'])}</td><td style={{padding:'11px',border:'1px solid #e2e8f0'}}>{getVal(d,['Education','education'])}</td><td style={{padding:'11px',border:'1px solid #facc15',background:'#fffbeb',textAlign:'center',fontWeight:800}}>{getVal(d,['Experience','experience'])}</td></>}<td style={{padding:'11px',border:'1px solid #e2e8f0'}}><div style={{display:'flex',gap:'4px'}}><a href={`https://wa.me/${String(getVal(d,['Phone','phone'])).replace(/[^0-9]/g,'')}`} target="_blank" style={{padding:'5px 7px',borderRadius:'8px',background:'#dcfce7',border:'1px solid #86efac',fontSize:'11px',textDecoration:'none',fontWeight:800}}>💬</a><a href={`tel:${getVal(d,['Phone','phone'])}`} style={{padding:'5px 7px',borderRadius:'8px',background:'#e0f2fe',border:'1px solid #7dd3fc',fontSize:'11px',textDecoration:'none',fontWeight:800}}>📞</a><a href={`mailto:${getVal(d,['Email','email'])}`} style={{padding:'5px 7px',borderRadius:'8px',background:'#fef9c3',border:'1px solid #fde68a',fontSize:'11px',textDecoration:'none',fontWeight:800}}>✉️</a></div></td><td style={{padding:'11px',border:'1px solid #e2e8f0'}}><div style={{display:'flex',gap:'5px'}}><button onClick={()=>setDetailRow(d)} style={{padding:'6px 10px',borderRadius:'8px',border:'1px solid #e2e8f0',fontSize:'10px',fontWeight:700,cursor:'pointer',background:'#fff'}}>VIEW</button><button onClick={()=>handleEdit(d)} style={{padding:'6px 10px',borderRadius:'8px',background:'#facc15',border:'1px solid #eab308',fontSize:'10px',fontWeight:800,cursor:'pointer'}}>EDIT</button><button onClick={()=>handleDelete(d)} style={{padding:'6px 10px',borderRadius:'8px',background:'#fee2e2',color:'#dc2626',border:'1px solid #fecaca',fontSize:'10px',fontWeight:800,cursor:'pointer'}}>DEL</button></div></td></tr>)})}</tbody>
            </table>
          </div>
          <div style={{padding:'14px 20px',display:'flex',justifyContent:'space-between',background:darkMode?'#1e293b':'#f8fafc',borderTop:`2px solid ${darkMode?'#334155':'#0f172a'}`}}>
            <div style={{display:'flex',gap:'8px'}}><button disabled={currentPage===1} onClick={()=>setCurrentPage(p=>Math.max(1,p-1))} style={{padding:'9px 16px',borderRadius:'12px',fontWeight:800,cursor:'pointer',border:'1px solid #e2e8f0',background:'#fff'}}>◂ PREV</button><span style={{background:'#0f172a',color:'#facc15',padding:'9px 14px',borderRadius:'12px',fontWeight:800}}>{currentPage}</span><button disabled={currentPage===Math.ceil(list.length/rowsPerPage)} onClick={()=>setCurrentPage(p=>p+1)} style={{padding:'9px 16px',borderRadius:'12px',fontWeight:800,cursor:'pointer',border:'1px solid #e2e8f0',background:'#fff'}}>NEXT ▸</button></div>
            <div style={{fontSize:'12px',color:'#64748b',fontWeight:600}}>Page {currentPage} of {Math.ceil(list.length/rowsPerPage)||1} • {list.length} rows • {statusCounts.Hired} hired</div>
          </div>
        </div>
      </div>

      {detailRow && <div onClick={()=>setDetailRow(null)} style={{position:'fixed',inset:0,background:'rgba(15,23,42,.6)',zIndex:10000,display:'flex',justifyContent:'center',alignItems:'center',padding:'20px',backdropFilter:'blur(6px)'}}><div onClick={e=>e.stopPropagation()} style={{background:'#fff',borderRadius:'22px',width:'100%',maxWidth:'560px',padding:'24px',boxShadow:'0 24px 64px rgba(0,0,0,.3)'}}><h3 style={{fontWeight:900,display:'flex',justifyContent:'space-between'}}>👤 {getVal(detailRow,['FullName','fullName'])} <span style={{fontSize:'11px',padding:'6px 12px',borderRadius:'20px',background:getStatusColor(getVal(detailRow,['Status','status'])).bg,color:getStatusColor(getVal(detailRow,['Status','status'])).color}}>{getVal(detailRow,['Status','status'])||'New'}</span></h3>
        <div style={{display:'flex',gap:'8px',marginTop:'12px'}}><a href={`https://wa.me/${String(getVal(detailRow,['Phone','phone'])).replace(/[^0-9]/g,'')}`} target="_blank" style={{flex:1,background:'#22c55e',color:'#fff',padding:'10px',borderRadius:'12px',textAlign:'center',textDecoration:'none',fontWeight:800,fontSize:'12px'}}>💬 WHATSAPP</a><a href={`tel:${getVal(detailRow,['Phone','phone'])}`} style={{flex:1,background:'#0ea5e9',color:'#fff',padding:'10px',borderRadius:'12px',textAlign:'center',textDecoration:'none',fontWeight:800,fontSize:'12px'}}>📞 CALL</a><a href={`mailto:${getVal(detailRow,['Email','email'])}`} style={{flex:1,background:'#facc15',color:'#0f172a',padding:'10px',borderRadius:'12px',textAlign:'center',textDecoration:'none',fontWeight:800,fontSize:'12px'}}>✉️ EMAIL</a></div>
        <div style={{display:'grid',gap:'8px',marginTop:'14px'}}>{Object.entries(detailRow).filter(([k])=>!k.startsWith('_')).map(([k,v])=><div key={k} style={{display:'flex',justifyContent:'space-between',padding:'10px 14px',background:'#f8fafc',borderRadius:'12px',border:'1px solid #e2e8f0'}}><span style={{fontWeight:800,fontSize:'11px',color:'#0f172a'}}>{k}</span><span style={{fontSize:'12px',maxWidth:'60%',textAlign:'right',overflowWrap:'anywhere'}}>{String(v)}</span></div>)}</div>
        <div style={{marginTop:'14px',display:'grid',gap:'8px'}}><textarea value={detailRow.Notes||''} onChange={e=>{ const nt=e.target.value; setDetailRow({...detailRow, Notes:nt}); updateNotes(detailRow, nt, detailRow.Assigned||''); }} placeholder="Add private notes..." style={{padding:'12px',borderRadius:'12px',border:'1px solid #e2e8f0',minHeight:'70px'}}/><input value={detailRow.Assigned||''} onChange={e=>{ const as=e.target.value; setDetailRow({...detailRow, Assigned:as}); updateNotes(detailRow, detailRow.Notes||'', as); }} placeholder="Assigned to..." style={{padding:'12px',borderRadius:'12px',border:'1px solid #e2e8f0'}}/></div>
        <button onClick={()=>setDetailRow(null)} style={{marginTop:'14px',background:'#0f172a',color:'#facc15',width:'100%',padding:'13px',borderRadius:'14px',fontWeight:900,border:'none',cursor:'pointer'}}>CLOSE</button></div></div>}

      {editRow && <div style={{position:'fixed',inset:0,background:'rgba(15,23,42,.6)',zIndex:10001,display:'flex',justifyContent:'center',alignItems:'center',padding:'20px',backdropFilter:'blur(6px)'}}><div style={{background:'#fff',borderRadius:'22px',width:'100%',maxWidth:'560px',padding:'26px',boxShadow:'0 24px 64px rgba(0,0,0,.3)',maxHeight:'90vh',overflowY:'auto'}}><h3 style={{fontWeight:900}}>✏️ Edit — {form.FullName}</h3><div style={{display:'grid',gap:'10px',marginTop:'14px'}}>{["FullName","Phone","Email","Service","Message","Position","Education","District","Experience","Interest"].map(f=><input key={f} value={form[f]||''} onChange={e=>setForm({...form,[f]:e.target.value})} placeholder={f} style={{padding:'12px 14px',borderRadius:'12px',border:'1px solid #e2e8f0',outline:'none'}}/>)}<select value={form.Status||'New'} onChange={e=>setForm({...form, Status:e.target.value})} style={{padding:'12px 14px',borderRadius:'12px',border:'1px solid #e2e8f0'}}><option>New</option><option>Contacted</option><option>Interviewed</option><option>Hired</option><option>Rejected</option></select><input value={form.Assigned||''} onChange={e=>setForm({...form, Assigned:e.target.value})} placeholder="Assigned To" style={{padding:'12px 14px',borderRadius:'12px',border:'1px solid #e2e8f0'}}/><textarea value={form.Notes||''} onChange={e=>setForm({...form, Notes:e.target.value})} placeholder="Private Notes" style={{padding:'12px 14px',borderRadius:'12px',border:'1px solid #e2e8f0',minHeight:'70px'}}/></div><div style={{display:'flex',gap:'10px',marginTop:'14px'}}><button onClick={()=>setEditRow(null)} style={{flex:1,padding:'13px',borderRadius:'14px',border:'1px solid #e2e8f0',background:'#fff',fontWeight:700,cursor:'pointer'}}>CANCEL</button><button onClick={handleSave} style={{flex:1,background:'#0f172a',color:'#facc15',padding:'13px',borderRadius:'14px',fontWeight:900,border:'none',cursor:'pointer'}}>SAVE</button></div></div></div>}

      {showAdd && <div style={{position:'fixed',inset:0,background:'rgba(15,23,42,.6)',zIndex:10001,display:'flex',justifyContent:'center',alignItems:'center',padding:'20px',backdropFilter:'blur(6px)'}}><div style={{background:'#fff',borderRadius:'22px',width:'100%',maxWidth:'520px',padding:'26px',boxShadow:'0 24px 64px rgba(0,0,0,.3)'}}><h3 style={{fontWeight:900}}>➕ Add New {tab.toUpperCase()}</h3><div style={{display:'grid',gap:'10px',marginTop:'14px'}}>{["FullName","Phone","Email","Service","Message","Position","Education","District","Experience","Interest"].map(f=><input key={f} value={form[f]||''} onChange={e=>setForm({...form,[f]:e.target.value})} placeholder={f} style={{padding:'12px 14px',borderRadius:'12px',border:'1px solid #e2e8f0',outline:'none'}}/>)}</div><div style={{display:'flex',gap:'10px',marginTop:'14px'}}><button onClick={()=>setShowAdd(false)} style={{flex:1,padding:'13px',borderRadius:'14px',border:'1px solid #e2e8f0',background:'#fff',fontWeight:700,cursor:'pointer'}}>CANCEL</button><button onClick={handleAddNew} style={{flex:1,background:'#facc15',padding:'13px',borderRadius:'14px',fontWeight:900,border:'none',cursor:'pointer',color:'#0f172a'}}>ADD</button></div></div></div>}
    </div>
  )
}
export default AdminDashboard;