// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    heroImage: z.string(),
    description: z.string().optional(),
  }),
});

export const collections = { blog };