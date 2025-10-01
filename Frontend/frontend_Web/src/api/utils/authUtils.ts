import Cookies from 'js-cookie';

/**
 * Obtiene los headers de autenticación con el token JWT
 * @returns Headers con Content-Type y Authorization si hay token
 */
export const getAuthHeaders = (): Record<string, string> => {
  const token = Cookies.get("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Verifica si el usuario está autenticado
 * @returns true si hay token, false en caso contrario
 */
export const isAuthenticated = (): boolean => {
  return !!Cookies.get("token");
};

/**
 * Obtiene el token de autenticación
 * @returns El token JWT o null si no existe
 */
export const getToken = (): string | undefined => {
  return Cookies.get("token");
};

/**
 * Remueve el token de autenticación (logout)
 */
export const removeToken = (): void => {
  Cookies.remove("token");
};