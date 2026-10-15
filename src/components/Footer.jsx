import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="brand-logo">
            <span className="brand-badge">EP</span>
            <span className="brand-text">EventPulse</span>
          </div>
          <p className="footer-desc">
            Discover live concerts, sports, theatre, and cultural events powered by the Ticketmaster Discovery API.
          </p>
        </div>

        <div className="footer-links-group">
          <h4>Navigation</h4>
          <Link to="/">Home</Link>
          <Link to="/events">Explore Events</Link>
          <Link to="/my-events">My Events</Link>
        </div>

        <div className="footer-links-group">
          <h4>Account</h4>
          <Link to="/login">Log In</Link>
          <Link to="/register">Create Account</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>&copy; {new Date().getFullYear()} EventPulse. Data provided by Ticketmaster Discovery API v2.</span>
      </div>
    </footer>
  );
}

export default Footer;
