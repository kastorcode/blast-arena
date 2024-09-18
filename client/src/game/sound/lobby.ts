const SOUND = new Audio('/sound/lobby/0.mp3')

export function playLobbySound () {
  SOUND.currentTime = 0
  SOUND.play().catch(()=>{})
}