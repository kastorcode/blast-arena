import { readFileSync } from 'node:fs'
import http from 'node:http'
import https from 'node:https'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { Express } from 'express'
import { ID_LENGTH } from '#/constants'

export function generateId (length = ID_LENGTH) : string {
  const c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let r = ''
  for (let i = 0; i < length; i++) {
    r += c.charAt(Math.floor(Math.random() * c.length))
  }
  return r
}

export function getServer (app:Express) {
  if (process.env.dev) {
    return https.createServer(getSsl(), app)
  }
  return http.createServer(app)
}

export function getSsl () {
  return {
    key: readFileSync(join(homedir(),'.ssl','key.pem')),
    cert: readFileSync(join(homedir(),'.ssl','cert.pem'))
  }
}