import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { isLoggedIn, logout } from '../services/auth-service';

const CustomNavbar = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(isLoggedIn());
  const location = useLocation();
  const navigate = useNavigate();
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    setAuthenticated(isLoggedIn());
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    closeMenu();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-md navbar-dark app-navbar">
      <div className="container-fluid">
        <Link className="navbar-brand brand-mark" to="/" onClick={closeMenu}>MyBlogs</Link>
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="main-navigation"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
          onClick={() => setIsOpen((currentValue) => !currentValue)}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div
          id="main-navigation"
          className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}
        >
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" onClick={closeMenu}>Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/services" onClick={closeMenu}>Capabilities</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about" onClick={closeMenu}>About</NavLink>
            </li>
          </ul>
          <ul className="navbar-nav">
            {authenticated ? (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/dashboard" onClick={closeMenu}>Dashboard</NavLink>
                </li>
                <li className="nav-item">
                  <button className="nav-link nav-button" type="button" onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login" onClick={closeMenu}>Login</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link nav-cta" to="/signup" onClick={closeMenu}>Create account</NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
};

export default CustomNavbar;
