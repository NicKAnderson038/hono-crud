import { serve } from '@hono/node-server'
import { swaggerUI } from '@hono/swagger-ui'
import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { Hono } from 'hono'
import { etag } from 'hono/etag'
import { HTTPException } from 'hono/http-exception'
import { logger } from 'hono/logger'
import { poweredBy } from 'hono/powered-by'
import { prettyJSON } from 'hono/pretty-json' //! TODO: doesn't appear to be working
import statusCodes from 'http-status'
import { z } from 'zod'
import { HONO_PORT } from '../env'
import { docs, routes } from './router'

const app = new OpenAPIHono()

// Mount Builtin Middleware
app.use('*', poweredBy())
app.use('*', logger())
app.use(prettyJSON()) //! TODO: doesn't appear to be working
app.use('/etag/*', etag())

// Custom Middleware
// Add Custom Header
app.use('/hello/*', async (c, next) => {
    await next()
    c.header('X-message', 'This is addHeader middleware!')
})

// Add X-Response-Time header
app.use('*', async (c, next) => {
    const start = Date.now()
    await next()
    const ms = Date.now() - start
    c.header('X-Response-Time', `${ms}ms`)
})

// If serving static website files, might not need this or set it to the static folder
app.notFound(c => {
    console.error('Custom 404 Not Found')
    return c.text('Custom 404 Not Found', 404)
})

app.onError((error, c) => {
    console.log('\x1b[31m%s\x1b[0m', 'Error caught in onError 🔥')

    if (error instanceof HTTPException) {
        const err = error.getResponse()
        const { status } = err

        return c.json(
            {
                error: {
                    name: 'HTTPException',
                    key: statusCodes[
                        `${status}_NAME` as keyof typeof statusCodes
                    ],
                    detailed:
                        statusCodes[
                            `${status}_MESSAGE` as keyof typeof statusCodes
                        ],
                    message: statusCodes[status as keyof typeof statusCodes],
                },
                message: statusCodes[status as keyof typeof statusCodes],
                success: false,
            },
            status as any
        )
    }

    return c.json(
        {
            error,
            message: error?.message || 'Unknown Error',
            success: false,
        },
        500
    )
})

app.get('/ui', swaggerUI({ url: `/doc` }))
app.doc('/doc', {
    openapi: '3.1.0',
    info: {
        version: '1.0.0',
        title: 'Hono Example',
    },
})

app.route('/', routes)
app.route('/', docs)

console.log('\x1b[33m%s\x1b[0m', `Server is running on port: ${HONO_PORT} \n`)
console.log('\x1b[32m%s\x1b[0m', 'Swagger Docs 🔗')
console.log('\x1b[4m%s\x1b[0m', `http://localhost:${HONO_PORT}/ui`, '\n')

serve({
    fetch: app.fetch,
    port: HONO_PORT,
})
