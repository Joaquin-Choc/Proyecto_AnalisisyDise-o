// src/pages/Talleres.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

const Talleres = () => {
  const [talleres, setTalleres] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTalleres = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Reemplaza las URLs locales por:
        const url = filtroCategoria === 'Todas'
          ? 'https://microservicio-talleres-660835726359.northamerica-northeast2.run.app/talleres'
          : `https://microservicio-talleres-660835726359.northamerica-northeast2.run.app.app/talleres?categoria=${encodeURIComponent(filtroCategoria)}`;

        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        setTalleres(data);
      } catch (error) {
        console.error('Error al obtener los talleres:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTalleres();
  }, [filtroCategoria]);

  // Componente Skeleton para carga
  const TallerSkeleton = () => (
    <div className="taller-card skeleton">
      <div className="skeleton-title"></div>
      <div className="skeleton-line"></div>
      <div className="skeleton-line"></div>
      <div className="skeleton-line"></div>
      <div className="skeleton-line"></div>
      <div className="skeleton-button"></div>
    </div>
  );

  if (error) {
    return (
      <div className="talleres-container">
        <h1 className="titulo-pagina">Talleres Disponibles</h1>
        <div className="error-message">
          <p>Ocurrió un error al cargar los talleres: {error}</p>
          <button onClick={() => window.location.reload()} className="btn btn-pagar">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="talleres-container">
      <h1 className="titulo-pagina">Talleres Disponibles</h1>

      {/* Selector de categorías */}
      <div className="filtros-container">
        <label htmlFor="categoria-filtro">Filtrar por categoría:</label>
        <select
          id="categoria-filtro"
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          className="filtro-select"
          disabled={isLoading}
        >
          <option value="Todas">Todas las categorías</option>
          <option value="Cocina Internacional">Cocina Internacional</option>
          <option value="Repostería Creativa">Repostería Creativa</option>
          <option value="Alimentación Saludable">Alimentación Saludable</option>
        </select>
      </div>

      {/* Listado de talleres */}
      <div className="talleres-grid">
        {isLoading ? (
          // Mostrar skeletons mientras carga
          [...Array(4)].map((_, index) => <TallerSkeleton key={index} />)
        ) : talleres.length > 0 ? (
          talleres.map((taller) => (
            <div key={taller.id} className="taller-card">
              <h2>{taller.nombre}</h2>
              <p><strong>Categoría:</strong> {taller.categoria}</p>
              <p><strong>Fecha:</strong> {taller.fecha}</p>
              <p><strong>Precio:</strong> Q{taller.precio.toFixed(2)}</p>
              <p><strong>Cupo:</strong> {taller.cupo_disponible ? 'Disponible' : 'Lleno'}</p>
             <Link to={`/taller/${taller.id}`} className="btn btn-pagar">Ver Detalle</Link>
            </div>
          ))
        ) : (
          <div className="sin-talleres">
            <p>No hay talleres disponibles en la categoría seleccionada.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Talleres;