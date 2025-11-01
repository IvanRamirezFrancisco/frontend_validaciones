import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router'; // Importar Router y ActivatedRoute
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { InventarioService } from '../inventario.service'; // Importar el servicio

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [
    CommonModule,    
    RouterModule,
    FormsModule // <-- Asegurarse de que esté importado
  ],
  templateUrl: './producto-form.html',
  styleUrl: './producto-form.css'
})
export class ProductoForm implements OnInit { // <-- Implementamos OnInit
  
  // Inyectamos los servicios necesarios
  private inventarioService = inject(InventarioService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Variables de estado
  public isEditMode = false;
  public currentSku: string | null = null;
  
  // Este objeto guardará los datos del formulario
  public productoForm = {
    sku: '',
    producto: '',
    stock: 0,
    precio: 0
  };

  ngOnInit(): void {
    // 1. Al cargar, leemos el 'sku' de la URL
    this.currentSku = this.route.snapshot.paramMap.get('sku');

    if (this.currentSku) {
      // 2. Si HAY un SKU (Modo Edición)
      this.isEditMode = true;
      const productoExistente = this.inventarioService.getProductoPorSku(this.currentSku);
      if (productoExistente) {
        // Hacemos una copia para evitar mutaciones
        this.productoForm = { ...productoExistente }; 
      }
    }
    // 3. Si NO hay SKU (Modo Añadir), 'productoForm' se queda vacío
  }

  // 4. Función que se llama al guardar
  onSubmit() {
    if (this.isEditMode && this.currentSku) {
      // MODO EDICIÓN
      this.inventarioService.updateProduct(this.currentSku, this.productoForm);
    } else {
      // MODO AÑADIR
      this.inventarioService.addProduct(this.productoForm);
    }
    
    // 5. Regresamos a la lista
    this.router.navigate(['/admin/inventario']);
  }

  // 6. Función para el botón "Cancelar"
  cancelar() {
    this.router.navigate(['/admin/inventario']);
  }
}