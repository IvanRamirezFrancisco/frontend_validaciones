import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Importa tu archivo de rutas
import { AdminRoutingModule } from './admin-routing-module'; 

@NgModule({
  declarations: [
    // BORRA 'LayoutAdmin' Y 'Dashboard' DE AQUÍ
  ],
  imports: [
    CommonModule,
    AdminRoutingModule 
  ]
})
export class AdminModule { }