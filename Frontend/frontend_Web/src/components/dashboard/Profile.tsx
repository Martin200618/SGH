"use client";

import { Pencil } from "lucide-react";
import { useState } from "react";
import ProfileModal from "@/components/dashboard/ProfileModal"; // Importa el modal

export default function ProfileCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="relative w-48 h-50 bg-white mt-5 rounded-xl shadow p-3 text-center">
        {/* Encabezado */}
        <div className="flex justify-between items-start">
          <h2 className="text-sm font-medium text-gray-700">Perfil</h2>
          <button 
            onClick={() => setIsModalOpen(true)} // Abre el modal
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <Pencil size={16} className="text-gray-500" />
          </button>
        </div>

        {/* Imagen de perfil con borde circular */}
        <div className="mt-2 flex flex-col items-center">
          <div className="relative w-20 h-20 rounded-full border-4 border-cyan-400 flex items-center justify-center overflow-hidden">
            <img
              src="https://i.pravatar.cc/150?img=12"
              alt="Perfil"
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          {/* Nombre y rol */}
          <h3 className="mt-3 font-semibold text-gray-800 flex items-center gap-1">
            Diego Lebron
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          </h3>
          <p className="text-xs text-gray-500">Administrador</p>
        </div>
      </div>

      {/* Modal */}
      <ProfileModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}