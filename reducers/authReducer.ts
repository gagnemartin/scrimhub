import jwt from 'jsonwebtoken'

interface State {
  status: string
  isLoading: boolean
  isAuthenticated: boolean
  error?: any
  user?: User
}

export interface User {
  id?: string
  email?: string
  displayName?: string
  refreshToken?: string
  token?: string
}

export type Action = {
  type: ActionType
  payload?: any
  error?: any
}

export interface IAuthContext {
  state: State
  dispatch: React.Dispatch<Action>
}

export enum ActionType {
  request = 'REQUEST',
  success = 'SUCCESS',
  error = 'ERROR'
}

export const actionTypes = {
  request: 'REQUEST',
  success: 'SUCCESS',
  error: 'ERROR'
}

export const initialState: State = {
  status: actionTypes.request,
  user: {},
  isLoading: true,
  isAuthenticated: false,
  error: {}
}

const authReducer = (state: State, action: Action): typeof initialState => {
  switch (action.type) {
    case actionTypes.request: {
      return {
        ...initialState,
        status: actionTypes.request,
        user: state.user,
        isLoading: true
      }
    }
    case actionTypes.success: {
      let user = {}
      let isAuthenticated = false

      if (action.payload.data?.token) {
        const {
          data: { token, expiresAt }
        } = action.payload
        isAuthenticated = true

        user = {
          ...(jwt.decode(token) as User),
          token,
          expiresAt,
          isAuthenticated
        }
      }

      return {
        ...initialState,
        status: actionTypes.success,
        isLoading: false,
        isAuthenticated,
        user
      }
    }
    case actionTypes.error: {
      return {
        ...initialState,
        status: actionTypes.error,
        isLoading: false,
        error: action.error
      }
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

export default authReducer
