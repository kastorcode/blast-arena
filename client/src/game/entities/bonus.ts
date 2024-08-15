import { TILE_SIZE } from '#/constants'
import { NullifyBlockDTO } from '#/dto'
import { GameState } from '~/game/entities/state'
import { isColliding } from '~/game/util/collision'
import socket from '~/services/socket'

interface BonusProps {
  axes  : [number, number]
  bonus : number
  state : GameState
  x     : number
  y     : number
}

export interface Bonus {
  axes   : [number, number]
  bonus  : number
  sprite : HTMLImageElement
  t      : 'B'
  x      : number
  y      : number
  tick   : (state:GameState) => void
  render : (context:CanvasRenderingContext2D) => void
}

const BONUS:{[key:number]:(props:BonusProps) => Bonus} = {
  1:BombBonus,
  2:BombBonus,
  3:BombBonus,
  4:BombBonus,
  5:BombBonus,
  6:BombBonus,
  7:BombBonus,
  8:BombBonus
}

export function BonusFactory (props:BonusProps) : Bonus {
  return BONUS[props.bonus](props)
}

function BombBonus (props:BonusProps) : Bonus {
  const bomb:Bonus = {
    axes  : props.axes,
    bonus : props.bonus,
    sprite: new Image(),
    t     : 'B',
    x     : props.x,
    y     : props.y,
    tick: (state:GameState) => {
      if (isColliding(state.players.myself!, bomb)) {
        const dto:NullifyBlockDTO = {a:bomb.axes}
        socket.emit('nb', dto)
        state.blocks.destroyBlock(bomb.axes, state)
        state.players.myself!.bombs++
      }
    },
    render: (context:CanvasRenderingContext2D) => {
      context.drawImage(bomb.sprite, 0, 0, TILE_SIZE, TILE_SIZE, bomb.x, bomb.y, TILE_SIZE, TILE_SIZE)
    }
  }
  bomb.sprite.src = `/sprites/bombs/${props.state.bomb}.png`
  return bomb
}