# rmb-website

Static product site for [RMB Desktop](https://github.com/colinleefish/rmb-desktop), served at **https://re-mem-ber.me**.

Uses the same color palette as the [rmb-desktop web UI](https://github.com/colinleefish/rmb-desktop/tree/main/webui/src/index.css): `#222831`, `#393E46`, `#00ADB5`, `#EEEEEE`.

## Local preview

```bash
make serve
# open http://127.0.0.1:8080
```

## Deploy (Cloudflare)

Production stack:

| Service | URL |
|---------|-----|
| Pages (website) | https://re-mem-ber.me |
| R2 (releases) | https://releases.re-mem-ber.me |

```bash
source ~/.config/Cloudflare/credentials
export CLOUDFLARE_EMAIL="$CF_USERNAME" CLOUDFLARE_API_KEY="$CF_API_KEY"
export http_proxy=http://127.0.0.1:1080 https_proxy=http://127.0.0.1:1080

# deploy site
npx wrangler pages deploy . --project-name=rmb-website --branch=main

# upload release artifact
npx wrangler r2 object put rmb-releases/RMB-Desktop_0.1.0_aarch64.dmg \
  --file=./path/to/RMB-Desktop_0.1.0_aarch64.dmg --remote
```

Public download URL: `https://releases.re-mem-ber.me/RMB-Desktop_0.1.0_aarch64.dmg`

## Download links

[`downloads.json`](./downloads.json) drives download URLs. Structure supports multiple products (`desktop`, `server`) and platforms — set `server.visible` to `true` when ready to expose the hosted edition.

```json
{
  "products": {
    "desktop": {
      "visible": true,
      "platforms": {
        "macos": {
          "available": true,
          "url": "https://github.com/colinleefish/rmb-desktop/releases/download/v0.1.0/RMB-Desktop_0.1.0_aarch64.dmg",
          "version": "0.1.0"
        }
      }
    },
    "server": {
      "visible": false
    }
  }
}
```

Or host `.dmg` files on R2 (`https://releases.re-mem-ber.me/...`).

## Layout

```
├── index.html
├── style.css
├── i18n.js
├── main.js
├── downloads.json
├── Caddyfile
└── assets/
```
