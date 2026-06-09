# Usamos una versión ligera de Node
FROM node:18-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiamos los archivos de dependencias primero (para optimizar la caché de Docker)
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos todo el resto del código
COPY . .

# Compilamos NestJS
RUN npm run build

# Exponemos el puerto que usa NestJS
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "run", "start:prod"]