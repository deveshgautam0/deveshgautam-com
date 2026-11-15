import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
const kebab = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9.]+/g, '-').replace(/^-+|-+$/g, '');
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    category: z.string().transform(kebab),
    tags: z.array(z.string().transform(kebab)).default([]),
    heroImage: z.string().optional(),
    heroAlt: z.string().default(''),
    draft: z.boolean().default(false),
  }),
});
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    heroImage: z.string().optional(),
    heroAlt: z.string().default(''),
    demoUrl: z.string().optional(),
    repoUrl: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});
export const collections = { blog, projects };
