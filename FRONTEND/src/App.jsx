import React, { useState, useEffect } from 'react';

const API_URL = "https://pinnacle-security-backend.vercel.app";
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbzk1JBV7dwWVonyh4MblR4n9jeTsptGyICu1tuPh18Y11sBbWJHsMcCd2qOR55vT6nw/exec";

// Helper to send to Google Sheet
const sendToGoogleSheet = async (payload) => {
  try {
    fetch(GOOGLE_SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.log("Sheet error", err);
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [contacts, setContacts] = useState([]);
  const [applicants, setApplicants] = useState([]);

  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', service: 'Guard Services', message: '' });
  const [applicantData, setApplicantData] = useState({ fullName: '', email: '', phone: '', position: 'Security Guard', education: '', district: '', interest: '', experience: '' });

  useEffect(() => {
    if (activeTab === 'admin') {
      fetch(`${API_URL}/api/contacts`).then(r=>r.json()).then(setContacts).catch(()=>{});
      fetch(`${API_URL}/api/applicants`).then(r=>r.json()).then(setApplicants).catch(()=>{});
    }
  }, [activeTab]);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      type: 'contact',
      full_name: formData.fullName,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      phone_number: formData.phone,
      service: formData.service,
      message: formData.message
    };
    try {
      await fetch(`${API_URL}/api/contacts`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      await sendToGoogleSheet(payload);
      alert("Success! Details sent to Admin and Google Sheet.");
      setFormData({ fullName: '', email: '', phone: '', service: 'Guard Services', message: '' });
    } catch { alert("Error sending"); }
  };

  const handleApplicantSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      type: 'applicant',
      full_name: applicantData.fullName,
      fullName: applicantData.fullName,
      email: applicantData.email,
      phone: applicantData.phone,
      phone_number: applicantData.phone,
      position: applicantData.position,
      education: applicantData.education,
      district: applicantData.district,
      interest: applicantData.interest,
      experience: applicantData.experience
    };
    try {
      await fetch(`${API_URL}/api/applicants`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      await sendToGoogleSheet(payload);
      alert("Application sent! It is now in Google Sheet.");
      setApplicantData({ fullName: '', email: '', phone: '', position: 'Security Guard', education: '', district: '', interest: '', experience: '' });
    } catch { alert("Error sending"); }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      {/* NAVBAR */}
      <nav className="flex justify-between items-center p-5 bg-black border-b border-yellow-600/20 sticky top-0 z-50">
        <h1 className="text-xl font-bold text-yellow-500">PINNACLE SECURITY</h1>
        <div className="flex gap-4 text-sm">
          <button onClick={()=>setActiveTab('home')} className={activeTab==='home'?'text-yellow-500':''}>Home</button>
          <button onClick={()=>setActiveTab('join')} className={activeTab==='join'?'text-yellow-500':''}>Join Us</button>
          <button onClick={()=>setActiveTab('admin')} className={activeTab==='admin'?'text-yellow-500':''}>Admin</button>
        </div>
      </nav>

      {activeTab==='home' && (
        <div className="p-8 max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold mt-10">Professional Security Services in Uganda</h2>
          <p className="text-gray-400 mt-4">We provide guards, CCTV, and protection for homes and businesses.</p>

          <div className="mt-12 bg-[#141414] p-6 rounded-xl border border-white/10">
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <form onSubmit={handleContactSubmit} className="grid gap-3">
              <input required placeholder="Full Name" value={formData.fullName} onChange={e=>setFormData({...formData, fullName:e.target.value})} className="p-3 rounded bg-black border border-white/20"/>
              <input required type="email" placeholder="Email" value={formData.email} onChange={e=>setFormData({...formData, email:e.target.value})} className="p-3 rounded bg-black border border-white/20"/>
              <input required placeholder="Phone e.g. 0701234567" value={formData.phone} onChange={e=>setFormData({...formData, phone:e.target.value})} className="p-3 rounded bg-black border border-white/20"/>
              <select value={formData.service} onChange={e=>setFormData({...formData, service:e.target.value})} className="p-3 rounded bg-black border border-white/20">
                <option>Guard Services</option><option>CCTV</option><option>Event Security</option>
              </select>
              <textarea required placeholder="Message" value={formData.message} onChange={e=>setFormData({...formData, message:e.target.value})} className="p-3 rounded bg-black border border-white/20"></textarea>
              <button type="submit" className="bg-yellow-500 text-black p-3 rounded font-bold">Send Message</button>
            </form>
          </div>
        </div>
      )}

      {activeTab==='join' && (
        <div className="p-8 max-w-5xl mx-auto">
          <div className="bg-[#141414] p-6 rounded-xl border border-white/10">
            <h3 className="text-xl font-bold mb-4">Apply for Job</h3>
            <form onSubmit={handleApplicantSubmit} className="grid gap-3">
              <input required placeholder="Full Name" value={applicantData.fullName} onChange={e=>setApplicantData({...applicantData, fullName:e.target.value})} className="p-3 rounded bg-black border border-white/20"/>
              <input required type="email" placeholder="Email" value={applicantData.email} onChange={e=>setApplicantData({...applicantData, email:e.target.value})} className="p-3 rounded bg-black border border-white/20"/>
              <input required placeholder="Phone" value={applicantData.phone} onChange={e=>setApplicantData({...applicantData, phone:e.target.value})} className="p-3 rounded bg-black border border-white/20"/>
              <input placeholder="Education" value={applicantData.education} onChange={e=>setApplicantData({...applicantData, education:e.target.value})} className="p-3 rounded bg-black border border-white/20"/>
              <input placeholder="District" value={applicantData.district} onChange={e=>setApplicantData({...applicantData, district:e.target.value})} className="p-3 rounded bg-black border border-white/20"/>
              <input placeholder="Interest" value={applicantData.interest} onChange={e=>setApplicantData({...applicantData, interest:e.target.value})} className="p-3 rounded bg-black border border-white/20"/>
              <textarea placeholder="Experience" value={applicantData.experience} onChange={e=>setApplicantData({...applicantData, experience:e.target.value})} className="p-3 rounded bg-black border border-white/20"></textarea>
              <button type="submit" className="bg-yellow-500 text-black p-3 rounded font-bold">Submit Application</button>
            </form>
          </div>
        </div>
      )}

      {activeTab==='admin' && (
        <div className="p-4 overflow-x-auto">
          <h2 className="text-2xl font-bold mb-4">Admin - Contacts</h2>
          <table className="w-full text-sm border border-white/10">
            <thead><tr className="bg-yellow-500 text-black"><th className="p-2">Name</th><th className="p-2">Email</th><th className="p-2">Phone</th><th className="p-2">Service</th></tr></thead>
            <tbody>{contacts.map((c,i)=><tr key={i} className="border-b border-white/10"><td className="p-2">{c.full_name||c.fullName}</td><td className="p-2">{c.email}</td><td className="p-2">{c.phone||c.phone_number}</td><td className="p-2">{c.service}</td></tr>)}</tbody>
          </table>
          <h2 className="text-2xl font-bold my-4">Applicants</h2>
          <table className="w-full text-sm border border-white/10">
            <thead><tr className="bg-yellow-500 text-black"><th className="p-2">Name</th><th className="p-2">Phone</th><th className="p-2">Position</th></tr></thead>
            <tbody>{applicants.map((a,i)=><tr key={i} className="border-b border-white/10"><td className="p-2">{a.full_name||a.fullName}</td><td className="p-2">{a.phone||a.phone_number}</td><td className="p-2">{a.position}</td></tr>)}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}