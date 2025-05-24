import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import '../index.css';

const ConfirmReserva = ({ 
  tallerNombre,
  tallerId,
  onCancel,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleVerificar = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('https://microservicios-reservas-660835726359.us-central1.run.app/verificar-reserva', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: user?.email,
          id_taller: tallerId,
        }),
      });

      const result = await response.json();

      if (result.reserva_duplicada) {
        setError(result.mensaje || 'Ya tienes una reserva activa para este taller.');
      } else {
        // Si NO hay reserva duplicada, redirige a la página para crear la reserva / confirmar pago
        navigate(`/pago/${tallerId}`);
      }
    } catch (err) {
      setError('Error al verificar la reserva. Intenta nuevamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="confirm-reserva-container">
        <h3>Confirmar Reservación</h3>
        <p>¿Estás seguro que deseas reservar el taller <strong>{tallerNombre}</strong>?</p>
        
        {error && <p className="error-text">{error}</p>}

        <div className="confirm-reserva-botones">
          <button 
            onClick={handleVerificar}
            className="btn btn-confirmar"
            disabled={isProcessing}
          >
            {isProcessing ? 'Verificando...' : 'Confirmar'}
          </button>
          <button 
            onClick={onCancel} 
            className="btn btn-cancelar"
            disabled={isProcessing}
          >
            Regresar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmReserva;
