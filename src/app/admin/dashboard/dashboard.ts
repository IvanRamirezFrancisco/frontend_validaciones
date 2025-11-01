import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router'; 

// --- ★★ RUTA CORREGIDA ★★ ---
// La ruta correcta es '../inventario' (sube un nivel, al folder 'admin')
import { InventarioService } from '../inventario.service'; 


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule  
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit { 

  // Inyectamos el servicio
  private inventarioService = inject(InventarioService);

  // Variables para los datos
  public productosBajoStock: any[] = [];
  public pedidosRecientes: any[] = [];
  public datosGrafico: any[] = [];

  ngOnInit(): void {
    // 1. Cargamos los productos con bajo stock (usamos el servicio)
    //    Simulamos que "bajo stock" es 10 o menos
    this.productosBajoStock = this.inventarioService.getInventarioArray() // <-- ARREGLADO
    .filter(p => p.stock <= 10)
      .slice(0, 5); // Mostramos solo los primeros 5

    // 2. Simulamos los pedidos recientes
    this.pedidosRecientes = [
      { id: '001', cliente: 'Brayan Lara', total: 4200.00, estado: 'Pagado' },
      { id: '002', cliente: 'Ivan Ramírez', total: 850.00, estado: 'Pagado' },
      { id: '003', cliente: 'Cliente X', total: 3500.00, estado: 'Enviado' },
    ];

    // 3. Simulamos los datos del gráfico (ventas de 7 días)
    this.datosGrafico = [
      { dia: 'Lun', venta: 1200 },
      { dia: 'Mar', venta: 1500 },
      { dia: 'Mié', venta: 800 },
      { dia: 'Jue', venta: 2100 },
      { dia: 'Vie', venta: 1750 },
      { dia: 'Sáb', venta: 3000 },
      { dia: 'Dom', venta: 1250 }, // La venta de "hoy"
    ];
  }

  // Ayuda para calcular la altura de la barra del gráfico
  getBarHeight(venta: number) {
    // (3000 es la venta máxima simulada)
    return (venta / 3000) * 100 + '%';
  }
}