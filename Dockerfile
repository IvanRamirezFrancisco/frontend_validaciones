# Utilizar Node.js versión 18 como imagen base
FROM node:18-alpine

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias
RUN npm ci --only=production

# Copiar el código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Exponer el puerto
EXPOSE 3000

# Definir la variable de entorno para producción
ENV NODE_ENV=production

# Comando para ejecutar la aplicación
CMD ["npm", "start"]