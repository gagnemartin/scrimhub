import { ApolloError } from '@apollo/client'

export default class APIError extends Error {
  message: string
  status: string
  statusCode: number
  data?: string[]

  constructor(statusCode: number, data?: any) {
    super()
    console.log(data)

    this.statusCode = statusCode || 500
    this.message = getMessageFromStatusCode(this.statusCode)
    this.status = getStatusFromStatusCode(this.statusCode)
    // this.isOperational = true
    // this.networkErrors = this.formatNetworkErrors(data)
    // this.graphQLErrors = data?.graphQLErrors || []
    // this.clientErrors = data?.clientError || []

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, APIError)
    }

    if (data) {
      this.data = data
    }
  }
}

const getMessageFromStatusCode = (statusCode: number): string => {
  let message

  switch (statusCode) {
    case 400:
      message = 'Bad request'
      break
    case 401:
      message = 'Unauthorized'
      break
    case 403:
      message = 'Forbidden'
      break
    case 404:
      message = 'Not found'
      break
    case 405:
      message = 'Method not allowed'
      break
    case 500:
    default:
      message = 'Internal server error'
      break
  }

  return message
}

const getStatusFromStatusCode = (statusCode: number): string => {
  return `${statusCode}`.startsWith('4') ? 'fail' : 'error'
}

const regex = new RegExp(/\"(?<type>[a-z]+)\.(?<field>[a-z]+)\"/gi)

export const formatApolloErrors = (e: any) => {
  const { clientErrors, graphQLErrors, networkError } = e
  const formattedError: FormattedError = {
    data: {},
    statusCode: 500
  }

  if (graphQLErrors.length > 0) {
    graphQLErrors.forEach((error: GraphQLError) => {
      const {
        message,
        extensions: {
          statusCode,
          exception: {
            meta: { target }
          }
        }
      } = error

      formattedError.statusCode = statusCode

      target.forEach((field) => {
        if (formattedError.data[field]) {
          formattedError.data[field].push(message)
        } else {
          formattedError.data[field] = [message]
        }
      })
    })
  }

  if (networkError) {
    const {
      result: { errors },
      statusCode
    } = networkError

    formattedError.statusCode = statusCode

    errors.forEach((error: { message: string }) => {
      const message = error.message.split('. ')[1]
      const matches = regex.exec(error.message)
      const field = matches?.groups?.field

      if (field) {
        if (formattedError.data[field]) {
          formattedError.data[field].push(message)
        } else {
          formattedError.data[field] = [message]
        }
      }
    })

    // console.log(errors)
  }

  return formattedError
  // }
}

// enum PrimaErrorCodes {
//   P2000 = "The provided value for the column is too long for the column's type",
//   P2001 = 'he record searched for in the where condition does not exist',
//   P2002 = 'Unique constraint failed',
//   P2003 = 'Foreign key constraint failed',
//   P2004 = 'A constraint failed on the database',
//   P2005 = "The value stored in the database is invalid for the field's type",
//   P2006 = 'The provided value is not valid',
//   P2007 = 'Data validation error',
//   P2008 = 'Failed to parse the query',
//   P2009 = 'Failed to validate the query',
//   P2010 = 'Raw query failed',
//   P2011 = 'Null constraint violation',
//   P2012 = 'Missing a required value',
//   P2013 = 'Missing a required argument'
// }

// const getMessageFromPrismaErrorCode = (code: keyof typeof PrimaErrorCodes): string => {
//   return PrimaErrorCodes[code] || ''
// }

interface GraphQLError {
  message: string
  extensions: {
    statusCode: number
    exception: {
      meta: {
        target: string[]
      }
    }
  }
}

interface FormattedError {
  data: {
    [field: string]: string[]
  }
  statusCode: number
}
