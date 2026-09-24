import React from 'react'

const Contact = () => {
  return (
    <section className="section">
      <h2>Contact Pinnacle Security Limited</h2>
      <p className="center">Pinnacle Security Limited is located in Kampala, Central Region, Uganda. Business is working in Security Guard Service industry.</p>
      
      <div className="contact-grid">
        <div className="contact-info">
          <div className="info-card"><h3>🕒 Hours</h3><p>Open until 4:00 PM<br/><b>8:00 AM – 4:00 PM</b></p></div>
          <div className="info-card"><h3>📞 Phone</h3><p><a href="tel:0754139726">0754 139726</a></p></div>
          <div className="info-card"><h3>📧 Email</h3><p><a href="mailto:info@pinnaclegroup.co.ug">info@pinnaclegroup.co.ug</a></p></div>
          <div className="info-card"><h3>🌐 Website</h3><p><a href="https://pinnaclegroup.co.ug" target="_blank" rel="noreferrer">pinnaclegroup.co.ug</a></p></div>
          <div className="info-card"><h3>📍 Address</h3><p>442/443 Kironde Rd, Kampala, Uganda<br/>Kampala, Central Region, Uganda<br/>Also: 256 Bukasa Rd, K...</p></div>
          <div className="info-card"><h3>♿ Accessibility</h3><p>Wheelchair Accessible Parking: Yes</p></div>
          <div className="info-card"><h3>🏷️ Categories</h3><p>Security Guard Service, Construction<br/>ISIC Codes: 8010, F</p></div>
        </div>

        <form className="reg-form" onSubmit={(e)=>{e.preventDefault(); alert("Message sent to info@pinnaclegroup.co.ug")}}>
          <h3>Send Us a Message</h3>
          <input placeholder="Your Name *" required/>
          <input placeholder="Your Phone *" required/>
          <input placeholder="Your Email" type="email"/>
          <select><option>Security Guard Service</option><option>Construction</option><option>Both Services</option></select>
          <textarea placeholder="How can we help you? *" required></textarea>
          <button type="submit">Send Message</button>
        </form>
      </div>
    </section>
  )
}
export default Contact