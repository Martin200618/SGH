"use client";

import Link from "next/link";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div>
      {/* Botón ingresar */}
      <Link
        href="/login"
        className="absolute top-5 right-6 bg-blue-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-blue-600 transition"
      >
        Ingresar
      </Link>

      {/* Componente Hero */}
      <Hero />

      {/* Componente Footer */}
      <Footer />
    </div>
  );
}
