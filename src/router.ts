import { Hono } from 'hono'
import { OpenAPIHono } from '@hono/zod-openapi'
import { basicAuth } from 'hono/basic-auth'
import { example, exampleDoc } from './routes/example'
import { article } from './routes/article'
import { book } from './routes/book'
import { BASE_PATH } from '../env'

const ROUTES = [
    ['/example', example, exampleDoc],
    ['/book', book],
    ['/article', article],
]

export const routes = new Hono().basePath(BASE_PATH)

export const docs = new OpenAPIHono()

// Conditionally setting authentication middleware
ROUTES.forEach(([path]) => {
    /* PUBLIC ROUTES: SKIP */
    if (path === '/example') return

    /* PRIVATE ROUTES: USE */
    routes.use(
        `${path}/*`,
        basicAuth({
            username: 'hono',
            password: 'acoolproject',
        })
    )
})

// Binding All Routes
for (const [path, route, doc] of ROUTES) {
    routes.route(path as any, route as any)
    if (doc) {
        docs.route(path as any, doc as any)
    }
}
