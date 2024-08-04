interface Global extends NodeJS.Global {
  ondev : (callback:any) => void
}

declare const global : Global
declare const ondev  : Global['ondev']