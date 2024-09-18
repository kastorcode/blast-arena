/*
  key:   stage name
  value: possible sounds
*/
const SOUNDS:{[key:number]:number[]} = {
  0: [0,1],
  1: [0,1],
  2: [0,1],
  3: [0,1],
  4: [0,1],
  5: [0,1]
}

export function getBgSound (name:number) {
  return `/sound/stages/${SOUNDS[name].getRandom()}.mp3`
}