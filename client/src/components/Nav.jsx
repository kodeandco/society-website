import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Nav.css'

const NAV_LINKS = [
  { name: 'Home', to: '/' },
  { name: 'Manage', to: '/Manage' },
  { name: 'About', to: '/about' },
  { name: 'Amenities', to: '/amenities' },
  { name: 'Gallery', to: '/gallery' },
  { name: 'Tenders', to: '/tenders' },
  { name: 'Contact', to: '/contact' },
];

function Nav() {
  const [open, setOpen] = useState(false);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (open && !event.target.closest('.navbar')) {
        setOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [open]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  // Close menu on window resize (when switching from mobile to desktop)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && open) {
        setOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [open]);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <NavLink to="/" onClick={() => setOpen(false)}>
          Kendriya Vihar Phase - 2
        </NavLink>
      </div>
      
      <div 
        className={`navbar-hamburger${open ? ' open' : ''}`}
        onClick={() => setOpen(!open)}
        aria-label="Toggle navigation menu"
        aria-expanded={open}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`navbar-overlay${open ? ' open' : ''}`} onClick={() => setOpen(false)}></div>

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