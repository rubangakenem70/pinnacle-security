import React, { useState, useEffect } from 'react';

const API_URL = "https://pinnacle-security-backend.vercel.app";
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbzk1JBV7dwWVonyh4MblR4n9jeTsptGyICu1tuPh18Y11sBbWJHsMcCd2qOR55vT6nw/exec";

const sendToGoogleSheet = async (payload) => {
  try {
    fetch(GOOGLE_SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) { console.log("Sheet error", err); }
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
    const payload = { type: 'contact', full_name: formData.fullName, fullName: formData.fullName, email: formData.email, phone: formData.phone, phone_number: formData.phone, service: formData.service, message: formData.message };
    try {
      await fetch(`${API_URL}/api/contacts`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      await sendToGoogleSheet(payload);
      alert("Success! Sent to Admin and Google Sheet.");
      setFormData({ fullName: '', email: '', phone: '', service: 'Guard Services', message: '' });
    } catch { alert("Error"); }
  };

  const handleApplicantSubmit = async (e) => {
    e.preventDefault();
    const payload = { type: 'applicant', full_name: applicantData.fullName, fullName: applicantData.fullName, email: applicantData.email, phone: applicantData.phone, phone_number: applicantData.phone, position: applicantData.position, education: applicantData.education, district: applicantData.district, interest: applicantData.interest, experience: applicantData.experience };
    try {
      await fetch(`${API_URL}/api/applicants`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      await sendToGoogleSheet(payload);
      alert("Application sent to Google Sheet!");
      setApplicantData({ fullName: '', email: '', phone: '', position: 'Security Guard', education: '', district: '', interest: '', experience: '' });
    } catch { alert("Error"); }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="flex justify-between items-center p-6 bg-black/90 border-b border-yellow-500/20 sticky top-0 z-50 backdrop-blur">
        <h1 className="text-2xl font-black text-yellow-500 tracking-widest">PINNACLE SECURITY</h1>
        <div className="flex gap-6 text-sm font-semibold">
          <button onClick={()=>setActiveTab('home')} className={`hover:text-yellow-500 ${activeTab==='home'?'text-yellow-500 border-b-2 border-yellow-500':''}`}>Home</button>
          <button onClick={()=>setActiveTab('join')} className={`hover:text-yellow-500 ${activeTab==='join'?'text-yellow-500 border-b-2 border-yellow-500':''}`}>Join Us</button>
          <button onClick={()=>setActiveTab('admin')} className={`hover:text-yellow-500 ${activeTab==='admin'?'text-yellow-500 border-b-2 border-yellow-500':''}`}>Admin</button>
        </div>
      </nav>

      {activeTab==='home' && (
        <>
          <section className="text-center py-24 px-6 bg-gradient-to-b from-black to-[#141414]">
            <h2 className="text-5xl md:text-6xl font-black mb-4">PINNACLE SECURITY</h2>
            <p className="text-2xl text-yellow-500 font-bold">Professional Security Services in Uganda</p>
            <p className="text-gray-400 mt-6 max-w-2xl mx-auto text-lg">We provide highly trained guards, CCTV installation, and 24/7 protection for homes, businesses, and events across Uganda.</p>
            <div className="mt-10 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
              <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10"><h3 className="font-bold text-yellow-500">✓ Trained Guards</h3><p className="text-sm text-gray-400 mt-2">Professional, vetted, and uniformed guards.</p></div>
              <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10"><h3 className="font-bold text-yellow-500">✓ CCTV Systems</h3><p className="text-sm text-gray-400 mt-2">Installation and monitoring.</p></div>
              <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10"><h3 className="font-bold text-yellow-500">✓ 24/7 Support</h3><p className="text-sm text-gray-400 mt-2">We respond anytime, anywhere in Uganda.</p></div>
            </div>
          </section>

          <section className="p-8 max-w-3xl mx-auto">
            <div className="bg-[#141414] p-8 rounded-2xl border border-white/10 shadow-2xl">
              <h3 className="text-2xl font-bold mb-6 text-center">Contact Us</h3>
              <form onSubmit={handleContactSubmit} className="grid gap-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input required placeholder="Full Name" value={formData.fullName} onChange={e=>setFormData({...formData, fullName:e.target.value})} className="p-3 rounded-lg bg-black border border-white/20 focus:border-yellow-500 outline-none"/>
                  <input required type="email" placeholder="Email" value={formData.email} onChange={e=>setFormData({...formData, email:e.target.value})} className="p-3 rounded-lg bg-black border border-white/20 focus:border-yellow-500 outline-none"/>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <input required placeholder="Phone e.g. 0701234567" value={formData.phone} onChange={e=>setFormData({...formData, phone:e.target.value})} className="p-3 rounded-lg bg-black border border-white/20 focus:border-yellow-500 outline-none"/>
                  <select value={formData.service} onChange={e=>setFormData({...formData, service:e.target.value})} className="p-3 rounded-lg bg-black border border-white/20">
                    <option>Guard Services</option><option>CCTV Installation</option><option>Event Security</option><option>Private Investigation</option>
                  </select>
                </div>
                <textarea required placeholder="Your Message" value={formData.message} onChange={e=>setFormData({...formData, message:e.target.value})} className="p-3 rounded-lg bg-black border border-white/20 h-24"></textarea>
                <button type="submit" className="bg-yellow-500 hover:bg-yellow-400 text-black p-3 rounded-lg font-bold text-lg">Send Message</button>
              </form>
            </div>
          </section>
        </>
      )}

      {activeTab==='join' && (
        <div className="p-8 max-w-3xl mx-auto">
          <div className="bg-[#141414] p-8 rounded-2xl border border-white/10">
            <h3 className="text-2xl font-bold mb-6 text-center">Join Our Security Team</h3>
            <form onSubmit={handleApplicantSubmit} className="grid gap-4">
              <input required placeholder="Full Name" value={applicantData.fullName} onChange={e=>setApplicantData({...applicantData, fullName:e.target.value})} className="p-3 rounded-lg bg-black border border-white/20"/>
              <div className="grid md:grid-cols-2 gap-4">
                <input required type="email" placeholder="Email" value={applicantData.email} onChange={e=>setApplicantData({...applicantData, email:e.target.value})} className="p-3 rounded-lg bg-black border border-white/20"/>
                <input required placeholder="Phone" value={applicantData.phone} onChange={e=>setApplicantData({...applicantData, phone:e.target.value})} className="p-3 rounded-lg bg-black border border-white/20"/>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <input placeholder="Education Level" value={applicantData.education} onChange={e=>setApplicantData({...applicantData, education:e.target.value})} className="p-3 rounded-lg bg-black border border-white/20"/>
                <input placeholder="District" value={applicantData.district} onChange={e=>setApplicantData({...applicantData, district:e.target.value})} className="p-3 rounded-lg bg-black border border-white/20"/>
              </div>
              <input placeholder="Why are you interested?" value={applicantData.interest} onChange={e=>setApplicantData({...applicantData, interest:e.target.value})} className="p-3 rounded-lg bg-black border border-white/20"/>
              <textarea placeholder="Experience" value={applicantData.experience} onChange={e=>setApplicantData({...applicantData, experience:e.target.value})} className="p-3 rounded-lg bg-black border border-white/20 h-24"></textarea>
              <button type="submit" className="bg-yellow-500 text-black p-3 rounded-lg font-bold">Submit Application</button>
            </form>
          </div>
        </div>
      )}

      {activeTab==='admin' && (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Contacts</h2>
          <div className="overflow-x-auto bg-[#141414] rounded-xl border border-white/10 p-2">
            <table className="w-full text-sm"><thead><tr className="bg-yellow-500 text-black"><th className="p-2">Name</th><th className="p-2">Email</th><th className="p-2">Phone</th><th className="p-2">Service</th></tr></thead><tbody>{contacts.map((c,i)=><tr key={i} className="border-b border-white/10"><td className="p-2">{c.full_name||c.fullName}</td><td className="p-2">{c.email}</td><td className="p-2">{c.phone||c.phone_number}</td><td className="p-2">{c.service}</td></tr>)}</tbody></table>
          </div>
          <h2 className="text-2xl font-bold my-4">Applicants</h2>
          <div className="overflow-x-auto bg-[#141414] rounded-xl border border-white/10 p-2">
            <table className="w-full text-sm"><thead><tr className="bg-yellow-500 text-black"><th className="p-2">Name</th><th className="p-2">Phone</th><th className="p-2">Position</th></tr></thead><tbody>{applicants.map((a,i)=><tr key={i} className="border-b border-white/10"><td className="p-2">{a.full_name||a.fullName}</td><td className="p-2">{a.phone||a.phone_number}</td><td className="p-2">{a.position}</td></tr>)}</tbody></table>
          </div>
        </div>
      )}
    </div>
  );
}