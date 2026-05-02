# QRGen — Free Custom QR Code Generator

> No account. No watermarks. No trials. Forever free.

Live at **[qrgen.shri.life](https://qrgen.shri.life)**

---

## Features

- **10 content types** — URL, Text, Wi-Fi, vCard, Email, SMS, Phone, Location, WhatsApp, Calendar Event
- **8 module shapes** — Square, Rounded, Dot, Diamond, Star, Cross, Triangle, Heart
- **8 eye/corner styles** — Square, Rounded outer, Rounded both, Dot inner, Circle, Leaf, Star, Diamond
- **Gradient support** — Horizontal, Vertical, Diagonal, Radial — any two colors
- **Custom eye colors** — Override outer and inner finder pattern colors independently
- **Color presets** — 8 one-click palettes
- **Logo overlay** — Upload PNG/SVG/JPG, control size, toggle white padding
- **Error correction** — L / M / Q / H
- **Sizes** — 128px to 1024px
- **Light & dark mode** — System-aware + manual toggle
- **Export** — PNG, SVG, JPG, Copy to clipboard, Print
- **Hit counter** — Cloudflare KV backed (no DB needed)

---

## Deploy in 5 minutes

### 1. Deploy the frontend to Cloudflare Pages

```bash
# Option A: Drag-and-drop
# Go to dash.cloudflare.com → Pages → Upload → drop index.html

# Option B: GitHub (recommended)
git init && git add . && git commit -m "init"
# Push to GitHub, then connect repo in Cloudflare Pages
```

### 2. Add custom domain

In Cloudflare Pages → your project → Custom domains → Add `qrgen.shri.life`

Cloudflare auto-creates the DNS record since shri.life is already on Cloudflare. Done.

### 3. Deploy the hit counter Worker (optional)

```bash
npm install -g wrangler
wrangler login

# Create KV namespace
wrangler kv:namespace create QRGEN_KV
# Copy the id into wrangler.toml

# Deploy
wrangler deploy
```

Update the `COUNTER_URL` in `index.html` to your worker URL.

---

## Roadmap

- [ ] Batch QR generation from CSV
- [ ] QR code scanner (camera)
- [ ] Scan tracking with Cloudflare Analytics Engine
- [ ] REST API
- [ ] Print sheet (multiple QRs per page)
- [ ] QR code templates / presets save

---

## Tech stack

- Pure HTML + CSS + Vanilla JS — zero npm, zero build step
- [qrcode.js](https://github.com/davidshimjs/qrcodejs) — MIT license
- Cloudflare Pages (hosting) + Workers KV (counter)

## License

MIT — fork it, host it, do whatever.
