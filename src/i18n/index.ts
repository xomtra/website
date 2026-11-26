import data from "./strings.json";
import type { Lang } from "../config";

export type Strings = (typeof data.T)["en"];
export const T = data.T as Record<Lang, Strings>;
export const LEG = data.LEG as Record<Lang, [string, string]>;
export type Flow = (typeof data.FLOW)["en"];
export const FLOW = data.FLOW as Record<Lang, Flow>;
export const stripTags = (s: string) => s.replace(/<[^>]+>/g, "");

// Installation guides (/install/<slug>/ and /<lang>/install/<slug>/). Code blocks are
// shared by all languages (code.json); a block is a paragraph (HTML string),
// {code: key}, {ul: [...]}, {note: html} or {myha: 1} (Add to Home Assistant button).
import en from "./guides/en.json";
import de from "./guides/de.json";
import cs from "./guides/cs.json";
import pl from "./guides/pl.json";
import nl from "./guides/nl.json";
import code from "./code.json";

export const GUIDES = ["home-assistant", "docker"] as const;
export type GuideSlug = (typeof GUIDES)[number];
export type Block = string | { code: string } | { ul: string[] } | { note: string } | { myha: number };
export type Guide = { name: string; title: string; desc: string; lead: string; facts: string[][]; steps: { h: string; b: Block[] }[] };
type GuideFile = { ui: typeof en.ui } & Record<GuideSlug, Guide>;
export const G = { en, de, cs, pl, nl } as unknown as Record<Lang, GuideFile>;
export const CODE = code as Record<string, string>;

// Method page (/method/ and /<lang>/method/): sections of blocks like the guides, plus the
// texts of its illustrations.
import men from "./method/en.json";
import mde from "./method/de.json";
import mcs from "./method/cs.json";
import mpl from "./method/pl.json";
import mnl from "./method/nl.json";
export type MethodBlock = string | { ul: string[] } | { note: string };
export type MethodText = Omit<typeof men, "sections"> & { sections: { id: string; h: string; fig?: "prep" | "struct" | "anom"; b: MethodBlock[] }[] };
export const M = { en: men, de: mde, cs: mcs, pl: mpl, nl: mnl } as unknown as Record<Lang, MethodText>;
