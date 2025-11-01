# Usar Node.js 18 Alpine para una imagen más ligera
FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar todas las dependencias (incluyendo devDependencies para el build)
RUN npm ci

# Copiar todo el código fuente
COPY . .

# Construir la aplicación para producción
RUN npm run build:prod

# Exponer el puerto que usa Railway (variable de entorno PORT)
EXPOSE $PORT

# Comando para iniciar la aplicación con SSR
CMD ["npm", "start"]