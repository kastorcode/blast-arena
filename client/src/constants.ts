export const ONDEV = process.env.NODE_ENV === 'development'

export const BASENAME = '/blast-arena'

export const PAGES = {
  HOME: '/',
  ABOUT: '/about',
  DONATE: '/donate'
}

export const SERVER_URL = ONDEV ? 'https://192.168.2.81:4000' : 'https://blast-arena-server.onrender.com'