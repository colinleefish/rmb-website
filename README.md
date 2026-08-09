# rmb-website

Static product site for [RMB Desktop](https://github.com/colinleefish/rmb-desktop), served at **https://re-mem-ber.me**.

Uses the same color palette as the [rmb-desktop web UI](https://github.com/colinleefish/rmb-desktop/tree/main/webui/src/index.css): `#222831`, `#393E46`, `#00ADB5`, `#EEEEEE`.

## Local preview

```bash
make serve
# open http://127.0.0.1:8080
```

## Deploy

### DNS

Point the apex domain at your host:

| Type | Name | Value |
|------|------|-------|
| A | `@` | your server IPv4 |
| AAAA | `@` | your server IPv6 (optional) |

### rsync + Caddy

```bash
rsync -avz --delete ./ user@your-server:/var/www/re-mem-ber.me/
```

Copy [`Caddyfile`](./Caddyfile) to the server. Caddy obtains TLS automatically once DNS resolves.

### GitHub Pages

1. Enable Pages for this repo (Settings → Pages → deploy from `/` on `main`).
2. Set custom domain to `re-mem-ber.me`.
3. Add the DNS records GitHub shows.

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

Or host `.dmg` files under `/releases/` on the same server.

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
