"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import LoginForm from "@/components/login/LoginForm";
import { login } from "@/api/services/userApi";
import Cookies from 'js-cookie';

export default function LoginPage() {
  const router = useRouter();
  const [authError, setAuthError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");


      
  interface LoginFormValues {
    user: string;
    password: string;
    acceptTerms: boolean;
  }

  const handleLogin = async ({ user, password }: LoginFormValues) => {
    if (!user || !password) {
      setAuthError("Por favor ingresa usuario y contraseña.");
      return;
    }

    try {
      setAuthError("");
      setSuccessMessage("");
      const data = await login(user, password);

      if (data.token) {
        Cookies.set("token", data.token, { expires: 1 }); // Expira en 1 día
        setSuccessMessage("¡Bienvenido! Iniciando sesión...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        setAuthError("No se recibió token. Verifica tus credenciales.");
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        setAuthError("Usuario o contraseña incorrectos.");
      } else if (err.response?.data?.message) {
        setAuthError(err.response.data.message);
      } else {
        setAuthError("Usuario o contraseña incorrectos.");
      }
    }
  };


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


      <LoginForm onSubmit={handleLogin} authError={authError} successMessage={successMessage} />
    </div>
  );
}
