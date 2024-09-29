import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PAGES } from '~/constants'

export default function NotFound () {

  const navigate = useNavigate()

  useEffect(() => {
    navigate(PAGES.HOME)
  })

  return null

}