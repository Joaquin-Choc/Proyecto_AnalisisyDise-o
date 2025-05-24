import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LogoMastercook from '../LogoMastercook.png';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="header-container">
      <div className="logo-wrapper" style={{ backgroundColor: '#D94F4F' }}>
        <div className="logo-container">
          <img 
            src={LogoMastercook} 
            alt="MasterCook Academy" 
            className="navbar-logo"
          />
          <span className="logo-text">MasterCook Academy</span>
        </div>
      </div>
      
      <nav className="navbar">
        <div className="navbar-nav">
          {isAuthenticated ? (
            <>
              <Link className="nav-link" to="/">Inicio</Link>
              <Link className="nav-link" to="/workshops">Explorar Talleres</Link>
              <Link className="nav-link" to="/my-bookings">Mis Reservas</Link>
              <button 
                className="nav-link btn btn-link" 
                onClick={logout}
              >
                Cerrar Sesión
              </button>
            </>
          ) : null}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;