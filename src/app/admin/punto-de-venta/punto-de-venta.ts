import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { InventarioService } from '../inventario.service';
import { VentasService } from '../../services/ventas.service';
import { AuthService } from '../../services/auth';
import { Producto, ProductoCarrito } from '../../models/index';

@Component({
  selector: 'app-punto-de-venta',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,  // <-- 4. AÑADIR FORMS
    RouterModule  // <-- 5. AÑADIR ROUTER
  ],
  templateUrl: './punto-de-venta.html',
  styleUrl: './punto-de-venta.css',
})
export class PuntoDeVenta implements OnInit {

  private inventarioService = inject(InventarioService);
  private ventasService = inject(VentasService);
  private authService = inject(AuthService);

  public todoElInventario: Producto[] = [];
  public resultadosBusqueda: Producto[] = [];
  public busqueda: string = '';

  public ticketActual: ProductoCarrito[] = [];
  public subtotal: number = 0;
  public iva: number = 0;
  public total: number = 0;
  
  public cliente: string = '';
  public metodoPago: string = 'efectivo';

  ngOnInit(): void {
    // Cargamos todo el inventario en memoria para búsquedas rápidas
    this.todoElInventario = this.inventarioService.getInventarioArray();
    this.resultadosBusqueda = this.todoElInventario.slice(0, 5); // Mostramos los 5 primeros por defecto
  }

  // --- Funciones de Búsqueda ---
  buscarProducto() {
    if (this.busqueda.trim() === '') {
      this.resultadosBusqueda = this.todoElInventario.slice(0, 5); // Muestra los 5 primeros si está vacío
      return;
    }
    
    // Filtra el inventario completo
    this.resultadosBusqueda = this.todoElInventario.filter(p => 
      p.producto.toLowerCase().includes(this.busqueda.toLowerCase()) ||
      p.sku.toLowerCase().includes(this.busqueda.toLowerCase())
    ).slice(0, 10); // Muestra los primeros 10 resultados
  }

  // --- Funciones del Ticket ---
  agregarAlTicket(producto: Producto): void {
    // Verificar stock disponible
    if (producto.stock <= 0) {
      alert('Producto sin stock disponible');
      return;
    }

    const itemExistente = this.ticketActual.find(item => item.sku === producto.sku);

    if (itemExistente) {
      if (itemExistente.cantidad >= producto.stock) {
        alert('No hay suficiente stock para agregar más unidades');
        return;
      }
      itemExistente.cantidad++;
    } else {
      const nuevoItem: ProductoCarrito = { ...producto, cantidad: 1 };
      this.ticketActual.push(nuevoItem);
    }
    
    this.calcularTotales();
    this.limpiarBusqueda();
  }

  eliminarDelTicket(sku: string): void {
    this.ticketActual = this.ticketActual.filter(item => item.sku !== sku);
    this.calcularTotales();
  }

  aumentarCantidad(item: ProductoCarrito): void {
    const producto = this.inventarioService.getProductoPorSku(item.sku);
    if (producto && item.cantidad < producto.stock) {
      item.cantidad++;
      this.calcularTotales();
    } else {
      alert('No hay suficiente stock disponible');
    }
  }

  disminuirCantidad(item: ProductoCarrito): void {
    if (item.cantidad > 1) {
      item.cantidad--;
      this.calcularTotales();
    } else {
      this.eliminarDelTicket(item.sku);
    }
  }

  calcularTotales(): void {
    this.subtotal = this.ticketActual.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    this.iva = this.subtotal * 0.16;
    this.total = this.subtotal + this.iva;
  }

  finalizarVenta(): void {
    if (this.ticketActual.length === 0) {
      alert('No hay productos en el ticket');
      return;
    }

    const usuario = this.authService.getCurrentUser();
    if (!usuario) {
      alert('Error: Usuario no autenticado');
      return;
    }

    try {
      // Registrar la venta
      const venta = this.ventasService.registrarVenta(
        this.ticketActual,
        usuario.nombre,
        this.cliente || undefined
      );

      // Actualizar stock en inventario
      this.ticketActual.forEach(item => {
        const producto = this.inventarioService.getProductoPorSku(item.sku);
        if (producto) {
          const nuevoStock = producto.stock - item.cantidad;
          this.inventarioService.updateStock(item.sku, nuevoStock);
        }
      });

      // Mostrar resumen de la venta
      const resumen = `
        Venta realizada exitosamente
        ID: ${venta.id}
        Total: $${venta.total.toFixed(2)}
        Productos: ${venta.items.length}
        ${this.cliente ? `Cliente: ${this.cliente}` : ''}
      `;
      
      alert(resumen);
      this.resetearTicket();

    } catch (error) {
      console.error('Error al finalizar venta:', error);
      alert('Error al procesar la venta. Intente nuevamente.');
    }
  }

  cancelarVenta(): void {
    if (this.ticketActual.length > 0) {
      if (confirm('¿Está seguro de cancelar la venta actual?')) {
        this.resetearTicket();
      }
    }
  }

  private resetearTicket(): void {
    this.ticketActual = [];
    this.cliente = '';
    this.metodoPago = 'efectivo';
    this.calcularTotales();
  }

  private limpiarBusqueda(): void {
    this.busqueda = '';
    this.resultadosBusqueda = this.todoElInventario.slice(0, 5);
  }
}