interface NetworkInformation extends EventTarget {
  downlink      : number
  effectiveType : string
  rtt           : number
  saveData      : boolean
}

export function isInternetSlow () {
  // @ts-expect-error
  const info = navigator.connection as NetworkInformation
  if (!info || info.saveData || info.rtt > 1000 || info.downlink < 2) {
    return true
  }
  return false
}