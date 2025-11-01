import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Producto } from '../models/index';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  private productos: Producto[] = [
    { 
      sku: 'FEN-FA125', 
      producto: 'Guitarra Acústica Fender FA-125', 
      stock: 8, 
      precio: 3500.00,
      categoria: 'Guitarras',
      descripcion: 'Guitarra acústica de calidad profesional con excelente sonido y acabado.'
    },
    { 
      sku: 'YAM-E373', 
      producto: 'Teclado Yamaha PSR-E373', 
      stock: 5, 
      precio: 4200.00,
      categoria: 'Teclados',
      descripcion: 'Teclado electrónico con 61 teclas y múltiples sonidos incorporados.'
    },
    { 
      sku: 'HOH-SP20', 
      producto: 'Armónica Hohner Special 20', 
      stock: 15, 
      precio: 850.00,
      categoria: 'Vientos',
      descripcion: 'Armónica diatónica de 10 celdas, ideal para blues y folk.'
    },
    {
      sku: 'DRU-TAM14',
      producto: 'Batería Tama Imperialstar',
      stock: 3,
      precio: 12500.00,
      categoria: 'Percusión',
      descripcion: 'Set completo de batería acústica con platillos incluidos.'
    },
    {
      sku: 'GIB-LP50',
      producto: 'Guitarra Eléctrica Gibson Les Paul',
      stock: 2,
      precio: 25000.00,
      categoria: 'Guitarras',
      descripcion: 'Guitarra eléctrica de alta gama con pastillas humbucker.'
    }
  ];

  private productosSubject = new BehaviorSubject<Producto[]>(this.productos);

  constructor() {
    // Cargar datos desde localStorage si existen (solo en el navegador)
    if (typeof window !== 'undefined' && localStorage) {
      const savedProducts = localStorage.getItem('inventario');
      if (savedProducts) {
        this.productos = JSON.parse(savedProducts);
        this.productosSubject.next(this.productos);
      }
    }
  }

  // --- FUNCIONES CRUD MEJORADAS ---
  getInventario(): Observable<Producto[]> {
    return this.productosSubject.asObservable();
  }

  getInventarioArray(): Producto[] {
    return [...this.productosSubject.value];
  }

  getProductoPorSku(sku: string): Producto | undefined {
    return this.productosSubject.value.find((p: Producto) => p.sku === sku);
  }

  addProduct(producto: Producto): boolean {
    try {
      // Validar que no exista el SKU
      if (this.getProductoPorSku(producto.sku)) {
        throw new Error(`El producto con SKU ${producto.sku} ya existe`);
      }

      const listaActual = this.productosSubject.value;
      const nuevaLista = [...listaActual, producto];
      this.productosSubject.next(nuevaLista);
      this.saveToLocalStorage(nuevaLista);
      return true;
    } catch (error) {
      console.error('Error al agregar producto:', error);
      return false;
    }
  }

  updateProduct(sku: string, productoActualizado: Producto): boolean {
    try {
      const listaActual = this.productosSubject.value;
      const indice = listaActual.findIndex((p: Producto) => p.sku === sku);
      
      if (indice === -1) {
        throw new Error(`Producto con SKU ${sku} no encontrado`);
      }

      listaActual[indice] = { ...productoActualizado };
      const nuevaLista = [...listaActual];
      this.productosSubject.next(nuevaLista);
      this.saveToLocalStorage(nuevaLista);
      return true;
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      return false;
    }
  }

  deleteProduct(sku: string): boolean {
    try {
      const listaActual = this.productosSubject.value;
      const nuevaLista = listaActual.filter((p: Producto) => p.sku !== sku);
      
      if (nuevaLista.length === listaActual.length) {
        throw new Error(`Producto con SKU ${sku} no encontrado`);
      }

      this.productosSubject.next(nuevaLista);
      this.saveToLocalStorage(nuevaLista);
      return true;
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      return false;
    }
  }

  updateStock(sku: string, nuevoStock: number): boolean {
    const producto = this.getProductoPorSku(sku);
    if (producto) {
      producto.stock = nuevoStock;
      return this.updateProduct(sku, producto);
    }
    return false;
  }

  buscarProductos(termino: string): Producto[] {
    const terminoLower = termino.toLowerCase();
    return this.productosSubject.value.filter((p: Producto) =>
      p.producto.toLowerCase().includes(terminoLower) ||
      p.sku.toLowerCase().includes(terminoLower) ||
      p.categoria?.toLowerCase().includes(terminoLower)
    );
  }

  getProductosPorCategoria(categoria: string): Producto[] {
    return this.productosSubject.value.filter((p: Producto) => 
      p.categoria?.toLowerCase() === categoria.toLowerCase()
    );
  }

  getProductosBajoStock(minimo: number = 5): Producto[] {
    return this.productosSubject.value.filter((p: Producto) => p.stock <= minimo);
  }

  getCategorias(): string[] {
    const categorias = this.productosSubject.value
      .map((p: Producto) => p.categoria)
      .filter((cat: string | undefined): cat is string => !!cat);
    return [...new Set(categorias)];
  }

  private saveToLocalStorage(productos: Producto[]): void {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.setItem('inventario', JSON.stringify(productos));
    }
  }
}