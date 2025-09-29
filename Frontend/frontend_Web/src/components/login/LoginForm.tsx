"use client";
import { useState } from "react";
import { Eye, EyeOff, User, Lock } from "lucide-react";

interface LoginFormProps {
  onBack?: () => void;
  onSubmit?: (data: { user: string; password: string; acceptTerms: boolean }) => void;
  authError?: string;
  successMessage?: string;
}

export default function LoginForm({ onBack, onSubmit, authError, successMessage }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userError, setUserError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Limpiar errores previos
    setUserError("");
    setPasswordError("");

    let hasError = false;

    if (!user.trim()) {
      setUserError('El nombre de usuario es obligatorio');
      hasError = true;
    } else if (user.length > 50) {
      setUserError('El nombre de usuario no puede exceder los 50 caracteres');
      hasError = true;
    } else if (!/^[a-z]*$/.test(user)) {
      setUserError('El nombre de usuario solo puede contener letras minúsculas');
      hasError = true;
    }

    if (!password) {
      setPasswordError('La contraseña es obligatoria');
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres');
      hasError = true;
    } else if (password.length > 100) {
      setPasswordError('La contraseña no puede exceder los 100 caracteres');
      hasError = true;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setPasswordError('La contraseña debe contener al menos una letra minúscula, una mayúscula y un número');
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);

    setTimeout(() => {
      if (onSubmit) {
        onSubmit({ user, password, acceptTerms: true });
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1)), url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3Cpattern id="grain" patternUnits="userSpaceOnUse" width="100" height="100"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)" opacity="0.1"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width="100%25" height="100%25" fill="url(%23grain)"/%3E%3C/svg%3E")',
      }}
    >

      {/* Contenedor del formulario */}
      <div className="bg-gray-900/85 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md p-6 sm:p-8 md:p-12 text-white">
        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">
          <img
            src="/logo.png"
            alt="Logo"
            className="mx-auto mb-4 w-20 h-20 sm:w-24 sm:h-24 object-contain"
          />
          <h1 className="text-xl sm:text-2xl font-semibold text-white mb-2">
            Inicio de sesión
          </h1>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Usuario */}
          <div className="relative">
            <User
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Usuario"
              value={user}
              onChange={(e) => {
                setUser(e.target.value);
                if (userError) setUserError(""); // Limpiar error al escribir
              }}
              className={`w-full pl-12 pr-4 py-2.5 sm:py-3 rounded-lg bg-gray-800/70 border text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                (userError || authError) ? 'border-red-500 focus:ring-red-500' : 'border-gray-600/50 focus:ring-blue-500'
              }`}
            />
          </div>
          {(userError || authError) && (
            <p className="text-red-400 text-sm mt-1">{userError || authError}</p>
          )}

          {/* Contraseña */}
          <div className="relative">
            <Lock
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError(""); // Limpiar error al escribir
              }}
              className={`w-full pl-12 pr-12 py-2.5 sm:py-3 rounded-lg bg-gray-800/70 border text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                (passwordError || authError) ? 'border-red-500 focus:ring-red-500' : 'border-gray-600/50 focus:ring-blue-500'
              }`}
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {passwordError && (
            <p className="text-red-400 text-sm mt-1">{passwordError}</p>
          )}

          {/* Botón Ingresar */}
          <button
            type="submit"
            disabled={isLoading || !user || !password}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2.5 sm:py-3 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-[1.01] disabled:scale-100 shadow-lg text-sm sm:text-base"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Ingresando...
              </div>
            ) : (
              "Ingresar"
            )}
          </button>
        </form>

        {successMessage && (
          <p className="text-green-400 text-sm mt-4 text-center">{successMessage}</p>
        )}
      </div>

      {/* Footer */}
      <div className="absolute bottom-3 sm:bottom-4 text-gray-400 text-xs sm:text-sm text-center w-full">
        Derechos reservados ©Bytestock
      </div>
    </div>
  );
}
