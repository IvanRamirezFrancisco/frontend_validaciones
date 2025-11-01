// Archivo: src/app/admin/usuario.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  // 1. Nuestra lista simulada de empleados
  private usuarios = [
    { id: 1, nombre: 'admin', rol: 'Administrador' },
    { id: 2, nombre: 'vendedor', rol: 'Vendedor' },
    { id: 3, nombre: 'inventario', rol: 'Inventario' }
  ];

  constructor() { }

  // 2. Función para obtener la lista (devuelve un Array simple)
  getUsuariosArray() {
    return this.usuarios;
  }

  // (En el futuro, aquí añadiremos addUser, deleteUser, etc.)
}