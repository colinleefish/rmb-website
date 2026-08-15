#!/usr/bin/env bash
# Publish a rmb-desktop release to Cloudflare R2 (releases.re-mem-ber.me),
# Phase 2 of the tauri-to-go-shell migration.
#
# Usage:
#   publish-release.sh <version> <manifest.json> <dmg> [flat files...]
#
#   <manifest.json>   signed update manifest (from rmb-desktop dist/)
#   <dmg>             macOS installer → uploaded under <version>/
#   [flat files...]   sidecar update bundles → uploaded FLAT at the root,
#                     because the updater resolves bundle URLs relative to
#                     the feed directory (latest.json lives at the root) and
#                     GitHub release assets are flat too. Bundle file names
#                     already embed the version, so no collision.
set -euo pipefail

VERSION="${1:?usage: publish-release.sh <version> <manifest.json> <dmg> [flat files...]}"
MANIFEST_SRC="${2:?usage: publish-release.sh <version> <manifest.json> <dmg> [flat files...]}"
DMG="${3:?usage: publish-release.sh <version> <manifest.json> <dmg> [flat files...]}"
shift 3
FLAT_FILES=("$@")

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
RELEASES_DIR="$ROOT/releases"
VERSION_DIR="$RELEASES_DIR/$VERSION"
MANIFEST_DST="$VERSION_DIR/manifest.json"
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

# --- assemble local metadata -------------------------------------------------
mkdir -p "$VERSION_DIR"
cp "$MANIFEST_SRC" "$MANIFEST_DST"     # archival per-version manifest
cp "$MANIFEST_SRC" "$LATEST"           # latest.json = the signed manifest

RELEASED_AT="$(jq -r .released_at "$MANIFEST_SRC")"
jq --arg ver "$VERSION" --arg released "$RELEASED_AT" '
  .latest = $ver
  | .versions = ([ .versions[] | select(.version != $ver) ]
    + [{version: $ver, released_at: $released,
        manifest: ("https://releases.re-mem-ber.me/" + $ver + "/manifest.json")}])
' "$VERSIONS" > "$VERSIONS.tmp"
mv "$VERSIONS.tmp" "$VERSIONS"

# --- uploads -----------------------------------------------------------------
echo "  upload $VERSION/$(basename "$DMG")"
wrangler r2 object put "rmb-releases/$VERSION/$(basename "$DMG")" --file="$DMG" --remote

for file in "${FLAT_FILES[@]}"; do
  echo "  upload $(basename "$file")  (flat)"
  wrangler r2 object put "rmb-releases/$(basename "$file")" --file="$file" --remote
done

for meta in "$MANIFEST_DST" "$LATEST" "$VERSIONS"; do
  key="${meta#$RELEASES_DIR/}"
  echo "  upload $key"
  wrangler r2 object put "rmb-releases/$key" --file="$meta" --content-type=application/json --remote
done

echo "Done. https://releases.re-mem-ber.me/latest.json"
