import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router'; 
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { InventarioService } from '../../admin/inventario.service'; 
import { CarritoService } from '../../services/carrito'; 


@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule 
  ],
  templateUrl: './producto-detalle.html',
  styleUrl: './producto-detalle.css'
})
export class ProductoDetalle implements OnInit {
  
  private route = inject(ActivatedRoute);
  private inventarioService = inject(InventarioService);
  private carritoService = inject(CarritoService); 

  public producto: any | undefined;
  public relatedProducts: any[] = []; 
  public quantity: number = 1; 

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const sku = params.get('sku');
      
      if (sku) {
        this.producto = this.inventarioService.getProductoPorSku(sku);
        this.quantity = 1; 
      }
      
      // DESPUÉS (Correcto):
this.relatedProducts = this.inventarioService.getInventarioArray().filter(p => p.sku !== sku); // <-- ARREGLADO
    });
  }

  increment() {
    this.quantity++;
  }

  decrement() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  // --- ★★ ESTA LLAMA CON 2 ARGUMENTOS ★★ ---
  addToCart() {
    if (this.producto) {
      this.carritoService.agregarAlCarrito(this.producto, this.quantity);
      alert(`${this.quantity} ${this.producto.producto} añadido(s) al carrito!`);
    }
  }

  // --- ★★ ESTA LLAMA CON 1 ARGUMENTO (USA EL DEFAULT) ★★ ---
  agregarSimilarAlCarrito(producto: any) {
    this.carritoService.agregarAlCarrito(producto); 
    alert(`${producto.producto} añadido al carrito!`);
  }
}