const SOUND = new Audio('/sound/bomb/0.wav')

export function playBombSound () {
  SOUND.currentTime = 0
  SOUND.play().catch(()=>{})
}