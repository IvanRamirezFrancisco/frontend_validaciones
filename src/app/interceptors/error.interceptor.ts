// Archivo: src/app/interceptors/error.interceptor.ts
// Interceptor avanzado para manejo centralizado de errores HTTP

import { HttpInterceptorFn, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError, retry, timer, mergeMap } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { AuthService } from '../services/auth';

// Configuración de reintentos
const RETRY_COUNT = 3;
const RETRY_DELAY = 1000;

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const notificationService = inject(NotificationService);
  const authService = inject(AuthService);

  return next(req).pipe(
    // Reintentos automáticos para errores de red
    retry({
      count: shouldRetry(req) ? RETRY_COUNT : 0,
      delay: (error, retryIndex) => {
        if (error.status === 0 || error.status >= 500) {
          console.log(`Reintento ${retryIndex + 1} para ${req.url}`);
          return timer(RETRY_DELAY * Math.pow(2, retryIndex)); // Backoff exponencial
        }
        return throwError(() => error);
      }
    }),
    
    catchError((error: HttpErrorResponse) => {
      const errorInfo = processError(error, req);
      
      // Log detallado del error
      console.error('🚨 Error HTTP interceptado:', {
        url: req.url,
        method: req.method,
        status: error.status,
        statusText: error.statusText,
        message: errorInfo.message,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        error: error.error
      });

      // Manejar errores específicos
      handleSpecificErrors(error, router, authService, notificationService);

      // Mostrar notificación al usuario
      if (typeof window !== 'undefined' && !shouldSuppressNotification(error)) {
        showUserNotification(errorInfo, notificationService);
      }

      return throwError(() => ({
        ...errorInfo,
        originalError: error,
        timestamp: new Date().toISOString()
      }));
    })
  );
};

function shouldRetry(req: HttpRequest<any>): boolean {
  // No reintentar para métodos que modifican datos
  return ['GET', 'HEAD', 'OPTIONS'].includes(req.method);
}

function processError(error: HttpErrorResponse, req: HttpRequest<any>) {
  let message = 'Ha ocurrido un error inesperado';
  let type: 'network' | 'client' | 'server' | 'auth' | 'validation' = 'client';
  let code = 'UNKNOWN_ERROR';

  if (error.status === 0) {
    // Error de red o CORS
    message = 'Error de conexión. Verifique su conexión a internet.';
    type = 'network';
    code = 'NETWORK_ERROR';
  } else if (error.status === 400) {
    // Bad Request - Error de validación
    message = error.error?.message || 'Datos inválidos en la solicitud';
    type = 'validation';
    code = 'VALIDATION_ERROR';
  } else if (error.status === 401) {
    // No autorizado
    message = 'Sesión expirada. Por favor, inicie sesión nuevamente.';
    type = 'auth';
    code = 'UNAUTHORIZED';
  } else if (error.status === 403) {
    // Prohibido
    message = 'No tiene permisos para realizar esta acción.';
    type = 'auth';
    code = 'FORBIDDEN';
  } else if (error.status === 404) {
    // No encontrado
    message = 'El recurso solicitado no fue encontrado.';
    type = 'client';
    code = 'NOT_FOUND';
  } else if (error.status === 409) {
    // Conflicto
    message = error.error?.message || 'Conflicto con el estado actual del recurso';
    type = 'validation';
    code = 'CONFLICT';
  } else if (error.status === 422) {
    // Entidad no procesable
    message = error.error?.message || 'Los datos enviados no son válidos';
    type = 'validation';
    code = 'UNPROCESSABLE_ENTITY';
  } else if (error.status === 429) {
    // Demasiadas solicitudes
    message = 'Demasiadas solicitudes. Intente más tarde.';
    type = 'client';
    code = 'RATE_LIMIT_EXCEEDED';
  } else if (error.status >= 500) {
    // Error del servidor
    message = 'Error interno del servidor. Nuestro equipo ha sido notificado.';
    type = 'server';
    code = 'SERVER_ERROR';
  } else if (error.error?.message) {
    // Error personalizado del backend
    message = error.error.message;
    code = error.error.code || 'CUSTOM_ERROR';
  }

  return {
    message,
    type,
    code,
    status: error.status,
    statusText: error.statusText,
    url: req.url,
    method: req.method
  };
}

function handleSpecificErrors(
  error: HttpErrorResponse, 
  router: Router, 
  authService: AuthService,
  notificationService: NotificationService
) {
  switch (error.status) {
    case 401:
      // Logout automático y redirección
      authService.logout();
      router.navigate(['/login'], { 
        queryParams: { returnUrl: router.url, reason: 'session_expired' } 
      });
      break;
      
    case 403:
      // Redireccionar a página de acceso denegado o dashboard
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        if (currentUser.rol === 'Cliente') {
          router.navigate(['/']);
        } else {
          router.navigate(['/admin/dashboard']);
        }
      } else {
        router.navigate(['/login']);
      }
      break;
      
    case 404:
      // Para ciertas rutas, redireccionar a 404
      if (router.url.includes('/admin/') || router.url.includes('/producto/')) {
        // No redirigir automáticamente, dejar que el componente maneje el 404
      }
      break;
      
    case 500:
    case 502:
    case 503:
    case 504:
      // Errores de servidor - posible mantenimiento
      notificationService.error(
        'Servicio temporalmente no disponible',
        'Estamos trabajando para resolver este problema. Intente más tarde.'
      );
      break;
  }
}

function shouldSuppressNotification(error: HttpErrorResponse): boolean {
  // Suprimir notificaciones para ciertos casos
  const suppressFor = [
    404, // Not found - el componente manejará esto
  ];
  
  return suppressFor.includes(error.status);
}

function showUserNotification(errorInfo: any, notificationService: NotificationService) {
  const title = getErrorTitle(errorInfo.type, errorInfo.status);
  
  switch (errorInfo.type) {
    case 'network':
      notificationService.error(title, errorInfo.message, { duration: 8000 });
      break;
    case 'auth':
      notificationService.warning(title, errorInfo.message, { duration: 6000 });
      break;
    case 'validation':
      notificationService.warning(title, errorInfo.message, { duration: 5000 });
      break;
    case 'server':
      notificationService.error(title, errorInfo.message, { duration: 10000 });
      break;
    default:
      notificationService.error(title, errorInfo.message);
  }
}

function getErrorTitle(type: string, status: number): string {
  switch (type) {
    case 'network':
      return '🌐 Error de Conexión';
    case 'auth':
      return status === 401 ? '🔐 Sesión Expirada' : '⛔ Acceso Denegado';
    case 'validation':
      return '⚠️ Datos Inválidos';
    case 'server':
      return '🚨 Error del Servidor';
    default:
      return '❌ Error';
  }
}