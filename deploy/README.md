# Deploy em VPS com Nginx

Este projeto roda como **SPA estático**: o build gera HTML/CSS/JS em
`dist/client/` e o navegador conversa direto com o Supabase. Nada de
Cloudflare/Worker/SSR no servidor — qualquer Nginx serve.

## Por que aparecia "404 Page not found"

O TanStack Router resolve as rotas no navegador. Quando você abre
`https://seu-dominio.com/admin/dashboard` direto, o Nginx procura um arquivo
físico chamado `admin/dashboard` e não acha → 404.

A correção é o fallback de SPA já incluído no `nginx.conf`:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

Com isso o Nginx serve sempre o `index.html` e o roteamento acontece no client.

---

## Passo a passo (build na própria VPS)

### 1. Pré-requisitos (uma vez só)

```bash
sudo apt update
sudo apt install -y nginx rsync curl unzip
# bun
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc
```

### 2. Clonar o projeto

```bash
git clone <url-do-repo> ~/facil-credito
cd ~/facil-credito
```

### 3. Configurar o Nginx

```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/facil-credito
sudo nano /etc/nginx/sites-available/facil-credito   # ajuste server_name
sudo ln -sf /etc/nginx/sites-available/facil-credito /etc/nginx/sites-enabled/facil-credito
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

> Se ainda não tem domínio, troque `server_name seu-dominio.com www.seu-dominio.com;`
> por `server_name _;` para aceitar o IP da VPS.

### 4. Buildar e publicar

```bash
chmod +x deploy/build-on-vps.sh
./deploy/build-on-vps.sh
```

O script faz `bun install`, `bun run build`, copia `dist/client/` para
`/var/www/facil-credito` e recarrega o Nginx.

### 5. Testar

```bash
curl -I http://localhost/                 # 200
curl -I http://localhost/admin/login      # 200 (graças ao fallback)
```

Abra no navegador: `http://SEU-IP/` e `http://SEU-IP/admin/login`. Tente
recarregar a página interna — não pode mais dar 404.

### 6. HTTPS (recomendado)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com
```

O Certbot adiciona o bloco 443 + redirect 80→443 automaticamente, sem
quebrar o `try_files` que você já tem.

---

## Atualizações futuras

```bash
cd ~/facil-credito
git pull
./deploy/build-on-vps.sh
```

---

## Por que não tiramos `@cloudflare/vite-plugin` do projeto

Ele está embutido em `@lovable.dev/vite-tanstack-config` e é usado **só dentro
do editor da Lovable** (preview/build do ambiente). O artefato final em
`dist/client/` é 100% estático — não tem nada de Cloudflare. Removê-lo
quebraria o editor sem nenhum benefício na VPS.

A conexão com o banco está em `src/lib/supabase.ts` usando a publishable key,
que é client-side por design e funciona em qualquer host.

## Troubleshooting

**404 em rota interna ao recarregar** → faltou o `try_files ... /index.html`.
Confira que o `nginx.conf` ativo é o deste repo: `sudo nginx -T | grep try_files`.

**Tela branca** → abra o DevTools (F12) → Console/Network. Geralmente é o
caminho dos assets. Confirme que `/var/www/facil-credito/index.html` referencia
arquivos em `/assets/...` e que essa pasta existe.

**Permissão negada nos logs do nginx** → rode novamente o `build-on-vps.sh`,
ele ajusta dono/permissões para `www-data`.

**Supabase não conecta** → o erro é do navegador, não do Nginx. Verifique no
DevTools se as requisições para `*.supabase.co` saem com status 200. URL e
chave estão fixas em `src/lib/supabase.ts`.
