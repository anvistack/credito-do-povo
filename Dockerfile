# syntax=docker/dockerfile:1.7
# ========== Stage 1: build do TanStack Start (gera Cloudflare Worker) ==========
FROM oven/bun:1.1-alpine AS builder

WORKDIR /app

# Manifests primeiro para cache
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile || bun install

# Resto do código + build
COPY . .
RUN bun run build

# Lista o que foi gerado (ajuda em debug no Portainer)
RUN echo "===== dist/server =====" && ls -la dist/server || true \
 && echo "===== dist/client =====" && ls -la dist/client || true

# Sanidade: o build do TanStack Start (Cloudflare plugin) gera um worker em dist/server
# e um wrangler.json para rodá-lo. Validamos os dois antes de seguir.
RUN test -f dist/server/wrangler.json || (echo "ERRO: dist/server/wrangler.json nao gerado" && exit 1)

# ========== Stage 2: runtime Node + wrangler servindo o worker ==========
FROM node:20-alpine AS runner

WORKDIR /app

# wrangler embute o workerd (runtime oficial dos Cloudflare Workers).
RUN npm install -g wrangler@4.40.3 \
    && apk add --no-cache wget libc6-compat

# Copia o build (worker + assets estaticos)
COPY --from=builder /app/dist /app/dist

EXPOSE 8787

HEALTHCHECK --interval=30s --timeout=5s --retries=5 --start-period=30s \
  CMD wget -qO- http://127.0.0.1:8787/ >/dev/null 2>&1 || exit 1

# wrangler dev roda o worker localmente com workerd em 0.0.0.0:8787.
# --local => 100% local, sem precisar de conta Cloudflare.
CMD ["sh", "-c", "ls -la /app/dist/server && exec wrangler dev --config /app/dist/server/wrangler.json --ip 0.0.0.0 --port 8787 --local --no-show-interactive-dev-session"]
