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
  const [showOptions, setShowOptions] = useState(false);
  const [tableOptions, setTableOptions] = useState({ gridlines: true, alternating: true, condensed: false, footer: false });
  const [tempOptions, setTempOptions] = useState(tableOptions);
  
  // NEW - BULK EDIT 5 AT ONCE
  const [bulkEdits, setBulkEdits] = useState({}); // {timestamp: formData}
  const [savingBulk, setSavingBulk] = useState(false);

  const openOptions = () => { setTempOptions(tableOptions); setShowOptions(true); }
  const getFullDateTime24 = () => new Date().toLocaleString('en-GB', { timeZone: 'Africa/Kampala', day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false });
  const login = () => pass === ADMIN_PASSWORD ? setAuth(true) : alert("Wrong Password!");
  const load = () => { setLoading(true); fetch(GOOGLE_SHEET_WEBHOOK).then(r=>r.json()).then(d=>{ const arr = Array.isArray(d)?d:[]; const sorted = arr.sort((a,b)=> new Date(b.timestamp||b.Timestamp||0) - new Date(a.timestamp||a.Timestamp||0)); setData(sorted); setLoading(false); }).catch(()=>setLoading(false)); };
  useEffect(()=>{ if(auth) load(); },[auth]);
  useEffect(()=>{ setCurrentPage(1); },[filters, search, tab, rowsPerPage]);
  const getVal = (obj, keys) => { for(let k of keys) if(obj[k]!==undefined && obj[k]!==null && obj[k]!=='') return obj[k]; return ''; }
  const formatDate = (t) => { if(!t) return '-'; try { const d = new Date(t); if(isNaN(d.getTime())) return t; return d.toLocaleString('en-GB', { timeZone: 'Africa/Kampala', day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false }); } catch { return t; } }

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
    const ts = getVal(row,['Timestamp','timestamp']);
    const rowForm = { timestamp:ts, FullName:getVal(row,['FullName','fullName']), Phone:getVal(row,['Phone','phone']), Email:getVal(row,['Email','email']), Service:getVal(row,['Service','service']), Messages:getVal(row,['Messages','message']), Position:getVal(row,['Position','position']), Education:getVal(row,['Education','education']), District:getVal(row,['District','district']), Experience:getVal(row,['Experience','experience']), Interest:getVal(row,['Interest','interest']), type:tab };
    setEditRow(ts);
    setForm(rowForm);
    // Add to bulk edits
    setBulkEdits(prev => ({...prev, [ts]: rowForm}));
  };

  // UPDATE SINGLE FORM IN BULK EDITS
  const updateBulkForm = (ts, field, value) => {
    setBulkEdits(prev => ({
      ...prev,
      [ts]: { ...prev[ts], [field]: value }
    }));
    if(editRow === ts) setForm(prev => ({...prev, [field]: value}));
  };

  const handleSave = async () => {
    const payload = { action:'update', ...form, timestamp:editRow, type:tab };
    setData(prev => prev.map(r => getVal(r,['Timestamp','timestamp'])===editRow?{...r,...form,Timestamp:editRow,timestamp:editRow}:r));
    setEditRow(null);
    setBulkEdits(prev => { const n = {...prev}; delete n[editRow]; return n; });
    if(detailRow && getVal(detailRow,['Timestamp','timestamp'])===editRow) setDetailRow(prev=>({...prev,...form,Timestamp:editRow,timestamp:editRow}));
    await fetch(GOOGLE_SHEET_WEBHOOK,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain'},body:JSON.stringify(payload)});
  };

  // NEW - SAVE ALL 5 AT ONCE
  const handleBulkSaveAll = async () => {
    if(Object.keys(bulkEdits).length === 0) return;
    setSavingBulk(true);
    const editsArray = Object.values(bulkEdits);
    
    // Update local data instantly
    setData(prev => prev.map(r => {
      const ts = getVal(r,['Timestamp','timestamp']);
      if(bulkEdits[ts]){
        return {...r, ...bulkEdits[ts], Timestamp: ts, timestamp: ts};
      }
      return r;
    }));
    
    // Send bulk update to sheet
    await fetch(GOOGLE_SHEET_WEBHOOK,{
      method:'POST',
      mode:'no-cors',
      headers:{'Content-Type':'text/plain'},
      body:JSON.stringify({ action:'bulkUpdate', edits: editsArray })
    });
    
    // Also send one-by-one as fallback to ensure all 5 reflect
    for(let ed of editsArray){
      await fetch(GOOGLE_SHEET_WEBHOOK,{
        method:'POST',
        mode:'no-cors',
        headers:{'Content-Type':'text/plain'},
        body:JSON.stringify({ action:'update', ...ed, timestamp: ed.timestamp })
      });
    }
    
    setBulkEdits({});
    setEditRow(null);
    setSavingBulk(false);
    alert(`✅ ${editsArray.length} rows updated in Google Sheet!`);
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
    return (<div style={{minHeight:'100vh',background:'radial-gradient(circle at top,#1a2f5c,#0a1931)',display:'flex',justifyContent:'center',alignItems:'center',fontFamily:'Arial'}}><div style={{background:'#fff',padding:'36px',borderRadius:'24px',width:'92%',maxWidth:'400px',textAlign:'center'}}><div style={{width:'56px',height:'56px',background:'#0a1931',borderRadius:'14px',margin:'0 auto 14px',display:'grid',placeItems:'center',color:'#ffcc00',fontSize:'22px',fontWeight:900}}>P</div><h2 style={{fontWeight:900,color:'#0a1931'}}>PINNACLE ADMIN</h2><input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Admin Password" style={{width:'100%',padding:'14px 16px',borderRadius:'12px',marginTop:'20px',border:'2px solid #0a1931'}}/><button onClick={login} style={{width:'100%',marginTop:'14px',background:'#ffcc00',padding:'14px',borderRadius:'12px',fontWeight:900,border:'none',cursor:'pointer'}}>UNLOCK DASHBOARD</button></div></div>)
  }
  const applicants = data.filter(d => (d.type==='applicant') || getVal(d,['Position','position'])); const contacts = data.filter(d => (d.type==='contact') || getVal(d,['Service','service']));
  const applyFilters = (list) => list.filter(d=>{ const s = `${getVal(d,['FullName','fullName'])} ${getVal(d,['Phone','phone'])} ${getVal(d,['Email','email'])} ${getVal(d,['Service','service'])} ${getVal(d,['Messages','message'])} ${getVal(d,['Position','position'])} ${getVal(d,['District','district'])} ${getVal(d,['Education','education'])}`.toLowerCase(); if(search && !s.includes(search.toLowerCase())) return false; if(filters.service && getVal(d,['Service','service']).toLowerCase() !== filters.service.toLowerCase()) return false; if(filters.position && getVal(d,['Position','position']).toLowerCase() !== filters.position.toLowerCase()) return false; if(filters.district && getVal(d,['District','district']).toLowerCase() !== filters.district.toLowerCase()) return false; if(filters.education && getVal(d,['Education','education']).toLowerCase() !== filters.education.toLowerCase()) return false; if(filters.experience && getVal(d,['Experience','experience']).toLowerCase() !== filters.experience.toLowerCase()) return false; if(filters.interest && getVal(d,['Interest','interest']).toLowerCase() !== filters.interest.toLowerCase()) return false; const ts = new Date(getVal(d,['Timestamp','timestamp'])); if(filters.dateFrom && ts < new Date(filters.dateFrom)) return false; if(filters.dateTo && ts > new Date(filters.dateTo + 'T23:59:59')) return false; return true; });
  const filteredContacts = applyFilters(contacts); const filteredApplicants = applyFilters(applicants); const list = tab==='contacts'?filteredContacts:filteredApplicants; const totalPages = Math.ceil(list.length / rowsPerPage) || 1; const paginatedList = list.slice((currentPage-1)*rowsPerPage, currentPage*rowsPerPage); const allPageIds = paginatedList.map(r=>getVal(r,['Timestamp','timestamp'])); const isAllSelected = allPageIds.length>0 && allPageIds.every(id=>selected.includes(id)); const activeFilterCount = Object.values(filters).filter(v=>v).length;
  const rowPadding = tableOptions.condensed ? '8px 12px' : '14px 16px';
  const tableBorder = tableOptions.gridlines ? '1px solid #e5e7eb' : 'none';
  const bulkCount = Object.keys(bulkEdits).length;

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

      {/* BULK SAVE BAR - Shows when you edit 5 rows */}
      {bulkCount > 0 && (
        <div style={{background:'#0a1931',color:'#fff',padding:'12px 24px',display:'flex',justifyContent:'space-between',alignItems:'center',position:'sticky',top:'72px',zIndex:99,boxShadow:'0 4px 12px rgba(0,0,0,0.2)'}}>
          <div style={{fontWeight:900,fontSize:'13px'}}>📝 {bulkCount} rows in edit mode — not yet saved to Sheet</div>
          <div style={{display:'flex',gap:'8px'}}>
            <button onClick={()=>setBulkEdits({})} style={{background:'#fff',color:'#0a1931',border:'none',padding:'8px 16px',borderRadius:'20px',fontWeight:800,fontSize:'12px',cursor:'pointer'}}>Cancel All</button>
            <button onClick={handleBulkSaveAll} disabled={savingBulk} style={{background:'#ffcc00',color:'#0a1931',border:'none',padding:'8px 20px',borderRadius:'20px',fontWeight:900,fontSize:'12px',cursor:'pointer'}}>{savingBulk ? 'Saving...' : `💾 Save All ${bulkCount} to Sheet`}</button>
          </div>
        </div>
      )}

      <div style={{maxWidth:'1600px',margin:'auto',padding:'22px'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:'14px',marginBottom:'18px'}}>
          <div onClick={()=>{setTab('contacts'); setSelected([]);}} style={{background:tab==='contacts'?'#0a1931':'#fff',color:tab==='contacts'?'#fff':'#0a1931',padding:'18px',borderRadius:'18px',cursor:'pointer',border:tab==='contacts'?'2px solid #ffcc00':'1px solid #eee'}}><p style={{fontSize:'10px',opacity:.7}}>📞 CONTACT REQUESTS</p><h2 style={{fontSize:'28px',fontWeight:900,marginTop:'8px'}}>{contacts.length} <span style={{fontSize:'12px',fontWeight:400,opacity:.6}}>/ {filteredContacts.length} filtered</span></h2></div>
          <div onClick={()=>{setTab('applicants'); setSelected([]);}} style={{background:tab==='applicants'?'#ffcc00':'#fff',padding:'18px',borderRadius:'18px',cursor:'pointer',border:tab==='applicants'?'2px solid #0a1931':'1px solid #eee'}}><p style={{fontSize:'10px'}}>🎖️ JOB APPLICANTS</p><h2 style={{fontSize:'28px',fontWeight:900,marginTop:'8px'}}>{applicants.length} <span style={{fontSize:'12px',fontWeight:400,color:'#666'}}>/ {filteredApplicants.length} filtered</span></h2></div>
          <div style={{background:'#fff',padding:'18px',borderRadius:'18px',border:'1px solid #eee'}}><p style={{fontSize:'10px'}}>📊 CURRENT VIEW</p><div style={{display:'flex',justifyContent:'space-between',alignItems:'end',marginTop:'8px'}}><h2 style={{fontSize:'28px',fontWeight:900}}>{list.length}</h2><button onClick={()=>exportCSV(list,`${tab}.csv`)} style={{background:'#f3f4f6',border:'none',padding:'6px 12px',borderRadius:'20px',fontSize:'10px',fontWeight:900,cursor:'pointer'}}>⬇ EXPORT CSV</button></div></div>
          <div style={{background:'linear-gradient(135deg,#0a1931,#1a3a6a)',padding:'18px',borderRadius:'18px',display:'flex',alignItems:'center',justifyContent:'space-between'}}><div><p style={{fontSize:'10px',color:'#ffcc00'}}>QUICK ACTION</p><p style={{color:'#fff',fontSize:'13px',fontWeight:700,marginTop:'6px'}}>Add New {tab}</p></div><button onClick={()=>{setForm({});setShowAdd(true)}} style={{background:'#ffcc00',border:'none',width:'40px',height:'40px',borderRadius:'12px',fontWeight:900,fontSize:'18px',cursor:'pointer'}}>＋</button></div>
        </div>

        <div style={{background:'#fff',borderRadius:'20px',overflow:'hidden',boxShadow:'0 10px 30px rgba(0,0,0,.06)', border: tableOptions.gridlines ? '1px solid #e5e7eb' : 'none'}}>
          <div style={{padding:'16px 20px',display:'flex',justifyContent:'space-between',alignItems:'center',background:tab==='contacts'?'#0a1931':'#7a0a0a'}}><div style={{color:tab==='contacts'?'#ffcc00':'#fff',fontWeight:900,fontSize:'13px'}}>{tab==='contacts'?`📞 CONTACTS — ${list.length}`:`📋 APPLICANTS — ${list.length}`} {bulkCount>0 && `• ${bulkCount} editing`} • Click row to view →</div></div>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse: tableOptions.gridlines ? 'collapse' : 'separate', fontSize:'12px',minWidth:'1300px'}}>
              <thead><tr style={{background:'#f8f9fb',color:'#6b7280',textAlign:'left',fontSize:'10px',letterSpacing:'1px'}}>
                <th style={{padding:rowPadding, borderRight: tableBorder, borderBottom: tableBorder}}><input type="checkbox" checked={isAllSelected} onChange={()=>{ if(isAllSelected){ setSelected(prev=>prev.filter(id=>!allPageIds.includes(id))); } else { setSelected(prev=>[...new Set([...prev, ...allPageIds])]); } }} /></th>
                <th style={{padding:rowPadding, borderRight: tableBorder, borderBottom: tableBorder}}>DATE & TIME</th><th style={{padding:rowPadding, borderRight: tableBorder, borderBottom: tableBorder}}>FULL NAME</th><th style={{padding:rowPadding, borderRight: tableBorder, borderBottom: tableBorder}}>PHONE</th><th style={{padding:rowPadding, borderRight: tableBorder, borderBottom: tableBorder}}>EMAIL</th>
                {tab==='contacts'?<><th style={{padding:rowPadding, borderRight: tableBorder, borderBottom: tableBorder}}>SERVICE</th><th style={{padding:rowPadding, borderBottom: tableBorder}}>MESSAGE</th></>:<><th style={{padding:rowPadding, borderRight: tableBorder, borderBottom: tableBorder}}>POSITION</th><th style={{padding:rowPadding, borderRight: tableBorder, borderBottom: tableBorder}}>EDUCATION</th><th style={{padding:rowPadding, borderRight: tableBorder, borderBottom: tableBorder}}>DISTRICT</th><th style={{padding:rowPadding, borderRight: tableBorder, borderBottom: tableBorder}}>EXP</th><th style={{padding:rowPadding, borderBottom: tableBorder}}>INTEREST</th></>}
                <th style={{padding:rowPadding, borderLeft: tableBorder, borderBottom: tableBorder}}>ACTIONS</th>
              </tr></thead>
              <tbody>
                {paginatedList.map((d,i)=>{ 
                  const ts=getVal(d,['Timestamp','timestamp']); 
                  const isEditing = bulkEdits[ts] !== undefined;
                  const checked=selected.includes(ts);
                  const altColor = tableOptions.alternating ? (i%2===0?'#fff':'#f8fafc') : '#fff';
                  const currentForm = bulkEdits[ts] || {};
                  return (
                  <tr key={i} onClick={()=>{ if(!isEditing) setDetailRow(d); }} style={{borderBottom: tableOptions.gridlines ? '1px solid #f1f1f1' : 'none', background:checked?'#fff9db': isEditing?'#eef2ff': detailRow && getVal(detailRow,['Timestamp','timestamp'])===ts ? '#fff3cd' : altColor, cursor:'pointer'}}>
                    <td style={{padding:rowPadding, borderRight: tableBorder}} onClick={e=>e.stopPropagation()}><input type="checkbox" checked={checked} onChange={()=>toggleSelect(ts)} /></td>
                    <td style={{padding:rowPadding, borderRight: tableBorder, color:'#0a1931',fontSize:'11px',fontWeight:800}}>{formatDate(ts)}</td>
                    <td style={{padding:rowPadding, borderRight: tableBorder, fontWeight:700}}>{isEditing?<input value={currentForm.FullName||''} onChange={e=>updateBulkForm(ts,'FullName',e.target.value)} style={{padding:'6px',borderRadius:'6px',border:'1px solid #0a1931',width:'110px'}}/>:getVal(d,['FullName','fullName'])}</td>
                    <td style={{padding:rowPadding, borderRight: tableBorder}}>{isEditing?<input value={currentForm.Phone||''} onChange={e=>updateBulkForm(ts,'Phone',e.target.value)} style={{padding:'6px',borderRadius:'6px',border:'1px solid #0a1931',width:'90px'}}/>:getVal(d,['Phone','phone'])}</td>
                    <td style={{padding:rowPadding, borderRight: tableBorder}}>{isEditing?<input value={currentForm.Email||''} onChange={e=>updateBulkForm(ts,'Email',e.target.value)} style={{padding:'6px',borderRadius:'6px',border:'1px solid #0a1931',width:'130px'}}/>:getVal(d,['Email','email'])}</td>
                    {tab==='contacts'?<>
                      <td style={{padding:rowPadding, borderRight: tableBorder}}>{isEditing?<input value={currentForm.Service||''} onChange={e=>updateBulkForm(ts,'Service',e.target.value)} style={{padding:'4px',width:'90px'}}/>:<span style={{background:'#eef2ff',color:'#3730a3',padding:'4px 8px',borderRadius:'20px',fontSize:'11px',fontWeight:700}}>{getVal(d,['Service','service'])}</span>}</td>
                      <td style={{padding:rowPadding}}>{isEditing?<input value={currentForm.Messages||''} onChange={e=>updateBulkForm(ts,'Messages',e.target.value)} style={{padding:'6px',borderRadius:'6px',border:'1px solid #0a1931',width:'160px'}}/>:getVal(d,['Messages','message'])}</td>
                    </>:<>
                      <td style={{padding:rowPadding, borderRight: tableBorder}}>{isEditing?<input value={currentForm.Position||''} onChange={e=>updateBulkForm(ts,'Position',e.target.value)} style={{padding:'4px',width:'90px'}}/>:<span style={{background:'#fef3c7',padding:'4px 8px',borderRadius:'20px',fontSize:'11px',fontWeight:700}}>{getVal(d,['Position','position'])}</span>}</td>
                      <td style={{padding:rowPadding, borderRight: tableBorder}}>{isEditing?<input value={currentForm.Education||''} onChange={e=>updateBulkForm(ts,'Education',e.target.value)} style={{padding:'4px',width:'60px'}}/>:getVal(d,['Education','education'])}</td>
                      <td style={{padding:rowPadding, borderRight: tableBorder}}>{isEditing?<input value={currentForm.District||''} onChange={e=>updateBulkForm(ts,'District',e.target.value)} style={{padding:'4px',width:'60px'}}/>:getVal(d,['District','district'])}</td>
                      <td style={{padding:rowPadding, borderRight: tableBorder}}>{isEditing?<input value={currentForm.Experience||''} onChange={e=>updateBulkForm(ts,'Experience',e.target.value)} style={{padding:'4px',width:'50px'}}/>:getVal(d,['Experience','experience'])}</td>
                      <td style={{padding:rowPadding}}>{isEditing?<input value={currentForm.Interest||''} onChange={e=>updateBulkForm(ts,'Interest',e.target.value)} style={{padding:'4px',width:'80px'}}/>:getVal(d,['Interest','interest'])}</td>
                    </>}
                    <td style={{padding:rowPadding, borderLeft: tableBorder}} onClick={e=>e.stopPropagation()}><div style={{display:'flex',gap:'6px'}}>{isEditing?<><button onClick={()=>{ setBulkEdits(prev=>{ const n={...prev}; delete n[ts]; return n; }); if(editRow===ts) setEditRow(null); }} style={{background:'#eee',border:'none',padding:'6px 10px',borderRadius:'8px',fontSize:'11px',cursor:'pointer'}}>CANCEL</button></>:<><button onClick={()=>handleEdit(d)} style={{background:'#ffcc00',border:'none',padding:'6px 12px',borderRadius:'8px',fontWeight:800,fontSize:'11px',cursor:'pointer'}}>EDIT</button><button onClick={()=>handleDelete(d)} style={{background:'#fee2e2',color:'#dc2626',border:'none',padding:'6px 10px',borderRadius:'8px',fontWeight:800,fontSize:'11px',cursor:'pointer'}}>DEL</button></>}</div></td>
                  </tr>
                )})}
              </tbody>
              {tableOptions.footer && (<tfoot><tr style={{background:'#f1f5f9', fontWeight:900, fontSize:'11px'}}><td colSpan={12} style={{padding:'12px 16px', borderTop:'2px solid #0a1931', textAlign:'center'}}>Total: {list.length} — Editing: {bulkCount} — Page {currentPage}/{totalPages}</td></tr></tfoot>)}
            </table>
          </div>
        </div>
      </div>

      {showOptions && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.35)',zIndex:10002,display:'flex',justifyContent:'center',alignItems:'center',padding:'20px'}}>
          <div style={{background:'#fff',borderRadius:'16px',width:'100%',maxWidth:'380px',boxShadow:'0 20px 60px rgba(0,0,0,0.2)'}}>
            <div style={{padding:'24px 24px 12px 24px'}}><h3 style={{fontSize:'16px',fontWeight:400,color:'#202124',marginBottom:'20px'}}>Options</h3>
              <div style={{display:'grid',gap:'18px'}}>
                {[
                  {k:'gridlines', label:'Show table gridlines'},
                  {k:'alternating', label:'Show alternating colours'},
                  {k:'condensed', label:'Show condensed view'},
                  {k:'footer', label:'Show table footer'},
                ].map(opt=>(
                  <label key={opt.k} style={{display:'flex',alignItems:'center',gap:'12px',cursor:'pointer'}}>
                    <div onClick={()=>setTempOptions({...tempOptions, [opt.k]: !tempOptions[opt.k]})} style={{width:'20px',height:'20px',borderRadius:'4px',border: tempOptions[opt.k] ? '2px solid #1e8e3e' : '2px solid #5f6368',background: tempOptions[opt.k] ? '#1e8e3e' : '#fff',display:'grid',placeItems:'center',color:'#fff',fontSize:'12px',fontWeight:900}}>{tempOptions[opt.k] ? '✓' : ''}</div>
                    <span style={{fontSize:'14px',color:'#202124'}}>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div style={{display:'flex',justifyContent:'flex-end',gap:'12px',padding:'16px 24px 20px 24px'}}>
              <button onClick={()=>setShowOptions(false)} style={{background:'#fff',border:'1px solid #dadce0',color:'#1a73e8',padding:'10px 24px',borderRadius:'8px',fontWeight:500,fontSize:'14px',cursor:'pointer'}}>Cancel</button>
              <button onClick={()=>{ setTableOptions(tempOptions); setShowOptions(false); }} style={{background:'#1e8e3e',border:'none',color:'#fff',padding:'10px 24px',borderRadius:'8px',fontWeight:500,fontSize:'14px',cursor:'pointer'}}>Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default AdminDashboard