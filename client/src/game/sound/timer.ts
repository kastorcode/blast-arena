import { Assets } from '~/game/util/assets'

const SOUND = new Audio(`${process.env.PUBLIC_URL}/sound/timer/0.mp3`)

export function playTimerSound (callback:()=>void) {
  const onEnd = () => {
    SOUND.onerror = null
    SOUND.onended = null
    if (Assets.bgSound) {
      Assets.bgSound.playbackRate = 1.1
      Assets.bgSound.volume = bgSoundVolume
    }
    callback()
  }
  SOUND.currentTime = 0
  SOUND.onerror = onEnd
  SOUND.onended = onEnd
  let bgSoundVolume:number
  if (Assets.bgSound) {
    bgSoundVolume = Assets.bgSound.volume
    Assets.bgSound.volume = bgSoundVolume * 0.5
  }
  SOUND.play().catch(()=>{})
}