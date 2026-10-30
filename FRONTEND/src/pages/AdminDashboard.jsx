import React, { useState, useEffect } from 'react';

const PASSWORD = "Rubangakene";
const WEBHOOK = "https://script.google.com/macros/s/AKfycbz0Fx9gSfPwPXZdi8pivw9IdQ_fzj707fPk22GBECuGYhGzwePtEPZV47TyXk8TN8bggQ/exec";
const NAVY = "#0A1931";

export default function AdminDashboard() {
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState("");
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(null);
  const [detailId, setDetailId] = useState("");
  const [toast, setToast] = useState("");

  const showToast = (m) => { setToast(m); setTimeout(()=>setToast(""), 3000); };

  // CHECK URL - if ?detail=... then show that person full page
  useEffect(()=>{
    const p = new URLSearchParams(window.location.search);
    const d = p.get("detail");
    if(d) setDetailId(decodeURIComponent(d));
  },[]);

  const login = () => {
    if (pass.trim() === PASSWORD) setAuth(true);
    else alert("Wrong Password! You typed: " + pass);
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

  // ---------- LOGIN ----------
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
  const base = tab==="contacts" ? contacts : tab==="applicants" ? applicants : data;

  const filtered = base.filter(d=>{
    const s = `${getVal(d,["FullName","fullName"])} ${getVal(d,["Phone","phone"])} ${getVal(d,["Email","email"])} ${getVal(d,["Service","service"])} ${getVal(d,["Position","position"])} ${getVal(d,["District","district"])} ${getVal(d,["Message","Messages","message","messages"])}`.toLowerCase();
    return s.includes(search.toLowerCase());
  }).reverse();

  // If URL has ?detail= , find that person
  const detailRow = detailId ? data.find(d => String(getVal(d,["Timestamp","timestamp"])) === String(detailId) || d._id === detailId) : null;

  const openInNewPage = (d) => {
    const ts = getVal(d,["Timestamp","timestamp"]);
    window.open(window.location.pathname + "?detail=" + encodeURIComponent(ts), "_blank");
  };

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
    setPopup(null);
    if(detailId) { setDetailId(""); window.history.pushState({}, "", "/admin"); }
    showToast("Deleted");
    await fetch(WEBHOOK,{method:'POST', mode:'no-cors', headers:{'Content-Type':'text/plain'}, body: JSON.stringify({action:'delete', timestamps:[ts], Timestamp: ts})});
  };

  const exportCSV = () => {
    if(!filtered.length) return showToast("No rows");
    const head = ["Timestamp","FullName","Phone","Email","Service","Position","District","Education","Experience","Interest","Message","Type"];
    const csv = "\uFEFF" + [head.join(",")].concat(filtered.map(r=> head.map(h=>{
      let v = "";
      if(h==="Timestamp") v = getVal(r,["Timestamp","timestamp"]);
      else if(h==="Message") v = getVal(r,["Message","Messages","message","messages"]);
      else v = getVal(r,[h,h.toLowerCase()]);
      return `"${String(v||"").replace(/"/g,'""')}"`;
    }).join(","))).join("\n");
    const blob = new Blob([csv],{type:"text/csv"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download=`pinnacle_${tab}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const btn = (bg) => ({background:bg, color:'#fff', border:'none', padding:'10px 14px', borderRadius:'20px', fontWeight:800, cursor:'pointer', fontSize:'12px', textDecoration:'none', display:'inline-block', textAlign:'center'});
  const tabBtn = (active) => ({background: active?NAVY:'#eef2f7', color: active?'#fff':'#000', border:'none', padding:'10px 12px', borderRadius:'20px', fontWeight:800, cursor:'pointer', fontSize:'12px', flex:1});

  // ---------- DETAIL FULL PAGE - When opened in NEW PAGE ----------
  if(detailId){
    return (
      <div style={{background:'#f8fafc', minHeight:'100vh', fontFamily:'Arial', padding:'16px'}}>
        <div style={{maxWidth:'600px', margin:'0 auto'}}>
          <button onClick={()=>{setDetailId(""); window.history.pushState({}, "", "/admin");}} style={{...btn(NAVY)}}>⬅ Back to List</button>
          {loading && <p>Loading detail...</p>}
          {!loading && !detailRow && <div style={{background:'#fff', padding:'20px', borderRadius:'12px', marginTop:'14px'}}><h3>Not found</h3><p>This person may have been deleted or still loading. Tap Refresh.</p><button onClick={load} style={btn(NAVY)}>🔄 Refresh</button></div>}
          {detailRow && (
            <div style={{background:'#fff', borderRadius:'16px', padding:'20px', marginTop:'14px'}}>
              <div style={{display:'flex', justifyContent:'space-between'}}><h2 style={{margin:0, color:NAVY}}>{getVal(detailRow,["FullName","fullName"])}</h2><span style={{fontSize:'11px', background: isApplicant(detailRow)?'#fee2e2':'#dcfce7', padding:'6px 10px', borderRadius:'20px', fontWeight:800, height:'fit-content'}}>{isApplicant(detailRow)?"APPLICANT":"CONTACT"}</span></div>
              <p style={{color:'#666', fontSize:'13px'}}>{getVal(detailRow,["Timestamp","timestamp"])}</p>
              <div style={{display:'grid', gap:'10px', fontSize:'15px', marginTop:'10px'}}>
                <div><b>📞 Phone:</b> {getVal(detailRow,["Phone","phone"])}</div>
                <div><b>📧 Email:</b> {getVal(detailRow,["Email","email"]) || "-"}</div>
                {getVal(detailRow,["Service","service"]) && <div><b>🛡️ Service:</b> {getVal(detailRow,["Service","service"])}</div>}
                {getVal(detailRow,["Position","position"]) && <div><b>💼 Position:</b> {getVal(detailRow,["Position","position"])}</div>}
                {getVal(detailRow,["Education","education"]) && <div><b>🎓 Education:</b> {getVal(detailRow,["Education","education"])}</div>}
                {getVal(detailRow,["District","district"]) && <div><b>📍 District:</b> {getVal(detailRow,["District","district"])}</div>}
                {getVal(detailRow,["Experience","experience"]) && <div><b>⏳ Experience:</b> {getVal(detailRow,["Experience","experience"])}</div>}
                {getVal(detailRow,["Interest","interest"]) && <div><b>⭐ Interest:</b> {getVal(detailRow,["Interest","interest"])}</div>}
                {getVal(detailRow,["Message","Messages","message","messages"]) && <div style={{background:'#f8fafc', padding:'12px', borderRadius:'10px'}}><b>💬 Message:</b><br/>{getVal(detailRow,["Message","Messages","message","messages"])}</div>}
              </div>
              <div style={{display:'flex', gap:'8px', flexWrap:'wrap', marginTop:'16px'}}>
                <a href={`tel:${getVal(detailRow,["Phone","phone"])}`} style={btn(NAVY)}>📞 Call</a>
                <a href={waLink(detailRow)} target="_blank" rel="noreferrer" style={btn('#25D366')}>💬 WhatsApp</a>
                <a href={`mailto:${getVal(detailRow,["Email","email"])}`} style={btn('#0ea5e9')}>📧 Email</a>
                <button onClick={()=>handleDelete(detailRow)} style={btn('#dc2626')}>🗑️ Delete</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---------- MAIN LIST - 1 COLUMN ----------
  return (
    <div style={{background:'#f8fafc', minHeight:'100vh', fontFamily:'Arial', padding:'16px'}}>
      {toast && <div style={{position:'fixed', top:'20px', right:'20px', background:'#000', color:'#fff', padding:'12px 18px', borderRadius:'20px', fontWeight:800, zIndex:9999}}>{toast}</div>}
      <div style={{maxWidth:'600px', margin:'0 auto'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <h2 style={{margin:0, color:NAVY}}>Welcome, Admin</h2>
          <button onClick={()=>setAuth(false)} style={btn('#64748b')}>Logout</button>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'10px', marginTop:'14px'}}>
          <div onClick={()=>setTab("contacts")} style={{background:'#fff', padding:'16px', borderRadius:'12px', textAlign:'center', cursor:'pointer'}}><div style={{fontSize:'22px', fontWeight:900}}>{contacts.length}</div><div style={{fontSize:'12px', color:'#666'}}>Contacts</div></div>
          <div onClick={()=>setTab("applicants")} style={{background:'#fff', padding:'16px', borderRadius:'12px', textAlign:'center', cursor:'pointer'}}><div style={{fontSize:'22px', fontWeight:900, color:'#dc2626'}}>{applicants.length}</div><div style={{fontSize:'12px', color:'#666'}}>Applicants</div></div>
          <div onClick={()=>setTab("all")} style={{background:'#fff', padding:'16px', borderRadius:'12px', textAlign:'center', cursor:'pointer'}}><div style={{fontSize:'22px', fontWeight:900, color:'#2563eb'}}>{data.length}</div><div style={{fontSize:'12px', color:'#666'}}>Total</div></div>
        </div>

        <div style={{display:'flex', gap:'8px', marginTop:'12px'}}>
          <button onClick={()=>setTab("all")} style={tabBtn(tab==="all")}>All</button>
          <button onClick={()=>setTab("contacts")} style={tabBtn(tab==="contacts")}>Contacts</button>
          <button onClick={()=>setTab("applicants")} style={tabBtn(tab==="applicants")}>Applicants</button>
        </div>

        <div style={{display:'flex', gap:'8px', marginTop:'12px'}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search name, phone, service..." style={{flex:1, padding:'12px', borderRadius:'20px', border:'1px solid #ddd'}} />
          <button onClick={load} style={btn(NAVY)}>🔄 Refresh</button>
          <button onClick={exportCSV} style={btn('#2563eb')}>CSV</button>
        </div>

        <p style={{fontSize:'13px', color:'#666', marginTop:'10px'}}>{loading ? "Loading..." : `${filtered.length} found - Tap a card to see detail`}</p>

        {/* 1 COLUMN LIST */}
        <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
          {filtered.map(d=>(
            <div key={d._id} onClick={()=>setPopup(d)} style={{background:'#fff', borderRadius:'12px', padding:'14px', border:'1px solid #eee', cursor:'pointer'}}>
              <div style={{display:'flex', justifyContent:'space-between', gap:'8px'}}><b>{getVal(d,["FullName","fullName"]) || "No Name"}</b><span style={{fontSize:'11px', background: isApplicant(d)?'#fee2e2':'#dcfce7', padding:'4px 8px', borderRadius:'20px', fontWeight:800, whiteSpace:'nowrap'}}>{isApplicant(d)?"APPLICANT":"CONTACT"}</span></div>
              <div style={{fontSize:'13px', color:'#333', marginTop:'6px'}}>📞 {getVal(d,["Phone","phone"])} • 📧 {getVal(d,["Email","email"]) || "-"}</div>
              <div style={{fontSize:'13px', color:'#555', marginTop:'4px'}}>{getVal(d,["Service","service"]) || getVal(d,["Position","position"]) || ""} {getVal(d,["District","district"]) ? "• "+getVal(d,["District","district"]) : ""}</div>
              <div style={{fontSize:'12px', color:'#888', marginTop:'4px'}}>{getVal(d,["Timestamp","timestamp"])}</div>
              <div style={{fontSize:'12px', color:NAVY, fontWeight:800, marginTop:'6px'}}>Tap to view detail →</div>
            </div>
          ))}
        </div>

        {filtered.length===0 && !loading && <p style={{textAlign:'center', color:'#888', marginTop:'30px'}}>No data yet</p>}
        <a href="/" style={{display:'block', textAlign:'center', marginTop:'20px', color:NAVY, fontWeight:800}}>🏠 Back to Home</a>
      </div>

      {/* POPUP - TAP CARD */}
      {popup && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:10000, display:'flex', justifyContent:'center', alignItems:'flex-end', padding:'0'}} onClick={()=>setPopup(null)}>
          <div style={{background:'#fff', borderRadius:'20px 20px 0 0', padding:'20px', width:'100%', maxWidth:'600px', maxHeight:'90vh', overflowY:'auto', fontFamily:'Arial'}} onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
              <h2 style={{margin:0, color:NAVY}}>{getVal(popup,["FullName","fullName"])}</h2>
              <button onClick={()=>setPopup(null)} style={{border:'none', background:NAVY, color:'#fff', width:'32px', height:'32px', borderRadius:'50%', cursor:'pointer'}}>✕</button>
            </div>
            <span style={{fontSize:'11px', background: isApplicant(popup)?'#fee2e2':'#dcfce7', padding:'5px 10px', borderRadius:'20px', fontWeight:800, display:'inline-block', marginTop:'8px'}}>{isApplicant(popup)?"APPLICANT":"CONTACT"}</span>
            <p style={{color:'#666', fontSize:'13px'}}>{getVal(popup,["Timestamp","timestamp"])}</p>
            <div style={{display:'grid', gap:'10px', fontSize:'15px'}}>
              <div><b>📞 Phone:</b> {getVal(popup,["Phone","phone"])}</div>
              <div><b>📧 Email:</b> {getVal(popup,["Email","email"]) || "-"}</div>
              {getVal(popup,["Service","service"]) && <div><b>🛡️ Service:</b> {getVal(popup,["Service","service"])}</div>}
              {getVal(popup,["Position","position"]) && <div><b>💼 Position:</b> {getVal(popup,["Position","position"])}</div>}
              {getVal(popup,["Education","education"]) && <div><b>🎓 Education:</b> {getVal(popup,["Education","education"])}</div>}
              {getVal(popup,["District","district"]) && <div><b>📍 District:</b> {getVal(popup,["District","district"])}</div>}
              {getVal(popup,["Experience","experience"]) && <div><b>⏳ Experience:</b> {getVal(popup,["Experience","experience"])}</div>}
              {getVal(popup,["Interest","interest"]) && <div><b>⭐ Interest:</b> {getVal(popup,["Interest","interest"])}</div>}
              {getVal(popup,["Message","Messages","message","messages"]) && <div style={{background:'#f8fafc', padding:'12px', borderRadius:'10px'}}><b>💬 Message:</b><br/>{getVal(popup,["Message","Messages","message","messages"])}</div>}
            </div>

            <button onClick={()=>openInNewPage(popup)} style={{width:'100%', marginTop:'14px', background:'#facc15', color:'#000', border:'none', padding:'13px', borderRadius:'10px', fontWeight:900, cursor:'pointer'}}>↗ Open in New Page</button>

            <div style={{display:'flex', gap:'8px', flexWrap:'wrap', marginTop:'10px'}}>
              <a href={`tel:${getVal(popup,["Phone","phone"])}`} style={{...btn(NAVY), flex:1}}>📞 Call</a>
              <a href={waLink(popup)} target="_blank" rel="noreferrer" style={{...btn('#25D366'), flex:1}}>💬 WhatsApp</a>
              <a href={`mailto:${getVal(popup,["Email","email"])}`} style={{...btn('#0ea5e9'), flex:1}}>📧 Email</a>
              <button onClick={()=>handleDelete(popup)} style={{...btn('#dc2626'), flex:1}}>🗑️ Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}