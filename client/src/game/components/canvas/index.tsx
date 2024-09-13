import { useEffect, useRef, useState } from 'react'
import { FlingBombDTO, HoldBombDTO, KillDTO, MoveBombDTO, MoveDTO, NullifyBlockDTO, PlaceBombDTO, StartGameDTO } from '#/dto'
import { BlocksFactory } from '~/game/entities/block'
import { Bomb, BombFactory } from '~/game/entities/bomb'
import { EntitiesFactory } from '~/game/entities/factory'
import { PlayersFactory } from '~/game/entities/players'
import { StageFactory } from '~/game/entities/stage'
import { GameState } from '~/game/entities/state'
import { TimerFactory } from '~/game/entities/timer'
import { playBombSound } from '~/game/sound/bomb'
import { Assets } from '~/game/util/assets'
import socket from '~/services/socket'
import { Pairing, Players, Timer } from './style'

interface CanvasProps {
  style : React.CSSProperties
}

export default function Canvas ({style}:CanvasProps) {

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fpsRef = useRef({fps:0, lastTime:0})
  const readyRef = useRef(0)
  const [context, setContext] = useState<CanvasRenderingContext2D>()
  const [myself, setMyself] = useState<number>()
  const [state, setState] = useState<GameState>()

  function gameLoop (timestamp : number) {
    try {
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
    catch (error) {
      console.error(error)
    }
  }

  function tick () {
    state?.entities.tick(state)
    state?.players.tick(state)
  }

  function render () {
    // @ts-ignore
    context?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    state?.stage.render(context!)
    state?.blocks.render(context!, state)
    if (state!.players.players.find(p => p.holding)) {
      state?.players.render(context!)
      state?.entities.render(context!)
    }
    else {
      state?.entities.render(context!)
      state?.players.render(context!)
    }
  }

  function startGame (dto:StartGameDTO) {
    socket.off('start_game', startGame)
    setState({
      ...dto.state,
      blocks: BlocksFactory(dto.state.blocks),
      entities: EntitiesFactory(),
      players: PlayersFactory(dto.players),
      stage: StageFactory({name:dto.state.stage})
    })
  }

  function onReady () {
    readyRef.current++
    if (!state) return
    if (readyRef.current < state.players.players.length) return
    socket.off('ready', onReady)
    const timer = TimerFactory()
    timer.start()
    state.entities.add(timer)
    Assets.start()
    state.players.myself!.active = true
  }

  function onMove (dto:MoveDTO) {
    if (dto.p === myself) return
    state?.players.players[dto.p].onMove(dto)
  }

  function onPlaceBomb (dto:PlaceBombDTO) {
    if (dto.p === myself) return
    state?.entities.add(BombFactory({
      axes: dto.a,
      id: dto.i,
      playerIndex: dto.p,
      reach: dto.r,
      x: dto.x,
      y: dto.y
    }))
    playBombSound()
  }

  function onMoveBomb (dto:MoveBombDTO) {
    if (dto.p === myself) return
    const bomb = state!.entities.get(dto.i) as Bomb
    bomb.startMove(dto.s, state!)
  }

  function onHoldBomb (dto:HoldBombDTO) {
    if (dto.p === myself) return
    const bomb = state!.entities.get(dto.i) as Bomb
    state!.players.players[dto.p].holding = 1
    bomb.setHolding(dto.p, state!)
  }

  function onFlingBomb (dto:FlingBombDTO) {
    if (dto.p === myself) return
    const bomb = state!.entities.get(dto.i) as Bomb
    bomb.x = dto.x
    bomb.y = dto.y
    state!.players.players[dto.p].holding = 0
    bomb.startFling(dto.s)
  }

  function onNullifyBlock (dto:NullifyBlockDTO) {
    state?.blocks.destroyBlock(dto.a)
  }

  function onKill (dto:KillDTO) {
    if (dto.p === myself) return
    state?.players.players[dto.p].kill(false)
  }

  useEffect(() => {
    socket.on('myself', setMyself)
    socket.on('start_game', startGame)
    socket.on('ready', onReady)
    socket.on('mv', onMove)
    socket.on('pb', onPlaceBomb)
    socket.on('mb', onMoveBomb)
    socket.on('hb', onHoldBomb)
    socket.on('fb', onFlingBomb)
    socket.on('nb', onNullifyBlock)
    socket.on('kl', onKill)
    return () => {
      socket.off('myself', setMyself)
      socket.off('start_game', startGame)
      socket.off('ready', onReady)
      socket.off('mv', onMove)
      socket.off('pb', onPlaceBomb)
      socket.off('mb', onMoveBomb)
      socket.off('hb', onHoldBomb)
      socket.off('fb', onFlingBomb)
      socket.off('nb', onNullifyBlock)
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
      state.players.myself!.removeInputListener()
    }
  }, [myself, state])

  useEffect(() => {
    if (!context || typeof myself !== 'number' || !state) return
    Assets.set(state)
    gameLoop(Date.now())
    return () => {
      Assets.stop()
    }
  }, [context, myself, state])

  useEffect(() => {
    if (!socket || !canvasRef.current) return
    const context2d = canvasRef.current.getContext('2d')
    if (!context2d) return
    context2d.imageSmoothingEnabled = false
    setContext(context2d)
  }, [])

  return (
    <>
    {!state && <Pairing>Pairing</Pairing>}
    <Players>
      {state?.players.players.map(({nick},i) => <p key={`${nick}${i}`}>{++i}. {nick}</p>)}
    </Players>
    <Timer id='timer' />
    <canvas ref={canvasRef} width={240} height={208} style={style} />
    </>
  )

}