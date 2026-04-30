#!/usr/bin/env bash
# Build local + envio para a VPS via rsync.
# Uso: ./deploy/deploy.sh usuario@ip-da-vps
set -euo pipefail

TARGET="${1:-}"
REMOTE_PATH="${REMOTE_PATH:-/var/www/facil-credito}"

if [[ -z "$TARGET" ]]; then
  echo "Uso: $0 usuario@host  [REMOTE_PATH=/var/www/facil-credito]"
  exit 1
fi

echo "==> Instalando dependências"
bun install

echo "==> Build de produção"
bun run build

if [[ ! -d "dist/client" ]]; then
  echo "ERRO: dist/client não foi gerado. Verifique a saída do build."
  exit 1
fi

echo "==> Enviando para $TARGET:$REMOTE_PATH"
rsync -avz --delete \
  --exclude='.DS_Store' \
  dist/client/ "$TARGET:$REMOTE_PATH/"

echo "==> Recarregando Nginx"
ssh "$TARGET" "sudo nginx -t && sudo systemctl reload nginx"

echo "==> OK. Deploy concluído."
