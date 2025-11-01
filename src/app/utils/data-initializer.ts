// Archivo: src/app/utils/data-initializer.ts
// Inicializa datos de prueba en localStorage si no existen

import { Producto, Usuario, Venta } from '../models/index';

export class DataInitializer {
  
  static initializeIfEmpty(): void {
    // Solo ejecutar en el navegador, no en SSR
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      this.initializeInventory();
      this.initializeUsers();
      this.initializeSampleSales();
    }
  }

  private static initializeInventory(): void {
    if (typeof localStorage === 'undefined') return;
    
    const existingInventory = localStorage.getItem('inventario');
    if (!existingInventory) {
      const productos: Producto[] = [
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
        },
        {
          sku: 'BAS-FJ4',
          producto: 'Bajo Fender Jazz Bass',
          stock: 4,
          precio: 18000.00,
          categoria: 'Bajos',
          descripcion: 'Bajo eléctrico de 4 cuerdas con sonido versátil.'
        },
        {
          sku: 'AMP-MR50',
          producto: 'Amplificador Marshall MG50CFX',
          stock: 6,
          precio: 8500.00,
          categoria: 'Amplificadores',
          descripcion: 'Amplificador combo con efectos digitales integrados.'
        },
        {
          sku: 'MIC-SM58',
          producto: 'Micrófono Shure SM58',
          stock: 12,
          precio: 2800.00,
          categoria: 'Audio',
          descripcion: 'Micrófono dinámico profesional para voces.'
        },
        {
          sku: 'VIO-STU',
          producto: 'Violín Stradivarius Estudiante',
          stock: 7,
          precio: 4500.00,
          categoria: 'Cuerdas',
          descripcion: 'Violín ideal para estudiantes con arco y estuche incluidos.'
        },
        {
          sku: 'SAX-YTS26',
          producto: 'Saxofón Tenor Yamaha YTS-26',
          stock: 2,
          precio: 35000.00,
          categoria: 'Vientos',
          descripcion: 'Saxofón tenor profesional con excelente proyección de sonido.'
        }
      ];

      localStorage.setItem('inventario', JSON.stringify(productos));
      console.log('Inventario inicializado con productos de ejemplo');
    }
  }

  private static initializeUsers(): void {
    // No inicializamos usuarios adicionales ya que están definidos en el AuthService
    console.log('Usuarios del sistema ya están definidos en AuthService');
  }

  private static initializeSampleSales(): void {
    if (typeof localStorage === 'undefined') return;
    
    const existingSales = localStorage.getItem('ventas');
    if (!existingSales) {
      const sampleSales: Venta[] = [
        {
          id: 'VTA-' + Date.now() + '-001',
          fecha: new Date(Date.now() - 86400000), // Ayer
          items: [
            {
              sku: 'HOH-SP20',
              producto: 'Armónica Hohner Special 20',
              stock: 15,
              precio: 850.00,
              categoria: 'Vientos',
              descripcion: 'Armónica diatónica de 10 celdas, ideal para blues y folk.',
              cantidad: 2
            }
          ],
          subtotal: 1700.00,
          iva: 272.00,
          total: 1972.00,
          vendedor: 'vendedor',
          cliente: 'Juan Pérez'
        },
        {
          id: 'VTA-' + Date.now() + '-002',
          fecha: new Date(Date.now() - 172800000), // Hace 2 días
          items: [
            {
              sku: 'FEN-FA125',
              producto: 'Guitarra Acústica Fender FA-125',
              stock: 8,
              precio: 3500.00,
              categoria: 'Guitarras',
              descripcion: 'Guitarra acústica de calidad profesional con excelente sonido y acabado.',
              cantidad: 1
            },
            {
              sku: 'AMP-MR50',
              producto: 'Amplificador Marshall MG50CFX',
              stock: 6,
              precio: 8500.00,
              categoria: 'Amplificadores',
              descripcion: 'Amplificador combo con efectos digitales integrados.',
              cantidad: 1
            }
          ],
          subtotal: 12000.00,
          iva: 1920.00,
          total: 13920.00,
          vendedor: 'admin'
        }
      ];

      localStorage.setItem('ventas', JSON.stringify(sampleSales));
      console.log('Ventas de ejemplo inicializadas');
    }
  }

  static clearAllData(): void {
    if (typeof localStorage === 'undefined') return;
    
    localStorage.removeItem('inventario');
    localStorage.removeItem('ventas');
    localStorage.removeItem('carrito');
    localStorage.removeItem('currentUser');
    console.log('Todos los datos han sido limpiados');
  }

  static resetToDefaults(): void {
    this.clearAllData();
    this.initializeIfEmpty();
    console.log('Datos restablecidos a valores por defecto');
  }
}