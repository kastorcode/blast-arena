const SOUND = new Audio(`${process.env.PUBLIC_URL}/sound/block/0.wav`)

export function playBlockSound () {
  SOUND.currentTime = 0
  SOUND.play().catch(()=>{})
}