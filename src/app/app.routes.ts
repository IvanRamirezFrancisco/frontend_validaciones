import { Routes } from '@angular/router';

// Guards
import { authGuard, adminGuard, roleGuard } from './guards/auth.guard';

// Imports de Admin
import { LayoutAdmin } from './admin/layout-admin/layout-admin';
import { Dashboard } from './admin/dashboard/dashboard';
import { Inventario } from './admin/inventario/inventario';
import { ProductoForm } from './admin/producto-form/producto-form';
import { Reportes } from './admin/reportes/reportes';
import { PuntoDeVenta } from './admin/punto-de-venta/punto-de-venta';
import { GestionUsuarios } from './admin/gestion-usuarios/gestion-usuarios';

// Imports de la Tienda
import { LayoutCliente } from './public/layout-cliente/layout-cliente';
import { Catalogo } from './public/catalogo/catalogo';
import { ProductoDetalle } from './public/producto-detalle/producto-detalle';
import { Carrito } from './public/carrito/carrito';
import { Inicio } from './public/inicio/inicio';
import { Ayuda } from './public/ayuda/ayuda';
import { Contacto } from './public/contacto/contacto';
import { Login } from './public/login/login';
import { Registro } from './public/registro/registro';
import { Perfil } from './public/perfil/perfil';
import { Ofertas } from './public/ofertas/ofertas';


export const routes: Routes = [

  // --- 1. RUTAS PÚBLICAS (TIENDA) ---
  {
    path: '', 
    component: LayoutCliente, // Cascarón de la Tienda
    children: [
      { path: '', component: Inicio }, // La página de inicio
      { path: 'catalogo', component: Catalogo },
      { path: 'ofertas', component: Ofertas },
      { path: 'producto/:sku', component: ProductoDetalle },
      { path: 'carrito', component: Carrito },
      { path: 'ayuda', component: Ayuda },
      { path: 'contacto', component: Contacto },
      { path: 'login', component: Login },
      { path: 'registro', component: Registro },
      { 
        path: 'perfil', 
        component: Perfil,
        canActivate: [authGuard]
      }
    ]
  },

  // --- 2. RUTAS PRIVADAS (ADMIN) ---
  {
    path: 'admin',
    component: LayoutAdmin,
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },
      { 
        path: 'inventario', 
        component: Inventario,
        canActivate: [roleGuard(['Administrador', 'Inventario'])]
      },
      { 
        path: 'inventario/nuevo', 
        component: ProductoForm,
        canActivate: [roleGuard(['Administrador', 'Inventario'])]
      },
      { 
        path: 'inventario/editar/:sku', 
        component: ProductoForm,
        canActivate: [roleGuard(['Administrador', 'Inventario'])]
      },
      { 
        path: 'reportes', 
        component: Reportes,
        canActivate: [roleGuard(['Administrador'])]
      },
      { 
        path: 'punto-de-venta', 
        component: PuntoDeVenta,
        canActivate: [roleGuard(['Administrador', 'Vendedor'])]
      },
      { 
        path: 'usuarios', 
        component: GestionUsuarios,
        canActivate: [roleGuard(['Administrador'])]
      }
    ]
  },
];