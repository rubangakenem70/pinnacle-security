import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <>
      <section className="hero">
        <div className="badge-top">⭐ 4.3 Rated (11 reviews) - Kampala</div>
        <h1>Pinnacle Security Limited</h1>
        <p>Located at 442/443 Kironde Rd, Kampala, Uganda<br/>Security Guard Service | Construction | ISIC 8010</p>
        <div className="hero-btns">
          <a href="tel:0754139726" className="btn-hero">📞 Call 0754 139726</a>
          <Link to="/join" className="btn-hero-outline">Join Our Team</Link>
        </div>
        <p style={{marginTop:'15px', fontSize:'13px', color:'#ffcc00'}}>🕒 Hours: 8:00 AM – 4:00 PM | Open until 4:00 PM</p>
      </section>
      <section className="stats-bar">
        <div><h2>4.3★</h2><p>11 Reviews</p></div>
        <div><h2>8010</h2><p>ISIC Certified</p></div>
        <div><h2>442/443</h2><p>Kironde Rd</p></div>
        <div><h2>24/7</h2><p>Guard Service</p></div>
      </section>
    </>
  )
}
export default Home