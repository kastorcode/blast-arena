interface StageProps {
  bg : number
}

class Stage {

  public bg       : HTMLImageElement
  public cols     : number
  public rows     : number
  public tileSize : number

  constructor ({ bg } : StageProps) {
    this.cols     = 13
    this.rows     = 15
    this.tileSize = 16
    this.bg       = new Image()
    this.bg.src   = `/sprites/stages/${bg}.png`
  }

  public render (context : CanvasRenderingContext2D) {
    context.drawImage(this.bg, 0, 0, 240, 224)
  }

}

export function StageFactory (props : StageProps) {
  return new Stage(props)
}