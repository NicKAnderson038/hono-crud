import { eq, gte, lt, ne, sql } from 'drizzle-orm'
import { Hono } from 'hono'
import { db } from '../../db/index.js'
import {
    article as articleTable,
    insertArticleSchema,
    selectArticleSchema,
} from '../../db/schemas/article.js'
import { response200, zValidatorJson } from '../../utils/responseHandler.js'

/**
 * How Pick works. Zod only validates those properties against the schema.
 * After successful validation, the picked properties are returned and the rest are removed.
 * Basically can send anything, but only the picked properties are validated.
 */
const schemaPost = insertArticleSchema.pick({ number: true, article: true }) // pick &/or omit
const schemaUpdate = insertArticleSchema.pick({
    id: true,
    number: true,
    article: true,
})
const schema = selectArticleSchema // TODO: where can i use this? why have it?

export const article = new Hono()
    .get('/', async c => {
        const data = await db.select().from(articleTable)
        return c.json(response200(data, 'Get All Records'))
    })
    .get('/:id{[0-9]+}', async c => {
        const id = Number.parseInt(c.req.param('id'))
        const data = await db
            .select({
                id: articleTable.id,
                number: articleTable.number,
                article: articleTable.article,
                created_at: articleTable.created_at,
                updated_at: articleTable.updated_at,
            })
            .from(articleTable)
            .where(eq(articleTable.id, id))
        return c.json(response200(data.pop(), `Record Id: ${id}`))
    })
    .post('/', zValidatorJson(schemaPost), async c => {
        const body = c.req.valid('json')
        console.log(body)
        const data = await db
            .insert(articleTable)
            .values({
                ...body,
                created_at: new Date(Date.now()),
                updated_at: new Date(Date.now()),
            })
            .returning({
                number: articleTable.number,
                article: articleTable.article,
            })
        c.status(201)
        return c.json(response200(data.pop(), 'Article successful created'))
    })
    .put('/', zValidatorJson(schemaUpdate), async c => {
        const body = c.req.valid('json')
        console.log(body)
        const data = await db
            .update(articleTable)
            .set({
                ...body,
                updated_at: new Date(Date.now()),
            })
            .where(eq(articleTable.id, body.id))
            .returning({
                number: articleTable.number,
                article: articleTable.article,
            })
        c.status(201)
        return c.json(response200(data.pop(), 'Article successful updated'))
    })
    .delete('/:id{[0-9]+}', async c => {
        const id = Number.parseInt(c.req.param('id'))
        console.log('DELETE /:id', id)
        try {
            await db.delete(articleTable).where(eq(articleTable.id, id))
            return c.json(
                response200(null, `Record Id: ${id} successfully deleted`)
            )
        } catch (err) {
            // throw new Error(err)
            if (err instanceof Error) {
                throw new Error(err.message)
            }
            throw new Error('An unknown error occurred')
            
        }
    })
