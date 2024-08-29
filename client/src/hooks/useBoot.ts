import { useEffect, useState } from 'react'
import { Dispatch } from 'redux'
import { bootOptions } from '~/store/options/thunk'
import { bootUser } from '~/store/user/thunk'

async function run (dispatch:Dispatch) {
  bootUser(dispatch)
  bootOptions(dispatch)
}

export default function useBoot (dispatch:Dispatch) {
  const [booting, setBooting] = useState(true)
  useEffect(() => {
    run(dispatch).then(() => setBooting(false))
  }, [])
  return booting
}