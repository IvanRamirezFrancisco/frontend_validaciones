import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// CORRECCIÓN: Quitamos "Component" del nombre de la clase
import { LayoutAdmin } from './layout-admin/layout-admin'; 
import { Dashboard } from './dashboard/dashboard';

const routes: Routes = [
  {
    path: '', 
    component: LayoutAdmin, // <-- CORREGIDO
    children: [
      { path: 'dashboard', component: Dashboard }, // <-- CORREGIDO
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
