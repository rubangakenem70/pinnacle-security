import React, { useState, useEffect, useRef } from 'react'
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
  const [darkMode, setDarkMode] = useState(true);
  const [trash, setTrash] = useState(()=>JSON.parse(localStorage.getItem('psl_trash')||'[]'));
  const [showTrash, setShowTrash] = useState(false);
  const [auditLog, setAuditLog] = useState(()=>JSON.parse(localStorage.getItem('psl_audit')||'[]'));
  const [sortConfig, setSortConfig] = useState({key:'Timestamp', dir:'desc'});
  const [role, setRole] = useState('super');
  const [live, setLive] = useState(true);
  const audioRef = useRef(null);

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(""), 3500); }
  const addAudit = (action, name) => {
    const log = {time:new Date().toLocaleString(), action, name, role};
    const newLogs = [log, ...auditLog].slice(0,100);
    setAuditLog(newLogs);
    localStorage.setItem('psl_audit', JSON.stringify(newLogs));
  };
  const login = () => pass === ADMIN_PASSWORD ? setAuth(true) : alert("Wrong Password!");
  
  // FIXED LOAD - NOW RECEIVES ALL DATA FROM BOTH SHEETS
  const load = () => {
    setLoading(true);
    fetch(GOOGLE_SHEET_WEBHOOK + "?cache=" + Date.now())
      .then(r=>r.text())
      .then(text=>{
        let d;
        try { d = JSON.parse(text); } catch(e) { d = []; }
        const arr = Array.isArray(d)?d:(d.data||[]);
        if(data.length>0 && arr.length>data.length && audioRef.current){ 
          audioRef.current.play().catch(()=>{}); 
          if(Notification.permission==='granted') new Notification('Pinnacle: New!', {body:`${arr.length-data.length} new`}); 
        }
        const withId = arr.map((row,i)=>{ 
          const ts = (row.Timestamp || row.timestamp || "") + "";
          if(!ts || ts.trim()==="" || ts==="undefined") return null;
          const saved = JSON.parse(localStorage.getItem(`psl_${ts}`) || '{}');
          return { ...row, Timestamp: ts, timestamp: ts, Status: saved.Status || row.Status || row.status || 'New', Notes: saved.Notes || '', Assigned: saved.Assigned || '', Photo: saved.Photo || '', InterviewDate: saved.InterviewDate || '', _uid: `${ts}_${i}_${row.Phone||row.phone||i}`, _index: i }
        }).filter(Boolean);
        const sorted = withId.sort((a,b)=> new Date(b.timestamp||b.Timestamp||0) - new Date(a.timestamp||a.Timestamp||0));
        setData(sorted); setLoading(false);
        if(sorted.length===0) showToast("⚠️ Sheet returned 0 - redeploy Apps Script as Anyone + New Version");
      })
      .catch(()=>{ setLoading(false); showToast("❌ Load failed - check Apps Script deployment"); });
  };
  
  useEffect(()=>{ if(auth){ load(); if('Notification' in window) Notification.requestPermission(); } },[auth]);
  useEffect(()=>{ if(!auth || !live) return; const id=setInterval(()=>load(),30000); return ()=>clearInterval(id); },[auth, live, data.length]);
  useEffect(()=>{ setCurrentPage(1); },[filters, search, tab, rowsPerPage, sortConfig]);
  const getVal = (obj, keys) => { for(let k of keys) if(obj[k]!==undefined && obj[k]!==null && obj[k]!=='') return obj[k]; return ''; }
  
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setForm({...form, Photo: ev.target.result}); showToast('📷 Photo added'); };
    reader.readAsDataURL(file);
  };
  const handleDelete = async (row) => {
    if(role==='staff'){ showToast('⛔ Staff cannot delete'); return; }
    const uid = row._uid; const ts = getVal(row,['Timestamp','timestamp']);
    const newTrash = [{...row, deletedAt: new Date().toISOString()}, ...trash].slice(0,200);
    setTrash(newTrash); localStorage.setItem('psl_trash', JSON.stringify(newTrash));
    setData(prev => prev.filter(r => r._uid !== uid)); setSelected(prev=>prev.filter(id=>id!==uid));
    addAudit('DELETE', getVal(row,['FullName','fullName'])); showToast("🗑 Moved to Trash");
    await fetch(GOOGLE_SHEET_WEBHOOK,{ method:'POST', mode:'no-cors', headers:{'Content-Type':'text/plain'}, body:JSON.stringify({ action:'delete', timestamp: ts, Timestamp: ts }) });
  };
  const handleBulkDelete = async () => {
    if(selected.length===0) return;
    const toDeleteRows = data.filter(r=>selected.includes(r._uid));
    const timestamps = [...new Set(toDeleteRows.map(r=>getVal(r,['Timestamp','timestamp'])))].filter(Boolean);
    const newTrash = [...toDeleteRows.map(r=>({...r, deletedAt:new Date().toISOString()})), ...trash].slice(0,200);
    setTrash(newTrash); localStorage.setItem('psl_trash', JSON.stringify(newTrash));
    setData(prev => prev.filter(r => !selected.includes(r._uid))); setSelected([]);
    showToast(`🗑 ${timestamps.length} moved to Trash`);
    await fetch(GOOGLE_SHEET_WEBHOOK,{ method:'POST', mode:'no-cors', headers:{'Content-Type':'text/plain'}, body:JSON.stringify({ action:'bulkDelete', timestamps }) });
  };
  const restoreFromTrash = (row) => { setData(prev=>[row, ...prev]); setTrash(prev=>{ const nt=prev.filter(r=>r._uid!==row._uid); localStorage.setItem('psl_trash', JSON.stringify(nt)); return nt; }); showToast('♻️ Restored'); };
  const deletePermanently = (row) => { if(!confirm(`Permanently delete ${getVal(row,['FullName','fullName'])}?`)) return; setTrash(prev=>{ const nt=prev.filter(r=>r._uid!==row._uid); localStorage.setItem('psl_trash', JSON.stringify(nt)); return nt; }); showToast('❌ Permanently deleted'); };
  const emptyTrash = () => { if(!confirm(`Permanently delete ALL ${trash.length} items?`)) return; setTrash([]); localStorage.setItem('psl_trash','[]'); showToast('🗑 Trash emptied'); };
  const clearDuplicates = () => {
    const seen = new Set(); const dups = []; const keep = [];
    data.forEach(r=>{ const key = getVal(r,['Phone','phone'])+"_"+getVal(r,['FullName','fullName']); if(seen.has(key)) dups.push(r); else { seen.add(key); keep.push(r); } });
    if(dups.length===0){ showToast('✅ No duplicates'); return; }
    if(!confirm(`Found ${dups.length} duplicates. Move them to Trash?`)) return;
    setTrash(prev=>{ const nt=[...dups.map(d=>({...d, deletedAt:new Date().toISOString()})), ...prev].slice(0,200); localStorage.setItem('psl_trash', JSON.stringify(nt)); return nt; });
    setData(keep); showToast(`🧹 ${dups.length} duplicates moved to Trash`);
  };
  const bulkWhatsApp = () => {
    if(selected.length===0){ showToast('Select rows first'); return; }
    const rows = data.filter(r=>selected.includes(r._uid));
    const msg = prompt(`WhatsApp message to ${rows.length} people:`, `Hello, this is Pinnacle Security Ltd. Your interview is scheduled.`);
    if(!msg) return;
    rows.forEach(r=>{ const ph=String(getVal(r,['Phone','phone'])).replace(/[^0-9]/g,''); window.open(`https://wa.me/${ph}?text=${encodeURIComponent(msg)}`, '_blank'); });
  };
  const updateStatus = (row, newStatus) => {
    const ts = getVal(row,['Timestamp','timestamp']); const saved = JSON.parse(localStorage.getItem(`psl_${ts}`) || '{}');
    localStorage.setItem(`psl_${ts}`, JSON.stringify({...saved, Status:newStatus})); setData(prev=>prev.map(r=> r._uid===row._uid ? {...r, Status:newStatus} : r));
    showToast(`✅ Status: ${newStatus}`);
  };
  const bulkUpdateStatus = (newStatus) => { if(selected.length===0){ showToast('Select rows first'); return; } selected.forEach(uid=>{ const r=data.find(x=>x._uid===uid); if(r) updateStatus(r,newStatus); }); setSelected([]); };
  const handleSort = (key) => { setSortConfig(prev=> ({key, dir: prev.key===key && prev.dir==='asc' ? 'desc' : 'asc'})); };
  const handleEdit = (row) => { setEditRow(row); setForm({ FullName:getVal(row,['FullName','fullName']), Phone:getVal(row,['Phone','phone']), Email:getVal(row,['Email','email']), Service:getVal(row,['Service','service']), Message:getVal(row,['Message','Messages','message']), Position:getVal(row,['Position','position']), Education:getVal(row,['Education','education']), District:getVal(row,['District','district']), Experience:getVal(row,['Experience','experience']), Interest:getVal(row,['Interest','interest']), Status:getVal(row,['Status','status'])||'New', Notes:getVal(row,['Notes','notes'])||'', Assigned:getVal(row,['Assigned','assigned'])||'', InterviewDate:getVal(row,['InterviewDate','interviewDate'])||'', Photo:getVal(row,['Photo','photo'])||'', timestamp:getVal(row,['Timestamp','timestamp']), type: row.type|| (tab==='contacts'?'contact':'applicant') }); };
  const handleSave = async () => {
    const ts = form.timestamp; const saved = JSON.parse(localStorage.getItem(`psl_${ts}`) || '{}');
    localStorage.setItem(`psl_${ts}`, JSON.stringify({...saved, Status:form.Status, Notes:form.Notes, Assigned:form.Assigned, InterviewDate:form.InterviewDate, Photo:form.Photo}));
    setData(prev => prev.map(r => r._uid===editRow._uid ? { ...r, ...form, Timestamp: ts, timestamp: ts } : r));
    setEditRow(null); showToast("✅ Updated");
  };
  const handleAddNew = async () => {
    const ts = getFullDateTime24(); const payload = { ...form, timestamp:ts, Timestamp:ts, type:tab==='contacts'?'contact':'applicant', Status:'New' };
    setData(prev=>[{...payload, _uid:`${ts}_${Date.now()}`, Status:'New'},...prev]); setShowAdd(false); setForm({}); showToast("✅ Added");
    await fetch(GOOGLE_SHEET_WEBHOOK,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain'},body:JSON.stringify(payload)});
  };
  const handleImportCSV = (e) => { const file = e.target.files[0]; if(!file) return; const reader = new FileReader(); reader.onload = (ev) => { const text = ev.target.result; const lines = text.split('\n').filter(Boolean); const headers = lines[0].split(',').map(h=>h.trim().replace(/"/g,'')); const newRows = lines.slice(1).map((line,i)=>{ const vals = line.split(',').map(v=>v.replace(/"/g,'').trim()); const obj={}; headers.forEach((h,idx)=>obj[h]=vals[idx]||''); const ts=getFullDateTime24()+`-${i}`; return {...obj, Timestamp:obj.Timestamp||ts, timestamp:obj.timestamp||ts, _uid:`${ts}_${Date.now()+i}`, Status:'New', type:tab==='contacts'?'contact':'applicant'}; }); setData(prev=>[...newRows, ...prev]); showToast(`📥 Imported ${newRows.length} rows`); }; reader.readAsText(file); };
  const handleBackup = () => { const blob = new Blob([JSON.stringify({data, trash, exportedAt:new Date().toISOString()}, null, 2)], {type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`pinnacle_backup_${new Date().toISOString().slice(0,10)}.json`; a.click(); showToast('💾 Backup downloaded'); };

  if(!auth){ return ( <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#0f172a 0%,#1e293b 50%,#0f172a 100%)',display:'flex',justifyContent:'center',alignItems:'center',fontFamily:'Inter, Arial'}}><div style={{background:'#ffffff',padding:'44px 36px',borderRadius:'24px',width:'92%',maxWidth:'400px',textAlign:'center'}}><div style={{width:'72px',height:'72px',background:'linear-gradient(135deg,#facc15,#eab308)',borderRadius:'20px',margin:'0 auto 18px',display:'grid',placeItems:'center',color:'#0f172a',fontSize:'30px',fontWeight:900}}>P</div><h2 style={{fontWeight:900,color:'#0f172a',fontSize:'22px'}}>PINNACLE ADMIN</h2><input type="password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&login()} placeholder="Admin Password" style={{width:'100%',padding:'15px 18px',borderRadius:'14px',marginTop:'26px',border:'2px solid #e2e8f0'}}/><button onClick={login} style={{width:'100%',marginTop:'16px',background:'linear-gradient(135deg,#facc15,#eab308)',padding:'15px',borderRadius:'14px',fontWeight:900,border:'none',cursor:'pointer',color:'#0f172a'}}>UNLOCK DASHBOARD →</button></div></div> ) }
  const applicants = data.filter(d => (d.type==='applicant' || d.type==='applicants' || getVal(d,['Position','position']))); 
  const contacts = data.filter(d => (d.type==='contact' || d.type==='contacts' || getVal(d,['Service','service']))); 
  const total = data.length;
  const phoneCounts = data.reduce((acc,d)=>{ const ph=getVal(d,['Phone','phone']); if(ph){ acc[ph]=(acc[ph]||0)+1; } return acc; }, {});
  const applyFilters = (list) => list.filter(d=>{ const s = `${getVal(d,['FullName','fullName'])} ${getVal(d,['Phone','phone'])} ${getVal(d,['Email','email'])} ${getVal(d,['Service','service'])} ${getVal(d,['Position','position'])} ${getVal(d,['District','district'])} ${getVal(d,['Status','status'])}`.toLowerCase(); if(search && !s.includes(search.toLowerCase())) return false; return true; });
  let filteredContacts = applyFilters(contacts); let filteredApplicants = applyFilters(applicants);
  const list = tab==='contacts'?filteredContacts:filteredApplicants; 
  const paginatedList = list.slice((currentPage-1)*rowsPerPage, currentPage*rowsPerPage);
  const statusCounts = {New: data.filter(d=>getVal(d,['Status','status'])==='New' || !getVal(d,['Status','status'])).length, Hired: data.filter(d=>getVal(d,['Status','status'])==='Hired').length };
  const getStatusColor = (s) => { if(s==='New') return {bg:'#e0f2fe', color:'#0369a1', border:'#7dd3fc'}; if(s==='Hired') return {bg:'#dcfce7', color:'#15803d', border:'#86efac'}; return {bg:'#f1f5f9', color:'#475569', border:'#e2e8f0'}; };
  const exportCSV = (rows, filename) => { if(!rows.length) return; const headers = tab==='contacts'?["Timestamp","FullName","Phone","Email","Service","Message"]:["Timestamp","FullName","Phone","Email","Position","Education","District","Experience","Interest"]; const csv = [headers.join(",")].concat(rows.map(r=> headers.map(h=>`"${String(getVal(r,[h,h.toLowerCase()])||'').replace(/"/g,'""')}"`).join(","))).join("\n"); const blob = new Blob([csv],{type:"text/csv"}); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download=filename; a.click(); showToast("📥 Exported CSV"); };
  const bgMain = '#0f172a'; const bgCard = '#1e293b'; const textMain = '#f1f5f9'; const borderColor = '#334155';
  const rowBg = (i, checked, isDup) => { if(checked) return '#422006'; if(isDup) return '#7f1d1d'; if(i%2===0) return bgCard; return '#0f172a'; };
  const cellStyle = {padding:'11px',border:`1px solid ${borderColor}`};

  return (
    <div style={{background:bgMain,minHeight:'100vh',fontFamily:'Inter, Arial',color:textMain}}>
      <audio ref={audioRef} src="https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=notification-112406.mp3" preload="auto"/>
      {toast && <div style={{position:'fixed',top:'22px',right:'22px',background:'#0f172a',color:'#facc15',padding:'13px 22px',borderRadius:'30px',fontWeight:900,fontSize:'13px',zIndex:99999,border:'1px solid #facc15'}}>{toast}</div>}
      
      <div style={{background:'linear-gradient(90deg,#0f172a 0%,#1e293b 100%)',padding:'16px 22px',display:'flex',justifyContent:'space-between',alignItems:'center',position:'sticky',top:0,zIndex:100,borderBottom:'4px solid #facc15',flexWrap:'wrap',gap:'12px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'14px'}}><div style={{width:'46px',height:'46px',background:'linear-gradient(135deg,#facc15,#eab308)',borderRadius:'14px',display:'grid',placeItems:'center',fontWeight:900,color:'#0f172a',fontSize:'20px'}}>P</div><div><h1 style={{color:'#fff',fontWeight:900,fontSize:'16px',display:'flex',alignItems:'center',gap:'8px'}}>PINNACLE SECURITY LTD <span style={{width:'8px',height:'8px',background:'#22c55e',borderRadius:'50%',display:'inline-block'}}></span></h1><p style={{color:'#facc15',fontSize:'11px',fontWeight:700}}>ADMIN • {total} TOTAL • {contacts.length} CONTACTS • {applicants.length} APPLICANTS</p></div></div>
        <div style={{display:'flex',gap:'6px',alignItems:'center',flexWrap:'wrap'}}>
          <button onClick={()=>setLive(!live)} style={{background:live?'#22c55e':'#64748b',color:'#fff',border:'none',padding:'9px 12px',borderRadius:'20px',fontWeight:800,fontSize:'11px',cursor:'pointer'}}>{live?'🔴 LIVE':'⏸ PAUSED'}</button>
          <button onClick={handleBackup} style={{background:'#22c55e',color:'#fff',border:'none',padding:'9px 12px',borderRadius:'20px',fontWeight:800,fontSize:'11px',cursor:'pointer'}}>💾 BACKUP</button>
          <button onClick={clearDuplicates} style={{background:'#f97316',color:'#fff',border:'none',padding:'9px 12px',borderRadius:'20px',fontWeight:800,fontSize:'11px',cursor:'pointer'}}>🧹 DUP ({Object.keys(phoneCounts).filter(k=>phoneCounts[k]>1).length})</button>
          <button onClick={()=>setShowTrash(!showTrash)} style={{background:trash.length?'#dc2626':'rgba(255,255,255,.12)',color:'#fff',border:'none',padding:'9px 12px',borderRadius:'20px',fontWeight:800,fontSize:'11px',cursor:'pointer'}}>🗑 {trash.length}</button>
          <a href="/" style={{background:'#facc15',color:'#0f172a',padding:'9px 14px',borderRadius:'20px',fontWeight:900,fontSize:'11px',textDecoration:'none'}}>🏠</a>
          <button onClick={()=>{setForm({}); setShowAdd(true)}} style={{background:'#fff',color:'#0f172a',border:'none',padding:'9px 14px',borderRadius:'20px',fontWeight:900,fontSize:'11px',cursor:'pointer'}}>＋ ADD</button>
          <button onClick={load} style={{background:'rgba(255,255,255,.12)',color:'#fff',border:'none',padding:'9px 14px',borderRadius:'20px',fontWeight:800,fontSize:'11px',cursor:'pointer'}}>{loading?'⏳':'↻'}</button>
        </div>
      </div>

      <div style={{background:bgCard,margin:'18px 20px',padding:'16px 18px',borderRadius:'18px',display:'flex',gap:'12px',alignItems:'center',flexWrap:'wrap',border:`1px solid ${borderColor}`}}>
        <div style={{display:'flex',alignItems:'center',background:'#0f172a',borderRadius:'24px',padding:'0 16px',border:`1px solid ${borderColor}`,flex:1,minWidth:'240px'}}><span>🔍</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, phone, service..." style={{background:'transparent',border:'none',outline:'none',padding:'12px 10px',width:'100%',fontSize:'13px',color:textMain}}/></div>
        {selected.length>0 && <><button onClick={handleBulkDelete} style={{background:'#dc2626',color:'#fff',border:'none',padding:'11px 18px',borderRadius:'24px',fontWeight:800,fontSize:'12px',cursor:'pointer'}}>🗑 {selected.length}</button><button onClick={bulkWhatsApp} style={{background:'#22c55e',color:'#fff',border:'none',padding:'11px 18px',borderRadius:'24px',fontWeight:800,fontSize:'12px',cursor:'pointer'}}>💬 WhatsApp</button></>}
        <div style={{marginLeft:'auto',display:'flex',gap:'10px',alignItems:'center'}}><span style={{fontSize:'12px',color:'#94a3b8',fontWeight:700}}>ROWS:</span><select value={rowsPerPage} onChange={e=>setRowsPerPage(Number(e.target.value))} style={{padding:'9px 14px',borderRadius:'20px',border:'1px solid #334155',fontWeight:700,background:'#0f172a',color:'#facc15'}}><option value={5}>5</option><option value={10}>10</option><option value={20}>20</option><option value={50}>50</option><option value={100}>100</option></select></div>
      </div>

      <div style={{maxWidth:'1600px',margin:'auto',padding:'0 20px 20px'}}>
        {/* TAP CARDS - BOTH RECEIVING DATA NOW */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:'14px',marginBottom:'18px'}}>
          <div onClick={()=>{setTab('contacts'); setCurrentPage(1)}} style={{background:tab==='contacts'?'linear-gradient(135deg,#facc15,#eab308)':'#1e293b',color:tab==='contacts'?'#0f172a':'#f1f5f9',padding:'20px 22px',borderRadius:'18px',cursor:'pointer',border:tab==='contacts'?'2px solid #facc15':'1px solid #334155',boxShadow:'0 4px 16px rgba(0,0,0,.3)',transform:tab==='contacts'?'scale(1.02)':''}}>
            <p style={{fontSize:'11px',fontWeight:800,letterSpacing:'1px'}}>📞 CONTACTS - TAP TO VIEW</p>
            <h2 style={{fontSize:'32px',fontWeight:900,marginTop:'6px'}}>{contacts.length}</h2>
            <p style={{fontSize:'10px',marginTop:'6px',fontWeight:800,background:tab==='contacts'?'#0f172a':'rgba(250,204,21,.15)',color:'#facc15',display:'inline-block',padding:'4px 10px',borderRadius:'20px'}}>{tab==='contacts'?'👁 VIEWING NOW - '+list.length+' rows':'Tap to view →'}</p>
          </div>
          <div onClick={()=>{setTab('applicants'); setCurrentPage(1)}} style={{background:tab==='applicants'?'linear-gradient(135deg,#facc15,#eab308)':'#1e293b',color:tab==='applicants'?'#0f172a':'#f1f5f9',padding:'20px 22px',borderRadius:'18px',cursor:'pointer',border:tab==='applicants'?'2px solid #facc15':'1px solid #334155',boxShadow:'0 4px 16px rgba(0,0,0,.3)',transform:tab==='applicants'?'scale(1.02)':''}}>
            <p style={{fontSize:'11px',fontWeight:900,letterSpacing:'1px'}}>🎖️ APPLICANTS - TAP TO VIEW</p>
            <h2 style={{fontSize:'32px',fontWeight:900,marginTop:'6px'}}>{applicants.length}</h2>
            <p style={{fontSize:'10px',marginTop:'6px',fontWeight:800,background:tab==='applicants'?'#0f172a':'rgba(250,204,21,.15)',color:'#facc15',display:'inline-block',padding:'4px 10px',borderRadius:'20px'}}>{tab==='applicants'?'👁 VIEWING NOW - '+list.length+' rows':'Tap to view →'}</p>
          </div>
          <div style={{background:'#1e293b',padding:'20px 22px',borderRadius:'18px',border:'2px dashed #334155'}}>
            <p style={{fontSize:'11px',fontWeight:800,color:'#f1f5f9'}}>📊 TOTAL</p>
            <h2 style={{fontSize:'32px',fontWeight:900,color:'#f1f5f9',marginTop:'6px'}}>{total}</h2>
            <p style={{fontSize:'11px',color:'#94a3b8',marginTop:'4px'}}>{loading?'Loading...':`${total} rows from sheet`}</p>
          </div>
          <div style={{background:'#1e293b',padding:'20px 22px',borderRadius:'18px',border:'1px solid #334155'}}>
            <p style={{fontSize:'11px',fontWeight:700,color:'#94a3b8'}}>⬇ EXPORT</p>
            <h2 style={{fontSize:'18px',fontWeight:900,marginTop:'8px',color:'#f1f5f9'}}>{tab.toUpperCase()}</h2>
            <div style={{display:'flex',gap:'6px',marginTop:'10px'}}>
              <button onClick={()=>exportCSV(list,`${tab}.csv`)} style={{background:'#facc15',color:'#0f172a',border:'none',padding:'8px 12px',borderRadius:'20px',fontSize:'10px',fontWeight:900,cursor:'pointer'}}>⬇ CSV ({list.length})</button>
            </div>
          </div>
        </div>

        <div style={{background:bgCard,borderRadius:'18px',overflow:'hidden',border:`2px solid ${borderColor}`}}>
          <div style={{padding:'16px 20px',background:'linear-gradient(90deg,#0f172a,#1e293b)',color:'#facc15',fontWeight:900,fontSize:'13px',display:'flex',justifyContent:'space-between'}}>
            <span>{tab==='contacts'?`📞 CONTACTS — ${list.length}`:`🎖️ APPLICANTS — ${list.length}`} • Page {currentPage}/{Math.ceil(list.length/rowsPerPage)||1} {loading?'• LOADING...':''}</span>
            <span style={{opacity:.7}}>{selected.length} selected</span>
          </div>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px',minWidth:'1000px'}}>
              <thead><tr style={{background:'#0f172a',color:'#fff'}}>
                <th style={cellStyle}><input type="checkbox" checked={paginatedList.length>0 && paginatedList.every(r=>selected.includes(r._uid))} onChange={()=>{ const ids=paginatedList.map(r=>r._uid); if(ids.every(id=>selected.includes(id))) setSelected(prev=>prev.filter(id=>!ids.includes(id))); else setSelected(prev=>[...new Set([...prev,...ids])]); }}/></th>
                <th style={cellStyle}>DATE</th>
                <th style={cellStyle}>NAME</th>
                <th style={cellStyle}>PHONE</th>
                <th style={cellStyle}>STATUS</th>
                {tab==='contacts'?<><th style={cellStyle}>SERVICE</th><th style={cellStyle}>MESSAGE</th></>:<><th style={cellStyle}>POSITION</th><th style={cellStyle}>DISTRICT</th></>}
                <th style={cellStyle}>ACTIONS</th>
              </tr></thead>
              <tbody>
                {paginatedList.length===0 && <tr><td colSpan={7} style={{padding:'40px',textAlign:'center',color:'#94a3b8',fontWeight:700}}>{loading?'⏳ Loading from Google Sheet...':'🔍 No '+tab+' found — Check sheet has data & redeploy Apps Script as Anyone'}<br/><span style={{fontSize:'11px'}}>If you see this after loading, open sheet URL in browser to see raw JSON</span></td></tr>}
                {paginatedList.map((d,i)=>{ const checked=selected.includes(d._uid); const st=getVal(d,['Status','status'])||'New'; const sc=getStatusColor(st); const isDup=phoneCounts[getVal(d,['Phone','phone'])]>1; const bg = rowBg(i, checked, isDup); return (<tr key={d._uid} style={{background:bg,color:textMain}}><td style={{...cellStyle,background:bg}}><input type="checkbox" checked={checked} onChange={()=>setSelected(prev=>prev.includes(d._uid)?prev.filter(id=>id!==d._uid):[...prev,d._uid])}/></td><td style={{...cellStyle,background:bg}}>{getVal(d,['Timestamp','timestamp'])?.slice(0,19)}</td><td style={{...cellStyle,background:bg,fontWeight:800}}>{getVal(d,['FullName','fullName'])}</td><td style={{...cellStyle,background:bg}}>{getVal(d,['Phone','phone'])}</td><td style={{...cellStyle,background:bg}}><span style={{padding:'5px 8px',borderRadius:'12px',fontSize:'10px',fontWeight:800,background:sc.bg,color:sc.color}}>{st}</span></td>{tab==='contacts'?<><td style={{...cellStyle,background:bg}}>{getVal(d,['Service','service'])}</td><td style={{...cellStyle,background:bg,maxWidth:'200px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{getVal(d,['Message','message'])}</td></>:<><td style={{...cellStyle,background:bg}}>{getVal(d,['Position','position'])}</td><td style={{...cellStyle,background:bg}}>{getVal(d,['District','district'])}</td></>}<td style={{...cellStyle,background:bg}}><div style={{display:'flex',gap:'4px'}}><button onClick={()=>handleEdit(d)} style={{padding:'6px 10px',borderRadius:'8px',background:'#facc15',border:'none',fontSize:'10px',fontWeight:800,cursor:'pointer',color:'#0f172a'}}>EDIT</button><button onClick={()=>handleDelete(d)} style={{padding:'6px 10px',borderRadius:'8px',background:'#fee2e2',color:'#dc2626',border:'none',fontSize:'10px',fontWeight:800,cursor:'pointer'}}>DEL</button></div></td></tr>)})}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {editRow && <div style={{position:'fixed',inset:0,background:'rgba(15,23,42,.6)',zIndex:10001,display:'flex',justifyContent:'center',alignItems:'center',padding:'20px'}}><div style={{background:'#fff',borderRadius:'22px',width:'100%',maxWidth:'520px',padding:'26px'}}><h3 style={{fontWeight:900,color:'#0f172a'}}>✏️ Edit — {form.FullName}</h3><div style={{display:'grid',gap:'10px',marginTop:'14px'}}>{["FullName","Phone","Email","Service","Message","Position","District"].map(f=><input key={f} value={form[f]||''} onChange={e=>setForm({...form,[f]:e.target.value})} placeholder={f} style={{padding:'12px 14px',borderRadius:'12px',border:'1px solid #e2e8f0',color:'#0f172a'}}/>)}<select value={form.Status||'New'} onChange={e=>setForm({...form, Status:e.target.value})} style={{padding:'12px 14px',borderRadius:'12px',border:'1px solid #e2e8f0'}}><option>New</option><option>Contacted</option><option>Interviewed</option><option>Hired</option><option>Rejected</option></select></div><div style={{display:'flex',gap:'10px',marginTop:'14px'}}><button onClick={()=>setEditRow(null)} style={{flex:1,padding:'13px',borderRadius:'14px',border:'1px solid #e2e8f0',background:'#fff',fontWeight:700,cursor:'pointer'}}>CANCEL</button><button onClick={handleSave} style={{flex:1,background:'#0f172a',color:'#facc15',padding:'13px',borderRadius:'14px',fontWeight:900,border:'none',cursor:'pointer'}}>SAVE</button></div></div></div>}
    </div>
  )
}
export default AdminDashboard;