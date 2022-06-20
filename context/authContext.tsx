import { requestUserAction, setUserAction } from '@actions/authAction'
import apiFetch from '@lib/apiFetch'
import { createContext, Dispatch, useEffect, useMemo, useReducer } from 'react'
import authReducer, { Action, IAuthContext, initialState } from 'reducers/authReducer'

export const AuthContext = createContext<IAuthContext>({
  state: initialState,
  dispatch: () => {}
})

const refresh = async (dispatch: Dispatch<Action>) => {
  requestUserAction(dispatch)

  try {
    const options = {
      credentials: 'same-origin'
    }
    const payload = await apiFetch.post('/api/auth/refresh', options)

    // if (payload.token) {
    setUserAction(dispatch, payload)
    // }

    // return setInterval(async () => {
    //   const payload = await UsersService.refresh()

    //   if (isSuccessResponse(payload)) {
    //     dispatch({ type: actionTypes.success, payload })
    //   } else {
    //     dispatch({ type: actionTypes.error, error: payload })
    //   }
    // }, 840000)
  } catch (error) {
    console.log(error)
    // dispatch({ type: actionTypes.error, error })
  }
}

function AuthProvider({ children }: { children: any }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch])

  useEffect(() => {
    console.log('REFRESH MOUNTED')
    const interval = refresh(dispatch)
    // return () => clearInterval(interval)
  }, [])

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export default AuthProvider
