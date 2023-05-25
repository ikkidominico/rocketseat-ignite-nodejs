import { config } from 'dotenv'
import { z } from 'zod'

if (process.env.NODE_ENV === 'test') {
    config({ path: '.env.test'})
} else {
    config()
}

const environmentSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
    DATABASE_URL: z.string(),
    PORT: z.coerce.number().default(3000)
})

const _environment = environmentSchema.safeParse(process.env)

if(_environment.success === false) {
    console.error('Invalid environment variables', _environment.error.format())
    throw new Error('Invalid environment variables')
}

export const environment = _environment.data