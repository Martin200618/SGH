import React from "react";

/**
 * Componente que renderiza las estadísticas destacadas del Hero
 *
 * Muestra métricas clave del colegio con animaciones y diseño responsivo.
 * Cada estadística incluye un número, descripción y colores temáticos.
 *
 * @returns {JSX.Element} Las estadísticas del Hero
 */
const HeroStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 opacity-0 animate-fade-in delay-3">
      {[
        {
          num: "80+",
          text: "Niños creciendo felices",
          color: "text-yellow-500",
          bg: "bg-yellow-50",
        },
        {
          num: "20+",
          text: "Actividades creativas al año",
          color: "text-blue-500",
          bg: "bg-blue-50",
        },
        {
          num: "10+",
          text: "Profesores que enseñan con amor",
          color: "text-orange-500",
          bg: "bg-orange-50",
        },
      ].map((stat, i) => (
        <div
          key={i}
          className={`${stat.bg} p-4 rounded-xl hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg text-center`}
        >
          <h2 className={`text-2xl sm:text-3xl font-bold ${stat.color}`}>
            {stat.num}
          </h2>
          <p className="text-gray-700 text-sm sm:text-base">{stat.text}</p>
        </div>
      ))}
    </div>
  );
};

export default HeroStats;