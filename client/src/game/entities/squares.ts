import { SIDES, SquareDTO } from '#/dto'
import { Stage } from '~/game/entities/stage'
import { isColliding } from '~/game/util/collision'
import { Player } from './player'

export interface Square {
  bonus : number
  x     : number
  y     : number
  sides       : { [key in SIDES] : (p : Player) => void }
  tick        : (player : Player) => boolean
  render      : (context : CanvasRenderingContext2D, stage : Stage) => void
}

export function SquaresFactory (squares : (SquareDTO|null)[][]) : (Square|null)[][] {
  return squares.map(row => row.map(dto => {
    if (!dto) return null
    // @ts-expect-error
    const square:Square = {
      bonus: dto.b,
      x    : dto.x,
      y    : dto.y
    }
    square.sides = {
      U: collidedDown.bind(square),
      D: collidedUp.bind(square),
      L: collidedRight.bind(square),
      R: collidedLeft.bind(square)
    }
    square.tick = tick.bind(square)
    square.render = render.bind(square)
    return square
  }))
}

function collidedUp (this : Square, p : Player) {
  p.y = this.y - 23
}

function collidedDown (this : Square, p : Player) {
  p.y = this.y + 9
}

function collidedLeft (this : Square, p : Player) {
  p.x = this.x - 15
}

function collidedRight (this : Square, p : Player) {
  p.x = this.x + 17
}

function tick (this : Square, player : Player) : boolean {
  const colliding = isColliding(player, this)
  if (colliding) {
    player.moving = 0
    this.sides[player.side](player)
  }
  return colliding
}

function render (this : Square, context : CanvasRenderingContext2D, stage : Stage) {
  context.drawImage(stage.bg, 0, 208, 16, 16, this.x, this.y, 16, 16)
}