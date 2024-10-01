import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { eq, gte, lt, ne, sql, desc } from 'drizzle-orm'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { z } from 'zod'
import { BASE_PATH } from '../../../env.js'
import { db } from '../../db/index'
import {
    example as exampleTable,
    selectExampleSchema,
} from '../../db/schemas/example.js'
import { response200, zValidatorJson } from '../../utils/responseHandler.js'
import { ttlCache } from '../../utils/tokenBlackList.js'

export const example = new Hono()
    // .get('/', c => { throw new HTTPException(403, { message: 'Custom error message' })})
    .get('/', c => new Response("Health Check 🥦: Api's are running 🍻"))
    .get('/db', async c => {
        const data = await db
            .select({
                id: exampleTable.id,
                email: exampleTable.email,
                firstName: exampleTable.first_name,
                middleName: exampleTable.middle_name,
                lastName: exampleTable.last_name,
            })
            .from(exampleTable)
            .where(eq(exampleTable.role, 'CUSTODIAN'))
        return c.json(data)
    })
    .get('/redirect', c => c.redirect(BASE_PATH))
    // ETag
    .get('/etag/cached', c => c.text('Is this cached?'))
    // External fetch
    .get('/fetch-url', async c => {
        const response = await fetch('https://example.com/')
        return c.text(`https://example.com/ is ${response.status}`)
    })
    // Request headers
    .get('/user-agent', c => {
        const userAgent = c.req.header('User-Agent')
        return c.text(`Your UserAgent is ${userAgent}`)
    })
    .get('/black-list-token', async c => {
        const token = await `${c.req
            .header('authorization')
            ?.replace('Bearer ', '')}`
        console.log(token)
        console.log('SET CACHE SET CACHE SET CACHE SET CACHE')
        ttlCache.set(token, 'JWT_TOKEN')
        const payload = c.get('jwtPayload')

        const [data] = await db
            .select({
                id: exampleTable.id,
            })
            .from(exampleTable)
            .orderBy(desc(exampleTable.id)) // Assuming 'id' is your primary key or timestamp field
            .limit(1)
        ttlCache.max = 100 + data?.id
        return c.json(payload)
    })

export const exampleDoc = new OpenAPIHono()
    .openapi(
        createRoute({
            method: 'get',
            path: '/',
            responses: {
                200: {
                    description: '🥦 response',
                },
            },
            tags: ['Health Check!!'],
        }),
        () => {
            return new Response(
                "Open Api Health Check 🥦: Api's are running 🍻"
            )
        }
    )
    .openapi(
        createRoute({
            method: 'get',
            path: '/db',
            responses: {
                200: {
                    content: {
                        'application/json': {
                            schema: selectExampleSchema,
                        },
                    },
                    description: 'Get table response',
                },
            },
            tags: ['Health Check!!'],
        }),
        (c: { json: (arg0: {}) => any }) => {
            return c.json({
                id: 1,
                email: 'email@mail.com',
                firstName: 'John',
                middleName: 'Doe',
                lastName: 'Smith',
            })
        }
    )
