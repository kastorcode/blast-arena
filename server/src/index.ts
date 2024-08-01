import { Server } from 'ws'
import { PORT } from './constants'
import { GameFactory } from './game'

const server = new Server({ port: PORT })
const game = GameFactory()

server.on('connection', ws => {
  const id = Math.random().toString(36).substring(2, 15)
  game.addPlayer({ id })
  ws.on('close', () => {
    game.removePlayer({ id })
  })
  ws.on('message', message => {
    console.log(message)
  })
})

console.log(`Server listening on port ${PORT}`)