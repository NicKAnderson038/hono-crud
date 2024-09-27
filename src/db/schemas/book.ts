import {
    numeric,
    pgTable,
    serial,
    timestamp,
    varchar,
} from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

export const book = pgTable('book_table', {
    id: serial('id').primaryKey(),
    number: numeric('number'),
    book: varchar('book'),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at'),
})

export const insertBookSchema = createInsertSchema(book, {
    number: z.number(),
})

export const selectBookSchema = createSelectSchema(book, {
    id: z.number(),
    number: z.number().optional(),
})
