// Blog posts: src/content/blog/<lang>/<id>.md, edited in Pages CMS (.pages.yml) or by hand.
// The same <id> in several language folders makes those files translations of one post.
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({ pattern: "*/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    date: z.coerce.date(),
    kind: z.enum(["news", "article"]).default("news"),
    draft: z.boolean().default(false),
    image: z.string().optional(),
    image_alt: z.string().optional(),
  }),
});

export const collections = { blog };
