import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { knex } from "../../db/knex";
import { randomUUID } from "crypto";
import { z } from "zod";
import { checkIfUserIdExists } from "../middlewares/check-if-user-id-exists";

export async function userRoutes (server: FastifyInstance) {
    server.get('/', async (request, response: FastifyReply) => {
        const users = await knex('users').select('*')
        return response.status(200).send(users)
    })

    server.post('/', async (request: FastifyRequest, response: FastifyReply) => {
        const postUserBodySchema = z.object({
            email: z.string().email(),
        })
        const { email } = postUserBodySchema.parse(request.body)

        await knex('users').insert({
            id: randomUUID(),
            email
        })

        return response.status(201).send()
    })

    server.post('/login', async (request: FastifyRequest, response: FastifyReply) => {
        const postUserLoginBodySchema = z.object({
            email: z.string().email(),
        })
        const { email } = postUserLoginBodySchema.parse(request.body)

        const user = await knex('users').where({ email }).first()

        if(!user){
            return response.status(404).send()
        }
        response.cookie('userId', user.id, {
            path: '/',
            maxAge: 1000 * 60 * 60 * 24 * 1 // 1 day
        })
        return response.status(200).send()
    })

    server.post('/logout',  {
        preHandler: [checkIfUserIdExists]
    }, async (request: FastifyRequest, response: FastifyReply) => {
        const { userId } = request.cookies

        if(userId) {
            return response.status(200).clearCookie('userId').send()
        }
    })
}