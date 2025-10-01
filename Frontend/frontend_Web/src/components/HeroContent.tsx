import React from "react";

/**
 * Componente que renderiza el contenido textual principal del Hero
 *
 * Incluye el título principal, la lista de características y la información de contacto.
 * Implementa animaciones de fade-in con delays progresivos.
 *
 * @returns {JSX.Element} El contenido textual del Hero
 */
const HeroContent: React.FC = React.memo(() => {
  return (
    <div className="max-w-xl space-y-6 text-center lg:text-left z-10 mt-20 lg:mt-0">
      {/* Título */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-snug sm:leading-tight text-gray-800 opacity-0 animate-fade-in delay-1">
        Aprende en el{" "}
        <span className="underline decoration-yellow-400 decoration-4">
          Colegio ABC
        </span>
        , <br className="hidden sm:block" />
        cada día, a cada hora.
      </h1>

      {/* Lista */}
      <ul className="space-y-3 text-gray-600 text-base sm:text-lg opacity-0 animate-fade-in delay-2">
        <li className="flex items-center justify-center lg:justify-start gap-2 sm:gap-3">
          <span className="text-xl sm:text-2xl">🌈</span>
          <span>Proyecto Cero Harvard y psicología positiva</span>
        </li>
        <li className="flex items-center justify-center lg:justify-start gap-2 sm:gap-3">
          <span className="text-xl sm:text-2xl">🌸</span>
          <span>45 años floreciendo en familia</span>
        </li>
        <li className="flex items-center justify-center lg:justify-start gap-2 sm:gap-3">
          <span className="text-xl sm:text-2xl">📍</span>
          <span>Cll 24 # 3-52, Los Samanes</span>
        </li>
        <li className="flex items-center justify-center lg:justify-start gap-2 sm:gap-3">
          <span className="text-xl sm:text-2xl">📞</span>
          <span>3158769862</span>
        </li>
      </ul>
    </div>
  );
});

export default HeroContent;