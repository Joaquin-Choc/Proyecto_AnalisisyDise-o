import React from 'react';
import WorkshopCard from './WorkshopCard';
import './index.css';

const WorkshopList = () => {
  const workshops = [
    {
      title: "Taller de Pasta Italiana",
      description: "Aprende a hacer pasta italiana auténtica desde cero.",
      date: "15 de junio, 2025"
    },
    {
      title: "Cocina Mexicana Tradicional",
      description: "Aprende a preparar auténticos tacos al pastor, mole poblano y guacamole con técnicas ancestrales.",
      date: "10 de julio, 2025"
    },
    {
      title: "Creación de Chocolate Artesanal",
      description: "Desde el tostado de granos de cacao hasta la creación de barras y trufas premium.",
      date: "5 de agosto, 2025"
    }
  ];

  return (
    <div className="workshop-list">
      {workshops.map((workshop, index) => (
        <WorkshopCard 
          key={index}
          title={workshop.title}
          description={workshop.description}
          date={workshop.date}
        />
      ))}
    </div>
  );
};

export default WorkshopList;