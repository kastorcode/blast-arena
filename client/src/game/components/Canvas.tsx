import { useEffect, useRef } from 'react'
import { SERVER_URL } from '~/game/constants'
import { PlayerFactory } from '~/game/entities/player'
import { StageFactory } from '~/game/entities/stage'

function render (
  context   : CanvasRenderingContext2D,
  canvas    : HTMLCanvasElement,
  stage     : ReturnType<typeof StageFactory>,
  gameState : any
) {
  context.clearRect(0, 0, canvas.width, canvas.height)
  stage.render(context)
  gameState.players.forEach((player : any) => {
    player.render(context)
  })
}

export default function Canvas () {

  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    const context = canvasRef.current.getContext('2d')
    if (!context) return
    context.imageSmoothingEnabled = false
    const stage = StageFactory({ bg: 0 })
    const players = [
      PlayerFactory({ id: '1', index: 0, sprite: 'white' })
    ]
    players.forEach(player => player.addKeyboardListener())
    const socket = new WebSocket(SERVER_URL)
    socket.addEventListener('open', () => {
      console.log('Conectado ao servidor WebSocket')
    })
    socket.addEventListener('message', (event) => {
      const gameState = JSON.parse(event.data)
      render(context, canvasRef.current as HTMLCanvasElement, stage, gameState)
    })
    setInterval(() => {
      render(context, canvasRef.current as HTMLCanvasElement, stage, { players })
    }, 1000 / 60)
  }, [])

  return (
    <canvas ref={canvasRef} width={240} height={208} />
  )

}