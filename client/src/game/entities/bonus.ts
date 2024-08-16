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
  2:BlastBonus,
  3:BlastBonus,
  4:BlastBonus,
  5:BlastBonus,
  6:BombBonus,
  7:BombBonus,
  8:BombBonus,
  9:BombBonus
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
      collided(state, bomb, () => {
        state.players.myself!.bombs++
      })
    },
    render: (context:CanvasRenderingContext2D) => {
      context.drawImage(bomb.sprite, 0, 0, TILE_SIZE, TILE_SIZE, bomb.x, bomb.y, TILE_SIZE, TILE_SIZE)
    }
  }
  bomb.sprite.src = `/sprites/bombs/${props.state.bomb}.png`
  return bomb
}

function BlastBonus (props:BonusProps) : Bonus {
  const blast:Bonus = {
    axes  : props.axes,
    bonus : props.bonus,
    sprite: new Image(),
    t     : 'B',
    x     : props.x,
    y     : props.y,
    tick: (state:GameState) => {
      collided(state, blast, () => {
        state.players.myself!.bombReach++
      })
    },
    render: (context:CanvasRenderingContext2D) => {
      context.drawImage(blast.sprite, 0, 0, TILE_SIZE, TILE_SIZE, blast.x, blast.y, TILE_SIZE, TILE_SIZE)
    }
  }
  blast.sprite.src = `/sprites/bonus/${props.state.bonus}.png`
  return blast
}

function collided (state:GameState, bonus:Bonus, callback:()=>void) {
  if (isColliding(state.players.myself!, bonus)) {
    const dto:NullifyBlockDTO = {a:bonus.axes}
    socket.emit('nb', dto)
    state.blocks.destroyBlock(bonus.axes, state)
    callback()
  }
}