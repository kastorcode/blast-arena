const SOUND = new Audio('/sound/kick/0.wav')

export function playKickSound () {
  SOUND.currentTime = 0
  SOUND.play()
}