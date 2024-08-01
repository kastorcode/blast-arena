interface PlayerProps {
  id : string
}

class Player {

  private id : string
  private x  : number
  private y  : number

  constructor ({ id } : PlayerProps) {
    this.id = id
    this.x = 0
    this.y = 0
  }

  public tick () {}

}

export function PlayerFactory ({ id } : PlayerProps) {
  return new Player({ id })
}