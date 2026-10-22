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
      // FIX: DEDUP BY TIMESTAMP - SHOW 1 DETAIL FOR 1 SUBMIT
      const map = new Map();
      arr.forEach(row=>{
        const ts = (row.Timestamp || row.timestamp || '').trim();
        if(!ts) return;
        if(!map.has(ts)) map.set(ts, row);
      });
      const uniqueArr = Array.from(map.values());
      const withId = uniqueArr.map((row,i)=>({ ...row, _uid: `${row.Timestamp||row.timestamp}_${i}`, _index: i }));
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
  const serviceOptions = unique(['Service','service']); 
  const positionOptions = unique(['Position','position']); 
  const districtOptions = unique(['District','district']); 
  const educationOptions = unique(['Education','education']); 

  if(!auth){
    return ( <div style={{minHeight:'100vh',background:'radial-gradient(circle at 20% 30%,#1a3a6a,#0a1931 70%)',display:'flex',justifyContent:'center',alignItems:'center',fontFamily:'Arial'}}>
      <div style={{background:'#fff',padding:'40px',borderRadius:'28px',width:'92%',maxWidth:'380px',textAlign:'center'}}>
        <div style={{width:'64px',height:'64px',background:'#0a1931',borderRadius:'18px',margin:'0 auto 16px',display:'grid',placeItems:'center',color:'#ffcc00',fontSize:'26px',fontWeight:900}}>P</div>
        <h2 style={{fontWeight:900,color:'#0a1931'}}>PINNACLE ADMIN</h2>
        <input type="password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&login()} placeholder="Admin Password" style={{width:'100%',padding:'14px 16px',borderRadius:'14px',marginTop:'22px',border:'2px solid #e5e7eb'}}/>
        <button onClick={login} style={{width:'100%',marginTop:'14px',background:'#ffcc00',padding:'14px',borderRadius:'14px',fontWeight:900,border:'none',cursor:'pointer'}}>UNLOCK DASHBOARD →</button>
      </div>
    </div> )
  }

  const applicants = data.filter(d => (d.type==='applicant') || getVal(d,['Position','position']));
  const contacts = data.filter(d => (d.type==='contact') || getVal(d,['Service','service']));
  const applyFilters = (list) => list.filter(d=>{
    const s = `${getVal(d,['FullName','fullName'])} ${getVal(d,['Phone','phone'])} ${getVal(d,['Email','email'])} ${getVal(d,['Service','service'])} ${getVal(d,['Position','position'])}`.toLowerCase();
    if(search && !s.includes(search.toLowerCase())) return false;
    if(filters.service && getVal(d,['Service','service']).toLowerCase() !== filters.service.toLowerCase()) return false;
    if(filters.position && getVal(d,['Position','position']).toLowerCase() !== filters.position.toLowerCase()) return false;
    if(filters.district && getVal(d,['District','district']).toLowerCase() !== filters.district.toLowerCase()) return false;
    return true;
  });

  const filteredContacts = applyFilters(contacts); 
  const filteredApplicants = applyFilters(applicants);
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
    <div style={{background:'#f2f4f8',minHeight:'100vh',fontFamily:'Arial'}}>
      {toast && <div style={{position:'fixed',top:'20px',right:'20px',background:'#0a1931',color:'#ffcc00',padding:'12px 20px',borderRadius:'30px',fontWeight:900,fontSize:'13px',zIndex:99999}}>{toast}</div>}
      <div style={{background:'#0a1931',padding:'16px 24px',display:'flex',justifyContent:'space-between',alignItems:'center',position:'sticky',top:0,zIndex:100,borderBottom:'4px solid #ffcc00'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px'}}><div style={{width:'40px',height:'40px',background:'#ffcc00',borderRadius:'12px',display:'grid',placeItems:'center',fontWeight:900}}>P</div><div><h1 style={{color:'#fff',fontWeight:900,fontSize:'15px'}}>PINNACLE SECURITY LTD</h1><p style={{color:'#ffcc00',fontSize:'10px'}}>ADMIN CONTROL CENTER</p></div></div>
        <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{background:'rgba(255,255,255,.1)',border:'none',borderRadius:'24px',padding:'8px 14px',color:'#fff',fontSize:'12px',width:'160px'}}/>
          <button onClick={()=>setShowFilters(!showFilters)} style={{background:activeFilterCount?'#ffcc00':'#fff',color:'#0a1931',border:'none',padding:'9px 16px',borderRadius:'24px',fontWeight:800,fontSize:'12px',cursor:'pointer'}}>{showFilters?'✕ Close':'⚙ Filters'} {activeFilterCount?`(${activeFilterCount})`:''}</button>
          {selected.length>0 && <button onClick={handleBulkDelete} style={{background:'#dc2626',color:'#fff',border:'none',padding:'9px 16px',borderRadius:'24px',fontWeight:800,fontSize:'12px',cursor:'pointer'}}>🗑 {selected.length}</button>}
          <button onClick={load} style={{background:'#ffcc00',border:'none',padding:'9px 16px',borderRadius:'24px',fontWeight:900,fontSize:'12px',cursor:'pointer'}}>{loading?'⏳':'↻ Refresh'}</button>
        </div>
      </div>
      <div style={{maxWidth:'1600px',margin:'auto',padding:'18px 24px'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:'14px',marginBottom:'18px'}}>
          <div onClick={()=>{setTab('contacts'); setSelected([]);}} style={{background:tab==='contacts'?'#0a1931':'#fff',color:tab==='contacts'?'#fff':'#0a1931',padding:'20px',borderRadius:'20px',cursor:'pointer',border:'1px solid #eee'}}><p style={{fontSize:'11px'}}>📞 CONTACTS</p><h2 style={{fontSize:'32px',fontWeight:900,marginTop:'10px'}}>{contacts.length}</h2></div>
          <div onClick={()=>{setTab('applicants'); setSelected([]);}} style={{background:tab==='applicants'?'#ffcc00':'#fff',padding:'20px',borderRadius:'20px',cursor:'pointer',border:'1px solid #eee'}}><p style={{fontSize:'11px'}}>🎖️ APPLICANTS</p><h2 style={{fontSize:'32px',fontWeight:900,marginTop:'10px'}}>{applicants.length}</h2></div>
          <div style={{background:'#fff',padding:'20px',borderRadius:'20px',border:'1px solid #eee'}}><p style={{fontSize:'11px'}}>📊 CURRENT VIEW</p><div style={{display:'flex',justifyContent:'space-between',marginTop:'10px'}}><h2 style={{fontSize:'32px',fontWeight:900}}>{list.length}</h2><button onClick={()=>exportCSV(list,`${tab}.csv`)} style={{background:'#0a1931',color:'#ffcc00',border:'none',padding:'8px 14px',borderRadius:'20px',fontSize:'11px',fontWeight:900,cursor:'pointer'}}>⬇ CSV</button></div></div>
        </div>
        <div style={{background:'#fff',borderRadius:'20px',overflow:'hidden',boxShadow:'0 12px 40px rgba(0,0,0,.08)'}}>
          <div style={{padding:'16px 22px',background:tab==='contacts'?'#0a1931':'#111827',color:tab==='contacts'?'#ffcc00':'#fff',fontWeight:900,fontSize:'13px'}}>{tab==='contacts'?`📞 CONTACTS — ${list.length}`:`📋 APPLICANTS — ${list.length}`} • Page {currentPage}/{totalPages}</div>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px',minWidth:'1100px'}}>
              <thead><tr style={{background:'#f9fafb'}}><th style={{padding:'14px 16px'}}><input type="checkbox" checked={isAllSelected} onChange={()=>{ if(isAllSelected) setSelected(prev=>prev.filter(id=>!allPageIds.includes(id))); else setSelected(prev=>[...new Set([...prev, ...allPageIds])]); }}/></th><th>DATE & TIME</th><th>FULL NAME</th><th>PHONE</th><th>EMAIL</th><th>{tab==='contacts'?'SERVICE':'POSITION'}</th><th>ACTION</th></tr></thead>
              <tbody>
                {paginatedList.map((d,i)=>{ const checked=selected.includes(d._uid); return (<tr key={d._uid} style={{borderBottom:'1px solid #f1f1f1',background:checked?'#fff9db':i%2===0?'#fff':'#fbfdff'}}><td style={{padding:'12px 16px'}}><input type="checkbox" checked={checked} onChange={()=>setSelected(prev=>prev.includes(d._uid)?prev.filter(id=>id!==d._uid):[...prev,d._uid])} /></td><td style={{padding:'12px 16px',fontSize:'11px',fontWeight:700}}>{getVal(d,['Timestamp','timestamp'])?.slice(0,19)}</td><td style={{padding:'12px 16px',fontWeight:800,cursor:'pointer'}} onClick={()=>setDetailRow(d)}>{getVal(d,['FullName','fullName'])}</td><td style={{padding:'12px 16px'}}>{getVal(d,['Phone','phone'])}</td><td style={{padding:'12px 16px'}}>{getVal(d,['Email','email'])}</td><td style={{padding:'12px 16px'}}>{tab==='contacts'?getVal(d,['Service','service']):getVal(d,['Position','position'])}</td><td style={{padding:'12px 16px'}}><button onClick={()=>handleEdit(d)} style={{background:'#ffcc00',border:'none',padding:'6px 12px',borderRadius:'8px',fontWeight:800,fontSize:'11px',cursor:'pointer'}}>EDIT</button><button onClick={()=>handleDelete(d)} style={{background:'#fee2e2',color:'#dc2626',border:'none',padding:'6px 10px',borderRadius:'8px',fontWeight:800,fontSize:'11px',cursor:'pointer',marginLeft:'4px'}}>DEL</button></td></tr>)})}
              </tbody>
            </table>
          </div>
          <div style={{padding:'16px 22px',display:'flex',justifyContent:'space-between',borderTop:'1px solid #eee'}}><button disabled={currentPage===1} onClick={()=>setCurrentPage(p=>Math.max(1,p-1))} style={{padding:'8px 14px',borderRadius:'10px'}}>◂ PREV</button><span>Page {currentPage} of {totalPages}</span><button disabled={currentPage===totalPages} onClick={()=>setCurrentPage(p=>Math.min(totalPages,p+1))} style={{padding:'8px 14px',borderRadius:'10px'}}>NEXT ▸</button></div>
        </div>
      </div>
      {detailRow && (<div onClick={()=>setDetailRow(null)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.5)',zIndex:10000,display:'flex',justifyContent:'center',alignItems:'center'}}><div onClick={e=>e.stopPropagation()} style={{background:'#fff',borderRadius:'20px',padding:'24px',width:'90%',maxWidth:'480px'}}><h3>👤 {getVal(detailRow,['FullName','fullName'])}</h3><div style={{marginTop:'12px',fontSize:'12px'}}>{Object.entries(detailRow).filter(([k])=>!k.startsWith('_')).slice(0,8).map(([k,v])=><div key={k} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid #f3f4f6'}}><b>{k}</b><span>{String(v).slice(0,40)}</span></div>)}</div><button onClick={()=>setDetailRow(null)} style={{marginTop:'16px',width:'100%',padding:'12px',borderRadius:'12px',background:'#0a1931',color:'#ffcc00',fontWeight:900}}>CLOSE</button></div></div>)}
      {editRow && (<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.5)',zIndex:10001,display:'flex',justifyContent:'center',alignItems:'center'}}><div style={{background:'#fff',borderRadius:'20px',padding:'24px',width:'90%',maxWidth:'520px'}}><h3>✏️ Edit {form.FullName}</h3><div style={{display:'grid',gap:'10px',marginTop:'12px'}}>{["FullName","Phone","Email","Service","Position","District"].map(f=><input key={f} value={form[f]||''} onChange={e=>setForm({...form,[f]:e.target.value})} placeholder={f} style={{padding:'10px',borderRadius:'10px',border:'1px solid #e5e7eb'}}/>)}</div><div style={{display:'flex',gap:'8px',marginTop:'16px'}}><button onClick={()=>setEditRow(null)} style={{flex:1,padding:'12px',borderRadius:'12px'}}>CANCEL</button><button onClick={handleSave} style={{flex:1,background:'#0a1931',color:'#ffcc00',padding:'12px',borderRadius:'12px',fontWeight:900}}>SAVE</button></div></div></div>)}
    </div>
  )
}

export default AdminDashboard;