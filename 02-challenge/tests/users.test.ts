import { it, beforeAll, afterAll, describe, beforeEach } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { server } from '../src/server'

describe('Users routes', () => {
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
    
    it('Should be able to create a new user', async () => {
        await request(server.server)
            .post('/users')
            .send({
                email: "user@email.com"
            })
            .expect(201)
    })
    
    it('User should be able to login', async () => {
        await request(server.server)
            .post('/users')
            .send({
                email: "user@email.com"
            })
            .expect(201)
        
        await request(server.server)
            .post('/users/login')
            .send({
                email: "user@email.com"
            })
            .expect(200)
    })

})