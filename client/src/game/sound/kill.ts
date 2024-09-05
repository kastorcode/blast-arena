const SOUND = new Audio('/sound/kill/0.wav')

export function playKillSound () {
  SOUND.currentTime = 0
  SOUND.play().catch(()=>{})
}