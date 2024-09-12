import { GameState } from '~/game/entities/state'
import { playTimerSound } from '~/game/sound/timer'
import { BlockFillerFactory } from './blockFiller'

export interface Timer {
  elapsedTime   : number
  element       : HTMLDivElement
  id            : string
  minutes       : number
  remainingTime : number
  seconds       : number
  startTime     : number
  totalTime     : number
  start  : () => void
  tick   : (state:GameState) => void
  render : () => void
}

export function TimerFactory () : Timer {
  const timer:Timer = {
    element: document.getElementById('timer'),
    id: 'timer',
    totalTime: 2 * 60 * 1000 // 2 minutes
  } as Timer
  timer.start = start.bind(timer)
  timer.tick = tick.bind(timer)
  timer.render = render.bind(timer)
  return timer
}

function start (this:Timer) {
  this.startTime = Date.now()
  this.remainingTime = this.totalTime
}

function tick (this:Timer, state:GameState) {
  this.elapsedTime = Date.now() - this.startTime
  this.remainingTime = this.totalTime - this.elapsedTime
  if (this.remainingTime < 800) {
    state.entities.remove(this)
    playTimerSound(() => state.entities.add(BlockFillerFactory()))
  }
}

function render (this:Timer) {
  this.minutes = Math.floor(this.remainingTime / 60000)
  this.seconds = Math.floor((this.remainingTime % 60000) / 1000)
  this.element.innerText = `${this.minutes}:${this.seconds < 10 ? '0' : ''}${this.seconds}`
}