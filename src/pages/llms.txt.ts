// llms.txt (https://llmstxt.org): plain Markdown summary for AI assistants.
import type { APIRoute } from "astro";
import { LAUNCHED, SITE, REPO, CONTACT, guidePath } from "../config";
import { T, G, GUIDES, stripTags } from "../i18n";

export const GET: APIRoute = () => {
  const en = T.en;
  const L: string[] = [
    "# xomtra", "", "> " + en.lead, "",
    "xomtra is an independent open source project (Apache 2.0) for Home Assistant. It is not affiliated with the Open Home Foundation or Nabu Casa.", "",
    "Status: " + (LAUNCHED ? "public beta." : `public beta coming soon. Contact ${CONTACT} to be notified.`), "",
    "## What it does", "",
    ...en.feats.map((f) => `- **${f[1]}:** ${f[2]}`),
    "", "## Compared with the built-in Home Assistant MCP server", "",
    "| | Built-in HA MCP server | xomtra |", "|---|---|---|",
    ...en.c_rows.map((r) => `| ${r[0]} | ${r[1]} | ${r[2]} |`),
    "", "## Install", "",
    ...en.inst.map((i) => `- **${i[0]}:** ${i[1]}`),
    "", "Step-by-step guides:", "",
    ...GUIDES.map((g) => `- [${G.en[g].title}](${SITE}${guidePath("en", g)})`),
    "", "## Get started", "",
    ...en.steps.map((s, i) => `${i + 1}. **${s[0]}:** ${s[1]}`),
    "", "## Example questions", "",
    ...en.qs.map((q) => `- ${q}`),
    "", "## FAQ", "",
    ...en.faq.flatMap(([q, a]) => [`### ${q}`, "", stripTags(a), ""]),
    "## Links", "",
    `- [Website](${SITE}/): English; also [Deutsch](${SITE}/de/), [Čeština](${SITE}/cs/), [Polski](${SITE}/pl/), [Nederlands](${SITE}/nl/)`,
    `- [Source code and issues](${REPO})`,
    `- Contact: ${CONTACT}`, "",
  ];
  return new Response(L.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
