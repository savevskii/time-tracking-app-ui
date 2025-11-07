# ---- Build stage ----
FROM node:24-bookworm-slim AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Runtime stage ----
FROM nginx:1.29-alpine AS runtime
ENV NGINX_ENTRYPOINT_QUIET_LOGS=1

COPY docker/runtime-config.sh /docker-entrypoint.d/40-runtime-config.sh
RUN chmod +x /docker-entrypoint.d/40-runtime-config.sh

# Replace the default server config with an SPA-friendly variant.
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]