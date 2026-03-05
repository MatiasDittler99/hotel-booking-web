# ===== ETAPA 1: BUILD =====
FROM node:20-alpine AS build

WORKDIR /app

# Copiamos solo package.json y package-lock.json para aprovechar cache de Docker
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del proyecto
COPY . .

# Build de producción con Vite
RUN npm run build


# ===== ETAPA 2: SERVIDOR NGINX =====
FROM nginx:alpine

# Copiamos los archivos de build de React/Vite al servidor Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exponemos puerto estándar HTTP
EXPOSE 80

# Comando para mantener Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]