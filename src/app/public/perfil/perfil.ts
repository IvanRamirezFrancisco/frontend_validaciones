import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // <-- AÑADIR
import { FormsModule } from '@angular/forms'; // <-- AÑADIR
import { AuthService } from '../../services/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule, // <-- AÑADIR
    FormsModule     // <-- AÑADIR
  ],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css' // <-- CAMBIADO: Usaremos su propio CSS
})
export class Perfil implements OnInit { // <-- Implementamos OnInit
  
  public currentUser$: Observable<any | null>;
  private authService = inject(AuthService);

  // Variable para el formulario
  public nombreUsuario: string = '';

  constructor() {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    // Escuchamos al usuario para pre-llenar el formulario
    this.currentUser$.subscribe(user => {
      if (user) {
        this.nombreUsuario = user.nombre;
      }
    });
  }

  guardarCambios() {
    alert('¡Cambios guardados! (Simulación)');
    // Aquí, en el futuro, llamarías a authService.updateUser(this.nombreUsuario);
  }
}