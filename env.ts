import { z } from 'zod'

const portDescription =
    '.env files convert numbers to strings, therefore we have to enforce them to be numbers'
const portMax = 'options.port should be >= 0 and < 65536'

const EnvSchema = z.object({
    NODE_ENV: z
        .enum(['development', 'test', 'production'], {
            description: 'This gets updated depending on your environment',
        })
        .default('development'),
    BASE_PATH: z.string().min(7).default('/api/v0'),
    HONO_PORT: z.coerce
        .number({
            description: portDescription,
        })
        .positive()
        .max(65536, portMax)
        .default(3030),
    DB_USERNAME: z.string().min(1).default('postgres'),
    DB_PASSWORD: z.string().min(1).default('postgres'),
    DB_NAME: z.string().min(1).default('postgres'),
    DB_HOST: z.string().min(1).default('localhost'),
    DB_PORT: z.coerce
        .number({
            description: portDescription,
        })
        .positive()
        .max(65536, portMax)
        .default(3031),
})

export const {
    NODE_ENV,
    HONO_PORT,
    BASE_PATH,
    DB_USERNAME,
    DB_PASSWORD,
    DB_NAME,
    DB_HOST,
    DB_PORT,
} = EnvSchema.parse(process.env)
