// Launch switch: false = "public beta coming soon". Set PUBLIC_LAUNCHED=1 in Cloudflare Pages on launch day.
export const LAUNCHED = import.meta.env.PUBLIC_LAUNCHED === "1";
export const SITE = "https://xomtra.com";
export const REPO = "https://github.com/xomtra/xomtra";
// My Home Assistant link: adds the add-on repository in the visitor's Home Assistant.
export const MYHA = `https://my.home-assistant.io/redirect/supervisor_add_addon_repository/?repository_url=${encodeURIComponent(REPO)}`;
// Donations (GitHub Sponsors of the xomtra organization); the link shows after launch.
export const SPONSOR = "https://github.com/sponsors/xomtra";
export const CONTACT = "support@xomtra.com";
export const NOTIFY = "mailto:support@xomtra.com?subject=xomtra%20beta";
export const LANGS = ["en", "de", "cs", "pl", "nl"] as const;
export type Lang = (typeof LANGS)[number];
export const TITLES: Record<Lang, string> = {
  en: "xomtra · long-term memory for Home Assistant",
  de: "xomtra · Langzeitgedächtnis für Home Assistant",
  cs: "xomtra · dlouhodobá paměť pro Home Assistant",
  pl: "xomtra · pamięć długoterminowa dla Home Assistant",
  nl: "xomtra · langetermijngeheugen voor Home Assistant",
};
export const pathFor = (l: Lang) => (l === "en" ? "/" : `/${l}/`);
export const urlFor = (l: Lang) => SITE + pathFor(l);
// Installation guides: /install/<slug>/ in English, /<lang>/install/<slug>/ otherwise.
export const guidePath = (l: Lang, slug: string) => `${pathFor(l)}install/${slug}/`;
// Method page: /method/ in English, /<lang>/method/ otherwise.
export const methodPath = (l: Lang) => `${pathFor(l)}method/`;
// Security page: /security/ in English, /<lang>/security/ otherwise.
export const securityPath = (l: Lang) => `${pathFor(l)}security/`;
// Blog: /blog/ and /blog/<id>/ in English, /<lang>/blog/... otherwise.
export const blogPath = (l: Lang) => `${pathFor(l)}blog/`;
export const postPath = (l: Lang, id: string) => `${blogPath(l)}${id}/`;
export const LANG_NAMES: Record<Lang, string> = { en: "English", de: "Deutsch", cs: "Čeština", pl: "Polski", nl: "Nederlands" };
