import React, { useState, useEffect } from 'react';
import { X, User } from 'lucide-react';
import { getUserProfile } from '@/api/services/userApi';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNameChange?: (name: string) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const [profileData, setProfileData] = useState({
    name: ''
  });

  useEffect(() => {
    if (isOpen) {
      const loadProfile = async () => {
        try {
          const data = await getUserProfile();
          setProfileData({ name: data.name });
        } catch (error) {
          console.error("Error loading profile:", error);
        }
      };
      loadProfile();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
      
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl w-80 transform transition-all animate-slide-in border border-gray-200">
          {/* Header del Modal */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Mi Perfil
                </h2>
                <p className="text-xs text-gray-500">Información personal</p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Contenido del Modal */}
          <div className="p-4 space-y-4">
            {/* Avatar */}
            <div className="flex flex-col items-center space-y-2">
              <img
                src="/logo.png"
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover ring-3 ring-blue-100"
              />
            </div>

            {/* Campos del formulario */}
            <div className="space-y-3">
              {/* Nombre */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{profileData.name}</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </>
  );
};

export default ProfileModal;