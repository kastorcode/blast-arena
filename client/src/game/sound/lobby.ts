const SOUND = new Audio(`${process.env.PUBLIC_URL}/sound/lobby/0.mp3`)

export function playLobbySound () {
  SOUND.currentTime = 0
  SOUND.play().catch(()=>{})
}