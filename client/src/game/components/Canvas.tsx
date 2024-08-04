import { useEffect, useRef, useState } from 'react'
import { PlayerFactory } from '~/game/entities/player'
import { StageFactory } from '~/game/entities/stage'
import socket from '~/game/services/socket'

export default function Canvas () {

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [context, setContext] = useState<CanvasRenderingContext2D>()
  const [stage, setStage] = useState<ReturnType<typeof StageFactory>>()
  const [players, setPlayers] = useState<ReturnType<typeof PlayerFactory>[]>([])

  function render () {
    // @ts-ignore
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    // @ts-ignore
    stage.render(context)
    players.forEach(p => {
      // @ts-ignore
      p.render(context)
    })
  }

  function startGame () {}

  useEffect(() => {
    if (!socket || !canvasRef.current) return
    const context2d = canvasRef.current.getContext('2d')
    if (!context2d) return
    context2d.imageSmoothingEnabled = false
    setContext(context2d)
    socket.emit('create_lobby')
  }, [])

  return (
    <canvas ref={canvasRef} width={240} height={208} style={{ height: '85vh' }} />
  )

}