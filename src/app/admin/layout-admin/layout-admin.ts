import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService, UserRole } from '../../services/auth'; // <-- Importamos los Roles
import { CommonModule } from '@angular/common'; // <-- Importamos CommonModule

@Component({
  selector: 'app-layout-admin',
  standalone: true, 
  imports: [
    RouterModule,
    CommonModule // <-- AÑADIDO
  ],
  templateUrl: './layout-admin.html',
  styleUrl: './layout-admin.css'
})
export class LayoutAdmin implements OnInit { 
  
  private authService = inject(AuthService);
  private router = inject(Router);

  public rolUsuario: UserRole = null;

  ngOnInit(): void {
    // Nos suscribimos para saber quién es el usuario
    this.authService.currentUser$.subscribe(user => {
      if (user && user.rol !== 'Cliente') { // Si es un empleado
        this.rolUsuario = user.rol;
      } else {
        // Si no hay usuario (o es un cliente), lo saca de aquí
        this.router.navigate(['/login']);
      }
    });
  }

  // Función para que el HTML pueda usarla con *ngIf
  tieneRol(rol: string): boolean {
    return this.rolUsuario === rol;
  }
  
  logout() {
    this.authService.logout();
    this.router.navigate(['/']); // Redirige al inicio (tienda)
  }
}