import React, { useState } from 'react';
import { X, Edit3, Save, User, Mail, FileText, Calendar, Eye } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Diego Lebron',
    email: 'yourname@example.com',
    documentNumber: '1077861502',
    documentType: 'C.C',
    role: 'Administrador'
  });

  const [editData, setEditData] = useState({...profileData});

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({...profileData});
  };

  const handleSave = () => {
    setProfileData({...editData});
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({...profileData});
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleClose = () => {
    setIsEditing(false);
    onClose();
  };

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
                  {isEditing ? 'Editar Perfil' : 'Mi Perfil'}
                </h2>
                <p className="text-xs text-gray-500">Información personal</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Editar perfil"
                >
                  <Edit3 className="w-4 h-4 text-gray-600" />
                </button>
              ) : (
                <div className="flex space-x-1">
                  <button
                    onClick={handleSave}
                    className="p-2 hover:bg-green-100 text-green-600 rounded-lg transition-colors"
                    title="Guardar cambios"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="p-2 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors"
                    title="Cancelar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              <button
                onClick={handleClose}
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
                src="https://i.pravatar.cc/150?img=12" 
                alt="Profile" 
                className="w-16 h-16 rounded-full object-cover ring-3 ring-blue-100"
              />
              {isEditing && (
                <button className="text-blue-600 hover:text-blue-700 text-xs font-medium">
                  Cambiar foto
                </button>
              )}
            </div>

            {/* Campos del formulario */}
            <div className="space-y-3">
              {/* Nombre */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Tu nombre completo"
                  />
                ) : (
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{profileData.name}</span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="tu@ejemplo.com"
                  />
                ) : (
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{profileData.email}</span>
                  </div>
                )}
              </div>

              {/* Número de documento */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Número de documento
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.documentNumber}
                    onChange={(e) => handleInputChange('documentNumber', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Número de documento"
                  />
                ) : (
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{profileData.documentNumber}</span>
                  </div>
                )}
              </div>

              {/* Tipo de documento */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Tipo de documento
                </label>
                {isEditing ? (
                  <select
                    value={editData.documentType}
                    onChange={(e) => handleInputChange('documentType', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="C.C">Cédula de Ciudadanía</option>
                    <option value="T.I">Tarjeta de Identidad</option>
                    <option value="C.E">Cédula de Extranjería</option>
                    <option value="P.P">Pasaporte</option>
                  </select>
                ) : (
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{profileData.documentType}</span>
                  </div>
                )}
              </div>

              {/* Rol (solo lectura) */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Rol
                </label>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-900 font-medium">{profileData.role}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Opciones adicionales */}
            {!isEditing && (
              <div className="space-y-1 pt-3 border-t border-gray-200">
                <button className="w-full flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg transition-colors text-left">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div className="flex-1">
                    <span className="text-sm text-gray-900 font-medium">Mis Horarios</span>
                    <p className="text-xs text-gray-500">Consultar</p>
                  </div>
                  <span className="text-gray-400 text-sm">›</span>
                </button>
                
                <button className="w-full flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg transition-colors text-left">
                  <Eye className="w-4 h-4 text-gray-400" />
                  <div className="flex-1">
                    <span className="text-sm text-gray-900 font-medium">Historial de horarios</span>
                    <p className="text-xs text-gray-500">Ver</p>
                  </div>
                  <span className="text-gray-400 text-sm">›</span>
                </button>
              </div>
            )}
          </div>

          {/* Footer del Modal */}
          {isEditing && (
            <div className="px-4 py-3 bg-gray-50 rounded-b-2xl flex space-x-2">
              <button
                onClick={handleCancel}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Guardar
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfileModal;