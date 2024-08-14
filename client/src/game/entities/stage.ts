interface StageProps {
  bg : number
}

export interface Stage {
  bg       : HTMLImageElement
  cols     : number
  rows     : number
  render   : (context : CanvasRenderingContext2D) => void
}

export function StageFactory (props : StageProps) : Stage {
  // @ts-expect-error
  const stage : Stage = {
    cols: 13,
    rows: 15,
    bg: new Image()
  }
  stage.bg.src = `/sprites/stages/${props.bg}.png`
  stage.render = render.bind(stage)
  return stage
}

function render (this : Stage, context : CanvasRenderingContext2D) {
  context.drawImage(this.bg, 0, 0, 240, 224)
}