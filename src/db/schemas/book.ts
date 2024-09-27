import { z } from 'zod'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import {
	pgTable,
	serial,
	varchar,
	numeric,
	timestamp,
} from 'drizzle-orm/pg-core'

export const book = pgTable('book_table', {
    id: serial('id').primaryKey(),
    number: numeric('number'),
    book: varchar('book'),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at'),
})

export const insertBookSchema = createInsertSchema(book, {
	number: z.number()
})

export const selectBookSchema = createSelectSchema(book, {
	id: z.number(),
    number: z.number().optional(),
})
