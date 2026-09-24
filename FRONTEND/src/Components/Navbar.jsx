import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
  const loc = useLocation();
  const active = (p) => loc.pathname === p ? "active" : "";
  return (
    <nav className="navbar">
      <Link to="/" className="logo">PINNACLE SECURITY LTD<br/><span>4.3 ★ (11 Reviews)</span></Link>
      <ul>
        <li><Link className={active("/")} to="/">Home</Link></li>
        <li><Link className={active("/about")} to="/about">About</Link></li>
        <li><Link className={active("/services")} to="/services">Services</Link></li>
        <li><Link className={active("/operations")} to="/operations">Operations</Link></li>
        <li><Link className={active("/contact")} to="/contact">Contact</Link></li>
        <li><Link className="btn-nav" to="/join">Apply Now</Link></li>
      </ul>
    </nav>
  )
}
export default Navbar