const getFullDateTime24 = () => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}.${d.getMilliseconds()}-${Math.floor(Math.random()*900)+100}`;
};

const AdminDashboard = () => {
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState("");
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("applicants");
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
      const withId = arr.map((row,i)=>({ ...row, _uid: `${row.Timestamp||row.timestamp||i}_${i}_${row.Phone||row.phone||''}`, _index: i }));
      const sorted = withId.sort((a,b)=> new Date(b.timestamp||b.Timestamp||0) - new Date(a.timestamp||a.Timestamp||0));
      setData(sorted); setLoading(false);
    }).catch(()=>setLoading(false));
  };
  
  useEffect(()=>{ if(auth) load(); },[auth]);
  useEffect(()=>{ setCurrentPage(1); },[filters, search, tab, rowsPerPage]);

  const getVal = (obj, keys) => { for(let k of keys) if(obj[k]!==undefined && obj[k]!==null && obj[k]!=='') return obj[k]; return ''; }

  const handleDelete = async (row) => {
    if(!confirm(`Delete ${getVal(row,['FullName','fullName'])}?`)) return;
    const ts = getVal(row,['Timestamp','timestamp']);
    const uid = row._uid;
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
  const serviceOptions = unique(['Service','service']); const positionOptions = unique(['Position','position']); const districtOptions = unique(['District','district']); const educationOptions = unique(['Education','education']); const experienceOptions = unique(['Experience','experience']); const interestOptions = unique(['Interest','interest']);

  if(!auth){
    return ( <div style={{minHeight:'100vh',background:'radial-gradient(circle at 20% 30%,#1a3a6a,#0a1931 70%)',display:'flex',justifyContent:'center',alignItems:'center',fontFamily:'Arial'}}>
      <div style={{background:'#fff',padding:'40px',borderRadius:'28px',width:'92%',maxWidth:'380px',textAlign:'center',boxShadow:'0 30px 80px rgba(0,0,0,.4)'}}>
        <div style={{width:'64px',height:'64px',background:'#0a1931',borderRadius:'18px',margin:'0 auto 16px',display:'grid',placeItems:'center',color:'#ffcc00',fontSize:'26px',fontWeight:900}}>P</div>
        <h2 style={{fontWeight:900,color:'#0a1931',letterSpacing:'-1px'}}>PINNACLE ADMIN</h2><p style={{fontSize:'12px',color:'#666',marginTop:'6px'}}>Secure Dashboard Access</p>
        <input type="password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&login()} placeholder="Admin Password" style={{width:'100%',padding:'14px 16px',borderRadius:'14px',marginTop:'22px',border:'2px solid #e5e7eb',outline:'none'}}/>
        <button onClick={login} style={{width:'100%',marginTop:'14px',background:'#ffcc00',padding:'14px',borderRadius:'14px',fontWeight:900,border:'none',cursor:'pointer',boxShadow:'0 8px 20px rgba(255,204,0,.3)'}}>UNLOCK DASHBOARD →</button>
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

  const filteredContacts = applyFilters(contacts); const filteredApplicants = applyFilters(applicants);
  const list = tab==='contacts'?filteredContacts:filteredApplicants;
  const totalPages = Math.ceil(list.length / rowsPerPage) || 1;
  const paginatedList = list.slice((currentPage-1)*rowsPerPage, currentPage*rowsPerPage);
  const allPageIds = paginatedList.map(r=>r._uid);
  const isAllSelected = allPageIds.length>0 && allPageIds.every(id=>selected.includes(id));
  const activeFilterCount = Object.values(filters).filter(v=>v).length;

  const exportCSV = (rows, filename) => {
    if(!rows.length) return;
    const headers = tab==='contacts'?["Timestamp","FullName","Phone","Email","Service","Messages"]:["Timestamp","FullName","Phone","Email","Position","Education","District","Experience","Interest"];
    const csv = [headers.join(",")].concat(rows.map(r=> headers.map(h=>`"${String(getVal(r,[h,h.toLowerCase()])||'').replace(/"/g,'""')}"`).join(","))).join("\n");
    const blob = new Blob([csv],{type:"text/csv"}); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download=filename; a.click();
    showToast("📥 Exported");
  };

  return (
    <div style={{background:'#f2f4f8',minHeight:'100vh',fontFamily:'Inter,Arial'}}>
      {toast && <div style={{position:'fixed',top:'20px',right:'20px',background:'#0a1931',color:'#ffcc00',padding:'12px 20px',borderRadius:'30px',fontWeight:900,fontSize:'13px',zIndex:99999,boxShadow:'0 10px 30px rgba(0,0,0,.3)'}}>{toast}</div>}

      {/* HEADER */}
      <div style={{background:'#0a1931',padding:'16px 24px',display:'flex',justifyContent:'space-between',alignItems:'center',position:'sticky',top:0,zIndex:100,borderBottom:'4px solid #ffcc00'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
          <div style={{width:'40px',height:'40px',background:'#ffcc00',borderRadius:'12px',display:'grid',placeItems:'center',fontWeight:900,color:'#0a1931'}}>P</div>
          <div><h1 style={{color:'#fff',fontWeight:900,fontSize:'15px',letterSpacing:'-.5px'}}>PINNACLE SECURITY LTD</h1><p style={{color:'#ffcc00',fontSize:'10px',letterSpacing:'1px',fontWeight:700}}>ADMIN CONTROL CENTER</p></div>
          <div style={{marginLeft:'16px',display:'flex',gap:'8px'}}>
            <span style={{background:'rgba(255,204,0,.15)',color:'#ffcc00',padding:'4px 10px',borderRadius:'20px',fontSize:'11px',fontWeight:800}}>{data.length} TOTAL</span>
          </div>
        </div>
        <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
          <div style={{background:'rgba(255,255,255,.1)',borderRadius:'24px',padding:'8px 14px',display:'flex',alignItems:'center',gap:'6px'}}><span style={{color:'#fff'}}>🔍</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, phone..." style={{background:'transparent',border:'none',outline:'none',color:'#fff',fontSize:'12px',width:'160px'}}/></div>
          <button onClick={()=>setShowFilters(!showFilters)} style={{background:activeFilterCount?'#ffcc00':'#fff',color:'#0a1931',border:'none',padding:'9px 16px',borderRadius:'24px',fontWeight:800,fontSize:'12px',cursor:'pointer'}}>{showFilters?'✕ Close':'⚙ Filters'} {activeFilterCount?`(${activeFilterCount})`:''}</button>
          {selected.length>0 && <button onClick={handleBulkDelete} style={{background:'#dc2626',color:'#fff',border:'none',padding:'9px 16px',borderRadius:'24px',fontWeight:800,fontSize:'12px',cursor:'pointer'}}>🗑 {selected.length}</button>}
          <button onClick={load} style={{background:'#ffcc00',border:'none',padding:'9px 16px',borderRadius:'24px',fontWeight:900,fontSize:'12px',cursor:'pointer'}}>{loading?'⏳':'↻ Refresh'}</button>
        </div>
      </div>

      {/* FILTERS */}
      {showFilters && (
        <div style={{background:'#fff',margin:'16px 24px',padding:'18px',borderRadius:'18px',boxShadow:'0 4px 20px rgba(0,0,0,.06)',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:'12px'}}>
          {tab==='contacts' ? (
            <select value={filters.service} onChange={e=>setFilters({...filters,service:e.target.value})} style={{padding:'10px',borderRadius:'10px',border:'1px solid #e5e7eb'}}><option value="">All Services</option>{serviceOptions.map(s=><option key={s} value={s}>{s}</option>)}</select>
          ) : (
            <>
              <select value={filters.position} onChange={e=>setFilters({...filters,position:e.target.value})} style={{padding:'10px',borderRadius:'10px',border:'1px solid #e5e7eb'}}><option value="">All Positions</option>{positionOptions.map(s=><option key={s} value={s}>{s}</option>)}</select>
              <select value={filters.district} onChange={e=>setFilters({...filters,district:e.target.value})} style={{padding:'10px',borderRadius:'10px',border:'1px solid #e5e7eb'}}><option value="">All Districts</option>{districtOptions.map(s=><option key={s} value={s}>{s}</option>)}</select>
              <select value={filters.education} onChange={e=>setFilters({...filters,education:e.target.value})} style={{padding:'10px',borderRadius:'10px',border:'1px solid #e5e7eb'}}><option value="">All Education</option>{educationOptions.map(s=><option key={s} value={s}>{s}</option>)}</select>
              <select value={filters.experience} onChange={e=>setFilters({...filters,experience:e.target.value})} style={{padding:'10px',borderRadius:'10px',border:'1px solid #e5e7eb'}}><option value="">All Experience</option>{experienceOptions.map(s=><option key={s} value={s}>{s}</option>)}</select>
            </>
          )}
          <input type="date" value={filters.dateFrom} onChange={e=>setFilters({...filters,dateFrom:e.target.value})} style={{padding:'10px',borderRadius:'10px',border:'1px solid #e5e7eb'}}/>
          <input type="date" value={filters.dateTo} onChange={e=>setFilters({...filters,dateTo:e.target.value})} style={{padding:'10px',borderRadius:'10px',border:'1px solid #e5e7eb'}}/>
          <button onClick={()=>setFilters({service:"",position:"",district:"",education:"",experience:"",interest:"",dateFrom:"",dateTo:""})} style={{padding:'10px',borderRadius:'10px',border:'none',background:'#f3f4f6',fontWeight:800,cursor:'pointer'}}>Clear Filters</button>
        </div>
      )}

      <div style={{maxWidth:'1600px',margin:'auto',padding:'18px 24px'}}>
        {/* STATS */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:'14px',marginBottom:'18px'}}>
          <div onClick={()=>{setTab('contacts'); setSelected([]);}} style={{background:tab==='contacts'?'#0a1931':'#fff',color:tab==='contacts'?'#fff':'#0a1931',padding:'20px',borderRadius:'20px',cursor:'pointer',border:tab==='contacts'?'2px solid #ffcc00':'1px solid #eee',boxShadow:'0 8px 20px rgba(0,0,0,.04)'}}><p style={{fontSize:'11px',opacity:.7,letterSpacing:'1px',fontWeight:700}}>📞 CONTACT REQUESTS</p><h2 style={{fontSize:'32px',fontWeight:900,marginTop:'10px'}}>{contacts.length}</h2><p style={{fontSize:'11px',opacity:.6,marginTop:'6px'}}>{filteredContacts.length} filtered • Click to view</p></div>
          <div onClick={()=>{setTab('applicants'); setSelected([]);}} style={{background:tab==='applicants'?'#ffcc00':'#fff',padding:'20px',borderRadius:'20px',cursor:'pointer',border:tab==='applicants'?'2px solid #0a1931':'1px solid #eee',boxShadow:'0 8px 20px rgba(0,0,0,.04)'}}><p style={{fontSize:'11px',fontWeight:700,letterSpacing:'1px'}}>🎖️ JOB APPLICANTS</p><h2 style={{fontSize:'32px',fontWeight:900,marginTop:'10px',color:'#0a1931'}}>{applicants.length}</h2><p style={{fontSize:'11px',color:'#666',marginTop:'6px'}}>{filteredApplicants.length} filtered • Click to view</p></div>
          <div style={{background:'#fff',padding:'20px',borderRadius:'20px',border:'1px solid #eee',boxShadow:'0 8px 20px rgba(0,0,0,.04)'}}><p style={{fontSize:'11px',fontWeight:700,letterSpacing:'1px',color:'#6b7280'}}>📊 CURRENT VIEW</p><div style={{display:'flex',justifyContent:'space-between',alignItems:'end',marginTop:'10px'}}><h2 style={{fontSize:'32px',fontWeight:900}}>{list.length}</h2><div style={{display:'flex',gap:'6px'}}><button onClick={()=>exportCSV(list,`${tab}.csv`)} style={{background:'#0a1931',color:'#ffcc00',border:'none',padding:'8px 14px',borderRadius:'20px',fontSize:'11px',fontWeight:900,cursor:'pointer'}}>⬇ CSV</button><button onClick={()=>{setForm({});setShowAdd(true)}} style={{background:'#ffcc00',border:'none',padding:'8px 14px',borderRadius:'20px',fontSize:'11px',fontWeight:900,cursor:'pointer'}}>+ ADD NEW</button></div></div></div>
        </div>

        {/* TABLE */}
        <div style={{background:'#fff',borderRadius:'20px',overflow:'hidden',boxShadow:'0 12px 40px rgba(0,0,0,.08)'}}>
          <div style={{padding:'16px 22px',display:'flex',justifyContent:'space-between',alignItems:'center',background:tab==='contacts'?'#0a1931':'#111827',color:tab==='contacts'?'#ffcc00':'#fff'}}>
            <div style={{fontWeight:900,fontSize:'13px',letterSpacing:'.5px'}}>{tab==='contacts'?`📞 CONTACTS — ${list.length}`:`📋 APPLICANTS — ${list.length}`} • Page {currentPage}/{totalPages}</div>
            <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
              <span style={{fontSize:'11px',opacity:.8}}>Show:</span>
              <select value={rowsPerPage} onChange={e=>setRowsPerPage(Number(e.target.value))} style={{padding:'6px 10px',borderRadius:'20px',border:'none',fontWeight:700,fontSize:'12px'}}><option value={15}>15</option><option value={30}>30</option><option value={50}>50</option><option value={100}>100</option></select>
            </div>
          </div>

          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px',minWidth:'1100px'}}>
              <thead><tr style={{background:'#f9fafb',color:'#6b7280',textAlign:'left',fontSize:'10px',letterSpacing:'1px',fontWeight:800}}>
                <th style={{padding:'14px 16px',borderBottom:'2px solid #e5e7eb'}}><input type="checkbox" checked={isAllSelected} onChange={()=>{ if(isAllSelected) setSelected(prev=>prev.filter(id=>!allPageIds.includes(id))); else setSelected(prev=>[...new Set([...prev, ...allPageIds])]); }}/></th>
                <th style={{padding:'14px 16px',borderBottom:'2px solid #e5e7eb'}}>DATE & TIME</th>
                <th style={{padding:'14px 16px',borderBottom:'2px solid #e5e7eb'}}>FULL NAME</th>
                <th style={{padding:'14px 16px',borderBottom:'2px solid #e5e7eb'}}>PHONE</th>
                <th style={{padding:'14px 16px',borderBottom:'2px solid #e5e7eb'}}>EMAIL</th>
                {tab==='contacts'?<><th style={{padding:'14px 16px',borderBottom:'2px solid #e5e7eb'}}>SERVICE</th><th style={{padding:'14px 16px',borderBottom:'2px solid #e5e7eb'}}>MESSAGE</th></>:<><th style={{padding:'14px 16px',borderBottom:'2px solid #e5e7eb'}}>POSITION</th><th style={{padding:'14px 16px',borderBottom:'2px solid #e5e7eb'}}>DISTRICT</th><th style={{padding:'14px 16px',borderBottom:'2px solid #e5e7eb'}}>EXP</th></>}
                <th style={{padding:'14px 16px',borderBottom:'2px solid #e5e7eb'}}>ACTIONS</th>
              </tr></thead>
              <tbody>
                {paginatedList.map((d,i)=>{
                  const checked=selected.includes(d._uid);
                  return (
                  <tr key={d._uid} style={{borderBottom:'1px solid #f1f1f1',background:checked?'#fff9db':i%2===0?'#fff':'#fbfdff'}}>
                    <td style={{padding:'12px 16px'}}><input type="checkbox" checked={checked} onChange={()=>setSelected(prev=>prev.includes(d._uid)?prev.filter(id=>id!==d._uid):[...prev,d._uid])} /></td>
                    <td style={{padding:'12px 16px',fontSize:'11px',fontWeight:700,color:'#0a1931'}}>{getVal(d,['Timestamp','timestamp'])?.slice(0,19)}</td>
                    <td style={{padding:'12px 16px',fontWeight:800,cursor:'pointer'}} onClick={()=>setDetailRow(d)}>{getVal(d,['FullName','fullName'])}</td>
                    <td style={{padding:'12px 16px'}}>{getVal(d,['Phone','phone'])}</td>
                    <td style={{padding:'12px 16px',maxWidth:'160px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{getVal(d,['Email','email'])}</td>
                    {tab==='contacts'?<>
                      <td style={{padding:'12px 16px'}}><span style={{background:'#eef2ff',color:'#3730a3',padding:'4px 10px',borderRadius:'20px',fontSize:'11px',fontWeight:700}}>{getVal(d,['Service','service'])}</span></td>
                      <td style={{padding:'12px 16px',maxWidth:'200px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{getVal(d,['Messages','message'])}</td>
                    </>:<>
                      <td style={{padding:'12px 16px'}}><span style={{background:'#fef3c7',padding:'4px 10px',borderRadius:'20px',fontSize:'11px',fontWeight:700}}>{getVal(d,['Position','position'])}</span></td>
                      <td style={{padding:'12px 16px'}}>{getVal(d,['District','district'])}</td>
                      <td style={{padding:'12px 16px'}}>{getVal(d,['Experience','experience'])}</td>
                    </>}
                    <td style={{padding:'12px 16px'}}><div style={{display:'flex',gap:'6px'}}><button onClick={()=>handleEdit(d)} style={{background:'#ffcc00',border:'none',padding:'6px 12px',borderRadius:'8px',fontWeight:800,fontSize:'11px',cursor:'pointer'}}>EDIT</button><button onClick={()=>handleDelete(d)} style={{background:'#fee2e2',color:'#dc2626',border:'none',padding:'6px 10px',borderRadius:'8px',fontWeight:800,fontSize:'11px',cursor:'pointer'}}>DEL</button></div></td>
                  </tr>
                )})}
                {paginatedList.length===0 && <tr><td colSpan={10} style={{padding:'40px',textAlign:'center',color:'#999'}}>No data — try clear filters or switch tab</td></tr>}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div style={{padding:'16px 22px',display:'flex',justifyContent:'space-between',alignItems:'center',borderTop:'1px solid #eee',background:'#f9fafb'}}>
            <div style={{display:'flex',gap:'6px',alignItems:'center'}}>
              <button disabled={currentPage===1} onClick={()=>setCurrentPage(p=>Math.max(1,p-1))} style={{background:currentPage===1?'#e5e7eb':'#fff',border:'1px solid #ddd',padding:'8px 14px',borderRadius:'10px',fontWeight:800,cursor:'pointer'}}>◂ PREV</button>
              <div style={{display:'flex',gap:'4px'}}>
                {Array.from({length:Math.min(5,totalPages)},(_,i)=>{
                  const pageNum = currentPage<=3 ? i+1 : currentPage>=totalPages-2 ? totalPages-4+i : currentPage-2+i;
                  if(pageNum<1||pageNum>totalPages) return null;
                  return <button key={pageNum} onClick={()=>setCurrentPage(pageNum)} style={{background:pageNum===currentPage?'#0a1931':'#fff',color:pageNum===currentPage?'#ffcc00':'#0a1931',border:'1px solid #ddd',padding:'8px 12px',borderRadius:'10px',fontWeight:800,cursor:'pointer'}}>{pageNum}</button>
                })}
              </div>
              <button disabled={currentPage===totalPages} onClick={()=>setCurrentPage(p=>Math.min(totalPages,p+1))} style={{background:currentPage===totalPages?'#e5e7eb':'#0a1931',color:currentPage===totalPages?'#aaa':'#ffcc00',border:'1px solid #ddd',padding:'8px 14px',borderRadius:'10px',fontWeight:800,cursor:'pointer'}}>NEXT ▸</button>
            </div>
            <div style={{fontSize:'12px',color:'#6b7280'}}>Page {currentPage} of {totalPages} • {list.length} rows • {selected.length} selected</div>
          </div>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {detailRow && (
        <div onClick={()=>setDetailRow(null)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.5)',zIndex:10000,display:'flex',justifyContent:'center',alignItems:'center',padding:'20px'}}>
          <div onClick={e=>e.stopPropagation()} style={{background:'#fff',borderRadius:'20px',width:'100%',maxWidth:'480px',padding:'24px',boxShadow:'0 30px 80px rgba(0,0,0,.3)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}><h3 style={{fontWeight:900}}>👤 {getVal(detailRow,['FullName','fullName'])}</h3><button onClick={()=>setDetailRow(null)} style={{background:'#f3f4f6',border:'none',padding:'8px 12px',borderRadius:'10px',cursor:'pointer'}}>✕</button></div>
            <div style={{display:'grid',gap:'10px',fontSize:'13px'}}>
              {Object.entries(detailRow).filter(([k])=>!k.startsWith('_')).map(([k,v])=><div key={k} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid #f3f4f6'}}><span style={{fontWeight:700,color:'#6b7280'}}>{k}</span><span style={{fontWeight:600}}>{String(v).slice(0,80)}</span></div>)}
            </div>
            <div style={{display:'flex',gap:'8px',marginTop:'16px'}}><button onClick={()=>{handleEdit(detailRow); setDetailRow(null)}} style={{flex:1,background:'#ffcc00',border:'none',padding:'12px',borderRadius:'12px',fontWeight:900,cursor:'pointer'}}>EDIT</button><button onClick={()=>handleDelete(detailRow)} style={{flex:1,background:'#fee2e2',color:'#dc2626',border:'none',padding:'12px',borderRadius:'12px',fontWeight:900,cursor:'pointer'}}>DELETE</button></div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editRow && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.5)',zIndex:10001,display:'flex',justifyContent:'center',alignItems:'center',padding:'20px'}}>
          <div style={{background:'#fff',borderRadius:'20px',width:'100%',maxWidth:'520px',padding:'24px',maxHeight:'90vh',overflowY:'auto'}}>
            <h3 style={{fontWeight:900,marginBottom:'16px'}}>✏️ Edit {form.FullName}</h3>
            <div style={{display:'grid',gap:'10px'}}>
              {["FullName","Phone","Email", ...(tab==='contacts'?["Service","Messages"]:["Position","Education","District","Experience","Interest"])].map(field=>(
                <div key={field}><label style={{fontSize:'11px',fontWeight:800,color:'#6b7280'}}>{field}</label><input value={form[field]||''} onChange={e=>setForm({...form,[field]:e.target.value})} style={{width:'100%',padding:'10px 12px',borderRadius:'10px',border:'1px solid #e5e7eb',marginTop:'4px'}}/></div>
              ))}
            </div>
            <div style={{display:'flex',gap:'8px',marginTop:'16px'}}><button onClick={()=>setEditRow(null)} style={{flex:1,background:'#f3f4f6',border:'none',padding:'12px',borderRadius:'12px',fontWeight:800,cursor:'pointer'}}>CANCEL</button><button onClick={handleSave} style={{flex:1,background:'#0a1931',color:'#ffcc00',border:'none',padding:'12px',borderRadius:'12px',fontWeight:900,cursor:'pointer'}}>💾 SAVE</button></div>
          </div>
        </div>
      )}

      {/* ADD MODAL */}
      {showAdd && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.5)',zIndex:10001,display:'flex',justifyContent:'center',alignItems:'center',padding:'20px'}}>
          <div style={{background:'#fff',borderRadius:'20px',width:'100%',maxWidth:'520px',padding:'24px'}}>
            <h3 style={{fontWeight:900,marginBottom:'16px'}}>➕ Add New {tab}</h3>
            <div style={{display:'grid',gap:'10px'}}>
              {["FullName","Phone","Email", ...(tab==='contacts'?["Service","Messages"]:["Position","Education","District","Experience","Interest"])].map(field=>(
                <div key={field}><label style={{fontSize:'11px',fontWeight:800,color:'#6b7280'}}>{field}</label><input value={form[field]||''} onChange={e=>setForm({...form,[field]:e.target.value})} placeholder={field} style={{width:'100%',padding:'10px 12px',borderRadius:'10px',border:'1px solid #e5e7eb',marginTop:'4px'}}/></div>
              ))}
            </div>
            <div style={{display:'flex',gap:'8px',marginTop:'16px'}}><button onClick={()=>setShowAdd(false)} style={{flex:1,background:'#f3f4f6',border:'none',padding:'12px',borderRadius:'12px',fontWeight:800,cursor:'pointer'}}>CANCEL</button><button onClick={handleAddNew} style={{flex:1,background:'#ffcc00',border:'none',padding:'12px',borderRadius:'12px',fontWeight:900,cursor:'pointer'}}>ADD</button></div>
          </div>
        </div>
      )}
    </div>
  )
}