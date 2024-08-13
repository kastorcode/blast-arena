import { GameState } from './state'

interface Entity {
  id     : string
  setId  : (id : number) => void
  tick   : (state : GameState) => void
  render : (context : CanvasRenderingContext2D) => void
}

export interface Entities {
  entities : Map<string,Entity>
  add      : (entity : Entity) => void
  remove   : (entity : Entity) => void
  tick     : (state : GameState) => void
  render   : (context : CanvasRenderingContext2D) => void
}

export function EntitiesFactory () : Entities {
  const entities : Entities = {
    entities: new Map()
  } as Entities
  entities.add = add.bind(entities)
  entities.remove = remove.bind(entities)
  entities.tick = tick.bind(entities)
  entities.render = render.bind(entities)
  return entities
}

function add (this : Entities, entity : Entity) {
  entity.setId(Math.floor(Math.random() * 9999999))
  this.entities.set(entity.id, entity)
}

function remove (this : Entities, entity : Entity) {
  this.entities.delete(entity.id)
}

function tick (this:Entities, state:GameState) {
  for (const [_,entity] of this.entities) {
    entity.tick(state)
  }
}

function render (this:Entities, context:CanvasRenderingContext2D) {
  for (const [_,entity] of this.entities) {
    entity.render(context)
  }
}