import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router'; 
import { InventarioService } from '../../admin/inventario.service';

// 1. IMPORTA EL SERVICIO DE CARRITO
import { CarritoService } from '../../services/carrito'; 


@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [ CommonModule, RouterModule ],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css'
})
export class Catalogo {

  public productos: any[] = [];
  private inventarioService = inject(InventarioService);

  // 2. INYECTA EL SERVICIO DE CARRITO
  private carritoService = inject(CarritoService); 

  public isFilterOpen: boolean = false;

  // --- ★★ NUEVA LÓGICA PARA FILTROS "MERCADO LIBRE" ★★ ---
  public filterState: any = {
    categoria: true, // Inicia abierto
    marca: true,     // Inicia abierto
    precio: false    // Inicia cerrado
  };

  constructor() {
    // DESPUÉS (Correcto):
this.productos = this.inventarioService.getInventarioArray(); // <-- ARREGLADO
  }
  

  // 3. CREA LA FUNCIÓN PARA AÑADIR AL CARRITO
  //    (Recibe el producto como parámetro)
  agregarAlCarrito(producto: any) {
    this.carritoService.agregarAlCarrito(producto);
    alert('¡Producto añadido!'); // (Alerta temporal)
  }

  // --- NUEVO: Función para abrir/cerrar el filtro ---
  toggleFilter(status: boolean): void {
    this.isFilterOpen = status;
  }

  toggleFilterGroup(group: string) {
    this.filterState[group] = !this.filterState[group];
  }


}