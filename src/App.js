import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; 
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TallerDetalle from './pages/TallerDetalle';
import Pago from './pages/Pago';
import videoFondo from './Pinterest.mp4';
import Talleres from './pages/Talleres';
import Reservas from './pages/Reservas';

function App() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Mostrar video SOLO en estas rutas
  const mostrarVideoFondo = ['/login', '/register', '/'].includes(location.pathname);

  return (
    <>
      {/* Video de fondo (solo en login/register/inicio) */}
      {mostrarVideoFondo && (
        <div className="video-background">
          <video autoPlay loop muted playsInline>
            <source src={videoFondo} type="video/mp4" />
          </video>
        </div>
      )}

      {/* Fondo estático para otras páginas */}
      {!mostrarVideoFondo && (
        <div className="static-background"></div>
      )}

      <div className="content-wrapper">
        <div className="App">
          {/* Mostrar navbar solo en páginas autenticadas */}
          {isAuthenticated && <Navbar />}
          
          <div className="container">
            <Routes>
              <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
              <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/workshops" element={isAuthenticated ? <Talleres /> : <Navigate to="/login" />} />
              <Route path="/taller/:id" element={isAuthenticated ? <TallerDetalle /> : <Navigate to="/login" />} />
              <Route path="/pago/:id" element={isAuthenticated ? <Pago /> : <Navigate to="/login" />} />
              <Route path="/my-bookings" element={isAuthenticated ? <Reservas /> : <Navigate to="/login" />} />
              <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;