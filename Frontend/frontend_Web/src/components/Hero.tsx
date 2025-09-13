import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }

        .delay-1 {
          animation-delay: 0.3s;
        }
        .delay-2 {
          animation-delay: 0.6s;
        }
        .delay-3 {
          animation-delay: 0.9s;
        }
        .delay-4 {
          animation-delay: 1.2s;
        }
      `}</style>

      <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-white font-sans flex flex-col lg:flex-row items-center justify-between px-6 sm:px-10 lg:px-20 py-10 overflow-hidden">
        
        {/* Logo esquina */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
          <Image
            src="/byte.png"
            alt="Bytestock Logo"
            width={80}
            height={80}
            className="w-20 h-14 sm:w-24 sm:h-16"
          />
        </div>

        {/* Botón ingresar */}
        <Link
          href="/login"
          className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-blue-500 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-full shadow-md hover:bg-blue-600 transition text-sm sm:text-base"
        >
          Ingresar
        </Link>

        {/* Columna izquierda */}
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

          {/* Estadísticas */}
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
        </div>

        {/* Columna derecha */}
        <div className="relative flex items-center justify-center mt-12 lg:mt-0 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg opacity-0 animate-fade-in delay-4">
          <img
            src="/logo.png"
            alt="Logo Colegio ABC"
            className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 drop-shadow-2xl hover:scale-105 transition-transform duration-300"
          />

          {/* Trofeo */}
          <img
            src="/trophy.png"
            alt="Trophy"
            className="absolute -top-10 -left-10 w-20 sm:w-24 lg:w-32 animate-bounce-slow"
          />

          {/* Cohete */}
          <img
            src="/rocket.png"
            alt="Rocket"
            className="absolute -top-8 right-0 w-20 sm:w-24 lg:w-32 animate-fly-up"
          />

          {/* Círculos decorativos */}
          <img
            src="/object1.png"
            alt="Blue Circle"
            className="absolute top-20 -left-10 w-12 sm:w-16 lg:w-20 animate-bounce"
          />
          <img
            src="/object2.png"
            alt="Orange Circle"
            className="absolute bottom-6 -left-8 w-12 sm:w-16 lg:w-20 animate-pulse"
          />
          <img
            src="/object3.png"
            alt="Yellow Circle"
            className="absolute top-24 -right-10 w-12 sm:w-16 lg:w-20 animate-float"
          />
          <img
            src="/object4.png"
            alt="Purple Circle"
            className="absolute bottom-4 right-4 w-12 sm:w-16 lg:w-20 animate-bounce"
          />
        </div>
      </div>
    </>
  );
}
