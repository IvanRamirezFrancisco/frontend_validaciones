import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Importamos los servicios
import { InventarioService } from '../../admin/inventario.service';
import { CarritoService } from '../../services/carrito';

@Component({
  selector: 'app-ofertas',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './ofertas.html',
  styleUrl: './ofertas.css'
})
export class Ofertas implements OnInit { // <-- Implementamos OnInit

  // Variables
  public productosEnOferta: any[] = [];
  private inventarioService = inject(InventarioService);
  private carritoService = inject(CarritoService);

  ngOnInit(): void {
    // Cargamos los productos (por ahora, todos)
    // DESPUÉS (Correcto):
this.productosEnOferta = this.inventarioService.getInventarioArray(); // <-- ARREGLADO
  }

  // Función para el botón "Añadir al Carrito"
  agregarAlCarrito(producto: any) {
    this.carritoService.agregarAlCarrito(producto);
    alert(`${producto.producto} añadido al carrito!`);
  }
}