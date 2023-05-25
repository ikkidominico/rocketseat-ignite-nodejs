import fs from 'fs'
import { parse } from 'csv-parse';

const parser = fs.createReadStream('tasks.csv').pipe(parse({ from_line: 2 }))

for await (const record of parser) {
    const [title, description] = record
    await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title,
            description
        })
    })
}