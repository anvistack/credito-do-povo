# ========== Stage 1: build do SPA ==========
FROM oven/bun:1.1-alpine AS builder

WORKDIR /app

# Copia manifests primeiro para cache eficiente
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile || bun install

# Copia o resto do código e builda
COPY . .
RUN bun run build

# Sanidade: o build precisa gerar dist/client
RUN test -f dist/client/index.html || (echo "ERRO: dist/client/index.html nao gerado" && exit 1)

# ========== Stage 2: nginx servindo estáticos ==========
FROM nginx:1.27-alpine AS runner

# Remove site default e usa nosso conf
RUN rm -f /etc/nginx/conf.d/default.conf
COPY deploy/nginx.container.conf /etc/nginx/conf.d/app.conf

# Copia apenas o build final
COPY --from=builder /app/dist/client /usr/share/nginx/html

EXPOSE 80

# Healthcheck simples
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]
