import React from 'react';
import { NavLink, Link } from 'react-router-dom';

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand-logo">
          <span className="brand-badge">EP</span>
          <span className="brand-text">EventPulse</span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Home
          </NavLink>
          <NavLink to="/events" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Explore Events
          </NavLink>
          <NavLink to="/my-events" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            My Events
          </NavLink>
        </nav>

        <div className="nav-actions">
          <Link to="/login" className="btn btn-outline">
            Log In
          </Link>
          <Link to="/register" className="btn btn-primary">
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
