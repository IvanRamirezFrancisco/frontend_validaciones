// Archivo: src/app/services/ventas.service.ts
// Servicio para manejar las ventas y reportes

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Venta, ProductoCarrito, EstadisticaVenta } from '../models/index';

@Injectable({
  providedIn: 'root'
})
export class VentasService {
  private ventas: Venta[] = [];
  private ventasSubject = new BehaviorSubject<Venta[]>([]);
  public ventas$: Observable<Venta[]> = this.ventasSubject.asObservable();

  constructor() {
    // Cargar ventas desde localStorage (solo en el navegador)
    if (typeof window !== 'undefined' && localStorage) {
      const savedVentas = localStorage.getItem('ventas');
      if (savedVentas) {
        this.ventas = JSON.parse(savedVentas);
        this.ventasSubject.next(this.ventas);
      }
    }
  }

  registrarVenta(items: ProductoCarrito[], vendedor: string, cliente?: string): Venta {
    const subtotal = items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    const iva = subtotal * 0.16;
    const total = subtotal + iva;

    const nuevaVenta: Venta = {
      id: this.generarIdVenta(),
      fecha: new Date(),
      items: [...items],
      subtotal,
      iva,
      total,
      vendedor,
      cliente
    };

    this.ventas.push(nuevaVenta);
    this.actualizarVentas();
    
    return nuevaVenta;
  }

  obtenerVentas(): Venta[] {
    return [...this.ventas];
  }

  obtenerVentasPorFecha(fechaInicio: Date, fechaFin: Date): Venta[] {
    return this.ventas.filter(venta => {
      const fechaVenta = new Date(venta.fecha);
      return fechaVenta >= fechaInicio && fechaVenta <= fechaFin;
    });
  }

  obtenerVentasPorVendedor(vendedor: string): Venta[] {
    return this.ventas.filter(venta => venta.vendedor === vendedor);
  }

  obtenerEstadisticasDiarias(): EstadisticaVenta[] {
    const estadisticasPorDia = new Map<string, EstadisticaVenta>();

    this.ventas.forEach(venta => {
      const fecha = new Date(venta.fecha).toDateString();
      
      if (!estadisticasPorDia.has(fecha)) {
        estadisticasPorDia.set(fecha, {
          periodo: fecha,
          ventasTotales: 0,
          productosVendidos: 0,
          ingresoTotal: 0
        });
      }

      const estadistica = estadisticasPorDia.get(fecha)!;
      estadistica.ventasTotales += 1;
      estadistica.productosVendidos += venta.items.reduce((total, item) => total + item.cantidad, 0);
      estadistica.ingresoTotal += venta.total;
    });

    return Array.from(estadisticasPorDia.values());
  }

  obtenerEstadisticasMensuales(): EstadisticaVenta[] {
    const estadisticasPorMes = new Map<string, EstadisticaVenta>();

    this.ventas.forEach(venta => {
      const fecha = new Date(venta.fecha);
      const mesAno = `${fecha.getFullYear()}-${fecha.getMonth() + 1}`;
      
      if (!estadisticasPorMes.has(mesAno)) {
        estadisticasPorMes.set(mesAno, {
          periodo: mesAno,
          ventasTotales: 0,
          productosVendidos: 0,
          ingresoTotal: 0
        });
      }

      const estadistica = estadisticasPorMes.get(mesAno)!;
      estadistica.ventasTotales += 1;
      estadistica.productosVendidos += venta.items.reduce((total, item) => total + item.cantidad, 0);
      estadistica.ingresoTotal += venta.total;
    });

    return Array.from(estadisticasPorMes.values());
  }

  obtenerProductosMasVendidos(limite: number = 10): { sku: string; producto: string; cantidadVendida: number }[] {
    const ventasPorProducto = new Map<string, { sku: string; producto: string; cantidadVendida: number }>();

    this.ventas.forEach(venta => {
      venta.items.forEach(item => {
        if (!ventasPorProducto.has(item.sku)) {
          ventasPorProducto.set(item.sku, {
            sku: item.sku,
            producto: item.producto,
            cantidadVendida: 0
          });
        }
        ventasPorProducto.get(item.sku)!.cantidadVendida += item.cantidad;
      });
    });

    return Array.from(ventasPorProducto.values())
      .sort((a, b) => b.cantidadVendida - a.cantidadVendida)
      .slice(0, limite);
  }

  obtenerIngresosTotales(): number {
    return this.ventas.reduce((total, venta) => total + venta.total, 0);
  }

  obtenerIngresosPorPeriodo(fechaInicio: Date, fechaFin: Date): number {
    return this.obtenerVentasPorFecha(fechaInicio, fechaFin)
      .reduce((total, venta) => total + venta.total, 0);
  }

  private generarIdVenta(): string {
    const fecha = new Date();
    const timestamp = fecha.getTime();
    const random = Math.floor(Math.random() * 1000);
    return `VTA-${timestamp}-${random}`;
  }

  private actualizarVentas(): void {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.setItem('ventas', JSON.stringify(this.ventas));
    }
    this.ventasSubject.next([...this.ventas]);
  }
}