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

/* ================= ADMIN - YOUR CODE UNCHANGED, ONLY dark KEPT ================= */
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
      setLoading(false); delete window[cbName];
      const sc = document.getElementById("psl_jsonp"); if(sc) sc.remove();
    };
    const s = document.createElement("script"); s.id = "psl_jsonp";
    s.src = GOOGLE_SHEET_WEBHOOK + "?callback=" + cbName + "&cache=" + Date.now();
    s.onerror = () => { setLoading(false); delete window[cbName]; const sc = document.getElementById("psl_jsonp"); if(sc) sc.remove(); showToast("Load failed - check Apps Script Anyone"); };
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

/* ================= NAVBAR - THEME ADDED HERE ONLY ================= */
const Navbar = ({ theme, toggleTheme }) => {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(null);
  const scrollTo = (id) => { setOpen(false); setHover(null); const el = document.getElementById(id); if (el) { const offset = 75; const top = el.getBoundingClientRect().top + window.scrollY - offset; window.scrollTo({ top, behavior: 'smooth' }); } };
  const dropWrap = {position:'relative'};
  const dropBtn = (active) => ({color: active ? '#ffcc00' : '#fff', textDecoration:'none', fontSize:'16px', fontWeight:700, padding:'8px 12px', cursor:'pointer', display:'inline-block'});
  const mega = {position:'absolute', top:'100%', left:'50%', transform:'translateX(-50%)', width:'860px', maxWidth:'92vw', background:'#fff', borderRadius:'14px', boxShadow:'0 14px 35px rgba(0,0,0,0.25)', padding:'22px', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'20px', zIndex:10000, textAlign:'left'};
  const colTitle = {color:'#0a1931', fontSize:'13px', fontWeight:900, borderBottom:'3px solid #ffcc00', paddingBottom:'6px', marginBottom:'10px', letterSpacing:'0.5px'};
  const colLink = {display:'block', color:'#333', fontSize:'14px', fontWeight:700, padding:'8px 6px', cursor:'pointer', borderRadius:'8px'};
  const colDesc = {display:'block', color:'#777', fontSize:'12px', fontWeight:400, lineHeight:'1.4'};
  return (
    <nav className="nav"><div className="nav-top"><span className="logo">PINNACLE SECURITY LTD</span><span className="menu-btn" onClick={() => setOpen(!open)}>{open ? 'X' : 'M'}</span></div>
      <div className={'links '+(open ? 'show' : '')}>
        <a onClick={() => scrollTo('home')}>Home</a>
        <div style={dropWrap} onMouseEnter={()=>setHover('about')} onMouseLeave={()=>setHover(null)}>
          <span style={dropBtn(hover==='about')} onClick={()=>scrollTo('about')}>About ▼</span>
          {hover==='about' && (<div style={mega}><div><div style={colTitle}>ABOUT PINNACLE</div><span style={colLink} onClick={()=>scrollTo('about')}>About Pinnacle <span style={colDesc}>Since 2009, 150+ officers, 60+ sites, UN 2013-2025, Serena Kigo</span></span><span style={colLink} onClick={()=>scrollTo('about')}>Our History & Welfare <span style={colDesc}>Free Food & Accommodation for all staff, started 2009 with 5 guards</span></span><span style={colLink} onClick={()=>scrollTo('about')}>Our Numbers <span style={colDesc}>150+ officers, 15 motorcycles, 3 patrol cars, 24/7 control</span></span></div><div><div style={colTitle}>MISSION & VALUES</div><span style={colLink} onClick={()=>scrollTo('mission')}>Mission, Vision, Values <span style={colDesc}>DISCIPLINE - Our daily life, Vision 2030</span></span><span style={colLink} onClick={()=>scrollTo('mission')}>Why Clients Trust Us <span style={colDesc}>24/7 Control Room, 10-Min Response, Replacement Guarantee</span></span><span style={colLink} onClick={()=>scrollTo('mission')}>Our Promise To You <span style={colDesc}>We protect it as if it is our own</span></span></div><div><div style={colTitle}>BIG CLIENTS</div><span style={colLink} onClick={()=>scrollTo('about')}>United Nations (UN) <span style={colDesc}>2013 to 2025 - 12 years, offices, warehouses, residences</span></span><span style={colLink} onClick={()=>scrollTo('about')}>Entebbe Express Highway <span style={colDesc}>Toll areas, materials, equipment, workers day & night</span></span><span style={colLink} onClick={()=>scrollTo('about')}>Serena Hotel - Still in Kigo <span style={colDesc}>5-star standard, polite, smart, confidential</span></span></div></div>)}
        </div>
        <div style={dropWrap} onMouseEnter={()=>setHover('services')} onMouseLeave={()=>setHover(null)}>
          <span style={dropBtn(hover==='services')} onClick={()=>scrollTo('services')}>Services ▼</span>
          {hover==='services' && (<div style={mega}><div><div style={colTitle}>🛡️ GUARDING</div><span style={colLink} onClick={()=>scrollTo('services')}>Security Guard Service <span style={colDesc}>Homes, Shops, Offices - Day / Night, 1-4 guards per shift</span></span><span style={colLink} onClick={()=>scrollTo('services')}>Site Incharge & Supervisor <span style={colDesc}>Manages 5-15 guards, roster, OB, client handling</span></span><span style={colLink} onClick={()=>scrollTo('services')}>Construction Site Security <span style={colDesc}>Stop cement, iron bars, timber, fuel theft - count morning & evening</span></span></div><div><div style={colTitle}>📹 TECHNOLOGY</div><span style={colLink} onClick={()=>scrollTo('services')}>CCTV Installation <span style={colDesc}>4 cameras 1.2M, 8 cameras 2.1M, phone viewing, 1yr warranty</span></span><span style={colLink} onClick={()=>scrollTo('services')}>Mobile Patrol <span style={colDesc}>Patrol car visits 3x night, checks gate, lights, windows</span></span><span style={colLink} onClick={()=>scrollTo('services')}>Alarm Systems <span style={colDesc}>650k installed, calls 3 numbers, quick response</span></span></div><div><div style={colTitle}>⭐ SPECIAL</div><span style={colLink} onClick={()=>scrollTo('services')}>Hotel & Corporate - Serena Standard <span style={colDesc}>Polite, clean, 5-star service, customer care</span></span><span style={colLink} onClick={()=>scrollTo('services')}>Event Security <span style={colDesc}>40k per guard per day - weddings, concerts, crusades</span></span><span style={colLink} onClick={()=>scrollTo('services')}>Escort & VIP Protection <span style={colDesc}>Cash, goods, VIP escort - safe, discreet, on time</span></span></div></div>)}
        </div>
        <div style={dropWrap} onMouseEnter={()=>setHover('career')} onMouseLeave={()=>setHover(null)}>
          <span style={dropBtn(hover==='career')} onClick={()=>scrollTo('jobs')}>Career ▼</span>
          {hover==='career' && (<div style={mega}><div><div style={colTitle}>💼 JOBS - WE ARE HIRING</div><span style={colLink} onClick={()=>scrollTo('jobs')}>Site Incharge - 5 Posts <span style={colDesc}>UCE + 3yrs + Free Food & Accommodation + Motorcycle</span></span><span style={colLink} onClick={()=>scrollTo('jobs')}>Supervisor - 10 Posts <span style={colDesc}>UACE + Rider Permit + 3yrs, training on progress</span></span><span style={colLink} onClick={()=>scrollTo('jobs')}>Security Officer - 50 Posts <span style={colDesc}>P7 & above, Free Food & Accommodation + NSSF + Insurance</span></span></div><div><div style={colTitle}>📝 APPLY & TEST</div><span style={colLink} onClick={()=>scrollTo('aptitude')}>Aptitude Test <span style={colDesc}>Must for all applicants - FREE online, 20-30 mins</span></span><span style={colLink} onClick={()=>scrollTo('join')}>Apply Now <span style={colDesc}>No Fees - Interview daily 8am Muyenga HQ</span></span><span style={colLink} onClick={()=>scrollTo('jobs')}>Training - 2 Weeks FREE <span style={colDesc}>At Muyenga HQ, discipline + OB + radio + first aid</span></span></div><div><div style={colTitle}>🎓 GROW WITH US</div><span style={colLink} onClick={()=>scrollTo('jobs')}>Interview Process <span style={colDesc}>Same day / next day, bring ID + CV + papers + 2 photos</span></span><span style={colLink} onClick={()=>scrollTo('jobs')}>Deployment <span style={colDesc}>After training, uniform + baton + torch + radio, start earning</span></span><span style={colLink} onClick={()=>scrollTo('contact')}>Contact HR <span style={colDesc}>0776971970 - hr@pinnaclegroup.co.ug, Muyenga HQ</span></span></div></div>)}
        </div>
        <a onClick={() => scrollTo('mission')}>Mission</a>
        <a onClick={() => scrollTo('jobs')}>Jobs</a>
        <a onClick={() => scrollTo('aptitude')}>Aptitude Test</a>
        <a onClick={() => scrollTo('contact')}>Contact</a>
        <a onClick={() => scrollTo('join')} className="btn-yellow">Apply Now</a>
        <a href="/admin" style={{color:'#ffcc00', fontWeight:'900', border:'1px solid #ffcc00', borderRadius:'20px'}}>Admin</a>
        {/* THEME BUTTON - NEXT TO ADMIN */}
        <button onClick={toggleTheme} style={{background: theme==='dark' ? '#ffcc00' : 'transparent', color: theme==='dark' ? '#0a1931' : '#ffcc00', border:'1px solid #ffcc00', padding:'8px 14px', borderRadius:'20px', fontWeight:900, cursor:'pointer'}}>
          {theme==='dark' ? '☀️ Light' : '🌙 Dark'}
        </button>
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
          <div className="card"><h3>Who We Are - Licensed & Trusted</h3><p>Pinnacle Security Ltd is a fully licensed private security company at <b>Plot 442 & 443 Massionatees, Muyenga Hill</b>. Since 2009, we have grown to 60+ sites and 150+ trained officers. We provide <b>free food and accommodation</b> to all guards, supervisors and site incharges.</p><p style={{marginTop:'10px'}}>We have served big national clients including the <b>United Nations (UN) from 2013 to 2025</b>, the <b>Entebbe Express Highway</b>, and <b>Serena Hotel</b>. We are proud of that history, and we continue to serve with the same discipline today.</p><p style={{marginTop:'10px'}}><b>More Explanation:</b> Being licensed means we are registered and approved by Uganda Police to operate as a private security company. We are not a briefcase company. You can visit our headquarters in Muyenga, see our control room, meet our managers, and check our files.</p></div>
          <div className="card gold"><h3>Core Services</h3><p><b>Guard Service:</b> Day/night guards for homes, shops, offices — with free food & accommodation</p><p><b>Site Incharge & Supervisor:</b> Experienced managers with motorcycle + free food & accommodation</p><p><b>Construction Security:</b> Protect cement, iron bars, timber, fuel</p><p><b>CCTV, Mobile Patrol, Alarm:</b> Affordable packages</p><p style={{marginTop:'10px'}}><b>More Explanation:</b> Each service is explained in full on the Services page. If you are not sure which service you need, call 0776971970 for a Free Site Survey.</p></div>
          <div className="card dark"><h3>URGENT RECRUITMENT - No Fees</h3><p><b>SITE INCHARGE:</b> UCE + 3yrs — Attractive salary + Free Food & Accommodation</p><p style={{marginTop:'10px'}}><b>SUPERVISOR:</b> UACE + Rider Permit + 3yrs — Attractive salary + Free Food & Accommodation</p><p style={{marginTop:'10px'}}><b>SECURITY OFFICER:</b> P7 & above — Attractive salary + Free Food & Accommodation</p><p style={{marginTop:'10px'}}><b>More Explanation:</b> All jobs are real, no fees, and interview is daily at 8am at Muyenga HQ.</p><a onClick={() => document.getElementById('join').scrollIntoView({behavior:'smooth'})} className="btn-yellow big" style={{marginTop:'18px', width:'100%', textAlign:'center', display:'block', cursor:'pointer'}}>Apply Now</a></div>
        </div>
      </div>
    </div>
  )
}

const About = () => {
  return (
    <div className="section">
      <h2>About Pinnacle Security Ltd - Detailed</h2>
      <div className="about-hero"><h3>Pinnacle Security Ltd - Protecting What Matters Most Since 2009</h3><p>Plot 442 & 443 Massionatees, Muyenga Hill, Kampala | Control 24/7: 0776971970 | Free Food & Accommodation For All Staff | No Recruitment Fees</p><p style={{marginTop:'10px'}}>We started small in 2009 with only 5 guards and 1 client. God has grown us step by step. Today we protect homes, businesses, construction sites, hotels and national roads across Uganda.</p></div>
      <div className="home-grid-3">
        <div className="card"><h3>Our History & Welfare</h3><p>Started in 2009 with 5 guards and 1 client. Today 150+ officers, 60+ sites, patrol cars, CCTV team. Licensed by Uganda Police. We provide <b>free food and accommodation</b> to all staff.</p><p style={{marginTop:'10px'}}><b>1. UNITED NATIONS (UN) — 2013 to 2025:</b> For 12 years, our officers guarded UN offices, compounds, warehouses and staff residences.</p><p style={{marginTop:'8px'}}><b>2. ENTEBBE EXPRESS HIGHWAY:</b> Our teams guarded toll areas, construction materials, equipment, and workers day and night.</p><p style={{marginTop:'8px'}}><b>3. SERENA HOTEL:</b> We are still present and still serving in <b>Serena Hotel in Kigo</b>.</p></div>
        <div className="card gold"><h3>Why Clients Trust Us</h3><p>1. <b>24/7 Control Room</b> — Call 0776971970 any time<br/>2. <b>10-Minute Response</b> — Patrol and supervisor rush to your site<br/>3. <b>Free Food & Accommodation For Guards</b> — A guard who is fed and housed does not sleep, does not steal<br/>4. <b>Trained Officers:</b> 2 weeks training at Muyenga HQ<br/>5. <b>Affordable & Disciplined</b> — Clear price, no hidden fees<br/>6. <b>Supervisor Visits 2x Daily</b><br/>7. <b>Replacement Guarantee</b> — If a guard misbehaves, we replace him same day, free.</p></div>
        <div className="card dark"><h3>Our Numbers</h3><p>150+ Active Officers<br/>60+ Protected Sites<br/>15 Motorcycles + 3 Patrol Cars<br/>24/7 Control Room<br/>Free Food & Accommodation For All Staff<br/><br/><b>Major Contracts Served:</b><br/>• UN — 2013 to 2025 (12 Years)<br/>• Entebbe Express Highway<br/>• Serena Hotel — Still in Kigo</p></div>
      </div>
    </div>
  )
}

const Services = () => {
  return (
    <div className="section">
      <h2>Our Security Services - Full Explanation</h2>
      <p style={{textAlign:'center', marginBottom:'18px', fontSize:'18px'}}>We offer 6 main services. All guards get free food & accommodation + attractive salary.</p>
      <div className="card"><h3>1. Security Guard Service - Homes, Shops, Offices</h3><p>What you get: 1-4 guards per shift, uniformed, baton, radio, torch, OB book. Supervisor visits 2x daily, patrol 1x night. Guards get free food & accommodation at site.</p><p style={{marginTop:'10px'}}>How it works: We visit your home or shop FREE, we check gates, walls, lights, and risk. Then we recommend 1 guard day + 1 guard night, or 2 guards if the place is big.</p></div>
      <div className="card gold"><h3>2. Site Incharge & Supervisor Service</h3><p>What you get: Experienced manager manages 5-15 guards, duty roster, OB, client handling. Gets free food & accommodation + motorcycle + fuel + airtime + attractive salary.</p></div>
      <div className="card"><h3>3. Construction Site Security</h3><p>Problem: 30% materials stolen at night. We stop it. Guards count cement, iron bars, check lorries. Guards get free food & accommodation at site.</p></div>
      <div className="card gold"><h3>4. CCTV, Mobile Patrol, Event, Alarm</h3><p><b>CCTV:</b> 4 cameras 1.2M, 8 cameras 2.1M, phone viewing, 1yr warranty.<br/><b>Mobile Patrol:</b> Patrol car visits 3x night.<br/><b>Event Security:</b> 40k per guard per day.<br/><b>Alarm:</b> 650k installed, calls 3 numbers.</p><p style={{marginTop:'10px'}}>Call 0776971970 for a free quote.</p></div>
      <div className="card"><h3>5. Hotel & Corporate Security — Serena Standard</h3><p>Hotels need polite, clean, smart guards who greet guests, check bags politely, control parking, and protect VIPs without disturbing guests. That is the Serena standard we learned at Serena Hotel in Kigo.</p></div>
      <div className="card gold"><h3>6. Escort & Cash / VIP Protection</h3><p>We escort cash, goods, and VIPs from one place to another with trained officers and radio communication to control room. Safe, discreet, on time.</p></div>
    </div>
  )
}

const MissionPage = () => {
  return (
    <div className="section">
      <h2>Our Mission, Vision, Values</h2>
      <p style={{textAlign:'center', marginBottom:'18px', fontSize:'18px'}}>We do not just guard buildings. We guard lives, families, businesses, and dreams.</p>
      <div className="mission-grid">
        <div className="mission-card"><h3>Our Mission</h3><p>To provide professional, affordable, disciplined security with 24/7 control room, trained guards, patrol, CCTV. We ensure all guards get free food & accommodation.</p></div>
        <div className="mission-card gold"><h3>Our Vision 2030</h3><p>To be Uganda's most trusted company by 2030 with 500+ officers, 200+ sites, own training school.</p></div>
        <div className="mission-card dark"><h3>Core Values - DISCIPLINE</h3><div className="values-list"><div><b>D - Discipline:</b> On time, smart uniform, OB book, no phone on duty, no sleeping.</div><div><b>I - Integrity:</b> We do not steal, we do not lie, we do not take bribes.</div><div><b>S - Service:</b> We serve you politely.</div><div><b>C - Courage:</b> We do not run when thieves come.</div><div><b>P - Professionalism:</b> Trained, uniformed, radio, report.</div><div><b>L - Loyalty:</b> Loyal to you, loyal to Pinnacle, loyal to God.</div><div><b>I - Innovation:</b> CCTV, patrol, phone reporting.</div><div><b>N - No Fees:</b> No recruitment fees. No hidden fees.</div><div><b>E - Excellence:</b> Every night, every site, excellence.</div></div><p style={{marginTop:'10px', color:'#ffcc00', fontWeight:800}}>DISCIPLINE is not a word on the wall — it is our daily life.</p></div>
      </div>
    </div>
  )
}

const Blog = () => {
  return (
    <div className="section">
      <div className="memo-clean">
        <div className="memo-head"><h2>INTERNAL MEMO - PINNACLE SECURITY LTD</h2><p><b>From:</b> HR Manager | <b>To:</b> All Applicants | <b>Date:</b> {new Date().toLocaleDateString()} | <b>Ref:</b> PSL/HR/2026/08</p><p><b>Subject: URGENT RECRUITMENT - SITE INCHARGE, SUPERVISOR, SECURITY OFFICER - FREE FOOD & ACCOMMODATION - NO FEES</b></p></div>
        <div className="memo-body-dark">
          <div className="memo-intro">Management approved urgent recruitment of 30 officers. <b>All positions come with free food & accommodation + attractive salary + free training + uniform. No Fees. Interview daily at 8am at Muyenga HQ.</b></div>
          <Dropdown title="POSITION 1: SITE INCHARGE - 5 Posts" color="#ffcc00"><div style={{color:'#0a1931', textAlign:'left'}}><p><b>Benefits:</b> Attractive salary + Free Food & Accommodation + Motorcycle + Fuel + Airtime</p><p style={{marginTop:'8px'}}><b>Requirements:</b> UCE and above, 3+ years as supervisor or guard, can read/write English, can manage 5-15 guards.</p></div></Dropdown>
          <Dropdown title="POSITION 2: SUPERVISOR - 10 Posts" color="#0a1931"><div style={{color:'#0a1931', textAlign:'left'}}><p><b>Benefits:</b> Attractive salary + Free Food & Accommodation + Motorcycle + Fuel + Airtime</p><p style={{marginTop:'8px'}}><b>Requirements:</b> UACE and above, Rider Permit, 3+ years experience, can ride motorcycle, can do night checks.</p></div></Dropdown>
          <Dropdown title="POSITION 3: SECURITY OFFICER - 50 Posts" color="#0a1931"><div style={{color:'#0a1931', textAlign:'left'}}><p><b>Benefits:</b> Attractive salary + Free Food & Accommodation + NSSF + Insurance + Uniform + Training</p><p style={{marginTop:'8px'}}><b>Requirements:</b> P7 and above, 18+ years, physically fit, disciplined, can read/write, no criminal record.</p></div></Dropdown>
          <div className="card" style={{marginTop:'16px', background:'#fff', color:'#0a1931'}}><h3 style={{color:'#0a1931'}}>🟡 TRAINING / INTERVIEWING — SUPERVISOR IS ON PROGRESS</h3><p><b>Please note:</b> Training and interviewing for <b>Supervisor</b> is currently <b>ON PROGRESS</b>. If you applied for Supervisor, please be patient — HR will call you.</p><p style={{marginTop:'10px'}}><b>Step 1 — Application:</b> Apply online OR walk to Muyenga HQ at 8am with National ID, CV, papers, 2 photos. No fees.</p><p style={{marginTop:'8px'}}><b>Step 2 — Interview:</b> HR interviews you at Muyenga HQ.</p><p style={{marginTop:'8px'}}><b>Step 3 — Aptitude Test:</b> You must do the Online Aptitude Test.</p><p style={{marginTop:'8px'}}><b>Step 4 — Document Check & Medical:</b> We check ID, LC letter, papers.</p><p style={{marginTop:'8px'}}><b>Step 5 — Training (2 Weeks, FREE):</b> Discipline, parade, OB book, radio, gate control, patrol, first aid.</p><p style={{marginTop:'8px'}}><b>Step 6 — Deployment:</b> After training, uniform, baton, torch, radio, start earning.</p></div>
        </div>
      </div>
    </div>
  )
}

const Aptitude = () => (
  <div className="section">
    <h2>Online Aptitude Test - Must for All Applicants</h2>
    <p style={{textAlign:'center', marginBottom:'18px', fontSize:'18px'}}>Every applicant MUST do this test. No test = No job. The test is FREE, online, from your phone.</p>
    <div className="card"><h3>What Is Aptitude Test? Why Must You Do It?</h3><p>Aptitude test is a short exam that shows us if you can think, read, write, calculate, and behave like a disciplined security officer. A guard writes OB book, counts materials, checks IDs, calls control room on radio, and reports incidents.</p></div>
    <div className="home-grid-3">
      <div className="card"><h3>Step 1: Register</h3><p>First, register your name, phone, position you want (Security Officer / Supervisor / Site Incharge), and district.</p><a href={GOOGLE_APTITUDE_REGISTER} target="_blank" rel="noreferrer" className="btn-yellow big" style={{display:'block', textAlign:'center', marginTop:'12px'}}>Register Now</a></div>
      <div className="card gold"><h3>Step 2: Do Test</h3><p>Do the test on KoboToolbox. 20-30 mins. English, maths, reasoning, discipline, security knowledge.</p><a href={KOBO_APTITUDE_TEST} target="_blank" rel="noreferrer" className="btn-yellow big" style={{display:'block', textAlign:'center', marginTop:'12px', background:'#0a1931', color:'#ffcc00'}}>Start Test</a></div>
      <div className="card dark"><h3>Step 3: Interview</h3><p>After test, come for interview daily 8am Muyenga HQ with ID, CV, papers, 2 photos. No Fees.</p></div>
    </div>
  </div>
)

const Join = () => {
  const [form, setForm] = useState({FullName:'', Phone:'', Email:'', Position:'Security Officer', District:'', Education:'', Experience:''});
  const [sent, setSent] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    const payload = Object.assign({}, form, {timestamp: getFullDateTime24(), Timestamp: getFullDateTime24(), type:'applicant'});
    try { await fetch(GOOGLE_SHEET_WEBHOOK,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain'},body:JSON.stringify(payload)}); } catch(err){}
    setSent(true);
  };
  return (
    <div className="section" id="join">
      <h2>Apply Now - No Fees</h2>
      <div className="card" style={{maxWidth:'600px', margin:'0 auto'}}>
        {sent ? <p style={{textAlign:'center', fontWeight:900}}>✅ Application Sent! Now do Aptitude Test, then come for interview 8am Muyenga HQ.</p> : (
        <form onSubmit={submit} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
          <input required placeholder="Full Name" value={form.FullName} onChange={e=>setForm({...form, FullName:e.target.value})} style={{padding:'12px', borderRadius:'10px', border:'1px solid #ccc'}} />
          <input required placeholder="Phone e.g 0776971970" value={form.Phone} onChange={e=>setForm({...form, Phone:e.target.value})} style={{padding:'12px', borderRadius:'10px', border:'1px solid #ccc'}} />
          <input placeholder="Email (optional)" value={form.Email} onChange={e=>setForm({...form, Email:e.target.value})} style={{padding:'12px', borderRadius:'10px', border:'1px solid #ccc'}} />
          <select value={form.Position} onChange={e=>setForm({...form, Position:e.target.value})} style={{padding:'12px', borderRadius:'10px'}}><option>Security Officer</option><option>Supervisor</option><option>Site Incharge</option></select>
          <input placeholder="District" value={form.District} onChange={e=>setForm({...form, District:e.target.value})} style={{padding:'12px', borderRadius:'10px', border:'1px solid #ccc'}} />
          <input placeholder="Education e.g UCE, UACE, P7" value={form.Education} onChange={e=>setForm({...form, Education:e.target.value})} style={{padding:'12px', borderRadius:'10px', border:'1px solid #ccc'}} />
          <input placeholder="Experience" value={form.Experience} onChange={e=>setForm({...form, Experience:e.target.value})} style={{padding:'12px', borderRadius:'10px', border:'1px solid #ccc'}} />
          <button type="submit" className="btn-yellow big">Submit Application</button>
        </form>)}
      </div>
    </div>
  )
}

const Contact = () => (
  <div className="section" id="contact">
    <h2>Contact Us</h2>
    <div className="card" style={{textAlign:'center'}}><p><b>Plot 442 & 443 Massionatees, Muyenga Hill, Kampala</b></p><p>Control 24/7: <b>0776971970</b> | Email: <b>hr@pinnaclegroup.co.ug</b></p><p>Interview: Monday - Saturday, 8am, Muyenga HQ. Bring ID + CV + Papers + 2 Photos. No Fees.</p></div>
  </div>
)

/* ================= APP - THEME FIXED AT ONCE ================= */
export default function App(){
  const [theme, setTheme] = useState(() => localStorage.getItem('pinnacle-theme') || 'light');
  useEffect(()=>{ localStorage.setItem('pinnacle-theme', theme); },[theme]);
  const toggleTheme = () => setTheme(t => t==='light' ? 'dark' : 'light');

  if(window.location.pathname === '/admin') return <AdminDashboard />;

  return (
    <div data-theme={theme} style={{background: theme==='dark' ? '#0A1931' : '#f5f5f5', minHeight:'100vh'}}>
      <style>{`
        *{box-sizing:border-box} body{margin:0; font-family:Arial} a{cursor:pointer}
        .nav{background:#0A1931; padding:14px 20px; position:sticky; top:0; z-index:9999}
        .nav-top{display:flex; justify-content:space-between; align-items:center}
        .logo{color:#FFD700; font-weight:900; font-size:20px} .menu-btn{display:none; color:#FFD700; font-size:22px; cursor:pointer}
        .links{display:flex; gap:14px; align-items:center; flex-wrap:wrap; color:#fff; font-weight:700}
        .links a{color:#fff; text-decoration:none}
        .btn-yellow{background:#FFD700; color:#0A1931; padding:10px 18px; border-radius:20px; font-weight:900; border:none; text-decoration:none}
        .btn-yellow.big{padding:12px 24px; font-size:16px}
        .section{max-width:1200px; margin:0 auto; padding:20px}
        .section h2{text-align:center; color:#0A1931; font-size:28px; margin-bottom:18px}
        .hero{background:#1a2f7a; color:#fff; border-radius:16px; padding:36px 20px; text-align:center}
        .hero h1{color:#FFD700; font-size:32px} .hero p{font-size:18px}
        .dots{display:flex; gap:8px; justify-content:center; margin-top:14px} .dot{width:10px; height:10px; border-radius:50%; background:#fff; opacity:.5; cursor:pointer} .dot.on{opacity:1; background:#FFD700}
        .home-grid-3{display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px}
        .card{background:#fff; padding:20px; border-radius:12px; color:#0A1931; line-height:1.7}
        .card.gold{background:#fffbe6} .card.dark{background:#1a1a1a; color:#fff; border-left:4px solid #FFD700}
        .card.dark h3{color:#FFD700}
        .about-hero{background:#fff; padding:20px; border-radius:12px; margin-bottom:16px; text-align:center}
        .mission-grid{display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px}
        .mission-card{background:#fff; padding:20px; border-radius:12px; line-height:1.7} .mission-card.gold{background:#fffbe6} .mission-card.dark{background:#1a1a1a; color:#fff}
        .memo-clean{background:#fff; border-radius:14px; overflow:hidden}
        .memo-head{background:#0A1931; color:#fff; padding:20px} .memo-head h2{color:#FFD700; text-align:left; font-size:20px}
        .memo-body-dark{padding:20px} .memo-intro{margin-bottom:16px}
        @media(max-width:800px){ .home-grid-3,.mission-grid{grid-template-columns:1fr} .menu-btn{display:block} .links{display:none} .links.show{display:flex; flex-direction:column; align-items:flex-start; margin-top:12px} .hero h1{font-size:24px} }
        /* ===== DARK THEME OVERRIDES - BOTH LIGHT & DARK WORK ===== */
        [data-theme="dark"] .section h2{color:#fff !important}
        [data-theme="dark"] .section{color:#fff !important}
        [data-theme="dark"] .card, [data-theme="dark"] .about-hero, [data-theme="dark"] .mission-card, [data-theme="dark"] .memo-clean{ background:#16294a !important; color:#fff !important; border-color:#2a3f66 !important; }
        [data-theme="dark"] .card p, [data-theme="dark"] .card div, [data-theme="dark"] .mission-card p, [data-theme="dark"] .about-hero p{ color:#e0e0e0 !important; }
        [data-theme="dark"] .card h3, [data-theme="dark"] .mission-card h3, [data-theme="dark"] .about-hero h3{ color:#fff !important; }
        [data-theme="dark"] .card.gold, [data-theme="dark"] .mission-card.gold{ background:#2a2a1a !important; color:#fff !important; }
        [data-theme="dark"] .card.dark, [data-theme="dark"] .mission-card.dark{ background:#000 !important; }
        [data-theme="dark"] .memo-head{ background:#000 !important; }
      `}</style>

      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <div id="home"><Home /></div>
      <div id="about"><About /></div>
      <div id="services"><Services /></div>
      <div id="mission"><MissionPage /></div>
      <div id="jobs"><Blog /></div>
      <div id="aptitude"><Aptitude /></div>
      <Join />
      <Contact />
      <div style={{background:'#0A1931', color:'#fff', textAlign:'center', padding:'20px', marginTop:'20px'}}>PINNACLE SECURITY LTD © 2026 | Muyenga HQ | 0776971970 | hr@pinnaclegroup.co.ug | Free Food & Accommodation | No Fees</div>
    </div>
  )
}