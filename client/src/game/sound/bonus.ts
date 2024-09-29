import { Bonus } from '~/game/entities/bonus'

const PATH = `${process.env.PUBLIC_URL}/sound/bonus/`

const EXT = '.mp3'

const SOUNDS = {
  1:new Audio(`${PATH}1${EXT}`),
  2:new Audio(`${PATH}2${EXT}`),
  3:new Audio(`${PATH}3${EXT}`),
  4:new Audio(`${PATH}4${EXT}`),
  5:new Audio(`${PATH}5${EXT}`),
  6:new Audio(`${PATH}6${EXT}`),
  7:new Audio(`${PATH}7${EXT}`),
  8:new Audio(`${PATH}8${EXT}`)
}

export function playBonusSound (bonus:Bonus['bonus']) {
  const sound:HTMLAudioElement|undefined = SOUNDS[bonus as keyof typeof SOUNDS]
  if (!sound) return
  if ((sound.currentTime > 0 && sound.ended) || (sound.currentTime === 0)) {
    sound.play().catch(()=>{})
  }
}