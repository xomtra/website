import type { APIRoute } from "astro";
import { LANGS, SITE, pathFor, guidePath, methodPath, securityPath, blogPath, postPath, type Lang } from "../config";
import { GUIDES } from "../i18n";
import { allPosts } from "../lib/blog";

// Home page, the method and security pages and every installation guide, each with its language versions;
// once the blog has a published post, also the blog index and every post in the languages it was written in.
const pages: ((l: Lang) => string)[] = [pathFor, methodPath, securityPath, ...GUIDES.map((g) => (l: Lang) => guidePath(l, g))];

const entry = (path: (l: Lang) => string, langs: readonly Lang[]) => {
  const alt = langs.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${SITE}${path(l)}"/>\n`).join("")
    + (langs.includes("en") ? `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${path("en")}"/>\n` : "");
  return langs.map((l) => `  <url>\n    <loc>${SITE}${path(l)}</loc>\n${alt}  </url>\n`).join("");
};

export const GET: APIRoute = async () => {
  const posts = await allPosts();
  const slugs = [...new Set(posts.map((p) => p.slug))];
  const body = [...pages, ...(posts.length ? [blogPath] : [])].map((path) => entry(path, LANGS)).join("")
    + slugs.map((slug) => {
      const versions = posts.filter((p) => p.slug === slug);
      const langs = LANGS.filter((l) => versions.some((p) => p.lang === l));
      return entry((l) => postPath(l, slug), langs);
    }).join("");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${body}</urlset>\n`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
