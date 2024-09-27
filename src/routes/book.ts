import { eq, gte, lt, ne, sql } from 'drizzle-orm'
import { Hono } from 'hono'
import { db } from '../db/index.js'
import { book as bookTable, insertBookSchema } from '../db/schemas/book'
import { response200, zValidatorJson } from '../utils/responseHandler.js'

const schemaPost = insertBookSchema.pick({ number: true, book: true })
const schemaUpdate = insertBookSchema.pick({
    id: true,
    number: true,
    book: true,
})

export const book = new Hono()
    .get('/', async c => {
        const data = await db.select().from(bookTable)
        return c.json(response200(data, `Get All Records`))
    })
    .get('/:id{[0-9]+}', async c => {
        const id = Number.parseInt(c.req.param('id'))
        const data = await db
            .select({
                id: bookTable.id,
                number: bookTable.number,
                book: bookTable.book,
                created_at: bookTable.created_at,
                updated_at: bookTable.updated_at,
            })
            .from(bookTable)
            .where(eq(bookTable.id, id))
        return c.json(response200(data.pop(), `Record Id: ${id}`))
    })
    .post('/', zValidatorJson(schemaPost), async c => {
        const body = c.req.valid('json')
        const data = await db
            .insert(bookTable)
            .values({
                ...body,
                created_at: new Date(Date.now()),
                updated_at: new Date(Date.now()),
            })
            .returning({
                number: bookTable.number,
                book: bookTable.book,
            })
        c.status(201)
        return c.json(response200(data.pop(), 'Book successful created'))
    })
    .put('/', zValidatorJson(schemaUpdate), async c => {
        const body = c.req.valid('json')
        const data = await db
            .update(bookTable)
            .set({
                ...body,
                updated_at: new Date(Date.now()),
            })
            .where(eq(bookTable.id, body.id))
            .returning({
                number: bookTable.number,
                book: bookTable.book,
            })
        c.status(201)
        return c.json(response200(data.pop(), 'Book successful updated'))
    })
    .delete('/:id{[0-9]+}', async c => {
        const id = Number.parseInt(c.req.param('id'))
        console.log('DELETE /:id', id)
        try {
            await db.delete(bookTable).where(eq(bookTable.id, id))
            return c.json(
                response200(null, `Record Id: ${id} successfully deleted`)
            )
        } catch (err) {
            if (err instanceof Error) {
                throw new Error(err.message)
            } else {
                throw new Error('An unknown error occurred')
            }
        }
    })
