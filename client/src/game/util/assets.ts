import { GameState } from '~/game/entities/state'
import socket from '~/services/socket'
import { isInternetSlow } from '~/site/util/net'

export class Assets {

  public static bgSound     : HTMLAudioElement|null
  public static blastSprite : HTMLImageElement
  public static bombSprite  : HTMLImageElement
  public static bonusSprite : HTMLImageElement
  public static stageSprite : HTMLImageElement

  public static set (state:GameState) {
    this.blastSprite = new Image()
    this.blastSprite.src = `/sprites/blasts/${state.blast}.png`

    this.bombSprite = new Image()
    this.bombSprite.src = `/sprites/bombs/${state.bomb}.png`

    this.bonusSprite = new Image()
    this.bonusSprite.src = `/sprites/bonus/${state.bonus}.png`

    this.stageSprite = new Image()
    this.stageSprite.src = `/sprites/stages/${state.stage.name}.png`

    if (isInternetSlow()) {
      this.bgSound = null
      this.stageSprite.onload = this.emitReady.bind(this)
    }
    else {
      this.bgSound = new Audio(`/sound/stages/${state.stage.name}.wav`)
      this.bgSound.oncanplaythrough = this.emitReady.bind(this)
    }
  }

  public static emitReady () {
    this.stageSprite.onload = null
    if (this.bgSound) {
      this.bgSound.oncanplaythrough = null
    }
    socket.emit('ready')
  }

  public static start () {
    this.playBgSound()
  }

  public static stop () {
    this.stopBgSound()
  }

  public static playBgSound () {
    if (!this.bgSound) return
    this.bgSound.loop = true
    this.bgSound.play()
  }

  public static stopBgSound () {
    if (!this.bgSound) return
    this.bgSound.pause()
    this.bgSound.playbackRate = 1.0
    this.bgSound.currentTime = 0
  }

}