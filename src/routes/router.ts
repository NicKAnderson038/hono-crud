import { OpenAPIHono } from '@hono/zod-openapi'
import { Hono } from 'hono'
import type { Env, Schema } from 'hono'
import { basicAuth } from 'hono/basic-auth'
import { HTTPException } from 'hono/http-exception'
import { decode, jwt, verify } from 'hono/jwt'
import type { JwtVariables } from 'hono/jwt'
import { BASE_PATH, JWT_SECRET_KEY } from '../../env.ts'
import { adminRoleMiddleware } from '../utils/roleHandler.ts'
import { ttlCache } from '../utils/tokenBlackList.js'
import { admin } from './protected/admin.ts'
import { article } from './protected/article.ts'
import { book } from './protected/book.ts'
import { example, exampleDoc } from './public/example.ts'

const ROUTES = [
    ['/example', example, exampleDoc],
    ['/book', book],
    ['/article', article],
    ['/admin', admin],
]

type Variables = JwtVariables

export const routes = new Hono<{
    Variables: Variables
}>().basePath(BASE_PATH)

export const docs = new OpenAPIHono()

// Conditionally setting authentication middleware
for (const [path] of ROUTES) {
    /* PUBLIC ROUTES: SKIP */
    if (path === '/example') continue

    /* PROTECTED ROUTES: USE */
    if (path === '/admin') {
        // is token blacklisted?
        routes.use(`${path}/*`, async (c, next) => {
            const token = `${c.req.header('authorization')?.replace('Bearer ', '')}`
            console.log(ttlCache.size) // How many rows are available in the cache
            if (ttlCache.has(token)) {
                throw new HTTPException(401, { message: 'Blacklisted Token' })
            }
            console.log('BLACKLISTED TOKEN: ', false)
            await next()
        })

        // valid token & (none-expired)
        routes.use(
            `${path}/*`,
            jwt({
                secret: JWT_SECRET_KEY,
            })
        )

        // Education on using jwt features w/o default jwt middleware
        // routes.use(`${path}/*`, async (c, next) => {
        //     const jwtMiddleware = jwt({
        //         secret: JWT_SECRET_KEY,
        //     })
        //     return jwtMiddleware(c, next)
        //     // return next()
        // })

        routes.use(`${path}/*`, adminRoleMiddleware) // all these routes will check for admin role

        continue
    }

    /* PROTECTED ROUTES: USE */
    if (path === '/book' || path === '/article') {
        routes.use(
            `${path}/*`,
            basicAuth({
                username: 'hono',
                password: 'acoolproject',
            })
        )
    }
}

// Binding All Routes
for (const [path, route, doc] of ROUTES) {
    routes.route(path as string, route as Hono<Env, Schema, string>)
    if (doc) {
        docs.route(path as string, doc as Hono<Env, Schema, string>)
    }
}
