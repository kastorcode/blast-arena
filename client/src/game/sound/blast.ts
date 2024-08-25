const SOUND = new Audio('/sound/blast/0.wav')

export function playBlastSound () {
  SOUND.currentTime = 0
  SOUND.play()
}