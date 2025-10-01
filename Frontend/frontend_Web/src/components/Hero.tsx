import React from "react";
import Link from "next/link";
import Image from "next/image";
import HeroContent from "./HeroContent";
import HeroStats from "./HeroStats";
import HeroDecorations from "./HeroDecorations";

/**
 * Componente principal del Hero section de la landing page
 *
 * Renderiza la sección principal con contenido, estadísticas y decoraciones animadas.
 * Está compuesto por subcomponentes especializados para mantener la separación de responsabilidades.
 *
 * @returns {JSX.Element} El componente Hero renderizado
 *
 * @example
 * ```tsx
 * <Hero />
 * ```
 */
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
          <HeroContent />
          <HeroStats />
        </div>

        {/* Columna derecha */}
        <HeroDecorations />
      </div>
    </>
  );
}
