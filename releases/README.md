# Release artifacts (R2)

Public bucket: **https://releases.re-mem-ber.me**

## Layout

```
releases.re-mem-ber.me/
├── latest.json              # current version + download URLs (check for updates here)
├── versions.json            # index of all published versions
└── 0.1.0/
    ├── manifest.json        # artifacts for this version
    ├── RMB-Desktop_0.1.0_aarch64.dmg
    └── RMB-Desktop_0.1.0_x86_64.dmg
```

## Update checking

Clients and the website read **`/latest.json`** to find the newest version and platform-specific download URLs.

To list history, read **`/versions.json`**.

## Publish a new version

1. Copy `releases/0.1.0/` to `releases/X.Y.Z/` and update manifests.
2. Upload binaries:

```bash
source ~/.config/Cloudflare/credentials
export CLOUDFLARE_EMAIL="$CF_USERNAME" CLOUDFLARE_API_KEY="$CF_API_KEY"
export http_proxy=http://127.0.0.1:1080 https_proxy=http://127.0.0.1:1080

VERSION=0.1.0
npx wrangler r2 object put "rmb-releases/$VERSION/RMB-Desktop_${VERSION}_aarch64.dmg" \
  --file=./RMB-Desktop_${VERSION}_aarch64.dmg --remote
```

3. Upload manifests:

```bash
npx wrangler r2 object put "rmb-releases/$VERSION/manifest.json" \
  --file=./releases/$VERSION/manifest.json --content-type=application/json --remote

npx wrangler r2 object put rmb-releases/latest.json \
  --file=./releases/latest.json --content-type=application/json --remote

npx wrangler r2 object put rmb-releases/versions.json \
  --file=./releases/versions.json --content-type=application/json --remote
```

Or run `./scripts/publish-release.sh 0.1.0 path/to/*.dmg`
