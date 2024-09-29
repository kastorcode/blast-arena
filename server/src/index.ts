import '~/global'
import cors from 'cors'
import express from 'express'
import { Server } from 'socket.io'
import { CORS, PORT } from '~/constants'
import ioListener from '~/ioListener'
import router from '~/router'
import { getServer } from '~/util'

const app = express()
const server = getServer(app)
const io = new Server(server, {cors:CORS})

app.use(cors(CORS))
app.use('/', router(io))
ioListener(io)

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})