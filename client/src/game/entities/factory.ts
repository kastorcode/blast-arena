import { GameState } from './state'

interface Entity {
  id     : number
  setId  : (id : number) => void
  tick   : (state : GameState) => void
  render : (context : CanvasRenderingContext2D) => void
}

export interface Entities {
  entities : Map<number,Entity>
  add      : (entity : Entity) => void
  remove   : (entity : Entity) => void
}

export function EntitiesFactory () : Entities {
  const entities : Entities = {
    entities: new Map()
  } as Entities
  entities.add = add.bind(entities)
  entities.remove = remove.bind(entities)
  return entities
}

function add (this : Entities, entity : Entity) {
  const id = this.entities.size + 1
  entity.setId(id)
  this.entities.set(id, entity)
}

function remove (this : Entities, entity : Entity) {
  if (!this.entities.has(entity.id)) return
  this.entities.delete(entity.id)
}