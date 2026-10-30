import React, { useState, useEffect } from 'react';

const PASSWORD = "Rubangakene";
const WEBHOOK = "https://script.google.com/macros/s/AKfycbz0Fx9gSfPwPXZdi8pivw9IdQ_fzj707fPk22GBECuGYhGzwePtEPZV47TyXk8TN8bggQ/exec";
const NAVY = "#0A1931";
const STATUSES = ["New","Contacted","Rejected","Hired","Resolved"];
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
  const [selected, setSelected] = useState(null);
  const [statusMap, setStatusMap] = useState(function(){ return safeParse(localStorage.getItem("psl_status")||"{}", {}); });
  const [trash, setTrash] = useState(function(){ return safeParse(localStorage.getItem("psl_trash")||"[]", []); });
  const [toast, setToast] = useState("");

  const showToast = function(m){ setToast(m); setTimeout(function(){ setToast(""); }, 2500); };

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
  const getStatus = function(d){ return statusMap[getId(d)] || "New"; };
  const shortDate = function(ts){ if(!ts) return "-"; return String(ts).split(" ")[0]; };

  const load = function(){
    setLoading(true);
    const cb = "psl_cb_" + Date.now();
    const old = document.getElementById("psl_jsonp"); if(old) old.remove();
    window[cb] = function(d){
      try{
        const arr = Array.isArray(d) ? d : (d.data || []);
        const clean = arr.filter(function(r){ return r.Timestamp || r.timestamp; }).map(function(r,i){ const o={}; Object.keys(r).forEach(function(k){o[k]=r[k];}); o._id=(r.Timestamp||r.timestamp)+"_"+i; return o; });
        const trashIds = {};
        const tArr = safeParse(localStorage.getItem("psl_trash")||"[]", []);
        tArr.forEach(function(t){ trashIds[t._id]=1; });
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
      <div style={{minHeight:'100vh', background:NAVY, display:'flex', justifyContent:'center', alignItems:'center', fontFamily:'Arial'}}>
        <div style={{background:'#fff', padding:'28px', borderRadius:'6px', width:'92%', maxWidth:'360px', textAlign:'center'}}>
          <div style={{width:'52px', height:'52px', background:NAVY, borderRadius:'6px', margin:'0 auto 10px', display:'grid', placeItems:'center', color:'#fff', fontWeight:900, fontSize:'24px'}}>P</div>
          <h2 style={{color:NAVY, margin:0, fontSize:'19px'}}>PINNACLE ADMIN</h2>
          <input type="password" value={pass} onChange={function(e){setPass(e.target.value);}} onKeyDown={function(e){if(e.key==='Enter') login();}} placeholder="Password" style={{width:'100%', padding:'12px', borderRadius:'6px', marginTop:'14px', border:'1px solid #ddd', boxSizing:'border-box'}} />
          <button onClick={login} style={{width:'100%', marginTop:'10px', background:NAVY, color:'#fff', padding:'13px', border:'none', borderRadius:'6px', fontWeight:800, cursor:'pointer'}}>UNLOCK</button>
        </div>
      </div>
    );
  }

  const contacts = data.filter(function(d){ return !isApplicant(d); });
  const applicants = data.filter(function(d){ return isApplicant(d); });
  const todayStr = new Date().toLocaleDateString('en-GB');
  const todayCount = data.filter(function(d){ return String(getVal(d,["Timestamp","timestamp"])||"").indexOf(todayStr)===0; }).length;

  const openList = function(view){ setPage(view); setSearch(""); setFilterStatus("All"); setFilterService("All"); setSort("newest"); setCurrentPage(1); try{ window.history.pushState({},"","/admin?view="+view); }catch(e){} window.scrollTo(0,0); };
  const backHome = function(){ setPage("home"); setSearch(""); try{ window.history.pushState({},"","/admin"); }catch(e){} };

  const waLink = function(d){
    let p = String(getVal(d,["Phone","phone"])||"").replace(/\s/g,"").replace(/^\+/,"");
    if(p.indexOf("0")===0) p = "256"+p.slice(1);
    const text = "Hello " + getVal(d,["FullName","fullName"]) + ", this is Pinnacle Security Ltd, Muyenga. Thank you for contacting us. We will call you soon. Control 24/7: 0776971970.";
    return "https://wa.me/" + p + "?text=" + encodeURIComponent(text);
  };

  const changeStatus = function(d, newStatus){
    const obj = {}; Object.keys(statusMap).forEach(function(k){ obj[k]=statusMap[k]; }); obj[getId(d)]=newStatus;
    setStatusMap(obj); localStorage.setItem("psl_status", JSON.stringify(obj));
    if(selected) setSelected(d);
    showToast("Status: " + newStatus);
  };

  const moveToTrash = function(d){
    if(!window.confirm("Move " + getVal(d,["FullName","fullName"]) + " to Trash?")) return;
    const newTrash = trash.concat([d]);
    setTrash(newTrash); localStorage.setItem("psl_trash", JSON.stringify(newTrash));
    setData(data.filter(function(r){ return r._id!==d._id; }));
    setSelected(null); showToast("Moved to Trash");
  };

  const restoreFromTrash = function(d){
    const newTrash = trash.filter(function(t){ return t._id!==d._id; });
    setTrash(newTrash); localStorage.setItem("psl_trash", JSON.stringify(newTrash));
    setData(data.concat([d])); setSelected(null); showToast("Restored");
  };

  const deleteForever = function(d){
    if(!window.confirm("Delete FOREVER " + getVal(d,["FullName","fullName"]) + "?")) return;
    const newTrash = trash.filter(function(t){ return t._id!==d._id; });
    setTrash(newTrash); localStorage.setItem("psl_trash", JSON.stringify(newTrash));
    setSelected(null);
    const ts = getVal(d,["Timestamp","timestamp"]);
    fetch(WEBHOOK,{method:'POST', mode:'no-cors', headers:{'Content-Type':'text/plain'}, body: JSON.stringify({action:'delete', timestamps:[ts], Timestamp: ts})});
    showToast("Deleted forever");
  };

  const printPDF = function(){
    const d = selected; if(!d) return;
    const w = window.open("", "_blank");
    if(!w) return;
    w.document.write("<html><head><title>"+getVal(d,["FullName","fullName"])+"</title><style>body{font-family:Arial;padding:30px}h1{color:#0A1931}table{width:100%;border-collapse:collapse}td{border:1px solid #ddd;padding:10px}</style></head><body><h1>PINNACLE SECURITY LTD</h1><h2>"+getVal(d,["FullName","fullName"])+" - "+(isApplicant(d)?"APPLICANT":"CONTACT")+"</h2><table><tr><td><b>Phone</b></td><td>"+getVal(d,["Phone","phone"])+"</td></tr><tr><td><b>Email</b></td><td>"+(getVal(d,["Email","email"])||"-")+"</td></tr><tr><td><b>Service</b></td><td>"+(getVal(d,["Service","service"])||"-")+"</td></tr><tr><td><b>Position</b></td><td>"+(getVal(d,["Position","position"])||"-")+"</td></tr><tr><td><b>District</b></td><td>"+(getVal(d,["District","district"])||"-")+"</td></tr><tr><td><b>Education</b></td><td>"+(getVal(d,["Education","education"])||"-")+"</td></tr><tr><td><b>Status</b></td><td>"+getStatus(d)+"</td></tr><tr><td><b>Date</b></td><td>"+getVal(d,["Timestamp","timestamp"])+"</td></tr><tr><td><b>Message</b></td><td>"+(getVal(d,["Message","Messages","message","messages"])||"-")+"</td></tr></table><p>Control 24/7: 0776971970 | Muyenga, Kampala</p></body></html>");
    w.document.close(); setTimeout(function(){ w.print(); }, 400);
  };

  const statusColor = function(s){ if(s==="New") return "#e0e7ff"; if(s==="Contacted") return "#fef9c3"; if(s==="Rejected") return "#fee2e2"; if(s==="Hired") return "#dcfce7"; return "#dbeafe"; };

  // ===== TABLE DATA - NO useMemo, SIMPLE =====
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
  const td = {padding:'10px 8px', fontSize:'13px', borderBottom:'1px solid #eee', whiteSpace:'nowrap'};
  const iconBtn = {background:'#fff', border:'1px solid #e5e5e5', borderRadius:'6px', width:'36px', height:'36px', display:'grid', placeItems:'center', cursor:'pointer', fontSize:'16px'};

  // ===== POPUP =====
  const renderPopup = function(){
    if(!selected) return null;
    const d = selected;
    return (
      <div onClick={function(){setSelected(null);}} style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:9999, display:'flex', alignItems:'flex-end', justifyContent:'center'}}>
        <div onClick={function(e){e.stopPropagation();}} style={{background:'#fff', width:'100%', maxWidth:'520px', borderRadius:'16px 16px 0 0', padding:'18px', maxHeight:'90vh', overflowY:'auto', fontFamily:'Arial'}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <h3 style={{margin:0, color:NAVY}}>{getVal(d,["FullName","fullName"])}</h3>
            <button onClick={function(){setSelected(null);}} style={{border:'none', background:'#f1f5f9', borderRadius:'50%', width:'30px', height:'30px', cursor:'pointer', fontWeight:900}}>X</button>
          </div>
          <span style={{display:'inline-block', marginTop:'8px', fontSize:'11px', background: statusColor(getStatus(d)), padding:'5px 10px', borderRadius:'20px', fontWeight:800}}>{getStatus(d)} - {isApplicant(d)?"APPLICANT":"CONTACT"}</span>
          <div style={{display:'grid', gap:'10px', fontSize:'14px', marginTop:'12px'}}>
            <div><b>Phone:</b> {getVal(d,["Phone","phone"])}</div>
            <div><b>Email:</b> {getVal(d,["Email","email"]) || "-"}</div>
            {getVal(d,["Service","service"]) ? <div><b>Service:</b> {getVal(d,["Service","service"])}</div> : null}
            {getVal(d,["Position","position"]) ? <div><b>Position:</b> {getVal(d,["Position","position"])}</div> : null}
            {getVal(d,["Education","education"]) ? <div><b>Education:</b> {getVal(d,["Education","education"])}</div> : null}
            {getVal(d,["District","district"]) ? <div><b>District:</b> {getVal(d,["District","district"])}</div> : null}
            {getVal(d,["Experience","experience"]) ? <div><b>Experience:</b> {getVal(d,["Experience","experience"])}</div> : null}
            <div><b>Date:</b> {getVal(d,["Timestamp","timestamp"])}</div>
            {getVal(d,["Message","Messages","message","messages"]) ? <div style={{background:'#f8fafc', padding:'11px', borderRadius:'8px'}}><b>Message:</b><br/>{getVal(d,["Message","Messages","message","messages"])}</div> : null}
          </div>
          <div style={{marginTop:'14px', background:'#f8fafc', padding:'12px', borderRadius:'8px'}}>
            <b style={{fontSize:'13px'}}>Resolve / Status:</b>
            <div style={{display:'flex', gap:'6px', flexWrap:'wrap', marginTop:'8px'}}>
              {STATUSES.map(function(s){
                return <button key={s} onClick={function(){changeStatus(d,s);}} style={{background: getStatus(d)===s?NAVY:'#fff', color: getStatus(d)===s?'#fff':NAVY, border:'1px solid #ddd', padding:'7px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:800, cursor:'pointer'}}>{s}</button>;
              })}
            </div>
            <p style={{fontSize:'11px', color:'#666', margin:'8px 0 0'}}>New = just came | Contacted = you called | Rejected = not qualified | Hired = you took them | Resolved = job done</p>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginTop:'14px'}}>
            <a href={"tel:"+getVal(d,["Phone","phone"])} style={{background:NAVY, color:'#fff', padding:'13px', borderRadius:'6px', fontWeight:800, fontSize:'12px', textDecoration:'none', textAlign:'center'}}>CALL</a>
            <a href={waLink(d)} target="_blank" rel="noreferrer" style={{background:'#25D366', color:'#fff', padding:'13px', borderRadius:'6px', fontWeight:800, fontSize:'12px', textDecoration:'none', textAlign:'center'}}>WHATSAPP</a>
            <a href={"mailto:"+getVal(d,["Email","email"])} style={{background:'#2563eb', color:'#fff', padding:'13px', borderRadius:'6px', fontWeight:800, fontSize:'12px', textDecoration:'none', textAlign:'center'}}>EMAIL</a>
            <button onClick={printPDF} style={{background:'#facc15', color:'#000', border:'none', padding:'13px', borderRadius:'6px', fontWeight:800, fontSize:'12px', cursor:'pointer'}}>PDF / PRINT</button>
            {page!=="trash" ? (
              <button onClick={function(){moveToTrash(d);}} style={{background:'#fff', color:'#dc2626', border:'1px solid #fecaca', padding:'13px', borderRadius:'6px', fontWeight:800, fontSize:'12px', cursor:'pointer', gridColumn:'span 2'}}>MOVE TO TRASH</button>
            ) : (
              <React.Fragment>
                <button onClick={function(){restoreFromTrash(d);}} style={{background:'#059669', color:'#fff', border:'none', padding:'13px', borderRadius:'6px', fontWeight:800, fontSize:'12px', cursor:'pointer'}}>RESTORE</button>
                <button onClick={function(){deleteForever(d);}} style={{background:'#dc2626', color:'#fff', border:'none', padding:'13px', borderRadius:'6px', fontWeight:800, fontSize:'12px', cursor:'pointer'}}>DELETE FOREVER</button>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ===== TABLE PAGE =====
  if(page!=="home"){
    return (
      <div style={{background:'#f8fafc', minHeight:'100vh', fontFamily:'Arial'}}>
        {toast ? <div style={{position:'fixed', top:'16px', right:'16px', background:'#000', color:'#fff', padding:'10px 14px', borderRadius:'20px', fontWeight:800, zIndex:10000, fontSize:'13px'}}>{toast}</div> : null}
        <div style={{background:NAVY, color:'#fff', padding:'12px 14px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <b style={{fontSize:'13px'}}>PINNACLE SECURITY LTD</b>
          <div style={{display:'flex', gap:'8px'}}>
            <button onClick={backHome} style={{background:'transparent', border:'none', color:'#fff', fontSize:'18px', cursor:'pointer'}}>🏠</button>
            <button onClick={function(){openList("all");}} style={{background:'transparent', border:'none', color:'#fff', fontSize:'18px', cursor:'pointer'}}>📦</button>
            <button onClick={function(){openList("trash");}} style={{background:'transparent', border:'none', color:'#fff', fontSize:'18px', cursor:'pointer'}}>🗑️ {trash.length}</button>
          </div>
        </div>
        <div style={{maxWidth:'900px', margin:'0 auto', padding:'14px'}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <button onClick={backHome} style={{background:NAVY, color:'#fff', border:'none', padding:'9px 14px', borderRadius:'6px', fontWeight:800, fontSize:'12px', cursor:'pointer'}}>Back</button>
            <h2 style={{margin:0, color:NAVY, fontSize:'18px'}}>{title} ({filtered.length})</h2>
            <div style={{display:'flex', gap:'6px'}}>
              <button onClick={exportCSV} style={{background:'#2563eb', color:'#fff', border:'none', padding:'9px 10px', borderRadius:'6px', fontWeight:800, fontSize:'11px', cursor:'pointer'}}>CSV</button>
              <button onClick={function(){window.print();}} style={{background:'#facc15', color:'#000', border:'none', padding:'9px 10px', borderRadius:'6px', fontWeight:800, fontSize:'11px', cursor:'pointer'}}>PDF</button>
            </div>
          </div>
          <div style={{display:'flex', gap:'6px', marginTop:'12px', flexWrap:'wrap'}}>
            <input value={search} onChange={function(e){setSearch(e.target.value); setCurrentPage(1);}} placeholder="Search name, phone..." style={{flex:'1 1 160px', padding:'10px 12px', borderRadius:'6px', border:'1px solid #ddd', fontSize:'13px', outline:'none', background:'#fff'}} />
            <select value={sort} onChange={function(e){setSort(e.target.value);}} style={{padding:'10px 8px', borderRadius:'6px', border:'1px solid #ddd', fontSize:'12px', background:'#fff', fontWeight:700}}>
              <option value="newest">Newest</option><option value="oldest">Oldest</option><option value="az">A-Z</option>
            </select>
            <select value={filterStatus} onChange={function(e){setFilterStatus(e.target.value); setCurrentPage(1);}} style={{padding:'10px 8px', borderRadius:'6px', border:'1px solid #ddd', fontSize:'12px', background:'#fff', fontWeight:700}}>
              <option value="All">All Status</option>{STATUSES.map(function(s){ return <option key={s} value={s}>{s}</option>; })}
            </select>
            <select value={filterService} onChange={function(e){setFilterService(e.target.value); setCurrentPage(1);}} style={{padding:'10px 8px', borderRadius:'6px', border:'1px solid #ddd', fontSize:'12px', background:'#fff', fontWeight:700, maxWidth:'130px'}}>
              {services.map(function(s){ return <option key={s} value={s}>{s==="All"?"All Service":s}</option>; })}
            </select>
          </div>
          <div style={{background:'#fff', borderRadius:'6px', overflow:'hidden', marginTop:'12px', border:'1px solid #eee'}}>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%', borderCollapse:'collapse', minWidth:'680px'}}>
                <thead><tr>
                  <th style={th}>Name</th><th style={th}>Phone</th>
                  {page==="contacts" ? <React.Fragment><th style={th}>Service</th><th style={th}>Status</th></React.Fragment> : null}
                  {page==="applicants" ? <React.Fragment><th style={th}>Position</th><th style={th}>District</th><th style={th}>Education</th><th style={th}>Status</th></React.Fragment> : null}
                  {page==="all" ? <React.Fragment><th style={th}>Type</th><th style={th}>Service / Position</th><th style={th}>District</th><th style={th}>Education</th><th style={th}>Status</th></React.Fragment> : null}
                  {page==="trash" ? <React.Fragment><th style={th}>Type</th><th style={th}>Status</th></React.Fragment> : null}
                  <th style={th}>Date</th><th style={th}></th>
                </tr></thead>
                <tbody>
                  {paged.map(function(d){
                    return (
                      <tr key={d._id} onClick={function(){setSelected(d);}} style={{cursor:'pointer'}}>
                        <td style={{padding:'10px 8px', fontSize:'13px', borderBottom:'1px solid #eee', whiteSpace:'nowrap', fontWeight:800, color:NAVY}}>{getVal(d,["FullName","fullName"])}</td>
                        <td style={td}>{getVal(d,["Phone","phone"])}</td>
                        {page==="contacts" ? <React.Fragment><td style={td}>{getVal(d,["Service","service"])||"-"}</td><td style={td}><span style={{fontSize:'11px', background:statusColor(getStatus(d)), padding:'4px 8px', borderRadius:'20px', fontWeight:800}}>{getStatus(d)}</span></td></React.Fragment> : null}
                        {page==="applicants" ? <React.Fragment><td style={td}>{getVal(d,["Position","position"])||"-"}</td><td style={td}>{getVal(d,["District","district"])||"-"}</td><td style={td}>{getVal(d,["Education","education"])||"-"}</td><td style={td}><span style={{fontSize:'11px', background:statusColor(getStatus(d)), padding:'4px 8px', borderRadius:'20px', fontWeight:800}}>{getStatus(d)}</span></td></React.Fragment> : null}
                        {page==="all" ? <React.Fragment><td style={td}>{isApplicant(d)?"APPLICANT":"CONTACT"}</td><td style={td}>{getVal(d,["Service","service"])||getVal(d,["Position","position"])||"-"}</td><td style={td}>{getVal(d,["District","district"])||"-"}</td><td style={td}>{getVal(d,["Education","education"])||"-"}</td><td style={td}><span style={{fontSize:'11px', background:statusColor(getStatus(d)), padding:'4px 8px', borderRadius:'20px', fontWeight:800}}>{getStatus(d)}</span></td></React.Fragment> : null}
                        {page==="trash" ? <React.Fragment><td style={td}>{isApplicant(d)?"APPLICANT":"CONTACT"}</td><td style={td}>{getStatus(d)}</td></React.Fragment> : null}
                        <td style={td}>{shortDate(getVal(d,["Timestamp","timestamp"]))}</td>
                        <td style={{padding:'10px 8px', fontSize:'13px', borderBottom:'1px solid #eee', color:NAVY, fontWeight:900}}>›</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {paged.length===0 && !loading ? <p style={{textAlign:'center', color:'#888', padding:'18px'}}>No {title} yet</p> : null}
            {loading ? <p style={{textAlign:'center', padding:'14px'}}>Loading...</p> : null}
          </div>
          <div style={{display:'flex', justifyContent:'center', alignItems:'center', gap:'8px', marginTop:'14px'}}>
            <button disabled={safePage<=1} onClick={function(){setCurrentPage(safePage-1);}} style={{background: safePage<=1?'#e5e7eb':NAVY, color: safePage<=1?'#999':'#fff', border:'none', padding:'9px 14px', borderRadius:'6px', fontWeight:800, fontSize:'12px', cursor:'pointer'}}>Prev</button>
            <span style={{fontSize:'13px', fontWeight:800, color:NAVY}}>Page {safePage} / {totalPages}</span>
            <button disabled={safePage>=totalPages} onClick={function(){setCurrentPage(safePage+1);}} style={{background: safePage>=totalPages?'#e5e7eb':NAVY, color: safePage>=totalPages?'#999':'#fff', border:'none', padding:'9px 14px', borderRadius:'6px', fontWeight:800, fontSize:'12px', cursor:'pointer'}}>Next</button>
          </div>
          <p style={{fontSize:'12px', color:'#888', textAlign:'center', marginTop:'8px'}}>Tap any row to open popup</p>
        </div>
        {renderPopup()}
      </div>
    );
  }

  // ===== HOME - NO WELCOME, NO SEARCH, NO REFRESH =====
  const smallBox = {background:'#fff', borderRadius:'4px', padding:'20px 8px 18px', cursor:'pointer', textAlign:'center', boxShadow:'0 1px 2px rgba(0,0,0,0.04)'};
  return (
    <div style={{background:'#f8fafc', minHeight:'100vh', fontFamily:'Arial', padding:'0'}}>
      {toast ? <div style={{position:'fixed', top:'16px', right:'16px', background:'#000', color:'#fff', padding:'10px 14px', borderRadius:'20px', fontWeight:800, zIndex:10000, fontSize:'13px'}}>{toast}</div> : null}
      <div style={{background:NAVY, color:'#fff', padding:'12px 14px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <b style={{fontSize:'13px'}}>PINNACLE SECURITY LTD</b>
        <div style={{display:'flex', gap:'6px', alignItems:'center'}}>
          <a href="/" style={{background:'transparent', border:'none', color:'#fff', textDecoration:'none', fontSize:'18px'}}>🏠</a>
          <button onClick={function(){openList("all");}} style={{background:'transparent', border:'none', color:'#fff', fontSize:'18px', cursor:'pointer'}}>📦</button>
          <button onClick={function(){openList("trash");}} style={{background:'transparent', border:'none', color:'#fff', fontSize:'16px', cursor:'pointer'}}>🗑️ {trash.length}</button>
          <button onClick={function(){setAuth(false);}} style={{background:'transparent', border:'none', color:'#fff', fontSize:'11px', fontWeight:800, cursor:'pointer'}}>LOGOUT</button>
        </div>
      </div>
      <div style={{maxWidth:'520px', margin:'0 auto', padding:'16px 14px 20px'}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginTop:'6px'}}>
          <div onClick={function(){openList("contacts");}} style={smallBox}>
            <div style={{fontSize:'18px', fontWeight:800, color:NAVY}}>{contacts.length}</div>
            <div style={{fontSize:'13px', color:'#666', marginTop:'8px'}}>Contacts</div>
          </div>
          <div onClick={function(){openList("applicants");}} style={smallBox}>
            <div style={{fontSize:'18px', fontWeight:800, color:'#dc2626'}}>{applicants.length}</div>
            <div style={{fontSize:'13px', color:'#666', marginTop:'8px'}}>Applicants</div>
          </div>
          <div onClick={function(){openList("all");}} style={smallBox}>
            <div style={{fontSize:'18px', fontWeight:800, color:'#2563eb'}}>{data.length}</div>
            <div style={{fontSize:'13px', color:'#666', marginTop:'8px'}}>All</div>
          </div>
          <div onClick={function(){openList("trash");}} style={smallBox}>
            <div style={{fontSize:'18px', fontWeight:800, color:'#f59e0b'}}>{trash.length}</div>
            <div style={{fontSize:'13px', color:'#666', marginTop:'8px'}}>Trash</div>
          </div>
        </div>
        <p style={{fontSize:'12px', color:'#888', textAlign:'center', marginTop:'18px'}}>Tap any box to open its table</p>
        {loading ? <p style={{textAlign:'center', fontSize:'12px', color:'#888'}}>Loading...</p> : null}
      </div>
      {renderPopup()}
    </div>
  );
}