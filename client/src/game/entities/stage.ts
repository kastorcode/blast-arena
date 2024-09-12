import { Assets } from '~/game/util/assets'

interface StageProps {
  name : number
}

export interface Stage {
  name : number
  render : (context:CanvasRenderingContext2D) => void
}

export function StageFactory (props:StageProps) : Stage {
  const stage:Stage = {
    name: props.name
  } as Stage
  stage.render = render.bind(stage)
  return stage
}

function render (this:Stage, context:CanvasRenderingContext2D) {
  context.drawImage(Assets.stageSprite, 0, 0, 240, 224)
}