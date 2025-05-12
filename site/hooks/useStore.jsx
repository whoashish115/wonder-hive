import React, { useContext } from 'react'
import { Context } from '@/store/provider'

const useStore = () => {
  const {state, dispatch} = useContext(Context)
  return {state, dispatch}
}

export default useStore