# Deploy em VPS com Nginx

Este projeto é um **SPA** (TanStack Start em modo estático) que conversa
diretamente com o Supabase a partir do navegador. Não há servidor Node, server
functions nem rotas `/api/*` em uso. Logo, basta servir os arquivos estáticos
gerados pelo build.

## 1. Pré-requisitos na VPS

```bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx rsync
sudo mkdir -p /var/www/facil-credito
sudo chown -R $USER:$USER /var/www/facil-credito
```

## 2. Configurar Nginx

```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/facil-credito
# edite o server_name e os caminhos do certificado:
sudo nano /etc/nginx/sites-available/facil-credito
sudo ln -sf /etc/nginx/sites-available/facil-credito /etc/nginx/sites-enabled/facil-credito
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

## 3. HTTPS com Let's Encrypt

```bash
sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com
sudo systemctl enable certbot.timer
```

## 4. Build + Deploy (a partir da sua máquina)

```bash
chmod +x deploy/deploy.sh
./deploy/deploy.sh usuario@ip-da-vps
```

O script faz `bun install`, `bun run build`, envia `dist/client/` para
`/var/www/facil-credito` via rsync e recarrega o Nginx.

## 5. Atualizações futuras

Apenas rode novamente:

```bash
./deploy/deploy.sh usuario@ip-da-vps
```

## Por que não muda nada no código

- A conexão com o banco usa a **publishable key** do Supabase no client
  (`src/lib/supabase.ts`) — funciona em qualquer host.
- O roteamento do TanStack Router roda no navegador; o Nginx só precisa do
  fallback `try_files $uri $uri/ /index.html`, já incluído.
- `wrangler.jsonc` é usado apenas pelo deploy gerenciado da Lovable e é
  ignorado num servidor Nginx.

## Quando seria necessário mudar

Só se você adicionar `createServerFn` ou rotas `/api/*` (SSR de verdade).
Nesse caso, o build passa a precisar de um runtime Node rodando atrás do
Nginx como reverse proxy. Hoje **não é o seu caso**.
