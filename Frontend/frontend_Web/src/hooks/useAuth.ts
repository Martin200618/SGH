import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { isAuthenticated, removeToken } from '@/api/utils/authUtils';

/**
 * Hook personalizado para manejar autenticación
 * Redirige al login si no está autenticado
 */
export const useAuth = () => {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  const logout = () => {
    removeToken();
    router.push('/login');
  };

  return {
    isAuthenticated: isAuthenticated(),
    logout,
  };
};