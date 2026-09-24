import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

const API = "https://pinnacle-security-backend.vercel.app";

function Navbar(){
  return(
    <nav style={{background:'#0a1931', padding:'12px', display:'flex', gap:'10px', flexWrap:'wrap', justifyContent:'center'}}>
      <Link to="/" style={{color:'white', textDecoration:'none', fontSize:'12px'}}>Home</Link>
      <Link to="/about" style={{color:'white', textDecoration:'none', fontSize:'12px'}}>About</Link>
      <Link to="/services" style={{color:'white', textDecoration:'none', fontSize:'12px'}}>Services</Link>
      <Link to="/contact" style={{color:'white', textDecoration:'none', fontSize:'12px'}}>Contact</Link>
      <Link to="/join" style={{background:'#ffcc00', color:'#000', padding:'5px 10px', borderRadius:'5px', textDecoration:'none', fontSize:'12px', fontWeight:'800'}}>Apply</Link>
      <Link to="/admin" style={{background:'#ffcc00', color:'#000', padding:'5px 12px', borderRadius:'15px', textDecoration:'none', fontSize:'12px', fontWeight:'900', border:'1px solid white'}}>ADMIN</Link>
    </nav>
  )
}

function Home(){ return <div style={{padding:'30px', textAlign:'center'}}><h1 style={{color:'#0a1931'}}>Pinnacle Security Ltd</h1><p>Plot 442 & 443 Masajjagere - 4.3★ Rated</p><Link to="/join" style={{background:'#ffcc00', padding:'10px 20px', borderRadius:'20px', display:'inline-block', marginTop:'10px', textDecoration:'none', color:'#000', fontWeight:'800'}}>Apply Now</Link></div> }
function About(){ return <div style={{padding:'20px'}}><h2>About Us</h2><p style={{fontSize:'13px'}}>Pinnacle Security Ltd - Plot 442 & 443 Masajjagere, Off Kironde Road Muyenga, P.O.Box 124853 Kampala. 60+ sites, 150+ officers.</p></div> }
function Services(){ return <div style={{padding:'20px'}}><h2>Services</h2><p>Security Guard Service ISIC 8010, Construction, CCTV, Patrol</p></div> }
function Contact(){ return <div style={{padding:'20px'}}><h2>Contact</h2><p>hr@pinnaclegroup.co.ug | 0754 139726</p></div> }
function Join(){ return <div style={{padding:'20px'}}><h2>Apply</h2><p>Form connected to live DB at {API}</p></div> }

function Admin(){
  const [c,setC]=useState([]); const [a,setA]=useState([]);
  useEffect(()=>{ fetch(`${API}/api/contact`).then(r=>r.json()).then(setC); fetch(`${API}/api/applicants`).then(r=>r.json()).then(setA); },[]);
  return(
    <div style={{padding:'10px'}}>
      <h2 style={{textAlign:'center', background:'#0a1931', color:'#ffcc00', padding:'12px', borderRadius:'8px'}}>ADMIN - {c.length} Contacts | {a.length} Applicants</h2>
      <h3>Contacts</h3>
      <div style={{overflow:'auto'}}><table border="1" style={{width:'100%', fontSize:'11px', borderCollapse:'collapse'}}><tr style={{background:'#0a1931', color:'#ffcc00'}}><th>#</th><th>Name</th><th>Email</th><th>Service</th></tr>{c.map((x,i)=><tr key={i}><td>{i+1}</td><td>{x.full_name||x.fullName}</td><td>{x.email}</td><td>{x.service}</td></tr>)}</table></div>
      <h3 style={{marginTop:'20px'}}>Applicants</h3>
      <div style={{overflow:'auto'}}><table border="1" style={{width:'100%', fontSize:'11px', borderCollapse:'collapse'}}><tr style={{background:'#0a1931', color:'#ffcc00'}}><th>#</th><th>Name</th><th>Phone</th><th>Position</th></tr>{a.map((x,i)=><tr key={i}><td>{i+1}</td><td>{x.full_name||x.fullName}</td><td>{x.phone}</td><td>{x.position}</td></tr>)}</table></div>
    </div>
  )
}

export default function App(){
  return(
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/services" element={<Services/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/join" element={<Join/>}/>
        <Route path="/admin" element={<Admin/>}/>
        <Route path="/blog" element={<div style={{padding:'20px'}}><h2>Jobs</h2><p>Recruiting SITE INCHARGE and SUPERVISOR</p></div>}/>
      </Routes>
      <div style={{background:'#0a1931', color:'#aaa', textAlign:'center', padding:'10px', fontSize:'10px', marginTop:'20px'}}>© 2026 Pinnacle Security</div>
    </BrowserRouter>
  )
}