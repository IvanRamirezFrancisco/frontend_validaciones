// Archivo: src/app/guards/auth.guard.ts
// Guard para proteger rutas que requieren autenticación

import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    map(user => {
      if (user) {
        return true;
      }
      
      // Redirigir al login si no está autenticado
      router.navigate(['/login'], { 
        queryParams: { returnUrl: state.url } 
      });
      return false;
    })
  );
};

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    map(user => {
      if (user && user.rol !== 'Cliente') {
        return true;
      }
      
      // Redirigir si no es empleado/admin
      router.navigate(['/login']);
      return false;
    })
  );
};

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.currentUser$.pipe(
      map(user => {
        if (user && user.rol && allowedRoles.includes(user.rol)) {
          return true;
        }
        
        // Redirigir si no tiene el rol adecuado
        router.navigate(['/admin/dashboard']);
        return false;
      })
    );
  };
};