import { drizzle } from 'drizzle-orm/node-postgres'
import pkg from 'pg'
import {
    DB_HOST,
    DB_NAME,
    DB_PASSWORD,
    DB_PORT,
    DB_USERNAME,
} from '../../env.ts'

const { Pool } = pkg

// const pool = new Pool({
//   connectionString: "postgres://user:password@host:port/db_name",
//   connectionString: `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
// });

/* or */

const pool = new Pool({
    port: DB_PORT,
    host: DB_HOST,
    user: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
})

export const db = drizzle(pool)
