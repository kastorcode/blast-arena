interface StageProps {
  bg : number
}

export interface Stage {
  bg     : HTMLImageElement
  cols   : number
  rows   : number
  sound  : HTMLAudioElement
  playBgSound : () => void
  stopBgSound : () => void
  render      : (context : CanvasRenderingContext2D) => void
}

export function StageFactory (props:StageProps) : Stage {
  const stage:Stage = {
    bg: new Image(),
    cols: 13,
    rows: 15,
    sound: new Audio(`/sound/stages/${props.bg}.wav`)
  } as Stage
  stage.bg.src = `/sprites/stages/${props.bg}.png`
  stage.playBgSound = playBgSound.bind(stage)
  stage.stopBgSound = stopBgSound.bind(stage)
  stage.render = render.bind(stage)
  stage.playBgSound()
  return stage
}

function playBgSound (this:Stage) {
  this.sound.loop = true
  this.sound.play()
}

function stopBgSound (this:Stage) {
  this.sound.pause()
  this.sound.currentTime = 0
}

function render (this:Stage, context:CanvasRenderingContext2D) {
  context.drawImage(this.bg, 0, 0, 240, 224)
}