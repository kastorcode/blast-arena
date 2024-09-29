const SOUND = new Audio(`${process.env.PUBLIC_URL}/sound/bomb/0.wav`)

export function playBombSound () {
  SOUND.currentTime = 0
  SOUND.play().catch(()=>{})
}