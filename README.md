# Casa de Música Castillo - Sistema de Gestión (Versión de Prueba)

## 🏢 Acerca de la Empresa

**Casa de Música Castillo** es una empresa especializada en la venta de instrumentos musicales ubicada en Huejutla de Reyes, Hidalgo. Con más de 30 años de tradición en la Huasteca, se dedica a proveer a músicos de todos los niveles con los mejores instrumentos y accesorios musicales.

### Productos que manejamos:

- 🎸 Guitarras acústicas y eléctricas
- 🎹 Pianos y teclados
- 🥁 Baterías y percusión
- 🎺 Instrumentos de viento
- 🎵 Audio profesional y accesorios
- 🔧 Refacciones y mantenimiento

## ⚠️ VERSIÓN DE PRUEBA

**IMPORTANTE:** Esta es una versión de prueba desarrollada exclusivamente para fines académicos y demostración al docente.

### Limitaciones actuales:

- ❌ **No incluye base de datos real** - Los datos se almacenan temporalmente en localStorage
- ❌ **Sin backend real** - Simulación de servicios con datos mock
- ❌ **Sin pasarela de pagos** - Solo interfaz de demostración
- ❌ **Sin persistencia real** - Los datos se pierden al limpiar el navegador

### Propósito de esta versión:

✅ **Demostrar validaciones de seguridad implementadas**  
✅ **Mostrar la arquitectura y estructura del sistema**  
✅ **Presentar el diseño de interfaces de usuario**  
✅ **Validar flujos de autenticación y autorización**  
✅ **Probar funcionalidades principales del frontend**

## � Versiones Futuras

En posteriores iteraciones se implementarán:

### 📊 Base de Datos Real

- **MySQL** como sistema de gestión de base de datos
- Modelos relacionales para productos, usuarios, ventas
- Respaldos automáticos y recuperación de datos

### � API Backend Completa

- **Spring Boot** para servicios REST
- Autenticación JWT robusta
- Encriptación de contraseñas con bcrypt
- Validaciones del lado del servidor

### 💳 Sistema de Pagos

- Integración con PayPal, Stripe, OXXO Pay
- Manejo seguro de transacciones
- Facturación electrónica (CFDI)

### 📱 Funcionalidades Avanzadas

- Notificaciones push
- Sistema de inventario en tiempo real
- Reportes avanzados con gráficos
- App móvil complementaria

## 🔐 Sistema de Autenticación y Seguridad

### Roles Implementados:

- **👤 Cliente**: Acceso a catálogo, carrito, perfil
- **🛒 Vendedor**: Acceso al punto de venta (POS)
- **📦 Inventario**: Gestión de productos y stock
- **👑 Administrador**: Acceso completo al sistema

### Características de Seguridad:

- ✅ **Route Guards** - Protección de rutas por roles
- ✅ **Validaciones de formularios** - Frontend con Angular Reactive Forms
- ✅ **Control de sesiones** - Manejo seguro de autenticación
- ✅ **Validación de permisos** - Verificación de acceso por componente
- ✅ **Sanitización de datos** - Prevención de inyección XSS
- ✅ **Interceptores de error** - Manejo centralizado de errores
- ✅ **Bloqueo temporal** - Protección contra ataques de fuerza bruta

## 💻 Tecnologías Utilizadas

### Frontend

- **Angular 20.3** - Framework principal
- **TypeScript 5.9** - Lenguaje de programación tipado
- **RxJS 7.8** - Programación reactiva y manejo de estado
- **CSS3 puro** - Estilos personalizados sin dependencias externas
- **Angular SSR** - Renderizado del lado del servidor

### Herramientas de Desarrollo

- **Angular CLI 20.3** - Herramientas de construcción
- **Express 5.1** - Servidor para SSR
- **Karma + Jasmine** - Testing framework
- **TypeScript Compiler** - Transpilación y verificación de tipos

## 🛠️ Instalación y Configuración

### Prerrequisitos

- **Node.js 18+** - Entorno de ejecución JavaScript
- **npm 9+** - Gestor de paquetes (incluido con Node.js)
- **Angular CLI 20+** - Herramientas de línea de comandos

### Instalación Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/IvanRamirezFrancisco/frontend_validaciones.git
cd CASAMUSICA_frontend

# 2. Instalar dependencias
npm install

# 3. Instalar Angular CLI globalmente (si no lo tienes)
npm install -g @angular/cli@20.3.7

# 4. Iniciar servidor de desarrollo
ng serve

# 5. Abrir en navegador
# http://localhost:4200
```

### Comandos Disponibles

```bash
# Desarrollo
ng serve                    # Servidor de desarrollo (puerto 4200)
ng build                    # Construcción para desarrollo
ng test                     # Ejecutar pruebas unitarias

# Producción
npm run build:prod          # Construcción optimizada para producción
npm start                   # Servidor de producción con SSR
npm run serve:ssr           # Servidor SSR local
```

### 👥 Usuarios de Prueba

Para probar el sistema, utiliza estas credenciales:

#### 🏢 Empleados (Tipo: "Empleado")

| Usuario      | Rol              | Accesos                                                  | Contraseña |
| ------------ | ---------------- | -------------------------------------------------------- | ---------- |
| `admin`      | 👑 Administrador | Completo: Dashboard, Inventario, POS, Reportes, Usuarios | Cualquiera |
| `vendedor`   | 🛒 Vendedor      | Punto de Venta únicamente                                | Cualquiera |
| `inventario` | 📦 Inventario    | Gestión de productos y stock                             | Cualquiera |

#### 👤 Clientes (Tipo: "Cliente")

- **Nombre:** Cualquier nombre completo (ej: "Juan Pérez")
- **Contraseña:** Cualquiera
- **Acceso:** Catálogo, carrito, perfil, ofertas

> **💡 Nota:** En esta versión de prueba, cualquier contraseña es válida. En la versión final se implementará autenticación real con encriptación.

## 📁 Estructura del Proyecto

```
CASAMUSICA_frontend/
├── 📂 src/
│   ├── 📂 app/
│   │   ├── 📂 admin/                    # 🏢 Módulo Administrativo
│   │   │   ├── dashboard/               # 📊 Panel principal con métricas
│   │   │   ├── inventario/              # 📦 CRUD de productos y stock
│   │   │   ├── punto-de-venta/          # 🛒 Sistema POS para ventas
│   │   │   ├── reportes/                # 📈 Reportes y estadísticas
│   │   │   ├── gestion-usuarios/        # 👥 Administración de usuarios
│   │   │   ├── layout-admin/            # 🎨 Layout administrativo
│   │   │   └── producto-form/           # ➕ Formulario de productos
│   │   │
│   │   ├── 📂 public/                   # 🌐 Módulo Público (Tienda)
│   │   │   ├── inicio/                  # 🏠 Página principal
│   │   │   ├── catalogo/                # 🎵 Catálogo de productos
│   │   │   ├── carrito/                 # 🛒 Carrito de compras
│   │   │   ├── login/                   # 🔐 Autenticación
│   │   │   ├── registro/                # 📝 Registro de usuarios
│   │   │   ├── perfil/                  # 👤 Perfil de usuario
│   │   │   ├── ofertas/                 # 🏷️ Ofertas especiales
│   │   │   ├── ayuda/                   # ❓ Centro de ayuda
│   │   │   ├── contacto/                # 📞 Información de contacto
│   │   │   ├── producto-detalle/        # 🔍 Detalles de producto
│   │   │   └── layout-cliente/          # 🎨 Layout público
│   │   │
│   │   ├── 📂 services/                 # ⚙️ Servicios Compartidos
│   │   │   ├── auth.service.ts          # 🔐 Autenticación
│   │   │   ├── carrito.service.ts       # 🛒 Gestión del carrito
│   │   │   ├── ventas.service.ts        # 💰 Procesamiento de ventas
│   │   │   └── notification.service.ts  # 🔔 Notificaciones
│   │   │
│   │   ├── 📂 guards/                   # 🛡️ Protección de Rutas
│   │   │   └── auth.guard.ts            # 🚪 Guard de autenticación
│   │   │
│   │   ├── 📂 interceptors/             # 🔄 Interceptores HTTP
│   │   │   └── error.interceptor.ts     # ❌ Manejo de errores
│   │   │
│   │   ├── 📂 models/                   # 📋 Interfaces y Tipos
│   │   │   └── index.ts                 # 🏷️ Definiciones TypeScript
│   │   │
│   │   ├── 📂 utils/                    # 🛠️ Utilidades
│   │   │   └── data-initializer.ts      # 🗃️ Inicialización de datos
│   │   │
│   │   └── 📂 validators/               # ✅ Validadores Personalizados
│   │       └── custom-validators.ts     # 🔍 Validaciones de formularios
│   │
│   ├── 📂 assets/                       # 🎨 Recursos Estáticos
│   │   └── images/                      # 🖼️ Imágenes e iconos
│   │
│   ├── 📂 public/                       # 📁 Archivos Públicos
│   │   ├── images/                      # 🖼️ Logos e imágenes
│   │   └── icons/                       # 🎯 Iconos de la aplicación
│   │
│   ├── index.html                       # 🌐 Página principal
│   ├── main.ts                          # 🚀 Punto de entrada de la app
│   ├── styles.css                       # 🎨 Estilos globales
│   └── server.ts                        # 🖥️ Servidor SSR
│
├── 📋 angular.json                      # ⚙️ Configuración de Angular
├── 📋 package.json                      # 📦 Dependencias y scripts
├── 📋 tsconfig.json                     # 🔧 Configuración de TypeScript
└── 📋 README.md                         # 📖 Documentación del proyecto
```

## ✅ Funcionalidades Implementadas (Versión Actual)

### 🔐 Sistema de Autenticación y Seguridad

- [x] **Login diferenciado** por roles (Cliente/Empleado)
- [x] **Route Guards** - Protección de rutas según permisos
- [x] **Control de sesiones** - Manejo de estado de usuario
- [x] **Validaciones de formularios** - Frontend con Angular Reactive Forms
- [x] **Bloqueo temporal** - Protección contra fuerza bruta (demo)
- [x] **Sanitización de entrada** - Validaciones personalizadas
- [x] **Interceptor de errores** - Manejo centralizado

### 🏪 Módulo Público (Tienda)

- [x] **Página de inicio** - Presentación de la empresa
- [x] **Catálogo completo** - Visualización de productos por categorías
- [x] **Carrito de compras** - Agregar, quitar, modificar cantidades
- [x] **Sistema de ofertas** - Productos destacados y promociones
- [x] **Perfil de usuario** - Gestión de datos personales
- [x] **Páginas informativas** - Ayuda, contacto, términos
- [x] **Registro de usuarios** - Formulario de registro progresivo
- [x] **Responsive design** - Adaptable a móviles y tablets

### 🏢 Módulo Administrativo

- [x] **Dashboard principal** - Métricas y estadísticas generales
- [x] **Gestión de inventario** - CRUD completo de productos
- [x] **Punto de Venta (POS)** - Sistema de ventas con control de stock
- [x] **Reportes y estadísticas** - Ventas, productos, usuarios
- [x] **Gestión de usuarios** - Administración de roles y permisos
- [x] **Control de acceso** - Diferentes niveles según rol de empleado

### 🎨 Interfaz de Usuario

- [x] **Diseño responsive** - Sin dependencias de frameworks CSS
- [x] **Navegación fluida** - Rutas y navegación intuitiva
- [x] **Componentes reutilizables** - Arquitectura modular
- [x] **Feedback visual** - Indicadores de carga, errores, éxito
- [x] **Accesibilidad básica** - Etiquetas alt, roles ARIA

### 💾 Persistencia (Temporal)

- [x] **LocalStorage** - Almacenamiento temporal de datos
- [x] **Estado de carrito** - Persistencia entre sesiones
- [x] **Datos de usuario** - Mantenimiento de sesión
- [x] **Inventario simulado** - Datos de productos de prueba

## � Funcionalidades Planificadas (Versiones Futuras)

### 🗄️ Backend y Base de Datos

- [ ] **Base de datos MySQL** - Almacenamiento persistente real
- [ ] **API REST**
- [ ] **Autenticación JWT** - Tokens seguros de autenticación
- [ ] **Encriptación bcrypt** - Contraseñas hasheadas
- [ ] **Validaciones del servidor** - Seguridad dual frontend/backend

### 💳 Sistema de Pagos y Transacciones

- [ ] **Pasarela de pagos** - Integración con PayPal, Stripe
- [ ] **Facturación electrónica** - CFDI para México
- [ ] **Historial de compras** - Seguimiento de pedidos
- [ ] **Sistema de descuentos** - Cupones y promociones avanzadas
- [ ] **Inventario en tiempo real** - Sincronización automática

### 🚀 Funcionalidades Avanzadas

- [ ] **Notificaciones push**
- [ ] **Chat Boot**
- [ ] **Sistema de reviews**
- [ ] **Búsqueda avanzada**
- [ ] **App móvil nativa**
- [ ] **Panel de analytics**

## 🛡️ Características de Seguridad Implementadas

### Autenticación y Autorización

- ✅ **Roles diferenciados** - Cliente, Vendedor, Inventario, Administrador
- ✅ **Route Guards** - `AuthGuard` protege rutas administrativas
- ✅ **Validación de permisos** - Verificación por componente
- ✅ **Gestión de sesiones** - Control de estado de autenticación
- ✅ **Bloqueo por intentos** - Protección contra ataques de fuerza bruta

### Validaciones y Sanitización

- ✅ **Validadores personalizados** - `CustomValidators` para formularios
- ✅ **Reactive Forms** - Validación en tiempo real
- ✅ **Sanitización de entrada** - Prevención de inyección XSS básica
- ✅ **Tipado estricto** - TypeScript para prevención de errores
- ✅ **Validación de formularios** - Email, teléfono, contraseñas robustas

### Manejo de Errores

- ✅ **Error Interceptor** - Captura y manejo centralizado de errores HTTP
- ✅ **Feedback visual** - Mensajes de error user-friendly
- ✅ **Logging básico** - Console logs para debugging
- ✅ **Manejo de excepciones** - Try-catch en operaciones críticas

## 🎓 Propósito Académico

## 👥 Equipo de Desarrollo

Integrantes:

- Ivan Francisco
- Brayan Lara

## 📄 Licencia

**Proyecto Académico** - Casa de Música Castillo - Sistema de Gestión

Este proyecto fue desarrollado con fines educativos para la materia de Seguridad Informática.

---
