# Deploy em VPS com Portainer (Docker)

Este projeto é um **TanStack Start** que builda como **Cloudflare Worker**
(SSR + assets). Não é uma SPA estática, então **nginx puro não basta**: o
HTML é renderizado pelo worker a cada request.

A solução usada aqui: rodar o worker dentro do container com **wrangler**,
que embute o **workerd** (runtime oficial dos Cloudflare Workers) e funciona
100% local, sem precisar de conta Cloudflare nem internet.

## O que está no container

- `oven/bun:1.1-alpine` faz `bun install` + `bun run build` (gera `dist/`).
- `node:20-alpine` instala `wrangler@4` e roda `wrangler dev --local`
  servindo o worker em `0.0.0.0:8787`.

O Supabase é acessado direto pelo navegador (`src/lib/supabase.ts`), então
**nenhum secret/env é necessário no servidor**.

## Subir no Portainer

1. **Stacks → Add stack**.
2. **Build method: Repository** → cole a URL do Git deste projeto e o
   caminho `docker-compose.yml`.
3. **Deploy the stack**. O Portainer roda o build do `Dockerfile` e sobe o
   container.

A porta padrão é `8080:8787`. Acesse `http://IP-DA-VPS:8080`.

## Build local (teste)

```bash
docker build -t facil-credito:latest .
docker run --rm -p 8080:8787 facil-credito:latest
# abra http://localhost:8080
```

## Reverse proxy (Traefik / NPM / Caddy)

Aponte o proxy para a porta `8787` (interna) ou `8080` (publicada). Os
labels prontos para Traefik estão comentados no `docker-compose.yml`.

## Atualização

No Portainer: **Stacks → seu stack → Pull and redeploy** (ou **Update the
stack** com `Re-pull image and redeploy`). Vai rebuildar a partir do Git.

## Por que não usamos nginx puro

O build gera `dist/server/index.js` (worker) + `dist/client/` (assets, **sem
`index.html`**). O `index.html` é gerado dinamicamente pelo worker em cada
request. Servir só `dist/client/` com nginx resulta em 404 na home — foi o
erro que você viu antes.

## Troubleshooting

- **`dist/client/index.html nao gerado`** durante o build → era da versão
  antiga do Dockerfile. O atual checa `dist/server/index.js`. Faça
  `git pull` e rebuilde.
- **Container sobe mas dá 502** → veja `docker logs facil-credito`. Se
  aparecer warning sobre wrangler config, confirme que está usando a versão
  atualizada do Dockerfile (wrangler@4).
- **Supabase não conecta** → erro do navegador, não do container.
  Verifique no DevTools (F12) se chamadas para `*.supabase.co` saem 200.
