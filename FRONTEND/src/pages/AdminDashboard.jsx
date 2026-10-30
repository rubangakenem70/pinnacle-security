import React, { useState, useEffect } from 'react';

const PASSWORD = "Rubangakene";
const WEBHOOK = "https://script.google.com/macros/s/AKfycbz0Fx9gSfPwPXZdi8pivw9IdQ_fzj707fPk22GBECuGYhGzwePtEPZV47TyXk8TN8bggQ/exec";
const NAVY = "#0A1931";
const PAGE_SIZE = 8;

function safeParse(str, fallback){
  try{ const v = JSON.parse(str); return v==null?fallback:v; }catch(e){ return fallback; }
}

export default function AdminDashboard() {
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState("home");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterService, setFilterService] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [expanded, setExpanded] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [statusMap, setStatusMap] = useState(function(){ return safeParse(localStorage.getItem("psl_status")||"{}", {}); });
  const [trash, setTrash] = useState(function(){ return safeParse(localStorage.getItem("psl_trash")||"[]", []); });
  const [toast, setToast] = useState("");

  const showToast = function(m){ setToast(m); setTimeout(function(){ setToast(""); }, 2500); };
  const username = "Admin";

  useEffect(function(){
    try{
      const p = new URLSearchParams(window.location.search);
      const v = p.get("view");
      if(v==="contacts"||v==="applicants"||v==="all"||v==="trash") setPage(v);
    }catch(e){}
  },[]);

  const login = function(){ if(pass.trim()===PASSWORD) setAuth(true); else alert("Wrong Password!"); };

  const getVal = function(o, keys){
    if(!o) return "";
    for(let i=0;i<keys.length;i++){ const k=keys[i]; if(o[k]!==undefined && o[k]!==null && o[k]!=="") return o[k]; }
    const low={};
    Object.keys(o).forEach(function(k){ low[k.toLowerCase()]=o[k]; });
    for(let i=0;i<keys.length;i++){ const v=low[keys[i].toLowerCase()]; if(v) return v; }
    return "";
  };

  const isApplicant = function(d){
    const t = String(getVal(d,["Type","type"])||"").toLowerCase();
    if(t==="applicant") return true;
    if(t==="contact") return false;
    return !!getVal(d,["Position","position"]);
  };

  const getId = function(d){ return String(getVal(d,["Timestamp","timestamp"])||d._id||""); };
  // STATUS BY TYPE
  const statusOptions = function(d){
    if(isApplicant(d)) return ["New","Contacted","Rejected","Resolved","Hired"];
    return ["New","Contacted","Resolved"];
  };
  const getStatus = function(d){
    const s = statusMap[getId(d)] || "New";
    const opts = statusOptions(d);
    if(opts.indexOf(s)===-1) return "New";
    return s;
  };
  const shortDate = function(ts){ if(!ts) return "-"; return String(ts).split(" ")[0]; };

  const load = function(){
    setLoading(true);
    const cb = "psl_cb_" + Date.now();
    const old = document.getElementById("psl_jsonp"); if(old) old.remove();
    window[cb] = function(d){
      try{
        const arr = Array.isArray(d) ? d : (d.data || []);
        const clean = arr.filter(function(r){ return r.Timestamp || r.timestamp; }).map(function(r,i){ const o={}; Object.keys(r).forEach(function(k){o[k]=r[k];}); o._id=(r.Timestamp||r.timestamp)+"_"+i; return o; });
        const tArr = safeParse(localStorage.getItem("psl_trash")||"[]", []);
        const trashIds = {}; tArr.forEach(function(t){ trashIds[t._id]=1; });
        setData(clean.filter(function(r){ return !trashIds[r._id]; }));
      }catch(e){ console.log(e); }
      setLoading(false);
      try{ delete window[cb]; }catch(e){}
      const s = document.getElementById("psl_jsonp"); if(s) s.remove();
    };
    const s = document.createElement("script");
    s.id = "psl_jsonp";
    s.src = WEBHOOK + "?callback=" + cb + "&cache=" + Date.now();
    s.onerror = function(){ setLoading(false); showToast("Load failed"); };
    document.body.appendChild(s);
  };

  useEffect(function(){ if(auth) load(); },[auth]);

  if(!auth){
    return (
      <div style={{minHeight:'100vh', background:'linear-gradient(135deg,#0A1931 0%,#1e3a8a 60%,#f59e0b 130%)', display:'flex', justifyContent:'center', alignItems:'center', fontFamily:'Arial'}}>
        <div style={{background:'#fff', padding:'28px', borderRadius:'16px', width:'92%', maxWidth:'360px', textAlign:'center', boxShadow:'0 20px 40px rgba(0,0,0,0.3)'}}>
          <div style={{width:'56px', height:'56px', background:'linear-gradient(135deg,#0A1931,#2563eb)', borderRadius:'16px', margin:'0 auto 10px', display:'grid', placeItems:'center', color:'#fff', fontWeight:900, fontSize:'26px'}}>P</div>
          <h2 style={{color:NAVY, margin:0, fontSize:'19px'}}>PINNACLE ADMIN</h2>
          <p style={{color:'#888', fontSize:'12px', margin:'6px 0 0'}}>Welcome back, Admin</p>
          <input type="password" value={pass} onChange={function(e){setPass(e.target.value);}} onKeyDown={function(e){if(e.key==='Enter') login();}} placeholder="Password" style={{width:'100%', padding:'12px', borderRadius:'10px', marginTop:'14px', border:'1px solid #ddd', boxSizing:'border-box'}} />
          <button onClick={login} style={{width:'100%', marginTop:'10px', background:'linear-gradient(90deg,#0A1931,#2563eb)', color:'#fff', padding:'13px', border:'none', borderRadius:'10px', fontWeight:800, cursor:'pointer'}}>UNLOCK</button>
        </div>
      </div>
    );
  }

  const contacts = data.filter(function(d){ return !isApplicant(d); });
  const applicants = data.filter(function(d){ return isApplicant(d); });

  const openList = function(view){ setPage(view); setSearch(""); setFilterStatus("All"); setFilterService("All"); setSort("newest"); setCurrentPage(1); setExpanded(null); setSelectedIds([]); try{ window.history.pushState({},"","/admin?view="+view); }catch(e){} window.scrollTo(0,0); };
  const backHome = function(){ setPage("home"); setSearch(""); setSelectedIds([]); setExpanded(null); try{ window.history.pushState({},"","/admin"); }catch(e){} };

  const waLink = function(d){
    let p = String(getVal(d,["Phone","phone"])||"").replace(/\s/g,"").replace(/^\+/,"");
    if(p.indexOf("0")===0) p = "256"+p.slice(1);
    const text = "Hello " + getVal(d,["FullName","fullName"]) + ", this is Pinnacle Security Ltd, Muyenga. Thank you for contacting us. We will call you soon. Control 24/7: 0776971970.";
    return "https://wa.me/" + p + "?text=" + encodeURIComponent(text);
  };

  const changeStatus = function(d, newStatus){
    const obj = {}; Object.keys(statusMap).forEach(function(k){ obj[k]=statusMap[k]; }); obj[getId(d)]=newStatus;
    setStatusMap(obj); localStorage.setItem("psl_status", JSON.stringify(obj));
    showToast(getVal(d,["FullName","fullName"]) + " -> " + newStatus);
  };

  // DELETE - NO POPUP, JUST DELETE TO TRASH
  const moveToTrash = function(d){
    const newTrash = trash.concat([d]);
    setTrash(newTrash); localStorage.setItem("psl_trash", JSON.stringify(newTrash));
    setData(data.filter(function(r){ return r._id!==d._id; }));
    setSelectedIds(selectedIds.filter(function(id){ return id!==d._id; }));
    showToast("Moved to Trash");
  };

  const restoreFromTrash = function(d){
    const newTrash = trash.filter(function(t){ return t._id!==d._id; });
    setTrash(newTrash); localStorage.setItem("psl_trash", JSON.stringify(newTrash));
    setData(data.concat([d])); showToast("Restored");
  };

  const deleteForever = function(d){
    const newTrash = trash.filter(function(t){ return t._id!==d._id; });
    setTrash(newTrash); localStorage.setItem("psl_trash", JSON.stringify(newTrash));
    const ts = getVal(d,["Timestamp","timestamp"]);
    fetch(WEBHOOK,{method:'POST', mode:'no-cors', headers:{'Content-Type':'text/plain'}, body: JSON.stringify({action:'delete', timestamps:[ts], Timestamp: ts})});
    showToast("Deleted forever");
  };

  // BULK
  const toggleSelect = function(id){
    if(selectedIds.indexOf(id)!==-1) setSelectedIds(selectedIds.filter(function(x){ return x!==id; }));
    else setSelectedIds(selectedIds.concat([id]));
  };
  const toggleSelectAll = function(){
    if(selectedIds.length===paged.length) setSelectedIds([]);
    else setSelectedIds(paged.map(function(d){ return d._id; }));
  };
  const bulkDelete = function(){
    if(!selectedIds.length) return showToast("Select first");
    const toTrash = data.filter(function(d){ return selectedIds.indexOf(d._id)!==-1; });
    const newTrash = trash.concat(toTrash);
    setTrash(newTrash); localStorage.setItem("psl_trash", JSON.stringify(newTrash));
    setData(data.filter(function(d){ return selectedIds.indexOf(d._id)===-1; }));
    setSelectedIds([]); showToast(selectedIds.length + " moved to Trash");
  };
  const bulkDeleteForever = function(){
    if(!selectedIds.length) return showToast("Select first");
    const newTrash = trash.filter(function(d){ return selectedIds.indexOf(d._id)===-1; });
    setTrash(newTrash); localStorage.setItem("psl_trash", JSON.stringify(newTrash));
    setSelectedIds([]); showToast("Deleted forever");
  };
  const bulkRestore = function(){
    if(!selectedIds.length) return showToast("Select first");
    const toRestore = trash.filter(function(d){ return selectedIds.indexOf(d._id)!==-1; });
    const newTrash = trash.filter(function(d){ return selectedIds.indexOf(d._id)===-1; });
    setTrash(newTrash); localStorage.setItem("psl_trash", JSON.stringify(newTrash));
    setData(data.concat(toRestore)); setSelectedIds([]); showToast("Restored");
  };
  const bulkEmail = function(){
    if(!selectedIds.length) return showToast("Select first to email");
    const list = (page==="trash" ? trash : data).filter(function(d){ return selectedIds.indexOf(d._id)!==-1; });
    const emails = list.map(function(d){ return getVal(d,["Email","email"]); }).filter(function(e){ return e && e.indexOf("@")!==-1; });
    if(!emails.length) return showToast("No emails for selected");
    window.location.href = "mailto:?bcc=" + emails.join(",") + "&subject=" + encodeURIComponent("Pinnacle Security Ltd - Update") + "&body=" + encodeURIComponent("Hello,\n\nThis is Pinnacle Security Ltd, Muyenga.\n\nThank you.\nControl 24/7: 0776971970");
  };
  const bulkStatus = function(newStatus){
    if(!selectedIds.length) return showToast("Select first");
    const obj = {}; Object.keys(statusMap).forEach(function(k){ obj[k]=statusMap[k]; });
    (page==="trash" ? trash : data).forEach(function(d){ if(selectedIds.indexOf(d._id)!==-1) obj[getId(d)]=newStatus; });
    setStatusMap(obj); localStorage.setItem("psl_status", JSON.stringify(obj));
    showToast("Status updated for " + selectedIds.length);
  };

  const printPDF = function(d){
    const w = window.open("", "_blank"); if(!w) return;
    w.document.write("<html><head><title>"+getVal(d,["FullName","fullName"])+"</title><style>body{font-family:Arial;padding:30px}h1{color:#0A1931}table{width:100%;border-collapse:collapse}td{border:1px solid #ddd;padding:10px}</style></head><body><h1>PINNACLE SECURITY LTD</h1><h2>"+getVal(d,["FullName","fullName"])+" - "+(isApplicant(d)?"APPLICANT":"CONTACT")+"</h2><table><tr><td><b>Phone</b></td><td>"+getVal(d,["Phone","phone"])+"</td></tr><tr><td><b>Email</b></td><td>"+(getVal(d,["Email","email"])||"-")+"</td></tr><tr><td><b>Service</b></td><td>"+(getVal(d,["Service","service"])||"-")+"</td></tr><tr><td><b>Position</b></td><td>"+(getVal(d,["Position","position"])||"-")+"</td></tr><tr><td><b>District</b></td><td>"+(getVal(d,["District","district"])||"-")+"</td></tr><tr><td><b>Education</b></td><td>"+(getVal(d,["Education","education"])||"-")+"</td></tr><tr><td><b>Status</b></td><td>"+getStatus(d)+"</td></tr><tr><td><b>Date</b></td><td>"+getVal(d,["Timestamp","timestamp"])+"</td></tr><tr><td><b>Message</b></td><td>"+(getVal(d,["Message","Messages","message","messages"])||"-")+"</td></tr></table><p>Control 24/7: 0776971970 | Muyenga, Kampala</p></body></html>");
    w.document.close(); setTimeout(function(){ w.print(); }, 400);
  };

  const statusColor = function(s){ if(s==="New") return "#e0e7ff"; if(s==="Contacted") return "#fef9c3"; if(s==="Rejected") return "#fee2e2"; if(s==="Hired") return "#dcfce7"; return "#dbeafe"; };

  // ===== TABLE DATA =====
  const baseList = page==="contacts" ? contacts : page==="applicants" ? applicants : page==="trash" ? trash : data;
  const serviceSet = {};
  baseList.forEach(function(d){ const v = getVal(d,["Service","service"])||getVal(d,["Position","position"]); if(v) serviceSet[v]=1; });
  const services = ["All"].concat(Object.keys(serviceSet));

  let filtered = baseList.slice();
  if(search.trim()){
    const s = search.toLowerCase();
    filtered = filtered.filter(function(d){ const txt = (getVal(d,["FullName","fullName"])+" "+getVal(d,["Phone","phone"])+" "+getVal(d,["Service","service"])+" "+getVal(d,["Position","position"])+" "+getVal(d,["District","district"])).toLowerCase(); return txt.indexOf(s)!==-1; });
  }
  if(filterStatus!=="All") filtered = filtered.filter(function(d){ return getStatus(d)===filterStatus; });
  if(filterService!=="All") filtered = filtered.filter(function(d){ return (getVal(d,["Service","service"])||getVal(d,["Position","position"]))===filterService; });
  if(sort==="newest") filtered.reverse();
  if(sort==="az") filtered.sort(function(a,b){ return String(getVal(a,["FullName","fullName"])).localeCompare(String(getVal(b,["FullName","fullName"]))); });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paged = filtered.slice((safePage-1)*PAGE_SIZE, safePage*PAGE_SIZE);
  const title = page==="contacts" ? "Contacts" : page==="applicants" ? "Applicants" : page==="trash" ? "Trash" : "All";

  const exportCSV = function(){
    if(!filtered.length) return showToast("No rows");
    let head = ["Name","Phone","Type","Service/Position","District","Education","Status","Date"];
    if(page==="contacts") head = ["Name","Phone","Service","Status","Date"];
    if(page==="applicants") head = ["Name","Phone","Position","District","Education","Status","Date"];
    const rows = filtered.map(function(r){
      const name = getVal(r,["FullName","fullName"]); const phone = getVal(r,["Phone","phone"]); const date = shortDate(getVal(r,["Timestamp","timestamp"]));
      let row = [];
      if(page==="contacts") row = [name,phone,getVal(r,["Service","service"]),getStatus(r),date];
      else if(page==="applicants") row = [name,phone,getVal(r,["Position","position"]),getVal(r,["District","district"]),getVal(r,["Education","education"]),getStatus(r),date];
      else row = [name,phone,isApplicant(r)?"APPLICANT":"CONTACT",getVal(r,["Service","service"])||getVal(r,["Position","position"]),getVal(r,["District","district"]),getVal(r,["Education","education"]),getStatus(r),date];
      return row.map(function(v){ return '"'+String(v||"").replace(/"/g,'""')+'"'; }).join(",");
    });
    const csv = "\uFEFF" + [head.join(",")].concat(rows).join("\n");
    const blob = new Blob([csv],{type:"text/csv"}); const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download="pinnacle_"+page+".csv"; a.click(); URL.revokeObjectURL(url);
  };

  const th = {background:NAVY, color:'#fff', padding:'10px 8px', fontSize:'12px', textAlign:'left', whiteSpace:'nowrap'};

  // ===== EXPANDED DETAIL FORM - INSIDE TABLE, NO POPUP =====
  const renderExpanded = function(d){
    return (
      <tr key={d._id+"_exp"}>
        <td colSpan="10" style={{background:'#f0f7ff', padding:'16px', borderBottom:'2px solid #2563eb'}}>
          <div style={{background:'#fff', borderRadius:'12px', padding:'16px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <h3 style={{margin:0, color:NAVY}}>{getVal(d,["FullName","fullName"])} - Full Details</h3>
              <button onClick={function(){setExpanded(null);}} style={{border:'none', background:'#f1f5f9', borderRadius:'50%', width:'28px', height:'28px', cursor:'pointer', fontWeight:900}}>X</button>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', fontSize:'13px', marginTop:'12px'}}>
              <div style={{background:'#f8fafc', padding:'10px', borderRadius:'8px'}}><b>Phone</b><br/>{getVal(d,["Phone","phone"])}</div>
              <div style={{background:'#f8fafc', padding:'10px', borderRadius:'8px'}}><b>Email</b><br/>{getVal(d,["Email","email"])||"-"}</div>
              <div style={{background:'#f8fafc', padding:'10px', borderRadius:'8px'}}><b>Service / Position</b><br/>{getVal(d,["Service","service"])||getVal(d,["Position","position"])||"-"}</div>
              <div style={{background:'#f8fafc', padding:'10px', borderRadius:'8px'}}><b>District</b><br/>{getVal(d,["District","district"])||"-"}</div>
              <div style={{background:'#f8fafc', padding:'10px', borderRadius:'8px'}}><b>Education</b><br/>{getVal(d,["Education","education"])||"-"}</div>
              <div style={{background:'#f8fafc', padding:'10px', borderRadius:'8px'}}><b>Experience</b><br/>{getVal(d,["Experience","experience"])||"-"}</div>
              <div style={{background:'#f8fafc', padding:'10px', borderRadius:'8px', gridColumn:'span 2'}}><b>Message</b><br/>{getVal(d,["Message","Messages","message","messages"])||"-"}</div>
              <div style={{background:'#f8fafc', padding:'10px', borderRadius:'8px'}}><b>Date</b><br/>{getVal(d,["Timestamp","timestamp"])}</div>
              <div style={{background:'#f8fafc', padding:'10px', borderRadius:'8px'}}><b>Type</b><br/>{isApplicant(d)?"APPLICANT":"CONTACT"}</div>
            </div>
            <div style={{marginTop:'12px'}}>
              <b style={{fontSize:'13px'}}>Status: </b>
              <select value={getStatus(d)} onChange={function(e){changeStatus(d,e.target.value);}} style={{padding:'8px 10px', borderRadius:'20px', border:'1px solid #ddd', fontWeight:800, fontSize:'12px', background:statusColor(getStatus(d))}}>
                {statusOptions(d).map(function(s){ return <option key={s} value={s}>{s}</option>; })}
              </select>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px', marginTop:'12px'}}>
              <a href={"tel:"+getVal(d,["Phone","phone"])} style={{background:NAVY, color:'#fff', padding:'12px', borderRadius:'8px', fontWeight:800, fontSize:'12px', textDecoration:'none', textAlign:'center'}}>CALL</a>
              <a href={waLink(d)} target="_blank" rel="noreferrer" style={{background:'#25D366', color:'#fff', padding:'12px', borderRadius:'8px', fontWeight:800, fontSize:'12px', textDecoration:'none', textAlign:'center'}}>WHATSAPP</a>
              <a href={"mailto:"+getVal(d,["Email","email"])} style={{background:'#2563eb', color:'#fff', padding:'12px', borderRadius:'8px', fontWeight:800, fontSize:'12px', textDecoration:'none', textAlign:'center'}}>EMAIL</a>
              <button onClick={function(){printPDF(d);}} style={{background:'#facc15', color:'#000', border:'none', padding:'12px', borderRadius:'8px', fontWeight:800, fontSize:'12px', cursor:'pointer'}}>PDF / PRINT</button>
              {page!=="trash" ? <button onClick={function(){moveToTrash(d);}} style={{background:'#dc2626', color:'#fff', border:'none', padding:'12px', borderRadius:'8px', fontWeight:800, fontSize:'12px', cursor:'pointer', gridColumn:'span 2'}}>DELETE TO TRASH - No popup</button> : <React.Fragment><button onClick={function(){restoreFromTrash(d);}} style={{background:'#059669', color:'#fff', border:'none', padding:'12px', borderRadius:'8px', fontWeight:800, fontSize:'12px', cursor:'pointer'}}>RESTORE</button><button onClick={function(){deleteForever(d);}} style={{background:'#dc2626', color:'#fff', border:'none', padding:'12px', borderRadius:'8px', fontWeight:800, fontSize:'12px', cursor:'pointer'}}>DELETE FOREVER</button></React.Fragment>}
            </div>
          </div>
        </td>
      </tr>
    );
  };

  // ===== TABLE PAGE =====
  if(page!=="home"){
    return (
      <div style={{background:'#f0f4ff', minHeight:'100vh', fontFamily:'Arial'}}>
        <style>{`@media print{ body *{visibility:hidden} table, table *{visibility:visible} table{position:absolute;left:0;top:0;width:100%} .no-print{display:none !important} }`}</style>
        {toast ? <div className="no-print" style={{position:'fixed', top:'16px', right:'16px', background:'#000', color:'#fff', padding:'10px 14px', borderRadius:'20px', fontWeight:800, zIndex:10000, fontSize:'13px'}}>{toast}</div> : null}
        <div className="no-print" style={{background:'linear-gradient(90deg,#0A1931,#1e3a8a,#2563eb)', color:'#fff', padding:'12px 14px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <b style={{fontSize:'13px'}}>PINNACLE SECURITY LTD</b>
          <div style={{display:'flex', gap:'8px'}}>
            <button onClick={backHome} style={{background:'rgba(255,255,255,0.2)', border:'none', color:'#fff', fontSize:'18px', cursor:'pointer', borderRadius:'8px', width:'36px', height:'36px'}}>🏠</button>
            <button onClick={function(){openList("all");}} style={{background:'rgba(255,255,255,0.2)', border:'none', color:'#fff', fontSize:'18px', cursor:'pointer', borderRadius:'8px', width:'36px', height:'36px'}}>📦</button>
            <button onClick={function(){openList("trash");}} style={{background:'rgba(255,255,255,0.2)', border:'none', color:'#fff', fontSize:'16px', cursor:'pointer', borderRadius:'8px', padding:'0 10px'}}>🗑️ {trash.length}</button>
          </div>
        </div>
        <div style={{maxWidth:'980px', margin:'0 auto', padding:'14px'}}>
          <div className="no-print" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <button onClick={backHome} style={{background:NAVY, color:'#fff', border:'none', padding:'9px 14px', borderRadius:'8px', fontWeight:800, fontSize:'12px', cursor:'pointer'}}>← Back</button>
            <h2 style={{margin:0, color:NAVY, fontSize:'18px'}}>{title} <span style={{fontSize:'13px', color:'#666'}}>({filtered.length})</span></h2>
            <div style={{display:'flex', gap:'6px'}}>
              <button onClick={exportCSV} style={{background:'#2563eb', color:'#fff', border:'none', padding:'9px 10px', borderRadius:'8px', fontWeight:800, fontSize:'11px', cursor:'pointer'}}>CSV</button>
              <button onClick={function(){window.print();}} style={{background:'#facc15', color:'#000', border:'none', padding:'9px 10px', borderRadius:'8px', fontWeight:800, fontSize:'11px', cursor:'pointer'}}>🖨️ Print</button>
            </div>
          </div>

          {/* SEARCH + SORT + FILTER IN ONE LINE */}
          <div className="no-print" style={{display:'flex', gap:'6px', marginTop:'12px', flexWrap:'wrap'}}>
            <input value={search} onChange={function(e){setSearch(e.target.value); setCurrentPage(1);}} placeholder="🔍 Search name, phone..." style={{flex:'1 1 160px', padding:'10px 12px', borderRadius:'8px', border:'1px solid #ddd', fontSize:'13px', outline:'none', background:'#fff'}} />
            <select value={sort} onChange={function(e){setSort(e.target.value);}} style={{padding:'10px 8px', borderRadius:'8px', border:'1px solid #ddd', fontSize:'12px', background:'#fff', fontWeight:700}}><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="az">A-Z</option></select>
            <select value={filterStatus} onChange={function(e){setFilterStatus(e.target.value); setCurrentPage(1);}} style={{padding:'10px 8px', borderRadius:'8px', border:'1px solid #ddd', fontSize:'12px', background:'#fff', fontWeight:700}}><option value="All">All Status</option><option value="New">New</option><option value="Contacted">Contacted</option><option value="Rejected">Rejected</option><option value="Resolved">Resolved</option><option value="Hired">Hired</option></select>
            <select value={filterService} onChange={function(e){setFilterService(e.target.value); setCurrentPage(1);}} style={{padding:'10px 8px', borderRadius:'8px', border:'1px solid #ddd', fontSize:'12px', background:'#fff', fontWeight:700, maxWidth:'130px'}}>{services.map(function(s){ return <option key={s} value={s}>{s==="All"?"All Service":s}</option>; })}</select>
          </div>

          {/* BULK BAR */}
          {selectedIds.length>0 ? (
            <div className="no-print" style={{background:'#0A1931', color:'#fff', padding:'10px 12px', borderRadius:'8px', marginTop:'12px', display:'flex', gap:'6px', flexWrap:'wrap', alignItems:'center'}}>
              <b style={{fontSize:'12px'}}>{selectedIds.length} selected</b>
              <button onClick={bulkEmail} style={{background:'#2563eb', color:'#fff', border:'none', padding:'7px 10px', borderRadius:'6px', fontWeight:800, fontSize:'11px', cursor:'pointer'}}>📧 BULK EMAIL</button>
              {page!=="trash" ? <button onClick={bulkDelete} style={{background:'#dc2626', color:'#fff', border:'none', padding:'7px 10px', borderRadius:'6px', fontWeight:800, fontSize:'11px', cursor:'pointer'}}>🗑️ DELETE SELECTED</button> : <React.Fragment><button onClick={bulkRestore} style={{background:'#059669', color:'#fff', border:'none', padding:'7px 10px', borderRadius:'6px', fontWeight:800, fontSize:'11px', cursor:'pointer'}}>♻️ RESTORE</button><button onClick={bulkDeleteForever} style={{background:'#dc2626', color:'#fff', border:'none', padding:'7px 10px', borderRadius:'6px', fontWeight:800, fontSize:'11px', cursor:'pointer'}}>DELETE FOREVER</button></React.Fragment>}
              <select onChange={function(e){ if(e.target.value) bulkStatus(e.target.value); e.target.value=""; }} style={{padding:'7px', borderRadius:'6px', fontSize:'11px', fontWeight:800}}><option value="">Set Status...</option><option value="New">New</option><option value="Contacted">Contacted</option><option value="Rejected">Rejected</option><option value="Resolved">Resolved</option><option value="Hired">Hired</option></select>
              <button onClick={function(){setSelectedIds([]);}} style={{background:'#fff', color:'#000', border:'none', padding:'7px 10px', borderRadius:'6px', fontWeight:800, fontSize:'11px', cursor:'pointer'}}>Clear</button>
            </div>
          ) : null}

          <div style={{background:'#fff', borderRadius:'12px', overflow:'hidden', marginTop:'12px', border:'1px solid #eee', boxShadow:'0 2px 10px rgba(0,0,0,0.05)'}}>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%', borderCollapse:'collapse', minWidth:'720px'}}>
                <thead><tr>
                  <th style={th} className="no-print"><input type="checkbox" checked={paged.length>0 && selectedIds.length===paged.length} onChange={toggleSelectAll} /></th>
                  <th style={th}>Name</th><th style={th}>Phone</th>
                  {page==="contacts" ? <React.Fragment><th style={th}>Service</th></React.Fragment> : null}
                  {page==="applicants" ? <React.Fragment><th style={th}>Position</th><th style={th}>District</th></React.Fragment> : null}
                  {page==="all" ? <React.Fragment><th style={th}>Type</th><th style={th}>Service / Position</th><th style={th}>District</th></React.Fragment> : null}
                  {page==="trash" ? <React.Fragment><th style={th}>Type</th></React.Fragment> : null}
                  <th style={th}>Status ↓ Dropdown</th>
                  <th style={th}>Date</th>
                  <th style={th} className="no-print"></th>
                  <th style={th} className="no-print">🗑️</th>
                </tr></thead>
                <tbody>
                  {paged.map(function(d){
                    const isOpen = expanded===d._id;
                    const row = (
                      <React.Fragment key={d._id}>
                        <tr style={{background: isOpen?'#eff6ff':'#fff'}}>
                          <td className="no-print" style={{padding:'10px 8px', borderBottom:'1px solid #eee'}}><input type="checkbox" checked={selectedIds.indexOf(d._id)!==-1} onChange={function(e){e.stopPropagation(); toggleSelect(d._id);}} onClick={function(e){e.stopPropagation();}} /></td>
                          <td onClick={function(){setExpanded(isOpen?null:d._id);}} style={{padding:'10px 8px', fontSize:'13px', borderBottom:'1px solid #eee', fontWeight:800, color:NAVY, cursor:'pointer', whiteSpace:'nowrap'}}>{getVal(d,["FullName","fullName"])}</td>
                          <td onClick={function(){setExpanded(isOpen?null:d._id);}} style={{padding:'10px 8px', fontSize:'13px', borderBottom:'1px solid #eee', cursor:'pointer', whiteSpace:'nowrap'}}>{getVal(d,["Phone","phone"])}</td>
                          {page==="contacts" ? <td onClick={function(){setExpanded(isOpen?null:d._id);}} style={{padding:'10px 8px', fontSize:'13px', borderBottom:'1px solid #eee', cursor:'pointer'}}>{getVal(d,["Service","service"])||"-"}</td> : null}
                          {page==="applicants" ? <React.Fragment><td onClick={function(){setExpanded(isOpen?null:d._id);}} style={{padding:'10px 8px', fontSize:'13px', borderBottom:'1px solid #eee', cursor:'pointer'}}>{getVal(d,["Position","position"])||"-"}</td><td onClick={function(){setExpanded(isOpen?null:d._id);}} style={{padding:'10px 8px', fontSize:'13px', borderBottom:'1px solid #eee', cursor:'pointer'}}>{getVal(d,["District","district"])||"-"}</td></React.Fragment> : null}
                          {page==="all" ? <React.Fragment><td onClick={function(){setExpanded(isOpen?null:d._id);}} style={{padding:'10px 8px', fontSize:'13px', borderBottom:'1px solid #eee', cursor:'pointer'}}>{isApplicant(d)?"APPLICANT":"CONTACT"}</td><td onClick={function(){setExpanded(isOpen?null:d._id);}} style={{padding:'10px 8px', fontSize:'13px', borderBottom:'1px solid #eee', cursor:'pointer'}}>{getVal(d,["Service","service"])||getVal(d,["Position","position"])||"-"}</td><td onClick={function(){setExpanded(isOpen?null:d._id);}} style={{padding:'10px 8px', fontSize:'13px', borderBottom:'1px solid #eee', cursor:'pointer'}}>{getVal(d,["District","district"])||"-"}</td></React.Fragment> : null}
                          {page==="trash" ? <td onClick={function(){setExpanded(isOpen?null:d._id);}} style={{padding:'10px 8px', fontSize:'13px', borderBottom:'1px solid #eee', cursor:'pointer'}}>{isApplicant(d)?"APPLICANT":"CONTACT"}</td> : null}
                          <td style={{padding:'8px', borderBottom:'1px solid #eee'}} onClick={function(e){e.stopPropagation();}}>
                            <select value={getStatus(d)} onChange={function(e){changeStatus(d,e.target.value);}} style={{padding:'7px 8px', borderRadius:'20px', border:'1px solid #ddd', fontWeight:800, fontSize:'11px', background:statusColor(getStatus(d)), cursor:'pointer'}}>
                              {statusOptions(d).map(function(s){ return <option key={s} value={s}>{s}</option>; })}
                            </select>
                          </td>
                          <td onClick={function(){setExpanded(isOpen?null:d._id);}} style={{padding:'10px 8px', fontSize:'13px', borderBottom:'1px solid #eee', cursor:'pointer', whiteSpace:'nowrap'}}>{shortDate(getVal(d,["Timestamp","timestamp"]))}</td>
                          <td className="no-print" onClick={function(){setExpanded(isOpen?null:d._id);}} style={{padding:'10px 8px', borderBottom:'1px solid #eee', color:NAVY, fontWeight:900, cursor:'pointer'}}>{isOpen?"▲":"›"}</td>
                          <td className="no-print" style={{padding:'10px 8px', borderBottom:'1px solid #eee'}}>
                            {page!=="trash" ? <button onClick={function(){moveToTrash(d);}} style={{background:'#fee2e2', border:'none', padding:'6px 9px', borderRadius:'6px', cursor:'pointer', fontSize:'14px'}}>🗑️</button> : <button onClick={function(){deleteForever(d);}} style={{background:'#fee2e2', border:'none', padding:'6px 9px', borderRadius:'6px', cursor:'pointer', fontSize:'11px', fontWeight:800, color:'#dc2626'}}>DEL</button>}
                          </td>
                        </tr>
                        {isOpen ? renderExpanded(d) : null}
                      </React.Fragment>
                    );
                    return row;
                  })}
                </tbody>
              </table>
            </div>
            {paged.length===0 && !loading ? <p style={{textAlign:'center', color:'#888', padding:'18px'}}>No {title} yet</p> : null}
            {loading ? <p style={{textAlign:'center', padding:'14px'}}>Loading...</p> : null}
          </div>
          <div className="no-print" style={{display:'flex', justifyContent:'center', alignItems:'center', gap:'8px', marginTop:'14px'}}>
            <button disabled={safePage<=1} onClick={function(){setCurrentPage(safePage-1);}} style={{background: safePage<=1?'#e5e7eb':NAVY, color: safePage<=1?'#999':'#fff', border:'none', padding:'9px 14px', borderRadius:'8px', fontWeight:800, fontSize:'12px', cursor:'pointer'}}>Prev</button>
            <span style={{fontSize:'13px', fontWeight:800, color:NAVY}}>Page {safePage} / {totalPages}</span>
            <button disabled={safePage>=totalPages} onClick={function(){setCurrentPage(safePage+1);}} style={{background: safePage>=totalPages?'#e5e7eb':NAVY, color: safePage>=totalPages?'#999':'#fff', border:'none', padding:'9px 14px', borderRadius:'8px', fontWeight:800, fontSize:'12px', cursor:'pointer'}}>Next</button>
          </div>
          <p className="no-print" style={{fontSize:'12px', color:'#888', textAlign:'center', marginTop:'8px'}}>Tap any row to expand full details • Tap › to expand • Status dropdown in table</p>
        </div>
      </div>
    );
  }

  // ===== HOME - NICE COLOR + WELCOME, {username} =====
  const boxStyle = function(grad){ return {background:grad, borderRadius:'16px', padding:'22px 10px 18px', cursor:'pointer', textAlign:'center', color:'#fff', boxShadow:'0 8px 20px rgba(0,0,0,0.12)'}; };
  return (
    <div style={{background:'#f0f4ff', minHeight:'100vh', fontFamily:'Arial', padding:'0'}}>
      {toast ? <div style={{position:'fixed', top:'16px', right:'16px', background:'#000', color:'#fff', padding:'10px 14px', borderRadius:'20px', fontWeight:800, zIndex:10000, fontSize:'13px'}}>{toast}</div> : null}
      <div style={{background:'linear-gradient(90deg,#0A1931,#1e3a8a,#2563eb)', color:'#fff', padding:'12px 14px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <b style={{fontSize:'13px'}}>PINNACLE SECURITY LTD</b>
        <div style={{display:'flex', gap:'6px', alignItems:'center'}}>
          <a href="/" style={{color:'#fff', textDecoration:'none', fontSize:'18px'}}>🏠</a>
          <button onClick={function(){openList("all");}} style={{background:'rgba(255,255,255,0.2)', border:'none', color:'#fff', fontSize:'18px', cursor:'pointer', borderRadius:'8px', width:'36px', height:'36px'}}>📦</button>
          <button onClick={function(){openList("trash");}} style={{background:'rgba(255,255,255,0.2)', border:'none', color:'#fff', fontSize:'16px', cursor:'pointer', borderRadius:'8px', padding:'0 10px'}}>🗑️ {trash.length}</button>
          <button onClick={function(){setAuth(false);}} style={{background:'rgba(255,255,255,0.2)', border:'none', color:'#fff', fontSize:'11px', fontWeight:800, cursor:'pointer', borderRadius:'8px', padding:'8px 10px'}}>LOGOUT</button>
        </div>
      </div>
      <div style={{maxWidth:'520px', margin:'0 auto', padding:'18px 14px 20px'}}>
        {/* WELCOME, {username} WITH NICE COLOR */}
        <div style={{background:'linear-gradient(135deg,#0A1931 0%,#2563eb 60%,#f59e0b 130%)', borderRadius:'16px', padding:'20px', color:'#fff', marginBottom:'16px'}}>
          <p style={{margin:0, fontSize:'13px', opacity:0.9}}>Welcome,</p>
          <h2 style={{margin:'4px 0 0', fontSize:'26px', fontWeight:900}}>{username} 👋</h2>
          <p style={{margin:'8px 0 0', fontSize:'12px', opacity:0.9}}>Pinnacle Security Ltd • {data.length} total • {contacts.length} Contacts • {applicants.length} Applicants</p>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px'}}>
          <div onClick={function(){openList("contacts");}} style={boxStyle('linear-gradient(135deg,#2563eb,#0ea5e9)')}>
            <div style={{fontSize:'28px'}}>📩</div>
            <div style={{fontSize:'22px', fontWeight:900, lineHeight:'1', marginTop:'6px'}}>{contacts.length}</div>
            <div style={{fontSize:'13px', marginTop:'6px', opacity:0.95}}>Contacts</div>
          </div>
          <div onClick={function(){openList("applicants");}} style={boxStyle('linear-gradient(135deg,#dc2626,#f97316)')}>
            <div style={{fontSize:'28px'}}>👤</div>
            <div style={{fontSize:'22px', fontWeight:900, lineHeight:'1', marginTop:'6px'}}>{applicants.length}</div>
            <div style={{fontSize:'13px', marginTop:'6px', opacity:0.95}}>Applicants</div>
          </div>
          <div onClick={function(){openList("all");}} style={boxStyle('linear-gradient(135deg,#7c3aed,#a855f7)')}>
            <div style={{fontSize:'28px'}}>📦</div>
            <div style={{fontSize:'22px', fontWeight:900, lineHeight:'1', marginTop:'6px'}}>{data.length}</div>
            <div style={{fontSize:'13px', marginTop:'6px', opacity:0.95}}>All</div>
          </div>
          <div onClick={function(){openList("trash");}} style={boxStyle('linear-gradient(135deg,#f59e0b,#facc15)')}>
            <div style={{fontSize:'28px'}}>🗑️</div>
            <div style={{fontSize:'22px', fontWeight:900, lineHeight:'1', marginTop:'6px', color:'#000'}}>{trash.length}</div>
            <div style={{fontSize:'13px', marginTop:'6px', color:'#000'}}>Trash</div>
          </div>
        </div>
        <p style={{fontSize:'12px', color:'#888', textAlign:'center', marginTop:'16px'}}>Tap any box to open all details in table • Tap row to expand</p>
        {loading ? <p style={{textAlign:'center', fontSize:'12px', color:'#888'}}>Loading...</p> : null}
      </div>
    </div>
  );
}