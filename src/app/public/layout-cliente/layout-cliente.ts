import { Component, inject, OnInit } from '@angular/core'; 
import { RouterModule, Router } from '@angular/router'; // <-- Importa Router
import { CommonModule } from '@angular/common'; 
import { CarritoService } from '../../services/carrito';
import { AuthService } from '../../services/auth'; // <-- 1. IMPORTA AUTH
import { Observable } from 'rxjs'; // <-- 2. IMPORTA OBSERVABLE

@Component({
  selector: 'app-layout-cliente',
  standalone: true,
  imports: [ RouterModule, CommonModule ],
  templateUrl: './layout-cliente.html',
  styleUrl: './layout-cliente.css'
})
export class LayoutCliente implements OnInit { 

  private carritoService = inject(CarritoService);
  private authService = inject(AuthService); // <-- 3. INYECTA AUTH
  private router = inject(Router); // <-- 4. INYECTA ROUTER

  public cartItemCount: number = 0;
  public currentUser$: Observable<any | null>; // <-- 5. CREA LA VARIABLE

  constructor() {
    // Asignamos el observable
    this.currentUser$ = this.authService.currentUser$; // <-- 6. ASIGNA EL OBSERVABLE
  }

  ngOnInit(): void {
    this.carritoService.cartItems$.subscribe(items => {
      this.cartItemCount = items.reduce((total, item) => total + item.cantidad, 0);
    });
  }

  // 7. CREA LA FUNCIÓN DE LOGOUT
  logout() {
    this.authService.logout();
    this.router.navigate(['/']); // Vuelve al inicio
  }
}