import libaxios from 'axios'
import { SERVER_URL } from '~/constants'

export const axios = libaxios.create({
  baseURL: SERVER_URL
})