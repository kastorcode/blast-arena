import { useEffect, useState } from 'react'
import { axios } from '~/services/axios'
import { Container } from './style'

export default function OnlinePlayers () {

  const [loading, setLoading] = useState(false)
  const [count, setCount] = useState('')

  async function getPlayersCount () {
    try {
      if (loading) return
      setLoading(true)
      const {data} = await axios<number>('/players/count')
      setCount(data > 1 ? `${data} Players` : `${data} Player`)
    }
    finally {
      setTimeout(() => setLoading(false), 1000)
    }
  }

  useEffect(() => {
    getPlayersCount()
  }, [])

  return (
    <Container loading={loading} onClick={getPlayersCount}>
      {count}
    </Container>
  )

}