import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Usuario, UserRole, LoginRequest } from '../models/index';

// Re-exportar UserRole para compatibilidad
export type { UserRole } from '../models/index';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.userSubject.asObservable();

  // Usuarios predefinidos para la demo
  private usuarios: Usuario[] = [
    { id: 1, nombre: 'admin', rol: 'Administrador', activo: true },
    { id: 2, nombre: 'vendedor', rol: 'Vendedor', activo: true },
    { id: 3, nombre: 'inventario', rol: 'Inventario', activo: true }
  ];

  constructor() {
    // Cargar usuario de localStorage si existe (solo en el navegador)
    if (typeof window !== 'undefined' && localStorage) {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        this.userSubject.next(JSON.parse(savedUser));
      }
    }
  }

  login(requestOrNombre: LoginRequest | string, tipo?: 'Cliente' | 'Empleado'): Usuario | null {
    let request: LoginRequest;

    // Manejar tanto el nuevo formato como el formato legacy
    if (typeof requestOrNombre === 'string') {
      if (!tipo) {
        throw new Error('Tipo es requerido cuando se usa el formato legacy');
      }
      request = { nombre: requestOrNombre, tipo };
    } else {
      request = requestOrNombre;
    }

    if (!request.nombre || request.nombre.trim() === '') {
      console.error('El nombre es requerido');
      return null;
    }

    let usuario: Usuario | null = null;

    try {
      if (request.tipo === 'Cliente') {
        usuario = { 
          nombre: request.nombre, 
          rol: 'Cliente',
          activo: true,
          fechaCreacion: new Date()
        };
      } else {
        // Buscar empleado en la lista predefinida
        const empleado = this.usuarios.find(u => 
          u.nombre.toLowerCase() === request.nombre.toLowerCase() && u.activo
        );

        if (!empleado) {
          console.error('Empleado no encontrado o inactivo');
          return null;
        }

        usuario = { ...empleado };
      }

      // Guardar en localStorage y actualizar estado (solo en el navegador)
      if (typeof window !== 'undefined' && localStorage) {
        localStorage.setItem('currentUser', JSON.stringify(usuario));
      }
      this.userSubject.next(usuario);
      return usuario;
    } catch (error) {
      console.error('Error en login:', error);
      return null;
    }
  }

  // Método específico para login con rol predefinido (DEMO)
  loginWithRole(nombre: string, rol: UserRole): Usuario | null {
    try {
      const usuario: Usuario = {
        id: Date.now(), // ID único temporal
        nombre: nombre,
        rol: rol,
        activo: true
      };

      // Guardar en localStorage y actualizar estado (solo en el navegador)
      if (typeof window !== 'undefined' && localStorage) {
        localStorage.setItem('currentUser', JSON.stringify(usuario));
      }
      this.userSubject.next(usuario);
      
      console.log(`🎓 ACCESO DEMO: ${nombre} logueado como ${rol}`);
      return usuario;
    } catch (error) {
      console.error('Error en loginWithRole:', error);
      return null;
    }
  }

  logout(): void {
    // Limpiar localStorage y estado (solo en el navegador)
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.removeItem('currentUser');
    }
    this.userSubject.next(null);
  }

  getCurrentUser(): Usuario | null {
    return this.userSubject.value;
  }

  isAuthenticated(): boolean {
    return this.userSubject.value !== null;
  }

  hasRole(rol: UserRole): boolean {
    return this.userSubject.value?.rol === rol;
  }

  hasAnyRole(roles: UserRole[]): boolean {
    const currentRole = this.userSubject.value?.rol;
    return currentRole ? roles.includes(currentRole) : false;
  }

  // Método para compatibilidad
  public tieneRol(rol: UserRole): boolean {
    return this.hasRole(rol);
  }
}