import React, { useState, useEffect } from 'react'

const ADMIN_PASSWORD = "Pinnacle2026!Secure123";
const GOOGLE_SHEET_WEBHOOK = "https://script.google.com/macros/s/AKfycbz0Fx9gSfPwPXZdi8pivw9IdQ_fzj707fPk22GBECuGYhGzwePtEPZV47TyXk8TN8bggQ/exec";
const KOBO_APTITUDE_TEST = "https://ee.kobotoolbox.org/x/ODCdeyaJ";
const GOOGLE_APTITUDE_REGISTER = "https://forms.gle/W8JroZ8n8HGArq248";

const getFullDateTime24 = () => {
  const d = new Date();
  const kampala = new Date(d.toLocaleString('en-US', {timeZone:'Africa/Kampala'}));
  return kampala.getDate().toString().padStart(2,'0') + '/' + (kampala.getMonth()+1).toString().padStart(2,'0') + '/' + kampala.getFullYear() + ' ' + kampala.getHours().toString().padStart(2,'0') + ':' + kampala.getMinutes().toString().padStart(2,'0') + ':' + kampala.getSeconds().toString().padStart(2,'0') + '.' + kampala.getMilliseconds() + '-' + Math.floor(Math.random()*900+100);
};

const AdminDashboard = () => {
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState("");
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("contacts");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(30);
  const [selected, setSelected] = useState([]);
  const [editRow, setEditRow] = useState(null);
  const [form, setForm] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState({ service: "", position: "", district: "", education: "", experience: "", interest: "", dateFrom: "", dateTo: "" });
  const [detailRow, setDetailRow] = useState(null);
  const [trash, setTrash] = useState(()=>JSON.parse(localStorage.getItem('psl_trash')||'[]'));
  const [showTrash, setShowTrash] = useState(false);
  const [live, setLive] = useState(true);
  const [dark, setDark] = useState(true);
  const [toast, setToast] = useState("");
  const showToast = (m)=>{ setToast(m); setTimeout(()=>setToast(""),3000); }
  const login = () => pass === ADMIN_PASSWORD ? setAuth(true) : alert("Wrong Password!");

  const load = () => {
    setLoading(true);
    const cbName = "psl_cb_" + Date.now();
    const old = document.getElementById("psl_jsonp");
    if(old) old.remove();
    window[cbName] = (d) => {
      try {
        let arr = Array.isArray(d) ? d : (d.data || []);
        const withId = arr.map((row,i)=>{
          const ts = (row.Timestamp || row.timestamp || "")+"";
          if(!ts || ts.trim()==="" || ts==="undefined") return null;
          return Object.assign({}, row, {Timestamp:ts, timestamp:ts, _uid: ts + "_" + i});
        }).filter(Boolean);
        setData(withId.sort((a,b)=> new Date(b.timestamp||0)-new Date(a.timestamp||0)));
      } catch(e) { console.log(e); }
      setLoading(false);
      delete window[cbName];
      const sc = document.getElementById("psl_jsonp");
      if(sc) sc.remove();
    };
    const s = document.createElement("script");
    s.id = "psl_jsonp";
    s.src = GOOGLE_SHEET_WEBHOOK + "?callback=" + cbName + "&cache=" + Date.now();
    s.onerror = () => {
      setLoading(false);
      delete window[cbName];
      const sc = document.getElementById("psl_jsonp");
      if(sc) sc.remove();
      showToast("Load failed - check Apps Script Anyone");
    };
    document.body.appendChild(s);
  };

  useEffect(()=>{ if(auth) load(); },[auth]);
  useEffect(()=>{ if(!auth||!live) return; const id=setInterval(load,30000); return ()=>clearInterval(id); },[auth,live]);
  useEffect(()=>{ setCurrentPage(1); },[filters,search,tab,rowsPerPage]);
  const getVal = (obj, keys) => { for(let k of keys) if(obj[k]!==undefined && obj[k]!==null && obj[k]!=='') return obj[k]; return ''; }
  const formatDate = (t) => { if(!t) return '-'; try { const d=new Date(t); if(isNaN(d.getTime())) return t; return d.toLocaleString('en-GB',{timeZone:'Africa/Kampala',day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}); } catch { return t; } }
  const handleDelete = async (row) => {
    const ts=getVal(row,['Timestamp','timestamp']);
    const newTrash=[Object.assign({}, row, {deletedAt:new Date().toISOString()})].concat(trash).slice(0,200);
    setTrash(newTrash); localStorage.setItem('psl_trash',JSON.stringify(newTrash));
    setData(prev=>prev.filter(r=>getVal(r,['Timestamp','timestamp'])!==ts));
    setSelected(prev=>prev.filter(id=>id!==ts));
    if(detailRow && getVal(detailRow,['Timestamp','timestamp'])===ts) setDetailRow(null);
    showToast("Moved to Trash");
    await fetch(GOOGLE_SHEET_WEBHOOK,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain'},body:JSON.stringify({action:'delete',timestamps:[ts]})});
  };
  const handleBulkDelete = async () => {
    if(selected.length===0) return;
    const newTrash=data.filter(r=>selected.includes(getVal(r,['Timestamp','timestamp']))).map(r=>Object.assign({}, r, {deletedAt:new Date().toISOString()})).concat(trash).slice(0,200);
    setTrash(newTrash); localStorage.setItem('psl_trash',JSON.stringify(newTrash));
    setData(prev=>prev.filter(r=>!selected.includes(getVal(r,['Timestamp','timestamp']))));
    setSelected([]); setDetailRow(null); showToast(selected.length+" Moved");
    await fetch(GOOGLE_SHEET_WEBHOOK,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain'},body:JSON.stringify({action:'bulkDelete',timestamps:selected})});
  };
  const clearDuplicates = () => {
    const seen=new Set(); const dups=[]; const keep=[];
    data.forEach(r=>{ const key=getVal(r,['Phone','phone'])+"_"+getVal(r,['FullName','fullName']); if(seen.has(key)) dups.push(r); else { seen.add(key); keep.push(r); } });
    if(dups.length===0){ showToast('No duplicates'); return; }
    if(!confirm("Found "+dups.length+" duplicates? Move to Trash?")) return;
    setTrash(prev=>{ const nt=dups.concat(prev).slice(0,200); localStorage.setItem('psl_trash',JSON.stringify(nt)); return nt; });
    setData(keep); showToast(dups.length+" moved");
  };
  const toggleSelect = (ts) => setSelected(prev => prev.includes(ts) ? prev.filter(id=>id!==ts) : prev.concat([ts]));
  const handleEdit = (row) => { const ts = getVal(row,['Timestamp','timestamp']); setEditRow(ts); setForm({ timestamp:ts, FullName:getVal(row,['FullName','fullName']), Phone:getVal(row,['Phone','phone']), Email:getVal(row,['Email','email']), Service:getVal(row,['Service','service']), Messages:getVal(row,['Messages','message']), Position:getVal(row,['Position','position']), Education:getVal(row,['Education','education']), District:getVal(row,['District','district']), Experience:getVal(row,['Experience','experience']), Interest:getVal(row,['Interest','interest']), type:tab }); };
  const handleSave = async () => { const payload = Object.assign({ action:'update' }, form, { timestamp:editRow, type:tab }); setData(prev => prev.map(r => getVal(r,['Timestamp','timestamp'])===editRow?Object.assign({}, r, form, {Timestamp:editRow,timestamp:editRow}):r)); setEditRow(null); if(detailRow && getVal(detailRow,['Timestamp','timestamp'])===editRow) setDetailRow(prev=>Object.assign({}, prev, form, {Timestamp:editRow,timestamp:editRow})); showToast("Updated"); await fetch(GOOGLE_SHEET_WEBHOOK,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain'},body:JSON.stringify(payload)}); };
  const handleAddNew = async () => { const ts = getFullDateTime24(); const payload = Object.assign({}, form, { timestamp:ts, Timestamp:ts, type:tab==='contacts'?'contact':'applicant' }); setData(prev=>[payload].concat(prev)); setShowAdd(false); setForm({}); showToast("Added"); await fetch(GOOGLE_SHEET_WEBHOOK,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain'},body:JSON.stringify(payload)}); };
  const unique = (keyArr) => { const arr = []; const set = new Set(); data.forEach(d=>{ const v=getVal(d,keyArr); if(v && !set.has(v)){ set.add(v); arr.push(v); } }); return arr.sort(); };
  const serviceOptions = unique(['Service','service']); const positionOptions = unique(['Position','position']); const districtOptions = unique(['District','district']); const educationOptions = unique(['Education','education']); const experienceOptions = unique(['Experience','experience']); const interestOptions = unique(['Interest','interest']);
  const clearFilters = () => { setFilters({service:"",position:"",district:"",education:"",experience:"",interest:"",dateFrom:"",dateTo:""}); setCurrentPage(1); };
  const exportCSV = (rows, filename) => { if(!rows.length) return; const headers = tab==='contacts'?["Timestamp","FullName","Phone","Email","Service","Messages"]:["Timestamp","FullName","Phone","Email","Position","Education","District","Experience","Interest"]; let csv = headers.join(",")+"\n"; rows.forEach(r=>{ const line = headers.map(h=>'"'+String(getVal(r,[h,h.toLowerCase()])||'').replace(/"/g,'""')+'"').join(","); csv+=line+"\n"; }); const blob = new Blob([csv],{type:"text/csv"}); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download=filename; a.click(); showToast("Exported"); };

  if(!auth){ return ( <div style={{minHeight:'100vh',background:dark?'#0f172a':'#f1f5f9',display:'flex',justifyContent:'center',alignItems:'center',fontFamily:'Arial'}}><div style={{background:'#fff',padding:'36px',borderRadius:'24px',width:'92%',maxWidth:'400px',textAlign:'center'}}><div style={{width:'56px',height:'56px',background:'#0a1931',borderRadius:'14px',margin:'0 auto 14px',display:'grid',placeItems:'center',color:'#ffcc00',fontSize:'22px',fontWeight:900}}>P</div><h2 style={{fontWeight:900,color:'#0a1931'}}>PINNACLE ADMIN</h2><input type="password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&login()} placeholder="Admin Password" style={{width:'100%',padding:'14px 16px',borderRadius:'12px',marginTop:'20px',border:'2px solid #0a1931'}}/><button onClick={login} style={{width:'100%',marginTop:'14px',background:'#ffcc00',padding:'14px',borderRadius:'12px',fontWeight:900,border:'none',cursor:'pointer'}}>UNLOCK</button></div></div> ) }

  const applicants = data.filter(d => (d.type==='applicant' || d.Type==='applicant' || getVal(d,['Position','position']))); 
  const contacts = data.filter(d => (d.type==='contact' || d.Type==='contact' || getVal(d,['Service','service']) || (!getVal(d,['Position','position']) && getVal(d,['FullName','fullName'])) ));
  const applyFilters = (list) => list.filter(d=>{ const s = (getVal(d,['FullName','fullName'])+" "+getVal(d,['Phone','phone'])+" "+getVal(d,['Email','email'])+" "+getVal(d,['Service','service'])+" "+getVal(d,['Position','position'])+" "+getVal(d,['District','district'])).toLowerCase(); if(search && s.indexOf(search.toLowerCase())===-1) return false; if(filters.service && getVal(d,['Service','service']).toLowerCase() !== filters.service.toLowerCase()) return false; if(filters.position && getVal(d,['Position','position']).toLowerCase() !== filters.position.toLowerCase()) return false; if(filters.district && getVal(d,['District','district']).toLowerCase() !== filters.district.toLowerCase()) return false; if(filters.dateFrom){ const ts=new Date(getVal(d,['Timestamp','timestamp'])); if(ts < new Date(filters.dateFrom)) return false; } if(filters.dateTo){ const ts=new Date(getVal(d,['Timestamp','timestamp'])); if(ts > new Date(filters.dateTo + 'T23:59:59')) return false; } return true; });
  const filteredContacts = applyFilters(contacts); const filteredApplicants = applyFilters(applicants); const list = tab==='contacts'?filteredContacts:filteredApplicants; const totalPages = Math.ceil(list.length / rowsPerPage) || 1; const paginatedList = list.slice((currentPage-1)*rowsPerPage, currentPage*rowsPerPage); const allPageIds = paginatedList.map(r=>getVal(r,['Timestamp','timestamp'])); const isAllSelected = allPageIds.length>0 && allPageIds.every(id=>selected.includes(id)); const activeFilterCount = Object.values(filters).filter(v=>v).length;
  const theme = dark ? {bgMain:'#0f172a', bgCard:'#1e293b', text:'#f1f5f9', border:'#334155', sidebar:'#1e293b', input:'#0f172a'} : {bgMain:'#f8fafc', bgCard:'#ffffff', text:'#0f172a', border:'#e2e8f0', sidebar:'#ffffff', input:'#f1f5f9'};
  const cellHead = {padding:'12px 14px', border:'1px solid '+theme.border};
  const menuItem = (active) => ({padding:'11px 14px',borderRadius:'12px',fontSize:'13px',fontWeight:active?900:700,cursor:'pointer',background:active?'#facc15':'transparent',color:active?'#0f172a':theme.text,border:'1px solid '+theme.border,width:'100%',display:'flex',justifyContent:'space-between',textAlign:'left'});

  return (
    <div style={{background:theme.bgMain,minHeight:'100vh',fontFamily:'Arial',color:theme.text,display:'flex'}}>
      {toast && <div style={{position:'fixed',top:'20px',right:'20px',background:'#0f172a',color:'#facc15',padding:'12px 18px',borderRadius:'20px',fontWeight:800,zIndex:9999,border:'1px solid #facc15'}}>{toast}</div>}
      <div style={{width:'270px',minWidth:'270px',background:theme.sidebar,borderRight:'3px solid #facc15',padding:'18px 14px',display:'flex',flexDirection:'column',gap:'8px',position:'sticky',top:0,height:'100vh',overflowY:'auto'}}>
        <div style={{display:'flex',alignItems:'center',gap:'10px',paddingBottom:'14px',borderBottom:'1px solid '+theme.border}}><div style={{width:'42px',height:'42px',background:'#facc15',borderRadius:'12px',display:'grid',placeItems:'center',fontWeight:900,color:'#0f172a'}}>P</div><div><h2 style={{fontWeight:900,fontSize:'13px'}}>Pinnacle Security Ltd</h2><p style={{fontSize:'10px',color:'#eab308',fontWeight:700}}>Admin {data.length} total {contacts.length}c {applicants.length}a</p></div></div>
        <button onClick={()=>setDark(!dark)} style={menuItem(false)}><span>{dark?'Light Theme':'Dark Theme'}</span><span>{dark?'☀️':'🌙'}</span></button>
        <button onClick={()=>{setTab('contacts'); setCurrentPage(1)}} style={menuItem(tab==='contacts')}><span>Contact</span><span>{contacts.length}</span></button>
        <button onClick={()=>{setTab('applicants'); setCurrentPage(1)}} style={menuItem(tab==='applicants')}><span>Applicant</span><span>{applicants.length}</span></button>
        <button onClick={()=>setLive(!live)} style={menuItem(false)}><span>{live?'Live':'Paused'}</span></button>
        <button onClick={()=>exportCSV(list, tab+".csv")} style={menuItem(false)}><span>Backup CSV</span></button>
        <button onClick={clearDuplicates} style={menuItem(false)}><span>Dup Clean</span></button>
        <button onClick={()=>setShowTrash(!showTrash)} style={menuItem(showTrash)}><span>Trash {trash.length}</span></button>
        <a href="/" style={Object.assign({}, menuItem(false), {textDecoration:'none'})}><span>Home</span></a>
        <button onClick={load} style={menuItem(false)}><span>{loading?'Loading':'Refresh'}</span></button>
      </div>
      <div style={{flex:1,padding:'20px',overflowX:'hidden'}}>
        <div style={{background:theme.bgCard,padding:'14px 18px',borderRadius:'16px',display:'flex',gap:'10px',alignItems:'center',flexWrap:'wrap',border:'1px solid '+theme.border,marginBottom:'14px'}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{flex:1,minWidth:'200px',background:theme.input,border:'1px solid '+theme.border,padding:'11px 14px',borderRadius:'20px',color:theme.text}}/>
          <button onClick={()=>setShowFilters(!showFilters)} style={{background:activeFilterCount?'#ffcc00':'#fff',color:'#0a1931',border:'none',padding:'8px 14px',borderRadius:'20px',fontWeight:800,fontSize:'12px',cursor:'pointer'}}>{showFilters?'X Filters':'Filters '+(activeFilterCount? '('+activeFilterCount+')':'')}</button>
          {selected.length>0 && <button onClick={handleBulkDelete} style={{background:'#dc2626',color:'#fff',border:'none',padding:'8px 14px',borderRadius:'20px',fontWeight:800,fontSize:'12px',cursor:'pointer'}}>Delete {selected.length}</button>}
          <select value={rowsPerPage} onChange={e=>setRowsPerPage(Number(e.target.value))} style={{padding:'8px 12px',borderRadius:'10px',border:'1px solid '+theme.border,background:theme.bgCard,color:theme.text}}><option value={10}>10</option><option value={30}>30</option><option value={50}>50</option><option value={100}>100</option></select>
        </div>
        {showTrash && <div style={{background:theme.bgCard,padding:'12px',borderRadius:'12px',border:'2px dashed #facc15',marginBottom:'12px'}}><b>Trash {trash.length}</b> <button onClick={()=>{setTrash([]); localStorage.setItem('psl_trash','[]')}} style={{marginLeft:'10px',background:'#7f1d1d',color:'#fff',border:'none',padding:'4px 10px',borderRadius:'10px',fontSize:'11px'}}>EMPTY</button></div>}
        <div style={{background:theme.bgCard,borderRadius:'16px',overflow:'hidden',border:'1px solid '+theme.border}}>
          <div style={{padding:'14px 18px',display:'flex',justifyContent:'space-between',background:'#0f172a',color:'#facc15',fontWeight:900,fontSize:'12px'}}><span>{tab==='contacts'?'CONTACTS':'APPLICANTS'} {list.length} rows Theme {dark?'DARK':'LIGHT'}</span><span>{loading?'Loading...':'Ready'}</span></div>
          <div style={{overflowX:'auto'}}><table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px',minWidth:'900px'}}><thead><tr style={{background:theme.bgMain}}><th style={cellHead}><input type="checkbox" checked={isAllSelected} onChange={()=>{ if(isAllSelected) setSelected(prev=>prev.filter(id=>allPageIds.indexOf(id)===-1)); else setSelected(prev=>{ const ns={}; prev.forEach(id=>ns[id]=true); allPageIds.forEach(id=>ns[id]=true); return Object.keys(ns); }); }}/></th><th style={cellHead}>DATE</th><th style={cellHead}>NAME</th><th style={cellHead}>PHONE</th><th style={cellHead}>EMAIL</th><th style={cellHead}>{tab==='contacts'?'SERVICE':'POSITION'}</th><th style={cellHead}>ACTIONS</th></tr></thead><tbody>{paginatedList.length===0 ? <tr><td colSpan={7} style={{padding:'30px',textAlign:'center',color:'#999'}}>{loading?'Loading...':'No data - Ready for new submissions'}</td></tr> : paginatedList.map((d,i)=>{ const ts=getVal(d,['Timestamp','timestamp']); const isEditing=editRow===ts; const checked=selected.includes(ts); const bg = checked?'#422006':i%2===0?theme.bgCard:theme.bgMain; return (<tr key={i} onClick={()=>{ if(!isEditing) setDetailRow(d); }} style={{background:bg,cursor:'pointer',borderBottom:'1px solid '+theme.border}}><td style={Object.assign({}, cellHead, {background:bg})} onClick={e=>e.stopPropagation()}><input type="checkbox" checked={checked} onChange={()=>toggleSelect(ts)}/></td><td style={Object.assign({}, cellHead, {background:bg,fontSize:'11px',fontWeight:800})}>{formatDate(ts)}</td><td style={Object.assign({}, cellHead, {background:bg,fontWeight:700})}>{isEditing?<input value={form.FullName||''} onChange={e=>setForm(Object.assign({}, form, {FullName:e.target.value}))} style={{padding:'6px',width:'100px'}}/>:getVal(d,['FullName','fullName'])}</td><td style={Object.assign({}, cellHead, {background:bg})}>{getVal(d,['Phone','phone'])}</td><td style={Object.assign({}, cellHead, {background:bg})}>{getVal(d,['Email','email'])}</td><td style={Object.assign({}, cellHead, {background:bg})}>{getVal(d,['Service','service'])||getVal(d,['Position','position'])}</td><td style={Object.assign({}, cellHead, {background:bg})} onClick={e=>e.stopPropagation()}><div style={{display:'flex',gap:'4px'}}>{isEditing?<><button onClick={handleSave} style={{background:'#0f172a',color:'#facc15',border:'none',padding:'6px 10px',borderRadius:'8px',fontWeight:800}}>SAVE</button><button onClick={()=>setEditRow(null)} style={{background:'#eee',border:'none',padding:'6px 8px',borderRadius:'8px'}}>X</button></>:<><button onClick={()=>handleEdit(d)} style={{background:'#facc15',border:'none',padding:'6px 10px',borderRadius:'8px',fontWeight:800}}>EDIT</button><button onClick={()=>handleDelete(d)} style={{background:'#fee2e2',color:'#dc2626',border:'none',padding:'6px 8px',borderRadius:'8px',fontWeight:800}}>DEL</button></>}</div></td></tr>)})}</tbody></table></div>
          <div style={{padding:'12px 18px',display:'flex',justifyContent:'space-between',borderTop:'1px solid '+theme.border}}><button disabled={currentPage===1} onClick={()=>setCurrentPage(p=>Math.max(1,p-1))} style={{padding:'8px 14px',borderRadius:'10px',border:'1px solid '+theme.border,background:theme.bgCard,color:theme.text}}>Prev</button><span>Page {currentPage}/{totalPages}</span><button disabled={currentPage===totalPages} onClick={()=>setCurrentPage(p=>Math.min(totalPages,p+1))} style={{padding:'8px 14px',borderRadius:'10px',border:'1px solid '+theme.border,background:theme.bgCard,color:theme.text}}>Next</button></div>
        </div>
      </div>
    </div>
  )
}

const Dropdown = ({ title, children, color="#0a1931" }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{background:'#fff', borderRadius:'12px', marginBottom:'12px', border:'2px solid '+color, overflow:'hidden'}}>
      <div onClick={()=>setOpen(!open)} style={{padding:'14px 18px', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', background: open ? color : '#fff', color: open ? '#ffcc00' : color, fontWeight:900, fontSize:'15px'}}>
        <span>{title}</span><span style={{fontSize:'20px'}}>{open ? '-' : '+'}</span>
      </div>
      {open && <div style={{padding:'16px 18px', fontSize:'16px', lineHeight:'1.8', color:'#333', background:'#f8fafc', borderTop:'1px solid #eee'}}>{children}</div>}
    </div>
  )
}

// ===== ONLY THIS NAVBAR IS CHANGED - NOTHING ELSE =====
const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(null);
  const scrollTo = (id) => { setOpen(false); setHover(null); const el = document.getElementById(id); if (el) { const offset = 75; const top = el.getBoundingClientRect().top + window.scrollY - offset; window.scrollTo({ top, behavior: 'smooth' }); } };

  const dropWrap = {position:'relative'};
  const dropBtn = (active) => ({color: active ? '#ffcc00' : '#fff', textDecoration:'none', fontSize:'16px', fontWeight:700, padding:'8px 12px', cursor:'pointer', display:'inline-block'});
  const mega = {position:'absolute', top:'100%', left:'50%', transform:'translateX(-50%)', width:'560px', background:'#fff', borderRadius:'14px', boxShadow:'0 14px 35px rgba(0,0,0,0.25)', padding:'20px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', zIndex:10000, textAlign:'left'};
  const colTitle = {color:'#0a1931', fontSize:'13px', fontWeight:900, borderBottom:'3px solid #ffcc00', paddingBottom:'6px', marginBottom:'10px', letterSpacing:'0.5px'};
  const colLink = {display:'block', color:'#333', fontSize:'14px', fontWeight:700, padding:'8px 6px', cursor:'pointer', borderRadius:'8px'};
  const colDesc = {display:'block', color:'#777', fontSize:'12px', fontWeight:400, lineHeight:'1.4'};

  return (
    <nav className="nav"><div className="nav-top"><span className="logo">PINNACLE SECURITY LTD</span><span className="menu-btn" onClick={() => setOpen(!open)}>{open ? 'X' : 'M'}</span></div>
      <div className={'links '+(open ? 'show' : '')}>
        <a onClick={() => scrollTo('home')}>Home</a>

        {/* ABOUT ▼ - 2 PAGES */}
        <div style={dropWrap} onMouseEnter={()=>setHover('about')} onMouseLeave={()=>setHover(null)}>
          <span style={dropBtn(hover==='about')} onClick={()=>scrollTo('about')}>About ▼</span>
          {hover==='about' && (
            <div style={mega}>
              <div><div style={colTitle}>ABOUT US</div>
                <span style={colLink} onClick={()=>scrollTo('about')}>About Pinnacle <span style={colDesc}>Since 2018, 150+ officers, 60+ sites, UN 2013-2025, Serena Kigo</span></span>
                <span style={colLink} onClick={()=>scrollTo('about')}>Our History & Welfare <span style={colDesc}>Free Food & Accommodation for all staff</span></span>
              </div>
              <div><div style={colTitle}>MISSION & VALUES</div>
                <span style={colLink} onClick={()=>scrollTo('mission')}>Mission, Vision, Values <span style={colDesc}>DISCIPLINE - Our daily life</span></span>
                <span style={colLink} onClick={()=>scrollTo('mission')}>Why Clients Trust Us <span style={colDesc}>24/7 Control Room, 10-Min Response</span></span>
              </div>
            </div>
          )}
        </div>

        {/* SERVICES ▼ - 2 PAGES */}
        <div style={dropWrap} onMouseEnter={()=>setHover('services')} onMouseLeave={()=>setHover(null)}>
          <span style={dropBtn(hover==='services')} onClick={()=>scrollTo('services')}>Services ▼</span>
          {hover==='services' && (
            <div style={mega}>
              <div><div style={colTitle}>🛡️ GUARDING</div>
                <span style={colLink} onClick={()=>scrollTo('services')}>Security Guard Service <span style={colDesc}>Homes, Shops, Offices - Day / Night</span></span>
                <span style={colLink} onClick={()=>scrollTo('services')}>Site Incharge & Supervisor <span style={colDesc}>Manages 5-15 guards, roster, OB</span></span>
                <span style={colLink} onClick={()=>scrollTo('services')}>Construction Site Security <span style={colDesc}>Stop cement, iron bars theft</span></span>
              </div>
              <div><div style={colTitle}>📹 TECHNOLOGY & SPECIAL</div>
                <span style={colLink} onClick={()=>scrollTo('services')}>CCTV, Patrol, Event, Alarm <span style={colDesc}>4 cameras 1.2M, Patrol 3x night</span></span>
                <span style={colLink} onClick={()=>scrollTo('services')}>Hotel & Corporate - Serena Standard <span style={colDesc}>Polite, clean, 5-star service</span></span>
                <span style={colLink} onClick={()=>scrollTo('services')}>Escort & VIP Protection <span style={colDesc}>Cash, goods, VIP escort</span></span>
              </div>
            </div>
          )}
        </div>

        {/* CAREER ▼ - NEW LINK - 2 PAGES */}
        <div style={dropWrap} onMouseEnter={()=>setHover('career')} onMouseLeave={()=>setHover(null)}>
          <span style={dropBtn(hover==='career')} onClick={()=>scrollTo('jobs')}>Career ▼</span>
          {hover==='career' && (
            <div style={mega}>
              <div><div style={colTitle}>💼 JOBS - WE ARE HIRING</div>
                <span style={colLink} onClick={()=>scrollTo('jobs')}>Site Incharge - 5 Posts <span style={colDesc}>UCE + 3yrs + Free Food & Accommodation</span></span>
                <span style={colLink} onClick={()=>scrollTo('jobs')}>Supervisor - 10 Posts <span style={colDesc}>UACE + Rider Permit + 3yrs</span></span>
                <span style={colLink} onClick={()=>scrollTo('jobs')}>Security Officer - 50 Posts <span style={colDesc}>P7 & above, Free Food & Accommodation</span></span>
              </div>
              <div><div style={colTitle}>📝 APPLY & TEST</div>
                <span style={colLink} onClick={()=>scrollTo('aptitude')}>Aptitude Test <span style={colDesc}>Must for all applicants - FREE online</span></span>
                <span style={colLink} onClick={()=>scrollTo('join')}>Apply Now <span style={colDesc}>No Fees - Interview daily 8am Muyenga</span></span>
                <span style={colLink} onClick={()=>scrollTo('jobs')}>Training - 2 Weeks FREE <span style={colDesc}>At Muyenga HQ, discipline + OB + radio</span></span>
              </div>
            </div>
          )}
        </div>

        <a onClick={() => scrollTo('mission')}>Mission</a>
        <a onClick={() => scrollTo('jobs')}>Jobs</a>
        <a onClick={() => scrollTo('aptitude')}>Aptitude Test</a>
        <a onClick={() => scrollTo('contact')}>Contact</a>
        <a onClick={() => scrollTo('join')} className="btn-yellow">Apply Now</a>
        <a href="/admin" style={{color:'#ffcc00', fontWeight:'900', border:'1px solid #ffcc00', borderRadius:'20px'}}>Admin</a>
      </div>
    </nav>
  )
}

const Home = () => {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI(p => (p + 1) % 3), 3500); return () => clearInterval(t) }, []);
  const slides = [
    { t: "Pinnacle Security Limited", d: "Plot 442 & 443 Masionatess, Muyenga - Licensed Security Company | 60+ Sites | 150+ Officers | 24/7 Control Room" },
    { t: "WE ARE RECRUITING - JOIN US TODAY", d: "SITE INCHARGE, SUPERVISOR, SECURITY OFFICER - Free Food & Accommodation + Free Training + No Fees" },
    { t: "Your Safety is Our Priority - 0776971970", d: "hr@pinnaclegroup.co.ug | Free Food & Accommodation | Free Training | No Recruitment Fees | Licensed by Uganda Police" },
  ];
  return (
    <div className="section" style={{paddingTop:'30px'}}>
      <div className="hero"><h1>{slides[i].t}</h1><p>{slides[i].d}</p><div className="dots">{[0, 1, 2].map(n => <span key={n} className={n === i ? 'dot on' : 'dot'} onClick={() => setI(n)}></span>)}</div>
        <div style={{display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap', marginTop:'12px'}}><a onClick={() => document.getElementById('join').scrollIntoView({behavior:'smooth'})} className="btn-yellow big" style={{cursor:'pointer'}}>Apply Now</a><a onClick={() => document.getElementById('aptitude').scrollIntoView({behavior:'smooth'})} className="btn-yellow big" style={{background:'#fff', cursor:'pointer'}}>Aptitude Test</a></div>
      </div>
      <div style={{marginTop:'22px'}}>
        <div className="home-grid-3">
          <div className="card"><h3>Who We Are - Licensed & Trusted</h3><p>Pinnacle Security Ltd is a fully licensed private security company at <b>Plot 442 & 443 Massionatees, Muyenga Hill</b>. Since 2018, we have grown to 60+ sites and 150+ trained officers. We provide <b>free food and accommodation</b> to all guards, supervisors and site incharges.</p><p style={{marginTop:'10px'}}>We have served big national clients including the <b>United Nations (UN) from 2013 to 2025</b>, the <b>Entebbe Express Highway</b>, and <b>Serena Hotel</b>. We are proud of that history, and we continue to serve with the same discipline today.</p></div>
          <div className="card gold"><h3>Core Services</h3><p><b>Guard Service:</b> Day/night guards for homes, shops, offices — with free food & accommodation</p><p><b>Site Incharge & Supervisor:</b> Experienced managers with motorcycle + free food & accommodation</p><p><b>Construction Security:</b> Protect cement, iron bars, timber, fuel</p><p><b>CCTV, Mobile Patrol, Alarm:</b> Affordable packages</p></div>
          <div className="card dark"><h3>URGENT RECRUITMENT - No Fees</h3><p><b>SITE INCHARGE:</b> UCE + 3yrs — Attractive salary + Free Food & Accommodation</p><p style={{marginTop:'10px'}}><b>SUPERVISOR:</b> UACE + Rider Permit + 3yrs — Attractive salary + Free Food & Accommodation</p><p style={{marginTop:'10px'}}><b>SECURITY OFFICER:</b> P7 & above — Attractive salary + Free Food & Accommodation</p><a onClick={() => document.getElementById('join').scrollIntoView({behavior:'smooth'})} className="btn-yellow big" style={{marginTop:'18px', width:'100%', textAlign:'center', display:'block', cursor:'pointer'}}>Apply Now</a></div>
        </div>
      </div>
    </div>
  )
}

const About = () => {
  return (
    <div className="section">
      <h2>About Pinnacle Security Ltd - Detailed</h2>
      <div className="about-hero"><h3>Pinnacle Security Ltd - Protecting What Matters Most Since 2018</h3><p>Plot 442 & 443 Massionatees, Muyenga Hill, Kampala | Control 24/7: 0776971970 | Free Food & Accommodation For All Staff | No Recruitment Fees</p><p style={{marginTop:'10px'}}>In Jesus Name, we started small in 2018 with only 5 guards and 1 client. God has grown us step by step. Today we protect homes, businesses, construction sites, hotels and national roads across Uganda. We do not just post a guard and disappear — we supervise, we patrol, we check, we respond. That is why big clients trusted us for many years.</p></div>
      <div className="home-grid-3">
        <div className="card"><h3>Our History & Welfare</h3><p>Started in 2018 with 5 guards and 1 client. Today 150+ officers, 60+ sites, patrol cars, CCTV team. Licensed by Uganda Police. We provide <b>free food and accommodation</b> to all staff.</p><p style={{marginTop:'10px'}}><b>Our Big Clients — Our Proud History:</b></p><p style={{marginTop:'8px'}}><b>1. UNITED NATIONS (UN) — 2013 to 2025:</b> Pinnacle Security Ltd signed a contract with the United Nations in <b>2013</b>. For 12 years, our officers guarded UN offices, compounds, warehouses and staff residences with high discipline, strict access control, and 24/7 reporting. That contract ended / was cancelled in <b>2025</b>. We thank God for those 12 years — it built our name, our discipline, and our systems. The experience still guides how we train every guard today.</p><p style={{marginTop:'8px'}}><b>2. ENTEBBE EXPRESS HIGHWAY:</b> The Entebbe Express Highway was also under Pinnacle Security. Our teams guarded toll areas, construction materials, equipment, and workers day and night. A national road needs national-level discipline — no sleeping on duty, no missing OB entries, quick response to any incident. We delivered that.</p><p style={{marginTop:'8px'}}><b>3. SERENA HOTEL:</b> We also served Serena Hotel. We have just lost / just loosed that contract, but we are still present and still serving in <b>Serena Hotel in Kigo</b>. Even when one contract closes, our relationship, our reputation and our officers remain. We continue to protect Serena in Kigo with the same respect, smart uniform, and polite service that a 5-star hotel demands.</p><p style={{marginTop:'8px'}}>These three names — UN, Entebbe Express Highway, Serena — prove one thing: <b>Pinnacle can handle small homes AND big national clients.</b> If UN trusted us for 12 years, your home and business are safe with us.</p></div>
        <div className="card gold"><h3>Why Clients Trust Us</h3><p>1. <b>24/7 Control Room</b> — Call 0776971970 any time, day or night. Someone always answers.<br/>2. <b>10-Minute Response</b> — Patrol and supervisor rush to your site when you call.<br/>3. <b>Free Food & Accommodation For Guards</b> — A guard who is fed and housed does not sleep, does not steal, does not leave. He protects you well.<br/>4. <b>Trained Officers:</b> 2 weeks training at Muyenga HQ — discipline, OB book, radio, first aid, customer care.<br/>5. <b>Affordable & Disciplined</b> — Clear price, no hidden fees, no asking for extra money at site.<br/>6. <b>Supervisor Visits 2x Daily</b> — We check guards, we check OB, we talk to you.<br/>7. <b>Replacement Guarantee</b> — If a guard misbehaves, we replace him same day, free.</p><p style={{marginTop:'10px'}}>We are not a briefcase company. Visit us at Muyenga HQ, see our control room, meet our managers, see our files. We are real, licensed, and accountable.</p></div>
        <div className="card dark"><h3>Our Numbers</h3><p>150+ Active Officers<br/>60+ Protected Sites<br/>15 Motorcycles + 3 Patrol Cars<br/>24/7 Control Room<br/>Free Food & Accommodation For All Staff<br/><br/><b>Major Contracts Served:</b><br/>• UN — 2013 to 2025 (12 Years)<br/>• Entebbe Express Highway<br/>• Serena Hotel — Still in Kigo<br/><br/>We thank God for every contract — past and present. Every client made us stronger.</p></div>
      </div>
      <div className="card" style={{marginTop:'16px'}}><h3>What Makes Pinnacle Different?</h3><p>Many companies give you a guard. Pinnacle gives you a <b>system</b>: Guard + Supervisor + Patrol + Control Room + OB Book + Daily Report. If one part fails, the other parts catch it. That is why UN stayed with us for 12 years, why Entebbe Express Highway trusted us, and why Serena still keeps us in Kigo. We do not promise magic — we promise discipline, every day, every night.</p><p style={{marginTop:'10px'}}>If you need security for your home, shop, school, construction site, hotel or office — come for a <b>Free Site Survey</b>. We visit, we advise, we give a fair price. No pressure. Call <b>0776971970</b>.</p></div>
    </div>
  )
}

const Services = () => {
  return (
    <div className="section">
      <h2>Our Security Services - Full Explanation</h2>
      <p style={{textAlign:'center', marginBottom:'18px', fontSize:'18px'}}>We offer 6 main services. All guards get free food & accommodation + attractive salary. All services below are fully open — no need to click to expand, just read.</p>
      <div className="card"><h3>1. Security Guard Service - Homes, Shops, Offices</h3><p>What you get: 1-4 guards per shift, uniformed, baton, radio, torch, OB book. Supervisor visits 2x daily, patrol 1x night. Guards get free food & accommodation at site.</p><p style={{marginTop:'10px'}}>How it works: We visit your home or shop FREE, we check gates, walls, lights, and risk. Then we recommend 1 guard day + 1 guard night, or 2 guards if the place is big. Every guard signs in OB book, checks visitors, checks in and out vehicles, and reports anything strange to control room on 0776971970. If your guard is sick, we send a replacement same day — you never stay without a guard.</p><p style={{marginTop:'10px'}}><b>Best for:</b> Homes in Muyenga, Munyonyo, Buziga, Nakasero, Kololo, Kira, Najjera, Entebbe, shops, supermarkets, offices, schools, churches, warehouses.</p></div>
      <div className="card gold"><h3>2. Site Incharge & Supervisor Service</h3><p>What you get: Experienced manager manages 5-15 guards, duty roster, OB, client handling. Gets free food & accommodation + motorcycle + fuel + airtime + attractive salary.</p><p style={{marginTop:'10px'}}>How it works: If you have many guards, you need one boss on site. The Site Incharge makes the roster, checks that every guard is present, smart, and awake. He handles visitors, handles police if needed, writes daily reports, and talks to you every morning. The Supervisor moves on motorcycle between 5-10 sites, checking guards at night, doing surprise checks. This is the system that made UN trust us for 12 years — not just guards, but supervision.</p><p style={{marginTop:'10px'}}><b>Best for:</b> Big sites, factories, construction sites, hotels, estates, UN compounds, NGO offices.</p></div>
      <div className="card"><h3>3. Construction Site Security</h3><p>Problem: 30% materials stolen at night. We stop it. Guards count cement, iron bars, check lorries. Guards get free food & accommodation at site.</p><p style={{marginTop:'10px'}}>How it works: At construction, thieves steal cement, iron bars, timber, fuel, tools — mostly at night, mostly from inside. Our guards count materials every evening and every morning, they check every lorry in and out, they keep a gate book, they escort fuel, and they sleep at site so they are there all night. Supervisor checks at night with patrol. That is how we protected Entebbe Express Highway materials and many other construction sites in Kampala, Wakiso, Entebbe and Mukono.</p><p style={{marginTop:'10px'}}><b>Best for:</b> Building sites, road construction, arcades under construction, warehouses with materials.</p></div>
      <div className="card gold"><h3>4. CCTV, Mobile Patrol, Event, Alarm</h3><p><b>CCTV:</b> 4 cameras 1.2M, 8 cameras 2.1M, phone viewing, 1yr warranty. You can watch your home or shop from your phone anywhere in Uganda. We install, we teach you, we maintain.</p><p style={{marginTop:'10px'}}><b>Mobile Patrol:</b> Patrol car visits 3x night. Good if you cannot afford a full-time guard. Our car checks your gate, lights, windows, and calls you if anything is wrong.</p><p style={{marginTop:'10px'}}><b>Event Security:</b> 40k per guard per day. Weddings, concerts, church crusades, conferences — we control gate, parking, VIP, and crowd. Smart, polite, strong.</p><p style={{marginTop:'10px'}}><b>Alarm:</b> 650k installed, calls 3 numbers. If thief enters, alarm rings and calls you, control room, and your neighbour. Quick response.</p><p style={{marginTop:'10px'}}>Call 0776971970 for a free quote. We will advise honestly — if CCTV alone is enough, we will tell you. If you need guard + CCTV, we will tell you. No forcing.</p></div>
      <div className="card"><h3>5. Hotel & Corporate Security — Serena Standard</h3><p>Hotels need polite, clean, smart guards who greet guests, check bags politely, control parking, and protect VIPs without disturbing guests. That is the Serena standard we learned at Serena Hotel in Kigo. We bring that same standard to your hotel, apartment, office, or NGO. Guards are trained in customer care, English, and confidentiality. No shouting, no rudeness, no sleeping.</p></div>
      <div className="card gold"><h3>6. Escort & Cash / VIP Protection</h3><p>We escort cash, goods, and VIPs from one place to another with trained officers and radio communication to control room. Safe, discreet, on time. For banks, SACCOs, supermarkets, and business people moving money or valuable goods. Call control room to plan.</p></div>
    </div>
  )
}

const MissionPage = () => {
  return (
    <div className="section">
      <h2>Our Mission, Vision, Values</h2>
      <p style={{textAlign:'center', marginBottom:'18px', fontSize:'18px'}}>We do not just guard buildings. We guard lives, families, businesses, and dreams. That is our mission every day and every night.</p>
      <div className="mission-grid">
        <div className="mission-card"><h3>Our Mission</h3><p>To provide professional, affordable, disciplined security with 24/7 control room, trained guards, patrol, CCTV. We ensure all guards get free food & accommodation.</p><p style={{marginTop:'10px'}}><b>What this means in real life:</b> When you sleep, our guard is awake. When you travel, our guard is at your gate. When thieves try at 2am, our guard, our supervisor, and our control room respond together. We answer the phone in 10 seconds, we send patrol in 10 minutes, we write a report the same day. Affordable means a mama in Muyenga and a big company like UN both get the same discipline — only the price is fair to size.</p><p style={{marginTop:'10px'}}>We also have a mission to our staff: No guard should sleep hungry or homeless while protecting your wealth. That is why we give <b>free food & accommodation to every guard, supervisor and site incharge</b>. A cared-for guard protects you better.</p></div>
        <div className="mission-card gold"><h3>Our Vision 2030</h3><p>To be Uganda's most trusted company by 2030 with 500+ officers, 200+ sites, own training school.</p><p style={{marginTop:'10px'}}><b>How we will get there:</b> Step by step, in Jesus Name. First, keep every current client happy — homes, shops, construction sites, Serena Kigo. Second, open our own training school at Muyenga HQ so every guard is trained for 2 weeks before deployment, not 2 days. Third, grow to 500 officers who are disciplined, educated, and well-paid. Fourth, add technology — CCTV, GPS patrol, alarm, and control room software — so you can see your guard is present from your phone. We do not want to be the biggest by cheating — we want to be the most trusted by discipline.</p><p style={{marginTop:'10px'}}>By 2030, when Ugandans say “security”, we want them to say “Pinnacle”.</p></div>
        <div className="mission-card dark"><h3>Core Values - DISCIPLINE</h3><div className="values-list"><div><b>D - Discipline:</b> On time, smart uniform, OB book, no phone on duty, no sleeping.</div><div><b>I - Integrity:</b> We do not steal, we do not lie, we do not take bribes. If a guard steals, we remove him and report to police.</div><div><b>S - Service:</b> We serve you politely — greet, help, open gate, carry bag. Security with a smile.</div><div><b>C - Courage:</b> We do not run when thieves come. We call control, we raise alarm, we protect.</div><div><b>P - Professionalism:</b> Trained, uniformed, radio, report — same standard as UN and Serena.</div><div><b>L - Loyalty:</b> Loyal to you, loyal to Pinnacle, loyal to God.</div><div><b>I - Innovation:</b> CCTV, patrol, phone reporting — we grow with technology.</div><div><b>N - No Fees:</b> No recruitment fees. No hidden fees. Fair price, clear receipt.</div><div><b>E - Excellence:</b> Every night, every site, excellence — not sometimes, always.</div></div><p style={{marginTop:'10px', color:'#ffcc00', fontWeight:800}}>DISCIPLINE is not a word on the wall — it is our daily life.</p></div>
      </div>
      <div className="card" style={{marginTop:'16px'}}><h3>Our Promise To You</h3><p>If you give us your home, your shop, your construction, your hotel — we will protect it as if it is our own. If we fail, we will tell you, we will fix it, we will replace the guard. That is our promise, in Jesus Name. Call <b>0776971970</b> and test us with a Free Site Survey.</p></div>
    </div>
  )
}

const Blog = () => {
  return (
    <div className="section">
      <div className="memo-clean">
        <div className="memo-head"><h2>INTERNAL MEMO - PINNACLE SECURITY LTD</h2><p><b>From:</b> HR Manager | <b>To:</b> All Applicants | <b>Date:</b> {new Date().toLocaleDateString()} | <b>Ref:</b> PSL/HR/2026/08</p><p><b>Subject: URGENT RECRUITMENT - SITE INCHARGE, SUPERVISOR, SECURITY OFFICER - FREE FOOD & ACCOMMODATION - NO FEES</b></p></div>
        <div className="memo-body-dark">
          <div className="memo-intro">Management approved urgent recruitment of 30 officers. <b>All positions come with free food & accommodation + attractive salary + free training + uniform. No Fees. Interview daily at 8am at Muyenga HQ.</b><p style={{marginTop:'10px'}}>Please read this full memo carefully before you come. It explains training, interviewing, and what happens after you are selected. Do not pay anyone any money. Pinnacle never charges recruitment fees — if someone asks you for money, report him to 0776971970 immediately.</p></div>
          <Dropdown title="POSITION 1: SITE INCHARGE - 5 Posts" color="#ffcc00"><div style={{color:'#0a1931', textAlign:'left'}}><p><b>Benefits:</b> Attractive salary + Free Food & Accommodation + Motorcycle + Fuel + Airtime</p><p style={{marginTop:'8px'}}><b>Requirements:</b> UCE and above, 3+ years as supervisor or guard, can read/write English, can manage 5-15 guards, can write OB and daily report, disciplined, no criminal record.</p><p style={{marginTop:'8px'}}><b>Work:</b> You are the boss on site. Roster, OB, client handling, guard discipline, daily report to control room.</p></div></Dropdown>
          <Dropdown title="POSITION 2: SUPERVISOR - 10 Posts" color="#0a1931"><div style={{color:'#0a1931', textAlign:'left'}}><p><b>Benefits:</b> Attractive salary + Free Food & Accommodation + Motorcycle + Fuel + Airtime</p><p style={{marginTop:'8px'}}><b>Requirements:</b> UACE and above, Rider Permit, 3+ years experience, can ride motorcycle, can do night checks, can write reports.</p><p style={{marginTop:'8px'}}><b>Work:</b> You move on motorcycle between 5-10 sites, check guards day and night, do surprise checks, solve problems, report to HR.</p></div></Dropdown>
          <Dropdown title="POSITION 3: SECURITY OFFICER - 50 Posts" color="#0a1931"><div style={{color:'#0a1931', textAlign:'left'}}><p><b>Benefits:</b> Attractive salary + Free Food & Accommodation + NSSF + Insurance + Uniform + Training</p><p style={{marginTop:'8px'}}><b>Requirements:</b> P7 and above, 18+ years, physically fit, disciplined, can read/write, no criminal record.</p><p style={{marginTop:'8px'}}><b>Work:</b> Guard homes, shops, construction sites, hotels. Gate control, OB book, patrol, radio reporting.</p></div></Dropdown>
          <div className="card" style={{marginTop:'16px', background:'#fff', color:'#0a1931'}}><h3 style={{color:'#0a1931'}}>🟡 TRAINING / INTERVIEWING — SUPERVISOR IS ON PROGRESS</h3><p><b>Please note:</b> Training and interviewing for <b>Supervisor</b> is currently <b>ON PROGRESS</b>. That means we are still interviewing supervisors, still checking documents, still doing aptitude test and practical, and still selecting the best candidates. If you applied for Supervisor, please be patient — HR will call you.</p><p style={{marginTop:'10px'}}><b>How Training & Interviewing Works — Step by Step (For All Positions):</b></p><p style={{marginTop:'8px'}}><b>Step 1 — Application:</b> Apply online on this website (Apply Now) OR walk to Muyenga HQ at 8am with your National ID, CV, academic papers, and 2 passport photos. No fees.</p><p style={{marginTop:'8px'}}><b>Step 2 — Interview (Same Day or Next Day):</b> HR interviews you at Muyenga HQ. We ask about your experience, your home district, your health, your discipline, and why you want to join Pinnacle. For Supervisor, the interview is longer — we ask how you would manage 10 guards, how you would handle a guard sleeping on duty, how you would handle a thief, how you would write a report. Be honest. Be disciplined. Come smart and early.</p><p style={{marginTop:'8px'}}><b>Step 3 — Aptitude Test:</b> You must do the Online Aptitude Test on this website (see Aptitude Test section). It tests English, maths, reasoning, discipline, and security knowledge. You need to pass to continue. Do not fear — if you studied P7-UACE, you can pass. We explain the test fully below.</p><p style={{marginTop:'8px'}}><b>Step 4 — Document Check & Medical:</b> We check your National ID, LC letter, academic papers, and police clearance if available. We check you are fit to stand, walk, and do night duty.</p><p style={{marginTop:'8px'}}><b>Step 5 — Training (2 Weeks, FREE at Muyenga HQ):</b> If you pass interview + aptitude, you enter FREE training for 2 weeks. Training covers: discipline, parade, OB book, radio call, gate control, patrol, first aid, fire, customer care, CCTV basics, and how to handle thieves, visitors, and police. You get free food & accommodation during training. If you fail discipline in training, you will not be deployed — discipline is everything at Pinnacle.</p><p style={{marginTop:'8px'}}><b>Step 6 — Deployment:</b> After training, we deploy you to a site — home, shop, construction, hotel, or highway site — with uniform, baton, torch, radio. Supervisor will visit you, control room will call you, and you start earning salary + free food & accommodation.</p><p style={{marginTop:'10px'}}><b>For Supervisor Applicants — Special Note:</b> Supervisor training/interviewing is still on progress because Supervisor is a leadership post. We cannot rush it. We need riders who can manage people, not just ride. If you have not been called yet, it does NOT mean you failed. Keep your phone on, keep checking, and come for interview if HR calls you. Do not pay any broker — come direct to Muyenga HQ.</p><p style={{marginTop:'10px'}}><b>Interview Days:</b> Monday to Saturday, 8am, Plot 442 & 443 Massionatees, Muyenga Hill. Bring ID + papers. No fees. God bless you — in Jesus Name, your job is coming.</p></div>
        </div>
      </div>
    </div>
  )
}

const Aptitude = () => (
  <div className="section">
    <h2>Online Aptitude Test - Must for All Applicants</h2>
    <p style={{textAlign:'center', marginBottom:'18px', fontSize:'18px'}}>Every applicant MUST do this test. No test = No job. The test is FREE, it is online, and you can do it from your phone. Read this full explanation before you start.</p>
    <div className="card"><h3>What Is Aptitude Test? Why Must You Do It?</h3><p>Aptitude test is a short exam that shows us if you can think, read, write, calculate, and behave like a disciplined security officer. At Pinnacle, a guard does not just stand — he writes OB book, counts materials, checks IDs, calls control room on radio, and reports incidents. If you cannot read English, cannot count cement bags, cannot write a simple report, you will fail on duty and put the client in danger.</p><p style={{marginTop:'10px'}}>That is why UN, Serena, and Entebbe Express Highway all required aptitude. We are not trying to fail you — we are trying to train you and place you where you will succeed. If you pass, we know you are ready for training. If you fail, we will tell you what to improve and you can try again.</p></div>
    <div className="home-grid-3">
      <div className="card"><h3>Step 1: Register</h3><p>First, register your name, phone, position you want (Security Officer / Supervisor / Site Incharge), and district. This helps HR to find your result and call you. Use the same phone number you used in Apply Now.</p><p style={{marginTop:'10px'}}><b>What you need:</b> Phone with internet, National ID number, 20-30 minutes quiet time, pen and paper for rough work.</p><a href={GOOGLE_APTITUDE_REGISTER} target="_blank" rel="noopener noreferrer" className="btn-yellow big" style={{marginTop:'18px', width:'100%', textAlign:'center', display:'block'}}>Register for Test</a></div>
      <div className="card gold"><h3>Step 2: Take Test</h3><p>After registration, click Start Test Now. The test has questions on: <b>1) English</b> — read, write, understand instructions. <b>2) Maths</b> — counting, addition, subtraction, time. Example: If 10 bags of cement came and 3 were used, how many remain? <b>3) Reasoning</b> — what would you do if a thief comes? If a visitor refuses to sign? <b>4) Discipline & Security</b> — OB book, radio, patrol, first aid.</p><p style={{marginTop:'10px'}}><b>Duration:</b> About 20-30 minutes. <b>Rules:</b> Do it alone, do not copy, do not use another person to do it for you. Be honest — we will re-check in interview.</p><a href={KOBO_APTITUDE_TEST} target="_blank" rel="noopener noreferrer" className="btn-yellow big" style={{marginTop:'18px', width:'100%', textAlign:'center', display:'block', background:'#0a1931', color:'#ffcc00'}}>Start Test Now</a></div>
      <div className="card dark"><h3>Step 3: What Happens After Test?</h3><p>1. HR sees your result in the system.<br/>2. If you pass, HR calls you for interview at Muyenga HQ (8am).<br/>3. If you fail, HR will tell you to read more and try again — do not give up.<br/>4. After interview + test, you go for FREE 2-week training.<br/>5. After training, deployment + salary + free food & accommodation.</p><p style={{marginTop:'10px'}}><b>Important Notes:</b><br/>• Test is FREE — never pay anyone.<br/>• All applicants must take test — Officer, Supervisor, Site Incharge.<br/>• Free Food & Accommodation for all who pass and are deployed.<br/>• If network fails, try again — your registration is saved.</p></div>
    </div>
    <div className="card" style={{marginTop:'16px'}}><h3>Tips To Pass — Read Before You Start</h3><p>1. Read every question slowly. 2. Answer in simple, correct English. 3. For maths, use pen and paper — do not guess. 4. For discipline questions, choose the honest, disciplined answer — e.g., if guard sleeps on duty, report to supervisor, do not cover him. 5. Do not rush — you have enough time. 6. Pray before you start — in Jesus Name, you will pass. God bless you.</p></div>
  </div>
)

const Contact = () => {
  const [f, setF] = useState({ fullName: "", email: "", phone: "", service: "", message: "" });
  const [s, setS] = useState(""); const [submitting, setSubmitting] = useState(false);
  const send = async (e) => {
    e.preventDefault(); if(submitting) return; setSubmitting(true); setS("Submitting..."); const ts = getFullDateTime24();
    const payload = { type: 'contact', Type:'contact', FullName: f.fullName, Phone: f.phone, Email: f.email, Service: f.service, Message: f.message, Messages: f.message, Timestamp: ts, timestamp: ts };
    try { await fetch(GOOGLE_SHEET_WEBHOOK, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(payload) }); setS("Thank you! Message received."); setF({ fullName: "", email: "", phone: "", service: "", message: "" }); } catch { setS("Thank you!"); }
    setTimeout(()=>setSubmitting(false),2000);
  };
  return (
    <div className="section"><h2>Contact Us - Free Site Survey</h2>
      <div className="form-2col"><div className="form-left-info">
        <div className="card"><h3>Visit Us - Muyenga HQ</h3><p>Plot 442 & 443 Massionatees, Muyenga Hill, Kampala</p><p>Control Room 24/7: 0776971970</p></div>
      </div>
        <form className="form-big" onSubmit={send}>
          <div className="two-col"><input value={f.fullName} onChange={e => setF(Object.assign({}, f, {fullName: e.target.value}))} required placeholder="Fullname" /><input value={f.phone} onChange={e => setF(Object.assign({}, f, {phone: e.target.value}))} required placeholder="Phone" /></div>
          <div className="two-col"><input type="email" value={f.email} onChange={e => setF(Object.assign({}, f, {email: e.target.value}))} required placeholder="Email" />
            <select value={f.service} onChange={e => setF(Object.assign({}, f, {service: e.target.value}))} required>
              <option value="">Choose Service</option>
              <option>Security Guard Service</option>
              <option>Construction Security</option>
              <option>CCTV Installation</option>
              <option>Mobile Patrol</option>
            </select>
          </div>
          <textarea rows="5" value={f.message} onChange={e => setF(Object.assign({}, f, {message: e.target.value}))} required placeholder="Message"></textarea>
          <button className="big-btn" disabled={submitting} style={{opacity:submitting?0.6:1}}>{submitting?'Sending...':'Submit'}</button>{s && <p className="msg">{s}</p>}
        </form>
      </div>
    </div>
  )
}

const Join = () => {
  const [f, setF] = useState({ fullName: "", phone: "", email: "", education: "", experience: "", interest: "", position: "SECURITY OFFICER", district: "" });
  const [s, setS] = useState(""); const [submitting, setSubmitting] = useState(false);
  const send = async (e) => {
    e.preventDefault(); if(submitting) return; setSubmitting(true); setS("Submitting..."); const ts = getFullDateTime24();
    const payload = { type: 'applicant', Type:'applicant', FullName: f.fullName, Phone: f.phone, Email: f.email, Education: f.education, Experience: f.experience, Interest: f.interest, Position: f.position, District: f.district, Timestamp: ts, timestamp: ts };
    try { await fetch(GOOGLE_SHEET_WEBHOOK, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(payload) }); setS("Thank you! Application received."); setF({ fullName: "", phone: "", email: "", education: "", experience: "", interest: "", position: "SECURITY OFFICER", district: "" }); } catch { setS("Thank you!"); }
    setTimeout(()=>setSubmitting(false),2000);
  };
  return (
    <div className="section"><h2>Apply Now - Free Food & Accommodation + Attractive Salary</h2>
      <form className="form-big" onSubmit={send}>
        <div className="two-col"><div><label>Full Name *</label><input value={f.fullName} onChange={e => setF(Object.assign({}, f, {fullName: e.target.value}))} required placeholder="e.g., John Okello" /></div><div><label>Phone *</label><input value={f.phone} onChange={e => setF(Object.assign({}, f, {phone: e.target.value}))} required placeholder="e.g., 0776971970" /></div></div>
        <div className="two-col"><div><label>Email *</label><input type="email" value={f.email} onChange={e => setF(Object.assign({}, f, {email: e.target.value}))} required placeholder="e.g., john@gmail.com" /></div><div><label>Education *</label><select value={f.education} onChange={e => setF(Object.assign({}, f, {education: e.target.value}))} required><option value="">Choose Education</option><option>P7</option><option>UCE</option><option>UACE</option><option>Diploma</option><option>Degree</option></select></div></div>
        <div className="two-col"><div><label>Position *</label><select value={f.position} onChange={e => setF(Object.assign({}, f, {position: e.target.value}))} required><option>SECURITY OFFICER</option><option>SITE INCHARGE</option><option>SUPERVISOR</option></select></div><div><label>District *</label><input value={f.district} onChange={e => setF(Object.assign({}, f, {district: e.target.value}))} required placeholder="e.g., Kampala" /></div></div>
        <div className="two-col"><div><label>Why Interested? *</label><input value={f.interest} onChange={e => setF(Object.assign({}, f, {interest: e.target.value}))} required placeholder="" /></div><div><label>Experience *</label><input value={f.experience} onChange={e => setF(Object.assign({}, f, {experience: e.target.value}))} required placeholder="e.g., 3yrs as guard" /></div></div>
        <button className="big-btn" disabled={submitting} style={{opacity:submitting?0.6:1}}>{submitting?'Submitting...':'Submit Application'}</button>{s && <p className="msg">{s}</p>}
      </form>
    </div>
  )
}

const Footer = () => {
  const scrollTo = (id) => { const el = document.getElementById(id); if (el) { const offset = 75; const top = el.getBoundingClientRect().top + window.scrollY - offset; window.scrollTo({ top, behavior: 'smooth' }); } };
  return (
    <div className="footer"><div className="footer-quick"><h4>Quick Links - Free Food & Accommodation + Attractive Salary</h4><div className="footer-links"><a onClick={() => scrollTo('home')}>Home</a><a onClick={() => scrollTo('about')}>About</a><a onClick={() => scrollTo('services')}>Services</a><a onClick={() => scrollTo('mission')}>Mission</a><a onClick={() => scrollTo('jobs')}>Jobs</a><a onClick={() => scrollTo('aptitude')}>Aptitude Test</a><a onClick={() => scrollTo('contact')}>Contact</a><a onClick={() => scrollTo('join')}>Apply Now</a><a href="/admin" style={{background:'#ffcc00', color:'#0a1931'}}>Admin</a></div></div><div className="footer-bottom">© 2026 Pinnacle Security Ltd | Plot 442 & 443 Massionatees, Muyenga | HR: hr@pinnaclegroup.co.ug | Control 24/7: 0776971970 | UN 2013-2025 • Entebbe Express Highway • Serena Hotel Kigo</div></div>
  )
}

const MainSite = () => (
  <>
    <style>{`
      *{margin:0;padding:0;box-sizing:border-box; font-family: Arial, Helvetica, sans-serif}
      html{scroll-behavior:smooth}
      body{font-family: Arial, Helvetica, sans-serif; background:#f4f6f9; line-height:1.8; overflow-x:hidden; padding-top:75px; font-size:17px}
      .nav{background:#0a1931; padding:16px 18px; position:fixed; top:0; left:0; right:0; width:100%; z-index:9999; box-shadow:0 4px 12px rgba(0,0,0,0.3)}
      .nav-top{display:flex; justify-content:space-between; align-items:center}.logo{color:#ffcc00; font-weight:900; font-size:18px}.menu-btn{color:#fff; font-size:28px; cursor:pointer; display:none}.links{display:flex; gap:12px; align-items:center; justify-content:center; flex-wrap:wrap}.links a{color:#fff; text-decoration:none; font-size:16px; font-weight:700; padding:8px 12px; cursor:pointer}
      .btn-yellow{background:#ffcc00; color:#0a1931; padding:11px 20px; border-radius:25px; font-weight:900; border:none; cursor:pointer; text-decoration:none; display:inline-block; font-size:16px}.btn-yellow.big{padding:16px 28px; font-size:18px}
      .hero{background:linear-gradient(135deg,#0a1931,#1e3a8a); color:#fff; padding:40px 18px; text-align:center; border-radius:0 0 20px 20px}.hero h1{color:#ffcc00; font-size:28px; margin-bottom:12px; font-weight:900}.hero p{font-size:18px}.dots{margin:14px 0}.dot{width:12px; height:12px; background:#555; border-radius:50%; display:inline-block; margin:0 6px; cursor:pointer}.dot.on{background:#ffcc00}
      .section{padding:22px 14px; max-width:1280px; margin:auto}.section h2{text-align:center; color:#0a1931; border-bottom:4px solid #ffcc00; padding-bottom:10px; margin-bottom:18px; font-size:26px; font-weight:900}
      .card{background:#fff; padding:20px; border-radius:14px; margin-bottom:16px; box-shadow:0 4px 12px rgba(0,0,0,0.06); border-left:6px solid #0a1931; font-size:17px; line-height:1.8; color:#0a1931}.card.gold{border-left-color:#ffcc00; background:#fffbeb}.card.dark{background:linear-gradient(135deg,#1e293b,#0f172a); color:#fff; border-left-color:#ffcc00}.card h3{font-size:20px; margin-bottom:12px; color:#0a1931; font-weight:900}.card.dark h3{color:#ffcc00}
      .home-grid-3{display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px} @media(max-width:900px){.home-grid-3{grid-template-columns:1fr}}
      .about-hero{background:linear-gradient(135deg,#0a1931,#1e3a8a); color:#fff; padding:24px; border-radius:16px; margin-bottom:18px; border:2px solid #ffcc00}.about-hero h3{color:#ffcc00; font-size:24px; margin-bottom:16px; text-align:center; font-weight:900}.about-hero p{margin-bottom:18px; line-height:1.9; color:#fff; font-size:17px; background:rgba(255,255,255,0.07); padding:14px; border-radius:10px}
      .form-big{max-width:900px; margin:18px auto; background:#fff; padding:24px; border-radius:16px; display:flex; flex-direction:column; gap:16px; box-shadow:0 6px 20px rgba(0,0,0,0.08)}.form-big input,.form-big select,.form-big textarea{padding:16px; border:2px solid #0a1931; border-radius:10px; font-size:17px; width:100%; background:#ffffff; color:#0a1931}.form-big label{font-size:15px; font-weight:800; color:#0a1931; margin-bottom:4px; display:block}.two-col{display:grid; grid-template-columns:1fr 1fr; gap:16px} @media(max-width:700px){.two-col{grid-template-columns:1fr}}.form-2col{display:grid; grid-template-columns:300px 1fr; gap:18px} @media(max-width:900px){.form-2col{grid-template-columns:1fr}}.big-btn{background:#0a1931; color:#ffcc00; padding:18px; border:none; border-radius:12px; font-weight:900; cursor:pointer; font-size:19px}.msg{padding:14px; background:#d4edda; border-radius:10px; font-size:16px; text-align:center; font-weight:700}
      .footer{background:#0a1931; color:#aaa; text-align:center; padding:0; font-size:13px; margin-top:24px; line-height:1.8}.footer-quick{background:#0f2040; padding:20px 18px; border-bottom:1px solid #1e3a5f}.footer-quick h4{color:#ffcc00; font-size:16px; font-weight:900; margin-bottom:12px; letter-spacing:1px}.footer-links{display:flex; gap:14px; justify-content:center; flex-wrap:wrap}.footer-links a{color:#fff; text-decoration:none; font-size:14px; font-weight:700; padding:6px 12px; border:1px solid #1e3a5f; border-radius:20px; transition:all 0.2s; cursor:pointer}.footer-links a:hover{background:#ffcc00; color:#0a1931; border-color:#ffcc00}.footer-bottom{padding:18px; background:#0a1931}
      @media(max-width:850px){.menu-btn{display:block}.links{display:none; flex-direction:column; align-items:flex-start; padding-top:14px}.links.show{display:flex} body{padding-top:68px}}
      .mission-grid{display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px} @media(max-width:900px){.mission-grid{grid-template-columns:1fr}}.mission-card{background:#fff; padding:18px; border-radius:12px; border-left:5px solid #0a1931}.mission-card.gold{border-left-color:#ffcc00; background:#fffbeb}.mission-card.dark{background:linear-gradient(135deg,#1e293b,#0f172a); color:#fff; border-left-color:#ffcc00}.values-list div{margin-bottom:8px; font-size:15px}
      .memo-clean{max-width:1000px; margin:auto}.memo-head{background:#fff; padding:16px; border-radius:12px 12px 0 0; border:2px solid #0a1931; border-bottom:none; text-align:center}.memo-head h2{font-size:18px; border:none; margin-bottom:8px}.memo-body-dark{background:linear-gradient(135deg,#1e293b,#0f172a); color:#fff; padding:18px; border-radius:0 0 12px 12px}.memo-intro{background:rgba(255,255,255,0.08); padding:12px; border-radius:8px; margin-bottom:14px}.general-box{background:#fff; color:#0a1931; padding:14px; border-radius:10px; text-align:center; margin-bottom:14px; border:2px dashed #0a1931}.big-recruit-btn{background:#ffcc00; color:#0a1931; padding:12px 20px; border-radius:25px; font-weight:900; display:inline-block; margin-top:10px; text-decoration:none}
    `}</style>
    <Navbar />
    <div id="home"><Home /></div>
    <div id="about"><About /></div>
    <div id="services"><Services /></div>
    <div id="mission"><MissionPage /></div>
    <div id="jobs"><Blog /></div>
    <div id="aptitude"><Aptitude /></div>
    <div id="contact"><Contact /></div>
    <div id="join"><Join /></div>
    <Footer />
  </>
)

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => { if (window.location.pathname === '/admin') setIsAdmin(true); }, []);
  return isAdmin ? <AdminDashboard /> : <MainSite />
}
export default App;