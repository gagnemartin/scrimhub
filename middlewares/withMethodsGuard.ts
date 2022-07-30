import APIError from '@lib/APIError'
import { NextApiHandler } from 'next'

export default function withMethodsGuard(methods: string[], handler: NextApiHandler) {
  return async function withMethodsGuardHandler(req: any, res: any) {
    if (methods.includes(req.method)) {
      return await handler(req, res)
    } else {
      const statusCode = 405
      res.status(statusCode).json(new APIError(statusCode))
    }
  }
}
