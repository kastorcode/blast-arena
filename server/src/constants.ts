const ORIGINS:Record<string,boolean> = {
  'http://localhost:3000': true,
  'https://localhost:3000': true,
  'http://192.168.2.81:3000': true,
  'https://192.168.2.81:3000': true,
  'http://kastorcode.github.io': true,
  'https://kastorcode.github.io': true
}

export const CORS = {
  methods: ['GET'],
  origin: (origin:string|undefined, callback:(error:Error|null,allow?:boolean) => void) => {
    if (ORIGINS[origin as string]) callback(null, true)
    else                           callback(null, false)
  }
}

export const MAX_PLAYERS = 4

export const PORT = process.env.PORT || 4000