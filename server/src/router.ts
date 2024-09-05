import { Router } from 'express'
import { Server } from 'socket.io'

const router = Router()

export default (io:Server) => {
  router.get('/players/count', (request, response) => {
    return response.send(io.engine.clientsCount.toString())
  })
  return router
}