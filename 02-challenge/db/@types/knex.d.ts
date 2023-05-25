import { Knex } from 'knex'

declare module 'knex/types/tables' {
    export interface Tables {
        users: {
            id: string,
            email: string,
            created_at: string,
        },
        meals: {
            id: string,
            name: string,
            description: string,
            date: string,
            time: string,
            is_on_diet: boolean,
            created_at: string,
            user_id?: string,
        }
    }
}