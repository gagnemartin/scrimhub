import { setUserAction } from '@actions/authAction'
import { useContext } from 'react'
import { AuthContext } from '../context/authContext'

const useAuth = () => {
  const { state, dispatch } = useContext(AuthContext)

  const { user, isLoading, isAuthenticated } = state

  const setUser = (data: any) => {
    setUserAction(dispatch, data)
  }

  return { user, isLoading, setUser, isAuthenticated }
}

export default useAuth
