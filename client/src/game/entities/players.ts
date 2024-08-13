import { INITIAL_POSITION, SPEED } from '#/constants'
import { PlayerDTO } from '#/dto'
import { Player, PlayerFactory } from '~/game/entities/player'

export interface Players {
  myself ?: Player
  players : Player[]
  setMyself : (index:number) => void
  tick      : () => void
  render    : (context:CanvasRenderingContext2D) => void
}

export function PlayersFactory (playerDto:PlayerDTO[]) : Players {
  const players:Player[] = playerDto.map((dto,index) => PlayerFactory({
    ...dto,
    index,
    speed: SPEED,
    x: INITIAL_POSITION[index][0],
    y: INITIAL_POSITION[index][1]
  }))
  return {players, setMyself, tick, render}
}

function setMyself (this:Players, index:number) {
  this.myself = this.players[index]
  this.myself.setMyself()
}

function tick (this:Players) {
  this.players.forEach(p => p.tick())
}

function render (this:Players, context:CanvasRenderingContext2D) {
  this.players.forEach(p => p.render(context))
}