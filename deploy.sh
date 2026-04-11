#!/bin/bash
# Deploy mexzungu.com to Cloudflare Pages via direct wrangler upload.
# Auto-runs via git post-push hook. You can also run manually.

set -e

# Load tokens from brain env files
CF_TOKEN=$(grep CLOUDFLARE_API_TOKEN /home/mexzungu/brain/.env | cut -d= -f2)
ACCOUNT_ID=$(grep CLOUDFLARE_ACCOUNT_ID /home/mexzungu/brain/.env | cut -d= -f2)

if [ -z "$CF_TOKEN" ] || [ -z "$ACCOUNT_ID" ]; then
  echo "ERROR: Could not read CF_TOKEN or ACCOUNT_ID from brain/.env"
  exit 1
fi

echo "Deploying mexzungu-site to Cloudflare Pages..."

CLOUDFLARE_API_TOKEN="$CF_TOKEN" CLOUDFLARE_ACCOUNT_ID="$ACCOUNT_ID" \
  npx wrangler pages deploy . \
    --project-name mexzungu-site \
    --branch main \
    --commit-dirty=true

echo "Deploy complete."
