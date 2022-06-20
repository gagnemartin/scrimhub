import { v4 as uuidv4 } from 'uuid'
import { NextApiRequest, NextApiResponse } from 'next'
import Cookies from 'cookies'
import prismaClient from '@lib/prismaClient'
import { generateToken, getTokenExpiresAt } from '@utils/jwt'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { refreshToken } = req.cookies

    if (refreshToken) {
      const user = await prismaClient.user.findFirst({
        where: { refreshToken },
        select: { id: true, email: true, displayName: true }
      })

      if (user) {
        const newRefreshToken = uuidv4()
        const token = await generateToken(user)
        const expiresAt = getTokenExpiresAt()

        await prismaClient.user.update({
          where: {
            id: user.id
          },
          data: {
            refreshToken: newRefreshToken
          }
        })

        const cookies = new Cookies(req, res)
        cookies.set('refreshToken', newRefreshToken, {
          maxAge: Number(process.env.REFRESH_TOKEN_EXPIRES) * 60 * 1000 // convert from minute to milliseconds
        })

        return res.status(200).json({ token, expiresAt })
      }
    }

    return res.status(401).json({ message: 'User not found' })
  }

  return res.status(405).json({ message: 'Bad request' })
}
