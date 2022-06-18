import { PrismaClient } from '@prisma/client'
import { NextApiRequest } from 'next'
import prisma from '@lib/prismaClient'

export type Context = {
  user?: any
  token?: string
  prisma: PrismaClient
}

export async function createContext({ req }: { req: NextApiRequest }): Promise<Context> {
  const authHeader = req.headers.authorization

  if (authHeader) {
    const token = authHeader.split(' ')[1]

    // jwt.verify(token, process.env.JWT_TOKEN, (err, user) => {
    //   if (err) {
    //     return next(new AppError(403))
    //   }

    //   req.user = user
    //   next()
    // })

    return {
      token,
      prisma
    }
  }

  // if (!session) return { prisma }

  // const { user, accessToken } = session

  return {
    prisma
  }
}
