import '~/global'
import cors from 'cors'
import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { CORS, PORT } from '~/constants'
import ioListener from '~/ioListener'
import router from '~/router'

const app = express()
const server = http.createServer(app)
const io = new Server(server, { cors: CORS })

app.use(cors(CORS))
app.use('/', router)
ioListener(io)

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})