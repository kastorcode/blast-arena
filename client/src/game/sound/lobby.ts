const SOUND = new Audio('/sound/lobby/0.wav')

export function playLobbySound () {
  SOUND.currentTime = 0
  SOUND.play().catch(()=>{})
}