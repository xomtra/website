// Blog posts by language. A post is src/content/blog/<lang>/<id>.md; files with the same <id>
// in other language folders are its translations. Drafts show only in `astro dev`.
import { getCollection, type CollectionEntry } from "astro:content";
import { LANGS, type Lang } from "../config";

export type Post = CollectionEntry<"blog"> & { lang: Lang; slug: string };

const isLang = (s: string): s is Lang => (LANGS as readonly string[]).includes(s);

export async function allPosts(): Promise<Post[]> {
  const entries = await getCollection("blog", (e) => import.meta.env.DEV || !e.data.draft);
  return entries
    .map((e) => {
      const [lang, slug] = e.id.split("/");
      return { ...e, lang, slug } as Post;
    })
    .filter((p) => isLang(p.lang) && /^[a-z0-9][a-z0-9-]*$/.test(p.slug ?? ""))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime() || a.slug.localeCompare(b.slug));
}

export const postsIn = async (lang: Lang) => (await allPosts()).filter((p) => p.lang === lang);

// Languages in which a post with this id exists, in the order of LANGS.
export async function translations(slug: string): Promise<Lang[]> {
  const have = new Set((await allPosts()).filter((p) => p.slug === slug).map((p) => p.lang));
  return LANGS.filter((l) => have.has(l));
}

export const fmtDate = (lang: Lang, d: Date) =>
  new Intl.DateTimeFormat(lang, { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(d);
export const isoDate = (d: Date) => d.toISOString().slice(0, 10);
