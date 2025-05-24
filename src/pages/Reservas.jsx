import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../index.css';
import DetalleReservaModal from '../components/DetalleReservaModal';

const Reservas = () => {
  const [reservas, setReservas] = useState([]);
  const [filter, setFilter] = useState('todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null); // 👈 para el modal

  // Simulamos la obtención de reservas del usuario
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const userData = JSON.parse(localStorage.getItem('user'));
        const email = userData?.email;
        if (!email) {
          throw new Error("No se encontró el correo del usuario.");
        }

        const response = await fetch(`https://microservicios-reservas-660835726359.us-central1.run.app/api/reservas/email/${email}`);
        if (!response.ok) {
          throw new Error(`Error al obtener reservas: ${response.status}`);
        }

        const data = await response.json();
        setReservas(data);
      } catch (error) {
        console.error('Error al obtener reservas:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredReservas = reservas.filter(reserva => {
    const filterMatch =
      filter === 'todas' ||
      (filter === 'activas' && reserva.estadoReserva === 'Confirmada') ||
      (filter === 'pasadas' && reserva.estadoReserva === 'Completada') ||
      (filter === 'canceladas' && reserva.estadoReserva === 'Cancelada');

    const searchMatch = reserva.nombre.toLowerCase().includes(searchTerm.toLowerCase());

    return filterMatch && searchMatch;
  });

  // Componente Skeleton para carga
  const ReservaSkeleton = () => (
    <div className="taller-card skeleton">
      <div className="skeleton-title"></div>
      <div className="skeleton-line"></div>
      <div className="skeleton-line"></div>
      <div className="skeleton-line"></div>
      <div className="skeleton-line"></div>
    </div>
  );

  if (error) {
    return (
      <div className="talleres-container">
        <h1 className="titulo-pagina">Mis Reservas</h1>
        <div className="error-message">
          <p>Ocurrió un error al cargar las reservas: {error}</p>
          <button onClick={() => window.location.reload()} className="btn btn-pagar">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="talleres-container">
      <h1 className="titulo-pagina">Mis Reservas</h1>
      
      {/* Filtros y búsqueda */}
      <div className="filtros-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar por nombre de taller..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filtro-select"
          />
          <i className="fas fa-search"></i>
        </div>
        
        <div className="filter-buttons">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filtro-select"
            disabled={isLoading}
          >
            <option value="todas">Todas las reservas</option>
            <option value="activas">Activas</option>
            <option value="pasadas">Pasadas</option>
            <option value="canceladas">Canceladas</option>
          </select>
        </div>
      </div>
      
      {/* Listado de reservas */}
      <div className="talleres-grid">
        {isLoading ? (
          [...Array(3)].map((_, index) => <ReservaSkeleton key={index} />)
        ) : filteredReservas.length === 0 ? (
          <div className="sin-talleres">
            <p>No tienes reservas {filter === 'todas' ? '' : ` ${filter}`}.</p>
            <Link to="/talleres" className="btn btn-pagar">Explorar talleres</Link>
          </div>
        ) : (
          filteredReservas.map(reserva => (
            <div 
              key={reserva.id} 
              className="taller-card reserva-card"
              onClick={() => setReservaSeleccionada(reserva)} // 👈 abre modal
            >
              <h2>{reserva.nombre}</h2>
              <p><strong>Categoría:</strong> {reserva.categoria}</p>
              <p><strong>Fecha:</strong> {reserva.fecha} a las {reserva.hora}</p>

              <div className="reserva-status">
                <span className={`status-badge ${reserva.estadoPago.toLowerCase()}`}>
                  {reserva.estadoPago}
                </span>
                <span className={`status-badge ${reserva.estadoReserva.toLowerCase()}`}>
                  {reserva.estadoReserva}
                </span>
              </div>

              <p><strong>Precio:</strong> Q{reserva.precio.toFixed(2)}</p>
              <button 
                className="btn btn-pagar"
                onClick={(e) => {
                  e.stopPropagation(); // evitar que se active el click del contenedor
                  setReservaSeleccionada(reserva);
                }}
              >
                Ver detalles
              </button>
            </div>
          ))
        )}
      </div>

      {/* Modal de detalles */}
      {reservaSeleccionada && (
        <DetalleReservaModal
          reserva={reservaSeleccionada}
          onClose={() => setReservaSeleccionada(null)}
        />
      )}
    </div>
  );
};

export default Reservas;