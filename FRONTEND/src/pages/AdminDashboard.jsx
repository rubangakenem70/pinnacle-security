import React, { useState, useEffect } from 'react';

const PASSWORD = "Rubangakene";
const WEBHOOK = "https://script.google.com/macros/s/AKfycbz0Fx9gSfPwPXZdi8pivw9IdQ_fzj707fPk22GBECuGYhGzwePtEPZV47TyXk8TN8bggQ/exec";
const NAVY = "#0A1931";
const PAGE_SIZE = 8;

function safeParse(str, fallback){
  try{ const v = JSON.parse(str); return v==null?fallback:v; }catch(e){ return fallback; }
}
function hasVal(v){ return v && String(v).trim()!=="" && String(v).trim()!=="-"; }

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
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);
  const [autoNotify, setAutoNotify] = useState(true);
  const [notifyInfo, setNotifyInfo] = useState(null);
  const [statusMap, setStatusMap] = useState(function(){ return safeParse(localStorage.getItem("psl_status")||"{}", {}); });
  const [edits, setEdits] = useState(function(){ return safeParse(localStorage.getItem("psl_edits")||"{}", {}); });
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

  const getValRaw = function(o, keys){
    if(!o) return "";
    for(let i=0;i<keys.length;i++){ const k=keys[i]; if(o[k]!==undefined && o[k]!==null && o[k]!=="") return o[k]; }
    const low={};
    Object.keys(o).forEach(function(k){ low[k.toLowerCase()]=o[k]; });
    for(let i=0;i<keys.length;i++){ const v=low[keys[i].toLowerCase()]; if(v) return v; }
    return "";
  };
  const getId = function(d){ return String(getValRaw(d,["Timestamp","timestamp"])||d._id||""); };
  const getVal = function(o, keys){
    const id = getId(o);
    const e = edits[id];
    if(e){
      for(let i=0;i<keys.length;i++){ if(e[keys[i]]!==undefined && e[keys[i]]!=="") return e[keys[i]]; }
      if(keys.indexOf("FullName")!==-1 && e.FullName) return e.FullName;
      if(keys.indexOf("Phone")!==-1 && e.Phone) return e.Phone;
      if(keys.indexOf("Email")!==-1 && e.Email) return e.Email;
      if(keys.indexOf("Service")!==-1 && e.Service) return e.Service;
      if(keys.indexOf("Position")!==-1 && e.Position) return e.Position;
      if(keys.indexOf("District")!==-1 && e.District) return e.District;
      if(keys.indexOf("Education")!==-1 && e.Education) return e.Education;
      if(keys.indexOf("Experience")!==-1 && e.Experience) return e.Experience;
      if(keys.indexOf("Message")!==-1 && e.Message) return e.Message;
    }
    return getValRaw(o, keys);
  };

  const isApplicant = function(d){
    const t = String(getValRaw(d,["Type","type"])||"").toLowerCase();
    if(t==="applicant") return true;
    if(t==="contact") return false;
    return !!getVal(d,["Position","position"]);
  };

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

  const openList = function(view){ setPage(view); setSearch(""); setFilterStatus("All"); setFilterService("All"); setSort("newest"); setCurrentPage(1); setExpanded(null); setEditing(false); setSelectedIds([]); setNotifyInfo(null); try{ window.history.pushState({},"","/admin?view="+view); }catch(e){} window.scrollTo(0,0); };
  const backHome = function(){ setPage("home"); setSearch(""); setSelectedIds([]); setExpanded(null); setEditing(false); setNotifyInfo(null); try{ window.history.pushState({},"","/admin"); }catch(e){} };

  const cleanPhone = function(d){
    let p = String(getVal(d,["Phone","phone"])||"").replace(/\s/g,"").replace(/^\+/,"");
    if(p.indexOf("0")===0) p = "256"+p.slice(1);
    return p;
  };
  const localPhone = function(d){
    let p = String(getVal(d,["Phone","phone"])||"").replace(/\s/g,"");
    if(p.indexOf("256")===0) p = "0"+p.slice(3);
    if(p.indexOf("+256")===0) p = "0"+p.slice(4);
    return p;
  };
  const waLinkFor = function(d, text){ return "https://wa.me/" + cleanPhone(d) + "?text=" + encodeURIComponent(text); };
  const waLink = function(d){
    const text = "Hello " + getVal(d,["FullName","fullName"]) + ", this is Pinnacle Security Ltd, Muyenga. Thank you for contacting us. We will call you soon.";
    return waLinkFor(d, text);
  };

  // ===== AUTO MESSAGE BY STATUS =====
  const messageForStatus = function(d, status){
    const name = getVal(d,["FullName","fullName"]);
    const service = getVal(d,["Service","service"])||getVal(d,["Position","position"])||"our service";
    if(status==="Contacted") return "Hello " + name + ", this is Pinnacle Security Ltd, Muyenga. Thank you for contacting us about " + service + ". We have received your request and we will call you shortly to discuss. Thank you for choosing Pinnacle.";
    if(status==="Hired") return "Hello " + name + ", congratulations! This is Pinnacle Security Ltd, Muyenga. You have been HIRED. Please come to our office in Muyenga with your National ID and documents. We will call you with reporting details. Welcome to Pinnacle Security.";
    if(status==="Rejected") return "Hello " + name + ", this is Pinnacle Security Ltd, Muyenga. Thank you for applying for " + service + ". After review, we are sorry you were not selected this time. Please try again next time. Thank you for your interest in Pinnacle.";
    if(status==="Resolved") return "Hello " + name + ", this is Pinnacle Security Ltd, Muyenga. Your request about " + service + " has been RESOLVED. Thank you for choosing Pinnacle. Please contact us anytime you need security services.";
    return "Hello " + name + ", this is Pinnacle Security Ltd, Muyenga. Thank you for contacting us.";
  };

  // 3 SEPARATE CHANNELS - WHATSAPP / SMS / EMAIL
  const sendWhatsApp = function(info){
    if(!info) return;
    window.open(waLinkFor(info.d, info.msg), "_blank");
    showToast("WhatsApp opened - if number NOT on WhatsApp, tap SMS");
  };
  const sendSMS = function(info){
    if(!info) return;
    // Real SMS - opens phone SMS app, works even if NOT on WhatsApp
    window.location.href = "sms:" + localPhone(info.d) + "?body=" + encodeURIComponent(info.msg);
    showToast("SMS opened to " + localPhone(info.d));
  };
  const sendEmail = function(info){
    if(!info) return;
    if(!info.email || info.email.indexOf("@")===-1){ showToast("No email for this person - use SMS"); return; }
    window.location.href = "mailto:" + info.email + "?subject=" + encodeURIComponent("Pinnacle Security Ltd - " + info.status) + "&body=" + encodeURIComponent(info.msg);
    showToast("Email opened to " + info.email);
  };

  const autoNotifyFor = function(d, newStatus){
    if(!autoNotify) return;
    if(newStatus!=="Contacted" && newStatus!=="Hired" && newStatus!=="Rejected") return;
    const msg = messageForStatus(d, newStatus);
    // DO NOT auto-open WhatsApp anymore - show chooser so user can pick SMS/Email if not on WhatsApp
    setNotifyInfo({name: getVal(d,["FullName","fullName"]), status: newStatus, msg: msg, email: getVal(d,["Email","email"]), phone: getVal(d,["Phone","phone"]), d: d});
    showToast("Message ready - Choose WhatsApp / SMS / Email");
    window.scrollTo({top:0, behavior:'smooth'});
  };

  const changeStatus = function(d, newStatus){
    const old = getStatus(d);
    if(old===newStatus) return;
    const obj = {}; Object.keys(statusMap).forEach(function(k){ obj[k]=statusMap[k]; }); obj[getId(d)]=newStatus;
    setStatusMap(obj); localStorage.setItem("psl_status", JSON.stringify(obj));
    showToast(getVal(d,["FullName","fullName"]) + " -> " + newStatus);
    autoNotifyFor(d, newStatus);
  };

  const moveToTrash = function(d){
    const newTrash = trash.concat([d]);
    setTrash(newTrash); localStorage.setItem("psl_trash", JSON.stringify(newTrash));
    setData(data.filter(function(r){ return r._id!==d._id; }));
    setSelectedIds(selectedIds.filter(function(id){ return id!==d._id; }));
    if(expanded===d._id) setExpanded(null);
    showToast("🗑️ Moved to Trash");
  };
  const restoreFromTrash = function(d){
    const newTrash = trash.filter(function(t){ return t._id!==d._id; });
    setTrash(newTrash); localStorage.setItem("psl_trash", JSON.stringify(newTrash));
    setData(data.concat([d])); showToast("♻️ Restored");
  };
  const deleteForever = function(d){
    const newTrash = trash.filter(function(t){ return t._id!==d._id; });
    setTrash(newTrash); localStorage.setItem("psl_trash", JSON.stringify(newTrash));
    if(expanded===d._id) setExpanded(null);
    const ts = getValRaw(d,["Timestamp","timestamp"]);
    fetch(WEBHOOK,{method:'POST', mode:'no-cors', headers:{'Content-Type':'text/plain'}, body: JSON.stringify({action:'delete', timestamps:[ts], Timestamp: ts})});
    showToast("❌ Deleted Forever");
  };

  const startEdit = function(d){
    setEditing(true);
    setEditForm({
      FullName: getVal(d,["FullName","fullName"]),
      Phone: getVal(d,["Phone","phone"]),
      Email: getVal(d,["Email","email"]),
      Service: getVal(d,["Service","service"]),
      Position: getVal(d,["Position","position"]),
      District: getVal(d,["District","district"]),
      Education: getVal(d,["Education","education"]),
      Experience: getVal(d,["Experience","experience"]),
      Message: getVal(d,["Message","Messages","message","messages"]),
    });
  };
  const saveEdit = function(d){
    const obj = {}; Object.keys(edits).forEach(function(k){ obj[k]=edits[k]; }); obj[getId(d)] = editForm;
    setEdits(obj); localStorage.setItem("psl_edits", JSON.stringify(obj));
    setEditing(false); showToast("✅ Saved");
  };

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
    window.location.href = "mailto:?bcc=" + emails.join(",") + "&subject=" + encodeURIComponent("Pinnacle Security Ltd - Update") + "&body=" + encodeURIComponent("Hello,\n\nThis is Pinnacle Security Ltd, Muyenga.\n\nThank you.");
  };
  const bulkStatus = function(newStatus){
    if(!selectedIds.length) return showToast("Select first");
    const obj = {}; Object.keys(statusMap).forEach(function(k){ obj[k]=statusMap[k]; });
    (page==="trash" ? trash : data).forEach(function(d){ if(selectedIds.indexOf(d._id)!==-1){ obj[getId(d)]=newStatus; } });
    setStatusMap(obj); localStorage.setItem("psl_status", JSON.stringify(obj));
    showToast("Status updated for " + selectedIds.length);
  };

  const detailHTML = function(d){
    let rows = "";
    if(hasVal(getVal(d,["Phone","phone"]))) rows += "<tr><td style='border:1px solid #eee;padding:8px'><b>Phone</b></td><td style='border:1px solid #eee;padding:8px'>"+getVal(d,["Phone","phone"])+"</td></tr>";
    if(hasVal(getVal(d,["Email","email"]))) rows += "<tr><td style='border:1px solid #eee;padding:8px'><b>Email</b></td><td style='border:1px solid #eee;padding:8px'>"+getVal(d,["Email","email"])+"</td></tr>";
    if(hasVal(getVal(d,["Service","service"]))) rows += "<tr><td style='border:1px solid #eee;padding:8px'><b>Service</b></td><td style='border:1px solid #eee;padding:8px'>"+getVal(d,["Service","service"])+"</td></tr>";
    if(hasVal(getVal(d,["Position","position"]))) rows += "<tr><td style='border:1px solid #eee;padding:8px'><b>Position</b></td><td style='border:1px solid #eee;padding:8px'>"+getVal(d,["Position","position"])+"</td></tr>";
    if(hasVal(getVal(d,["District","district"]))) rows += "<tr><td style='border:1px solid #eee;padding:8px'><b>District</b></td><td style='border:1px solid #eee;padding:8px'>"+getVal(d,["District","district"])+"</td></tr>";
    if(hasVal(getVal(d,["Education","education"]))) rows += "<tr><td style='border:1px solid #eee;padding:8px'><b>Education</b></td><td style='border:1px solid #eee;padding:8px'>"+getVal(d,["Education","education"])+"</td></tr>";
    if(hasVal(getVal(d,["Experience","experience"]))) rows += "<tr><td style='border:1px solid #eee;padding:8px'><b>Experience</b></td><td style='border:1px solid #eee;padding:8px'>"+getVal(d,["Experience","experience"])+"</td></tr>";
    rows += "<tr><td style='border:1px solid #eee;padding:8px'><b>Status</b></td><td style='border:1px solid #eee;padding:8px'>"+getStatus(d)+"</td></tr>";
    if(!isApplicant(d) && hasVal(getVal(d,["Message","Messages","message","messages"]))) rows += "<tr><td style='border:1px solid #eee;padding:8px'><b>Message</b></td><td style='border:1px solid #eee;padding:8px'>"+getVal(d,["Message","Messages","message","messages"])+"</td></tr>";
    return "<div style='border:1px solid #ddd;border-radius:8px;padding:16px;margin-bottom:14px;page-break-inside:avoid'><h3 style='margin:0;color:#0A1931'>"+getVal(d,["FullName","fullName"])+" - "+getStatus(d)+"</h3><table style='width:100%;border-collapse:collapse;margin-top:10px'>"+rows+"</table></div>";
  };
  const printTableHTML = function(list, titleText){
    let head = "";
    let rows = "";
    if(page==="contacts"){
      head = "<tr><th>Name</th><th>Phone</th><th>Email</th><th>Service</th><th>Message</th><th>Status</th></tr>";
      rows = list.map(function(d){ return "<tr><td>"+getVal(d,["FullName","fullName"])+"</td><td>"+getVal(d,["Phone","phone"])+"</td><td>"+(getVal(d,["Email","email"])||"-")+"</td><td>"+(getVal(d,["Service","service"])||"-")+"</td><td>"+(getVal(d,["Message","Messages","message","messages"])||"-")+"</td><td>"+getStatus(d)+"</td></tr>"; }).join("");
    } else if(page==="applicants"){
      head = "<tr><th>Name</th><th>Phone</th><th>Email</th><th>Position</th><th>District</th><th>Education</th><th>Experience</th><th>Status</th></tr>";
      rows = list.map(function(d){ return "<tr><td>"+getVal(d,["FullName","fullName"])+"</td><td>"+getVal(d,["Phone","phone"])+"</td><td>"+(getVal(d,["Email","email"])||"-")+"</td><td>"+(getVal(d,["Position","position"])||"-")+"</td><td>"+(getVal(d,["District","district"])||"-")+"</td><td>"+(getVal(d,["Education","education"])||"-")+"</td><td>"+(getVal(d,["Experience","experience"])||"-")+"</td><td>"+getStatus(d)+"</td></tr>"; }).join("");
    } else {
      head = "<tr><th>Name</th><th>Phone</th><th>Email</th><th>Service / Position</th><th>District</th><th>Education</th><th>Experience</th><th>Status</th></tr>";
      rows = list.map(function(d){ return "<tr><td>"+getVal(d,["FullName","fullName"])+"</td><td>"+getVal(d,["Phone","phone"])+"</td><td>"+(getVal(d,["Email","email"])||"-")+"</td><td>"+(getVal(d,["Service","service"])||getVal(d,["Position","position"])||"-")+"</td><td>"+(getVal(d,["District","district"])||"-")+"</td><td>"+(getVal(d,["Education","education"])||"-")+"</td><td>"+(getVal(d,["Experience","experience"])||"-")+"</td><td>"+getStatus(d)+"</td></tr>"; }).join("");
    }
    const w = window.open("", "_blank"); if(!w) return;
    w.document.write("<html><head><title>"+titleText+"</title><style>@page{size:landscape}body{font-family:Arial;padding:16px}h1{color:#0A1931;font-size:18px}table{width:100%;border-collapse:collapse;font-size:11px}th{background:#0A1931;color:#fff;padding:8px;text-align:left;border:1px solid #ddd}td{border:1px solid #ddd;padding:7px;vertical-align:top}</style></head><body><h1>PINNACLE SECURITY LTD - "+titleText+"</h1><p>Total: "+list.length+" | Printed: "+new Date().toLocaleString()+"</p><table>"+head+rows+"</table></body></html>");
    w.document.close(); setTimeout(function(){ w.print(); }, 500);
  };
  const openPrintWindow = function(list, titleText){
    let body = "";
    list.forEach(function(d){ body += detailHTML(d); });
    const w = window.open("", "_blank"); if(!w) return;
    w.document.write("<html><head><title>"+titleText+"</title><style>@page{size:landscape}body{font-family:Arial;padding:20px}h1{color:#0A1931}</style></head><body><h1>PINNACLE SECURITY LTD - "+titleText+"</h1><p>Total: "+list.length+" | Printed: "+new Date().toLocaleString()+"</p>"+body+"</body></html>");
    w.document.close(); setTimeout(function(){ w.print(); }, 500);
  };
  const printSingle = function(d){ openPrintWindow([d], getVal(d,["FullName","fullName"])); };
  const printAllDetails = function(){ printTableHTML(filtered, title); };

  const statusColor = function(s){ if(s==="New") return "#e0e7ff"; if(s==="Contacted") return "#fef9c3"; if(s==="Rejected") return "#fee2e2"; if(s==="Hired") return "#dcfce7"; return "#dbeafe"; };

  const baseList = page==="contacts" ? contacts : page==="applicants" ? applicants : page==="trash" ? trash : data;
  const serviceSet = {};
  baseList.forEach(function(d){ const v = getVal(d,["Service","service"])||getVal(d,["Position","position"]); if(v) serviceSet[v]=1; });
  const services = ["All"].concat(Object.keys(serviceSet));

  let filtered = baseList.slice();
  if(search.trim()){
    const s = search.toLowerCase();
    filtered = filtered.filter(function(d){
      const txt = (getVal(d,["FullName","fullName"])+" "+getVal(d,["Phone","phone"])+" "+getVal(d,["Email","email"])+" "+getVal(d,["Service","service"])+" "+getVal(d,["Position","position"])+" "+getVal(d,["District","district"])+" "+getVal(d,["Education","education"])+" "+getVal(d,["Experience","experience"])+" "+getVal(d,["Message","Messages","message","messages"])+" "+getStatus(d)).toLowerCase();
      return txt.indexOf(s)!==-1;
    });
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
    let head = ["Name","Phone","Email","Service / Position","District","Education","Experience","Status"];
    if(page==="contacts") head = ["Name","Phone","Email","Service","Message","Status"];
    if(page==="applicants") head = ["Name","Phone","Email","Position","District","Education","Experience","Status"];
    const rows = filtered.map(function(r){
      const name = getVal(r,["FullName","fullName"]); const phone = getVal(r,["Phone","phone"]);
      let row = [];
      if(page==="contacts") row = [name,phone,getVal(r,["Email","email"]),getVal(r,["Service","service"]),getVal(r,["Message","Messages","message","messages"]),getStatus(r)];
      else if(page==="applicants") row = [name,phone,getVal(r,["Email","email"]),getVal(r,["Position","position"]),getVal(r,["District","district"]),getVal(r,["Education","education"]),getVal(r,["Experience","experience"]),getStatus(r)];
      else row = [name,phone,getVal(r,["Email","email"]),getVal(r,["Service","service"])||getVal(r,["Position","position"]),getVal(r,["District","district"]),getVal(r,["Education","education"]),getVal(r,["Experience","experience"]),getStatus(r)];
      return row.map(function(v){ return '"'+String(v||"").replace(/"/g,'""')+'"'; }).join(",");
    });
    const csv = "\uFEFF" + [head.join(",")].concat(rows).join("\n");
    const blob = new Blob([csv],{type:"text/csv"}); const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download="pinnacle_"+page+".csv"; a.click(); URL.revokeObjectURL(url);
  };

  const th = {background:NAVY, color:'#fff', padding:'10px 8px', fontSize:'12px', textAlign:'center', whiteSpace:'nowrap', borderRight:'1px solid #334155'};
  const tdBase = {padding:'10px 8px', fontSize:'12px', borderBottom:'1px solid #e5e7eb', borderRight:'1px solid #e5e7eb', verticalAlign:'top', textAlign:'center'};
  const iconBtn = {border:'none', padding:'6px', borderRadius:'8px', cursor:'pointer', fontSize:'13px', height:'32px', width:'100%', display:'flex', alignItems:'center', justifyContent:'center'};
  const inputStyle = {width:'100%', padding:'9px 10px', borderRadius:'8px', border:'1px solid #ddd', fontSize:'13px', boxSizing:'border-box', outline:'none'};

  const TopIcons = function(){
    return (
      <div style={{display:'flex', gap:'6px', alignItems:'center', background:'rgba(255,255,255,0.18)', backdropFilter:'blur(6px)', padding:'5px', borderRadius:'999px', boxShadow:'0 4px 14px rgba(0,0,0,0.2)', border:'1px solid rgba(255,255,255,0.25)'}}>
        <a href="/" title="Home - Website" style={{width:'36px', height:'36px', borderRadius:'50%', background:'#fff', color:NAVY, display:'grid', placeItems:'center', textDecoration:'none', fontSize:'17px', boxShadow:'0 2px 6px rgba(0,0,0,0.15)'}}>🏠</a>
        <button onClick={function(){openList("all");}} title="All" style={{width:'36px', height:'36px', borderRadius:'50%', background:'#fff', border:'none', cursor:'pointer', fontSize:'17px', boxShadow:'0 2px 6px rgba(0,0,0,0.15)'}}>📦</button>
        <button onClick={function(){openList("trash");}} title="Trash" style={{position:'relative', width:'36px', height:'36px', borderRadius:'50%', background:'#fff', border:'none', cursor:'pointer', fontSize:'17px', boxShadow:'0 2px 6px rgba(0,0,0,0.15)'}}>🗑️{trash.length>0 ? <span style={{position:'absolute', top:'-4px', right:'-4px', minWidth:'18px', height:'18px', borderRadius:'999px', background:'#dc2626', color:'#fff', fontSize:'10px', fontWeight:900, display:'grid', placeItems:'center', padding:'0 4px', border:'2px solid #fff'}}>{trash.length}</span> : null}</button>
        <button onClick={function(){setAuth(false);}} title="Logout" style={{height:'36px', borderRadius:'999px', background:NAVY, color:'#fff', border:'none', cursor:'pointer', fontSize:'11px', fontWeight:800, padding:'0 12px'}}>LOGOUT</button>
      </div>
    );
  };

  const renderSmallForm = function(d){
    const applicant = isApplicant(d);
    const phone = getVal(d,["Phone","phone"]);
    const email = getVal(d,["Email","email"]);
    const service = getVal(d,["Service","service"])||getVal(d,["Position","position"]);
    const district = getVal(d,["District","district"]);
    const education = getVal(d,["Education","education"]);
    const experience = getVal(d,["Experience","experience"]);
    const message = getVal(d,["Message","Messages","message","messages"]);
    const infoForThis = {name: getVal(d,["FullName","fullName"]), status: getStatus(d), msg: messageForStatus(d, getStatus(d)), email: email, phone: phone, d: d};
    return (
      <div style={{position:'fixed', inset:0, background:'#f0f4ff', zIndex:9999, display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'14px', overflowY:'auto'}} onClick={function(){setExpanded(null); setEditing(false);}}>
        <div onClick={function(e){e.stopPropagation();}} style={{background:'#fff', borderRadius:'12px', padding:'14px', boxShadow:'0 10px 30px rgba(0,0,0,0.15)', width:'100%', maxWidth:'440px', marginTop:'10px'}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <b style={{color:NAVY, fontSize:'14px'}}>{editing ? "✏️ " : "👁️ "}{getVal(d,["FullName","fullName"])}</b>
            <button onClick={function(){setExpanded(null); setEditing(false);}} style={{border:'none', background:'#f1f5f9', borderRadius:'50%', width:'26px', height:'26px', cursor:'pointer', fontWeight:900, fontSize:'12px'}}>✕</button>
          </div>
          {!editing ? (
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px', fontSize:'12px', marginTop:'10px'}}>
              {hasVal(phone) ? <div style={{background:'#f8fafc', padding:'8px', borderRadius:'8px'}}><b>Phone</b><br/>{phone}</div> : null}
              {hasVal(email) ? <div style={{background:'#f8fafc', padding:'8px', borderRadius:'8px'}}><b>Email</b><br/>{email}</div> : null}
              {hasVal(service) ? <div style={{background:'#f8fafc', padding:'8px', borderRadius:'8px'}}><b>Service / Position</b><br/>{service}</div> : null}
              {hasVal(district) ? <div style={{background:'#f8fafc', padding:'8px', borderRadius:'8px'}}><b>District</b><br/>{district}</div> : null}
              {hasVal(education) ? <div style={{background:'#f8fafc', padding:'8px', borderRadius:'8px'}}><b>Education</b><br/>{education}</div> : null}
              {hasVal(experience) ? <div style={{background:'#f8fafc', padding:'8px', borderRadius:'8px'}}><b>Experience</b><br/>{experience}</div> : null}
              {!applicant && hasVal(message) ? <div style={{background:'#f8fafc', padding:'8px', borderRadius:'8px', gridColumn:'span 2'}}><b>Message</b><br/>{message}</div> : null}
              <div style={{background:'#f8fafc', padding:'8px', borderRadius:'8px'}}><b>Status</b><br/><select value={getStatus(d)} onChange={function(e){changeStatus(d,e.target.value);}} style={{padding:'6px', borderRadius:'20px', fontWeight:800, fontSize:'11px', background:statusColor(getStatus(d)), border:'1px solid #ddd'}}>{statusOptions(d).map(function(s){ return <option key={s} value={s}>{s}</option>; })}</select></div>
            </div>
          ) : (
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px', marginTop:'10px'}}>
              <input value={editForm.FullName||""} onChange={function(e){setEditForm({...editForm, FullName:e.target.value});}} placeholder="Full Name" style={inputStyle} />
              <input value={editForm.Phone||""} onChange={function(e){setEditForm({...editForm, Phone:e.target.value});}} placeholder="Phone" style={inputStyle} />
              <input value={editForm.Email||""} onChange={function(e){setEditForm({...editForm, Email:e.target.value});}} placeholder="Email" style={{...inputStyle, gridColumn:'span 2'}} />
              <input value={editForm.Service||""} onChange={function(e){setEditForm({...editForm, Service:e.target.value});}} placeholder="Service" style={inputStyle} />
              <input value={editForm.Position||""} onChange={function(e){setEditForm({...editForm, Position:e.target.value});}} placeholder="Position" style={inputStyle} />
              <input value={editForm.District||""} onChange={function(e){setEditForm({...editForm, District:e.target.value});}} placeholder="District" style={inputStyle} />
              <input value={editForm.Education||""} onChange={function(e){setEditForm({...editForm, Education:e.target.value});}} placeholder="Education" style={inputStyle} />
              <input value={editForm.Experience||""} onChange={function(e){setEditForm({...editForm, Experience:e.target.value});}} placeholder="Experience" style={inputStyle} />
              {!applicant ? <textarea value={editForm.Message||""} onChange={function(e){setEditForm({...editForm, Message:e.target.value});}} placeholder="Message" style={{...inputStyle, gridColumn:'span 2', minHeight:'60px'}} /> : null}
              <button onClick={function(){saveEdit(d);}} style={{background:'#059669', color:'#fff', border:'none', padding:'10px', borderRadius:'8px', fontWeight:800, cursor:'pointer', fontSize:'12px'}}>✅ SAVE</button>
              <button onClick={function(){setEditing(false);}} style={{background:'#e5e7eb', border:'none', padding:'10px', borderRadius:'8px', fontWeight:800, cursor:'pointer', fontSize:'12px'}}>Cancel</button>
            </div>
          )}
          {/* ROW 1: VIEW / EDIT / DELETE / PERMANENT / CALL / WHATSAPP / EMAIL / PRINT */}
          <div style={{display:'grid', gridTemplateColumns:'repeat(8, 1fr)', gap:'5px', marginTop:'12px'}}>
            <button title="View" onClick={function(){setEditing(false);}} style={{...iconBtn, background:'#e0e7ff'}}>👁️</button>
            <button title="Edit" onClick={function(){startEdit(d);}} style={{...iconBtn, background:'#fef9c3'}}>✏️</button>
            <button title="Delete" onClick={function(){ if(page!=="trash") moveToTrash(d); else restoreFromTrash(d); }} style={{...iconBtn, background:'#fee2e2'}}>{page!=="trash" ? "🗑️" : "♻️"}</button>
            <button title="Delete Permanent" onClick={function(){deleteForever(d);}} style={{...iconBtn, background:'#dc2626'}}>❌</button>
            <a title="Call" href={"tel:"+getVal(d,["Phone","phone"])} style={{...iconBtn, background:NAVY, color:'#fff', textDecoration:'none'}}>📞</a>
            <a title="WhatsApp" href={waLink(d)} target="_blank" rel="noreferrer" style={{...iconBtn, background:'#25D366', textDecoration:'none'}}>💬</a>
            <a title="Email" href={"mailto:"+getVal(d,["Email","email"])} style={{...iconBtn, background:'#2563eb', textDecoration:'none'}}>📧</a>
            <button title="Print" onClick={function(){printSingle(d);}} style={{...iconBtn, background:'#facc15'}}>🖨️</button>
          </div>
          {/* ROW 2: SMS FALLBACK - IF NOT ON WHATSAPP */}
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'5px', marginTop:'6px'}}>
            <button title="Send WhatsApp" onClick={function(){sendWhatsApp(infoForThis);}} style={{background:'#25D366', color:'#fff', border:'none', padding:'8px', borderRadius:'8px', fontWeight:800, fontSize:'11px', cursor:'pointer'}}>💬 WhatsApp</button>
            <button title="Send SMS - works if NOT on WhatsApp" onClick={function(){sendSMS(infoForThis);}} style={{background:'#0ea5e9', color:'#fff', border:'none', padding:'8px', borderRadius:'8px', fontWeight:800, fontSize:'11px', cursor:'pointer'}}>📱 SMS</button>
            <button title="Send Email" onClick={function(){sendEmail(infoForThis);}} style={{background:'#2563eb', color:'#fff', border:'none', padding:'8px', borderRadius:'8px', fontWeight:800, fontSize:'11px', cursor:'pointer'}}>📧 Email</button>
          </div>
          <p style={{fontSize:'10px', color:'#666', textAlign:'center', margin:'6px 0 0'}}>If number NOT on WhatsApp, tap 📱 SMS or 📧 Email</p>
        </div>
      </div>
    );
  };

  if(page!=="home"){
    const expandedData = expanded ? paged.find(function(x){ return x._id===expanded; }) || data.find(function(x){ return x._id===expanded; }) || trash.find(function(x){ return x._id===expanded; }) : null;
    return (
      <div style={{background:'#f0f4ff', minHeight:'100vh', fontFamily:'Arial'}}>
        {toast ? <div style={{position:'fixed', top:'16px', right:'16px', background:'#000', color:'#fff', padding:'10px 14px', borderRadius:'20px', fontWeight:800, zIndex:10000, fontSize:'13px'}}>{toast}</div> : null}
        <div style={{background:'linear-gradient(90deg,#0A1931,#1e3a8a,#2563eb)', color:'#fff', padding:'10px 14px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <b style={{fontSize:'13px'}}>PINNACLE SECURITY LTD</b>
          <TopIcons />
        </div>

        {expanded && expandedData ? renderSmallForm(expandedData) : null}

        {/* AUTO NOTIFY - 3 SEPARATE FALLBACKS */}
        {notifyInfo ? (
          <div style={{maxWidth:'900px', margin:'12px auto 0', padding:'0 14px'}}>
            <div style={{background:'#dcfce7', border:'1px solid #86efac', borderRadius:'12px', padding:'12px', fontSize:'13px'}}>
              <b>✉️ Auto message ready for {notifyInfo.name} - {notifyInfo.status}</b>
              <p style={{margin:'6px 0', color:'#166534'}}>{notifyInfo.msg}</p>
              <p style={{margin:'4px 0', fontSize:'12px', color:'#666'}}>Try WhatsApp first. If number is <b>NOT on WhatsApp</b>, tap SMS or Email - same message, no typing:</p>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'8px', marginTop:'10px'}}>
                <button onClick={function(){sendWhatsApp(notifyInfo);}} style={{background:'#25D366', color:'#fff', border:'none', padding:'11px', borderRadius:'8px', fontWeight:800, fontSize:'12px', cursor:'pointer'}}>💬 WhatsApp<br/><span style={{fontWeight:400, fontSize:'10px'}}>to {notifyInfo.phone}</span></button>
                <button onClick={function(){sendSMS(notifyInfo);}} style={{background:'#0ea5e9', color:'#fff', border:'none', padding:'11px', borderRadius:'8px', fontWeight:800, fontSize:'12px', cursor:'pointer'}}>📱 SMS<br/><span style={{fontWeight:400, fontSize:'10px'}}>Works if NOT on WhatsApp</span></button>
                <button onClick={function(){sendEmail(notifyInfo);}} style={{background:'#2563eb', color:'#fff', border:'none', padding:'11px', borderRadius:'8px', fontWeight:800, fontSize:'12px', cursor:'pointer'}}>📧 Email<br/><span style={{fontWeight:400, fontSize:'10px'}}>{notifyInfo.email||"No email"}</span></button>
              </div>
              <div style={{display:'flex', justifyContent:'center', marginTop:'10px'}}>
                <button onClick={function(){setNotifyInfo(null);}} style={{background:'#fff', border:'1px solid #ddd', padding:'8px 16px', borderRadius:'8px', fontWeight:800, fontSize:'12px', cursor:'pointer'}}>Close</button>
              </div>
            </div>
          </div>
        ) : null}

        <div style={{maxWidth:'1400px', margin:'0 auto', padding:'14px', visibility: expanded ? 'hidden' : 'visible', height: expanded ? '0' : 'auto', overflow: expanded ? 'hidden' : 'visible'}}>
          <div style={{display:'flex', justifyContent:'center', alignItems:'center', flexWrap:'wrap', gap:'10px', textAlign:'center'}}>
            <button onClick={backHome} style={{background:NAVY, color:'#fff', border:'none', padding:'9px 14px', borderRadius:'8px', fontWeight:800, fontSize:'12px', cursor:'pointer'}}>Back</button>
            <h2 style={{margin:0, color:NAVY, fontSize:'18px'}}>{title} <span style={{fontSize:'13px', color:'#666'}}>({filtered.length})</span></h2>
            <button onClick={exportCSV} style={{background:'#2563eb', color:'#fff', border:'none', padding:'9px 14px', borderRadius:'8px', fontWeight:800, fontSize:'11px', cursor:'pointer'}}>CSV</button>
            <button onClick={printAllDetails} style={{background:'#facc15', color:'#000', border:'none', padding:'9px 14px', borderRadius:'8px', fontWeight:800, fontSize:'11px', cursor:'pointer'}}>🖨️ PDF</button>
            <label style={{fontSize:'11px', fontWeight:800, color:NAVY, background:'#fff', padding:'8px 10px', borderRadius:'8px', border:'1px solid #ddd', cursor:'pointer', display:'flex', alignItems:'center', gap:'5px'}}>
              <input type="checkbox" checked={autoNotify} onChange={function(e){setAutoNotify(e.target.checked);}} /> Auto Email / SMS ON
            </label>
          </div>

          <div style={{display:'flex', flexDirection:'column', alignItems:'center', marginTop:'14px'}}>
            <div style={{display:'flex', gap:'8px', flexWrap:'wrap', justifyContent:'center', alignItems:'center'}}>
              <input value={search} onChange={function(e){setSearch(e.target.value); setCurrentPage(1);}} placeholder="Search name, phone, email, service, message, district..." title="Searches EVERYTHING: Name, Phone, Email, Service, Position, District, Education, Experience, Message, Status" style={{width:'360px', maxWidth:'92vw', padding:'9px 14px', borderRadius:'20px', border:'1px solid #ddd', fontSize:'13px', outline:'none', background:'#fff', textAlign:'center'}} />
              <select value={sort} onChange={function(e){setSort(e.target.value);}} style={{padding:'9px 8px', borderRadius:'8px', border:'1px solid #ddd', fontSize:'12px', background:'#fff', fontWeight:700}}><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="az">A-Z</option></select>
              <select value={filterStatus} onChange={function(e){setFilterStatus(e.target.value); setCurrentPage(1);}} style={{padding:'9px 8px', borderRadius:'8px', border:'1px solid #ddd', fontSize:'12px', background:'#fff', fontWeight:700}}><option value="All">All Status</option><option value="New">New</option><option value="Contacted">Contacted</option><option value="Rejected">Rejected</option><option value="Resolved">Resolved</option><option value="Hired">Hired</option></select>
              <select value={filterService} onChange={function(e){setFilterService(e.target.value); setCurrentPage(1);}} style={{padding:'9px 8px', borderRadius:'8px', border:'1px solid #ddd', fontSize:'12px', background:'#fff', fontWeight:700}}>{services.map(function(s){ return <option key={s} value={s}>{s==="All"?"All Service":s}</option>; })}</select>
            </div>
            <p style={{fontSize:'11px', color:'#666', margin:'6px 0 0', textAlign:'center'}}>Searches EVERYTHING: Name • Phone • Email • Service • Position • District • Education • Experience • Message • Status</p>
          </div>

          {selectedIds.length>0 ? (
            <div style={{background:'#0A1931', color:'#fff', padding:'10px 12px', borderRadius:'8px', marginTop:'12px', display:'flex', gap:'6px', flexWrap:'wrap', alignItems:'center', justifyContent:'center'}}>
              <b style={{fontSize:'12px'}}>{selectedIds.length} selected</b>
              <button onClick={bulkEmail} style={{background:'#2563eb', color:'#fff', border:'none', padding:'7px 10px', borderRadius:'6px', fontWeight:800, fontSize:'11px', cursor:'pointer'}}>📧 BULK EMAIL</button>
              {page!=="trash" ? <button onClick={bulkDelete} style={{background:'#dc2626', color:'#fff', border:'none', padding:'7px 10px', borderRadius:'6px', fontWeight:800, fontSize:'11px', cursor:'pointer'}}>🗑️ DELETE SELECTED</button> : <React.Fragment><button onClick={bulkRestore} style={{background:'#059669', color:'#fff', border:'none', padding:'7px 10px', borderRadius:'6px', fontWeight:800, fontSize:'11px', cursor:'pointer'}}>♻️ RESTORE</button><button onClick={bulkDeleteForever} style={{background:'#dc2626', color:'#fff', border:'none', padding:'7px 10px', borderRadius:'6px', fontWeight:800, fontSize:'11px', cursor:'pointer'}}>❌ DELETE FOREVER</button></React.Fragment>}
              <select onChange={function(e){ if(e.target.value) bulkStatus(e.target.value); e.target.value=""; }} style={{padding:'7px', borderRadius:'6px', fontSize:'11px', fontWeight:800}}><option value="">Set Status...</option><option value="New">New</option><option value="Contacted">Contacted</option><option value="Rejected">Rejected</option><option value="Resolved">Resolved</option><option value="Hired">Hired</option></select>
              <button onClick={function(){setSelectedIds([]);}} style={{background:'#fff', color:'#000', border:'none', padding:'7px 10px', borderRadius:'6px', fontWeight:800, fontSize:'11px', cursor:'pointer'}}>Clear</button>
            </div>
          ) : null}

          <div style={{background:'#fff', borderRadius:'12px', overflow:'hidden', marginTop:'14px', border:'1px solid #ddd', boxShadow:'0 2px 10px rgba(0,0,0,0.05)'}}>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%', borderCollapse:'collapse', minWidth:'1050px'}}>
                <thead><tr>
                  <th style={th}><input type="checkbox" checked={paged.length>0 && selectedIds.length===paged.length} onChange={toggleSelectAll} /></th>
                  <th style={th}>Name</th>
                  <th style={th}>Phone</th>
                  <th style={th}>Email</th>
                  {page==="contacts" ? <React.Fragment><th style={th}>Service</th><th style={th}>Message</th></React.Fragment> : null}
                  {page==="applicants" ? <React.Fragment><th style={th}>Position</th><th style={th}>District</th><th style={th}>Education</th><th style={th}>Experience</th></React.Fragment> : null}
                  {page==="all" || page==="trash" ? <React.Fragment><th style={th}>Service / Position</th><th style={th}>District</th><th style={th}>Education</th><th style={th}>Experience</th></React.Fragment> : null}
                  <th style={{...th, borderRight:'none'}}>Status</th>
                </tr></thead>
                <tbody>
                  {paged.map(function(d){
                    return (
                      <tr key={d._id} style={{background:'#fff'}}>
                        <td style={tdBase}><input type="checkbox" checked={selectedIds.indexOf(d._id)!==-1} onChange={function(e){e.stopPropagation(); toggleSelect(d._id);}} onClick={function(e){e.stopPropagation();}} /></td>
                        <td onClick={function(){ setExpanded(d._id); setEditing(false); }} style={{...tdBase, fontWeight:800, color:NAVY, cursor:'pointer', whiteSpace:'nowrap', minWidth:'140px'}}>{getVal(d,["FullName","fullName"])}</td>
                        <td onClick={function(){ setExpanded(d._id); setEditing(false); }} style={{...tdBase, cursor:'pointer', whiteSpace:'nowrap'}}>{getVal(d,["Phone","phone"])}</td>
                        <td onClick={function(){ setExpanded(d._id); setEditing(false); }} style={{...tdBase, cursor:'pointer', minWidth:'160px', maxWidth:'200px', wordBreak:'break-word'}}>{getVal(d,["Email","email"])||"-"}</td>
                        {page==="contacts" ? <React.Fragment>
                          <td onClick={function(){ setExpanded(d._id); setEditing(false); }} style={{...tdBase, cursor:'pointer', minWidth:'130px'}}>{getVal(d,["Service","service"])||"-"}</td>
                          <td onClick={function(){ setExpanded(d._id); setEditing(false); }} style={{...tdBase, cursor:'pointer', minWidth:'180px', maxWidth:'260px', whiteSpace:'normal'}}>{getVal(d,["Message","Messages","message","messages"])||"-"}</td>
                        </React.Fragment> : null}
                        {page==="applicants" ? <React.Fragment>
                          <td onClick={function(){ setExpanded(d._id); setEditing(false); }} style={{...tdBase, cursor:'pointer', minWidth:'120px'}}>{getVal(d,["Position","position"])||"-"}</td>
                          <td onClick={function(){ setExpanded(d._id); setEditing(false); }} style={{...tdBase, cursor:'pointer'}}>{getVal(d,["District","district"])||"-"}</td>
                          <td onClick={function(){ setExpanded(d._id); setEditing(false); }} style={{...tdBase, cursor:'pointer'}}>{getVal(d,["Education","education"])||"-"}</td>
                          <td onClick={function(){ setExpanded(d._id); setEditing(false); }} style={{...tdBase, cursor:'pointer', minWidth:'80px'}}>{getVal(d,["Experience","experience"])||"-"}</td>
                        </React.Fragment> : null}
                        {page==="all" || page==="trash" ? <React.Fragment>
                          <td onClick={function(){ setExpanded(d._id); setEditing(false); }} style={{...tdBase, cursor:'pointer', minWidth:'130px'}}>{getVal(d,["Service","service"])||getVal(d,["Position","position"])||"-"}</td>
                          <td onClick={function(){ setExpanded(d._id); setEditing(false); }} style={{...tdBase, cursor:'pointer'}}>{getVal(d,["District","district"])||"-"}</td>
                          <td onClick={function(){ setExpanded(d._id); setEditing(false); }} style={{...tdBase, cursor:'pointer'}}>{getVal(d,["Education","education"])||"-"}</td>
                          <td onClick={function(){ setExpanded(d._id); setEditing(false); }} style={{...tdBase, cursor:'pointer', minWidth:'80px'}}>{getVal(d,["Experience","experience"])||"-"}</td>
                        </React.Fragment> : null}
                        <td style={{...tdBase, whiteSpace:'nowrap', borderRight:'none'}} onClick={function(e){e.stopPropagation();}}>
                          <select value={getStatus(d)} onChange={function(e){changeStatus(d,e.target.value);}} style={{padding:'7px 8px', borderRadius:'20px', border:'1px solid #ddd', fontWeight:800, fontSize:'11px', background:statusColor(getStatus(d)), cursor:'pointer'}}>
                            {statusOptions(d).map(function(s){ return <option key={s} value={s}>{s}</option>; })}
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {paged.length===0 && !loading ? <p style={{textAlign:'center', color:'#888', padding:'18px'}}>No {title} yet</p> : null}
            {loading ? <p style={{textAlign:'center', padding:'14px'}}>Loading...</p> : null}
          </div>
          <div style={{display:'flex', justifyContent:'center', alignItems:'center', gap:'8px', marginTop:'12px'}}>
            <button disabled={safePage<=1} onClick={function(){setCurrentPage(safePage-1);}} style={{background: safePage<=1?'#e5e7eb':NAVY, color: safePage<=1?'#999':'#fff', border:'none', padding:'9px 14px', borderRadius:'8px', fontWeight:800, fontSize:'12px', cursor:'pointer'}}>Prev</button>
            <span style={{fontSize:'13px', fontWeight:800, color:NAVY}}>Page {safePage} / {totalPages}</span>
            <button disabled={safePage>=totalPages} onClick={function(){setCurrentPage(safePage+1);}} style={{background: safePage>=totalPages?'#e5e7eb':NAVY, color: safePage>=totalPages?'#999':'#fff', border:'none', padding:'9px 14px', borderRadius:'8px', fontWeight:800, fontSize:'12px', cursor:'pointer'}}>Next</button>
          </div>
        </div>
      </div>
    );
  }

  const boxStyle = function(grad){ return {background:grad, borderRadius:'16px', padding:'22px 10px 18px', cursor:'pointer', textAlign:'center', color:'#fff', boxShadow:'0 8px 20px rgba(0,0,0,0.12)'}; };
  return (
    <div style={{background:'#f0f4ff', minHeight:'100vh', fontFamily:'Arial', padding:'0'}}>
      {toast ? <div style={{position:'fixed', top:'16px', right:'16px', background:'#000', color:'#fff', padding:'10px 14px', borderRadius:'20px', fontWeight:800, zIndex:10000, fontSize:'13px'}}>{toast}</div> : null}
      <div style={{background:'linear-gradient(90deg,#0A1931,#1e3a8a,#2563eb)', color:'#fff', padding:'10px 14px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <b style={{fontSize:'13px'}}>PINNACLE SECURITY LTD</b>
        <TopIcons />
      </div>
      <div style={{maxWidth:'520px', margin:'0 auto', padding:'18px 14px 20px'}}>
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
        <p style={{fontSize:'12px', color:'#888', textAlign:'center', marginTop:'16px'}}>Tap any box to open table • Tap row to expand</p>
        {loading ? <p style={{textAlign:'center', fontSize:'12px', color:'#888'}}>Loading...</p> : null}
      </div>
    </div>
  );
}