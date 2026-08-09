#!/usr/bin/env bash
set -euo pipefail

VERSION="${1:?usage: publish-release.sh <version> [artifact files...]}"
shift || true

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
RELEASES_DIR="$ROOT/releases"
MANIFEST="$RELEASES_DIR/$VERSION/manifest.json"
LATEST="$RELEASES_DIR/latest.json"
VERSIONS="$RELEASES_DIR/versions.json"

if [[ -f "$HOME/.config/Cloudflare/credentials" ]]; then
  # shellcheck disable=SC1091
  source "$HOME/.config/Cloudflare/credentials"
  export CLOUDFLARE_EMAIL="${CF_USERNAME:?}"
  export CLOUDFLARE_API_KEY="${CF_API_KEY:?}"
fi

export http_proxy="${http_proxy:-http://127.0.0.1:1080}"
export https_proxy="${https_proxy:-http://127.0.0.1:1080}"

wrangler() {
  npx --yes wrangler@4 "$@"
}

echo "Publishing rmb-desktop $VERSION to R2..."

if [[ "$#" -gt 0 ]]; then
  for file in "$@"; do
    name="$(basename "$file")"
    echo "  upload $VERSION/$name"
    wrangler r2 object put "rmb-releases/$VERSION/$name" --file="$file" --remote
  done
fi

for meta in "$MANIFEST" "$LATEST" "$VERSIONS"; do
  if [[ -f "$meta" ]]; then
    key="${meta#$RELEASES_DIR/}"
    echo "  upload $key"
    wrangler r2 object put "rmb-releases/$key" --file="$meta" --content-type=application/json --remote
  fi
done

echo "Done. https://releases.re-mem-ber.me/$VERSION/"
