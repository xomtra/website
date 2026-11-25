import data from "./strings.json";
import type { Lang } from "../config";

export type Strings = (typeof data.T)["en"];
export const T = data.T as Record<Lang, Strings>;
export const LEG = data.LEG as Record<Lang, [string, string]>;
export const stripTags = (s: string) => s.replace(/<[^>]+>/g, "");
