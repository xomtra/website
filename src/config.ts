// Launch switch: false = "public beta coming soon". Set PUBLIC_LAUNCHED=1 in Cloudflare Pages on launch day.
export const LAUNCHED = import.meta.env.PUBLIC_LAUNCHED === "1";
export const SITE = "https://xomtra.com";
export const REPO = "https://github.com/xomtra/xomtra";
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
