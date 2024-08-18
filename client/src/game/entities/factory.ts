import { GameState } from '~/game/entities/state'

interface Entity {
  id     : string
  invertControls ?: () => void
  tick            : (state:GameState) => void
  render          : (context:CanvasRenderingContext2D) => void
}

export interface Entities {
  entities : Map<string,Entity>
  add      : (entity:Entity) => void
  get      : (id:string) => Entity|undefined
  has      : (id:string) => boolean
  remove   : (entity:Entity) => void
  tick     : (state:GameState) => void
  render   : (context:CanvasRenderingContext2D) => void
}

export function EntitiesFactory () : Entities {
  const entities : Entities = {
    entities: new Map()
  } as Entities
  entities.add = add.bind(entities)
  entities.get = get.bind(entities)
  entities.has = has.bind(entities)
  entities.remove = remove.bind(entities)
  entities.tick = tick.bind(entities)
  entities.render = render.bind(entities)
  return entities
}

function add (this:Entities, entity:Entity) {
  this.entities.set(entity.id, entity)
}

function get (this:Entities, id:string) {
  return this.entities.get(id)
}

function has (this:Entities, id:string) {
  return this.entities.has(id)
}

function remove (this:Entities, entity:Entity) {
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