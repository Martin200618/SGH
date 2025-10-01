import React, { useState, useEffect } from 'react';

const Footer: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isModalOpen) {
      const timer = setTimeout(() => setSelectedImage(null), 300);
      return () => clearTimeout(timer);
    }
  }, [isModalOpen]);
  return (
    <footer className="bg-gradient-to-br from-blue-800 to-blue-900 text-white py-8">
      <div className="container mx-auto px-4">
        {/* Sección de desarrolladores */}
        <div className="flex justify-center space-x-8 mb-8">
          <div className="text-center">
            <img
              src="/Martin.jpg"
              alt="Desarrollador 1"
              className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => { setSelectedImage('/Martin.jpg'); setIsModalOpen(true); }}
            />
            <p className="font-semibold">Martin Stiben Narvaez</p>
            <p>dev1@email.com</p>
          </div>
          <div className="text-center">
            <img
              src="/Racinger.jpg"
              alt="Desarrollador 2"
              className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => { setSelectedImage('/Racinger.jpg'); setIsModalOpen(true); }}
            />
            <p className="font-semibold">Racinger Prada Olaya</p>
            <p>rprada82@soy.sena.co</p>
          </div>
          <div className="text-center">
            <img
              src="/Juan.jpg"
              alt="Desarrollador 3"
              className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => { setSelectedImage('/Juan.jpg'); setIsModalOpen(true); }}
            />
            <p className="font-semibold">Juan Pablo Saavedra</p>
            <p>dev3@email.com</p>
          </div>
                    <div className="text-center">
            <img
              src="/gonzo.jpg"
              alt="Desarrollador 4"
              className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => { setSelectedImage('/gonzo.jpg'); setIsModalOpen(true); }}
            />
            <p className="font-semibold">Juan Sebastian Gonzales</p>
            <p>dev3@email.com</p>
          </div>
        </div>

        {/* Botón para instalar APK */}
        <div className="text-center">
          <a
            href="/apk/SGH.apk"
            download
            className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-600 transition"
          >
            Instalar APK
          </a>
        </div>
      </div>

      {/* Modal para imagen completa */}
      {selectedImage && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300 ${
            isModalOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsModalOpen(false)}
        >
          <img
            src={selectedImage}
            alt="Imagen completa"
            className={`max-w-full max-h-full transition-transform duration-300 ${
              isModalOpen ? 'scale-100' : 'scale-90'
            }`}
          />
        </div>
      )}
    </footer>
  );
};

export default Footer;