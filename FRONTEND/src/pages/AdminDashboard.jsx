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
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);
  const [editRow, setEditRow] = useState(null);
  const [form, setForm] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState("");
  const [trash, setTrash] = useState(()=>JSON.parse(localStorage.getItem('psl_trash')||'[]'));
  const [showTrash, setShowTrash] = useState(false);
  const [live, setLive] = useState(true);
  const audioRef = useRef(null);

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(""), 3500); }
  const login = () => pass === ADMIN_PASSWORD ? setAuth(true) : alert("Wrong Password!");
  
  // FIXED - BOTH CONTACTS + APPLICANTS RECEIVING DATA NOW
  const load = () => {
    setLoading(true);
    fetch(GOOGLE_SHEET_WEBHOOK + "?cache=" + Date.now())
      .then(r=>r.text())
      .then(text=>{
        let d; try { d = JSON.parse(text); } catch(e) { d = []; }
        const arr = Array.isArray(d)?d:(d.data||[]);
        const withId = arr.map((row,i)=>{ 
          const ts = (row.Timestamp || row.timestamp || "") + "";
          if(!ts || ts.trim()==="" || ts==="undefined") return null;
          const saved = JSON.parse(localStorage.getItem(`psl_${ts}`) || '{}');
          return { ...row, Timestamp: ts, timestamp: ts, Status: saved.Status || row.Status || row.status || 'New', _uid: `${ts}_${i}_${row.Phone||i}`, _index: i }
        }).filter(Boolean);
        const sorted = withId.sort((a,b)=> new Date(b.timestamp||0) - new Date(a.timestamp||0));
        setData(sorted); setLoading(false);
        if(sorted.length===0) showToast("⚠️ Sheet returned 0 - redeploy Apps Script as Anyone");
      })
      .catch(()=>{ setLoading(false); showToast("❌ Load failed"); });
  };
  
  useEffect(()=>{ if(auth){ load(); } },[auth]);
  useEffect(()=>{ if(!auth || !live) return; const id=setInterval(()=>load(),30000); return ()=>clearInterval(id); },[auth, live, data.length]);
  useEffect(()=>{ setCurrentPage(1); },[search, tab, rowsPerPage]);
  const getVal = (obj, keys) => { for(let k of keys) if(obj[k]!==undefined && obj[k]!==null && obj[k]!=='') return obj[k]; return ''; }
  
  const handleDelete = async (row) => {
    const newTrash = [{...row, deletedAt: new Date().toISOString()}, ...trash].slice(0,200);
    setTrash(newTrash); localStorage.setItem('psl_trash', JSON.stringify(newTrash));
    setData(prev => prev.filter(r => r._uid !== row._uid));
    showToast("🗑 Moved to Trash");
    await fetch(GOOGLE_SHEET_WEBHOOK,{ method:'POST', mode:'no-cors', headers:{'Content-Type':'text/plain'}, body:JSON.stringify({ action:'delete', Timestamp: getVal(row,['Timestamp','timestamp']) }) });
  };
  const handleBulkDelete = async () => {
    if(selected.length===0) return;
    const toDeleteRows = data.filter(r=>selected.includes(r._uid));
    const timestamps = [...new Set(toDeleteRows.map(r=>getVal(r,['Timestamp','timestamp'])))].filter(Boolean);
    const newTrash = [...toDeleteRows.map(r=>({...r, deletedAt:new Date().toISOString()})), ...trash].slice(0,200);
    setTrash(newTrash); localStorage.setItem('psl_trash', JSON.stringify(newTrash));
    setData(prev => prev.filter(r => !selected.includes(r._uid))); setSelected([]);
    showToast(`🗑 ${timestamps.length} moved`);
    await fetch(GOOGLE_SHEET_WEBHOOK,{ method:'POST', mode:'no-cors', headers:{'Content-Type':'text/plain'}, body:JSON.stringify({ action:'bulkDelete', timestamps }) });
  };
  const restoreFromTrash = (row) => { setData(prev=>[row, ...prev]); setTrash(prev=>{ const nt=prev.filter(r=>r._uid!==row._uid); localStorage.setItem('psl_trash', JSON.stringify(nt)); return nt; }); showToast('♻️ Restored'); };
  const deletePermanently = (row) => { setTrash(prev=>{ const nt=prev.filter(r=>r._uid!==row._uid); localStorage.setItem('psl_trash', JSON.stringify(nt)); return nt; }); showToast('❌ Deleted'); };
  const emptyTrash = () => { if(!confirm(`Delete ALL ${trash.length}?`)) return; setTrash([]); localStorage.setItem('psl_trash','[]'); showToast('🗑 Emptied'); };
  const clearDuplicates = () => {
    const seen = new Set(); const dups = []; const keep = [];
    data.forEach(r=>{ const key = getVal(r,['Phone','phone'])+"_"+getVal(r,['FullName','fullName']); if(seen.has(key)) dups.push(r); else { seen.add(key); keep.push(r); } });
    if(dups.length===0){ showToast('✅ No duplicates'); return; }
    if(!confirm(`Found ${dups.length} duplicates?`)) return;
    setTrash(prev=>{ const nt=[...dups.map(d=>({...d, deletedAt:new Date().toISOString()})), ...prev].slice(0,200); localStorage.setItem('psl_trash', JSON.stringify(nt)); return nt; });
    setData(keep); showToast(`🧹 ${dups.length} moved`);
  };
  const handleEdit = (row) => { setEditRow(row); setForm({ FullName:getVal(row,['FullName','fullName']), Phone:getVal(row,['Phone','phone']), Email:getVal(row,['Email','email']), Service:getVal(row,['Service','service']), Message:getVal(row,['Message','message']), Position:getVal(row,['Position','position']), District:getVal(row,['District','district']), Status:getVal(row,['Status','status'])||'New', timestamp:getVal(row,['Timestamp','timestamp']) }); };
  const handleSave = () => {
    const ts = form.timestamp; const saved = JSON.parse(localStorage.getItem(`psl_${ts}`) || '{}');
    localStorage.setItem(`psl_${ts}`, JSON.stringify({...saved, Status:form.Status}));
    setData(prev => prev.map(r => r._uid===editRow._uid ? { ...r, ...form, Timestamp: ts } : r));
    setEditRow(null); showToast("✅ Updated");
  };
  const handleBackup = () => { const blob = new Blob([JSON.stringify({data, exportedAt:new Date().toISOString()}, null, 2)], {type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`pinnacle_backup_${new Date().toISOString().slice(0,10)}.json`; a.click(); showToast('💾 Backup'); };
  const bulkWhatsApp = () => {
    if(selected.length===0){ showToast('Select rows first'); return; }
    const rows = data.filter(r=>selected.includes(r._uid));
    const msg = prompt(`Message to ${rows.length} people:`, `Hello, this is Pinnacle Security Ltd.`);
    if(!msg) return;
    rows.forEach(r=>{ const ph=String(getVal(r,['Phone','phone'])).replace(/[^0-9]/g,''); window.open(`https://wa.me/${ph}?text=${encodeURIComponent(msg)}`, '_blank'); });
  };
  const exportCSV = (rows, filename) => { if(!rows.length) return; const headers = tab==='contacts'?["Timestamp","FullName","Phone","Email","Service","Message"]:["Timestamp","FullName","Phone","Position","District"]; const csv = [headers.join(",")].concat(rows.map(r=> headers.map(h=>`"${String(getVal(r,[h,h.toLowerCase()])||'').replace(/"/g,'""')}"`).join(","))).join("\n"); const blob = new Blob([csv],{type:"text/csv"}); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download=filename; a.click(); showToast("📥 CSV"); };

  if(!auth){ return ( <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#0f172a 0%,#1e293b 50%,#0f172a 100%)',display:'flex',justifyContent:'center',alignItems:'center',fontFamily:'Inter, Arial'}}><div style={{background:'#ffffff',padding:'44px 36px',borderRadius:'24px',width:'92%',maxWidth:'400px',textAlign:'center'}}><div style={{width:'72px',height:'72px',background:'linear-gradient(135deg,#facc15,#eab308)',borderRadius:'20px',margin:'0 auto 18px',display:'grid',placeItems:'center',color:'#0f172a',fontSize:'30px',fontWeight:900}}>P</div><h2 style={{fontWeight:900,color:'#0f172a',fontSize:'22px'}}>PINNACLE ADMIN</h2><input type="password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&login()} placeholder="Admin Password" style={{width:'100%',padding:'15px 18px',borderRadius:'14px',marginTop:'26px',border:'2px solid #e2e8f0'}}/><button onClick={login} style={{width:'100%',marginTop:'16px',background:'linear-gradient(135deg,#facc15,#eab308)',padding:'15px',borderRadius:'14px',fontWeight:900,border:'none',cursor:'pointer',color:'#0f172a'}}>UNLOCK →</button></div></div> ) }

  const applicants = data.filter(d => (d.type==='applicant' || d.type==='applicants' || getVal(d,['Position','position']))); 
  const contacts = data.filter(d => (d.type==='contact' || d.type==='contacts' || getVal(d,['Service','service']) || (!getVal(d,['Position','position']) && getVal(d,['FullName','fullName'])) )); 
  const total = data.length;
  const phoneCounts = data.reduce((acc,d)=>{ const ph=getVal(d,['Phone','phone']); if(ph){ acc[ph]=(acc[ph]||0)+1; } return acc; }, {});
  const list = (tab==='contacts'?contacts:tab==='applicants'?applicants:data).filter(d=>{ const s = `${getVal(d,['FullName','fullName'])} ${getVal(d,['Phone','phone'])}`.toLowerCase(); return !search || s.includes(search.toLowerCase()); });
  const paginatedList = list.slice((currentPage-1)*rowsPerPage, currentPage*rowsPerPage);

  const bgMain = '#0f172a'; const bgCard = '#1e293b'; const textMain = '#f1f5f9'; const borderColor = '#334155';
  const cellStyle = {padding:'11px',border:`1px solid ${borderColor}`};
  const menuItem = (active) => ({padding:'11px 14px',borderRadius:'12px',fontSize:'13px',fontWeight:active?900:700,cursor:'pointer',background:active?'linear-gradient(135deg,#facc15,#eab308)':'transparent',color:active?'#0f172a':'#cbd5e1',border:active?'none':`1px solid ${borderColor}`,textAlign:'left',width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center'});

  return (
    <div style={{background:bgMain,minHeight:'100vh',fontFamily:'Inter, Arial',color:textMain,display:'flex'}}>
      <audio ref={audioRef} src="https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=notification-112406.mp3" preload="auto"/>
      {toast && <div style={{position:'fixed',top:'22px',right:'22px',background:'#0f172a',color:'#facc15',padding:'13px 22px',borderRadius:'30px',fontWeight:900,fontSize:'13px',zIndex:99999,border:'1px solid #facc15'}}>{toast}</div>}

      {/* SIDEBAR - LIKE YOUR SKETCH */}
      <div style={{width:'270px',minWidth:'270px',background:'#1e293b',borderRight:`3px solid #facc15`,padding:'20px 14px',display:'flex',flexDirection:'column',gap:'10px',position:'sticky',top:0,height:'100vh',overflowY:'auto'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px',padding:'6px 6px 16px',borderBottom:`2px solid ${borderColor}`}}>
          <div style={{width:'44px',height:'44px',background:'linear-gradient(135deg,#facc15,#eab308)',borderRadius:'12px',display:'grid',placeItems:'center',fontWeight:900,color:'#0f172a',fontSize:'20px'}}>P</div>
          <div>
            <h2 style={{fontWeight:900,fontSize:'13px',color:'#fff',lineHeight:'1.1'}}>Pinnacle Security Ltd</h2>
            <p style={{fontSize:'10px',color:'#facc15',fontWeight:700,marginTop:'3px'}}>Admin • Total {total} • {contacts.length}c • {applicants.length}a</p>
          </div>
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:'8px',marginTop:'8px'}}>
          <p style={{fontSize:'10px',color:'#94a3b8',fontWeight:800,letterSpacing:'1px',marginLeft:'4px'}}>HOW I WISH YOU MADE - THIS</p>
          
          <button onClick={()=>{setTab('contacts'); setCurrentPage(1)}} style={menuItem(tab==='contacts')}> <span>📞 Contact</span> <span style={{background:'#0f172a',color:'#facc15',padding:'2px 8px',borderRadius:'20px',fontSize:'11px'}}>{contacts.length}</span> </button>
          <button onClick={()=>{setTab('applicants'); setCurrentPage(1)}} style={menuItem(tab==='applicants')}> <span>🎖️ Applicant</span> <span style={{background:'#0f172a',color:'#facc15',padding:'2px 8px',borderRadius:'20px',fontSize:'11px'}}>{applicants.length}</span> </button>
          <button onClick={()=>{setTab('total'); setCurrentPage(1)}} style={menuItem(tab==='total')}> <span>📊 Total</span> <span>{total}</span> </button>
          <button onClick={()=>setLive(!live)} style={menuItem(false)}> <span>{live?'🔴 Live':'⏸ Live'}</span> <span style={{fontSize:'10px'}}>{live?'30s':'OFF'}</span> </button>
          <button onClick={handleBackup} style={menuItem(false)}> <span>💾 Backup</span> </button>
          <button onClick={()=>setShowTrash(!showTrash)} style={menuItem(showTrash)}> <span>🗑 Trash</span> <span>{trash.length}</span> </button>
          <a href="/" style={{...menuItem(false), textDecoration:'none'}}> <span>🏠 Home</span> </a>
          <button onClick={()=>{setForm({}); setShowAdd(true)}} style={menuItem(false)}> <span>➕ Add</span> </button>
          <button onClick={load} style={menuItem(false)}> <span>{loading?'⏳ Refresh':'↻ Refresh'}</span> </button>
        </div>

        <div style={{marginTop:'auto',background:'#0f172a',padding:'12px',borderRadius:'14px',border:`1px solid ${borderColor}`}}>
          <p style={{fontSize:'11px',color:'#94a3b8',fontWeight:700}}>Current View</p>
          <p style={{fontSize:'13px',fontWeight:900,color:'#facc15',marginTop:'4px'}}>{tab.toUpperCase()} • {list.length} rows</p>
          <div style={{display:'flex',gap:'6px',marginTop:'10px'}}>
            <button onClick={()=>exportCSV(list,`${tab}.csv`)} style={{flex:1,background:'#facc15',color:'#0f172a',border:'none',padding:'8px',borderRadius:'10px',fontWeight:900,fontSize:'11px',cursor:'pointer'}}>⬇ CSV</button>
            <button onClick={clearDuplicates} style={{flex:1,background:'#334155',color:'#fff',border:'none',padding:'8px',borderRadius:'10px',fontWeight:800,fontSize:'11px',cursor:'pointer'}}>🧹 DUP ({Object.keys(phoneCounts).filter(k=>phoneCounts[k]>1).length})</button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT - "if I click on... here" */}
      <div style={{flex:1,padding:'20px',overflowX:'hidden'}}>
        <div style={{background:bgCard,padding:'14px 18px',borderRadius:'16px',display:'flex',gap:'10px',alignItems:'center',flexWrap:'wrap',border:`1px solid ${borderColor}`,marginBottom:'14px'}}>
          <div style={{display:'flex',alignItems:'center',background:'#0f172a',borderRadius:'24px',padding:'0 14px',border:`1px solid ${borderColor}`,flex:1,minWidth:'200px'}}><span>🔍</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, phone..." style={{background:'transparent',border:'none',outline:'none',padding:'11px 8px',width:'100%',fontSize:'13px',color:textMain}}/></div>
          {selected.length>0 && <><button onClick={handleBulkDelete} style={{background:'#dc2626',color:'#fff',border:'none',padding:'10px 16px',borderRadius:'20px',fontWeight:800,fontSize:'12px',cursor:'pointer'}}>🗑 {selected.length}</button><button onClick={bulkWhatsApp} style={{background:'#22c55e',color:'#fff',border:'none',padding:'10px 16px',borderRadius:'20px',fontWeight:800,fontSize:'12px',cursor:'pointer'}}>💬 WhatsApp</button></>}
          <select value={rowsPerPage} onChange={e=>setRowsPerPage(Number(e.target.value))} style={{padding:'8px 12px',borderRadius:'20px',border:`1px solid ${borderColor}`,background:'#0f172a',color:'#facc15',fontWeight:700}}><option value={10}>10</option><option value={20}>20</option><option value={50}>50</option><option value={100}>100</option></select>
        </div>

        {showTrash && <div style={{background:'#1e293b',padding:'14px',borderRadius:'14px',border:'2px dashed #f59e0b',marginBottom:'14px'}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><h4 style={{fontSize:'12px',fontWeight:900,color:'#fde68a'}}>🗑 TRASH - {trash.length}</h4><button onClick={emptyTrash} style={{background:'#7f1d1d',color:'#fff',border:'none',padding:'6px 12px',borderRadius:'20px',fontSize:'11px',fontWeight:800,cursor:'pointer'}}>EMPTY</button></div><div style={{display:'flex',gap:'6px',flexWrap:'wrap',marginTop:'10px'}}>{trash.map(t=><div key={t._uid} style={{background:'#0f172a',padding:'8px 12px',borderRadius:'10px',fontSize:'11px',display:'flex',gap:'6px',alignItems:'center',border:`1px solid ${borderColor}`}}><span><b>{getVal(t,['FullName','fullName'])}</b></span><button onClick={()=>restoreFromTrash(t)} style={{background:'#22c55e',color:'#fff',border:'none',padding:'4px 8px',borderRadius:'10px',fontSize:'10px',fontWeight:800,cursor:'pointer'}}>♻️</button><button onClick={()=>deletePermanently(t)} style={{background:'#dc2626',color:'#fff',border:'none',padding:'4px 8px',borderRadius:'10px',fontSize:'10px',fontWeight:800,cursor:'pointer'}}>❌</button></div>)}</div></div>}

        <div style={{background:bgCard,borderRadius:'16px',overflow:'hidden',border:`2px solid ${borderColor}`}}>
          <div style={{padding:'14px 18px',background:'linear-gradient(90deg,#0f172a,#1e293b)',color:'#facc15',fontWeight:900,fontSize:'12px',display:'flex',justifyContent:'space-between'}}>
            <span>{tab==='contacts'?'📞 CONTACTS':tab==='applicants'?'🎖️ APPLICANTS':'📊 ALL DATA'} — {list.length} rows {loading?'• LOADING...':''} — Click menu on left, data shows here</span>
            <span>{selected.length} selected</span>
          </div>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px',minWidth:'800px'}}>
              <thead><tr style={{background:'#0f172a',color:'#fff'}}>
                <th style={cellStyle}><input type="checkbox" checked={paginatedList.length>0 && paginatedList.every(r=>selected.includes(r._uid))} onChange={()=>{ const ids=paginatedList.map(r=>r._uid); if(ids.every(id=>selected.includes(id))) setSelected(prev=>prev.filter(id=>!ids.includes(id))); else setSelected(prev=>[...new Set([...prev,...ids])]); }}/></th>
                <th style={cellStyle}>DATE</th>
                <th style={cellStyle}>NAME</th>
                <th style={cellStyle}>PHONE</th>
                {tab==='contacts'?<><th style={cellStyle}>SERVICE</th><th style={cellStyle}>MESSAGE</th></>:tab==='applicants'?<><th style={cellStyle}>POSITION</th><th style={cellStyle}>DISTRICT</th></>:<><th style={cellStyle}>TYPE</th><th style={cellStyle}>INFO</th></>}
                <th style={cellStyle}>ACTIONS</th>
              </tr></thead>
              <tbody>
                {paginatedList.length===0 && <tr><td colSpan={6} style={{padding:'40px',textAlign:'center',color:'#94a3b8',fontWeight:700}}>{loading?'⏳ Loading from sheet...':'🔍 No data - if you clicked Contact/Applicant and empty, redeploy Apps Script as Anyone + New Version'}</td></tr>}
                {paginatedList.map((d,i)=>{ const checked=selected.includes(d._uid); const bg = checked?'#422006':i%2===0?bgCard:'#0f172a'; return (<tr key={d._uid} style={{background:bg}}><td style={{...cellStyle,background:bg}}><input type="checkbox" checked={checked} onChange={()=>setSelected(prev=>prev.includes(d._uid)?prev.filter(id=>id!==d._uid):[...prev,d._uid])}/></td><td style={{...cellStyle,background:bg}}>{getVal(d,['Timestamp','timestamp'])?.slice(0,19)}</td><td style={{...cellStyle,background:bg,fontWeight:800}}>{getVal(d,['FullName','fullName'])}</td><td style={{...cellStyle,background:bg}}>{getVal(d,['Phone','phone'])}</td>{tab==='contacts'?<><td style={{...cellStyle,background:bg}}>{getVal(d,['Service','service'])}</td><td style={{...cellStyle,background:bg,maxWidth:'200px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{getVal(d,['Message','message'])}</td></>:tab==='applicants'?<><td style={{...cellStyle,background:bg}}>{getVal(d,['Position','position'])}</td><td style={{...cellStyle,background:bg}}>{getVal(d,['District','district'])}</td></>:<><td style={{...cellStyle,background:bg}}>{getVal(d,['type','Type'])||getVal(d,['Service','service'])?'contact':'applicant'}</td><td style={{...cellStyle,background:bg}}>{getVal(d,['Service','service'])||getVal(d,['Position','position'])}</td></>}<td style={{...cellStyle,background:bg}}><div style={{display:'flex',gap:'4px'}}><button onClick={()=>handleEdit(d)} style={{padding:'6px 10px',borderRadius:'8px',background:'#facc15',border:'none',fontSize:'10px',fontWeight:800,cursor:'pointer',color:'#0f172a'}}>EDIT</button><button onClick={()=>handleDelete(d)} style={{padding:'6px 10px',borderRadius:'8px',background:'#fee2e2',color:'#dc2626',border:'none',fontSize:'10px',fontWeight:800,cursor:'pointer'}}>DEL</button></div></td></tr>)})}
              </tbody>
            </table>
          </div>
          <div style={{padding:'12px 18px',display:'flex',justifyContent:'space-between',borderTop:`1px solid ${borderColor}`}}>
            <div style={{display:'flex',gap:'6px'}}><button disabled={currentPage===1} onClick={()=>setCurrentPage(p=>Math.max(1,p-1))} style={{padding:'8px 14px',borderRadius:'10px',border:`1px solid ${borderColor}`,background:bgCard,color:textMain,fontWeight:800,cursor:'pointer'}}>◂</button><span style={{background:'#facc15',color:'#0f172a',padding:'8px 12px',borderRadius:'10px',fontWeight:800}}>{currentPage}</span><button disabled={currentPage>=Math.ceil(list.length/rowsPerPage)} onClick={()=>setCurrentPage(p=>p+1)} style={{padding:'8px 14px',borderRadius:'10px',border:`1px solid ${borderColor}`,background:bgCard,color:textMain,fontWeight:800,cursor:'pointer'}}>▸</button></div>
            <span style={{fontSize:'11px',color:'#94a3b8'}}>Page {currentPage}/{Math.ceil(list.length/rowsPerPage)||1} • Click Contact / Applicant on left → shows here</span>
          </div>
        </div>
      </div>

      {editRow && <div style={{position:'fixed',inset:0,background:'rgba(15,23,42,.6)',zIndex:10001,display:'flex',justifyContent:'center',alignItems:'center',padding:'20px'}}><div style={{background:'#fff',borderRadius:'22px',width:'100%',maxWidth:'480px',padding:'22px'}}><h3 style={{fontWeight:900,color:'#0f172a'}}>Edit {form.FullName}</h3><div style={{display:'grid',gap:'8px',marginTop:'12px'}}>{["FullName","Phone","Email","Service","Position","District"].map(f=><input key={f} value={form[f]||''} onChange={e=>setForm({...form,[f]:e.target.value})} placeholder={f} style={{padding:'10px 12px',borderRadius:'10px',border:'1px solid #e2e8f0',color:'#0f172a'}}/>)}<select value={form.Status||'New'} onChange={e=>setForm({...form, Status:e.target.value})} style={{padding:'10px 12px',borderRadius:'10px',border:'1px solid #e2e8f0'}}><option>New</option><option>Contacted</option><option>Hired</option><option>Rejected</option></select></div><div style={{display:'flex',gap:'8px',marginTop:'12px'}}><button onClick={()=>setEditRow(null)} style={{flex:1,padding:'11px',borderRadius:'12px',border:'1px solid #e2e8f0',background:'#fff',fontWeight:700,cursor:'pointer'}}>CANCEL</button><button onClick={handleSave} style={{flex:1,background:'#0f172a',color:'#facc15',padding:'11px',borderRadius:'12px',fontWeight:900,border:'none',cursor:'pointer'}}>SAVE</button></div></div></div>}
    </div>
  )
}
export default AdminDashboard;