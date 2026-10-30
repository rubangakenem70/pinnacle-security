import React, { useState, useEffect } from 'react';

const PASSWORD = "Rubangakene";
const WEBHOOK = "https://script.google.com/macros/s/AKfycbz0Fx9gSfPwPXZdi8pivw9IdQ_fzj707fPk22GBECuGYhGzwePtEPZV47TyXk8TN8bggQ/exec";
const NAVY = "#0A1931";

export default function AdminDashboard() {
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState("");
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState("home"); // home | contacts | applicants | all | detail
  const [detailId, setDetailId] = useState("");
  const [prevPage, setPrevPage] = useState("home");
  const [toast, setToast] = useState("");

  const showToast = (m) => { setToast(m); setTimeout(()=>setToast(""), 3000); };

  useEffect(()=>{
    const p = new URLSearchParams(window.location.search);
    const d = p.get("detail");
    if(d){ setDetailId(decodeURIComponent(d)); setPage("detail"); }
    const v = p.get("view");
    if(v==="contacts"||v==="applicants"||v==="all") setPage(v);
  },[]);

  const login = () => {
    if (pass.trim() === PASSWORD) setAuth(true);
    else alert("Wrong Password!");
  };

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

  const load = () => {
    setLoading(true);
    const cb = "psl_cb_" + Date.now();
    const old = document.getElementById("psl_jsonp");
    if(old) old.remove();
    window[cb] = (d) => {
      try {
        const arr = Array.isArray(d) ? d : (d.data || []);
        const clean = arr.filter(r => r.Timestamp || r.timestamp).map((r,i)=>({...r, _id: (r.Timestamp||r.timestamp)+"_"+i}));
        setData(clean);
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
        <div style={{background:'#fff', padding:'32px', borderRadius:'16px', width:'92%', maxWidth:'380px', textAlign:'center'}}>
          <div style={{width:'64px', height:'64px', background:NAVY, borderRadius:'12px', margin:'0 auto 12px', display:'grid', placeItems:'center', color:'#fff', fontWeight:900, fontSize:'28px'}}>P</div>
          <h2 style={{color:NAVY, margin:0}}>PINNACLE ADMIN</h2>
          <input type="password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&login()} placeholder="Password" style={{width:'100%', padding:'14px', borderRadius:'10px', marginTop:'16px', border:'1px solid #ddd', boxSizing:'border-box'}} />
          <button onClick={login} style={{width:'100%', marginTop:'12px', background:NAVY, color:'#fff', padding:'14px', border:'none', borderRadius:'10px', fontWeight:900, cursor:'pointer'}}>UNLOCK</button>
        </div>
      </div>
    );
  }

  const contacts = data.filter(d=>!isApplicant(d));
  const applicants = data.filter(d=>isApplicant(d));

  const openList = (view) => {
    setPage(view);
    setSearch("");
    window.history.pushState({}, "", "/admin?view=" + view);
    window.scrollTo(0,0);
  };

  const backHome = () => {
    setPage("home");
    setSearch("");
    window.history.pushState({}, "", "/admin");
  };

  const openDetail = (d) => {
    const ts = getVal(d,["Timestamp","timestamp"]);
    setPrevPage(page);
    setDetailId(ts);
    setPage("detail");
    window.history.pushState({}, "", "/admin?detail=" + encodeURIComponent(ts));
    window.scrollTo(0,0);
  };

  const backToList = () => {
    setPage(prevPage);
    setDetailId("");
    window.history.pushState({}, "", "/admin?view=" + prevPage);
  };

  const detailRow = detailId ? data.find(d => String(getVal(d,["Timestamp","timestamp"])) === String(detailId) || d._id === detailId) : null;

  const waLink = (d) => {
    let p = String(getVal(d,["Phone","phone"])||"").replace(/\s/g,"").replace(/^\+/,"");
    if(p.startsWith("0")) p = "256"+p.slice(1);
    const text = `Hello ${getVal(d,["FullName","fullName"])}, this is Pinnacle Security Ltd, Muyenga. Thank you for contacting us. We will call you soon. Control 24/7: 0776971970.`;
    return `https://wa.me/${p}?text=${encodeURIComponent(text)}`;
  };

  const handleDelete = async (row) => {
    if(!confirm("Delete " + getVal(row,["FullName","fullName"]) + "?")) return;
    const ts = getVal(row,["Timestamp","timestamp"]);
    setData(prev=>prev.filter(r=>r._id!==row._id));
    setPage(prevPage);
    setDetailId("");
    showToast("Deleted");
    await fetch(WEBHOOK,{method:'POST', mode:'no-cors', headers:{'Content-Type':'text/plain'}, body: JSON.stringify({action:'delete', timestamps:[ts], Timestamp: ts})});
  };

  const btn = (bg) => ({background:bg, color:'#fff', border:'none', padding:'12px 14px', borderRadius:'20px', fontWeight:800, cursor:'pointer', fontSize:'13px', textDecoration:'none', display:'inline-block', textAlign:'center'});
  const searchStyle = {width:'100%', padding:'14px 16px', borderRadius:'20px', border:'1px solid #ddd', fontSize:'15px', boxSizing:'border-box', outline:'none'};

  // ========== DETAIL PAGE ==========
  if(page==="detail"){
    return (
      <div style={{background:'#f8fafc', minHeight:'100vh', fontFamily:'Arial', padding:'16px'}}>
        <div style={{maxWidth:'600px', margin:'0 auto'}}>
          <button onClick={backToList} style={{...btn(NAVY)}}>⬅ Back</button>
          {loading && <p>Loading...</p>}
          {!loading && !detailRow && <div style={{background:'#fff', padding:'20px', borderRadius:'12px', marginTop:'14px'}}><h3>Not found</h3><button onClick={load} style={btn(NAVY)}>🔄 Refresh</button></div>}
          {detailRow && (
            <div style={{background:'#fff', borderRadius:'16px', padding:'20px', marginTop:'14px'}}>
              <div style={{display:'flex', justifyContent:'space-between', gap:'10px'}}><h2 style={{margin:0, color:NAVY}}>{getVal(detailRow,["FullName","fullName"])}</h2><span style={{fontSize:'11px', background: isApplicant(detailRow)?'#fee2e2':'#dcfce7', padding:'6px 10px', borderRadius:'20px', fontWeight:800, height:'fit-content', whiteSpace:'nowrap'}}>{isApplicant(detailRow)?"APPLICANT":"CONTACT"}</span></div>
              <p style={{color:'#666', fontSize:'13px'}}>{getVal(detailRow,["Timestamp","timestamp"])}</p>
              <div style={{display:'grid', gap:'12px', fontSize:'15px', marginTop:'10px'}}>
                <div><b>📞 Phone:</b> {getVal(detailRow,["Phone","phone"])}</div>
                <div><b>📧 Email:</b> {getVal(detailRow,["Email","email"]) || "-"}</div>
                {getVal(detailRow,["Service","service"]) && <div><b>🛡️ Service:</b> {getVal(detailRow,["Service","service"])}</div>}
                {getVal(detailRow,["Position","position"]) && <div><b>💼 Position:</b> {getVal(detailRow,["Position","position"])}</div>}
                {getVal(detailRow,["Education","education"]) && <div><b>🎓 Education:</b> {getVal(detailRow,["Education","education"])}</div>}
                {getVal(detailRow,["District","district"]) && <div><b>📍 District:</b> {getVal(detailRow,["District","district"])}</div>}
                {getVal(detailRow,["Experience","experience"]) && <div><b>⏳ Experience:</b> {getVal(detailRow,["Experience","experience"])}</div>}
                {getVal(detailRow,["Message","Messages","message","messages"]) && <div style={{background:'#f8fafc', padding:'12px', borderRadius:'10px'}}><b>💬 Message:</b><br/>{getVal(detailRow,["Message","Messages","message","messages"])}</div>}
              </div>
              <div style={{display:'flex', gap:'8px', flexWrap:'wrap', marginTop:'18px'}}>
                <a href={`tel:${getVal(detailRow,["Phone","phone"])}`} style={{...btn(NAVY), flex:1}}>📞 Call</a>
                <a href={waLink(detailRow)} target="_blank" rel="noreferrer" style={{...btn('#25D366'), flex:1}}>💬 WhatsApp</a>
                <a href={`mailto:${getVal(detailRow,["Email","email"])}`} style={{...btn('#0ea5e9'), flex:1}}>📧 Email</a>
                <button onClick={()=>handleDelete(detailRow)} style={{...btn('#dc2626'), flex:1}}>🗑️ Delete</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ========== LIST PAGE - SEPARATE PAGE FOR CONTACTS / APPLICANTS / ALL ==========
  if(page==="contacts" || page==="applicants" || page==="all"){
    const base = page==="contacts" ? contacts : page==="applicants" ? applicants : data;
    const filtered = base.filter(d=>{
      const s = `${getVal(d,["FullName","fullName"])} ${getVal(d,["Phone","phone"])}`.toLowerCase();
      return s.includes(search.toLowerCase());
    }).reverse();
    const title = page==="contacts" ? "Contacts" : page==="applicants" ? "Applicants" : "All";
    const exportCSV = () => {
      if(!filtered.length) return showToast("No rows");
      const head = ["Timestamp","FullName","Phone","Email","Service","Position","District","Education","Experience","Message","Type"];
      const csv = "\uFEFF" + [head.join(",")].concat(filtered.map(r=> head.map(h=>{
        let v = "";
        if(h==="Timestamp") v = getVal(r,["Timestamp","timestamp"]);
        else if(h==="Message") v = getVal(r,["Message","Messages","message","messages"]);
        else v = getVal(r,[h,h.toLowerCase()]);
        return `"${String(v||"").replace(/"/g,'""')}"`;
      }).join(","))).join("\n");
      const blob = new Blob([csv],{type:"text/csv"});
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href=url; a.download=`pinnacle_${page}.csv`; a.click();
      URL.revokeObjectURL(url);
    };
    return (
      <div style={{background:'#f8fafc', minHeight:'100vh', fontFamily:'Arial', padding:'16px'}}>
        <div style={{maxWidth:'600px', margin:'0 auto'}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <button onClick={backHome} style={{...btn(NAVY)}}>⬅ Back</button>
            <h2 style={{margin:0, color:NAVY}}>{title}</h2>
            <button onClick={exportCSV} style={btn('#2563eb')}>CSV</button>
          </div>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={`🔍 Search ${title.toLowerCase()}...`} style={{...searchStyle, marginTop:'14px'}} />
          <div style={{display:'flex', flexDirection:'column', gap:'10px', marginTop:'14px'}}>
            {filtered.map(d=>(
              <div key={d._id} onClick={()=>openDetail(d)} style={{background:'#fff', borderRadius:'12px', padding:'16px', border:'1px solid #eee', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <b style={{fontSize:'16px', color:NAVY}}>{getVal(d,["FullName","fullName"]) || "No Name"}</b>
                <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                  <span style={{fontSize:'11px', background: isApplicant(d)?'#fee2e2':'#dcfce7', padding:'5px 10px', borderRadius:'20px', fontWeight:800, whiteSpace:'nowrap'}}>{isApplicant(d)?"APPLICANT":"CONTACT"}</span>
                  <span style={{fontSize:'18px', color:NAVY, fontWeight:900}}>›</span>
                </div>
              </div>
            ))}
          </div>
          {filtered.length===0 && !loading && <p style={{textAlign:'center', color:'#888', marginTop:'30px'}}>No {title} yet</p>}
          {loading && <p style={{textAlign:'center'}}>Loading...</p>}
        </div>
      </div>
    );
  }

  // ========== HOME PAGE - ONLY SEARCH + 3 BOXES, NO LIST ==========
  return (
    <div style={{background:'#f8fafc', minHeight:'100vh', fontFamily:'Arial', padding:'16px'}}>
      {toast && <div style={{position:'fixed', top:'20px', right:'20px', background:'#000', color:'#fff', padding:'12px 18px', borderRadius:'20px', fontWeight:800, zIndex:9999}}>{toast}</div>}
      <div style={{maxWidth:'600px', margin:'0 auto'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <h2 style={{margin:0, color:NAVY}}>Welcome, Admin</h2>
          <button onClick={()=>setAuth(false)} style={btn('#64748b')}>Logout</button>
        </div>

        {/* SEARCH ON TOP */}
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search name..." style={{...searchStyle, marginTop:'16px'}} />
        <div style={{display:'flex', gap:'8px', marginTop:'10px'}}>
          <button onClick={load} style={{...btn(NAVY), flex:1}}>🔄 Refresh</button>
          <button onClick={()=>{ if(search.trim()){ // search from home -> go to All page with search
            setPage("all"); window.history.pushState({}, "", "/admin?view=all");
          }}} style={{...btn('#2563eb'), flex:1}}>🔍 Search</button>
        </div>

        {/* ONLY 3 BOXES - NO LIST, NO TABS */}
        <div style={{display:'flex', flexDirection:'column', gap:'12px', marginTop:'16px'}}>
          <div onClick={()=>openList("contacts")} style={{background:'#fff', borderRadius:'16px', padding:'22px', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', border:'1px solid #eee'}}>
            <div><div style={{fontSize:'28px', fontWeight:900, color:NAVY}}>{contacts.length}</div><div style={{fontSize:'14px', color:'#666'}}>Contacts</div><div style={{fontSize:'12px', color:NAVY, fontWeight:800, marginTop:'4px'}}>Tap to open →</div></div>
            <span style={{fontSize:'32px'}}>📩</span>
          </div>

          <div onClick={()=>openList("applicants")} style={{background:'#fff', borderRadius:'16px', padding:'22px', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', border:'1px solid #eee'}}>
            <div><div style={{fontSize:'28px', fontWeight:900, color:'#dc2626'}}>{applicants.length}</div><div style={{fontSize:'14px', color:'#666'}}>Applicants</div><div style={{fontSize:'12px', color:'#dc2626', fontWeight:800, marginTop:'4px'}}>Tap to open →</div></div>
            <span style={{fontSize:'32px'}}>👤</span>
          </div>

          <div onClick={()=>openList("all")} style={{background:'#fff', borderRadius:'16px', padding:'22px', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', border:'1px solid #eee'}}>
            <div><div style={{fontSize:'28px', fontWeight:900, color:'#2563eb'}}>{data.length}</div><div style={{fontSize:'14px', color:'#666'}}>All</div><div style={{fontSize:'12px', color:'#2563eb', fontWeight:800, marginTop:'4px'}}>Tap to open →</div></div>
            <span style={{fontSize:'32px'}}>📋</span>
          </div>
        </div>

        <a href="/" style={{display:'block', textAlign:'center', marginTop:'22px', color:NAVY, fontWeight:800}}>🏠 Back to Home</a>
      </div>
    </div>
  );
}