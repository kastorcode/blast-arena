import { useEffect, useRef, useState } from 'react'
import { KillDTO, MoveDTO, PlaceBombDTO, StartGameDTO } from '#/dto'
import { BlocksFactory } from '~/game/entities/block'
import { BombFactory } from '~/game/entities/bomb'
import { EntitiesFactory } from '~/game/entities/factory'
import { Player } from '~/game/entities/player'
import { PlayersFactory } from '~/game/entities/players'
import { StageFactory } from '~/game/entities/stage'
import { GameState } from '~/game/entities/state'
import socket from '~/services/socket'

export default function Canvas () {

  const fpsRef = useRef({ fps:0, lastTime:0 })
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [context, setContext] = useState<CanvasRenderingContext2D>()
  const [myself, setMyself] = useState<number>()
  const [state, setState] = useState<GameState>()

  function gameLoop (timestamp : number) {
    const deltaTime = timestamp - fpsRef.current.lastTime
    fpsRef.current.lastTime = timestamp
    let fps = 1000 / deltaTime
    if (fps > 58 && fps < 62) fps = 60
    if (fps !== fpsRef.current.fps) {
      fpsRef.current.fps = fps
      console.log(`${fps} FPS`)
    }
    tick()
    render()
    requestAnimationFrame(gameLoop)
  }

  function tick () {
    state?.entities.tick(state)
    state?.players.tick()
    state?.blocks.tick(state.players.myself as Player)
  }

  function render () {
    // @ts-ignore
    context?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    state?.stage.render(context as CanvasRenderingContext2D)
    state?.blocks.render(context as CanvasRenderingContext2D, state)
    state?.entities.render(context as CanvasRenderingContext2D)
    state?.players.render(context as CanvasRenderingContext2D)
  }

  function startGame (dto : StartGameDTO) {
    socket.off('start_game', startGame)
    setState({
      ...dto.state,
      blocks: BlocksFactory(dto.state.blocks),
      entities: EntitiesFactory(),
      players: PlayersFactory(dto.players),
      stage: StageFactory({bg:dto.state.stage})
    })
  }

  function onMove (dto : MoveDTO) {
    if (dto.i === myself) return
    state?.players.players[dto.i].onMove(dto)
  }

  function onPlaceBomb (dto : PlaceBombDTO) {
    if (dto.i === myself) return
    state?.entities.add(BombFactory({
      state,
      axes: dto.a,
      playerIndex: dto.i,
      reach: dto.r,
      x: dto.x,
      y: dto.y
    }))
  }

  function onKill (dto : KillDTO) {
    if (dto.i === myself) return
    state?.players.players[dto.i].kill(false)
  }

  useEffect(() => {
    socket.on('myself', setMyself)
    socket.on('start_game', startGame)
    socket.on('mv', onMove)
    socket.on('pb', onPlaceBomb)
    socket.on('kl', onKill)
    return () => {
      socket.off('myself', setMyself)
      socket.off('start_game', startGame)
      socket.off('mv', onMove)
      socket.off('pb', onPlaceBomb)
      socket.off('kl', onKill)
    }
  }, [state])

  useEffect(() => {
    if (typeof myself !== 'number' || !state) return
    socket.off('myself', setMyself)
    socket.off('start_game', startGame)
    state.players.setMyself(myself)
    state.players.myself?.addInputListener(state)
    return () => {
      state.players.myself?.removeInputListener(state)
    }
  }, [myself, state])

  useEffect(() => {
    if (!context || typeof myself !== 'number' || !state) return
    gameLoop(Date.now())
  }, [context, myself, state])

  useEffect(() => {
    if (!socket || !canvasRef.current) return
    const context2d = canvasRef.current.getContext('2d')
    if (!context2d) return
    context2d.imageSmoothingEnabled = false
    setContext(context2d)
    socket.emit('create_lobby')
    setTimeout(() => socket.emit('join_room'), 1000)
  })

  return (
    <canvas ref={canvasRef} width={240} height={208} style={{ height: '85vh' }} />
  )

}