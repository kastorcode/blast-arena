import { MAX_SPEED, SPEED, TILE_SIZE } from '#/constants'
import { NullifyBlockDTO } from '#/dto'
import { PassFactory } from '~/game/entities/pass'
import { GameState } from '~/game/entities/state'
import { isCollidingForced } from '~/game/util/collision'
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
  3:InvertBonus,
  4:InvertBonus,
  5:SpeedBonus,
  6:SlowBonus,
  7:PassBonus,
  8:InvertBonus,
  9:KillBonus
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

function SpeedBonus (props:BonusProps) : Bonus {
  const speed:Bonus = {
    axes  : props.axes,
    bonus : props.bonus,
    sprite: new Image(),
    t     : 'B',
    x     : props.x,
    y     : props.y,
    tick: (state:GameState) => {
      collided(state, speed, () => {
        if (state.players.myself!.speed < MAX_SPEED) state.players.myself!.speed += 0.1
      })
    },
    render: (context:CanvasRenderingContext2D) => {
      context.drawImage(speed.sprite, 0, 48, TILE_SIZE, TILE_SIZE, speed.x, speed.y, TILE_SIZE, TILE_SIZE)
    }
  }
  speed.sprite.src = `/sprites/bonus/${props.state.bonus}.png`
  return speed
}

function SlowBonus (props:BonusProps) : Bonus {
  const slow:Bonus = {
    axes  : props.axes,
    bonus : props.bonus,
    sprite: new Image(),
    t     : 'B',
    x     : props.x,
    y     : props.y,
    tick: (state:GameState) => {
      collided(state, slow, () => {
        state.players.myself!.speed = SPEED - 0.1
      })
    },
    render: (context:CanvasRenderingContext2D) => {
      context.drawImage(slow.sprite, 0, 64, TILE_SIZE, TILE_SIZE, slow.x, slow.y, TILE_SIZE, TILE_SIZE)
    }
  }
  slow.sprite.src = `/sprites/bonus/${props.state.bonus}.png`
  return slow
}

function PassBonus (props:BonusProps) : Bonus {
  const pass:Bonus = {
    axes  : props.axes,
    bonus : props.bonus,
    sprite: new Image(),
    t     : 'B',
    x     : props.x,
    y     : props.y,
    tick: (state:GameState) => {
      collided(state, pass, () => {
        state.entities.add(PassFactory({state}))
      })
    },
    render: (context:CanvasRenderingContext2D) => {
      context.drawImage(pass.sprite, 0, 80, TILE_SIZE, TILE_SIZE, pass.x, pass.y, TILE_SIZE, TILE_SIZE)
    }
  }
  pass.sprite.src = `/sprites/bonus/${props.state.bonus}.png`
  return pass
}

function InvertBonus (props:BonusProps) : Bonus {
  const invert:Bonus = {
    axes  : props.axes,
    bonus : props.bonus,
    sprite: new Image(),
    t     : 'B',
    x     : props.x,
    y     : props.y,
    tick: (state:GameState) => {
      collided(state, invert, () => {
        state.players.myself!.invertControls()
        state.entities.entities.forEach(e => {
          e['invertControls'] && e['invertControls']()
        })
      })
    },
    render: (context:CanvasRenderingContext2D) => {
      context.drawImage(invert.sprite, 0, 96, TILE_SIZE, TILE_SIZE, invert.x, invert.y, TILE_SIZE, TILE_SIZE)
    }
  }
  invert.sprite.src = `/sprites/bonus/${props.state.bonus}.png`
  return invert
}

function KillBonus (props:BonusProps) : Bonus {
  const kill:Bonus = {
    axes  : props.axes,
    bonus : props.bonus,
    sprite: new Image(),
    t     : 'B',
    x     : props.x,
    y     : props.y,
    tick: (state:GameState) => {
      collided(state, kill, () => {
        state.players.myself!.kill(true, state)
      })
    },
    render: (context:CanvasRenderingContext2D) => {
      context.drawImage(kill.sprite, 0, 112, TILE_SIZE, TILE_SIZE, kill.x, kill.y, TILE_SIZE, TILE_SIZE)
    }
  }
  kill.sprite.src = `/sprites/bonus/${props.state.bonus}.png`
  return kill
}

function collided (state:GameState, bonus:Bonus, callback:()=>void) {
  if (isCollidingForced(state.players.myself!, bonus)) {
    const dto:NullifyBlockDTO = {a:bonus.axes}
    socket.emit('nb', dto)
    state.blocks.destroyBlock(bonus.axes, state)
    callback()
  }
}