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
# IMPORTANTE: usar Debian (glibc), NAO Alpine (musl).
# O binario workerd embutido no wrangler depende de glibc; em Alpine ele falha
# com "Error relocating ... fcntl64: symbol not found".
FROM node:20-slim AS runner

WORKDIR /app

# wrangler embute o workerd (runtime oficial dos Cloudflare Workers).
# Usamos a versao mais recente para evitar bugs antigos do workerd.
RUN apt-get update \
    && apt-get install -y --no-install-recommends wget ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && npm install -g wrangler@4.86.0

# Copia o build (worker + assets estaticos)
COPY --from=builder /app/dist /app/dist

EXPOSE 8787

HEALTHCHECK --interval=30s --timeout=5s --retries=5 --start-period=30s \
  CMD wget -qO- http://127.0.0.1:8787/ >/dev/null 2>&1 || exit 1

# wrangler dev roda o worker localmente com workerd em 0.0.0.0:8787.
# --local => 100% local, sem precisar de conta Cloudflare.
# IMPORTANTE: precisa rodar DENTRO de dist/server, porque o wrangler.json
# gerado pelo TanStack Start usa caminhos relativos (main: "./index.js",
# assets.directory: "./assets"). Rodando de outro CWD, o worker sobe mas
# nao acha os assets nem o index -> 404 em todas as rotas.
CMD ["sh", "-c", "cd /app/dist/server && ls -la && exec wrangler dev --config ./wrangler.json --ip 0.0.0.0 --port 8787 --local --no-show-interactive-dev-session"]
