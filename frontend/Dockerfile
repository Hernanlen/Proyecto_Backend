# Etapa 1: Construcción (Build)
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Servidor web ligero (Nginx) para mostrar la página
FROM nginx:alpine
# Copiamos el resultado de React (la carpeta dist o build) a la carpeta pública de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exponemos el puerto 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]