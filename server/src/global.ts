global.ondev = function (callback : any) {
  if (process.env.dev) callback()
}