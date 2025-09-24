"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "@/components/login/LoginForm";
import { login } from "@/api/services/userApi";
import { Link } from "lucide-react";
import Cookies from 'js-cookie';

export default function LoginPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");


      
  interface LoginFormValues {
    user: string;
    password: string;
    acceptTerms: boolean;
  }

  const handleLogin = async ({ user, password }: LoginFormValues) => {
    if (!user || !password) {
      setErrorMessage("Por favor ingresa usuario y contraseña.");
      return;
    }

    try {
      setErrorMessage("");
      const data = await login(user, password);

      if (data.token) {
        Cookies.set("token", data.token, { expires: 1 }); // Expira en 1 día
        router.push("/dashboard");
      } else {
        setErrorMessage("No se recibió token. Verifica tus credenciales.");
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        setErrorMessage("Usuario o contraseña incorrectos.");
      } else if (err.response?.data?.message) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage("Error al iniciar sesión. Intenta nuevamente.");
      }
    }
  };

  // 🔹 Hace que el mensaje desaparezca después de 3 segundos
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex flex-col items-center justify-center"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      <button
        className="absolute top-5 left-5 bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700"
        onClick={() => router.push("/")}
      >
        Regresar
      </button>

      {/* 🔹 Animación del mensaje */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 
                 bg-red-100 text-red-700 px-4 py-2 
                 rounded-lg shadow-md border border-red-300 
                 text-sm sm:text-base max-w-xs sm:max-w-md text-center"
          >
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <LoginForm onSubmit={handleLogin} />
    </div>
  );
}
