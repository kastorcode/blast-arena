import { FPS, MAX_PLAYERS } from './constants'
import { MaxPlayersError, PlayerNotFoundError } from './erros'
import { PlayerFactory } from './player'

class Game {

  private players    : Map<string, ReturnType<typeof PlayerFactory>>
  private intervalId : NodeJS.Timeout

  constructor () {
    this.players = new Map()
    this.intervalId = setInterval(this.tick.bind(this), FPS)
  }

  public addPlayer ({ id } : { id : string }) {
    if (this.players.size === MAX_PLAYERS) {
      throw MaxPlayersError()
    }
    this.players.set(id, PlayerFactory({ id }))
  }

  public removePlayer ({ id } : { id : string }) {
    if (!this.players.has(id)) {
      throw PlayerNotFoundError()
    }
    this.players.delete(id)
  }

  private tick () {
    this.players.forEach(player => player.tick())
    this.broadcast()
  }

  private broadcast () {}

}

export function GameFactory () {
  return new Game()
}