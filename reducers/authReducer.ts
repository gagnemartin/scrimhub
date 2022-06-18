import jwt from 'jsonwebtoken'

interface State {
  status: string
  isLoading: boolean
  error?: any
  user?: any
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

      if (action.payload.data?.token) {
        const {
          data: { token, expiresAt }
        } = action.payload

        user = {
          ...jwt.decode(token),
          token,
          expiresAt
        }
      }

      return {
        ...initialState,
        status: actionTypes.success,
        isLoading: false,
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
