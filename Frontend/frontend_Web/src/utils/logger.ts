import { config } from '../config/env';

/**
 * Niveles de logging disponibles
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

/**
 * Configuración del logger
 */
interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableRemote: boolean;
}

/**
 * Mapeo de niveles de log string a enum
 */
const logLevelMap = {
  debug: LogLevel.DEBUG,
  info: LogLevel.INFO,
  warn: LogLevel.WARN,
  error: LogLevel.ERROR,
};

/**
 * Logger estructurado para la aplicación
 *
 * Proporciona logging consistente con diferentes niveles y formatos.
 * Soporta logging en consola y envío remoto de logs de error.
 */
class Logger {
  private config: LoggerConfig;

  constructor(configOverride: Partial<LoggerConfig> = {}) {
    this.config = {
      level: logLevelMap[config.logLevel],
      enableConsole: config.isDevelopment,
      enableRemote: config.enableRemoteLogging,
      ...configOverride,
    };
  }

  /**
   * Verifica si un nivel de log debe ser procesado
   * @param level - Nivel del log a verificar
   * @returns true si debe procesarse
   */
  private shouldLog(level: LogLevel): boolean {
    return level >= this.config.level;
  }

  /**
   * Formatea el mensaje de log con timestamp y contexto
   * @param level - Nivel del log
   * @param message - Mensaje del log
   * @param context - Contexto adicional
   * @returns Mensaje formateado
   */
  private formatMessage(level: LogLevel, message: string, context?: any): string {
    const timestamp = new Date().toISOString();
    const levelName = LogLevel[level];
    const contextStr = context ? ` | ${JSON.stringify(context)}` : '';
    return `[${timestamp}] ${levelName}: ${message}${contextStr}`;
  }

  /**
   * Log de debug (solo en desarrollo)
   * @param message - Mensaje del log
   * @param context - Contexto adicional
   */
  debug(message: string, context?: any): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      if (this.config.enableConsole) {
        console.debug(this.formatMessage(LogLevel.DEBUG, message, context));
      }
    }
  }

  /**
   * Log informativo
   * @param message - Mensaje del log
   * @param context - Contexto adicional
   */
  info(message: string, context?: any): void {
    if (this.shouldLog(LogLevel.INFO)) {
      if (this.config.enableConsole) {
        console.info(this.formatMessage(LogLevel.INFO, message, context));
      }
    }
  }

  /**
   * Log de advertencia
   * @param message - Mensaje del log
   * @param context - Contexto adicional
   */
  warn(message: string, context?: any): void {
    if (this.shouldLog(LogLevel.WARN)) {
      if (this.config.enableConsole) {
        console.warn(this.formatMessage(LogLevel.WARN, message, context));
      }
    }
  }

  /**
   * Log de error
   * @param message - Mensaje del log
   * @param error - Error opcional
   * @param context - Contexto adicional
   */
  error(message: string, error?: Error, context?: any): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const errorContext = {
        ...context,
        error: error ? {
          name: error.name,
          message: error.message,
          stack: error.stack,
        } : undefined,
      };

      if (this.config.enableConsole) {
        console.error(this.formatMessage(LogLevel.ERROR, message, errorContext));
      }

      // Enviar logs de error a servicio remoto si está habilitado
      if (this.config.enableRemote) {
        this.sendRemoteLog(LogLevel.ERROR, message, errorContext);
      }
    }
  }

  /**
   * Envía logs a un servicio remoto (placeholder para implementación futura)
   * @param level - Nivel del log
   * @param message - Mensaje del log
   * @param context - Contexto del log
   */
  private async sendRemoteLog(level: LogLevel, message: string, context: any): Promise<void> {
    try {
      // TODO: Implementar envío a servicio de logging remoto
      // await fetch('/api/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ level, message, context, timestamp: new Date().toISOString() }),
      // });
    } catch (error) {
      // Fallback a console si falla el envío remoto
      console.error('Failed to send remote log:', error);
    }
  }

  /**
   * Actualiza la configuración del logger
   * @param config - Nueva configuración
   */
  updateConfig(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// Instancia global del logger
export const logger = new Logger();

// Funciones de conveniencia para uso directo
export const log = {
  debug: (message: string, context?: any) => logger.debug(message, context),
  info: (message: string, context?: any) => logger.info(message, context),
  warn: (message: string, context?: any) => logger.warn(message, context),
  error: (message: string, error?: Error, context?: any) => logger.error(message, error, context),
};