import { useEffect, useState } from 'react'

export default function useIsPortrait () : boolean {

  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth)

  function handleResize () {
    setIsPortrait(window.innerHeight > window.innerWidth)
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  })

  return isPortrait

}