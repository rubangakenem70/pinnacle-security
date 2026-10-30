import React, { useState, useEffect } from 'react';

const PASSWORD = "Rubangakene";
const WEBHOOK = "https://script.google.com/macros/s/AKfycbz0Fx9gSfPwPXZdi8pivw9IdQ_fzj707fPk22GBECuGYhGzwePtEPZV47TyXk8TN8bggQ/exec";
const NAVY = "#0A1931";
const GOLD = "#facc15";

export default function AdminDashboard() {
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState("");
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all"); // all | contacts | applicants
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState("");

  const showToast = (m) => { setToast(m); setTimeout(()=>setToast(""), 3000); };

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
    s.onerror = () => { setLoading(false); showToast("Load failed - Check Google Script Deploy = Anyone"); };
    document.body.appendChild(s);
  };

  useEffect(()=>{ if(auth) load(); },[auth]);

  if(!auth){
    return (
      <div style={{minHeight:'100vh', background:NAVY, display:'flex', justifyContent:'center', alignItems:'center', fontFamily:'Arial'}}>
        <div style={{background:'#fff', padding:'32px', borderRadius:'16px', width:'92%', maxWidth:'380px', textAlign:'center'}}>
          <div style={{width:'64px', height:'64px', background:NAVY, borderRadius:'12px', margin:'0 auto 12px', display:'grid', placeItems:'center', color:'#fff', fontWeight:900, fontSize:'28px'}}>P</div>
          <h2 style={{color:NAVY, margin:0}}>PINNACLE ADMIN</h2>
          <p style={{fontSize:'13px', color:'#666'}}>New Admin Page</p>
          <input type="password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&login()} placeholder="Password" style={{width:'100%', padding:'14px', borderRadius:'10px', marginTop:'16px', border:'1px solid #ddd', boxSizing:'border-box'}} />
          <button onClick={login} style={{width:'100%', marginTop:'12px', background:NAVY, color:'#fff', padding:'14px', border:'none', borderRadius:'10px', fontWeight:900, cursor:'pointer'}}>UNLOCK</button>
          <p style={{fontSize:'11px', color:'#999', marginTop:'10px'}}>Password: Rubangakene</p>
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

  const exportCSV = () => {
    if(!filtered.length) return showToast("No rows");
    const head = ["Timestamp","FullName","Phone","Email","Service","Position","District","Message","Type"];
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

  const handleDelete = async (row) => {
    if(!confirm("Delete " + getVal(row,["FullName","fullName"]) + "?")) return;
    const ts = getVal(row,["Timestamp","timestamp"]);
    setData(prev=>prev.filter(r=>r._id!==row._id));
    setSelected(null);
    showToast("Deleted");
    await fetch(WEBHOOK,{method:'POST', mode:'no-cors', headers:{'Content-Type':'text/plain'}, body: JSON.stringify({action:'delete', timestamps:[ts], Timestamp: ts})});
  };

  const waLink = (d) => {
    let p = String(getVal(d,["Phone","phone"])||"").replace(/\s/g,"").replace(/^\+/,"");
    if(p.startsWith("0")) p = "256"+p.slice(1);
    const name = getVal(d,["FullName","fullName"]);
    const text = `Hello ${name}, this is Pinnacle Security Ltd, Muyenga. Thank you for contacting us. We will call you soon. Control 24/7: 0776971970.`;
    return `https://wa.me/${p}?text=${encodeURIComponent(text)}`;
  };

  const btn = (bg) => ({background:bg, color:'#fff', border:'none', padding:'10px 14px', borderRadius:'20px', fontWeight:800, cursor:'pointer', fontSize:'12px'});
  const tabBtn = (active) => ({background: active?NAVY:'#eef2f7', color: active?'#fff':'#000', border:'none', padding:'10px 12px', borderRadius:'20px', fontWeight:800, cursor:'pointer', fontSize:'12px', flex:1});

  return (
    <div style={{background:'#f8fafc', minHeight:'100vh', fontFamily:'Arial', padding:'16px'}}>
      {toast && <div style={{position:'fixed', top:'20px', right:'20px', background:'#000', color:'#fff', padding:'12px 18px', borderRadius:'20px', fontWeight:800, zIndex:999}}>{toast}</div>}
      <div style={{maxWidth:'600px', margin:'0 auto'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <h2 style={{margin:0, color:NAVY}}>Welcome, Admin</h2>
          <button onClick={()=>setAuth(false)} style={{...btn('#64748b')}}>Logout</button>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'10px', marginTop:'14px'}}>
          <div onClick={()=>setTab("contacts")} style={{background:'#fff', padding:'16px', borderRadius:'12px', textAlign:'center', cursor:'pointer', border:'1px solid #eee'}}><div style={{fontSize:'22px', fontWeight:900}}>{contacts.length}</div><div style={{fontSize:'12px', color:'#666'}}>Contacts</div></div>
          <div onClick={()=>setTab("applicants")} style={{background:'#fff', padding:'16px', borderRadius:'12px', textAlign:'center', cursor:'pointer', border:'1px solid #eee'}}><div style={{fontSize:'22px', fontWeight:900, color:'#dc2626'}}>{applicants.length}</div><div style={{fontSize:'12px', color:'#666'}}>Applicants</div></div>
          <div onClick={()=>setTab("all")} style={{background:'#fff', padding:'16px', borderRadius:'12px', textAlign:'center', cursor:'pointer', border:'1px solid #eee'}}><div style={{fontSize:'22px', fontWeight:900, color:'#2563eb'}}>{data.length}</div><div style={{fontSize:'12px', color:'#666'}}>Total</div></div>
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

        <p style={{fontSize:'13px', color:'#666', marginTop:'10px'}}>{loading ? "Loading..." : `${filtered.length} found - Tap a card to view`}</p>

        {filtered.map(d=>(
          <div key={d._id} onClick={()=>setSelected(selected?._id===d._id?null:d)} style={{background:'#fff', borderRadius:'12px', padding:'14px', marginBottom:'10px', border:'1px solid #eee', cursor:'pointer'}}>
            <div style={{display:'flex', justifyContent:'space-between'}}><b>{getVal(d,["FullName","fullName"]) || "No Name"}</b><span style={{fontSize:'11px', background: isApplicant(d)?'#fee2e2':'#dcfce7', padding:'4px 8px', borderRadius:'20px', fontWeight:800}}>{isApplicant(d)?"APPLICANT":"CONTACT"}</span></div>
            <div style={{fontSize:'13px', color:'#333', marginTop:'6px'}}>📞 {getVal(d,["Phone","phone"])} • 📧 {getVal(d,["Email","email"]) || "-"}</div>
            <div style={{fontSize:'13px', color:'#555', marginTop:'4px'}}>{getVal(d,["Service","service"]) || getVal(d,["Position","position"]) || ""} {getVal(d,["District","district"]) ? "• "+getVal(d,["District","district"]) : ""}</div>
            <div style={{fontSize:'12px', color:'#888', marginTop:'4px'}}>{getVal(d,["Timestamp","timestamp"])}</div>
            {getVal(d,["Message","Messages","message","messages"]) && <div style={{fontSize:'13px', background:'#f8fafc', padding:'8px', borderRadius:'8px', marginTop:'8px'}}>{getVal(d,["Message","Messages","message","messages"])}</div>}

            {selected?._id===d._id && (
              <div style={{display:'flex', gap:'6px', flexWrap:'wrap', marginTop:'10px'}} onClick={e=>e.stopPropagation()}>
                <a href={`tel:${getVal(d,["Phone","phone"])}`} style={{...btn('#0A1931'), textDecoration:'none'}}>📞 Call</a>
                <a href={waLink(d)} target="_blank" rel="noreferrer" style={{...btn('#25D366'), textDecoration:'none'}}>💬 WhatsApp</a>
                <a href={`mailto:${getVal(d,["Email","email"])}`} style={{...btn('#0ea5e9'), textDecoration:'none'}}>📧 Email</a>
                <button onClick={()=>handleDelete(d)} style={btn('#dc2626')}>🗑️ Delete</button>
              </div>
            )}
          </div>
        ))}

        {filtered.length===0 && !loading && <p style={{textAlign:'center', color:'#888', marginTop:'30px'}}>No data yet - Ready for new submissions</p>}

        <a href="/" style={{display:'block', textAlign:'center', marginTop:'20px', color:NAVY, fontWeight:800}}>🏠 Back to Home</a>
      </div>
    </div>
  );
}