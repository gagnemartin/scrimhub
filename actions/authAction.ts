import { Action, ActionType } from '@reducers/authReducer'
import { Dispatch } from 'react'

export const setUserAction = (dispatch: Dispatch<Action>, data: any) => {
  dispatch({
    type: ActionType.success,
    payload: {
      data
    }
  })
}

export const requestUserAction = (dispatch: Dispatch<Action>) => {
  dispatch({ type: ActionType.request })
}
