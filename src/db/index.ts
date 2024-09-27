import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import {
    DB_PORT,
    DB_HOST,
    DB_USERNAME,
    DB_PASSWORD,
    DB_NAME,
} from '../../env.js'

// const { Pool } = pkg

// const pool = new Pool({
//   connectionString: "postgres://user:password@host:port/db",
//   connectionString: `postgres://${process.env.POSTGRES_USERNAME}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`,
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
