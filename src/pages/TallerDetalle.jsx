// src/pages/TallerDetalle.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ConfirmReserva from '../components/ConfirmReserva';
import ReservaExitosa from '../components/ReservaExitosa';
import '../index.css';

const TallerDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [taller, setTaller] = useState(null);
  const [error, setError] = useState(null);
  const [showConfirmacion, setShowConfirmacion] = useState(false);
  const [isReserving, setIsReserving] = useState(false);
  const [reservaExitosa, setReservaExitosa] = useState(false);

  useEffect(() => {
    const fetchTaller = async () => {
      try {
        const response = await fetch(`https://microservicio-talleres-660835726359.northamerica-northeast2.run.app/talleres/${id}`);
        if (!response.ok) {
          throw new Error('Taller no encontrado');
        }
        const data = await response.json();
        setTaller(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTaller();
  }, [id]);

  const handleReservar = async () => {
    setIsReserving(true);
    try {
      const response = await fetch(
        'https://microservicio-talleres-660835726359.northamerica-northeast2.run.app/reservas',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            taller_id: id,
            fecha_reserva: new Date().toISOString()
          })
        }
      );

      if (!response.ok) throw new Error('Error al reservar');
      
      setReservaExitosa(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsReserving(false);
      setShowConfirmacion(false);
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!taller) {
    return <div className="loading">Cargando...</div>;
  }

  if (reservaExitosa) {
    return <ReservaExitosa tallerNombre={taller.nombre} />;
  }

  return (
    <div className="taller-detalle-container">
      <div className="taller-card">
        <h1>{taller.nombre}</h1>
        <p><strong>Descripción:</strong> {taller.descripcion}</p>
        <p><strong>Fecha de inicio:</strong> {taller.fecha_inicio}</p>
        <p><strong>Fecha de finalización:</strong> {taller.fecha_final}</p>
        <p><strong>Capacidad:</strong> {taller.capacidad}</p>
        <p><strong>Cupo disponible:</strong> {taller.cupo_disponible ? 'Sí' : 'No'}</p>
        <p><strong>Categoría:</strong> {taller.categoria}</p>
        <p><strong>Precio:</strong> Q{taller.precio}</p>

        <div className="taller-botones">
          <button onClick={() => navigate(-1)} className="btn btn-regresar">
            Regresar
          </button>
          <button 
            onClick={() => setShowConfirmacion(true)} 
            className="btn btn-reservar"
            disabled={!taller.cupo_disponible}
          >
            {taller.cupo_disponible ? 'Reservar' : 'Cupo Agotado'}
          </button>
        </div>

        {showConfirmacion && (
          <ConfirmReserva
            tallerNombre={taller.nombre}
            tallerId={taller.id}
            onCancel={() => setShowConfirmacion(false)}
            isProcessing={isReserving}
          />
        )}
      </div>
    </div>
  );
};

export default TallerDetalle;