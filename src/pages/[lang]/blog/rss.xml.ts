import type { APIRoute } from "astro";
import { LANGS, type Lang } from "../../../config";
import { rss } from "../../../lib/rss";

export function getStaticPaths() {
  return LANGS.filter((l) => l !== "en").map((lang) => ({ params: { lang } }));
}
export const GET: APIRoute = ({ params }) => rss(params.lang as Lang);
