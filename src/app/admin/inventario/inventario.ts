import { Component, inject, OnInit } from '@angular/core'; 
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { InventarioService } from '../inventario.service'; 

// --- ★★ ¡AQUÍ ESTÁ LA LÍNEA QUE FALTABA! ★★ ---
import { Observable, map } from 'rxjs'; 

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule 
  ],
  templateUrl: './inventario.html',
  styleUrl: './inventario.css'
})
export class Inventario implements OnInit { 

  private inventarioService = inject(InventarioService);
  
  public filtroNombre: string = ''; 
  
  // --- ★★ AQUÍ ESTÁ EL ARREGLO (AÑADE '!') ★★ ---
  public productos$!: Observable<any[]>; 
  public productosFiltrados$!: Observable<any[]>; 
  public kpis$!: Observable<any>;
  ngOnInit(): void {
    this.productos$ = this.inventarioService.getInventario(); 

    // Esta línea ahora funcionará porque importamos 'map'
    this.kpis$ = this.productos$.pipe(
      map(productos => {
        const totalProductos = productos.length;
        const valorInventario = productos.reduce((sum, p) => sum + (p.precio * p.stock), 0);
        const itemsBajoStock = productos.filter(p => p.stock <= 5).length;
        return { totalProductos, valorInventario, itemsBajoStock };
      })
    );
    this.filtrarProductos();
  }

  filtrarProductos() {
    this.productosFiltrados$ = this.productos$.pipe(
      map(productos => 
        productos.filter(p => 
          p.producto.toLowerCase().includes(this.filtroNombre.toLowerCase()) ||
          p.sku.toLowerCase().includes(this.filtroNombre.toLowerCase())
        )
      )
    );
  }

  eliminarProducto(sku: string) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      this.inventarioService.deleteProduct(sku);
    }
  }

  getStockStatus(stock: number): string {
    if (stock <= 5) return 'bajo';
    if (stock <= 15) return 'medio';
    return 'alto';
  }
}