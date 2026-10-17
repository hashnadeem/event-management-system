import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../features/auth/authSlice';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useSelector((state) => state.auth);
  const userKey = currentUser?.email || currentUser?.id || null;
  const regCount = useSelector((state) =>
    userKey ? (state.registrations.byUser[userKey] || []).length : 0
  );

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  const userInitials = currentUser?.name
    ? currentUser.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U';

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
            {isAuthenticated && regCount > 0 && <span className="nav-count-badge">{regCount}</span>}
          </NavLink>
        </nav>

        <div className="nav-actions">
          {isAuthenticated && currentUser ? (
            <div className="user-session-bar">
              <div className="user-chip" title={currentUser.email}>
                <span className="user-avatar">{userInitials}</span>
                <span className="user-name">{currentUser.name}</span>
              </div>
              <button type="button" onClick={handleLogout} className="btn btn-outline btn-sm">
                Log Out
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
