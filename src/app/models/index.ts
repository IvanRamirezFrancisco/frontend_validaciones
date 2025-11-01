// Archivo: src/app/models/index.ts
// Definición de interfaces y tipos para el proyecto

export interface Producto {
  sku: string;
  producto: string;
  stock: number;
  precio: number;
  categoria?: string;
  descripcion?: string;
  imagen?: string;
}

export interface ProductoCarrito extends Producto {
  cantidad: number;
}

export interface Usuario {
  id?: number;
  nombre: string;
  email?: string;
  rol: UserRole;
  activo?: boolean;
  fechaCreacion?: Date;
}

export type UserRole = 'Cliente' | 'Administrador' | 'Vendedor' | 'Inventario' | null;

export interface Venta {
  id: string;
  fecha: Date;
  items: ProductoCarrito[];
  subtotal: number;
  iva: number;
  total: number;
  vendedor: string;
  cliente?: string;
}

export interface EstadisticaVenta {
  periodo: string;
  ventasTotales: number;
  productosVendidos: number;
  ingresoTotal: number;
}

export interface LoginRequest {
  nombre: string;
  contrasena?: string;
  tipo: 'Cliente' | 'Empleado';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}