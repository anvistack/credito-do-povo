#!/usr/bin/env bash
# Build + publica o SPA na própria VPS.
# Rode este script DENTRO da VPS, na raiz do projeto clonado.
#
#   chmod +x deploy/build-on-vps.sh
#   ./deploy/build-on-vps.sh
#
# Variáveis opcionais:
#   WEB_ROOT=/var/www/facil-credito   (destino dos arquivos)
#   SKIP_INSTALL=1                    (pula bun install)
#   SKIP_RELOAD=1                     (pula reload do nginx)

set -euo pipefail

WEB_ROOT="${WEB_ROOT:-/var/www/facil-credito}"

# 1) Verifica bun
if ! command -v bun >/dev/null 2>&1; then
  echo "ERRO: 'bun' não encontrado. Instale com:"
  echo "  curl -fsSL https://bun.sh/install | bash"
  exit 1
fi

# 2) Instala deps
if [[ "${SKIP_INSTALL:-0}" != "1" ]]; then
  echo "==> bun install"
  bun install
fi

# 3) Build
echo "==> bun run build"
bun run build

if [[ ! -d "dist/client" ]]; then
  echo "ERRO: dist/client não foi gerado. Confira o output do build acima."
  exit 1
fi

# 4) Garante o diretório web root
echo "==> Preparando $WEB_ROOT"
sudo mkdir -p "$WEB_ROOT"

# 5) Sincroniza arquivos (apaga sobras antigas)
echo "==> Copiando dist/client/ -> $WEB_ROOT"
sudo rsync -a --delete --exclude='.well-known' dist/client/ "$WEB_ROOT/"

# 6) Permissões para o nginx ler
sudo chown -R www-data:www-data "$WEB_ROOT" 2>/dev/null || \
  sudo chown -R nginx:nginx "$WEB_ROOT" 2>/dev/null || true
sudo find "$WEB_ROOT" -type d -exec chmod 755 {} \;
sudo find "$WEB_ROOT" -type f -exec chmod 644 {} \;

# 7) Confirma index.html no lugar
if [[ ! -f "$WEB_ROOT/index.html" ]]; then
  echo "ERRO: $WEB_ROOT/index.html não existe após o rsync."
  exit 1
fi

# 8) Recarrega nginx
if [[ "${SKIP_RELOAD:-0}" != "1" ]]; then
  echo "==> nginx -t && reload"
  sudo nginx -t
  sudo systemctl reload nginx
fi

echo
echo "==> OK. Conteúdo publicado em $WEB_ROOT"
echo "    Teste:  curl -I http://localhost/"
echo "    Rota interna: curl -I http://localhost/admin/login"
echo "    (ambas devem retornar 200, não 404)"
