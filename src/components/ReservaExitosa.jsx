// src/components/ReservaExitosa.jsx
import { useNavigate } from 'react-router-dom';
import '../index.css';

const ReservaExitosa = ({ tallerNombre }) => {
  const navigate = useNavigate();

  return (
    <div className="reserva-exitosa">
      <h2>¡Reserva Confirmada!</h2>
      <p>Has reservado exitosamente el taller: <strong>{tallerNombre}</strong></p>
      <div className="botones-container">
        <button 
          onClick={() => navigate('/mis-reservas')} 
          className="btn btn-primary"
        >
          Ver Mis Reservas
        </button>
      </div>
    </div>
  );
};

export default ReservaExitosa;