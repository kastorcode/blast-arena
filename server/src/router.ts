import { Router } from 'express'

const router = Router()

router.get('/', (request, response) => {
  response.send('Socket.io server is running')
})

export default router