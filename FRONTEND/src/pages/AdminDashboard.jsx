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
  
  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(30);

  const login = () => pass === ADMIN_PASSWORD ? setAuth(true) : alert("Wrong Password!");
  const load = () => {
    setLoading(true);
    fetch(GOOGLE_SHEET_WEBHOOK).then(r=>r.json()).then(d=>{
      const arr = Array.isArray(d)?d:[];
      const sorted = arr.sort((a,b)=> new Date(b.timestamp||b.Timestamp||0) - new Date(a.timestamp||a.Timestamp||0));
      setData(sorted); setLoading(false);
    }).catch(()=>setLoading(false));
  };
  useEffect(()=>{ if(auth) load(); },[auth]);
  const getVal = (obj, keys) => { for(let k of keys) if(obj[k]!==undefined && obj[k]!==null && obj[k]!=='') return obj[k]; return ''; }
  const formatDate = (t) => { if(!t) return '-'; try { return new Date(t).toLocaleString(); } catch { return t; } }

  // NO POPUP DELETE
  const handleDelete = async (row) => {
    const ts = getVal(row,['Timestamp','timestamp']);
    setData(prev => prev.filter(r => getVal(r,['Timestamp','timestamp']) !== ts));
    const payload = { action:'delete', timestamp:ts, fullName:getVal(row,['FullName','fullName']), phone:getVal(row,['Phone','phone']), email:getVal(row,['Email','email']), type:tab };
    await fetch(GOOGLE_SHEET_WEBHOOK,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain'},body:JSON.stringify(payload)});
  };

  const handleEdit = (row) => {
    const ts = getVal(row,['Timestamp','timestamp']); setEditRow(ts);
    setForm({ timestamp:ts, FullName:getVal(row,['FullName','fullName']), Phone:getVal(row,['Phone','phone']), Email:getVal(row,['Email','email']), Service:getVal(row,['Service','service']), Messages:getVal(row,['Messages','message']), Position:getVal(row,['Position','position']), Education:getVal(row,['Education','education']), District:getVal(row,['District','district']), Experience:getVal(row,['Experience','experience']), Interest:getVal(row,['Interest','interest']), type:tab });
  };
  const handleSave = async () => {
    const payload = { action:'update', ...form, timestamp:editRow, type:tab };
    setData(prev => prev.map(r => getVal(r,['Timestamp','timestamp'])===editRow?{...r,...form,Timestamp:editRow,timestamp:editRow}:r));
    setEditRow(null);
    await fetch(GOOGLE_SHEET_WEBHOOK,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain'},body:JSON.stringify(payload)});
  };
  const handleAddNew = async () => {
    const ts = new Date().toISOString();
    const payload = { ...form, timestamp:ts, Timestamp:ts, type:tab==='contacts'?'contact':'applicant' };
    setData(prev=>[payload,...prev]); setShowAdd(false); setForm({});
    await fetch(GOOGLE_SHEET_WEBHOOK,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain'},body:JSON.stringify(payload)});
  };

  const unique = (keyArr) => [...new Set(data.map(d=>getVal(d,keyArr)).filter(v=>v))].sort();
  const serviceOptions = unique(['Service','service']);
  const positionOptions = unique(['Position','position']);
  const districtOptions = unique(['District','district']);
  const educationOptions = unique(['Education','education']);
  const experienceOptions = unique(['Experience','experience']);
  const interestOptions = unique(['Interest','interest']);
  const clearFilters = () => { setFilters({service:"",position:"",district:"",education:"",experience:"",interest:"",dateFrom:"",dateTo:""}); setCurrentPage(1); };
  const exportCSV = (rows, filename) => { if(!rows.length) return; const headers = tab==='contacts'?["Timestamp","FullName","Phone","Email","Service","Messages"]:["Timestamp","FullName","Phone","Email","Position","Education","District","Experience","Interest"]; const csv = [headers.join(",")].concat(rows.map(r=> headers.map(h=>`"${String(getVal(r,[h,h.toLowerCase()])||'').replace(/"/g,'""')}"`).join(","))).join("\n"); const blob = new Blob([csv],{type:"text/csv"}); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download=filename; a.click(); };

  if(!auth){
    return (
      <div style={{minHeight:'100vh',background:'radial-gradient(circle at top,#1a2f5c,#0a1931)',display:'flex',justifyContent:'center',alignItems:'center',fontFamily:'Arial'}}>
        <div style={{background:'#fff',padding:'36px',borderRadius:'24px',width:'92%',maxWidth:'400px',textAlign:'center'}}>
          <div style={{width:'56px',height:'56px',background:'#0a1931',borderRadius:'14px',margin:'0 auto 14px',display:'grid',placeItems:'center',color:'#ffcc00',fontSize:'22px',fontWeight:900}}>P</div>
          <h2 style={{fontWeight:900,color:'#0a1931'}}>PINNACLE ADMIN</h2>
          <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Admin Password" style={{width:'100%',padding:'14px 16px',borderRadius:'12px',marginTop:'20px',border:'2px solid #0a1931'}}/>
          <button onClick={login} style={{width:'100%',marginTop:'14px',background:'#ffcc00',padding:'14px',borderRadius:'12px',fontWeight:900,border:'none',cursor:'pointer'}}>UNLOCK</button>
        </div>
      </div>
    )
  }

  const applicants = data.filter(d => (d.type==='applicant') || getVal(d,['Position','position']));
  const contacts = data.filter(d => (d.type==='contact') || getVal(d,['Service','service']));

  const applyFilters = (list) => {
    return list.filter(d=>{
      const s = `${getVal(d,['FullName','fullName'])} ${getVal(d,['Phone','phone'])} ${getVal(d,['Email','email'])} ${getVal(d,['Service','service'])} ${getVal(d,['Messages','message'])} ${getVal(d,['Position','position'])}`.toLowerCase();
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
  };

  const filteredContacts = applyFilters(contacts);
  const filteredApplicants = applyFilters(applicants);
  const list = tab==='contacts'?filteredContacts:filteredApplicants;
  
  // PAGINATION LOGIC
  const totalPages = Math.ceil(list.length / rowsPerPage) || 1;
  const paginatedList = list.slice((currentPage-1)*rowsPerPage, currentPage*rowsPerPage);
  const activeFilterCount = Object.values(filters).filter(v=>v).length;

  useEffect(()=>{ setCurrentPage(1); },[filters, search, tab, rowsPerPage]);

  return (
    <div style={{background:'#f6f8fb',minHeight:'100vh',fontFamily:'Arial'}}>
      <div style={{background:'#0a1931',padding:'18px 24px',display:'flex',justifyContent:'space-between',alignItems:'center',position:'sticky',top:0,zIndex:100,flexWrap:'wrap',gap:'12px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px'}}><div style={{width:'38px',height:'38px',background:'#ffcc00',borderRadius:'10px',display:'grid',placeItems:'center',fontWeight:900}}>P</div><div><h1 style={{color:'#fff',fontWeight:900,fontSize:'14px'}}>PINNACLE SECURITY LTD</h1><p style={{color:'#ffcc00',fontSize:'10px'}}>ADMIN DASHBOARD</p></div></div>
        <div style={{display:'flex',gap:'8px',alignItems:'center',flexWrap:'wrap'}}>
          <div style={{background:'rgba(255,255,255,.08)',borderRadius:'24px',padding:'6px 14px',display:'flex',alignItems:'center'}}><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{background:'transparent',border:'none',outline:'none',color:'#fff',fontSize:'12px',width:'160px'}}/></div>
          <button onClick={()=>setShowFilters(!showFilters)} style={{background:activeFilterCount?'#ffcc00':'#fff',color:'#0a1931',border:'none',padding:'8px 14px',borderRadius:'20px',fontWeight:800,fontSize:'12px',cursor:'pointer'}}>{showFilters?'✕ Filters':`⚙ Filters${activeFilterCount?` (${activeFilterCount})`:''}`}</button>
          <button onClick={load} style={{background:'#ffcc00',border:'none',padding:'8px 14px',borderRadius:'20px',fontWeight:800,fontSize:'12px',cursor:'pointer'}}>{loading?'...':'↻ Refresh'}</button>
        </div>
      </div>

      <div style={{maxWidth:'1600px',margin:'auto',padding:'22px'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:'14px',marginBottom:'18px'}}>
          <div onClick={()=>setTab('contacts')} style={{background:tab==='contacts'?'#0a1931':'#fff',color:tab==='contacts'?'#fff':'#0a1931',padding:'18px',borderRadius:'18px',cursor:'pointer',border:tab==='contacts'?'2px solid #ffcc00':'1px solid #eee'}}><p style={{fontSize:'10px',opacity:.7}}>📞 CONTACTS</p><h2 style={{fontSize:'28px',fontWeight:900,marginTop:'8px'}}>{contacts.length}</h2></div>
          <div onClick={()=>setTab('applicants')} style={{background:tab==='applicants'?'#ffcc00':'#fff',padding:'18px',borderRadius:'18px',cursor:'pointer',border:tab==='applicants'?'2px solid #0a1931':'1px solid #eee'}}><p style={{fontSize:'10px'}}>🎖️ APPLICANTS</p><h2 style={{fontSize:'28px',fontWeight:900,marginTop:'8px'}}>{applicants.length}</h2></div>
          <div style={{background:'#fff',padding:'18px',borderRadius:'18px',border:'1px solid #eee'}}><p style={{fontSize:'10px'}}>📊 FILTERED</p><h2 style={{fontSize:'28px',fontWeight:900,marginTop:'8px'}}>{list.length}</h2></div>
        </div>

        {showFilters && (
          <div style={{background:'#fff',borderRadius:'16px',padding:'16px',marginBottom:'16px',border:'1px solid #eef'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'12px'}}><h3 style={{fontSize:'12px',fontWeight:900}}>⚙ FILTERS</h3><button onClick={clearFilters} style={{background:'#fee2e2',color:'#dc2626',border:'none',padding:'6px 12px',borderRadius:'20px',fontSize:'11px',fontWeight:800,cursor:'pointer'}}>Clear All</button></div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:'10px'}}>
              <div><label style={{fontSize:'10px',fontWeight:800}}>DATE FROM</label><input type="date" value={filters.dateFrom} onChange={e=>setFilters({...filters,dateFrom:e.target.value})} style={{width:'100%',padding:'10px',borderRadius:'10px',border:'1px solid #ddd',marginTop:'4px'}}/></div>
              <div><label style={{fontSize:'10px',fontWeight:800}}>DATE TO</label><input type="date" value={filters.dateTo} onChange={e=>setFilters({...filters,dateTo:e.target.value})} style={{width:'100%',padding:'10px',borderRadius:'10px',border:'1px solid #ddd',marginTop:'4px'}}/></div>
              {tab==='contacts' ? <div><label style={{fontSize:'10px',fontWeight:800}}>SERVICE</label><select value={filters.service} onChange={e=>setFilters({...filters,service:e.target.value})} style={{width:'100%',padding:'10px',borderRadius:'10px',border:'1px solid #ddd',marginTop:'4px'}}><option value="">All Services</option>{serviceOptions.map(s=><option key={s} value={s}>{s}</option>)}</select></div> : <><div><label style={{fontSize:'10px',fontWeight:800}}>POSITION</label><select value={filters.position} onChange={e=>setFilters({...filters,position:e.target.value})} style={{width:'100%',padding:'10px',borderRadius:'10px',border:'1px solid #ddd',marginTop:'4px'}}><option value="">All</option>{positionOptions.map(s=><option key={s} value={s}>{s}</option>)}</select></div><div><label style={{fontSize:'10px',fontWeight:800}}>DISTRICT</label><select value={filters.district} onChange={e=>setFilters({...filters,district:e.target.value})} style={{width:'100%',padding:'10px',borderRadius:'10px',border:'1px solid #ddd',marginTop:'4px'}}><option value="">All</option>{districtOptions.map(s=><option key={s} value={s}>{s}</option>)}</select></div></>}
            </div>
          </div>
        )}

        <div style={{background:'#fff',borderRadius:'20px',overflow:'hidden',boxShadow:'0 10px 30px rgba(0,0,0,.06)'}}>
          <div style={{padding:'16px 20px',display:'flex',justifyContent:'space-between',alignItems:'center',background:tab==='contacts'?'#0a1931':'#7a0a0a'}}>
            <div style={{color:tab==='contacts'?'#ffcc00':'#fff',fontWeight:900,fontSize:'13px'}}>{tab==='contacts'?`📞 CONTACTS — ${list.length}`:`📋 APPLICANTS — ${list.length}`}</div>
            <button onClick={()=>exportCSV(list,`${tab}.csv`)} style={{background:'#fff',border:'none',padding:'6px 12px',borderRadius:'20px',fontSize:'10px',fontWeight:900,cursor:'pointer'}}>⬇ EXPORT CSV</button>
          </div>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px',minWidth:'1100px'}}>
              <thead><tr style={{background:'#f8f9fb',color:'#6b7280',textAlign:'left',fontSize:'10px'}}><th style={{padding:'14px 16px'}}>DATE</th><th style={{padding:'14px 16px'}}>FULL NAME</th><th style={{padding:'14px 16px'}}>PHONE</th><th style={{padding:'14px 16px'}}>EMAIL</th>{tab==='contacts'?<><th style={{padding:'14px 16px'}}>SERVICE</th><th style={{padding:'14px 16px'}}>MESSAGE</th></>:<><th style={{padding:'14px 16px'}}>POSITION</th><th style={{padding:'14px 16px'}}>DISTRICT</th><th style={{padding:'14px 16px'}}>EDUCATION</th><th style={{padding:'14px 16px'}}>EXP</th></>}<th style={{padding:'14px 16px'}}>ACTIONS</th></tr></thead>
              <tbody>{paginatedList.map((d,i)=>{ const ts=getVal(d,['Timestamp','timestamp']); const isEditing=editRow===ts; return (<tr key={i} style={{borderBottom:'1px solid #f1f1f1',background:isEditing?'#fff9db': i%2===0?'#fff':'#fcfdff'}}><td style={{padding:'12px 16px',color:'#6b7280',fontSize:'11px'}}>{formatDate(ts)}</td><td style={{padding:'12px 16px',fontWeight:700}}>{isEditing?<input value={form.FullName||''} onChange={e=>setForm({...form,FullName:e.target.value})} style={{padding:'6px',width:'110px'}}/>:getVal(d,['FullName','fullName'])}</td><td style={{padding:'12px 16px'}}>{isEditing?<input value={form.Phone||''} onChange={e=>setForm({...form,Phone:e.target.value})} style={{padding:'6px',width:'90px'}}/>:getVal(d,['Phone','phone'])}</td><td style={{padding:'12px 16px'}}>{isEditing?<input value={form.Email||''} onChange={e=>setForm({...form,Email:e.target.value})} style={{padding:'6px',width:'130px'}}/>:getVal(d,['Email','email'])}</td>{tab==='contacts'?<><td style={{padding:'12px 16px'}}>{getVal(d,['Service','service'])}</td><td style={{padding:'12px 16px'}}>{getVal(d,['Messages','message'])}</td></>:<><td style={{padding:'12px 16px'}}>{getVal(d,['Position','position'])}</td><td style={{padding:'12px 16px'}}>{getVal(d,['District','district'])}</td><td style={{padding:'12px 16px'}}>{getVal(d,['Education','education'])}</td><td style={{padding:'12px 16px'}}>{getVal(d,['Experience','experience'])}</td></>}<td style={{padding:'12px 16px'}}><div style={{display:'flex',gap:'6px'}}>{isEditing?<><button onClick={handleSave} style={{background:'#0a1931',color:'#ffcc00',border:'none',padding:'6px 12px',borderRadius:'8px',fontWeight:800,fontSize:'11px',cursor:'pointer'}}>SAVE</button><button onClick={()=>setEditRow(null)} style={{background:'#eee',border:'none',padding:'6px 10px',borderRadius:'8px',fontSize:'11px'}}>CANCEL</button></>:<><button onClick={()=>handleEdit(d)} style={{background:'#ffcc00',border:'none',padding:'6px 12px',borderRadius:'8px',fontWeight:800,fontSize:'11px',cursor:'pointer'}}>EDIT</button><button onClick={()=>handleDelete(d)} style={{background:'#c00',color:'#fff',border:'none',padding:'6px 10px',borderRadius:'8px',fontWeight:800,fontSize:'11px',cursor:'pointer'}}>Delete</button></>}</div></td></tr>)})}</tbody>
            </table>
          </div>

          {/* PAGINATION FOOTER - LIKE YOUR SCREENSHOT */}
          <div style={{padding:'16px 20px',display:'flex',justifyContent:'space-between',alignItems:'center',borderTop:'1px solid #eee',flexWrap:'wrap',gap:'12px'}}>
            <button disabled={currentPage===1} onClick={()=>setCurrentPage(p=>Math.max(1,p-1))} style={{background:currentPage===1?'#f3f4f6':'#fff',color:currentPage===1?'#aaa':'#0a1931',border:'1px solid #ddd',padding:'8px 16px',borderRadius:'10px',fontWeight:800,fontSize:'12px',cursor:currentPage===1?'not-allowed':'pointer'}}>◂ PREV</button>
            
            <div style={{display:'flex',alignItems:'center',gap:'10px',fontSize:'13px'}}>
              <span>Page</span>
              <input type="number" min={1} max={totalPages} value={currentPage} onChange={e=>setCurrentPage(Math.min(totalPages,Math.max(1,Number(e.target.value)||1)))} style={{width:'60px',padding:'8px',borderRadius:'10px',border:'1px solid #ddd',textAlign:'center',fontWeight:800}}/>
              <span>of {totalPages}</span>
            </div>

            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
              <select value={rowsPerPage} onChange={e=>setRowsPerPage(Number(e.target.value))} style={{padding:'8px 12px',borderRadius:'10px',border:'1px solid #ddd',fontWeight:700,fontSize:'13px'}}>
                <option value={10}>10 rows</option>
                <option value={20}>20 rows</option>
                <option value={30}>30 rows</option>
                <option value={50}>50 rows</option>
                <option value={100}>100 rows</option>
              </select>
              <button disabled={currentPage===totalPages} onClick={()=>setCurrentPage(p=>Math.min(totalPages,p+1))} style={{background:currentPage===totalPages?'#f3f4f6':'#0a1931',color:currentPage===totalPages?'#aaa':'#ffcc00',border:'1px solid #ddd',padding:'8px 16px',borderRadius:'10px',fontWeight:800,fontSize:'12px',cursor:currentPage===totalPages?'not-allowed':'pointer'}}>NEXT ▸</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default AdminDashboard