# xomtra.com

Static website for [Xomtra](https://github.com/xomtra/xomtra), long-term memory for Home Assistant. Built with [Astro](https://astro.build); the output is plain HTML with no JavaScript.

| Path | What |
|---|---|
| `src/i18n/strings.json` | All texts (EN, DE, CS, PL, NL) |
| `src/components/`, `src/layouts/` | Page markup |
| `src/styles/site.css` | Design |
| `src/pages/` | One page per language (`/`, `/de/`, `/cs/`, `/pl/`, `/nl/`), `sitemap.xml`, `llms.txt` |
| `src/config.ts` | Site URL, repository, contact, launch switch |
| `public/` | Static files copied as they are (logo, favicon, `og.png`, `robots.txt`, `_headers`) |

## Build

```sh
npm ci
npm run dev                         # local preview at http://localhost:4321
npm run build                       # pre-launch: "public beta coming soon"
PUBLIC_LAUNCHED=1 npm run build     # launch day
```

Needs Node.js 22. The output goes to `dist/` and is not committed.

## Search engines and AI assistants

- Every page is complete HTML, readable without JavaScript.
- One URL per language with `hreflang`, `canonical`, Open Graph and JSON-LD (`SoftwareApplication`, `FAQPage`).
- `robots.txt` allows all crawlers, `sitemap.xml` lists all languages, `llms.txt` is a Markdown summary for AI assistants.

## Cloudflare

The site is a Cloudflare Worker with static assets (`wrangler.jsonc` serves `dist/`). Workers Builds settings: Build command `npm run build` · Deploy command `npx wrangler deploy` · Production branch `main` · Build variable `NODE_VERSION=22`. On launch day add the build variable `PUBLIC_LAUNCHED=1` and redeploy.

Contact: support@xomtra.com
