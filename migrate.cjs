const { migrate } = require('drizzle-orm/node-postgres/migrator')
const { drizzle } = require('drizzle-orm/node-postgres')
const { Client } = require('pg')

// const client = new Client({
//   connectionString: "postgres://user:password@host:port/db",
//   connectionString: `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
// });

/* or */

const client = new Client({
    port: Number(process.env.DB_PORT),
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'postgres',
})

client
    .connect()
    .then(async () => {
        const db = drizzle(client)
        await migrate(db, { migrationsFolder: 'drizzle' })
    })
    .finally(() => {
        client.end()
        console.log('\x1b[33m%s\x1b[0m', '** Migration Complete **')
        process.exit()
    })
