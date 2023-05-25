import { Knex, knex as setup } from "knex"
import { environment } from "../src/environment"

export const config: Knex.Config = {
    client: "sqlite3",
    connection: {
        filename: environment.DATABASE_URL
    },
    useNullAsDefault: true,
    migrations: {
        extension: 'ts',
        directory: './db/migrations'
    }
}

export const knex = setup(config)