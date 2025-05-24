import React from 'react';
import '../index.css';

const DetalleReservaModal = ({ reserva, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Detalles de la Reserva</h2>
        
        <div className="detalle-reserva">
          <p><strong>ID de reserva:</strong> {reserva.id}</p>
          <p><strong>Taller:</strong> {reserva.nombre}</p>
          <p><strong>Descripción:</strong> {reserva.descripcion}</p>
          <p><strong>Fecha de inicio:</strong> {reserva.fecha_inicio}</p>
          <p><strong>Fecha de finalización:</strong> {reserva.fecha_final}</p>
          <p><strong>Categoría:</strong> {reserva.categoria}</p>
          <p><strong>Precio:</strong> Q{reserva.precio.toFixed(2)}</p>
          <p><strong>Estado de pago:</strong> {reserva.estadoPago}</p>
          <p><strong>Fecha de reserva:</strong> {reserva.fecha_reserva}</p>
        </div>

        <button 
          onClick={onClose}
          className="btn btn-regresar"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default DetalleReservaModal;