import { GameState } from '~/game/entities/state'

export class Assets {

  public static bgSound     : HTMLAudioElement
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

    this.bgSound = new Audio(`/sound/stages/${state.stage.name}.wav`)
  }

  public static start () {
    this.playBgSound()
  }

  public static stop () {
    this.stopBgSound()
  }

  public static playBgSound () {
    this.bgSound.loop = true
    this.bgSound.play()
  }

  public static stopBgSound () {
    this.bgSound.pause()
    this.bgSound.currentTime = 0
  }

}