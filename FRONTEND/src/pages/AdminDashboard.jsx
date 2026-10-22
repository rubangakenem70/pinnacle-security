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
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState([]);
  const [editRow, setEditRow] = useState(null);
  const [form, setForm] = useState({});
  const [toast, setToast] = useState("");
  const [trash, setTrash] = useState(()=>JSON.parse(localStorage.getItem('psl_trash')||'[]'));
  const [showTrash, setShowTrash] = useState(false);
  const [dark, setDark] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(270);
  const audioRef = useRef(null);
  const resizingRef = useRef(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ service:"", position:"", district:"", education:"", status:"", dateFrom:"", dateTo:"" });
  const [detailRow, setDetailRow] = useState(null);
  // ✅ ADDED ONLY: ADD NEW + BULK
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ Type:"contact", FullName:"", Phone:"", Email:"", Service:"", Message:"", Position:"", Education:"", District:"", Experience:"", Interest:"" });

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(""), 3500); }
  const login = () => pass === ADMIN_PASSWORD ? setAuth(true) : alert("Wrong Password!");
  
  const load = () => {
    setLoading(true);
    const cbName = "psl_cb_" + Date.now();
    const old = document.getElementById("psl_jsonp");
    if(old) old.remove();
    window[cbName] = (d) => {
      try {
        const arr = Array.isArray(d) ? d : (d.data || []);
        const withId = arr.map((row,i)=>{ 
          const ts = (row.Timestamp || row.timestamp || "") + "";
          if(!ts || ts.trim()==="" || ts==="undefined") return null;
          const saved = JSON.parse(localStorage.getItem(`psl_${ts}`) || '{}');
          return { ...row, Timestamp: ts, timestamp: ts, Status: saved.Status || row.Status || 'New', _uid: `${ts}_${i}`, _index: i }
        }).filter(Boolean);
        setData(withId.sort((a,b)=> new Date(b.timestamp||0) - new Date(a.timestamp||0)));
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
      showToast("❌ Load failed - check Apps Script");
    };
    document.body.appendChild(s);
  };
  
  useEffect(()=>{ if(auth) load(); },[auth]);
  useEffect(()=>{ setCurrentPage(1); },[search, tab, rowsPerPage, filters]);
  const getVal = (obj, keys) => { for(let k of keys) if(obj[k]!==undefined && obj[k]!==null && obj[k]!=='') return obj[k]; return ''; }
  const formatDate = (ts) => {
    if(!ts) return '';
    const str = String(ts);
    if(str.includes('/')) return str.slice(0,16);
    const d = new Date(str);
    if(isNaN(d.getTime())) return str.slice(0,16);
    return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  };
  // ✅ ADDED ONLY: PHONE HELPERS - 0785... -> 256785..., +256... -> 256...
  const getPhoneIntl = (phone) => {
    let p = String(phone||'').replace(/\s+/g,'').replace(/^\+/,'');
    if(p.startsWith('0')) p = '256' + p.slice(1);
    if(p.startsWith('256') && p.length>=12) return p;
    if(p.length===9) return '256' + p;
    return p;
  };
  const getWhatsAppLink = (d) => {
    const phone = getPhoneIntl(getVal(d,['Phone','phone']));
    const name = getVal(d,['FullName','fullName']);
    const isApplicant = getVal(d,['Position','position']) || d.Type==='applicant' || d.type==='applicant';
    const text = isApplicant ? `Hello ${name}, this is Pinnacle Security Ltd, Muyenga. Thank you for applying for ${getVal(d,['Position','position'])||'Security Officer'}. We received your application. When can you come for interview / training at Muyenga HQ? Control 24/7: 0776971970. In Jesus Name.` : `Hello ${name}, this is Pinnacle Security Ltd, Muyenga. Thank you for contacting us for ${getVal(d,['Service','service'])||'Security Service'}. We will call you soon for a FREE Site Survey. Control 24/7: 0776971970. In Jesus Name.`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };
  const getCallLink = (d) => `tel:${getVal(d,['Phone','phone'])}`;

  useEffect(()=>{
    const onMove = (e) => {
      if(!resizingRef.current) return;
      const w = Math.min(450, Math.max(180, e.clientX));
      setSidebarWidth(w);
    };
    const onUp = () => { resizingRef.current = false; document.body.style.cursor=''; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return ()=>{ window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  },[]);

  const handleToggleStatus = async (row) => {
    const current = getVal(row,['Status','status']) || 'New';
    const next = current === 'New' ? 'Read' : current === 'Read' ? 'New' : 'Read';
    const ts = getVal(row,['Timestamp','timestamp']);
    const saved = JSON.parse(localStorage.getItem(`psl_${ts}`) || '{}');
    localStorage.setItem(`psl_${ts}`, JSON.stringify({...saved, Status: next}));
    setData(prev => prev.map(r => r._uid===row._uid ? { ...r, Status: next, status: next } : r));
    showToast(`👁️ ${getVal(row,['FullName','fullName'])}: ${current} → ${next}`);
    await fetch(GOOGLE_SHEET_WEBHOOK,{ method:'POST', mode:'no-cors', headers:{'Content-Type':'text/plain'}, body:JSON.stringify({ action:'edit', Timestamp: ts, timestamp: ts, Status: next }) });
  };

  const handleDelete = async (row) => {
    if(!confirm(`Move ${getVal(row,['FullName','fullName'])} to Trash?`)) return;
    const newTrash = [{...row, deletedAt: new Date().toISOString()}, ...trash].slice(0,200);
    setTrash(newTrash); localStorage.setItem('psl_trash', JSON.stringify(newTrash));
    setData(prev => prev.filter(r => r._uid !== row._uid)); showToast("🗑 Moved to Trash (Deleted from Sheet too)");
    await fetch(GOOGLE_SHEET_WEBHOOK,{ method:'POST', mode:'no-cors', headers:{'Content-Type':'text/plain'}, body:JSON.stringify({ action:'delete', timestamps:[getVal(row,['Timestamp','timestamp'])] }) });
  };

  const handleRestore = async (t) => {
    setData(p=>[t,...p]);
    setTrash(prev=>{const nt=prev.filter(x=>x._uid!==t._uid); localStorage.setItem('psl_trash', JSON.stringify(nt)); return nt;});
    showToast("♻️ Restored to Admin & Sheet...");
    await fetch(GOOGLE_SHEET_WEBHOOK,{ method:'POST', mode:'no-cors', headers:{'Content-Type':'text/plain'}, body:JSON.stringify({ action:'restore', Timestamp: getVal(t,['Timestamp','timestamp']), FullName: getVal(t,['FullName','fullName']), Phone: getVal(t,['Phone','phone']), Email: getVal(t,['Email','email']), Service: getVal(t,['Service','service']), Message: getVal(t,['Message','message']), Position: getVal(t,['Position','position']), Education: getVal(t,['Education','education']), District: getVal(t,['District','district']), Experience: getVal(t,['Experience','experience']), Interest: getVal(t,['Interest','interest']), Type: getVal(t,['Type','type'])||"contact", Status: getVal(t,['Status','status'])||"New" }) });
    showToast("♻️ Restored to Admin & Sheet ✅");
  };

  const handlePermanentDelete = async (t) => {
    if(!confirm(`Permanently delete ${getVal(t,['FullName','fullName'])} forever? Cannot undo!`)) return;
    setTrash(prev=>{const nt=prev.filter(x=>x._uid!==t._uid); localStorage.setItem('psl_trash', JSON.stringify(nt)); return nt;});
    showToast("❌ Permanently Deleted from Admin & Sheet");
    await fetch(GOOGLE_SHEET_WEBHOOK,{ method:'POST', mode:'no-cors', headers:{'Content-Type':'text/plain'}, body:JSON.stringify({ action:'delete', timestamps:[getVal(t,['Timestamp','timestamp'])] }) });
  };

  const handleBulkDelete = async () => {
    if(selected.length===0) return;
    if(!confirm(`Move ${selected.length} rows to Trash? They will be deleted from Sheet too.`)) return;
    const rows = data.filter(r=>selected.includes(r._uid));
    const timestamps = [...new Set(rows.map(r=>getVal(r,['Timestamp','timestamp'])))];
    const newTrash = [...rows.map(r=>({...r, deletedAt:new Date().toISOString()})), ...trash].slice(0,200);
    setTrash(newTrash); localStorage.setItem('psl_trash', JSON.stringify(newTrash));
    setData(prev => prev.filter(r => !selected.includes(r._uid))); setSelected([]); showToast(`🗑 ${timestamps.length} moved to Trash (Deleted from Sheet too)`);
    await fetch(GOOGLE_SHEET_WEBHOOK,{ method:'POST', mode:'no-cors', headers:{'Content-Type':'text/plain'}, body:JSON.stringify({ action:'bulkDelete', timestamps }) });
  };
  // ✅ ADDED ONLY: BULK EMAIL / WHATSAPP / MARK READ
  const handleBulkEmail = () => {
    const rows = data.filter(r=>selected.includes(r._uid));
    const emails = [...new Set(rows.map(r=>getVal(r,['Email','email'])).filter(Boolean))];
    if(!emails.length){ showToast('❌ No email for selected'); return; }
    window.location.href = `mailto:?bcc=${emails.join(',')}&subject=${encodeURIComponent('Pinnacle Security Ltd - Message')}&body=${encodeURIComponent('Hello,\n\nThis is Pinnacle Security Ltd, Muyenga. Thank you for contacting / applying to us.\n\nWe will contact you soon.\n\nIn Jesus Name,\nPinnacle Security Ltd\nControl 24/7: 0776971970')}`;
    showToast(`📧 Email opened for ${emails.length} people`);
  };
  const handleBulkWhatsApp = () => {
    const rows = data.filter(r=>selected.includes(r._uid));
    if(!rows.length) return;
    rows.forEach((r,i)=>{ setTimeout(()=>{ window.open(getWhatsAppLink(r),'_blank'); }, i*800); });
    showToast(`💬 Opening WhatsApp for ${rows.length} people...`);
  };
  const handleBulkMarkRead = async () => {
    const rows = data.filter(r=>selected.includes(r._uid));
    if(!rows.length) return;
    setData(prev=>prev.map(r=>selected.includes(r._uid)?{...r, Status:'Read', status:'Read'}:r));
    showToast(`👁️ ${rows.length} marked as Read`);
    for(const r of rows){
      const ts = getVal(r,['Timestamp','timestamp']);
      const saved = JSON.parse(localStorage.getItem(`psl_${ts}`)||'{}');
      localStorage.setItem(`psl_${ts}`, JSON.stringify({...saved, Status:'Read'}));
      await fetch(GOOGLE_SHEET_WEBHOOK,{ method:'POST', mode:'no-cors', headers:{'Content-Type':'text/plain'}, body:JSON.stringify({ action:'edit', Timestamp: ts, timestamp: ts, Status:'Read' }) });
    }
    setSelected([]);
  };

  const handleRestoreAll = async () => {
    if(trash.length===0) return;
    if(!confirm(`Restore ALL ${trash.length} from Trash to Admin & Sheet?`)) return;
    const all = [...trash];
    setData(p=>[...all, ...p]);
    setTrash([]); localStorage.setItem('psl_trash', JSON.stringify([]));
    showToast(`♻️ Restoring ${all.length}...`);
    for(const t of all){
      await fetch(GOOGLE_SHEET_WEBHOOK,{ method:'POST', mode:'no-cors', headers:{'Content-Type':'text/plain'}, body:JSON.stringify({ action:'restore', Timestamp: getVal(t,['Timestamp','timestamp']), FullName: getVal(t,['FullName','fullName']), Phone: getVal(t,['Phone','phone']), Email: getVal(t,['Email','email']), Service: getVal(t,['Service','service']), Message: getVal(t,['Message','message']), Position: getVal(t,['Position','position']), Education: getVal(t,['Education','education']), District: getVal(t,['District','district']), Experience: getVal(t,['Experience','experience']), Interest: getVal(t,['Interest','interest']), Type: getVal(t,['Type','type'])||"contact", Status: getVal(t,['Status','status'])||"New" }) });
    }
    showToast(`♻️ All ${all.length} Restored ✅`);
  };
  const handleEmptyTrash = async () => {
    if(trash.length===0) return;
    if(!confirm(`Permanently delete ALL ${trash.length} in Trash forever? Cannot undo!`)) return;
    const timestamps = [...new Set(trash.map(t=>getVal(t,['Timestamp','timestamp'])))];
    setTrash([]); localStorage.setItem('psl_trash', JSON.stringify([]));
    showToast("❌ Trash Emptied Forever");
    await fetch(GOOGLE_SHEET_WEBHOOK,{ method:'POST', mode:'no-cors', headers:{'Content-Type':'text/plain'}, body:JSON.stringify({ action:'bulkDelete', timestamps }) });
  };

  const clearDuplicates = () => {
    const seen = new Set(); const dups = []; const keep = [];
    data.forEach(r=>{ const key = getVal(r,['Phone','phone'])+"_"+getVal(r,['FullName','fullName']); if(seen.has(key)) dups.push(r); else { seen.add(key); keep.push(r); } });
    if(dups.length===0){ showToast('✅ No duplicates'); return; }
    if(!confirm(`Found ${dups.length} duplicates?`)) return;
    setTrash(prev=>{ const nt=[...dups, ...prev].slice(0,200); localStorage.setItem('psl_trash', JSON.stringify(nt)); return nt; });
    setData(keep); showToast(`🧹 ${dups.length} moved`);
  };
  const handleEdit = (row) => { setEditRow(row); setForm({ FullName:getVal(row,['FullName','fullName']), Phone:getVal(row,['Phone','phone']), Email:getVal(row,['Email','email']), Service:getVal(row,['Service','service']), Position:getVal(row,['Position','position']), District:getVal(row,['District','district']), Status:getVal(row,['Status','status'])||'New', timestamp:getVal(row,['Timestamp','timestamp']) }); };
  const handleSave = async () => {
    const ts = form.timestamp;
    const saved = JSON.parse(localStorage.getItem(`psl_${ts}`) || '{}');
    localStorage.setItem(`psl_${ts}`, JSON.stringify({...saved, Status:form.Status}));
    setData(prev => prev.map(r => r._uid===editRow._uid ? { ...r, ...form } : r));
    setEditRow(null); showToast("✅ Updated in Admin & Sheet...");
    try {
      await fetch(GOOGLE_SHEET_WEBHOOK,{ method:'POST', mode:'no-cors', headers:{'Content-Type':'text/plain'}, body:JSON.stringify({ action:'edit', Timestamp: ts, timestamp: ts, FullName: form.FullName, Phone: form.Phone, Email: form.Email, Service: form.Service, Position: form.Position, District: form.District, Status: form.Status }) });
      showToast("✅ Updated in Admin & Sheet");
    } catch(e) { showToast("✅ Updated in Admin (Sheet retry on Refresh)"); }
  };
  // ✅ ADDED ONLY: ADD NEW SAVE
  const handleAddSave = async () => {
    if(!addForm.FullName || !addForm.Phone){ alert('Please fill Name and Phone'); return; }
    const ts = getFullDateTime24();
    const newRow = { ...addForm, Timestamp: ts, timestamp: ts, Status:'New', _uid:`${ts}_new`, _index: data.length };
    setData(prev=>[newRow, ...prev]);
    setShowAdd(false);
    setAddForm({ Type:"contact", FullName:"", Phone:"", Email:"", Service:"", Message:"", Position:"", Education:"", District:"", Experience:"", Interest:"" });
    showToast(`✅ ${newRow.FullName} Added to Admin & Sheet...`);
    await fetch(GOOGLE_SHEET_WEBHOOK,{ method:'POST', mode:'no-cors', headers:{'Content-Type':'text/plain'}, body:JSON.stringify({ action:'restore', Timestamp: ts, timestamp: ts, FullName: addForm.FullName, Phone: addForm.Phone, Email: addForm.Email, Service: addForm.Service, Message: addForm.Message, Position: addForm.Position, Education: addForm.Education, District: addForm.District, Experience: addForm.Experience, Interest: addForm.Interest, Type: addForm.Type, Status:'New' }) });
    showToast(`✅ ${newRow.FullName} Added ✅`);
  };
  const exportCSV = (rows, filename) => { if(!rows.length) return; const headers = tab==='contacts'?["Timestamp","FullName","Phone","Email","Service","Message","Status"]:["Timestamp","FullName","Phone","Email","Position","Education","District","Experience","Interest","Type","Status"]; const csv = [headers.join(",")].concat(rows.map(r=> headers.map(h=>`"${String(getVal(r,[h,h.toLowerCase()])||'').replace(/"/g,'""')}"`).join(","))).join("\n"); const blob = new Blob([csv],{type:"text/csv"}); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download=filename; a.click(); };

  if(!auth){ return ( <div style={{minHeight:'100vh',background:dark?'#0f172a':'#f1f5f9',display:'flex',justifyContent:'center',alignItems:'center',fontFamily:'Arial, sans-serif'}}><div style={{background:'#fff',padding:'40px 32px',borderRadius:'24px',width:'92%',maxWidth:'400px',textAlign:'center'}}><div style={{width:'64px',height:'64px',background:'#facc15',borderRadius:'16px',margin:'0 auto 14px',display:'grid',placeItems:'center',fontWeight:900,fontSize:'28px'}}>P</div><h2 style={{fontWeight:900}}>PINNACLE ADMIN</h2><input type="password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&login()} placeholder="Password" style={{width:'100%',padding:'14px',borderRadius:'12px',marginTop:'20px',border:'1px solid #ddd'}}/><button onClick={login} style={{width:'100%',marginTop:'12px',background:'#facc15',padding:'14px',borderRadius:'12px',fontWeight:900,border:'none',cursor:'pointer'}}>UNLOCK</button></div></div> ) }

  const applicants = data.filter(d => (d.type==='applicant' || d.Type==='applicant' || getVal(d,['Position','position']))); 
  const contacts = data.filter(d => !applicants.includes(d)); 
  const total = data.length;
  const unique = (arr, keys) => { const s=new Set(); arr.forEach(d=>{ const v=getVal(d,keys); if(v) s.add(v); }); return [...s].sort(); };
  const serviceOptions = unique(contacts, ['Service','service']);
  const positionOptions = unique(applicants, ['Position','position']);
  const districtOptions = unique(applicants, ['District','district']);
  const educationOptions = unique(applicants, ['Education','education']);
  const statusOptions = unique(data, ['Status','status']);
  const activeFilterCount = Object.values(filters).filter(v=>v).length;
  const clearFilters = () => setFilters({ service:"", position:"", district:"", education:"", status:"", dateFrom:"", dateTo:"" });
  const baseList = (tab==='contacts'?contacts:tab==='applicants'?applicants:data);
  const list = baseList.filter(d=>{
    const s = `${getVal(d,['FullName','fullName'])} ${getVal(d,['Phone','phone'])} ${getVal(d,['Email','email'])} ${getVal(d,['Service','service'])} ${getVal(d,['Position','position'])} ${getVal(d,['District','district'])} ${getVal(d,['Education','education'])} ${getVal(d,['Interest','interest'])} ${getVal(d,['Message','message'])}`.toLowerCase();
    if(search && !s.includes(search.toLowerCase())) return false;
    if(filters.service && getVal(d,['Service','service'])!==filters.service) return false;
    if(filters.position && getVal(d,['Position','position'])!==filters.position) return false;
    if(filters.district && getVal(d,['District','district'])!==filters.district) return false;
    if(filters.education && getVal(d,['Education','education'])!==filters.education) return false;
    if(filters.status && getVal(d,['Status','status'])!==filters.status) return false;
    if(filters.dateFrom){ const ts=new Date(getVal(d,['Timestamp','timestamp'])); if(ts < new Date(filters.dateFrom)) return false; }
    if(filters.dateTo){ const ts=new Date(getVal(d,['Timestamp','timestamp'])); if(ts > new Date(filters.dateTo+'T23:59:59')) return false; }
    return true;
  });
  const paginatedList = list.slice((currentPage-1)*rowsPerPage, currentPage*rowsPerPage);
  const totalPages = Math.max(1, Math.ceil(list.length / rowsPerPage));

  const theme = dark ? {bgMain:'#0f172a', bgCard:'#1e293b', text:'#f1f5f9', border:'#334155', sidebar:'#1e293b', input:'#0f172a'} : {bgMain:'#f8fafc', bgCard:'#ffffff', text:'#0f172a', border:'#e2e8f0', sidebar:'#ffffff', input:'#f1f5f9'};
  const cellStyle = {padding:'2px 6px',height:'14.3px',lineHeight:'14.3px',border:`1px solid ${theme.border}`,whiteSpace:'nowrap',overflow:'hidden',fontSize:'11px',fontFamily:'Arial, sans-serif'};
  const headerStyle = {padding:'2px 6px',height:'18px',lineHeight:'18px',border:'1px solid #dc2626',whiteSpace:'nowrap',overflow:'hidden',fontSize:'11px',fontFamily:'Arial, sans-serif',background:'#dc2626',color:'#ffffff',fontWeight:900};
  const menuItem = (active) => ({padding:'11px 14px',borderRadius:'12px',fontSize:'13px',fontWeight:active?900:700,cursor:'pointer',background:active?'#facc15':'transparent',color:active?'#0f172a':theme.text,border:`1px solid ${theme.border}`,textAlign:'left',width:'100%',display:'flex',justifyContent:'space-between',fontFamily:'Arial, sans-serif'});
  const filterSelect = {padding:'8px 10px',borderRadius:'10px',border:`1px solid ${theme.border}`,background:theme.bgCard,color:theme.text,fontSize:'12px',fontWeight:700,width:'100%',fontFamily:'Arial, sans-serif'};
  const isContactTab = tab==='contacts';
  const colCount = isContactTab ? 9 : tab==='applicants' ? 12 : 12;
  const getMailLink = (d) => {
    const email = getVal(d,['Email','email']);
    const name = getVal(d,['FullName','fullName']);
    const isApplicant = getVal(d,['Position','position']) || d.Type==='applicant' || d.type==='applicant';
    const subject = isApplicant ? `Pinnacle Security Ltd - Your Application for ${getVal(d,['Position','position'])||'Security Officer'}` : `Pinnacle Security Ltd - Your ${getVal(d,['Service','service'])||'Security Service'} Enquiry`;
    const body = isApplicant ? `Dear ${name},\n\nThank you for applying to Pinnacle Security Ltd for the position of ${getVal(d,['Position','position'])||''}.\n\nWe have received your application and we will contact you soon for interview / training at Muyenga HQ.\n\nIn Jesus Name,\nPinnacle Security Ltd\nPlot 442 & 443 Massionatees, Muyenga Hill\nControl 24/7: 0776971970\nHR: hr@pinnaclegroup.co.ug` : `Dear ${name},\n\nThank you for contacting Pinnacle Security Ltd for ${getVal(d,['Service','service'])||''}.\n\nWe have received your message: "${getVal(d,['Message','message'])}"\n\nWe will call you soon for a FREE Site Survey.\n\nIn Jesus Name,\nPinnacle Security Ltd\nPlot 442 & 443 Massionatees, Muyenga Hill\nControl 24/7: 0776971970`;
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  const iconBtn = (bg) => ({width:'20px',height:'20px',borderRadius:'5px',background:bg,border:'none',cursor:'pointer',fontSize:'11px',display:'grid',placeItems:'center',padding:0,textDecoration:'none',lineHeight:'1'});
  const stickyActionTh = {...headerStyle, position:'sticky', right:0, zIndex:2, minWidth:'140px'};
  const stickyActionTd = (bg) => ({...cellStyle, background:bg, position:'sticky', right:0, zIndex:1, minWidth:'140px'});

  return (
    <div style={{background:theme.bgMain,minHeight:'100vh',color:theme.text,display:'flex',fontFamily:'Arial, sans-serif', position:'relative'}}>
      {toast && <div style={{position:'fixed',top:'20px',right:'20px',background:theme.bgCard,color:'#facc15',padding:'12px 18px',borderRadius:'20px',fontWeight:800,zIndex:9999,border:'1px solid #facc15',fontFamily:'Arial, sans-serif'}}>{toast}</div>}
      
      <div style={{width:sidebarWidth,minWidth:sidebarWidth,background:theme.sidebar,padding:'18px 14px',display:'flex',flexDirection:'column',gap:'8px',position:'sticky',top:0,height:'100vh',overflowY:'auto'}}>
        <div style={{display:'flex',alignItems:'center',gap:'10px',paddingBottom:'14px',borderBottom:`1px solid ${theme.border}`}}>
          <div style={{width:'42px',height:'42px',background:'#facc15',borderRadius:'12px',display:'grid',placeItems:'center',fontWeight:900,color:'#0f172a'}}>P</div>
          <div><h2 style={{fontWeight:900,fontSize:'13px'}}>Pinnacle Security Ltd</h2></div>
        </div>
        <button onClick={()=>setDark(!dark)} style={{...menuItem(false), background:theme.bgMain}}> <span>{dark?'☀️ Light Theme':'🌙 Dark Theme'}</span> <span>{dark?'☀️':'🌙'}</span> </button>
        <button onClick={()=>{setTab('contacts')}} style={menuItem(tab==='contacts')}> <span>📞 Contact</span> <span>{contacts.length}</span> </button>
        <button onClick={()=>{setTab('applicants')}} style={menuItem(tab==='applicants')}> <span>🎖️ Applicant</span> <span>{applicants.length}</span> </button>
        <button onClick={()=>{setTab('total')}} style={menuItem(tab==='total')}> <span>📊 Total</span> <span>{total}</span> </button>
        <button onClick={()=>setShowTrash(!showTrash)} style={menuItem(showTrash)}> <span>🗑 Trash {trash.length}</span> </button>
        <a href="/" style={{...menuItem(false), textDecoration:'none'}}> <span>🏠 Home</span> </a>
        <button onClick={load} style={menuItem(false)}> <span>{loading?'⏳ Refresh':'↻ Refresh'}</span> </button>
        <div style={{marginTop:'auto',background:theme.bgMain,padding:'10px',borderRadius:'12px',border:`1px solid ${theme.border}`}}>
          <p style={{fontSize:'11px',fontWeight:700}}>View: {tab.toUpperCase()} • {list.length} rows</p>
          <div style={{display:'flex',gap:'6px',marginTop:'8px'}}><button onClick={()=>exportCSV(list,`${tab}.csv`)} style={{flex:1,background:'#facc15',border:'none',padding:'8px',borderRadius:'8px',fontWeight:900,fontSize:'11px',cursor:'pointer',fontFamily:'Arial, sans-serif'}}>CSV</button><button onClick={clearDuplicates} style={{flex:1,background:theme.bgCard,border:`1px solid ${theme.border}`,padding:'8px',borderRadius:'8px',fontWeight:800,fontSize:'11px',cursor:'pointer',color:theme.text,fontFamily:'Arial, sans-serif'}}>DUP</button></div>
        </div>
      </div>

      <div onMouseDown={(e)=>{ resizingRef.current=true; document.body.style.cursor='col-resize'; }} title="Drag left / right to resize" style={{width:'8px',cursor:'col-resize',background:'#facc15',flexShrink:0, position:'sticky', top:0, height:'100vh', zIndex:10}} />

      <div style={{flex:1,padding:'18px',overflowX:'hidden'}}>
        <div style={{background:theme.bgCard,padding:'12px 16px',borderRadius:'14px',display:'flex',gap:'8px',border:`1px solid ${theme.border}`,marginBottom:'12px',flexWrap:'wrap'}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, phone..." style={{flex:1,minWidth:'180px',background:theme.input,border:`1px solid ${theme.border}`,padding:'10px 14px',borderRadius:'20px',color:theme.text,fontFamily:'Arial, sans-serif'}}/>
          <button onClick={()=>setShowAdd(true)} style={{background:'#facc15',color:'#0f172a',border:'none',padding:'10px 14px',borderRadius:'20px',fontWeight:900,cursor:'pointer',fontSize:'12px',fontFamily:'Arial, sans-serif'}}>+ ADD NEW</button>
          <button onClick={()=>setShowFilters(!showFilters)} style={{background:activeFilterCount?'#facc15':'#fff',color:'#0f172a',border:`1px solid ${theme.border}`,padding:'10px 14px',borderRadius:'20px',fontWeight:900,cursor:'pointer',fontSize:'12px',fontFamily:'Arial, sans-serif'}}>{showFilters?'✕ Filters':'🔍 Filters'+(activeFilterCount?' ('+activeFilterCount+')':'')}</button>
          {selected.length>0 && <><button onClick={handleBulkEmail} style={{background:'#dbeafe',color:'#0f172a',border:'none',padding:'10px 14px',borderRadius:'20px',fontWeight:800,cursor:'pointer',fontSize:'12px'}}>📧 Bulk Email ({selected.length})</button><button onClick={handleBulkWhatsApp} style={{background:'#25D366',color:'#fff',border:'none',padding:'10px 14px',borderRadius:'20px',fontWeight:800,cursor:'pointer',fontSize:'12px'}}>💬 Bulk WhatsApp ({selected.length})</button><button onClick={handleBulkMarkRead} style={{background:'#facc15',color:'#0f172a',border:'none',padding:'10px 14px',borderRadius:'20px',fontWeight:800,cursor:'pointer',fontSize:'12px'}}>👁️ Mark Read</button><button onClick={handleBulkDelete} style={{background:'#dc2626',color:'#fff',border:'none',padding:'10px 14px',borderRadius:'20px',fontWeight:800,cursor:'pointer'}}>🗑 {selected.length}</button></>}
          <select value={rowsPerPage} onChange={e=>setRowsPerPage(Number(e.target.value))} style={{padding:'8px 12px',borderRadius:'20px',border:`1px solid ${theme.border}`,background:theme.bgCard,color:theme.text,fontFamily:'Arial, sans-serif'}}><option value={5}>5</option><option value={10}>10</option><option value={20}>20</option><option value={30}>30</option><option value={40}>40</option><option value={50}>50</option><option value={60}>60</option><option value={70}>70</option><option value={80}>80</option><option value={90}>90</option><option value={100}>100</option></select>
        </div>

        {showFilters && <div style={{background:theme.bgCard,padding:'14px',borderRadius:'14px',border:`1px solid #facc15`,marginBottom:'12px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'10px'}}><b style={{fontSize:'13px'}}>🔍 Filters — {list.length} found</b><button onClick={clearFilters} style={{background:theme.bgMain,border:`1px solid ${theme.border}`,color:theme.text,padding:'6px 12px',borderRadius:'20px',fontWeight:800,cursor:'pointer',fontSize:'12px'}}>Clear All</button></div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:'8px'}}>
            {isContactTab ? <>
              <div><label style={{fontSize:'11px',fontWeight:800}}>Service</label><select value={filters.service} onChange={e=>setFilters({...filters,service:e.target.value})} style={filterSelect}><option value="">All Services</option>{serviceOptions.map(o=><option key={o} value={o}>{o}</option>)}</select></div>
            </> : <>
              <div><label style={{fontSize:'11px',fontWeight:800}}>Position</label><select value={filters.position} onChange={e=>setFilters({...filters,position:e.target.value})} style={filterSelect}><option value="">All Positions</option>{positionOptions.map(o=><option key={o} value={o}>{o}</option>)}</select></div>
              <div><label style={{fontSize:'11px',fontWeight:800}}>District</label><select value={filters.district} onChange={e=>setFilters({...filters,district:e.target.value})} style={filterSelect}><option value="">All Districts</option>{districtOptions.map(o=><option key={o} value={o}>{o}</option>)}</select></div>
              <div><label style={{fontSize:'11px',fontWeight:800}}>Education</label><select value={filters.education} onChange={e=>setFilters({...filters,education:e.target.value})} style={filterSelect}><option value="">All Education</option>{educationOptions.map(o=><option key={o} value={o}>{o}</option>)}</select></div>
            </>}
            <div><label style={{fontSize:'11px',fontWeight:800}}>Status</label><select value={filters.status} onChange={e=>setFilters({...filters,status:e.target.value})} style={filterSelect}><option value="">All Status</option>{statusOptions.map(o=><option key={o} value={o}>{o}</option>)}<option value="New">New</option><option value="Read">Read</option><option value="Contacted">Contacted</option><option value="Hired">Hired</option><option value="Rejected">Rejected</option></select></div>
            <div><label style={{fontSize:'11px',fontWeight:800}}>From Date</label><input type="date" value={filters.dateFrom} onChange={e=>setFilters({...filters,dateFrom:e.target.value})} style={filterSelect}/></div>
            <div><label style={{fontSize:'11px',fontWeight:800}}>To Date</label><input type="date" value={filters.dateTo} onChange={e=>setFilters({...filters,dateTo:e.target.value})} style={filterSelect}/></div>
          </div>
        </div>}

        {showTrash && <div style={{background:theme.bgCard,padding:'12px',borderRadius:'12px',border:'2px dashed #facc15',marginBottom:'12px'}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'8px'}}><b>🗑 Trash {trash.length} - Restore or Permanently Delete</b><div style={{display:'flex',gap:'6px'}}><button onClick={handleRestoreAll} style={{background:'#facc15',border:'none',padding:'7px 12px',borderRadius:'20px',fontWeight:900,cursor:'pointer',fontSize:'12px'}}>♻️ Restore All</button><button onClick={handleEmptyTrash} style={{background:'#dc2626',color:'#fff',border:'none',padding:'7px 12px',borderRadius:'20px',fontWeight:900,cursor:'pointer',fontSize:'12px'}}>❌ Empty Trash</button></div></div><div style={{display:'flex',gap:'6px',flexWrap:'wrap',marginTop:'8px'}}>{trash.map(t=><div key={t._uid} style={{background:theme.bgMain,padding:'6px 10px',borderRadius:'8px',fontSize:'11px',display:'flex',gap:'6px',alignItems:'center'}}>{getVal(t,['FullName','fullName'])} <button onClick={()=>handleRestore(t)} style={{background:'#facc15',border:'none',padding:'4px 8px',borderRadius:'6px',fontWeight:800,cursor:'pointer'}}>♻️ Restore</button><button onClick={()=>handlePermanentDelete(t)} style={{background:'#dc2626',color:'#fff',border:'none',padding:'4px 8px',borderRadius:'6px',fontWeight:800,cursor:'pointer'}}>❌ Delete Forever</button></div>)}</div></div>}

        <div style={{background:theme.bgCard,borderRadius:'14px',overflow:'hidden',border:`1px solid ${theme.border}`}}>
          <div style={{padding:'12px 16px',background:'#dc2626',color:'#ffffff',fontWeight:900,fontSize:'12px',fontFamily:'Arial, sans-serif'}}>{tab.toUpperCase()} — {list.length} rows — {loading?'Loading...':'Ready'}</div>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:'11px',minWidth:'100%',fontFamily:'Arial, sans-serif'}}>
              <thead><tr style={{background:'#dc2626',height:'18px'}}>
                <th style={headerStyle}><input type="checkbox" checked={paginatedList.length>0 && paginatedList.every(r=>selected.includes(r._uid))} onChange={()=>{ const ids=paginatedList.map(r=>r._uid); setSelected(ids.every(id=>selected.includes(id))?prev=>prev.filter(id=>!ids.includes(id)):prev=>[...new Set([...prev,...ids])]) }}/></th>
                <th style={headerStyle}>DATE</th><th style={headerStyle}>NAME</th><th style={headerStyle}>PHONE</th><th style={headerStyle}>EMAIL</th>
                {isContactTab ? <><th style={headerStyle}>SERVICE</th><th style={headerStyle}>MESSAGE</th></> : <><th style={headerStyle}>POSITION</th><th style={headerStyle}>EDUCATION</th><th style={headerStyle}>DISTRICT</th><th style={headerStyle}>EXPERIENCE</th><th style={headerStyle}>INTEREST</th></>}
                <th style={headerStyle}>STATUS</th><th style={stickyActionTh}>ACTIONS</th>
              </tr></thead>
              <tbody>{paginatedList.length===0 && <tr><td colSpan={colCount} style={{padding:'30px',textAlign:'center'}}>{loading?'Loading...':'No data - Ready for new submissions ✅'}</td></tr>}{paginatedList.map((d,i)=>{ const checked=selected.includes(d._uid); const bg = checked?'#422006':i%2===0?theme.bgCard:theme.bgMain; const st = getVal(d,['Status','status'])||'New'; return (<tr key={d._uid} style={{background:bg, height:'14.3px'}}><td style={{...cellStyle,background:bg}}><input type="checkbox" checked={checked} onChange={()=>setSelected(prev=>prev.includes(d._uid)?prev.filter(id=>id!==d._uid):[...prev,d._uid])}/></td><td style={{...cellStyle,background:bg}}>{formatDate(getVal(d,['Timestamp','timestamp']))}</td><td style={{...cellStyle,background:bg,fontWeight:800}}>{getVal(d,['FullName','fullName'])}</td><td style={{...cellStyle,background:bg}}>{getVal(d,['Phone','phone'])}</td><td style={{...cellStyle,background:bg}}>{getVal(d,['Email','email'])}</td>{isContactTab ? <><td style={{...cellStyle,background:bg}}>{getVal(d,['Service','service'])}</td><td style={{...cellStyle,background:bg,maxWidth:'180px'}}>{getVal(d,['Message','message','Messages'])}</td></> : <><td style={{...cellStyle,background:bg}}>{getVal(d,['Position','position'])}</td><td style={{...cellStyle,background:bg}}>{getVal(d,['Education','education'])}</td><td style={{...cellStyle,background:bg}}>{getVal(d,['District','district'])}</td><td style={{...cellStyle,background:bg}}>{getVal(d,['Experience','experience'])}</td><td style={{...cellStyle,background:bg,maxWidth:'150px'}}>{getVal(d,['Interest','interest'])}</td></>}<td style={{...cellStyle,background:bg}}><span onClick={()=>handleToggleStatus(d)} title="Click to turn New ↔ Read" style={{background: st==='Hired'?'#dcfce7':st==='Rejected'?'#fee2e2':st==='Read'?'#dbeafe':st==='Contacted'?'#e0e7ff':'#fef9c3', color:'#0f172a', padding:'1px 6px', borderRadius:'20px', fontWeight:800, fontSize:'10px', cursor:'pointer', display:'inline-block', whiteSpace:'nowrap', lineHeight:'14.3px'}}>{st==='New'?'🟡 New':st==='Read'?'👁️ Read':st} ↕</span></td><td style={stickyActionTd(bg)}><div style={{display:'flex',gap:'3px'}}><button onClick={()=>setDetailRow(d)} title="View Full Details" style={iconBtn('#dbeafe')}>👁️</button><button onClick={()=>handleEdit(d)} title="Edit" style={iconBtn('#facc15')}>✏️</button>{getVal(d,['Phone','phone']) ? <a href={getCallLink(d)} title={'Call '+getVal(d,['Phone','phone'])} style={iconBtn('#dcfce7')}>📞</a> : <span title="No Phone" style={iconBtn('#eee')}>📞</span>}{getVal(d,['Phone','phone']) ? <a href={getWhatsAppLink(d)} target="_blank" rel="noreferrer" title={'WhatsApp '+getVal(d,['Phone','phone'])} style={iconBtn('#25D366')}>💬</a> : <span title="No Phone" style={iconBtn('#eee')}>💬</span>}{getVal(d,['Email','email']) ? <a href={getMailLink(d)} title={'Send Email to '+getVal(d,['Email','email'])} style={iconBtn('#dbeafe')}>📧</a> : <span title="No Email" style={iconBtn('#eee')}>📧</span>}<button onClick={()=>handleDelete(d)} title="Move to Trash" style={iconBtn('#fee2e2')}>🗑️</button></div></td></tr>)})}</tbody>
            </table>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 16px',borderTop:`1px solid ${theme.border}`,flexWrap:'wrap',gap:'8px',background:theme.bgMain}}>
            <span style={{fontSize:'12px',fontWeight:700}}>Showing {list.length===0?0:(currentPage-1)*rowsPerPage+1}-{Math.min(currentPage*rowsPerPage, list.length)} of {list.length} • Page {currentPage} of {totalPages}</span>
            <div style={{display:'flex',gap:'6px',alignItems:'center'}}>
              <button disabled={currentPage===1} onClick={()=>setCurrentPage(1)} style={{padding:'6px 10px',borderRadius:'8px',border:`1px solid ${theme.border}`,background:theme.bgCard,color:theme.text,cursor:currentPage===1?'not-allowed':'pointer',fontWeight:800}}>« First</button>
              <button disabled={currentPage===1} onClick={()=>setCurrentPage(p=>Math.max(1,p-1))} style={{padding:'6px 10px',borderRadius:'8px',border:`1px solid ${theme.border}`,background:theme.bgCard,color:theme.text,cursor:currentPage===1?'not-allowed':'pointer',fontWeight:800}}>‹ Prev</button>
              {Array.from({length: Math.min(5, totalPages)}, (_,k)=>{
                let pg = currentPage<=3 ? k+1 : Math.min(totalPages-4, currentPage-2)+k;
                if(pg<1||pg>totalPages) return null;
                return <button key={pg} onClick={()=>setCurrentPage(pg)} style={{padding:'6px 11px',borderRadius:'8px',border:`1px solid ${theme.border}`,background:pg===currentPage?'#facc15':'transparent',color:pg===currentPage?'#0f172a':theme.text,fontWeight:900,cursor:'pointer'}}>{pg}</button>
              })}
              <button disabled={currentPage>=totalPages} onClick={()=>setCurrentPage(p=>Math.min(totalPages,p+1))} style={{padding:'6px 10px',borderRadius:'8px',border:`1px solid ${theme.border}`,background:theme.bgCard,color:theme.text,cursor:currentPage>=totalPages?'not-allowed':'pointer',fontWeight:800}}>Next ›</button>
              <button disabled={currentPage>=totalPages} onClick={()=>setCurrentPage(totalPages)} style={{padding:'6px 10px',borderRadius:'8px',border:`1px solid ${theme.border}`,background:theme.bgCard,color:theme.text,cursor:currentPage>=totalPages?'not-allowed':'pointer',fontWeight:800}}>Last »</button>
            </div>
          </div>
        </div>
      </div>
      {editRow && <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.5)',zIndex:10001,display:'flex',justifyContent:'center',alignItems:'center'}}><div style={{background:'#fff',borderRadius:'16px',padding:'20px',width:'90%',maxWidth:'400px',fontFamily:'Arial, sans-serif'}}><h3>Edit {form.FullName}</h3><div style={{display:'grid',gap:'8px',marginTop:'10px'}}>{["FullName","Phone","Email","Service","Position"].map(f=><input key={f} value={form[f]||''} onChange={e=>setForm({...form,[f]:e.target.value})} placeholder={f} style={{padding:'10px',borderRadius:'8px',border:'1px solid #ddd'}}/>)}<select value={form.Status} onChange={e=>setForm({...form, Status:e.target.value})} style={{padding:'10px',borderRadius:'8px',border:'1px solid #ddd'}}><option>New</option><option>Read</option><option>Contacted</option><option>Hired</option><option>Rejected</option></select></div><div style={{display:'flex',gap:'8px',marginTop:'10px'}}><button onClick={()=>setEditRow(null)} style={{flex:1,padding:'10px',borderRadius:'10px',border:'1px solid #ddd'}}>Cancel</button><button onClick={handleSave} style={{flex:1,background:'#0f172a',color:'#facc15',padding:'10px',borderRadius:'10px',fontWeight:900}}>Save to Admin & Sheet</button></div></div></div>}
      {detailRow && <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.6)',zIndex:10002,display:'flex',justifyContent:'center',alignItems:'center',padding:'16px'}} onClick={()=>setDetailRow(null)}><div style={{background:'#fff',borderRadius:'16px',padding:'22px',width:'100%',maxWidth:'480px',color:'#0f172a',maxHeight:'90vh',overflowY:'auto',fontFamily:'Arial, sans-serif'}} onClick={e=>e.stopPropagation()}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><h3 style={{fontWeight:900}}>👁️ View Details</h3><button onClick={()=>setDetailRow(null)} style={{border:'none',background:'#eee',width:'32px',height:'32px',borderRadius:'50%',cursor:'pointer',fontWeight:900}}>✕</button></div><div style={{marginTop:'14px',display:'grid',gap:'8px',fontSize:'14px',lineHeight:1.6}}><p><b>📅 Date:</b> {getVal(detailRow,['Timestamp','timestamp'])}</p><p><b>👤 Name:</b> {getVal(detailRow,['FullName','fullName'])}</p><p><b>📞 Phone:</b> {getVal(detailRow,['Phone','phone'])}</p><p><b>📧 Email:</b> {getVal(detailRow,['Email','email'])||'-'}</p>{getVal(detailRow,['Service','service']) && <p><b>🛡️ Service:</b> {getVal(detailRow,['Service','service'])}</p>}{getVal(detailRow,['Message','message']) && <p><b>💬 Message:</b> {getVal(detailRow,['Message','message'])}</p>}{getVal(detailRow,['Position','position']) && <p><b>🎖️ Position:</b> {getVal(detailRow,['Position','position'])}</p>}{getVal(detailRow,['Education','education']) && <p><b>🎓 Education:</b> {getVal(detailRow,['Education','education'])}</p>}{getVal(detailRow,['District','district']) && <p><b>📍 District:</b> {getVal(detailRow,['District','district'])}</p>}{getVal(detailRow,['Experience','experience']) && <p><b>💼 Experience:</b> {getVal(detailRow,['Experience','experience'])}</p>}{getVal(detailRow,['Interest','interest']) && <p><b>❤️ Interest:</b> {getVal(detailRow,['Interest','interest'])}</p>}<p><b>📌 Status:</b> {getVal(detailRow,['Status','status'])||'New'}</p></div><div style={{display:'flex',gap:'6px',marginTop:'16px',flexWrap:'wrap'}}><a href={getCallLink(detailRow)} style={{flex:1,background:'#dcfce7',color:'#0f172a',padding:'12px',borderRadius:'10px',fontWeight:900,textAlign:'center',textDecoration:'none'}}>📞 Call</a><a href={getWhatsAppLink(detailRow)} target="_blank" rel="noreferrer" style={{flex:1,background:'#25D366',color:'#fff',padding:'12px',borderRadius:'10px',fontWeight:900,textAlign:'center',textDecoration:'none'}}>💬 WhatsApp</a>{getVal(detailRow,['Email','email']) && <a href={getMailLink(detailRow)} style={{flex:1,background:'#dbeafe',color:'#0f172a',padding:'12px',borderRadius:'10px',fontWeight:900,textAlign:'center',textDecoration:'none'}}>📧 Email</a>}<button onClick={()=>{ setDetailRow(null); handleEdit(detailRow); }} style={{flex:1,background:'#facc15',padding:'12px',borderRadius:'10px',fontWeight:900,border:'none',cursor:'pointer'}}>✏️ Edit</button><button onClick={()=>{ setDetailRow(null); handleDelete(detailRow); }} style={{flex:1,background:'#fee2e2',color:'#dc2626',padding:'12px',borderRadius:'10px',fontWeight:900,border:'none',cursor:'pointer'}}>🗑️ Delete</button></div></div></div>}
      {showAdd && <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.6)',zIndex:10003,display:'flex',justifyContent:'center',alignItems:'center',padding:'16px'}} onClick={()=>setShowAdd(false)}><div style={{background:'#fff',borderRadius:'16px',padding:'22px',width:'100%',maxWidth:'480px',color:'#0f172a',maxHeight:'90vh',overflowY:'auto',fontFamily:'Arial, sans-serif'}} onClick={e=>e.stopPropagation()}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><h3 style={{fontWeight:900}}>➕ ADD NEW</h3><button onClick={()=>setShowAdd(false)} style={{border:'none',background:'#eee',width:'32px',height:'32px',borderRadius:'50%',cursor:'pointer',fontWeight:900}}>✕</button></div><div style={{display:'grid',gap:'8px',marginTop:'14px'}}><select value={addForm.Type} onChange={e=>setAddForm({...addForm, Type:e.target.value})} style={{padding:'10px',borderRadius:'8px',border:'1px solid #ddd',fontFamily:'Arial, sans-serif'}}><option value="contact">📞 Contact - Needs Security Service</option><option value="applicant">🎖️ Applicant - Wants Job</option></select><input value={addForm.FullName} onChange={e=>setAddForm({...addForm, FullName:e.target.value})} placeholder="Full Name *" style={{padding:'10px',borderRadius:'8px',border:'1px solid #ddd'}}/><input value={addForm.Phone} onChange={e=>setAddForm({...addForm, Phone:e.target.value})} placeholder="Phone * e.g 0785576219" style={{padding:'10px',borderRadius:'8px',border:'1px solid #ddd'}}/><input value={addForm.Email} onChange={e=>setAddForm({...addForm, Email:e.target.value})} placeholder="Email" style={{padding:'10px',borderRadius:'8px',border:'1px solid #ddd'}}/>{addForm.Type==='contact' ? <><input value={addForm.Service} onChange={e=>setAddForm({...addForm, Service:e.target.value})} placeholder="Service e.g Security Guard" style={{padding:'10px',borderRadius:'8px',border:'1px solid #ddd'}}/><input value={addForm.Message} onChange={e=>setAddForm({...addForm, Message:e.target.value})} placeholder="Message" style={{padding:'10px',borderRadius:'8px',border:'1px solid #ddd'}}/></> : <><input value={addForm.Position} onChange={e=>setAddForm({...addForm, Position:e.target.value})} placeholder="Position e.g SECURITY OFFICER" style={{padding:'10px',borderRadius:'8px',border:'1px solid #ddd'}}/><input value={addForm.Education} onChange={e=>setAddForm({...addForm, Education:e.target.value})} placeholder="Education e.g UACE / Degree" style={{padding:'10px',borderRadius:'8px',border:'1px solid #ddd'}}/><input value={addForm.District} onChange={e=>setAddForm({...addForm, District:e.target.value})} placeholder="District e.g Gulu" style={{padding:'10px',borderRadius:'8px',border:'1px solid #ddd'}}/><input value={addForm.Experience} onChange={e=>setAddForm({...addForm, Experience:e.target.value})} placeholder="Experience years e.g 4" style={{padding:'10px',borderRadius:'8px',border:'1px solid #ddd'}}/><input value={addForm.Interest} onChange={e=>setAddForm({...addForm, Interest:e.target.value})} placeholder="Interest e.g Work / Experience" style={{padding:'10px',borderRadius:'8px',border:'1px solid #ddd'}}/></>}</div><div style={{display:'flex',gap:'8px',marginTop:'14px'}}><button onClick={()=>setShowAdd(false)} style={{flex:1,padding:'12px',borderRadius:'10px',border:'1px solid #ddd',fontWeight:800}}>Cancel</button><button onClick={handleAddSave} style={{flex:1,background:'#0f172a',color:'#facc15',padding:'12px',borderRadius:'10px',fontWeight:900,border:'none',cursor:'pointer'}}>✅ Save to Admin & Sheet</button></div></div></div>}
    </div>
  )
}
export default AdminDashboard;