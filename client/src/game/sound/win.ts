const SOUND = new Audio(`${process.env.PUBLIC_URL}/sound/win/0.mp3`)

export function playWinSound (callback:()=>void) {
  const onEnd = () => {
    stopWinSound()
    callback()
  }
  SOUND.currentTime = 0
  SOUND.onerror = onEnd
  SOUND.onended = onEnd
  SOUND.play().catch(()=>{})
}

export function stopWinSound () {
  SOUND.onerror = null
  SOUND.onended = null
  SOUND.pause()
}