import { Assets } from '~/game/util/assets'

const SOUND = new Audio('/sound/timer/0.wav')

export function playTimerSound (callback:()=>void) {
  const onEnd = () => {
    SOUND.onerror = null
    SOUND.onended = null
    Assets.bgSound.playbackRate = 1.1
    Assets.bgSound.volume = bgSoundVolume
    callback()
  }
  SOUND.currentTime = 0
  SOUND.onerror = onEnd
  SOUND.onended = onEnd
  const bgSoundVolume = Assets.bgSound.volume
  Assets.bgSound.volume = bgSoundVolume * 0.5
  SOUND.play().catch(()=>{})
}