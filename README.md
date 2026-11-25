# xomtra.com

Static website for [Xomtra](https://github.com/xomtra/xomtra), long-term memory for Home Assistant.

| Path | What |
|---|---|
| `src/template.html` | Source: all texts (EN, DE, CS, PL, NL) and the page design |
| `tools/build.py` | Builds `public/` from the source |
| `tools/prerender.mjs` | Renders each page in headless Chromium and saves plain HTML (no JavaScript in the output) |
| `public/` | The built site. **Cloudflare Pages serves this folder.** |

## Build

```sh
python3 tools/build.py                    # pre-launch: "public beta coming soon"
XOMTRA_LAUNCHED=1 python3 tools/build.py  # launch day
```

Needs Python 3, Node.js and the `playwright` npm package with Chromium. Commit the changed `public/` together with the source.

## Search engines and AI assistants

- Every page is complete HTML, readable without JavaScript.
- One URL per language with `hreflang`, `canonical`, Open Graph and JSON-LD (`SoftwareApplication`, `FAQPage`).
- `robots.txt` allows all crawlers, `sitemap.xml` lists all languages, `llms.txt` is a Markdown summary for AI assistants.

## Cloudflare Pages settings

Framework preset: None · Build command: empty · Build output directory: `public` · Production branch: `main`.

Contact: support@xomtra.com
