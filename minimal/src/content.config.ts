import { glob } from 'astro/loaders'
import { defineCollection, z, type SchemaContext } from 'astro:content'

const project = defineCollection({
  loader: glob({ base: './src/content/project', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }: SchemaContext) =>
    z.object({
      order: z.number(),
      title: z.string(),
      description: z.string(),
      image: image(),
      url: z.string().url().optional(),
      gitUrl: z.string().url().optional(),
      techStack: z.string()
        .transform((val: string) => val.split(','))
        .transform((val: string[]) => val.map((item: string) => item.trim()))
        .transform((val: string[]) => val.filter((item: string) => item.length > 0))
    }),
})

const about = defineCollection({
  loader: glob({ base: './src/content', pattern: 'about.md' }),
  schema: z.object({
    title: z.string(),
  }),
})

const gig = defineCollection({
  loader: glob({ base: './src/content/gig', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    slug: z.string(),
    role: z.string(),
    name: z.string(),
    timeline: z.string(),
    techStack: z.string()
      .transform((val: string) => val.split(','))
      .transform((val: string[]) => val.map((item: string) => item.trim()))
      .transform((val: string[]) => val.filter((item: string) => item.length > 0)),
  }),
})

export const collections = { project, about, gig }