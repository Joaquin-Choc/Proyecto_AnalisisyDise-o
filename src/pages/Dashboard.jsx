import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="dashboard-container">
      <div className="welcome-content">
        <h1 className="welcome-title">Bienvenido, {user?.name || user?.email || 'Usuario'}</h1>
        <p className="welcome-message">Aquí podrás ver y gestionar tus talleres inscritos.</p>
      </div>
    </div>
  );
};

export default Dashboard;