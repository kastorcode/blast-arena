import { MAX_SPEED, SPEED, TILE_SIZE } from '#/constants'
import { PassFactory } from '~/game/entities/pass'
import { GameState } from '~/game/entities/state'
import { playBonusSound } from '~/game/sound/bonus'
import { Assets } from '~/game/util/assets'
import { isCollidingForced } from '~/game/util/collision'
import { emitNullifyBlock } from '~/services/socket'

interface BonusProps {
  axes  : [number, number]
  bonus : keyof typeof BONUS
  x     : number
  y     : number
}

export interface Bonus {
  axes  : [number, number]
  bonus : keyof typeof BONUS
  t     : 'B'
  x     : number
  y     : number
  tick   : (state:GameState) => void
  render : (context:CanvasRenderingContext2D) => void
}

const BONUS = {
  1:BombBonus,
  2:BlastBonus,
  3:HoldBonus,
  4:KickBonus,
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
    axes : props.axes,
    bonus: props.bonus,
    t    : 'B',
    x    : props.x,
    y    : props.y,
    tick: (state:GameState) => {
      collided(state, bomb, () => {
        state.players.myself!.bombs++
      })
    },
    render: (context:CanvasRenderingContext2D) => {
      context.drawImage(Assets.bombSprite, 0, 0, TILE_SIZE, TILE_SIZE, bomb.x, bomb.y, TILE_SIZE, TILE_SIZE)
    }
  }
  return bomb
}

function BlastBonus (props:BonusProps) : Bonus {
  const blast:Bonus = {
    axes : props.axes,
    bonus: props.bonus,
    t    : 'B',
    x    : props.x,
    y    : props.y,
    tick: (state:GameState) => {
      collided(state, blast, () => {
        state.players.myself!.bombReach++
      })
    },
    render: (context:CanvasRenderingContext2D) => {
      context.drawImage(Assets.bonusSprite, 0, 0, TILE_SIZE, TILE_SIZE, blast.x, blast.y, TILE_SIZE, TILE_SIZE)
    }
  }
  return blast
}

function HoldBonus (props:BonusProps) : Bonus {
  const hold:Bonus = {
    axes : props.axes,
    bonus: props.bonus,
    t    : 'B',
    x    : props.x,
    y    : props.y,
    tick: (state:GameState) => {
      collided(state, hold, () => {
        state.players.myself!.hold = true
      })
    },
    render: (context:CanvasRenderingContext2D) => {
      context.drawImage(Assets.bonusSprite, 0, 16, TILE_SIZE, TILE_SIZE, hold.x, hold.y, TILE_SIZE, TILE_SIZE)
    }
  }
  return hold
}

function KickBonus (props:BonusProps) : Bonus {
  const kick:Bonus = {
    axes : props.axes,
    bonus: props.bonus,
    t    : 'B',
    x    : props.x,
    y    : props.y,
    tick: (state:GameState) => {
      collided(state, kick, () => {
        state.players.myself!.kick = true
      })
    },
    render: (context:CanvasRenderingContext2D) => {
      context.drawImage(Assets.bonusSprite, 0, 32, TILE_SIZE, TILE_SIZE, kick.x, kick.y, TILE_SIZE, TILE_SIZE)
    }
  }
  return kick
}

function SpeedBonus (props:BonusProps) : Bonus {
  const speed:Bonus = {
    axes : props.axes,
    bonus: props.bonus,
    t    : 'B',
    x    : props.x,
    y    : props.y,
    tick: (state:GameState) => {
      collided(state, speed, () => {
        if (state.players.myself!.speed < MAX_SPEED) state.players.myself!.speed += 0.1
      })
    },
    render: (context:CanvasRenderingContext2D) => {
      context.drawImage(Assets.bonusSprite, 0, 48, TILE_SIZE, TILE_SIZE, speed.x, speed.y, TILE_SIZE, TILE_SIZE)
    }
  }
  return speed
}

function SlowBonus (props:BonusProps) : Bonus {
  const slow:Bonus = {
    axes : props.axes,
    bonus: props.bonus,
    t    : 'B',
    x    : props.x,
    y    : props.y,
    tick: (state:GameState) => {
      collided(state, slow, () => {
        state.players.myself!.speed = SPEED - 0.1
      })
    },
    render: (context:CanvasRenderingContext2D) => {
      context.drawImage(Assets.bonusSprite, 0, 64, TILE_SIZE, TILE_SIZE, slow.x, slow.y, TILE_SIZE, TILE_SIZE)
    }
  }
  return slow
}

function PassBonus (props:BonusProps) : Bonus {
  const pass:Bonus = {
    axes : props.axes,
    bonus: props.bonus,
    t    : 'B',
    x    : props.x,
    y    : props.y,
    tick: (state:GameState) => {
      collided(state, pass, () => {
        state.entities.add(PassFactory({state}))
      })
    },
    render: (context:CanvasRenderingContext2D) => {
      context.drawImage(Assets.bonusSprite, 0, 80, TILE_SIZE, TILE_SIZE, pass.x, pass.y, TILE_SIZE, TILE_SIZE)
    }
  }
  return pass
}

function InvertBonus (props:BonusProps) : Bonus {
  const invert:Bonus = {
    axes : props.axes,
    bonus: props.bonus,
    t    : 'B',
    x    : props.x,
    y    : props.y,
    tick: (state:GameState) => {
      collided(state, invert, () => {
        state.players.myself!.invertControls()
        state.entities.entities.forEach(e => {
          e['invertControls'] && e['invertControls']()
        })
      })
    },
    render: (context:CanvasRenderingContext2D) => {
      context.drawImage(Assets.bonusSprite, 0, 96, TILE_SIZE, TILE_SIZE, invert.x, invert.y, TILE_SIZE, TILE_SIZE)
    }
  }
  return invert
}

function KillBonus (props:BonusProps) : Bonus {
  const kill:Bonus = {
    axes : props.axes,
    bonus: props.bonus,
    t    : 'B',
    x    : props.x,
    y    : props.y,
    tick: (state:GameState) => {
      collided(state, kill, () => {
        state.players.myself!.kill(true)
      })
    },
    render: (context:CanvasRenderingContext2D) => {
      context.drawImage(Assets.bonusSprite, 0, 112, TILE_SIZE, TILE_SIZE, kill.x, kill.y, TILE_SIZE, TILE_SIZE)
    }
  }
  return kill
}

function collided (state:GameState, bonus:Bonus, callback:()=>void) {
  if (isCollidingForced(state.players.myself!, bonus)) {
    emitNullifyBlock({a:bonus.axes})
    playBonusSound(bonus.bonus)
    state.blocks.destroyBlock(bonus.axes)
    callback()
  }
}