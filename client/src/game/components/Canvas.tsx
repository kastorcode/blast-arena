import { useEffect, useRef, useState } from 'react'
import { MoveDTO, StartGameDTO } from '#/dto'
import { BlocksFactory } from '~/game/entities/block'
import { EntitiesFactory } from '~/game/entities/factory'
import { Player, PlayerFactory } from '~/game/entities/player'
import { Stage, StageFactory } from '~/game/entities/stage'
import { GameState } from '~/game/entities/state'
import socket from '~/services/socket'

export default function Canvas () {

  const fpsRef = useRef({ fps:0, lastTime:0 })
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [context, setContext] = useState<CanvasRenderingContext2D>()
  const [myself, setMyself] = useState<number>()
  const [stage, setStage] = useState<Stage>()
  const [players, setPlayers] = useState<Player[]>([])
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
    for (const [_,entity] of (state as GameState).entities.entities) {
      entity.tick(state as GameState)
    }
    players.forEach(p => p.tick())
    // @ts-ignore
    state.blocks.tick(players[myself])
  }

  function render () {
    // @ts-ignore
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    // @ts-ignore
    stage.render(context)
    // @ts-ignore
    state.blocks.render(context, stage)
    for (const [_,entity] of (state as GameState).entities.entities) {
      entity.render(context as CanvasRenderingContext2D)
    }
    // @ts-ignore
    players.forEach(p => p.render(context))
  }

  function startGame (dto : StartGameDTO) {
    socket.off('start_game', startGame)
    setStage(StageFactory({bg:dto.state.stage}))
    setPlayers(dto.players.map((p,index) => PlayerFactory({
      ...p,
      index,
      speed: dto.state.speed,
      x: dto.state.positions[index][0],
      y: dto.state.positions[index][1]
    })))
    setState({
      ...dto.state,
      blocks: BlocksFactory(dto.state.blocks),
      entities: EntitiesFactory()
    })
  }

  function onMove (dto : MoveDTO) {
    if (dto.i === myself || !players[dto.i]) return
    players[dto.i].onMove(dto)
  }

  useEffect(() => {
    if (typeof myself !== 'number' || !players[myself] || !state) return
    socket.off('myself', setMyself)
    players[myself].setMyself()
    players[myself].addKeyboardListener(state)
    return () => {
      players[myself].removeKeyboardListener(state)
    }
  }, [myself, players, state])

  useEffect(() => {
    if (!context || typeof myself !== 'number' || !stage || !players.length || !state) return
    gameLoop(Date.now())
  }, [context, myself, stage, players, state])

  useEffect(() => {
    socket.on('myself', setMyself)
    socket.on('start_game', startGame)
    socket.on('mv', onMove)
    return () => {
      socket.off('myself', setMyself)
      socket.off('start_game', startGame)
      socket.off('mv', onMove)
    }
  }, [players])

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