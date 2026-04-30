# ========== Stage 1: build do app TanStack Start (gera Cloudflare Worker) ==========
FROM oven/bun:1.1-alpine AS builder

WORKDIR /app

# Manifests primeiro para cache
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile || bun install

# Resto do código + build
COPY . .
RUN bun run build

# Sanidade: o build do TanStack Start gera dist/server (worker) + dist/client (assets)
RUN test -f dist/server/index.js || (echo "ERRO: dist/server/index.js nao gerado" && exit 1)
RUN test -f dist/server/wrangler.json || (echo "ERRO: dist/server/wrangler.json nao gerado" && exit 1)

# ========== Stage 2: runtime Node + wrangler servindo o worker ==========
# Usamos node:20-alpine porque wrangler/workerd precisam de Node + glibc-compat.
FROM node:20-alpine AS runner

WORKDIR /app

# wrangler traz embutido o workerd (runtime oficial dos Cloudflare Workers).
# Versao fixada para builds reproduziveis.
RUN npm install -g wrangler@4.40.3 \
    && apk add --no-cache wget libc6-compat

# Copia o build (worker + assets estaticos)
COPY --from=builder /app/dist /app/dist

EXPOSE 8787

HEALTHCHECK --interval=30s --timeout=5s --retries=5 --start-period=20s \
  CMD wget -qO- http://127.0.0.1:8787/ >/dev/null 2>&1 || exit 1

# wrangler dev roda o worker localmente com workerd, expondo na porta 8787.
# --ip 0.0.0.0 permite acesso de fora do container.
# --local garante execucao 100% local (nao precisa de conta Cloudflare).
CMD ["wrangler", "dev", "--config", "/app/dist/server/wrangler.json", \
     "--ip", "0.0.0.0", "--port", "8787", "--local", "--no-show-interactive-dev-session"]
