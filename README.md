# ![hono.js logo](https://hono.dev/images/logo-small.png) Hono.js Basic Crud Setup

1. Create an `.env` file

```bash
# server
HONO_PORT=<PORT_NUMBER>
BASE_PATH='/api/v1'
JWT_SECRET_KEY=your-256-bit-secret

# database
DB_HOST=localhost
DB_PORT=<PORT_NUMBER>
DB_NAME=<MY_DB>
DB_USERNAME=<MY_USERNAME>
DB_PASSWORD=<MY_PASSWORD>
```

2. Install npm dependencies

```bash
npm i
```

3. Generate migration scripts & perform migration
    - This repo was configured for `Postgres`
    - Create your `DB_NAME` before running migration scripts

```bash
npm run db-generate
npm run db-migrate
```

4. Run dev server

```bash
# Node version > 22.6.x (supports the --experimental-strip-types flag)
npm run dev-node

# Node version > 18.x
npm run dev-tsx
```

5. Console output responses
    - Check Data: `http://localhost:<HONO_PORT>/api/v1/example`
    - Swagger Docs: `http://localhost:<HONO_PORT>/ui`

6. Test Live Endpoints
    - Install [http client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) vscode extension to live test endpoints. Similar to postman or thunderclient.
    - Testable endpoints located under `src/rest-docs/*.rest`.
    - NOTE: update the variables in the `*.rest` files to match values set in `.env`.


## Folder Structure

```bash
src/
├── db/
│   ├── schemas/
│   │   └── *.ts # Drizzle-Zod Database schemas
│   └── index.ts # DB connection
├── rest-docs/
│   └── *.rest # Live REST request examples for local testing
├── routes/
│   ├── protected/ 
│   │   └── *.ts # '/UNIQUE_ROUTE/*' per file. Contains drizzle ORM queries & swagger docs
│   ├── public/
│   │   └── *.ts # '/UNIQUE_ROUTE/*' per file. Contains drizzle ORM queries & swagger docs
│   └── router.ts # combine routes & conditionally set auth middleware: public/protected routes
├── utils/
│   ├── responseHandler.js # Zod errors & successful response
│   ├── roleHandler.ts # role based middleware and individual route validation functions
│   └── tokenBlackList.js # In-memory JWT cache for invalidated tokens.
└── server.ts # app root
.env
.gitignore
.nvmrc
.prettierrc
drizzle.config.ts # Generating data migration scripts
migrate.cjs # Performs data migration
package-lock.json
package.json
README.md
tsconfig.json
```

## Package Dependencies & Tools

<div>
    <div style="display:flex;flex-direction:column; align-items:center;">
        <a href="https://hono.dev/" targer="_blank">
            <img width="300" src="https://hono.dev/images/hono-kawaii.png" alt="Hono.js kawaii logo"/>
        </a>
        <a href="https://hono.dev/" targer="_blank">Hono.js</a>
    </div>
    <br/>
    <br/>
    <div style="display:flex;flex-direction:column; align-items:center;">
        <a href="https://orm.drizzle.team/" targer="_blank">
            <img width="180" style="border-radius:8%" src="https://avatars.githubusercontent.com/u/108468352?v=4" alt="Drizzle ORM logo"/>
        </a>
        <a href="https://orm.drizzle.team/" targer="_blank">Drizzle ORM</a>
    </div>
    <br/>
    <br/>
    <div style="display:flex;flex-direction:column; align-items:center;">
        <a href="https://zod.dev/" targer="_blank">
            <img width="200" style="border-radius:8%" src="https://zod.dev/logo.svg" alt="Zod logo"/>
        </a>
        <a href="https://zod.dev/" targer="_blank">Zod</a>
    </div>
    <br/>
    <br/>
    <div style="display:flex;flex-direction:column;align-items:center;">
        <a href="https://tsx.is/" targer="_blank">
            <img width="300" src="https://tsx.is/logo-light.svg" alt="TypeScript Execute logo"/>
        </a>
        <a href="https://tsx.is/" targer="_blank">TypeScript Execute</a>
    </div>
    <br/>
    <br/>
    <div style="display:flex;flex-direction:column;align-items:center;">
        <a href="https://www.typescriptlang.org/" targer="_blank">
            <img width="180" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/1024px-Typescript_logo_2020.svg.png" alt="TypeScript logo"/>
        </a>
        <a href="https://www.typescriptlang.org/" targer="_blank">TypeScript</a>
    </div>
    <br/>
    <br/>
    <div style="display:flex;flex-direction:column;align-items:center;">
        <a href="https://www.postgresql.org/" targer="_blank">
            <img width="250" src="https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg" alt="TypeScript logo"/>
        </a>
        <a href="https://www.postgresql.org/" targer="_blank">Postgresql</a>
    </div>
</div>
