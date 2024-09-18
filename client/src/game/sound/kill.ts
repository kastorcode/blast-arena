const SOUND = new Audio('/sound/kill/0.mp3')

export function playKillSound () {
  SOUND.currentTime = 0
  SOUND.play().catch(()=>{})
}