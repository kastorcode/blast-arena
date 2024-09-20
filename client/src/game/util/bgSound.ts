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
  5: [0,1],
  6: [0,1],
  7: [0,1],
  8: [0,1],
  9: [0,1],
  10: [0,1],
  11: [0,1],
  12: [0,1],
  13: [0,1],
  14: [0,1],
  15: [0,1],
  16: [0,1],
  17: [0,1],
  18: [0,1],
  19: [0,1]
}

export function getBgSound (name:number) {
  return `/sound/stages/${SOUNDS[name].getRandom()}.mp3`
}