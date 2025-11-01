import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Producto, ProductoCarrito } from '../models/index';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private items: ProductoCarrito[] = [];
  private cartItemsSubject = new BehaviorSubject<ProductoCarrito[]>([]);
  public cartItems$: Observable<ProductoCarrito[]> = this.cartItemsSubject.asObservable();

  constructor() {
    // Cargar carrito desde localStorage (solo en el navegador)
    if (typeof window !== 'undefined' && localStorage) {
      const savedCart = localStorage.getItem('carrito');
      if (savedCart) {
        this.items = JSON.parse(savedCart);
        this.cartItemsSubject.next(this.items);
      }
    }
  }

  agregarAlCarrito(producto: Producto, cantidad: number = 1): void {
    if (cantidad <= 0) {
      console.error('La cantidad debe ser mayor a 0');
      return;
    }

    const itemExistente = this.items.find(item => item.sku === producto.sku);
    
    if (itemExistente) {
      itemExistente.cantidad += cantidad;
    } else {
      const nuevoItem: ProductoCarrito = { ...producto, cantidad };
      this.items.push(nuevoItem);
    }
    
    this.actualizarCarrito();
  }

  actualizarCantidad(sku: string, nuevaCantidad: number): boolean {
    if (nuevaCantidad <= 0) {
      return this.eliminarDelCarrito(sku);
    }

    const item = this.items.find(item => item.sku === sku);
    if (item) {
      item.cantidad = nuevaCantidad;
      this.actualizarCarrito();
      return true;
    }
    return false;
  }

  eliminarDelCarrito(sku: string): boolean {
    const initialLength = this.items.length;
    this.items = this.items.filter(item => item.sku !== sku);
    
    if (this.items.length < initialLength) {
      this.actualizarCarrito();
      return true;
    }
    return false;
  }

  obtenerItems(): ProductoCarrito[] {
    return [...this.items];
  }

  obtenerCantidadTotal(): number {
    return this.items.reduce((total, item) => total + item.cantidad, 0);
  }

  obtenerSubtotal(): number {
    return this.items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  }

  obtenerTotal(iva: number = 0.16): number {
    const subtotal = this.obtenerSubtotal();
    return subtotal + (subtotal * iva);
  }

  vaciarCarrito(): void {
    this.items = [];
    this.actualizarCarrito();
  }

  estaVacio(): boolean {
    return this.items.length === 0;
  }

  contieneProducto(sku: string): boolean {
    return this.items.some(item => item.sku === sku);
  }

  private actualizarCarrito(): void {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.setItem('carrito', JSON.stringify(this.items));
    }
    this.cartItemsSubject.next([...this.items]);
  }
}