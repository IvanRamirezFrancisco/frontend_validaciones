import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // <-- ★★ AÑADIR PARA INPUTS
import { CarritoService } from '../../services/carrito';
import { InventarioService } from '../../admin/inventario.service'; // <-- ★★ AÑADIR

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule // <-- ★★ AÑADIR
  ],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css'
})
export class Carrito implements OnInit {

  // Variables públicas
  public items: any[] = [];
  public recomendados: any[] = [];
  public subtotal: number = 0;

  // Inyectamos los servicios
  private carritoService = inject(CarritoService);
  private inventarioService = inject(InventarioService); // <-- ★★ AÑADIR

  ngOnInit(): void {
    // Nos suscribimos a los cambios del carrito
    this.carritoService.cartItems$.subscribe(itemsActuales => {
      this.items = itemsActuales;
      this.calcularSubtotal();
    });

    // Cargamos las recomendaciones (los 4 primeros productos)
    // DESPUÉS (Correcto):
this.recomendados = this.inventarioService.getInventarioArray().slice(0, 4); // <-- ARREGLADO
  }

  // --- ★★ NUEVA LÓGICA DEL CARRITO ★★ ---

  calcularSubtotal() {
    this.subtotal = this.items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  }

  // Funciones para los botones de cantidad
  disminuirCantidad(item: any) {
    if (item.cantidad > 1) {
      item.cantidad--;
      this.carritoService.actualizarCantidad(item.sku, item.cantidad);
    }
  }

  aumentarCantidad(item: any) {
    item.cantidad++;
    this.carritoService.actualizarCantidad(item.sku, item.cantidad);
  }

  // Función para el botón de eliminar
  eliminarItem(sku: string) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      this.carritoService.eliminarDelCarrito(sku);
    }
  }
  
  agregarRecomendadoAlCarrito(producto: any) {
    this.carritoService.agregarAlCarrito(producto);
    alert(`${producto.producto} añadido al carrito!`);
  }

}