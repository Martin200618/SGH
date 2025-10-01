/**
 * Configuración de variables de entorno
 *
 * Centraliza todas las variables de entorno con valores por defecto seguros.
 * Proporciona validación y documentación de las configuraciones.
 */

interface EnvironmentConfig {
  /** URL base de la API del backend */
  apiBaseUrl: string;
  /** Indica si está en modo desarrollo */
  isDevelopment: boolean;
  /** Indica si está en modo producción */
  isProduction: boolean;
  /** Nivel de logging */
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  /** Habilitar logging remoto */
  enableRemoteLogging: boolean;
}

/**
 * Configuración de entorno con valores por defecto
 */
const config: EnvironmentConfig = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8085',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  logLevel: (process.env.NEXT_PUBLIC_LOG_LEVEL as any) || 'info',
  enableRemoteLogging: process.env.NEXT_PUBLIC_ENABLE_REMOTE_LOGGING === 'true',
};

/**
 * Valida la configuración de entorno
 * @throws Error si la configuración es inválida
 */
function validateConfig(): void {
  if (!config.apiBaseUrl) {
    throw new Error('NEXT_PUBLIC_API_BASE_URL es requerido');
  }

  try {
    new URL(config.apiBaseUrl);
  } catch {
    throw new Error('NEXT_PUBLIC_API_BASE_URL debe ser una URL válida');
  }

  const validLogLevels = ['debug', 'info', 'warn', 'error'];
  if (!validLogLevels.includes(config.logLevel)) {
    throw new Error(`NEXT_PUBLIC_LOG_LEVEL debe ser uno de: ${validLogLevels.join(', ')}`);
  }
}

// Validar configuración en tiempo de ejecución
validateConfig();

export { config };
export type { EnvironmentConfig };