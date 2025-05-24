import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../index.css';

const Pago = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pagoCompletado, setPagoCompletado] = useState(false);
  const [taller, setTaller] = useState(null);
  const [error, setError] = useState(null);
  const [reservaId, setReservaId] = useState(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [datosTarjeta, setDatosTarjeta] = useState({
    numero: '',
    vencimiento: '',
    cvv: '',
    direccion: ''
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatosTarjeta(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      datosTarjeta.numero.length !== 16 || 
      datosTarjeta.cvv.length !== 3 || 
      !datosTarjeta.vencimiento ||
      !datosTarjeta.direccion
    ) {
      setError('Por favor complete todos los campos correctamente');
      return;
    }

    try {
      // Simular pago
      const pagoResponse = await fetch(`https://microservicio-pagos-660835726359.northamerica-northeast2.run.app/api/pago/MOCK`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          id_taller: id,
          numero: datosTarjeta.numero,
          vencimiento: datosTarjeta.vencimiento,
          cvv: datosTarjeta.cvv,
          direccion: datosTarjeta.direccion
        })
      });

      const pagoData = await pagoResponse.json();
      if (!pagoResponse.ok) {
        throw new Error(pagoData.mensaje || 'Error al simular el pago');
      }

      // Crear reserva
      const user = JSON.parse(localStorage.getItem('user'));
      const correo = user?.email;

      const reservaResponse = await fetch('https://microservicios-reservas-660835726359.us-central1.run.app/reservar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ correo, id_taller: id })
      });

      const reservaData = await reservaResponse.json();
      if (!reservaResponse.ok) {
        throw new Error(reservaData.error || 'Error al crear la reserva');
      }

      setReservaId(reservaData.id_reserva);
      setMostrarConfirmacion(true);
      setPagoCompletado(true);

    } catch (err) {
      setError(err.message || 'Error en el proceso de pago o reserva');
    }
  };

  if (error) {
    return (
      <div className="error-container">
        <h2>Error en el proceso</h2>
        <p>{error}</p>
        <button onClick={() => navigate(-1)} className="btn-volver">
          Volver atrás
        </button>
      </div>
    );
  }

  if (!taller) {
    return <div className="loading">Cargando...</div>;
  }

  if (pagoCompletado) {
    return (
      <div className="resumen-pago">
        <h2>¡Pago Completado!</h2>
        <div className="resumen-detalle">
          <h3>Resumen de la transacción</h3>
          <p><strong>Taller:</strong> {taller.nombre}</p>
          <p><strong>Fecha:</strong> {new Date(taller.fecha_inicio).toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
          <p><strong>Monto:</strong> Q{taller.precio}</p>
          <p><strong>Dirección de cobro:</strong> {datosTarjeta.direccion}</p>
          <p><strong>N° de Tarjeta:</strong> **** **** **** {datosTarjeta.numero.slice(-4)}</p>
          <p><strong>ID de Reserva:</strong> {reservaId}</p>
          <p><strong>Fecha de transacción:</strong> {new Date().toLocaleDateString()}</p>
        </div>
        <button onClick={() => navigate('/workshops')} className="btn btn-confirmar">
          Explorar más talleres
        </button>
      </div>
    );
  }

  return (
    <div className="pago-container">
      <h2>Confirmación de Pago</h2>
      
      <div className="info-taller">
        <h3>{taller.nombre}</h3>
        <p><strong>Fecha:</strong> {taller.fecha_inicio}</p>
        <p><strong>Total a pagar:</strong> Q{taller.precio.toFixed(2)}</p>
      </div>

      <form onSubmit={handleSubmit} className="formulario-pago">
        <h3>Información de pago</h3>
        
        <div className="form-group">
          <label>Dirección de cobro</label>
          <input
            type="text"
            name="direccion"
            value={datosTarjeta.direccion}
            onChange={handleChange}
            placeholder="Calle, número, ciudad, código postal"
            required
          />
        </div>

        <div className="form-group">
          <label>Número de tarjeta</label>
          <input
            type="text"
            name="numero"
            value={datosTarjeta.numero}
            onChange={handleChange}
            placeholder="1234 5678 9012 3456"
            maxLength="16"
            required
          />
        </div>

        <div className="form-group">
          <label>Fecha de vencimiento (MM/AA)</label>
          <input
            type="text"
            name="vencimiento"
            value={datosTarjeta.vencimiento}
            onChange={handleChange}
            placeholder="MM/AA"
            maxLength="5"
            required
          />
        </div>

        <div className="form-group">
          <label>CVV</label>
          <input
            type="text"
            name="cvv"
            value={datosTarjeta.cvv}
            onChange={handleChange}
            placeholder="123"
            maxLength="3"
            required
          />
        </div>

        <div className="botones-pago">
          <button 
            type="button" 
            onClick={() => navigate(-1)}
            className="btn btn-cancelar"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn btn-confirmar"
          >
            Confirmar Pago
          </button>
        </div>
      </form>
    </div>
  );
};

export default Pago;
