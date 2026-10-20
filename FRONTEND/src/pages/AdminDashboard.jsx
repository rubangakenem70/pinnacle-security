import { useState, useEffect } from 'react'
const SHEET_URL = "https://script.google.com/macros/s/AKfycbz0Fx9gSfPwPXZdi8pivw9IdQ_fzj707fPk22GBECuGYhGzwePtEPZV47TyXk8TN8bggQ/exec";

export default function AdminDashboard(){
  const [auth,setAuth]=useState(false); const [pass,setPass]=useState(""); const [data,setData]=useState([]); const [search,setSearch]=useState(""); const [tab,setTab]=useState("all"); const [loading,setLoading]=useState(false);
  const login=()=>pass==="Pinnacle2026!Secure123"?setAuth(true):alert("Wrong Password!");
  const load=()=>{ setLoading(true); fetch(SHEET_URL).then(r=>r.json()).then(d=>{setData(d.reverse()); setLoading(false);}).catch(()=>setLoading(false)) };
  useEffect(()=>{if(auth)load()},[auth]);
  
  if(!auth) return <div style={{minHeight:'100vh',background:'#0a1931',display:'flex',justifyContent:'center',alignItems:'center'}}><div style={{background:'#fff',padding:'30px',borderRadius:'16px',width:'90%',maxWidth:'380px',textAlign:'center'}}><h2 style={{fontWeight:'900',color:'#0a1931'}}>🛡️ PINNACLE ADMIN</h2><input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Admin Password" style={{width:'100%',padding:'14px',borderRadius:'10px',marginTop:'15px',border:'2px solid #0a1931'}}/><button onClick={login} style={{width:'100%',marginTop:'12px',background:'#ffcc00',padding:'14px',borderRadius:'10px',fontWeight:'900',border:'none',cursor:'pointer'}}>LOGIN</button></div></div>

  const applicants = data.filter(d=>d.type==='applicant');
  const contacts = data.filter(d=>d.type==='contact');
  const filtered = data.filter(d=>{ const mTab = tab==='all'||d.type===tab; const mSearch = (d.fullName+d.phone+d.email+d.position+d.service).toLowerCase().includes(search.toLowerCase()); return mTab && mSearch });

  return(
    <div style={{background:'#f4f6f9',minHeight:'100vh',fontFamily:'Arial',padding:'20px'}}>
      <div style={{maxWidth:'1300px',margin:'auto'}}>
        <div style={{display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:'12px',alignItems:'center'}}>
          <h1 style={{fontWeight:'900',color:'#0a1931'}}>Pinnacle Records - {data.length}</h1>
          <div style={{display:'flex',gap:'8px'}}><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search name, phone, service..." style={{padding:'10px 16px',borderRadius:'20px',border:'1px solid #ddd',width:'260px'}}/><button onClick={load} style={{background:'#0a1931',color:'#ffcc00',padding:'10px 18px',borderRadius:'20px',fontWeight:'800',border:'none',cursor:'pointer'}}>{loading?'Loading...':'🔄 Refresh'}</button></div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:'12px',margin:'20px 0'}}>
          <div onClick={()=>setTab('all')} style={{background:tab==='all'?'#0a1931':'#fff',color:tab==='all'?'#ffcc00':'#0a1931',padding:'16px',borderRadius:'12px',cursor:'pointer',borderLeft:'5px solid #0a1931'}}><p style={{fontSize:'12px'}}>TOTAL</p><h2 style={{fontWeight:'900',fontSize:'26px'}}>{data.length}</h2></div>
          <div onClick={()=>setTab('applicant')} style={{background:tab==='applicant'?'#ffcc00':'#fff',padding:'16px',borderRadius:'12px',cursor:'pointer',borderLeft:'5px solid #ffcc00'}}><p style={{fontSize:'12px'}}>APPLICANTS</p><h2 style={{fontWeight:'900',fontSize:'26px'}}>{applicants.length}</h2></div>
          <div onClick={()=>setTab('contact')} style={{background:tab==='contact'?'#0a1931':'#fff',color:tab==='contact'?'#ffcc00':'#0a1931',padding:'16px',borderRadius:'12px',cursor:'pointer',borderLeft:'5px solid #0a1931'}}><p style={{fontSize:'12px'}}>CONTACTS</p><h2 style={{fontWeight:'900',fontSize:'26px'}}>{contacts.length}</h2></div>
        </div>

        <div style={{background:'#fff',borderRadius:'16px',overflow:'hidden',boxShadow:'0 4px 12px rgba(0,0,0,0.06)'}}>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:'13px',minWidth:'1100px'}}>
              <thead><tr style={{background:'#0a1931',color:'#ffcc00',textAlign:'left'}}><th style={{padding:'14px'}}>Date</th><th>Name</th><th>Phone</th><th>Email</th><th>Type</th><th>Applicant Details</th><th>Contact Details</th></tr></thead>
              <tbody>
                {filtered.map((d,i)=><tr key={i} style={{borderBottom:'1px solid #eee'}}><td style={{padding:'12px',fontSize:'11px'}}>{new Date(d.timestamp).toLocaleDateString()}<br/>{new Date(d.timestamp).toLocaleTimeString()}</td><td style={{padding:'12px',fontWeight:'800'}}>{d.fullName}</td><td style={{padding:'12px'}}>{d.phone}</td><td style={{padding:'12px',fontSize:'11px'}}>{d.email}</td><td style={{padding:'12px'}}><span style={{background:d.type==='applicant'?'#ffcc00':'#0a1931',color:d.type==='applicant'?'#0a1931':'#fff',padding:'4px 10px',borderRadius:'12px',fontSize:'11px',fontWeight:'800'}}>{d.type}</span></td><td style={{padding:'12px',fontSize:'12px',color:'#333'}}>{d.type==='applicant' ? `${d.position} | ${d.education} | ${d.district} | Exp:${d.experience} | Why:${d.interest}` : '-'}</td><td style={{padding:'12px',fontSize:'12px',color:'#333'}}>{d.type==='contact' ? `${d.service} | ${d.message}` : '-'}</td></tr>)}
              </tbody>
            </table>
          </div>
          {filtered.length===0 && <div style={{padding:'40px',textAlign:'center',color:'#888'}}>No data. Submit a form on homepage then click Refresh.</div>}
        </div>
        <a href="/" style={{display:'inline-block',marginTop:'20px',background:'#0a1931',color:'#ffcc00',padding:'10px 18px',borderRadius:'20px',textDecoration:'none',fontWeight:'800'}}>← Back to Website</a>
      </div>
    </div>
  )
}