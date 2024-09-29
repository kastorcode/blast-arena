const SOUND = new Audio(`${process.env.PUBLIC_URL}/sound/kick/0.wav`)

export function playKickSound () {
  SOUND.currentTime = 0
  SOUND.play().catch(()=>{})
}