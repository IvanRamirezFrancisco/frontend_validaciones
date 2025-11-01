import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VentasService } from '../../services/ventas.service';
import { InventarioService } from '../inventario.service';
import { EstadisticaVenta, Producto } from '../../models/index';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule // <-- 2. AÑADIR FORMSMODULE
  ],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css'
})
export class Reportes implements OnInit {

  private ventasService = inject(VentasService);
  private inventarioService = inject(InventarioService);

  public reporteActivo: 'ventas' | 'inventario' | 'productos-mas-vendidos' = 'ventas';
  public fechaDesde: string = '';
  public fechaHasta: string = '';

  // Datos para reportes
  public estadisticasVentas: EstadisticaVenta[] = [];
  public productosInventario: Producto[] = [];
  public productosMasVendidos: { sku: string; producto: string; cantidadVendida: number }[] = [];
  public productosBajoStock: Producto[] = [];

  // Resumen general
  public resumenGeneral = {
    ventasTotales: 0,
    ingresosTotales: 0,
    productosEnStock: 0,
    productosAgotados: 0
  };

  ngOnInit(): void {
    this.establecerFechasPorDefecto();
    this.cargarDatosIniciales();
  }

  seleccionarReporte(tipo: 'ventas' | 'inventario' | 'productos-mas-vendidos'): void {
    this.reporteActivo = tipo;
    this.actualizarReporte();
  }

  generarReporte(): void {
    if (!this.fechaDesde || !this.fechaHasta) {
      alert('Por favor seleccione un rango de fechas válido');
      return;
    }

    const fechaInicio = new Date(this.fechaDesde);
    const fechaFin = new Date(this.fechaHasta);

    if (fechaInicio > fechaFin) {
      alert('La fecha de inicio no puede ser mayor que la fecha final');
      return;
    }

    this.actualizarReporte();
    alert(`Reporte generado: ${this.reporteActivo} del ${this.fechaDesde} al ${this.fechaHasta}`);
  }

  exportarReporte(): void {
    const datos = this.obtenerDatosParaExportar();
    const csvContent = this.convertirACSV(datos);
    this.descargarCSV(csvContent, `reporte-${this.reporteActivo}-${new Date().toISOString().split('T')[0]}.csv`);
  }

  private establecerFechasPorDefecto(): void {
    const hoy = new Date();
    const hace30Dias = new Date();
    hace30Dias.setDate(hoy.getDate() - 30);

    this.fechaHasta = hoy.toISOString().split('T')[0];
    this.fechaDesde = hace30Dias.toISOString().split('T')[0];
  }

  private cargarDatosIniciales(): void {
    this.estadisticasVentas = this.ventasService.obtenerEstadisticasDiarias();
    this.productosInventario = this.inventarioService.getInventarioArray();
    this.productosMasVendidos = this.ventasService.obtenerProductosMasVendidos();
    this.productosBajoStock = this.inventarioService.getProductosBajoStock();

    this.calcularResumenGeneral();
  }

  private actualizarReporte(): void {
    const fechaInicio = new Date(this.fechaDesde);
    const fechaFin = new Date(this.fechaHasta);

    switch (this.reporteActivo) {
      case 'ventas':
        const ventasPeriodo = this.ventasService.obtenerVentasPorFecha(fechaInicio, fechaFin);
        this.estadisticasVentas = this.procesarVentasParaEstadisticas(ventasPeriodo);
        break;
      case 'inventario':
        this.productosInventario = this.inventarioService.getInventarioArray();
        this.productosBajoStock = this.inventarioService.getProductosBajoStock();
        break;
      case 'productos-mas-vendidos':
        this.productosMasVendidos = this.ventasService.obtenerProductosMasVendidos();
        break;
    }
  }

  private procesarVentasParaEstadisticas(ventas: any[]): EstadisticaVenta[] {
    const estadisticasPorDia = new Map<string, EstadisticaVenta>();

    ventas.forEach(venta => {
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
      estadistica.productosVendidos += venta.items.reduce((total: number, item: any) => total + item.cantidad, 0);
      estadistica.ingresoTotal += venta.total;
    });

    return Array.from(estadisticasPorDia.values());
  }

  private calcularResumenGeneral(): void {
    this.resumenGeneral.ventasTotales = this.ventasService.obtenerVentas().length;
    this.resumenGeneral.ingresosTotales = this.ventasService.obtenerIngresosTotales();
    this.resumenGeneral.productosEnStock = this.productosInventario.filter(p => p.stock > 0).length;
    this.resumenGeneral.productosAgotados = this.productosInventario.filter(p => p.stock === 0).length;
  }

  private obtenerDatosParaExportar(): any[] {
    switch (this.reporteActivo) {
      case 'ventas':
        return this.estadisticasVentas;
      case 'inventario':
        return this.productosInventario;
      case 'productos-mas-vendidos':
        return this.productosMasVendidos;
      default:
        return [];
    }
  }

  private convertirACSV(datos: any[]): string {
    if (datos.length === 0) return '';

    const headers = Object.keys(datos[0]);
    const csvRows = [];

    // Agregar encabezados
    csvRows.push(headers.join(','));

    // Agregar datos
    for (const row of datos) {
      const values = headers.map(header => {
        const value = row[header];
        return typeof value === 'string' ? `"${value}"` : value;
      });
      csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
  }

  private descargarCSV(csvContent: string, filename: string): void {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}