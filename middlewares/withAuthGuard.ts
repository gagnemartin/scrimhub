import { Context, Resolver } from '@apollo/client'
import { AuthenticationError } from 'apollo-server-micro'
import jwt, { JsonWebTokenError } from 'jsonwebtoken'

export default function withAuthGuard(handler: Resolver) {
  return async function withAuthGuardHandler(parent: any, args: any, ctx: Context) {
    if (!ctx.token) {
      throw new AuthenticationError('Not authenticated')
    }

    jwt.verify(ctx.token, process.env.JWT_SECRET, (err: JsonWebTokenError) => {
      if (err) {
        throw new AuthenticationError('Not authenticated')
      }
    })

    return await handler(parent, args, ctx)
  }
}

export function withRoleGuard(role: String, handler: Resolver) {
  return async function withRoleGuardHandler(parent: any, args: any, ctx: Context) {
    withAuthGuard(async (parent: any, args: any, ctx: Context) => {
      const token = jwt.decode(ctx.token)

      if (token.user.role !== role) {
        throw new AuthenticationError('Not authorized')
      }

      return await handler(parent, args, ctx)
    })
  }
}
