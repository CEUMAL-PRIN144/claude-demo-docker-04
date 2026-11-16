# syntax=docker/dockerfile:1

# ---- Build the static site ----
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- Serve it with nginx (runs as non-root, listens on 8080) ----
FROM nginxinc/nginx-unprivileged:1.27-alpine

# Backend URL the browser calls. The page is served from a different origin
# (this container), so these are real cross-origin requests: the backend must
# list this frontend's origin in its CORS_ORIGIN.
ENV API_URL=http://localhost:3000

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
COPY --chmod=755 docker/40-write-config.sh /docker-entrypoint.d/40-write-config.sh

# The startup script rewrites config.js, so the nginx user must own it.
USER root
RUN chown nginx /usr/share/nginx/html/config.js
USER nginx

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:8080/ || exit 1
