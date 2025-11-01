import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Rutas estáticas para prerendering
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'catalogo',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'ofertas',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'ayuda',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'contacto',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'login',
    renderMode: RenderMode.Prerender
  },
  // Rutas con parámetros usan SSR dinámico
  {
    path: 'producto/:sku',
    renderMode: RenderMode.Server
  },
  {
    path: 'admin/**',
    renderMode: RenderMode.Server
  },
  {
    path: 'carrito',
    renderMode: RenderMode.Server
  },
  {
    path: 'perfil',
    renderMode: RenderMode.Server
  },
  // Fallback para otras rutas
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];
