const SOUND = new Audio(`${process.env.PUBLIC_URL}/sound/blast/0.wav`)

export function playBlastSound () {
  SOUND.currentTime = 0
  SOUND.play().catch(()=>{})
}