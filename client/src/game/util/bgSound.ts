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
  11: [2,3],
  12: [0,1,3],
  13: [9,10],
  14: [0,1],
  15: [7,8,9,10],
  16: [7,8,9,10],
  17: [2,3],
  18: [4,5,6],
  19: [0,1],
  20: [4,5,6],
  21: [7,8,9,10],
  22: [4,5,6],
  23: [2],
  24: [2],
  25: [3],
  26: [7,8,9,10],
  27: [4,5,6]
}

export function getBgSound (name:number) {
  return `${process.env.PUBLIC_URL}/sound/stages/${SOUNDS[name].getRandom()}.mp3`
}