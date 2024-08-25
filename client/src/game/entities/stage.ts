interface StageProps {
  bg : number
}

export interface Stage {
  bg     : HTMLImageElement
  cols   : number
  rows   : number
  sound  : HTMLAudioElement
  render : (context : CanvasRenderingContext2D) => void
}

export function StageFactory (props:StageProps) : Stage {
  const stage:Stage = {
    bg: new Image(),
    cols: 13,
    rows: 15,
    sound: new Audio(`/sound/stages/${props.bg}.wav`)
  } as Stage
  stage.bg.src = `/sprites/stages/${props.bg}.png`
  stage.render = render.bind(stage)
  stage.sound.loop = true
  stage.sound.play()
  return stage
}

function render (this:Stage, context:CanvasRenderingContext2D) {
  context.drawImage(this.bg, 0, 0, 240, 224)
}