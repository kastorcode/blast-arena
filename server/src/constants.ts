import { readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

const ORIGINS:Record<string,boolean> = {
  'http://localhost:3000': true,
  'https://localhost:3000': true,
  'http://192.168.2.81:3000': true,
  'https://192.168.2.81:3000': true
}

export const CORS = {
  methods: ['GET'],
  origin: (origin:string|undefined, callback:(error:Error|null,allow?:boolean) => void) => {
    if (ORIGINS[origin as string]) callback(null, true)
    else                           callback(null, false)
  }
}

export const MAX_PLAYERS = 4

export const PORT = 4000

export function getSsl () {
  return {
    key: readFileSync(join(homedir(),'.ssl','key.pem')),
    cert: readFileSync(join(homedir(),'.ssl','cert.pem'))
  }
}