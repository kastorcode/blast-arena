const SOUND = new Audio(`${process.env.PUBLIC_URL}/sound/fling/0.wav`)

export function playFlingSound () {
  SOUND.currentTime = 0
  SOUND.play().catch(()=>{})
}