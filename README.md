# Casa de Música - Sistema de Gestión

## Descripción

Sistema web completo para la gestión de una casa de música que incluye:

- **Tienda en línea** para clientes
- **Panel administrativo** para empleados
- **Sistema de inventario**
- **Punto de venta (POS)**
- **Reportes y estadísticas**
- **Gestión de usuarios con roles**

## Características Principales

### 🛍️ Tienda Pública

- Catálogo de productos
- Carrito de compras
- Sistema de ofertas
- Páginas informativas (ayuda, contacto)
- Perfil de usuario

### 👨‍💼 Panel Administrativo

- **Dashboard** con métricas importantes
- **Inventario** completo con CRUD de productos
- **Punto de Venta** para procesar ventas
- **Reportes** detallados con exportación
- **Gestión de usuarios** por roles

### 🔐 Sistema de Autenticación

- Roles diferenciados:
  - **Cliente**: Acceso a la tienda
  - **Vendedor**: Acceso al POS
  - **Inventario**: Gestión de productos
  - **Administrador**: Acceso completo

### 🛡️ Seguridad

- Guards de ruta por roles
- Validación de permisos
- Persistencia segura en localStorage
- Manejo de errores centralizado

## Tecnologías Utilizadas

- **Angular 20**: Framework principal
- **TypeScript**: Lenguaje de programación
- **RxJS**: Programación reactiva
- **CSS3**: Estilos personalizados (sin Bootstrap)
- **Express**: Servidor SSR
- **Railway**: Plataforma de deployment

## Instalación y Uso

### Prerrequisitos

- Node.js 18 o superior
- npm o yarn

### Instalación Local

```bash
# Clonar el repositorio
git clone [URL_DEL_REPOSITORIO]
cd SitioCasaMusica_Version2-main

# Instalar dependencias
npm install

# Iniciar en modo desarrollo
ng serve

# Construir para producción
npm run build

# Iniciar servidor de producción
npm start
```

### Usuarios de Prueba

**Empleados:**

- Usuario: `admin` - Rol: Administrador (acceso completo)
- Usuario: `vendedor` - Rol: Vendedor (POS)
- Usuario: `inventario` - Rol: Inventario (gestión de productos)

**Clientes:**

- Cualquier nombre como tipo "Cliente"

## Estructura del Proyecto

```
src/
├── app/
│   ├── admin/              # Módulo administrativo
│   │   ├── dashboard/      # Panel principal
│   │   ├── inventario/     # Gestión de inventario
│   │   ├── punto-de-venta/ # Sistema POS
│   │   ├── reportes/       # Reportes y estadísticas
│   │   └── gestion-usuarios/ # Administración de usuarios
│   ├── public/             # Módulo público (tienda)
│   │   ├── inicio/         # Página principal
│   │   ├── catalogo/       # Catálogo de productos
│   │   ├── carrito/        # Carrito de compras
│   │   └── login/          # Autenticación
│   ├── services/           # Servicios compartidos
│   ├── guards/             # Guards de autenticación
│   └── models/             # Interfaces y tipos
```

## Funcionalidades Implementadas

### ✅ Completadas

- [x] Sistema de autenticación con roles
- [x] Guards de rutas por permisos
- [x] CRUD completo de inventario
- [x] Carrito de compras funcional
- [x] Sistema POS con control de stock
- [x] Reportes con exportación CSV
- [x] Persistencia en localStorage
- [x] Responsive design
- [x] Navegación completa
- [x] Validaciones de formularios
- [x] Manejo de errores

### 🔄 Para Futuras Mejoras

- [ ] Base de datos real (PostgreSQL/MongoDB)
- [ ] API REST backend
- [ ] Sistema de pagos
- [ ] Notificaciones push
- [ ] Chat de soporte
- [ ] Sistema de reviews
- [ ] Integración con APIs externas

## Deployment

### Railway

1. Conectar repositorio a Railway
2. El archivo `railway.json` y `Dockerfile` están configurados
3. Las variables de entorno se configuran automáticamente

### Variables de Entorno

```
NODE_ENV=production
PORT=3000
```

## Comandos de Desarrollo

```bash
# Servidor de desarrollo
ng serve

# Construir aplicación
ng build

# Ejecutar tests
ng test

# Servidor de producción
npm start
```

## Seguridad y Mejores Prácticas

- ✅ Tipado estricto con TypeScript
- ✅ Guards de ruta implementados
- ✅ Validación de permisos por rol
- ✅ Manejo centralizado de errores
- ✅ Código modular y reutilizable
- ✅ Responsive design sin frameworks externos

## Contribución

Este proyecto fue desarrollado como parte de la materia de Seguridad Informática, implementando:

- Autenticación y autorización
- Validación de datos
- Control de acceso por roles
- Buenas prácticas de seguridad web

## Licencia

Proyecto académico - Casa de Música Sistema de Gestión

---

**Desarrollado con 💻 y ☕ para la materia de Seguridad Informática**
