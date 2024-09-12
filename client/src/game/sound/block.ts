const SOUND = new Audio('/sound/block/0.wav')

export function playBlockSound () {
  SOUND.currentTime = 0
  SOUND.play().catch(()=>{})
}