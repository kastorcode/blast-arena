import { useEffect, useRef, useState } from 'react'
import { GameStateDTO, MoveDTO, StartGameDTO } from '#/dto'
import { Block, BlocksFactory } from '~/game/entities/block'
import { Player, PlayerFactory } from '~/game/entities/player'
import { Square, SquaresFactory } from '~/game/entities/squares'
import { Stage, StageFactory } from '~/game/entities/stage'
import socket from '~/services/socket'

export default function Canvas () {

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [context, setContext] = useState<CanvasRenderingContext2D>()
  const [myself, setMyself] = useState<number>()
  const [stage, setStage] = useState<Stage>()
  const [blocks, setBlocks] = useState<Block[]>()
  const [squares, setSquares] = useState<(Square|null)[][]>()
  const [players, setPlayers] = useState<Player[]>([])
  const [state, setState] = useState<GameStateDTO>()

  function gameLoop () {
    tick()
    render()
    requestAnimationFrame(gameLoop)
  }

  function tick () {
    players.forEach(p => p.tick(blocks as Block[]))
    const [x, y] = players[myself as number].getAxes()
    // @ts-ignore
    for (const i in squares[x]) {
      // @ts-ignore
      if (!squares[x][i]) continue
      // @ts-ignore
      if (squares[x][i].tick(players[myself as number])) break
    }
    for (const i in squares) {
      // @ts-ignore
      if (!squares[i][y]) continue
      // @ts-ignore
      if (squares[i][y].tick(players[myself as number])) break
    }
  }

  function render () {
    // @ts-ignore
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    // @ts-ignore
    stage.render(context)
    // @ts-ignore
    squares.forEach(row => row.forEach(s => s && s.render(context, stage)))
    // @ts-ignore
    players.forEach(p => p.render(context))
  }

  function startGame (dto : StartGameDTO) {
    socket.off('start_game', startGame)
    setStage(StageFactory({bg:dto.stage}))
    setBlocks(BlocksFactory())
    setSquares(SquaresFactory(dto.squares))
    setPlayers(dto.players.map((p,index) => PlayerFactory({
      ...p,
      index,
      speed: dto.state.speed,
      x: dto.state.positions[index][0],
      y: dto.state.positions[index][1]
    })))
    setState(dto.state)
  }

  function onMove (dto : MoveDTO) {
    if (dto.i === myself || !players[dto.i]) return
    players[dto.i].onMove(dto)
  }

  useEffect(() => {
    if (!blocks || typeof myself !== 'number' || !players[myself]) return
    socket.off('myself', setMyself)
    players[myself].setMyself()
    players[myself].addKeyboardListener()
    return () => {
      if (!players[myself]) return
      players[myself].removeKeyboardListener()
    }
  }, [blocks, myself, players])

  useEffect(() => {
    if (!context || typeof myself !== 'number' || !stage || !players.length || !state) return
    gameLoop()
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