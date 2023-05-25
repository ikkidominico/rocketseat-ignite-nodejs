import { it, beforeAll, afterAll, describe, beforeEach } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { server } from '../src/server'

describe('Meals routes', () => {
    beforeAll(async () => {
        await server.ready()
    })
    
    afterAll(async () => {
        await server.close()
    })

    beforeEach(async () => {
        execSync('npm run knex migrate:rollback --all')
        execSync('npm run knex migrate:latest')
    })
    
    it('User should be able to create a new meal', async () => {
        await request(server.server)
            .post('/users')
            .send({
                email: "meal@email.com"
            })
            .expect(201)

        const loginResponse = await request(server.server)
            .post('/users/login')
            .send({
                email: "meal@email.com"
            })

        const cookies = loginResponse.get('Set-Cookie')

        await request(server.server)
            .post('/meals')
            .set('Cookie', cookies)
            .send({
                name: 'New Meal',
                description: 'New Meal Description',
                date: '25/05/2023',
                time: '10:38',
                is_on_diet: true
            })
            .expect(201)
    })

})