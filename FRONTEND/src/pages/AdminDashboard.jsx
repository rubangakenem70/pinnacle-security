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
  const [darkMode, setDarkMode] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [trash, setTrash] = useState(()=>JSON.parse(localStorage.getItem('psl_trash')||'[]'));
  const [showTrash, setShowTrash] = useState(false);
  const [auditLog, setAuditLog] = useState(()=>JSON.parse(localStorage.getItem('psl_audit')||'[]'));
  const [sortConfig, setSortConfig] = useState({key:'Timestamp', dir:'desc'});
  const [role, setRole] = useState('super');
  const [interviewDate, setInterviewDate] = useState('');
  const [showIdCard, setShowIdCard] = useState(null);
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
  
  const load = () => {
    setLoading(true);
    fetch(GOOGLE_SHEET_WEBHOOK).then(r=>r.json()).then(d=>{
      const arr = Array.isArray(d)?d:[];
      if(data.length>0 && arr.length>data.length && audioRef.current){ audioRef.current.play().catch(()=>{}); if(Notification.permission==='granted') new Notification('Pinnacle: New Application!', {body:`${arr.length-data.length} new records`}); }
      const map = new Map();
      arr.forEach(row=>{ const ts = (row.Timestamp || row.timestamp || '').trim(); if(!ts) return; if(!map.has(ts)) map.set(ts, row); });
      const uniqueArr = Array.from(map.values());
      const withId = uniqueArr.map((row,i)=>{ 
        const saved = JSON.parse(localStorage.getItem(`psl_${row.Timestamp||row.timestamp}`) || '{}');
        return { ...row, Status: saved.Status || row.Status || row.status || 'New', Notes: saved.Notes || row.Notes || row.notes || '', Assigned: saved.Assigned || row.Assigned || '', Photo: saved.Photo || row.Photo || '', InterviewDate: saved.InterviewDate || row.InterviewDate || '', _uid: `${row.Timestamp||row.timestamp}_${i}`, _index: i }
      });
      const sorted = withId.sort((a,b)=> new Date(b.timestamp||b.Timestamp||0) - new Date(a.timestamp||a.Timestamp||0));
      setData(sorted); setLoading(false);
    }).catch(()=>setLoading(false));
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
    if(detailRow && detailRow._uid===uid) setDetailRow(null); localStorage.removeItem(`psl_${ts}`);
    addAudit('DELETE', getVal(row,['FullName','fullName'])); showToast("🗑 Moved to Trash");
    await fetch(GOOGLE_SHEET_WEBHOOK,{ method:'POST', mode:'no-cors', headers:{'Content-Type':'text/plain'}, body:JSON.stringify({ action:'delete', timestamp: ts, Timestamp: ts, FullName: getVal(row,['FullName','fullName']), Phone: getVal(row,['Phone','phone']) }) });
  };
  const handleBulkDelete = async () => {
    if(role==='staff'){ showToast('⛔ Staff cannot delete'); return; }
    if(selected.length===0) return; const toDeleteRows = data.filter(r=>selected.includes(r._uid));
    const timestamps = [...new Set(toDeleteRows.map(r=>getVal(r,['Timestamp','timestamp'])))].filter(Boolean);
    const items = toDeleteRows.map(r=>({ FullName:getVal(r,['FullName','fullName']), Phone:getVal(r,['Phone','phone']), timestamp:getVal(r,['Timestamp','timestamp']) }));
    const newTrash = [...toDeleteRows.map(r=>({...r, deletedAt:new Date().toISOString()})), ...trash].slice(0,200);
    setTrash(newTrash); localStorage.setItem('psl_trash', JSON.stringify(newTrash)); timestamps.forEach(t=>localStorage.removeItem(`psl_${t}`));
    setData(prev => prev.filter(r => !selected.includes(r._uid))); setSelected([]); setDetailRow(null);
    addAudit('BULK DELETE', `${timestamps.length} records`); showToast(`🗑 ${timestamps.length} moved to Trash`);
    await fetch(GOOGLE_SHEET_WEBHOOK,{ method:'POST', mode:'no-cors', headers:{'Content-Type':'text/plain'}, body:JSON.stringify({ action:'bulkDelete', timestamps, items }) });
  };
  const restoreFromTrash = (row) => { setData(prev=>[row, ...prev]); setTrash(prev=>{ const nt=prev.filter(r=>r._uid!==row._uid); localStorage.setItem('psl_trash', JSON.stringify(nt)); return nt; }); showToast('♻️ Restored'); };
  const deletePermanently = (row) => { if(!confirm(`Permanently delete ${getVal(row,['FullName','fullName'])}?`)) return; setTrash(prev=>{ const nt=prev.filter(r=>r._uid!==row._uid); localStorage.setItem('psl_trash', JSON.stringify(nt)); return nt; }); showToast('❌ Permanently deleted'); };
  const emptyTrash = () => { if(!confirm(`Permanently delete ALL ${trash.length} items?`)) return; setTrash([]); localStorage.setItem('psl_trash','[]'); showToast('🗑 Trash emptied'); };
  const clearDuplicates = () => {
    const seen = new Set(); const dups = []; const keep = [];
    data.forEach(r=>{ const ph=getVal(r,['Phone','phone']); if(seen.has(ph)) dups.push(r); else { seen.add(ph); keep.push(r); } });
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
    if(detailRow && detailRow._uid===row._uid) setDetailRow({...detailRow, Status:newStatus}); addAudit(`STATUS → ${newStatus}`, getVal(row,['FullName','fullName'])); showToast(`✅ Status: ${newStatus}`);
    fetch(GOOGLE_SHEET_WEBHOOK,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain'},body:JSON.stringify({action:'update', Timestamp:ts, timestamp:ts, FullName:getVal(row,['FullName','fullName']), Status:newStatus, type:row.type})});
  };
  const bulkUpdateStatus = (newStatus) => { if(selected.length===0){ showToast('Select rows first'); return; } selected.forEach(uid=>{ const r=data.find(x=>x._uid===uid); if(r) updateStatus(r,newStatus); }); setSelected([]); };
  const updateNotes = (row, notes, assigned) => { const ts = getVal(row,['Timestamp','timestamp']); const saved = JSON.parse(localStorage.getItem(`psl_${ts}`) || '{}'); localStorage.setItem(`psl_${ts}`, JSON.stringify({...saved, Notes:notes, Assigned:assigned})); setData(prev=>prev.map(r=> r._uid===row._uid ? {...r, Notes:notes, Assigned:assigned} : r)); };
  const handleSort = (key) => { setSortConfig(prev=> ({key, dir: prev.key===key && prev.dir==='asc' ? 'desc' : 'asc'})); };
  const handleEdit = (row) => { setEditRow(row); setForm({ FullName:getVal(row,['FullName','fullName']), Phone:getVal(row,['Phone','phone']), Email:getVal(row,['Email','email']), Service:getVal(row,['Service','service']), Message:getVal(row,['Message','Messages','message']), Position:getVal(row,['Position','position']), Education:getVal(row,['Education','education']), District:getVal(row,['District','district']), Experience:getVal(row,['Experience','experience']), Interest:getVal(row,['Interest','interest']), Status:getVal(row,['Status','status'])||'New', Notes:getVal(row,['Notes','notes'])||'', Assigned:getVal(row,['Assigned','assigned'])||'', InterviewDate:getVal(row,['InterviewDate','interviewDate'])||'', Photo:getVal(row,['Photo','photo'])||'', timestamp:getVal(row,['Timestamp','timestamp']), type: row.type|| (tab==='contacts'?'contact':'applicant') }); };
  const handleSave = async () => {
    const ts = form.timestamp; const saved = JSON.parse(localStorage.getItem(`psl_${ts}`) || '{}');
    localStorage.setItem(`psl_${ts}`, JSON.stringify({...saved, Status:form.Status, Notes:form.Notes, Assigned:form.Assigned, InterviewDate:form.InterviewDate, Photo:form.Photo}));
    setData(prev => prev.map(r => r._uid===editRow._uid ? { ...r, ...form, Timestamp: ts, timestamp: ts } : r));
    if(detailRow && detailRow._uid===editRow._uid) setDetailRow({...detailRow, ...form}); setEditRow(null); addAudit('EDIT', form.FullName); showToast("✅ Updated");
    await fetch(GOOGLE_SHEET_WEBHOOK,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain'},body:JSON.stringify({ action:'update', ...form, timestamp: ts, type: form.type })});
  };
  const handleAddNew = async () => {
    const ts = getFullDateTime24(); const payload = { ...form, timestamp:ts, Timestamp:ts, type:tab==='contacts'?'contact':'applicant', Status:'New' };
    setData(prev=>[{...payload, _uid:`${ts}_${Date.now()}`, Status:'New'},...prev]); setShowAdd(false); setForm({}); addAudit('ADD', form.FullName||'New'); showToast("✅ Added");
    await fetch(GOOGLE_SHEET_WEBHOOK,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain'},body:JSON.stringify(payload)});
  };
  const handleImportCSV = (e) => { const file = e.target.files[0]; if(!file) return; const reader = new FileReader(); reader.onload = (ev) => { const text = ev.target.result; const lines = text.split('\n').filter(Boolean); const headers = lines[0].split(',').map(h=>h.trim().replace(/"/g,'')); const newRows = lines.slice(1).map((line,i)=>{ const vals = line.split(',').map(v=>v.replace(/"/g,'').trim()); const obj={}; headers.forEach((h,idx)=>obj[h]=vals[idx]||''); const ts=getFullDateTime24()+`-${i}`; return {...obj, Timestamp:obj.Timestamp||ts, timestamp:obj.timestamp||ts, _uid:`${ts}_${Date.now()+i}`, Status:'New', type:tab==='contacts'?'contact':'applicant'}; }); setData(prev=>[...newRows, ...prev]); showToast(`📥 Imported ${newRows.length} rows`); }; reader.readAsText(file); };
  const handleBackup = () => { const blob = new Blob([JSON.stringify({data, trash, auditLog, exportedAt:new Date().toISOString()}, null, 2)], {type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`pinnacle_backup_${new Date().toISOString().slice(0,10)}.json`; a.click(); showToast('💾 Backup downloaded'); };

  if(!auth){ return ( <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#0f172a 0%,#1e293b 50%,#0f172a 100%)',display:'flex',justifyContent:'center',alignItems:'center',fontFamily:'Inter, Arial'}}><div style={{background:'#ffffff',padding:'44px 36px',borderRadius:'24px',width:'92%',maxWidth:'400px',textAlign:'center'}}><div style={{width:'72px',height:'72px',background:'linear-gradient(135deg,#facc15,#eab308)',borderRadius:'20px',margin:'0 auto 18px',display:'grid',placeItems:'center',color:'#0f172a',fontSize:'30px',fontWeight:900}}>P</div><h2 style={{fontWeight:900,color:'#0f172a',fontSize:'22px'}}>PINNACLE ADMIN</h2><input type="password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&login()} placeholder="Admin Password" style={{width:'100%',padding:'15px 18px',borderRadius:'14px',marginTop:'26px',border:'2px solid #e2e8f0'}}/><button onClick={login} style={{width:'100%',marginTop:'16px',background:'linear-gradient(135deg,#facc15,#eab308)',padding:'15px',borderRadius:'14px',fontWeight:900,border:'none',cursor:'pointer',color:'#0f172a'}}>UNLOCK DASHBOARD →</button></div></div> ) }
  const applicants = data.filter(d => (d.type==='applicant') || getVal(d,['Position','position'])); const contacts = data.filter(d => (d.type==='contact') || getVal(d,['Service','service'])); const total = data.length;
  const phoneCounts = data.reduce((acc,d)=>{ const ph=getVal(d,['Phone','phone']); if(ph){ acc[ph]=(acc[ph]||0)+1; } return acc; }, {});
  const applyFilters = (list) => list.filter(d=>{ const s = `${getVal(d,['FullName','fullName'])} ${getVal(d,['Phone','phone'])} ${getVal(d,['Email','email'])} ${getVal(d,['Service','service'])} ${getVal(d,['Position','position'])} ${getVal(d,['District','district'])} ${getVal(d,['Status','status'])}`.toLowerCase(); if(search && !s.includes(search.toLowerCase())) return false; if(filters.service && getVal(d,['Service','service']).toLowerCase() !== filters.service.toLowerCase()) return false; if(filters.position && getVal(d,['Position','position']).toLowerCase() !== filters.position.toLowerCase()) return false; if(filters.district && getVal(d,['District','district']).toLowerCase() !== filters.district.toLowerCase()) return false; if(filters.education && getVal(d,['Education','education']).toLowerCase() !== filters.education.toLowerCase()) return false; if(filters.experience && getVal(d,['Experience','experience']).toLowerCase() !== filters.experience.toLowerCase()) return false; if(filters.interest && getVal(d,['Interest','interest']).toLowerCase() !== filters.interest.toLowerCase()) return false; if(filters.status && getVal(d,['Status','status']).toLowerCase() !== filters.status.toLowerCase()) return false; const ts = new Date(getVal(d,['Timestamp','timestamp'])); if(filters.dateFrom && ts < new Date(filters.dateFrom)) return false; if(filters.dateTo && ts > new Date(filters.dateTo + 'T23:59:59')) return false; return true; });
  let filteredContacts = applyFilters(contacts); let filteredApplicants = applyFilters(applicants);
  const sortList = (arr) => { return [...arr].sort((a,b)=>{ const av=getVal(a,[sortConfig.key, sortConfig.key.toLowerCase()])||''; const bv=getVal(b,[sortConfig.key, sortConfig.key.toLowerCase()])||''; if(sortConfig.key==='Timestamp' || sortConfig.key==='InterviewDate'){ const da=new Date(av); const db=new Date(bv); return sortConfig.dir==='asc'?da-db:db-da; } return sortConfig.dir==='asc'?String(av).localeCompare(String(bv)):String(bv).localeCompare(String(av)); }); };
  filteredContacts = sortList(filteredContacts); filteredApplicants = sortList(filteredApplicants);
  const list = tab==='contacts'?filteredContacts:filteredApplicants; const paginatedList = list.slice((currentPage-1)*rowsPerPage, currentPage*rowsPerPage);
  const clearFilters = () => setFilters({ service:"", position:"", district:"", education:"", experience:"", interest:"", status:"", dateFrom:"", dateTo:"" });
  const statusCounts = {New: data.filter(d=>getVal(d,['Status','status'])==='New' || !getVal(d,['Status','status'])).length, Contacted: data.filter(d=>getVal(d,['Status','status'])==='Contacted').length, Interviewed: data.filter(d=>getVal(d,['Status','status'])==='Interviewed').length, Hired: data.filter(d=>getVal(d,['Status','status'])==='Hired').length, Rejected: data.filter(d=>getVal(d,['Status','status'])==='Rejected').length };
  const getStatusColor = (s) => { if(s==='New') return {bg:'#e0f2fe', color:'#0369a1', border:'#7dd3fc'}; if(s==='Contacted') return {bg:'#fef9c3', color:'#a16207', border:'#fde68a'}; if(s==='Interviewed') return {bg:'#e0e7ff', color:'#4338ca', border:'#a5b4fc'}; if(s==='Hired') return {bg:'#dcfce7', color:'#15803d', border:'#86efac'}; if(s==='Rejected') return {bg:'#fee2e2', color:'#b91c1c', border:'#fca5a5'}; return {bg:'#f1f5f9', color:'#475569', border:'#e2e8f0'}; };
  const exportCSV = (rows, filename) => { if(!rows.length) return; const headers = tab==='contacts'?["Timestamp","FullName","Phone","Email","Service","Message","Status","Notes","Assigned","InterviewDate"]:["Timestamp","FullName","Phone","Email","Position","Education","District","Experience","Interest","Status","Notes","Assigned","InterviewDate"]; const csv = [headers.join(",")].concat(rows.map(r=> headers.map(h=>`"${String(getVal(r,[h,h.toLowerCase()])||'').replace(/"/g,'""')}"`).join(","))).join("\n"); const blob = new Blob([csv],{type:"text/csv"}); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download=filename; a.click(); showToast("📥 Exported CSV"); };
  const bgMain = darkMode ? '#0f172a' : '#f1f5f9'; const bgCard = darkMode ? '#1e293b' : '#ffffff'; const textMain = darkMode ? '#f1f5f9' : '#0f172a'; const borderColor = darkMode ? '#334155' : '#e2e8f0';
  const rowBg = (i, checked, isDup) => { if(checked) return '#fef9c3'; if(isDup) return darkMode ? '#7f1d1d' : '#fee2e2'; if(i%2===0) return bgCard; return darkMode ? '#0f172a' : '#f8fafc'; };
  const cellStyle = {padding:'11px',border:`1px solid ${borderColor}`};

  return (
    <div style={{background:bgMain,minHeight:'100vh',fontFamily:'Inter, Arial',color:textMain,transition:'0.3s'}}>
      <audio ref={audioRef} src="https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=notification-112406.mp3" preload="auto"/>
      {toast && <div style={{position:'fixed',top:'22px',right:'22px',background:'#0f172a',color:'#facc15',padding:'13px 22px',borderRadius:'30px',fontWeight:900,fontSize:'13px',zIndex:99999,border:'1px solid #facc15'}}>{toast}</div>}
      <div style={{background:'linear-gradient(90deg,#0f172a 0%,#1e293b 100%)',padding:'16px 22px',display:'flex',justifyContent:'space-between',alignItems:'center',position:'sticky',top:0,zIndex:100,borderBottom:'4px solid #facc15',flexWrap:'wrap',gap:'12px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'14px'}}><div style={{width:'46px',height:'46px',background:'linear-gradient(135deg,#facc15,#eab308)',borderRadius:'14px',display:'grid',placeItems:'center',fontWeight:900,color:'#0f172a',fontSize:'20px'}}>P</div><div><h1 style={{color:'#fff',fontWeight:900,fontSize:'16px',display:'flex',alignItems:'center',gap:'8px'}}>PINNACLE SECURITY LTD {live && <span style={{width:'8px',height:'8px',background:'#22c55e',borderRadius:'50%',display:'inline-block',boxShadow:'0 0 8px #22c55e'}}></span>}<span style={{fontSize:'9px',color:live?'#22c55e':'#64748b',fontWeight:800}}>{live?'LIVE':'PAUSED'}</span></h1><p style={{color:'#facc15',fontSize:'11px',fontWeight:700}}>ADMIN • {total} TOTAL • {statusCounts.Hired} HIRED • {Object.keys(phoneCounts).filter(k=>phoneCounts[k]>1).length} DUPLICATES</p></div></div>
        <div style={{display:'flex',gap:'6px',alignItems:'center',flexWrap:'wrap'}}>
          <button onClick={()=>setLive(!live)} style={{background:live?'#22c55e':'#64748b',color:'#fff',border:'none',padding:'9px 12px',borderRadius:'20px',fontWeight:800,fontSize:'11px',cursor:'pointer'}}>{live?'🔴 LIVE 30s':'⏸ PAUSED'}</button>
          <select value={role} onChange={e=>setRole(e.target.value)} style={{padding:'9px 12px',borderRadius:'20px',fontWeight:800,fontSize:'11px',background:role==='super'?'#facc15':'#fff',color:'#0f172a',border:'none'}}><option value="super">👑 SUPER</option><option value="staff">👤 STAFF</option></select>
          <button onClick={()=>setDarkMode(!darkMode)} style={{background:darkMode?'#facc15':'rgba(255,255,255,.12)',color:darkMode?'#0f172a':'#fff',border:'none',padding:'9px 12px',borderRadius:'20px',fontWeight:900,fontSize:'11px',cursor:'pointer'}}>{darkMode?'☀️':'🌙'}</button>
          <button onClick={handleBackup} style={{background:'#22c55e',color:'#fff',border:'none',padding:'9px 12px',borderRadius:'20px',fontWeight:800,fontSize:'11px',cursor:'pointer'}}>💾</button>
          <button onClick={clearDuplicates} style={{background:'#f97316',color:'#fff',border:'none',padding:'9px 12px',borderRadius:'20px',fontWeight:800,fontSize:'11px',cursor:'pointer'}}>🧹 DUP</button>
          <label style={{background:'#0ea5e9',color:'#fff',padding:'9px 12px',borderRadius:'20px',fontWeight:800,fontSize:'11px',cursor:'pointer'}}>📥<input type="file" accept=".csv" onChange={handleImportCSV} style={{display:'none'}}/></label>
          <button onClick={()=>setShowTrash(!showTrash)} style={{background:trash.length?'#dc2626':'rgba(255,255,255,.12)',color:'#fff',border:'none',padding:'9px 12px',borderRadius:'20px',fontWeight:800,fontSize:'11px',cursor:'pointer'}}>🗑 {trash.length}</button>
          <a href="/" style={{background:'#facc15',color:'#0f172a',padding:'9px 14px',borderRadius:'20px',fontWeight:900,fontSize:'11px',textDecoration:'none'}}>🏠</a>
          <button onClick={()=>{setForm({}); setShowAdd(true)}} style={{background:'#fff',color:'#0f172a',border:'none',padding:'9px 14px',borderRadius:'20px',fontWeight:900,fontSize:'11px',cursor:'pointer'}}>＋</button>
          <button onClick={load} style={{background:'rgba(255,255,255,.12)',color:'#fff',border:'none',padding:'9px 14px',borderRadius:'20px',fontWeight:800,fontSize:'11px',cursor:'pointer'}}>{loading?'⏳':'↻'}</button>
        </div>
      </div>

      <div style={{background:bgCard,margin:'18px 20px',padding:'16px 18px',borderRadius:'18px',display:'flex',gap:'12px',alignItems:'center',flexWrap:'wrap',border:`1px solid ${borderColor}`}}>
        <div style={{display:'flex',alignItems:'center',background:darkMode?'#0f172a':'#f8fafc',borderRadius:'24px',padding:'0 16px',border:`1px solid ${borderColor}`,flex:1,minWidth:'240px'}}><span>🔍</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name, phone, email, service..." style={{background:'transparent',border:'none',outline:'none',padding:'12px 10px',width:'100%',fontSize:'13px',color:textMain}}/></div>
        <button onClick={()=>setShowFilters(!showFilters)} style={{background:filters.service||filters.district||filters.status?'#0f172a':'#fff',color:filters.service||filters.district||filters.status?'#facc15':'#0f172a',border:'1px solid #e2e8f0',padding:'11px 18px',borderRadius:'24px',fontWeight:800,fontSize:'12px',cursor:'pointer'}}>⚙ {Object.values(filters).filter(Boolean).length?`(${Object.values(filters).filter(Boolean).length})`:''}</button>
        {selected.length>0 && <><button onClick={handleBulkDelete} style={{background:'#dc2626',color:'#fff',border:'none',padding:'11px 18px',borderRadius:'24px',fontWeight:800,fontSize:'12px',cursor:'pointer'}}>🗑 {selected.length}</button><button onClick={bulkWhatsApp} style={{background:'#22c55e',color:'#fff',border:'none',padding:'11px 18px',borderRadius:'24px',fontWeight:800,fontSize:'12px',cursor:'pointer'}}>💬 WhatsApp ({selected.length})</button><select onChange={e=>{ if(e.target.value) bulkUpdateStatus(e.target.value); e.target.value=''; }} style={{padding:'11px 14px',borderRadius:'24px',border:'1px solid #e2e8f0',fontWeight:700,background:'#facc15'}}><option value="">Status →</option><option>New</option><option>Contacted</option><option>Interviewed</option><option>Hired</option><option>Rejected</option></select></>}
        <div style={{marginLeft:'auto',display:'flex',gap:'10px',alignItems:'center'}}><span style={{fontSize:'12px',color:'#64748b',fontWeight:700}}>ROWS:</span><select value={rowsPerPage} onChange={e=>setRowsPerPage(Number(e.target.value))} style={{padding:'9px 14px',borderRadius:'20px',border:'1px solid #e2e8f0',fontWeight:700,background:'#fff',color:'#0f172a'}}><option value={5}>5</option><option value={10}>10</option><option value={15}>15</option><option value={20}>20</option><option value={30}>30</option><option value={50}>50</option><option value={100}>100</option></select></div>
      </div>

      {showTrash && (<div style={{background:darkMode?'#1e293b':'#fffbeb',margin:'0 20px 18px',padding:'18px 20px',borderRadius:'18px',border:'2px dashed #f59e0b'}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px',flexWrap:'wrap',gap:'10px'}}><h4 style={{fontWeight:900,fontSize:'13px',color:darkMode?'#fde68a':'#92400e'}}>🗑 TRASH - {trash.length} items</h4>{trash.length>0 && <button onClick={emptyTrash} style={{background:'#7f1d1d',color:'#fff',border:'none',padding:'8px 16px',borderRadius:'20px',fontWeight:800,cursor:'pointer',fontSize:'11px'}}>EMPTY PERMANENTLY</button>}</div><div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>{trash.map(t=><div key={t._uid} style={{background:darkMode?'#0f172a':'#fff',padding:'10px 14px',borderRadius:'12px',border:`1px solid ${borderColor}`,fontSize:'11px',color:textMain,display:'flex',alignItems:'center',gap:'8px'}}><span><b>{getVal(t,['FullName','fullName'])}</b> - {getVal(t,['Phone','phone'])}</span><button onClick={()=>restoreFromTrash(t)} style={{background:'#22c55e',color:'#fff',border:'none',padding:'5px 12px',borderRadius:'20px',fontWeight:800,cursor:'pointer',fontSize:'10px'}}>♻️ RESTORE</button><button onClick={()=>deletePermanently(t)} style={{background:'#dc2626',color:'#fff',border:'none',padding:'5px 12px',borderRadius:'20px',fontWeight:800,cursor:'pointer',fontSize:'10px'}}>❌ DELETE PERMANENTLY</button></div>)}{trash.length===0 && <span style={{fontSize:'12px',color:darkMode?'#fde68a':'#92400e'}}>Trash empty</span>}</div></div>)}

      <div style={{maxWidth:'1600px',margin:'auto',padding:'0 20px 20px'}}>
        <div style={{background:bgCard,borderRadius:'18px',overflow:'hidden',border:`2px solid ${borderColor}`}}>
          <div style={{padding:'16px 20px',background:'linear-gradient(90deg,#0f172a,#1e293b)',color:'#facc15',fontWeight:900,fontSize:'13px',display:'flex',justifyContent:'space-between'}}><span>{tab==='contacts'?`📞 CONTACTS — ${list.length}`:`🎖️ APPLICANTS — ${list.length}`} • Page {currentPage}/{Math.ceil(list.length/rowsPerPage)||1} • Sorted {sortConfig.key} {sortConfig.dir}</span><span style={{opacity:.7}}>{selected.length} selected • {statusCounts.New} new</span></div>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px',minWidth:'1850px'}}>
              <thead><tr style={{background:'#0f172a',color:'#fff'}}>
                <th style={{...cellStyle,borderColor:'#1e293b'}}><input type="checkbox" checked={paginatedList.length>0 && paginatedList.every(r=>selected.includes(r._uid))} onChange={()=>{ const ids=paginatedList.map(r=>r._uid); if(ids.every(id=>selected.includes(id))) setSelected(prev=>prev.filter(id=>!ids.includes(id))); else setSelected(prev=>[...new Set([...prev,...ids])]); }}/></th>
                <th style={{...cellStyle,borderColor:'#1e293b'}}>📷</th>
                <th onClick={()=>handleSort('Timestamp')} style={{...cellStyle,borderColor:'#1e293b',textAlign:'left',fontWeight:900,cursor:'pointer'}}>DATE ↕</th>
                <th onClick={()=>handleSort('FullName')} style={{...cellStyle,borderColor:'#1e293b',textAlign:'left',fontWeight:900,cursor:'pointer'}}>NAME ↕</th>
                <th style={{...cellStyle,borderColor:'#1e293b',textAlign:'left',fontWeight:900}}>PHONE</th>
                <th style={{...cellStyle,borderColor:'#1e293b',textAlign:'left',fontWeight:900}}>STATUS</th>
                {tab==='contacts'?<><th onClick={()=>handleSort('Service')} style={{...cellStyle,borderColor:'#1e293b',textAlign:'left',fontWeight:900,cursor:'pointer'}}>SERVICE ↕</th><th style={{...cellStyle,borderColor:'#1e293b',textAlign:'left',fontWeight:900}}>MESSAGE</th></>:<><th onClick={()=>handleSort('Position')} style={{...cellStyle,borderColor:'#1e293b',textAlign:'left',fontWeight:900,cursor:'pointer'}}>POSITION ↕</th><th onClick={()=>handleSort('District')} style={{...cellStyle,borderColor:'#1e293b',textAlign:'left',fontWeight:900,cursor:'pointer'}}>DISTRICT ↕</th><th style={{...cellStyle,borderColor:'#1e293b',fontWeight:900}}>EDU</th><th style={{...cellStyle,borderColor:'#1e293b',textAlign:'left',fontWeight:900}}>EXP ↕</th></>}
                <th onClick={()=>handleSort('InterviewDate')} style={{...cellStyle,borderColor:'#1e293b',textAlign:'left',fontWeight:900,cursor:'pointer',background:'#0f172a'}}>📅 INTERVIEW ↕</th>
                <th style={{...cellStyle,borderColor:'#1e293b',fontWeight:900}}>QUICK</th>
                <th style={{...cellStyle,borderColor:'#1e293b',fontWeight:900}}>ACTIONS</th>
              </tr></thead>
              <tbody>
                {paginatedList.length===0 && <tr><td colSpan={tab==='contacts'?10:11} style={{padding:'40px',textAlign:'center',color:'#94a3b8',fontWeight:700}}>🔍 No data found — Try changing filters or search<br/><span style={{fontSize:'11px'}}>No {tab} matching your criteria</span></td></tr>}
                {paginatedList.map((d,i)=>{ const checked=selected.includes(d._uid); const st=getVal(d,['Status','status'])||'New'; const sc=getStatusColor(st); const isDup=phoneCounts[getVal(d,['Phone','phone'])]>1; const bg = rowBg(i, checked, isDup); return (<tr key={d._uid} style={{background:bg,color:checked?'#0f172a':textMain}}><td style={{...cellStyle,background:bg}}><input type="checkbox" checked={checked} onChange={()=>setSelected(prev=>prev.includes(d._uid)?prev.filter(id=>id!==d._uid):[...prev,d._uid])}/></td><td style={{...cellStyle,background:bg}}>{getVal(d,['Photo','photo']) ? <img src={getVal(d,['Photo','photo'])} alt="" style={{width:'32px',height:'32px',borderRadius:'50%',objectFit:'cover',border:'2px solid #facc15'}}/> : <div style={{width:'32px',height:'32px',borderRadius:'50%',background:darkMode?'#334155':'#f1f5f9',display:'grid',placeItems:'center',fontWeight:900,fontSize:'12px'}}>{getVal(d,['FullName','fullName']).charAt(0)}</div>}</td><td style={{...cellStyle,background:bg,fontWeight:600}}>{getVal(d,['Timestamp','timestamp'])?.slice(0,19)}</td><td style={{...cellStyle,background:bg,fontWeight:800}}>{getVal(d,['FullName','fullName'])} {isDup && <span style={{background:'#dc2626',color:'#fff',fontSize:'8px',padding:'2px 6px',borderRadius:'10px'}}>DUP</span>}</td><td style={{...cellStyle,background:bg}}>{getVal(d,['Phone','phone'])}</td><td style={{...cellStyle,background:bg}}><select value={st} onChange={e=>updateStatus(d,e.target.value)} style={{padding:'5px 8px',borderRadius:'12px',fontSize:'10px',fontWeight:800,background:sc.bg,color:sc.color,border:`1px solid ${sc.border}`,cursor:'pointer'}}><option>New</option><option>Contacted</option><option>Interviewed</option><option>Hired</option><option>Rejected</option></select></td>{tab==='contacts'?<><td style={{...cellStyle,background:bg}}>{getVal(d,['Service','service'])}</td><td style={{...cellStyle,background:bg,maxWidth:'160px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{getVal(d,['Message','Messages','message'])}</td></>:<><td style={{...cellStyle,background:bg}}><span style={{background:darkMode?'#334155':'#fef9c3',color:darkMode?'#fde68a':'#0f172a',padding:'5px 10px',borderRadius:'12px',fontWeight:700,fontSize:'11px'}}>{getVal(d,['Position','position'])}</span></td><td style={{...cellStyle,background:bg,fontWeight:600}}>{getVal(d,['District','district'])}</td><td style={{...cellStyle,background:bg}}>{getVal(d,['Education','education'])}</td><td style={{...cellStyle,background:bg,textAlign:'center',fontWeight:700}}>{getVal(d,['Experience','experience'])}</td></>}<td style={{...cellStyle,background:bg,fontWeight:700,color:getVal(d,['InterviewDate'])?'#15803d':textMain}}>{getVal(d,['InterviewDate'])||'-'}</td><td style={{...cellStyle,background:bg}}><div style={{display:'flex',gap:'4px'}}><a href={`https://wa.me/${String(getVal(d,['Phone','phone'])).replace(/[^0-9]/g,'')}`} target="_blank" style={{padding:'5px 7px',borderRadius:'8px',background:'#dcfce7',border:'1px solid #86efac',fontSize:'11px',textDecoration:'none'}}>💬</a><a href={`tel:${getVal(d,['Phone','phone'])}`} style={{padding:'5px 7px',borderRadius:'8px',background:'#e0f2fe',border:'1px solid #7dd3fc',fontSize:'11px',textDecoration:'none'}}>📞</a></div></td><td style={{...cellStyle,background:bg}}><div style={{display:'flex',gap:'4px'}}><button onClick={()=>setDetailRow(d)} style={{padding:'6px 10px',borderRadius:'8px',border:`1px solid ${borderColor}`,fontSize:'10px',fontWeight:700,cursor:'pointer',background:bgCard,color:textMain}}>VIEW</button><button onClick={()=>handleEdit(d)} style={{padding:'6px 10px',borderRadius:'8px',background:'#facc15',border:'1px solid #eab308',fontSize:'10px',fontWeight:800,cursor:'pointer',color:'#0f172a'}}>EDIT</button><button onClick={()=>handleDelete(d)} style={{padding:'6px 10px',borderRadius:'8px',background:'#fee2e2',color:'#dc2626',border:'1px solid #fecaca',fontSize:'10px',fontWeight:800,cursor:'pointer'}}>DEL</button></div></td></tr>)})}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {editRow && <div style={{position:'fixed',inset:0,background:'rgba(15,23,42,.6)',zIndex:10001,display:'flex',justifyContent:'center',alignItems:'center',padding:'20px'}}><div style={{background:'#fff',borderRadius:'22px',width:'100%',maxWidth:'560px',padding:'26px',maxHeight:'90vh',overflowY:'auto'}}><h3 style={{fontWeight:900,color:'#0f172a'}}>✏️ Edit — {form.FullName}</h3><div style={{display:'grid',gap:'10px',marginTop:'14px'}}><div style={{display:'flex',gap:'10px',alignItems:'center'}}>{form.Photo && <img src={form.Photo} alt="" style={{width:'50px',height:'50px',borderRadius:'50%',objectFit:'cover',border:'2px solid #facc15'}}/>}<label style={{background:'#0f172a',color:'#facc15',padding:'10px 14px',borderRadius:'12px',fontWeight:800,fontSize:'11px',cursor:'pointer'}}>📷 UPLOAD PHOTO<input type="file" accept="image/*" onChange={handlePhotoUpload} style={{display:'none'}}/></label></div>{["FullName","Phone","Email","Service","Message","Position","Education","District","Experience","Interest"].map(f=><input key={f} value={form[f]||''} onChange={e=>setForm({...form,[f]:e.target.value})} placeholder={f} style={{padding:'12px 14px',borderRadius:'12px',border:'1px solid #e2e8f0',color:'#0f172a'}}/>)}<select value={form.Status||'New'} onChange={e=>setForm({...form, Status:e.target.value})} style={{padding:'12px 14px',borderRadius:'12px',border:'1px solid #e2e8f0',color:'#0f172a'}}><option>New</option><option>Contacted</option><option>Interviewed</option><option>Hired</option><option>Rejected</option></select><input type="date" value={form.InterviewDate||''} onChange={e=>setForm({...form, InterviewDate:e.target.value})} style={{padding:'12px 14px',borderRadius:'12px',border:'1px solid #e2e8f0',color:'#0f172a'}}/><input value={form.Assigned||''} onChange={e=>setForm({...form, Assigned:e.target.value})} placeholder="Assigned To" style={{padding:'12px 14px',borderRadius:'12px',border:'1px solid #e2e8f0',color:'#0f172a'}}/><textarea value={form.Notes||''} onChange={e=>setForm({...form, Notes:e.target.value})} placeholder="Private Notes" style={{padding:'12px 14px',borderRadius:'12px',border:'1px solid #e2e8f0',minHeight:'70px',color:'#0f172a'}}/></div><div style={{display:'flex',gap:'10px',marginTop:'14px'}}><button onClick={()=>setEditRow(null)} style={{flex:1,padding:'13px',borderRadius:'14px',border:'1px solid #e2e8f0',background:'#fff',fontWeight:700,cursor:'pointer',color:'#0f172a'}}>CANCEL</button><button onClick={handleSave} style={{flex:1,background:'#0f172a',color:'#facc15',padding:'13px',borderRadius:'14px',fontWeight:900,border:'none',cursor:'pointer'}}>SAVE</button></div></div></div>}

      {showAdd && <div style={{position:'fixed',inset:0,background:'rgba(15,23,42,.6)',zIndex:10001,display:'flex',justifyContent:'center',alignItems:'center',padding:'20px'}}><div style={{background:'#fff',borderRadius:'22px',width:'100%',maxWidth:'520px',padding:'26px'}}><h3 style={{fontWeight:900,color:'#0f172a'}}>➕ Add New {tab.toUpperCase()}</h3><div style={{display:'grid',gap:'10px',marginTop:'14px'}}><div style={{display:'flex',gap:'10px',alignItems:'center'}}>{form.Photo && <img src={form.Photo} alt="" style={{width:'50px',height:'50px',borderRadius:'50%',objectFit:'cover',border:'2px solid #facc15'}}/>}<label style={{background:'#0f172a',color:'#facc15',padding:'10px 14px',borderRadius:'12px',fontWeight:800,fontSize:'11px',cursor:'pointer'}}>📷 UPLOAD PHOTO<input type="file" accept="image/*" onChange={handlePhotoUpload} style={{display:'none'}}/></label></div>{["FullName","Phone","Email","Service","Message","Position","Education","District","Experience","Interest"].map(f=><input key={f} value={form[f]||''} onChange={e=>setForm({...form,[f]:e.target.value})} placeholder={f} style={{padding:'12px 14px',borderRadius:'12px',border:'1px solid #e2e8f0',color:'#0f172a'}}/>)}<input type="date" value={form.InterviewDate||''} onChange={e=>setForm({...form, InterviewDate:e.target.value})} style={{padding:'12px 14px',borderRadius:'12px',border:'1px solid #e2e8f0',color:'#0f172a'}}/></div><div style={{display:'flex',gap:'10px',marginTop:'14px'}}><button onClick={()=>setShowAdd(false)} style={{flex:1,padding:'13px',borderRadius:'14px',border:'1px solid #e2e8f0',background:'#fff',fontWeight:700,cursor:'pointer',color:'#0f172a'}}>CANCEL</button><button onClick={handleAddNew} style={{flex:1,background:'#facc15',padding:'13px',borderRadius:'14px',fontWeight:900,border:'none',cursor:'pointer',color:'#0f172a'}}>ADD</button></div></div></div>}
    </div>
  )
}
export default AdminDashboard;