import { randomUUID } from 'node:crypto'
import { Database } from '../db/database.js'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (request, response) => {
            const { search } = request.query
            const tasks = database.select('tasks', null, search ? {
                title: search,
                description: search
            }: null)
            return response.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'GET',
        path: buildRoutePath('/tasks/:id'),
        handler: (request, response) => {
            const { id } = request.params
            const task = database.select('tasks', id, null)
            if(!task){
                return response.writeHead(404).end(JSON.stringify({ message: `task ${id} not found` }))
            }
            return response.end(JSON.stringify(task))
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (request, response) => {
            const { title, description } = request.body
            if (!title) {
                return response.writeHead(400).end(JSON.stringify({ message: 'title is required' }))
            }
            if (!description) {
                return response.writeHead(400).end(JSON.stringify({ message: 'description is required' }))
            }
            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: new Date().toLocaleString(),
                updated_at: new Date().toLocaleString()
            }
            database.insert('tasks', task)
            return response.writeHead(201).end()
        }
    },
    {
        method: "PUT",
        path: buildRoutePath('/tasks/:id'),
        handler: (request, response) => {
            const { id } = request.params
            const task = database.select('tasks', id, null)
            if(!task){
                return response.writeHead(404).end(JSON.stringify({ message: `task ${id} not found` }))
            }
            const { title, description } = request.body
            if (!title && !description) {
                return response.writeHead(400).end(JSON.stringify({ message: 'title or description are required' }))
            }
            database.update('tasks', id, {
                title, 
                description,
                updated_at: new Date().toLocaleString()
            })
            return response.writeHead(204).end()
        }
    },
    {
        method: "PATCH",
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (request, response) => {
            const { id } = request.params
            const task = database.select('tasks', id, null)
            if(!task){
                return response.writeHead(404).end(JSON.stringify({ message: `task ${id} not found` }))
            }
            if(!task.completed_at){
                database.update('tasks', id, {
                    completed_at: new Date().toLocaleString()
                })
            } else {
                database.update('tasks', id, {
                    completed_at: null
                })
            }
            return response.writeHead(204).end()
        }
    },
    {
        method: "DELETE",
        path: buildRoutePath('/tasks/:id'),
        handler: (request, response) => {
            const { id } = request.params
            const task = database.select('tasks', id, null)
            if(!task){
                return response.writeHead(404).end(JSON.stringify({ message: `task ${id} not found` }))
            }
            database.delete('tasks', id)
            return response.writeHead(204).end()
        }
    }
]