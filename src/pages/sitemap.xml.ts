import type { APIRoute } from "astro";
import { LANGS, SITE, pathFor, guidePath, type Lang } from "../config";
import { GUIDES } from "../i18n";

// Home page and every installation guide, each with its language versions.
const pages: ((l: Lang) => string)[] = [pathFor, ...GUIDES.map((g) => (l: Lang) => guidePath(l, g))];

export const GET: APIRoute = () => {
  const body = pages.map((path) => {
    const alt = LANGS.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${SITE}${path(l)}"/>\n`).join("")
      + `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${path("en")}"/>\n`;
    return LANGS.map((l) => `  <url>\n    <loc>${SITE}${path(l)}</loc>\n${alt}  </url>\n`).join("");
  }).join("");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${body}</urlset>\n`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
