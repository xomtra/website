#!/usr/bin/env python3
"""Build xomtra.com into public/ from src/template.html.

One static page per language (/, /de/, /cs/, /pl/, /nl/). The page content is
pre-rendered into plain HTML (tools/prerender.mjs, headless Chromium), so search
engines and AI crawlers that do not run JavaScript see the full text. The built
pages contain no JavaScript.

Also writes robots.txt, sitemap.xml and llms.txt.

Usage:  python3 tools/build.py            # pre-launch ("public beta coming soon")
        XOMTRA_LAUNCHED=1 python3 tools/build.py
Needs:  python3, node, and the "playwright" npm package with Chromium.
"""
import html
import json
import os
import pathlib
import re
import subprocess
import tempfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "src" / "template.html"
OUT = ROOT / "public"
BASE = "https://xomtra.com"
REPO = "https://github.com/xomtra/xomtra"
LANGS = ["en", "de", "cs", "pl", "nl"]
LAUNCHED = os.environ.get("XOMTRA_LAUNCHED") == "1"
TITLES = {
    "en": "Xomtra · long-term memory for Home Assistant",
    "de": "Xomtra · Langzeitgedächtnis für Home Assistant",
    "cs": "Xomtra · dlouhodobá paměť pro Home Assistant",
    "pl": "Xomtra · pamięć długoterminowa dla Home Assistant",
    "nl": "Xomtra · langetermijngeheugen voor Home Assistant",
}


def url(lang):
    return f"{BASE}/" if lang == "en" else f"{BASE}/{lang}/"


def path(lang):
    return "/" if lang == "en" else f"/{lang}/"


def strip_tags(s):
    return re.sub(r"<[^>]+>", "", s)


src = SRC.read_text(encoding="utf-8")
src = re.sub(r"const LAUNCHED = (true|false);", f"const LAUNCHED = {'true' if LAUNCHED else 'false'};", src)
body = src.split('<meta name="claude:viewport-fit-sides" content="cover">', 1)[1]
js = src[src.index("<script>") + 8: src.rindex("</script>")]
a = js.index("const T = ")
b = js.index("}};", a) + 3
T = json.loads(subprocess.check_output(
    ["node", "-e", "process.stdout.write(JSON.stringify(" + js[a + 10:b - 1] + "))"]))

alternates = "".join(f'<link rel="alternate" hreflang="{l}" href="{url(l)}">\n' for l in LANGS)
alternates += f'<link rel="alternate" hreflang="x-default" href="{url("en")}">\n'


def json_ld(lang):
    t = T[lang]
    app = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Xomtra",
        "url": url(lang),
        "inLanguage": lang,
        "description": t["lead"],
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Home Assistant OS, Linux (Docker), Proxmox VE, VMware",
        "license": "https://www.apache.org/licenses/LICENSE-2.0",
        "isAccessibleForFree": True,
        "offers": {"@type": "Offer", "price": "0", "priceCurrency": "EUR"},
        "codeRepository": REPO,
        "sameAs": [REPO],
        "image": f"{BASE}/og.png",
    }
    faq = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "inLanguage": lang,
        "mainEntity": [
            {"@type": "Question", "name": q,
             "acceptedAnswer": {"@type": "Answer", "text": strip_tags(ans)}}
            for q, ans in t["faq"]
        ],
    }
    return "".join(
        f'<script type="application/ld+json">{json.dumps(d, ensure_ascii=False)}</script>\n'
        for d in (app, faq))


tmp = pathlib.Path(tempfile.mkdtemp(prefix="xomtra-build-"))
jobs = []
for lang in LANGS:
    desc = html.escape(T[lang]["lead"], quote=True)
    title = TITLES[lang]
    head = f"""<!doctype html>
<html lang="{lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="{url(lang)}">
{alternates}<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="alternate" type="text/plain" title="llms.txt" href="/llms.txt">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Xomtra">
<meta property="og:url" content="{url(lang)}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="{BASE}/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0b0c0f">
{json_ld(lang)}<style>body{{margin:0}}</style>
"""
    page = body.replace('<header class="top">', '</head>\n<body>\n<header class="top">', 1)
    page = re.sub(r'<a href="#(\w\w)" data-l="\1">',
                  lambda m: f'<a href="{path(m.group(1))}" data-l="{m.group(1)}" hreflang="{m.group(1)}">', page)
    page = page.replace("function pick(){", f'const FORCE_LANG = "{lang}";\nfunction pick(){{\n  if (FORCE_LANG) return FORCE_LANG;', 1)
    page = page.replace('<a class="brand" href="#top"', f'<a class="brand" href="{path(lang)}"')
    draft = tmp / f"{lang}.html"
    draft.write_text(head + page + "\n</body>\n</html>\n", encoding="utf-8")
    target = OUT / ("index.html" if lang == "en" else f"{lang}/index.html")
    target.parent.mkdir(parents=True, exist_ok=True)
    jobs.append({"in": str(draft), "out": str(target)})

subprocess.check_call(["node", str(ROOT / "tools" / "prerender.mjs"), json.dumps(jobs)])

# robots.txt: everyone welcome, including AI crawlers.
(OUT / "robots.txt").write_text(
    "# Xomtra welcomes search engines and AI crawlers.\n"
    "User-agent: *\nAllow: /\n\n"
    f"Sitemap: {BASE}/sitemap.xml\n", encoding="utf-8")

# sitemap.xml with hreflang alternates.
links = "".join(f'    <xhtml:link rel="alternate" hreflang="{l}" href="{url(l)}"/>\n' for l in LANGS)
links += f'    <xhtml:link rel="alternate" hreflang="x-default" href="{url("en")}"/>\n'
entries = "".join(f"  <url>\n    <loc>{url(l)}</loc>\n{links}  </url>\n" for l in LANGS)
(OUT / "sitemap.xml").write_text(
    '<?xml version="1.0" encoding="UTF-8"?>\n'
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'
    f"{entries}</urlset>\n", encoding="utf-8")

# llms.txt (https://llmstxt.org): plain Markdown summary for AI assistants.
en = T["en"]
lines = [
    "# Xomtra",
    "",
    "> " + en["lead"],
    "",
    "Xomtra is an independent open source project (Apache 2.0) for Home Assistant. "
    "It is not affiliated with the Open Home Foundation or Nabu Casa.",
    "",
    "Status: " + ("public beta." if LAUNCHED else "public beta coming soon. Contact support@xomtra.com to be notified."),
    "",
    "## What it does",
    "",
]
lines += [f"- **{f[1]}:** {f[2]}" for f in en["feats"]]
lines += ["", "## Compared with the built-in Home Assistant MCP server", "",
          "| | Built-in HA MCP server | Xomtra |", "|---|---|---|"]
lines += [f"| {r[0]} | {r[1]} | {r[2]} |" for r in en["c_rows"]]
lines += ["", "## Install", ""]
lines += [f"- **{i[0]}:** {i[1]}" for i in en["inst"]]
lines += ["", "## Get started", ""]
lines += [f"{n}. **{s[0]}:** {s[1]}" for n, s in enumerate(en["steps"], 1)]
lines += ["", "## Example questions", ""]
lines += [f"- {q}" for q in en["qs"]]
lines += ["", "## FAQ", ""]
for q, ans in en["faq"]:
    lines += [f"### {q}", "", strip_tags(ans), ""]
lines += ["## Links", "",
          f"- [Website]({BASE}/): English; also [Deutsch]({BASE}/de/), [Čeština]({BASE}/cs/), [Polski]({BASE}/pl/), [Nederlands]({BASE}/nl/)",
          f"- [Source code and issues]({REPO})",
          "- Contact: support@xomtra.com", ""]
(OUT / "llms.txt").write_text("\n".join(lines), encoding="utf-8")
print("built", ", ".join(str(j["out"]) for j in jobs))
