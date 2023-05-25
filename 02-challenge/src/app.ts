import { server } from './server'
import { environment } from './environment'

server.listen({ port: environment.PORT }, (error, address) => {
    if(error) {
        server.log.error(error)
    }
    console.log(`Server is running @ ${address}`)
})