import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import './Nav.css'

const NAV_LINKS = [
  { name: 'Home', to: '/' },
  { name: 'About', to: '/about' },
  { name: 'Amenities', to: '/amenities' },
  { name: 'Gallery', to: '/gallery' },
  { name: 'Tenders', to: '/tenders' },
  { name: 'Contact', to: '/contact' },
];

function Nav() {
  const [open, setOpen] = useState(false);
  
  return (
    <nav className="navbar">
      <div className="navbar-logo">Kendriya Vihar Phase - 2</div>
      <div 
        className={`navbar-hamburger${open ? ' open' : ''}`} 
        onClick={() => setOpen(!open)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
      <ul className={`navbar-links${open ? ' open' : ''}`}>
        {NAV_LINKS.map(link => (
          <li key={link.name}>
            <NavLink
              to={link.to}
              className={({ isActive }) => isActive ? 'active' : ''}
              onClick={() => setOpen(false)}
              end={link.to === '/'}
            >
              {link.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Nav;