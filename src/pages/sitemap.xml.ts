import type { APIRoute } from "astro";
import { LANGS, urlFor } from "../config";

export const GET: APIRoute = () => {
  const alt = LANGS.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${urlFor(l)}"/>\n`).join("")
    + `    <xhtml:link rel="alternate" hreflang="x-default" href="${urlFor("en")}"/>\n`;
  const body = LANGS.map((l) => `  <url>\n    <loc>${urlFor(l)}</loc>\n${alt}  </url>\n`).join("");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${body}</urlset>\n`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
