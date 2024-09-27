import {
    numeric,
    pgTable,
    serial,
    timestamp,
    varchar,
} from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

export const article = pgTable('article_table', {
    id: serial('id').primaryKey(),
    number: numeric('number'),
    article: varchar('article'),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at'),
})

export const insertArticleSchema = createInsertSchema(article, {
    number: z.number(),
})

export const selectArticleSchema = createSelectSchema(article, {
    id: z.number(),
    number: z.number().optional(),
})
