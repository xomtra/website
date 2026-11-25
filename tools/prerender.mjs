// Pre-render pages: run the page script once in headless Chromium, then save the
// resulting DOM without any <script> except JSON-LD. Usage: node prerender.mjs '<json jobs>'
import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const jobs = JSON.parse(process.argv[2]);

const browser = await chromium.launch();
const page = await browser.newPage();
// Fonts come from Google Fonts at runtime; block them here so the build works offline.
await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
for (const job of jobs) {
  await page.goto(pathToFileURL(job.in).href);
  await page.waitForSelector("#app .hero");
  const html = await page.evaluate(() => {
    document.querySelectorAll('script:not([type="application/ld+json"])').forEach((s) => s.remove());
    return "<!doctype html>\n" + document.documentElement.outerHTML + "\n";
  });
  writeFileSync(job.out, html);
}
await browser.close();
