# Faza 1: build React aplikacije
FROM node:20-slim as build
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
COPY .env .env
RUN npm run build

# Faza 2: serviraj z NGINX
FROM nginx:alpine
# Kopiraj zgrajeno React aplikacijo
COPY --from=build /app/build /usr/share/nginx/html
# Kopiraj NGINX konfiguracijo
COPY nginx.conf /etc/nginx/conf.d/default.conf
