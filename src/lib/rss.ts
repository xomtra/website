// RSS 2.0 feed of one language's blog (titles and descriptions, no tracking).
import { SITE, blogPath, postPath, type Lang } from "../config";
import { B } from "../i18n";
import { postsIn } from "./blog";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function rss(lang: Lang): Promise<Response> {
  const b = B[lang];
  const posts = await postsIn(lang);
  const items = posts.map((p) => {
    const url = SITE + postPath(lang, p.slug);
    return `  <item>\n    <title>${esc(p.data.title)}</title>\n    <link>${url}</link>\n    <guid isPermaLink="true">${url}</guid>\n    <pubDate>${p.data.date.toUTCString()}</pubDate>\n    <description>${esc(p.data.description)}</description>\n  </item>\n`;
  }).join("");
  const self = `${SITE}${blogPath(lang)}rss.xml`;
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n<channel>\n  <title>${esc(`xomtra · ${b.title}`)}</title>\n  <link>${SITE}${blogPath(lang)}</link>\n  <atom:link href="${self}" rel="self" type="application/rss+xml"/>\n  <description>${esc(b.desc)}</description>\n  <language>${lang}</language>\n${items}</channel>\n</rss>\n`;
  return new Response(body, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
