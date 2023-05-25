import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { randomUUID } from "crypto";
import { z } from "zod";
import { knex } from "../../db/knex";
import { checkIfUserIdExists } from "../middlewares/check-if-user-id-exists";

export async function mealRoutes (server: FastifyInstance) {
    server.get('/', {
        preHandler: [checkIfUserIdExists]
    }, async (request, response: FastifyReply) => {
        const { userId } = request.cookies

        const meals = await knex('meals').where({ 'user_id': userId }).select('*')

        return response.status(200).send(meals)
    })

    server.get('/:id', {
        preHandler: [checkIfUserIdExists]
    }, async (request, response: FastifyReply) => {
        const { userId } = request.cookies

        const getMealParamsSchema = z.object({
            id: z.string().uuid()
        })
        const { id } = getMealParamsSchema.parse(request.params)

        const meal = await knex('meals').where({ id, 'user_id': userId }).select('*')

        return response.status(200).send(meal)
    })

    server.get('/metrics', {
        preHandler: [checkIfUserIdExists]
    }, async (request, response: FastifyReply) => {
        const { userId } = request.cookies

        const query = await knex('meals').where({ 'user_id': userId }).select(knex.raw("count (*) as total_meals, sum(is_on_diet) as total_meals_on_diet, sum(is_on_diet = false) as total_meals_off_diet"))

        // todo: find a better solution to longest streak on diet
        type Metrics<T> = Partial<T> & { longest_streak_on_diet: number }
        const sequence = (await knex('meals').where({ 'user_id': userId }).select('is_on_diet').orderBy('date').orderBy('time')).map(value => value.is_on_diet)
        let longest = 0
        for(let i = 0; i < sequence.length; i++) {
            let streak = 1
            for(let j = i + 1; j < sequence.length; j++) {
                if(sequence[i] === sequence[j]) {
                    streak++
                } else {
                    break
                }
            }
            if(streak > longest) {
                longest = streak
            }
        }
        const metrics: Metrics <typeof query[0]> = {
            ...query[0],
            longest_streak_on_diet: longest
        }

        return response.status(200).send(metrics)
    })
    
    server.post('/', {
        preHandler: [checkIfUserIdExists]
    }, async (request: FastifyRequest, response: FastifyReply) => {
        const { userId } = request.cookies

        const postMealBodySchema = z.object({
            name: z.string(),
            description: z.string(),
            date: z.string(),
            time: z.string(),
            is_on_diet: z.boolean()
        })
        const body = postMealBodySchema.parse(request.body)

        await knex('meals').insert({
            id: randomUUID(),
            ...body,
            user_id: userId
        })
        
        return response.status(201).send()
    })

    server.put('/:id', {
        preHandler: [checkIfUserIdExists]
    }, async (request: FastifyRequest, response: FastifyReply) => {
        const putMealParamsSchema = z.object({
            id: z.string().uuid()
        })
        const { id } = putMealParamsSchema.parse(request.params)

        const putMealBodySchema = z.object({
            name: z.string().optional(),
            description: z.string().optional(),
            date: z.string().optional(),
            time: z.string().optional(),
            is_on_diet: z.boolean().optional()
        })
        const body = putMealBodySchema.parse(request.body)

        const meal = await knex('meals').where({ id }).update({
            ...body
        })

        if(meal) {
            return response.status(200).send()
        }
        return response.status(404).send()
    })

    server.delete('/:id', {
        preHandler: [checkIfUserIdExists]
    }, async (request: FastifyRequest, response: FastifyReply) => {
        const deleteMealParamsSchema = z.object({
            id: z.string().uuid()
        })
        const { id } = deleteMealParamsSchema.parse(request.params)

        const meal = await knex('meals').where({ id }).del()

        if(meal) {
            return response.status(200).send()
        }
        return response.status(404).send()
    })
}