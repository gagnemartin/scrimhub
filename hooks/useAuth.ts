import { setUserAction } from '@actions/authAction'
import { useContext } from 'react'
import { AuthContext } from '../context/authContext'

const useAuth = () => {
  const { state, dispatch } = useContext(AuthContext)

  const setUser = (data: any) => {
    setUserAction(dispatch, data)
  }

  return { user: state.user, isLoading: state.isLoading, setUser }
}

export default useAuth
