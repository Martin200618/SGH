import React from "react";
import Link from "next/link";
import Image from "next/image";
// Importar imágenes desde assets (descomenta estas líneas si tienes las imágenes en src/assets)
// import trophyImg from "../assets/images/trophy.png";
// import rocketImg from "../assets/images/rocket.png";
// import object1Img from "../assets/images/object1.png";
// import object2Img from "../assets/images/object2.png";
// import object3Img from "../assets/images/object3.png";
// import object4Img from "../assets/images/object4.png";

export default function Hero() {
  // Opción 1: Usar imágenes desde carpeta public (recomendado)
  const logoImg = "/logo.png";
  const trophyImg = "/trophy.png"; 
  const rocketImg = "/rocket.png";
  const object1Img = "/object1.png";
  const object2Img = "/object2.png";
  const object3Img = "/object3.png";
  const object4Img = "/object4.png";


  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>

      <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-white font-sans flex flex-col lg:flex-row items-center justify-between px-6 lg:px-20 py-10 overflow-hidden">
        {/* Botón ingresar */}
                <div className="absolute top-5 left-6">
          <Image
            src="/byte.png"
            alt="Bytestock Logo"
            width={100}
            height={100}
            className="w-30 h-20"
          />
        </div>
<Link
  href="/login"
  className="absolute top-5 right-6 bg-blue-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-blue-600 transition"
>
  Ingresar
</Link>


        {/* Columna izquierda */}
        <div className="max-w-xl space-y-6 text-center lg:text-left z-10">
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight animate-fade-in text-gray-800">
            Aprende en el{" "}
            <span className="underline decoration-yellow-400 decoration-4">Colegio ABC</span>,{" "}
            <br />
            cada día, a cada hora.
          </h1>

          <ul className="space-y-3 text-gray-600 text-lg">
            <li className="flex items-center justify-center lg:justify-start gap-3">
              <span className="text-2xl">🌈</span> 
              <span>Proyecto Cero Harvard y psicología positiva</span>
            </li>
            <li className="flex items-center justify-center lg:justify-start gap-3">
              <span className="text-2xl">🌸</span> 
              <span>45 años floreciendo en familia</span>
            </li>
            <li className="flex items-center justify-center lg:justify-start gap-3">
              <span className="text-2xl">📍</span> 
              <span>Cll 24 # 3-52, Los Samanes</span>
            </li>
            <li className="flex items-center justify-center lg:justify-start gap-3">
              <span className="text-2xl">📞</span> 
              <span>3158769862</span>
            </li>
          </ul>

          {/* Estadísticas */}
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-8 mt-10">
            {[
              { num: "80+", text: "Niños creciendo felices", color: "text-yellow-500", bg: "bg-yellow-50" },
              { num: "20+", text: "Actividades creativas al año", color: "text-blue-500", bg: "bg-blue-50" },
              { num: "10+", text: "Profesores que enseñan con amor", color: "text-orange-500", bg: "bg-orange-50" },
            ].map((stat, i) => (
              <div key={i} className={`${stat.bg} p-4 rounded-xl hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg`}>
                <h2 className={`text-3xl font-bold ${stat.color}`}>{stat.num}</h2>
                <p className="text-gray-700 text-sm">{stat.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Columna derecha - Área del logo con elementos flotantes */}
        <div className="relative flex items-center justify-center mt-12 lg:mt-0 w-full max-w-md lg:max-w-lg">
          
          {/* Logo central del Colegio ABC */}
          <div className="relative z-10">
            <img
              src="./logo.png"
              alt="Logo Colegio ABC"
              className="w-48 h-48 lg:w-56 lg:h-56 drop-shadow-2xl hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                // Fallback SVG si no encuentra la imagen
                const fallbackSvg = `data:image/svg+xml;base64,${btoa(`
                  <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="100" cy="100" r="95" fill="url(#grad)" stroke="#fff" stroke-width="6"/>
                    <defs>
                      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#EF4444;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#3B82F6;stop-opacity:1" />
                      </linearGradient>
                    </defs>
                    <text x="100" y="90" text-anchor="middle" fill="white" font-size="36" font-weight="bold" font-family="Arial">ABC</text>
                    <circle cx="100" cy="130" r="25" fill="none" stroke="white" stroke-width="3"/>
                    <line x1="80" y1="130" x2="120" y2="130" stroke="white" stroke-width="2"/>
                    <line x1="100" y1="110" x2="100" y2="150" stroke="white" stroke-width="2"/>
                    <text x="100" y="170" text-anchor="middle" fill="white" font-size="12" font-weight="bold" font-family="Arial">Neiva</text>
                  </svg>
                `)}`;
                (e.target as HTMLImageElement).src = fallbackSvg;
              }}
            />
          </div>

          {/* Trofeo - Arriba izquierda */}
          <div className="absolute -top-20 -left-16 animate-float" style={{animationDelay: '0s'}}>
            <img
              src="./trophy.png"
              alt="Trophy"
              className="w-40 h-40 lg:w-40 lg:h-40 drop-shadow-lg hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                const fallbackSvg = `data:image/svg+xml;base64,${btoa(`
                  <svg width="80" height="96" viewBox="0 0 80 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <ellipse cx="40" cy="32" rx="32" ry="32" fill="url(#trophyGrad)"/>
                    <rect x="28" y="64" width="24" height="12" fill="#EAB308"/>
                    <rect x="20" y="76" width="40" height="20" rx="4" fill="#374151"/>
                    <defs>
                      <linearGradient id="trophyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#FCD34D;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#F59E0B;stop-opacity:1" />
                      </linearGradient>
                    </defs>
                  </svg>
                `)}`;
                (e.target as HTMLImageElement).src = fallbackSvg;
              }}
            />
          </div>

          {/* Cohete - Arriba derecha */}
          <div className="absolute -top-12 right-2 animate-float" style={{animationDelay: '1s'}}>
            <img
              src="./rocket.png"
              alt="Rocket"
              className="w-40 h-40 lg:w-50 lg:h-50 drop-shadow-lg hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                const fallbackSvg = `data:image/svg+xml;base64,${btoa(`
                  <svg width="48" height="64" viewBox="0 0 48 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <ellipse cx="24" cy="24" rx="16" ry="24" fill="#3B82F6"/>
                    <rect x="18" y="48" width="12" height="6" fill="#60A5FA"/>
                    <ellipse cx="24" cy="58" rx="8" ry="6" fill="#FB923C"/>
                  </svg>
                `)}`;
                (e.target as HTMLImageElement).src = fallbackSvg;
              }}
            />
          </div>

          {/* Objeto 1 - Círculo azul (Izquierda centro) */}
          <div className="absolute top-24 -left-20 animate-bounce" style={{animationDelay: '0.5s'}}>
            <img
              src="./object1.png"
              alt="Blue Circle"
              className="w-50 h-50 lg:w-18 lg:h-18 drop-shadow-lg hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).outerHTML = '<div class="w-16 h-16 bg-blue-400 rounded-full shadow-lg"></div>';
              }}
            />
          </div>

          {/* Objeto 2 - Círculo naranja (Abajo izquierda) */}
          <div className="absolute bottom-8 -left-12 animate-pulse" style={{animationDelay: '2s'}}>
            <img
              src="./object2.png"
              alt="Orange Circle"
              className="w-50 h-50 lg:w-16 lg:h-16 drop-shadow-lg hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).outerHTML = '<div class="w-14 h-14 bg-orange-400 rounded-full shadow-lg"></div>';
              }}
            />
          </div>

          {/* Objeto 3 - Círculo amarillo (Derecha centro) */}
          <div className="absolute top-32 -right-18 animate-float" style={{animationDelay: '1.5s'}}>
            <img
              src="./object3.png"
              alt="Yellow Circle"
              className="w-2  0 h-20 lg:w-18 lg:h-18 drop-shadow-lg hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).outerHTML = '<div class="w-16 h-16 bg-yellow-400 rounded-full shadow-lg"></div>';
              }}
            />
          </div>

          {/* Objeto 4 - Círculo púrpura (Abajo derecha) */}
          <div className="absolute bottom-4 right-4 animate-bounce" style={{animationDelay: '2.5s'}}>
            <img
              src="./object4.png"
              alt="Purple Circle"
              className="w-16 h-16 lg:w-18 lg:h-18 drop-shadow-lg hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).outerHTML = '<div class="w-16 h-16 bg-purple-500 rounded-full shadow-lg"></div>';
              }}
            />
          </div>

          {/* Elementos decorativos adicionales con formas geométricas simples */}
          <div className="absolute -top-4 left-20 animate-ping opacity-60">
            <div className="w-4 h-4 bg-gradient-to-r from-pink-400 to-red-400 rounded-full shadow-md"></div>
          </div>
          
          <div className="absolute top-64 left-12 animate-pulse opacity-50" style={{animationDelay: '3s'}}>
            <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full shadow-md"></div>
          </div>

          <div className="absolute bottom-32 right-20 animate-float opacity-40" style={{animationDelay: '4s'}}>
            <div className="w-5 h-5 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full shadow-md"></div>
          </div>

        </div>
      </div>
    </>
  );
}