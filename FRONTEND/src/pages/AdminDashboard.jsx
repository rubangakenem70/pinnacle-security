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
  const [rowsPerPage, setRowsPerPage] = useState(10);
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
      arr.forEach(row=>{ const ts = (row.Timestamp || row.timestamp || '').trim(); if(!ts) return; if(!map.has(ts)) map.set(ts, row); });
      const uniqueArr = Array.from(map.values());
      const withId = uniqueArr.map((row,i)=>({ ...row, _uid: `${row.Timestamp||row.timestamp}_${i}`, _index: i }));
      const sorted = withId.sort((a,b)=> new Date(b.timestamp||b.Timestamp||0) - new Date(a.timestamp||a.Timestamp||0));
      setData(sorted); setLoading(false);
    }).catch(()=>setLoading(false));
  };
  
  useEffect(()=>{ if(auth) load(); },[auth]);
  useEffect(()=>{ setCurrentPage(1); },[filters, search, tab, rowsPerPage]);
  const getVal = (obj, keys) => { for(let k of keys) if(obj[k]!==undefined && obj[k]!==null && obj[k]!=='') return obj[k]; return ''; }
  
  // FIXED DELETE - NOW DELETES FROM SHEET BOTH TABS
  const handleDelete = async (row) => {
    const uid = row._uid;
    const ts = getVal(row,['Timestamp','timestamp']);
    const fn = getVal(row,['FullName','fullName']);
    const ph = getVal(row,['Phone','phone']);
    setData(prev => prev.filter(r => r._uid !== uid));
    setSelected(prev=>prev.filter(id=>id!==uid));
    if(detailRow && detailRow._uid===uid) setDetailRow(null);
    showToast("🗑 Deleted from Admin & Sheet");
    await fetch(GOOGLE_SHEET_WEBHOOK,{ method:'POST', mode:'no-cors', headers:{'Content-Type':'text/plain'}, body:JSON.stringify({ action:'delete', timestamp: ts, Timestamp: ts, FullName: fn, Phone: ph }) });
  };

  const handleBulkDelete = async () => {
    if(selected.length===0) return;
    const toDeleteRows = data.filter(r=>selected.includes(r._uid));
    const timestamps = [...new Set(toDeleteRows.map(r=>getVal(r,['Timestamp','timestamp'])))].filter(Boolean);
    const items = toDeleteRows.map(r=>({ FullName:getVal(r,['FullName','fullName']), Phone:getVal(r,['Phone','phone']), timestamp:getVal(r,['Timestamp','timestamp']) }));
    setData(prev => prev.filter(r => !selected.includes(r._uid)));
    setSelected([]); setDetailRow(null);
    showToast(`🗑 ${timestamps.length} deleted from both sides`);
    await fetch(GOOGLE_SHEET_WEBHOOK,{ method:'POST', mode:'no-cors', headers:{'Content-Type':'text/plain'}, body:JSON.stringify({ action:'bulkDelete', timestamps, items }) });
  };

  const handleEdit = (row) => {
    setEditRow(row);
    setForm({ FullName:getVal(row,['FullName','fullName']), Phone:getVal(row,['Phone','phone']), Email:getVal(row,['Email','email']), Service:getVal(row,['Service','service']), Message:getVal(row,['Message','Messages','message']), Position:getVal(row,['Position','position']), Education:getVal(row,['Education','education']), District:getVal(row,['District','district']), Experience:getVal(row,['Experience','experience']), Interest:getVal(row,['Interest','interest']), timestamp:getVal(row,['Timestamp','timestamp']), type: row.type|| (tab==='contacts'?'contact':'applicant') });
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
  const activeFilterCount = Object.values(filters).filter(v=>v).length;
  const clearFilters = () => setFilters({ service:"", position:"", district:"", education:"", experience:"", interest:"", dateFrom:"", dateTo:"" });

  const exportCSV = (rows, filename) => {
    if(!rows.length) return;
    const headers = tab==='contacts'?["Timestamp","FullName","Phone","Email","Service","Message"]:["Timestamp","FullName","Phone","Email","Position","Education","District","Experience","Interest"];
    const csv = [headers.join(",")].concat(rows.map(r=> headers.map(h=>`"${String(getVal(r,[h,h.toLowerCase()])||'').replace(/"/g,'""')}"`).join(","))).join("\n");
    const blob = new Blob([csv],{type:"text/csv"}); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download=filename; a.click();
    showToast("📥 Exported CSV");
  };

  return (
    <div style={{background:'#f1f5f9',minHeight:'100vh',fontFamily:'Inter, Arial'}}>
      {toast && <div style={{position:'fixed',top:'22px',right:'22px',background:'#0f172a',color:'#facc15',padding:'13px 22px',borderRadius:'30px',fontWeight:900,fontSize:'13px',zIndex:99999,boxShadow:'0 8px 24px rgba(0,0,0,.2)',border:'1px solid #facc15'}}>{toast}</div>}
      
      <div style={{background:'linear-gradient(90deg,#0f172a 0%,#1e293b 100%)',padding:'16px 22px',display:'flex',justifyContent:'space-between',alignItems:'center',position:'sticky',top:0,zIndex:100,borderBottom:'4px solid #facc15',flexWrap:'wrap',gap:'12px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'14px'}}>
          <div style={{width:'46px',height:'46px',background:'linear-gradient(135deg,#facc15,#eab308)',borderRadius:'14px',display:'grid',placeItems:'center',fontWeight:900,color:'#0f172a',fontSize:'20px',boxShadow:'0 4px 12px rgba(250,204,21,.3)'}}>P</div>
          <div><h1 style={{color:'#fff',fontWeight:900,fontSize:'16px',letterSpacing:'-0.3px'}}>PINNACLE SECURITY LTD</h1><p style={{color:'#facc15',fontSize:'11px',fontWeight:700,letterSpacing:'1px'}}>ADMIN • {total} TOTAL RECORDS</p></div>
        </div>
        <div style={{display:'flex',gap:'10px'}}>
          <a href="/" style={{background:'#facc15',color:'#0f172a',padding:'10px 18px',borderRadius:'24px',fontWeight:900,fontSize:'12px',textDecoration:'none',boxShadow:'0 4px 10px rgba(250,204,21,.3)'}}>🏠 WEBSITE</a>
          <button onClick={()=>{setForm({}); setShowAdd(true)}} style={{background:'#fff',color:'#0f172a',border:'none',padding:'10px 18px',borderRadius:'24px',fontWeight:900,fontSize:'12px',cursor:'pointer'}}>＋ ADD</button>
          <button onClick={load} style={{background:'rgba(255,255,255,.12)',color:'#fff',border:'1px solid rgba(255,255,255,.15)',padding:'10px 18px',borderRadius:'24px',fontWeight:800,fontSize:'12px',cursor:'pointer',backdropFilter:'blur(10px)'}}>{loading?'⏳':'↻ REFRESH'}</button>
        </div>
      </div>

      <div style={{background:'#ffffff',margin:'18px 20px',padding:'16px 18px',borderRadius:'18px',display:'flex',gap:'12px',alignItems:'center',flexWrap:'wrap',boxShadow:'0 4px 20px rgba(15,23,42,.06)',border:'1px solid #e2e8f0'}}>
        <div style={{display:'flex',alignItems:'center',background:'#f8fafc',borderRadius:'24px',padding:'0 16px',border:'1px solid #e2e8f0',flex:1,minWidth:'240px'}}>
          <span>🔍</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name, phone, email, service..." style={{background:'transparent',border:'none',outline:'none',padding:'12px 10px',width:'100%',fontSize:'13px'}}/>
        </div>
        {selected.length>0 && <button onClick={handleBulkDelete} style={{background:'linear-gradient(135deg,#dc2626,#b91c1c)',color:'#fff',border:'none',padding:'11px 18px',borderRadius:'24px',fontWeight:800,fontSize:'12px',cursor:'pointer',boxShadow:'0 4px 12px rgba(220,38,38,.3)'}}>🗑 DELETE SELECTED ({selected.length})</button>}
        <div style={{marginLeft:'auto',display:'flex',gap:'10px',alignItems:'center'}}><span style={{fontSize:'12px',color:'#64748b',fontWeight:700}}>ROWS:</span><select value={rowsPerPage} onChange={e=>setRowsPerPage(Number(e.target.value))} style={{padding:'9px 14px',borderRadius:'20px',border:'1px solid #e2e8f0',fontWeight:700,background:'#fff'}}><option value={5}>5</option><option value={10}>10</option><option value={15}>15</option><option value={20}>20</option><option value={30}>30</option><option value={50}>50</option><option value={100}>100</option></select></div>
      </div>

      <div style={{maxWidth:'1600px',margin:'auto',padding:'0 20px 20px'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:'14px',marginBottom:'18px'}}>
          <div onClick={()=>{setTab('contacts'); setSelected([]); setCurrentPage(1)}} style={{background:tab==='contacts'?'linear-gradient(135deg,#0f172a,#1e293b)':'#fff',color:tab==='contacts'?'#fff':'#0f172a',padding:'20px 22px',borderRadius:'18px',cursor:'pointer',border:tab==='contacts'?'2px solid #facc15':'1px solid #e2e8f0',boxShadow:'0 4px 16px rgba(0,0,0,.06)'}}><p style={{fontSize:'11px',fontWeight:800,letterSpacing:'1px',opacity:.8}}>📞 CONTACTS</p><h2 style={{fontSize:'32px',fontWeight:900,marginTop:'6px'}}>{contacts.length}</h2></div>
          <div onClick={()=>{setTab('applicants'); setSelected([]); setCurrentPage(1)}} style={{background:tab==='applicants'?'linear-gradient(135deg,#facc15,#eab308)':'#fff',color:'#0f172a',padding:'20px 22px',borderRadius:'18px',cursor:'pointer',border:tab==='applicants'?'2px solid #0f172a':'1px solid #e2e8f0',boxShadow:'0 4px 16px rgba(0,0,0,.06)'}}><p style={{fontSize:'11px',fontWeight:900,letterSpacing:'1px'}}>🎖️ APPLICANTS</p><h2 style={{fontSize:'32px',fontWeight:900,marginTop:'6px'}}>{applicants.length}</h2></div>
          <div style={{background:'#fff',padding:'20px 22px',borderRadius:'18px',border:'2px dashed #0f172a'}}><p style={{fontSize:'11px',fontWeight:800,color:'#0f172a',letterSpacing:'1px'}}>📊 TOTAL</p><h2 style={{fontSize:'32px',fontWeight:900,color:'#0f172a',marginTop:'6px'}}>{total}</h2><p style={{fontSize:'11px',color:'#64748b',marginTop:'4px'}}>{contacts.length} contacts + {applicants.length} applicants</p></div>
          <div style={{background:'#fff',padding:'20px 22px',borderRadius:'18px',border:'1px solid #e2e8f0'}}><p style={{fontSize:'11px',fontWeight:700,color:'#64748b',letterSpacing:'1px'}}>👁 CURRENT VIEW</p><h2 style={{fontSize:'32px',fontWeight:900,marginTop:'6px'}}>{list.length}</h2><button onClick={()=>exportCSV(list,`${tab}.csv`)} style={{marginTop:'10px',background:'#0f172a',color:'#facc15',border:'none',padding:'9px 16px',borderRadius:'20px',fontSize:'11px',fontWeight:900,cursor:'pointer'}}>⬇ EXPORT CSV</button></div>
        </div>

        <div style={{background:'#fff',borderRadius:'18px',overflow:'hidden',border:'2px solid #0f172a',boxShadow:'0 12px 32px rgba(15,23,42,.12)'}}>
          <div style={{padding:'16px 20px',background:tab==='contacts'?'linear-gradient(90deg,#0f172a,#1e293b)':'linear-gradient(90deg,#1e293b,#334155)',color:tab==='contacts'?'#facc15':'#fff',fontWeight:900,fontSize:'13px',display:'flex',justifyContent:'space-between'}}>
            <span>{tab==='contacts'?`📞 CONTACTS — ${list.length}`:`🎖️ APPLICANTS — ${list.length}`} • Page {currentPage}/{Math.ceil(list.length/rowsPerPage)||1}</span><span style={{opacity:.7}}>{selected.length} selected</span>
          </div>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px',minWidth:'1450px'}}>
              <thead><tr style={{background:'#0f172a',color:'#fff'}}>
                <th style={{padding:'13px 12px',border:'1px solid #1e293b'}}><input type="checkbox" checked={paginatedList.length>0 && paginatedList.every(r=>selected.includes(r._uid))} onChange={()=>{ const ids=paginatedList.map(r=>r._uid); if(ids.every(id=>selected.includes(id))) setSelected(prev=>prev.filter(id=>!ids.includes(id))); else setSelected(prev=>[...new Set([...prev,...ids])]); }}/></th>
                <th style={{padding:'13px 12px',border:'1px solid #1e293b',textAlign:'left',fontWeight:900}}>DATE</th><th style={{padding:'13px 12px',border:'1px solid #1e293b',textAlign:'left',fontWeight:900}}>FULL NAME</th><th style={{padding:'13px 12px',border:'1px solid #1e293b',textAlign:'left',fontWeight:900}}>PHONE</th><th style={{padding:'13px 12px',border:'1px solid #1e293b',textAlign:'left',fontWeight:900}}>EMAIL</th>
                {tab==='contacts'?<><th style={{padding:'13px 12px',border:'1px solid #1e293b',textAlign:'left',fontWeight:900}}>SERVICE</th><th style={{padding:'13px 12px',border:'1px solid #1e293b',textAlign:'left',fontWeight:900}}>MESSAGE</th></>:<><th style={{padding:'13px 12px',border:'1px solid #1e293b',textAlign:'left',fontWeight:900}}>POSITION</th><th style={{padding:'13px 12px',border:'1px solid #facc15',background:'#facc15',color:'#0f172a',fontWeight:900}}>DISTRICT</th><th style={{padding:'13px 12px',border:'1px solid #1e293b',fontWeight:900}}>EDUCATION</th><th style={{padding:'13px 12px',border:'1px solid #facc15',background:'#facc15',color:'#0f172a',fontWeight:900}}>EXP</th><th style={{padding:'13px 12px',border:'1px solid #1e293b',fontWeight:900}}>INTEREST</th></>}
                <th style={{padding:'13px 12px',border:'1px solid #1e293b',fontWeight:900}}>ACTIONS</th>
              </tr></thead>
              <tbody>{paginatedList.map((d,i)=>{ const checked=selected.includes(d._uid); return (<tr key={d._uid} style={{background:checked?'#fef9c3':i%2===0?'#ffffff':'#f8fafc',transition:'0.2s'}}><td style={{padding:'11px',border:'1px solid #e2e8f0'}}><input type="checkbox" checked={checked} onChange={()=>setSelected(prev=>prev.includes(d._uid)?prev.filter(id=>id!==d._uid):[...prev,d._uid])}/></td><td style={{padding:'11px',border:'1px solid #e2e8f0',fontWeight:600}}>{getVal(d,['Timestamp','timestamp'])?.slice(0,19)}</td><td style={{padding:'11px',border:'1px solid #e2e8f0',fontWeight:800}}>{getVal(d,['FullName','fullName'])}</td><td style={{padding:'11px',border:'1px solid #e2e8f0'}}>{getVal(d,['Phone','phone'])}</td><td style={{padding:'11px',border:'1px solid #e2e8f0'}}>{getVal(d,['Email','email'])}</td>{tab==='contacts'?<><td style={{padding:'11px',border:'1px solid #e2e8f0'}}>{getVal(d,['Service','service'])}</td><td style={{padding:'11px',border:'1px solid #e2e8f0',maxWidth:'200px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{getVal(d,['Message','Messages','message'])}</td></>:<><td style={{padding:'11px',border:'1px solid #e2e8f0'}}><span style={{background:'#fef9c3',padding:'5px 10px',borderRadius:'12px',fontWeight:700,border:'1px solid #fde68a'}}>{getVal(d,['Position','position'])}</span></td><td style={{padding:'11px',border:'1px solid #facc15',background:'#fffbeb',fontWeight:800}}>{getVal(d,['District','district'])}</td><td style={{padding:'11px',border:'1px solid #e2e8f0'}}>{getVal(d,['Education','education'])}</td><td style={{padding:'11px',border:'1px solid #facc15',background:'#fffbeb',textAlign:'center',fontWeight:800}}>{getVal(d,['Experience','experience'])}</td><td style={{padding:'11px',border:'1px solid #e2e8f0'}}>{getVal(d,['Interest','interest'])}</td></>}<td style={{padding:'11px',border:'1px solid #e2e8f0'}}><div style={{display:'flex',gap:'5px'}}><button onClick={()=>setDetailRow(d)} style={{padding:'6px 10px',borderRadius:'8px',border:'1px solid #e2e8f0',fontSize:'10px',fontWeight:700,cursor:'pointer',background:'#fff'}}>VIEW</button><button onClick={()=>handleEdit(d)} style={{padding:'6px 10px',borderRadius:'8px',background:'#facc15',border:'1px solid #eab308',fontSize:'10px',fontWeight:800,cursor:'pointer'}}>EDIT</button><button onClick={()=>handleDelete(d)} style={{padding:'6px 10px',borderRadius:'8px',background:'#fee2e2',color:'#dc2626',border:'1px solid #fecaca',fontSize:'10px',fontWeight:800,cursor:'pointer'}}>DEL</button></div></td></tr>)})}</tbody>
            </table>
          </div>
          <div style={{padding:'14px 20px',display:'flex',justifyContent:'space-between',background:'#f8fafc',borderTop:'2px solid #0f172a'}}>
            <div style={{display:'flex',gap:'8px'}}><button disabled={currentPage===1} onClick={()=>setCurrentPage(p=>Math.max(1,p-1))} style={{padding:'9px 16px',borderRadius:'12px',fontWeight:800,cursor:'pointer',border:'1px solid #e2e8f0',background:'#fff'}}>◂ PREV</button><span style={{background:'#0f172a',color:'#facc15',padding:'9px 14px',borderRadius:'12px',fontWeight:800}}>{currentPage}</span><button disabled={currentPage===Math.ceil(list.length/rowsPerPage)} onClick={()=>setCurrentPage(p=>p+1)} style={{padding:'9px 16px',borderRadius:'12px',fontWeight:800,cursor:'pointer',border:'1px solid #e2e8f0',background:'#fff'}}>NEXT ▸</button></div>
            <div style={{fontSize:'12px',color:'#64748b',fontWeight:600}}>Page {currentPage} of {Math.ceil(list.length/rowsPerPage)||1} • {list.length} rows</div>
          </div>
        </div>
      </div>

      {detailRow && <div onClick={()=>setDetailRow(null)} style={{position:'fixed',inset:0,background:'rgba(15,23,42,.6)',zIndex:10000,display:'flex',justifyContent:'center',alignItems:'center',padding:'20px',backdropFilter:'blur(6px)'}}><div onClick={e=>e.stopPropagation()} style={{background:'#fff',borderRadius:'22px',width:'100%',maxWidth:'520px',padding:'24px',boxShadow:'0 24px 64px rgba(0,0,0,.3)'}}><h3 style={{fontWeight:900}}>👤 {getVal(detailRow,['FullName','fullName'])}</h3><div style={{display:'grid',gap:'8px',marginTop:'14px'}}>{Object.entries(detailRow).filter(([k])=>!k.startsWith('_')).map(([k,v])=><div key={k} style={{display:'flex',justifyContent:'space-between',padding:'10px 14px',background:'#f8fafc',borderRadius:'12px',border:'1px solid #e2e8f0'}}><span style={{fontWeight:800,fontSize:'11px',color:'#0f172a'}}>{k}</span><span style={{fontSize:'12px'}}>{String(v)}</span></div>)}</div><button onClick={()=>setDetailRow(null)} style={{marginTop:'14px',background:'#0f172a',color:'#facc15',width:'100%',padding:'13px',borderRadius:'14px',fontWeight:900,border:'none',cursor:'pointer'}}>CLOSE</button></div></div>}
      {editRow && <div style={{position:'fixed',inset:0,background:'rgba(15,23,42,.6)',zIndex:10001,display:'flex',justifyContent:'center',alignItems:'center',padding:'20px',backdropFilter:'blur(6px)'}}><div style={{background:'#fff',borderRadius:'22px',width:'100%',maxWidth:'520px',padding:'26px',boxShadow:'0 24px 64px rgba(0,0,0,.3)'}}><h3 style={{fontWeight:900}}>✏️ Edit</h3><div style={{display:'grid',gap:'10px',marginTop:'14px'}}>{["FullName","Phone","Email","Service","Message","Position","Education","District","Experience","Interest"].map(f=><input key={f} value={form[f]||''} onChange={e=>setForm({...form,[f]:e.target.value})} placeholder={f} style={{padding:'12px 14px',borderRadius:'12px',border:'1px solid #e2e8f0',outline:'none'}}/>)}</div><div style={{display:'flex',gap:'10px',marginTop:'14px'}}><button onClick={()=>setEditRow(null)} style={{flex:1,padding:'13px',borderRadius:'14px',border:'1px solid #e2e8f0',background:'#fff',fontWeight:700,cursor:'pointer'}}>CANCEL</button><button onClick={handleSave} style={{flex:1,background:'#0f172a',color:'#facc15',padding:'13px',borderRadius:'14px',fontWeight:900,border:'none',cursor:'pointer'}}>SAVE</button></div></div></div>}
      {showAdd && <div style={{position:'fixed',inset:0,background:'rgba(15,23,42,.6)',zIndex:10001,display:'flex',justifyContent:'center',alignItems:'center',padding:'20px',backdropFilter:'blur(6px)'}}><div style={{background:'#fff',borderRadius:'22px',width:'100%',maxWidth:'520px',padding:'26px',boxShadow:'0 24px 64px rgba(0,0,0,.3)'}}><h3 style={{fontWeight:900}}>➕ Add New {tab.toUpperCase()}</h3><div style={{display:'grid',gap:'10px',marginTop:'14px'}}>{["FullName","Phone","Email","Service","Message","Position","Education","District","Experience","Interest"].map(f=><input key={f} value={form[f]||''} onChange={e=>setForm({...form,[f]:e.target.value})} placeholder={f} style={{padding:'12px 14px',borderRadius:'12px',border:'1px solid #e2e8f0',outline:'none'}}/>)}</div><div style={{display:'flex',gap:'10px',marginTop:'14px'}}><button onClick={()=>setShowAdd(false)} style={{flex:1,padding:'13px',borderRadius:'14px',border:'1px solid #e2e8f0',background:'#fff',fontWeight:700,cursor:'pointer'}}>CANCEL</button><button onClick={handleAddNew} style={{flex:1,background:'#facc15',padding:'13px',borderRadius:'14px',fontWeight:900,border:'none',cursor:'pointer',color:'#0f172a'}}>ADD</button></div></div></div>}
    </div>
  )
}
export default AdminDashboard;