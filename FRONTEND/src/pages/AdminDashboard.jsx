import React, { useState, useEffect, useMemo } from 'react';

const PASSWORD = "Rubangakene";
const WEBHOOK = "https://script.google.com/macros/s/AKfycbz0Fx9gSfPwPXZdi8pivw9IdQ_fzj707fPk22GBECuGYhGzwePtEPZV47TyXk8TN8bggQ/exec";
const NAVY = "#0A1931";
const STATUSES = ["New","Contacted","Rejected","Hired","Resolved"];
const PAGE_SIZE = 8;

export default function AdminDashboard() {
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState("home"); // home | contacts | applicants | all | trash
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest"); // newest | oldest | az
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterService, setFilterService] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState(null); // popup detail
  const [statusMap, setStatusMap] = useState(()=>{ try{ return JSON.parse(localStorage.getItem("psl_status")||"{}"); }catch{ return {}; } });
  const [trash, setTrash] = useState(()=>{ try{ return JSON.parse(localStorage.getItem("psl_trash")||"[]"); }catch{ return []; } });
  const [toast, setToast] = useState("");

  const showToast = (m) => { setToast(m); setTimeout(()=>setToast(""), 2500); };

  const saveStatus = (obj) => { setStatusMap(obj); localStorage.setItem("psl_status", JSON.stringify(obj)); };
  const saveTrash = (arr) => { setTrash(arr); localStorage.setItem("psl_trash", JSON.stringify(arr)); };

  useEffect(()=>{
    const p = new URLSearchParams(window.location.search);
    const v = p.get("view");
    if(v==="contacts"||v==="applicants"||v==="all"||v==="trash") setPage(v);
  },[]);

  const login = () => { if (pass.trim() === PASSWORD) setAuth(true); else alert("Wrong Password!"); };

  const getVal = (o, keys) => {
    if(!o) return "";
    for(let k of keys){ if(o[k] !== undefined && o[k] !== null && o[k] !== "") return o[k]; }
    const low = {};
    Object.keys(o).forEach(k=> low[k.toLowerCase()] = o[k]);
    for(let k of keys){ if(low[k.toLowerCase()]) return low[k.toLowerCase()]; }
    return "";
  };

  const isApplicant = (d) => {
    const t = String(getVal(d, ["Type","type"]) || "").toLowerCase();
    if(t === "applicant") return true;
    if(t === "contact") return false;
    return !!getVal(d, ["Position","position"]);
  };

  const getId = (d) => String(getVal(d,["Timestamp","timestamp"]) || d._id || "");
  const getStatus = (d) => statusMap[getId(d)] || "New";
  const shortDate = (ts) => { if(!ts) return "-"; return String(ts).split(" ")[0]; };

  const load = () => {
    setLoading(true);
    const cb = "psl_cb_" + Date.now();
    const old = document.getElementById("psl_jsonp"); if(old) old.remove();
    window[cb] = (d) => {
      try {
        const arr = Array.isArray(d) ? d : (d.data || []);
        const clean = arr.filter(r => r.Timestamp || r.timestamp).map((r,i)=>({...r, _id: (r.Timestamp||r.timestamp)+"_"+i}));
        // remove trashed
        const trashIds = new Set(JSON.parse(localStorage.getItem("psl_trash")||"[]").map(t=>t._id));
        setData(clean.filter(r=>!trashIds.has(r._id)));
      } catch(e){ console.log(e); }
      setLoading(false);
      delete window[cb];
      const s = document.getElementById("psl_jsonp"); if(s) s.remove();
    };
    const s = document.createElement("script");
    s.id = "psl_jsonp";
    s.src = WEBHOOK + "?callback=" + cb + "&cache=" + Date.now();
    s.onerror = () => { setLoading(false); showToast("Load failed"); };
    document.body.appendChild(s);
  };

  useEffect(()=>{ if(auth) load(); },[auth]);

  if(!auth){
    return (
      <div style={{minHeight:'100vh', background:NAVY, display:'flex', justifyContent:'center', alignItems:'center', fontFamily:'Arial'}}>
        <div style={{background:'#fff', padding:'28px', borderRadius:'6px', width:'92%', maxWidth:'360px', textAlign:'center'}}>
          <div style={{width:'52px', height:'52px', background:NAVY, borderRadius:'6px', margin:'0 auto 10px', display:'grid', placeItems:'center', color:'#fff', fontWeight:900, fontSize:'24px'}}>P</div>
          <h2 style={{color:NAVY, margin:0, fontSize:'19px'}}>PINNACLE ADMIN</h2>
          <input type="password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&login()} placeholder="Password" style={{width:'100%', padding:'12px', borderRadius:'6px', marginTop:'14px', border:'1px solid #ddd', boxSizing:'border-box'}} />
          <button onClick={login} style={{width:'100%', marginTop:'10px', background:NAVY, color:'#fff', padding:'13px', border:'none', borderRadius:'6px', fontWeight:800, cursor:'pointer'}}>UNLOCK</button>
        </div>
      </div>
    );
  }

  const contacts = data.filter(d=>!isApplicant(d));
  const applicants = data.filter(d=>isApplicant(d));
  const todayStr = new Date().toLocaleDateString('en-GB');
  const todayCount = data.filter(d => String(getVal(d,["Timestamp","timestamp"])||"").startsWith(todayStr)).length;

  const openList = (view) => { setPage(view); setSearch(""); setFilterStatus("All"); setFilterService("All"); setSort("newest"); setCurrentPage(1); window.history.pushState({}, "", "/admin?view=" + view); window.scrollTo(0,0); };
  const backHome = () => { setPage("home"); setSearch(""); window.history.pushState({}, "", "/admin"); };

  const waLink = (d) => {
    let p = String(getVal(d,["Phone","phone"])||"").replace(/\s/g,"").replace(/^\+/,"");
    if(p.startsWith("0")) p = "256"+p.slice(1);
    const text = `Hello ${getVal(d,["FullName","fullName"])}, this is Pinnacle Security Ltd, Muyenga. Thank you for contacting us. We will call you soon. Control 24/7: 0776971970.`;
    return `https://wa.me/${p}?text=${encodeURIComponent(text)}`;
  };

  const changeStatus = (d, newStatus) => {
    const obj = {...statusMap, [getId(d)]: newStatus};
    saveStatus(obj);
    if(selected) setSelected({...selected, __status:newStatus});
    showToast("Status: " + newStatus);
  };

  const moveToTrash = (d) => {
    if(!confirm("Move " + getVal(d,["FullName","fullName"]) + " to Trash?")) return;
    const newTrash = [...trash, d];
    saveTrash(newTrash);
    setData(prev=>prev.filter(r=>r._id!==d._id));
    setSelected(null);
    showToast("Moved to Trash");
  };

  const restoreFromTrash = (d) => {
    saveTrash(trash.filter(t=>t._id!==d._id));
    setData(prev=>[...prev, d]);
    setSelected(null);
    showToast("Restored");
  };

  const deleteForever = async (d) => {
    if(!confirm("Delete FOREVER " + getVal(d,["FullName","fullName"]) + "?")) return;
    saveTrash(trash.filter(t=>t._id!==d._id));
    setSelected(null);
    const ts = getVal(d,["Timestamp","timestamp"]);
    await fetch(WEBHOOK,{method:'POST', mode:'no-cors', headers:{'Content-Type':'text/plain'}, body: JSON.stringify({action:'delete', timestamps:[ts], Timestamp: ts})});
    showToast("Deleted forever");
  };

  const printPDF = () => {
    const d = selected; if(!d) return;
    const w = window.open("", "_blank");
    w.document.write(`<html><head><title>${getVal(d,["FullName","fullName"])}</title><style>body{font-family:Arial;padding:30px}h1{color:#0A1931}table{width:100%;border-collapse:collapse}td{border:1px solid #ddd;padding:10px}b{color:#0A1931}</style></head><body><h1>PINNACLE SECURITY LTD</h1><h2>${getVal(d,["FullName","fullName"])} - ${isApplicant(d)?"APPLICANT":"CONTACT"}</h2><table>
    <tr><td><b>Phone</b></td><td>${getVal(d,["Phone","phone"])}</td></tr>
    <tr><td><b>Email</b></td><td>${getVal(d,["Email","email"])||"-"}</td></tr>
    <tr><td><b>Service</b></td><td>${getVal(d,["Service","service"])||"-"}</td></tr>
    <tr><td><b>Position</b></td><td>${getVal(d,["Position","position"])||"-"}</td></tr>
    <tr><td><b>District</b></td><td>${getVal(d,["District","district"])||"-"}</td></tr>
    <tr><td><b>Education</b></td><td>${getVal(d,["Education","education"])||"-"}</td></tr>
    <tr><td><b>Experience</b></td><td>${getVal(d,["Experience","experience"])||"-"}</td></tr>
    <tr><td><b>Status</b></td><td>${getStatus(d)}</td></tr>
    <tr><td><b>Date</b></td><td>${getVal(d,["Timestamp","timestamp"])}</td></tr>
    <tr><td><b>Message</b></td><td>${getVal(d,["Message","Messages","message","messages"])||"-"}</td></tr>
    </table><p>Control 24/7: 0776971970 | Muyenga, Kampala</p></body></html>`);
    w.document.close(); setTimeout(()=>w.print(), 400);
  };

  const statusColor = (s) => s==="New" ? "#e0e7ff" : s==="Contacted" ? "#fef9c3" : s==="Rejected" ? "#fee2e2" : s==="Hired" ? "#dcfce7" : "#dbeafe";

  // ===== TABLE LOGIC - APPLIES TO EACH BOX =====
  const baseList = page==="contacts" ? contacts : page==="applicants" ? applicants : page==="trash" ? trash : data;
  const services = useMemo(()=>["All", ...new Set(baseList.map(d=>getVal(d,["Service","service"])||getVal(d,["Position","position"])).filter(Boolean))], [baseList, page]);

  const filtered = useMemo(()=>{
    let list = [...baseList];
    if(search.trim()){
      const s = search.toLowerCase();
      list = list.filter(d=>`${getVal(d,["FullName","fullName"])} ${getVal(d,["Phone","phone"])} ${getVal(d,["Service","service"])} ${getVal(d,["Position","position"])} ${getVal(d,["District","district"])}`.toLowerCase().includes(s));
    }
    if(filterStatus!=="All") list = list.filter(d=>getStatus(d)===filterStatus);
    if(filterService!=="All") list = list.filter(d=>(getVal(d,["Service","service"])||getVal(d,["Position","position"]))===filterService);
    if(sort==="newest") list.reverse();
    if(sort==="az") list.sort((a,b)=>String(getVal(a,["FullName","fullName"])).localeCompare(String(getVal(b,["FullName","fullName"]))));
    return list;
  },[baseList, search, filterStatus, filterService, sort, statusMap]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paged = filtered.slice((safePage-1)*PAGE_SIZE, safePage*PAGE_SIZE);
  const title = page==="contacts" ? "Contacts" : page==="applicants" ? "Applicants" : page==="trash" ? "Trash" : "All";

  const exportCSV = () => {
    if(!filtered.length) return showToast("No rows");
    const head = page==="applicants" ? ["Name","Phone","Position","District","Education","Status","Date"] : page==="contacts" ? ["Name","Phone","Service","Status","Date"] : ["Name","Phone","Type","Service/Position","District","Education","Status","Date"];
    const csv = "\uFEFF" + [head.join(",")].concat(filtered.map(r=>{
      const name = getVal(r,["FullName","fullName"]); const phone = getVal(r,["Phone","phone"]); const date = shortDate(getVal(r,["Timestamp","timestamp"]));
      let row=[];
      if(page==="applicants") row=[name,phone,getVal(r,["Position","position"]),getVal(r,["District","district"]),getVal(r,["Education","education"]),getStatus(r),date];
      else if(page==="contacts") row=[name,phone,getVal(r,["Service","service"]),getStatus(r),date];
      else row=[name,phone,isApplicant(r)?"APPLICANT":"CONTACT",getVal(r,["Service","service"])||getVal(r,["Position","position"]),getVal(r,["District","district"]),getVal(r,["Education","education"]),getStatus(r),date];
      return row.map(v=>`"${String(v||"").replace(/"/g,'""')}"`).join(",");
    })).join("\n");
    const blob = new Blob([csv],{type:"text/csv"}); const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download=`pinnacle_${page}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  const th = {background:NAVY, color:'#fff', padding:'10px 8px', fontSize:'12px', textAlign:'left', whiteSpace:'nowrap'};
  const td = {padding:'10px 8px', fontSize:'13px', borderBottom:'1px solid #eee', whiteSpace:'nowrap'};
  const iconBtn = {background:'#fff', border:'1px solid #e5e5e5', borderRadius:'6px', width:'36px', height:'36px', display:'grid', placeItems:'center', cursor:'pointer', fontSize:'16px'};

  // ===== POPUP MODAL - TAP DETAIL =====
  const Popup = () => {
    if(!selected) return null;
    const d = selected;
    return (
      <div onClick={()=>setSelected(null)} style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:9999, display:'flex', alignItems:'flex-end', justifyContent:'center'}}>
        <div onClick={e=>e.stopPropagation()} style={{background:'#fff', width:'100%', maxWidth:'520px', borderRadius:'16px 16px 0 0', padding:'18px', maxHeight:'90vh', overflowY:'auto', fontFamily:'Arial'}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <h3 style={{margin:0, color:NAVY}}>{getVal(d,["FullName","fullName"])}</h3>
            <button onClick={()=>setSelected(null)} style={{border:'none', background:'#f1f5f9', borderRadius:'50%', width:'30px', height:'30px', cursor:'pointer', fontWeight:900}}>✕</button>
          </div>
          <span style={{display:'inline-block', marginTop:'8px', fontSize:'11px', background: statusColor(getStatus(d)), padding:'5px 10px', borderRadius:'20px', fontWeight:800}}>{getStatus(d)} • {isApplicant(d)?"APPLICANT":"CONTACT"}</span>
          <div style={{display:'grid', gap:'10px', fontSize:'14px', marginTop:'12px'}}>
            <div><b>📞 Phone:</b> {getVal(d,["Phone","phone"])}</div>
            <div><b>📧 Email:</b> {getVal(d,["Email","email"]) || "-"}</div>
            {getVal(d,["Service","service"]) && <div><b>🛡️ Service:</b> {getVal(d,["Service","service"])}</div>}
            {getVal(d,["Position","position"]) && <div><b>💼 Position:</b> {getVal(d,["Position","position"])}</div>}
            {getVal(d,["Education","education"]) && <div><b>🎓 Education:</b> {getVal(d,["Education","education"])}</div>}
            {getVal(d,["District","district"]) && <div><b>📍 District:</b> {getVal(d,["District","district"])}</div>}
            {getVal(d,["Experience","experience"]) && <div><b>⏳ Experience:</b> {getVal(d,["Experience","experience"])}</div>}
            <div><b>📅 Date:</b> {getVal(d,["Timestamp","timestamp"])}</div>
            {getVal(d,["Message","Messages","message","messages"]) && <div style={{background:'#f8fafc', padding:'11px', borderRadius:'8px'}}><b>💬 Message:</b><br/>{getVal(d,["Message","Messages","message","messages"])}</div>}
          </div>

          {/* STATUS - HOW TO RESOLVE */}
          <div style={{marginTop:'14px', background:'#f8fafc', padding:'12px', borderRadius:'8px'}}>
            <b style={{fontSize:'13px'}}>✅ Resolve / Status:</b>
            <div style={{display:'flex', gap:'6px', flexWrap:'wrap', marginTop:'8px'}}>
              {STATUSES.map(s=>(
                <button key={s} onClick={()=>changeStatus(d,s)} style={{background: getStatus(d)===s?NAVY:'#fff', color: getStatus(d)===s?'#fff':NAVY, border:'1px solid #ddd', padding:'7px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:800, cursor:'pointer'}}>{s}</button>
              ))}
            </div>
            <p style={{fontSize:'11px', color:'#666', margin:'8px 0 0'}}>New = just came • Contacted = you called them • Rejected = not qualified • Hired = you took them • Resolved = job done</p>
          </div>

          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginTop:'14px'}}>
            <a href={`tel:${getVal(d,["Phone","phone"])}`} style={{background:NAVY, color:'#fff', padding:'13px', borderRadius:'6px', fontWeight:800, fontSize:'12px', textDecoration:'none', textAlign:'center'}}>📞 CALL</a>
            <a href={waLink(d)} target="_blank" rel="noreferrer" style={{background:'#25D366', color:'#fff', padding:'13px', borderRadius:'6px', fontWeight:800, fontSize:'12px', textDecoration:'none', textAlign:'center'}}>💬 WHATSAPP</a>
            <a href={`mailto:${getVal(d,["Email","email"])}`} style={{background:'#2563eb', color:'#fff', padding:'13px', borderRadius:'6px', fontWeight:800, fontSize:'12px', textDecoration:'none', textAlign:'center'}}>📧 EMAIL</a>
            <button onClick={printPDF} style={{background:'#facc15', color:'#000', border:'none', padding:'13px', borderRadius:'6px', fontWeight:800, fontSize:'12px', cursor:'pointer'}}>🖨️ PDF / PRINT</button>
            {page!=="trash" ? (
              <>
                <button onClick={()=>moveToTrash(d)} style={{background:'#fff', color:'#dc2626', border:'1px solid #fecaca', padding:'13px', borderRadius:'6px', fontWeight:800, fontSize:'12px', cursor:'pointer', gridColumn:'span 2'}}>🗑️ MOVE TO TRASH</button>
              </>
            ) : (
              <>
                <button onClick={()=>restoreFromTrash(d)} style={{background:'#059669', color:'#fff', border:'none', padding:'13px', borderRadius:'6px', fontWeight:800, fontSize:'12px', cursor:'pointer'}}>♻️ RESTORE</button>
                <button onClick={()=>deleteForever(d)} style={{background:'#dc2626', color:'#fff', border:'none', padding:'13px', borderRadius:'6px', fontWeight:800, fontSize:'12px', cursor:'pointer'}}>❌ DELETE FOREVER</button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ===== TABLE PAGE - FOR EACH BOX =====
  if(page!=="home"){
    return (
      <div style={{background:'#f8fafc', minHeight:'100vh', fontFamily:'Arial'}}>
        {toast && <div style={{position:'fixed', top:'16px', right:'16px', background:'#000', color:'#fff', padding:'10px 14px', borderRadius:'20px', fontWeight:800, zIndex:10000, fontSize:'13px'}}>{toast}</div>}
        <div style={{background:NAVY, color:'#fff', padding:'12px 14px', display:'flex', justifyContent:'space-between', alignItems:'center', position:'sticky', top:0, zIndex:100}}>
          <b style={{fontSize:'13px'}}>PINNACLE SECURITY LTD</b>
          <div style={{display:'flex', gap:'8px'}}>
            <button onClick={backHome} style={{...iconBtn, background:'transparent', border:'none', color:'#fff'}}>🏠</button>
            <button onClick={()=>openList("all")} style={{...iconBtn, background:'transparent', border:'none', color:'#fff'}}>📦</button>
            <button onClick={()=>openList("trash")} style={{...iconBtn, background:'transparent', border:'none', color:'#fff'}}>🗑️<span style={{fontSize:'10px', fontWeight:900, background:'#dc2626', color:'#fff', borderRadius:'10px', padding:'0 4px', marginLeft:'2px'}}>{trash.length}</span></button>
          </div>
        </div>
        <div style={{maxWidth:'900px', margin:'0 auto', padding:'14px'}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <button onClick={backHome} style={{background:NAVY, color:'#fff', border:'none', padding:'9px 14px', borderRadius:'6px', fontWeight:800, fontSize:'12px', cursor:'pointer'}}>⬅ Back</button>
            <h2 style={{margin:0, color:NAVY, fontSize:'18px'}}>{title} Table <span style={{fontSize:'13px', color:'#666'}}>({filtered.length})</span></h2>
            <div style={{display:'flex', gap:'6px'}}>
              <button onClick={exportCSV} style={{background:'#2563eb', color:'#fff', border:'none', padding:'9px 10px', borderRadius:'6px', fontWeight:800, fontSize:'11px', cursor:'pointer'}}>CSV</button>
              <button onClick={()=>window.print()} style={{background:'#facc15', color:'#000', border:'none', padding:'9px 10px', borderRadius:'6px', fontWeight:800, fontSize:'11px', cursor:'pointer'}}>🖨️ PDF</button>
            </div>
          </div>

          {/* SEARCH + SORT + FILTER - ALL IN ONE LINE, VISIBLE */}
          <div style={{display:'flex', gap:'6px', marginTop:'12px', flexWrap:'wrap'}}>
            <input value={search} onChange={e=>{setSearch(e.target.value); setCurrentPage(1);}} placeholder="🔍 Search name, phone..." style={{flex:'1 1 160px', padding:'10px 12px', borderRadius:'6px', border:'1px solid #ddd', fontSize:'13px', outline:'none', background:'#fff'}} />
            <select value={sort} onChange={e=>setSort(e.target.value)} style={{padding:'10px 8px', borderRadius:'6px', border:'1px solid #ddd', fontSize:'12px', background:'#fff', fontWeight:700}}>
              <option value="newest">↕ Newest</option><option value="oldest">↕ Oldest</option><option value="az">↕ A-Z</option>
            </select>
            <select value={filterStatus} onChange={e=>{setFilterStatus(e.target.value); setCurrentPage(1);}} style={{padding:'10px 8px', borderRadius:'6px', border:'1px solid #ddd', fontSize:'12px', background:'#fff', fontWeight:700}}>
              <option value="All">All Status</option>{STATUSES.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
            <select value={filterService} onChange={e=>{setFilterService(e.target.value); setCurrentPage(1);}} style={{padding:'10px 8px', borderRadius:'6px', border:'1px solid #ddd', fontSize:'12px', background:'#fff', fontWeight:700, maxWidth:'130px'}}>
              {services.map(s=><option key={s} value={s}>{s==="All"?"All Service":s}</option>)}
            </select>
          </div>

          {/* TABLE - MORE COLUMNS ON ALL */}
          <div style={{background:'#fff', borderRadius:'6px', overflow:'hidden', marginTop:'12px', border:'1px solid #eee'}}>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%', borderCollapse:'collapse', minWidth:'680px'}}>
                <thead><tr>
                  <th style={th}>Name</th><th style={th}>Phone</th>
                  {page==="contacts" && <><th style={th}>Service</th><th style={th}>Status</th></>}
                  {page==="applicants" && <><th style={th}>Position</th><th style={th}>District</th><th style={th}>Education</th><th style={th}>Status</th></>}
                  {page==="all" && <><th style={th}>Type</th><th style={th}>Service / Position</th><th style={th}>District</th><th style={th}>Education</th><th style={th}>Status</th></>}
                  {page==="trash" && <><th style={th}>Type</th><th style={th}>Status</th></>}
                  <th style={th}>Date</th><th style={th}></th>
                </tr></thead>
                <tbody>
                  {paged.map(d=>(
                    <tr key={d._id} onClick={()=>setSelected(d)} style={{cursor:'pointer'}}>
                      <td style={{...td, fontWeight:800, color:NAVY}}>{getVal(d,["FullName","fullName"])}</td>
                      <td style={td}>{getVal(d,["Phone","phone"])}</td>
                      {page==="contacts" && <><td style={td}>{getVal(d,["Service","service"])||"-"}</td><td style={td}><span style={{fontSize:'11px', background:statusColor(getStatus(d)), padding:'4px 8px', borderRadius:'20px', fontWeight:800}}>{getStatus(d)}</span></td></>}
                      {page==="applicants" && <><td style={td}>{getVal(d,["Position","position"])||"-"}</td><td style={td}>{getVal(d,["District","district"])||"-"}</td><td style={td}>{getVal(d,["Education","education"])||"-"}</td><td style={td}><span style={{fontSize:'11px', background:statusColor(getStatus(d)), padding:'4px 8px', borderRadius:'20px', fontWeight:800}}>{getStatus(d)}</span></td></>}
                      {page==="all" && <><td style={td}><span style={{fontSize:'11px', background: isApplicant(d)?'#fee2e2':'#dcfce7', padding:'3px 7px', borderRadius:'20px', fontWeight:800}}>{isApplicant(d)?"APPLICANT":"CONTACT"}</span></td><td style={td}>{getVal(d,["Service","service"])||getVal(d,["Position","position"])||"-"}</td><td style={td}>{getVal(d,["District","district"])||"-"}</td><td style={td}>{getVal(d,["Education","education"])||"-"}</td><td style={td}><span style={{fontSize:'11px', background:statusColor(getStatus(d)), padding:'4px 8px', borderRadius:'20px', fontWeight:800}}>{getStatus(d)}</span></td></>}
                      {page==="trash" && <><td style={td}>{isApplicant(d)?"APPLICANT":"CONTACT"}</td><td style={td}><span style={{fontSize:'11px', background:statusColor(getStatus(d)), padding:'4px 8px', borderRadius:'20px', fontWeight:800}}>{getStatus(d)}</span></td></>}
                      <td style={td}>{shortDate(getVal(d,["Timestamp","timestamp"]))}</td>
                      <td style={{...td, color:NAVY, fontWeight:900}}>›</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {paged.length===0 && !loading && <p style={{textAlign:'center', color:'#888', padding:'18px'}}>No {title} yet</p>}
            {loading && <p style={{textAlign:'center', padding:'14px'}}>Loading...</p>}
          </div>

          {/* PAGINATION */}
          <div style={{display:'flex', justifyContent:'center', alignItems:'center', gap:'8px', marginTop:'14px'}}>
            <button disabled={safePage<=1} onClick={()=>setCurrentPage(safePage-1)} style={{background: safePage<=1?'#e5e7eb':NAVY, color: safePage<=1?'#999':'#fff', border:'none', padding:'9px 14px', borderRadius:'6px', fontWeight:800, fontSize:'12px', cursor:'pointer'}}>⬅ Prev</button>
            <span style={{fontSize:'13px', fontWeight:800, color:NAVY}}>Page {safePage} / {totalPages}</span>
            <button disabled={safePage>=totalPages} onClick={()=>setCurrentPage(safePage+1)} style={{background: safePage>=totalPages?'#e5e7eb':NAVY, color: safePage>=totalPages?'#999':'#fff', border:'none', padding:'9px 14px', borderRadius:'6px', fontWeight:800, fontSize:'12px', cursor:'pointer'}}>Next ➡</button>
          </div>
          <p style={{fontSize:'12px', color:'#888', textAlign:'center', marginTop:'8px'}}>Tap any row to open detail popup • CRUD in popup</p>
        </div>
        <Popup />
      </div>
    );
  }

  // ========== HOME - FIRST DESIGN - NO WELCOME, NO SEARCH, NO REFRESH, NO SEARCH BTN ==========
  const smallBox = {background:'#fff', borderRadius:'4px', padding:'20px 8px 18px', cursor:'pointer', textAlign:'center', boxShadow:'0 1px 2px rgba(0,0,0,0.04)'};
  return (
    <div style={{background:'#f8fafc', minHeight:'100vh', fontFamily:'Arial', padding:'0'}}>
      {toast && <div style={{position:'fixed', top:'16px', right:'16px', background:'#000', color:'#fff', padding:'10px 14px', borderRadius:'20px', fontWeight:800, zIndex:10000, fontSize:'13px'}}>{toast}</div>}
      {/* TOP BAR WITH ICONS */}
      <div style={{background:NAVY, color:'#fff', padding:'12px 14px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <b style={{fontSize:'13px', letterSpacing:'0.2px'}}>PINNACLE SECURITY LIMITED</b>
        <div style={{display:'flex', gap:'6px', alignItems:'center'}}>
          <a href="/" style={{...iconBtn, background:'transparent', border:'none', color:'#fff', textDecoration:'none', fontSize:'18px'}} title="Home - Go to Website">🏠</a>
          <button onClick={()=>openList("all")} style={{...iconBtn, background:'transparent', border:'none', color:'#fff'}} title="All Boxes">📦</button>
          <button onClick={()=>openList("trash")} style={{...iconBtn, background:'transparent', border:'none', color:'#fff', position:'relative'}} title="Trash">🗑️{trash.length>0 && <span style={{position:'absolute', top:'2px', right:'2px', fontSize:'9px', fontWeight:900, background:'#dc2626', color:'#fff', borderRadius:'10px', padding:'1px 4px'}}>{trash.length}</span>}</button>
          <button onClick={()=>setAuth(false)} style={{...iconBtn, background:'transparent', border:'none', color:'#fff', fontSize:'12px', fontWeight:800}}>LOGOUT</button>
        </div>
      </div>

      <div style={{maxWidth:'520px', margin:'0 auto', padding:'16px 14px 20px'}}>
        {/* SMALL BOXES ONLY - TAP TO OPEN - NO WELCOME, NO SEARCH */}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginTop:'6px'}}>
          <div onClick={()=>openList("contacts")} style={smallBox}>
            <div style={{fontSize:'18px', fontWeight:800, color:NAVY, lineHeight:'1'}}>{contacts.length}</div>
            <div style={{fontSize:'13px', color:'#666', marginTop:'8px'}}>Contacts</div>
          </div>
          <div onClick={()=>openList("applicants")} style={smallBox}>
            <div style={{fontSize:'18px', fontWeight:800, color:'#dc2626', lineHeight:'1'}}>{applicants.length}</div>
            <div style={{fontSize:'13px', color:'#666', marginTop:'8px'}}>Applicants</div>
          </div>
          <div onClick={()=>openList("all")} style={smallBox}>
            <div style={{fontSize:'18px', fontWeight:800, color:'#2563eb', lineHeight:'1'}}>{data.length}</div>
            <div style={{fontSize:'13px', color:'#666', marginTop:'8px'}}>All</div>
          </div>
          <div onClick={()=>openList("trash")} style={smallBox}>
            <div style={{fontSize:'18px', fontWeight:800, color:'#f59e0b', lineHeight:'1'}}>{trash.length}</div>
            <div style={{fontSize:'13px', color:'#666', marginTop:'8px'}}>Trash</div>
          </div>
        </div>

        <p style={{fontSize:'12px', color:'#888', textAlign:'center', marginTop:'18px'}}>Tap any box to open its table</p>
        {loading && <p style={{textAlign:'center', fontSize:'12px', color:'#888'}}>Loading...</p>}
      </div>
      <Popup />
    </div>
  );
}