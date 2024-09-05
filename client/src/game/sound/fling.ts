const SOUND = new Audio('/sound/fling/0.wav')

export function playFlingSound () {
  SOUND.currentTime = 0
  SOUND.play().catch(()=>{})
}