import { Animation } from '~/game/animations/animation'
import { PLAYER_D } from '~/game/animations/playerDown'
import { PLAYER_DH } from '~/game/animations/playerDownHolding'
import { PLAYER_U } from '~/game/animations/playerUp'
import { PLAYER_UH } from '~/game/animations/playerUpHolding'

interface PlayerProps {
  id     : string
  index  : number
  sprite : string
}

const KEYBOARD_KEYS : { [key : string] : 'D'|'L'|'R'|'U' } = {
  'A': 'L',
  'D': 'R',
  'S': 'D',
  'W': 'U',
  'ARROWDOWN': 'D',
  'ARROWLEFT': 'L',
  'ARROWRIGHT': 'R',
  'ARROWUP': 'U'
}

class Player {

  private anim   : {
    frameCurrent : number
    lastRender   : number
  }
  private holding  : boolean
  private id       : string
  private index    : number
  private moving   : boolean
  private side     : 'D'|'L'|'R'|'U'
  private sprite   : HTMLImageElement
  private tileSize : number
  private x        : number
  private y        : number

  constructor ({ id, index, sprite } : PlayerProps) {
    this.anim = {
      frameCurrent: 0, lastRender: 0
    }
    this.holding    = false
    this.id         = id
    this.index      = index
    this.moving     = false
    this.side       = 'D'
    this.tileSize   = 16
    this.x          = 0
    this.y          = 0
    this.sprite     = new Image()
    this.sprite.src = `/sprites/chars/${sprite}.png`
  }

  public addKeyboardListener () {
    document.addEventListener('keydown', this.keydownListener.bind(this))
    document.addEventListener('keyup', this.keyupListener.bind(this))
  }

  public removeKeyboardListener () {
    document.removeEventListener('keydown', this.keydownListener.bind(this))
    document.removeEventListener('keyup', this.keyupListener.bind(this))
  }

  private keydownListener (event : KeyboardEvent) {
    const key = event.key.toUpperCase()
    this.side = KEYBOARD_KEYS[key]
    this.moving = true
  }

  private keyupListener (event : KeyboardEvent) {
    this.moving = false
  }

  public setX (x : number) {
    this.x = x
  }

  public setY (y : number) {
    this.y = y
  }

  private animate (DATA : Animation) {
    const currentTime = Date.now()
    if (currentTime - this.anim.lastRender > DATA.ANIM_INTERVAL) {
      this.anim.frameCurrent++
      if (this.anim.frameCurrent > DATA.FRAME_END) {
        this.anim.frameCurrent = DATA.FRAME_START
      }
      this.anim.lastRender = currentTime
    }
    return {
      sx: this.anim.frameCurrent * DATA.FRAME_WIDTH,
      sy: DATA.COLUMN * DATA.FRAME_HEIGHT
    }
  }

  public render (context : CanvasRenderingContext2D) {
    this.holding = false
    if (this.side === 'D') {
      if (this.holding) {
        if (this.moving) {
          const { sx, sy } = this.animate(PLAYER_DH)
          context.drawImage(this.sprite, sx, sy, PLAYER_DH.FRAME_WIDTH, PLAYER_DH.FRAME_HEIGHT, this.x, this.y, PLAYER_DH.FRAME_WIDTH, PLAYER_DH.FRAME_HEIGHT)
        }
        else {
          context.drawImage(this.sprite, PLAYER_DH.FRAME_WIDTH*3, PLAYER_DH.COLUMN, PLAYER_DH.FRAME_WIDTH, PLAYER_DH.FRAME_HEIGHT, this.x, this.y, PLAYER_DH.FRAME_WIDTH, PLAYER_DH.FRAME_HEIGHT)
        }
      }
      else if (this.moving) {
        const { sx, sy } = this.animate(PLAYER_D)
        context.drawImage(this.sprite, sx, sy, PLAYER_D.FRAME_WIDTH, PLAYER_D.FRAME_HEIGHT, this.x, this.y, PLAYER_D.FRAME_WIDTH, PLAYER_D.FRAME_HEIGHT)
      }
      else {
        context.drawImage(this.sprite, PLAYER_D.COLUMN, PLAYER_D.COLUMN, PLAYER_D.FRAME_WIDTH, PLAYER_D.FRAME_HEIGHT, this.x, this.y, PLAYER_D.FRAME_WIDTH, PLAYER_D.FRAME_HEIGHT)
      }
    }
    else if (this.side === 'U') {
      if (this.holding) {
        if (this.moving) {
          const { sx, sy } = this.animate(PLAYER_UH)
          context.drawImage(this.sprite, sx, sy, PLAYER_UH.FRAME_WIDTH, PLAYER_UH.FRAME_HEIGHT, this.x, this.y, PLAYER_UH.FRAME_WIDTH, PLAYER_UH.FRAME_HEIGHT)
        }
        else {
          context.drawImage(this.sprite, PLAYER_UH.FRAME_WIDTH*3, PLAYER_UH.FRAME_HEIGHT*PLAYER_UH.COLUMN, PLAYER_UH.FRAME_WIDTH, PLAYER_UH.FRAME_HEIGHT, this.x, this.y, PLAYER_UH.FRAME_WIDTH, PLAYER_UH.FRAME_HEIGHT)
        }
      }
      else if (this.moving) {
        const { sx, sy } = this.animate(PLAYER_U)
        context.drawImage(this.sprite, sx, sy, PLAYER_U.FRAME_WIDTH, PLAYER_U.FRAME_HEIGHT, this.x, this.y, PLAYER_U.FRAME_WIDTH, PLAYER_U.FRAME_HEIGHT)
      }
      else {
        context.drawImage(this.sprite, 0, PLAYER_U.FRAME_HEIGHT*PLAYER_U.COLUMN, PLAYER_U.FRAME_WIDTH, PLAYER_U.FRAME_HEIGHT, this.x, this.y, PLAYER_U.FRAME_WIDTH, PLAYER_U.FRAME_HEIGHT)
      }
    }
    else if (this.side === 'R') {
      context.drawImage(this.sprite, 0, 46, 15, 23, this.x, this.y, 15, 23)
    }
    else if (this.side === 'L') {
      context.save()
      context.translate(this.x + 15, this.y)
      context.scale(-1, 1)
      context.drawImage(this.sprite, 0, 46, 15, 23, this.x, this.y, 15, 23)
      context.restore()
    }
  }

}

export function PlayerFactory (props : PlayerProps) {
  return new Player(props)
}