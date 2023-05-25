import fastify, { FastifyInstance } from "fastify";
import cookie from '@fastify/cookie'
import { userRoutes } from "./routes/user-routes";
import { mealRoutes } from "./routes/meal-routes";

export const server: FastifyInstance = fastify()

server.register(cookie)
server.register(userRoutes, {prefix: 'users'})
server.register(mealRoutes, {prefix: 'meals'})