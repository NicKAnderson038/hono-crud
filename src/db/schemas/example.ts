import {
    boolean,
    date,
    integer,
    numeric,
    pgTable,
    serial,
    text,
    timestamp,
    varchar,
} from 'drizzle-orm/pg-core'
// import { z } from 'zod'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

// export const tableSchema = z.object({
//     id: z.number().int().positive().min(1),
//     number: z.number().positive(),
//     article: z.string().min(3).max(255),
//     book: z.string().min(3).max(255),
// })

export const example = pgTable('example_table', {
    id: serial('id').primaryKey(),
    email: varchar('email'),
    password: varchar('password'),
    first_name: varchar('first_name'),
    middle_name: varchar('middle_name'),
    last_name: varchar('last_name'),
    avatar: text('avatar'),
    role: varchar('role'),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at'),
    last_login: timestamp('last_login'),
})

// Schema for inserting a user - can be used to validate API requests
export const insertExampleSchema = createInsertSchema(example)

// Schema for selecting a user - can be used to validate API responses
export const selectExampleSchema = createSelectSchema(example)
