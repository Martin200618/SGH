import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Props para el componente LogoutModal
 */
interface LogoutModalProps {
  /** Indica si el modal está abierto */
  isOpen: boolean;
  /** Función para cerrar el modal */
  onClose: () => void;
  /** Función para confirmar el logout */
  onConfirm: () => void;
  /** Indica si está en proceso de logout */
  isLoggingOut: boolean;
}

/**
 * Modal de confirmación para cerrar sesión
 *
 * Muestra un diálogo de confirmación antes de cerrar la sesión del usuario.
 * Incluye estados de carga durante el proceso de logout.
 *
 * @param props - Las propiedades del componente
 * @returns {JSX.Element | null} El modal o null si no está abierto
 *
 * @example
 * ```tsx
 * <LogoutModal
 *   isOpen={showModal}
 *   onClose={() => setShowModal(false)}
 *   onConfirm={handleLogout}
 *   isLoggingOut={isLoggingOut}
 * />
 * ```
 */
const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoggingOut
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-96 mx-4">
        {!isLoggingOut ? (
          <>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Cerrar Sesión
            </h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que quieres cerrar la sesión?
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors"
              >
                Aceptar
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center py-6">
            <Loader2 className="animate-spin text-red-500 mb-3" size={32} />
            <p className="text-gray-700 font-medium">Cerrando sesión...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogoutModal;