import { FastifyReply, FastifyRequest } from "fastify"

export async function checkIfUserIdExists(request: FastifyRequest, response: FastifyReply) {
    const { userId } = request.cookies
    if(!userId) {
        return response.status(401).send({
            error: 'Unauthorized'
        })
    }
}