const SOUND = new Audio(`${process.env.PUBLIC_URL}/sound/kill/0.mp3`)

export function playKillSound () {
  SOUND.currentTime = 0
  SOUND.play().catch(()=>{})
}