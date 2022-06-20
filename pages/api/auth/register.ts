import { v4 as uuidv4 } from 'uuid'
import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcrypt'
import Cookies from 'cookies'
import prismaClient from '@lib/prismaClient'
import { generateToken, getTokenExpiresAt } from '@utils/jwt'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { displayName, email, password, passwordConfirm } = req.body
    console.log(password, passwordConfirm)
    if (password === passwordConfirm) {
      const user = await prismaClient.user.findUnique({
        where: { email },
        select: { id: true }
      })

      if (!user) {
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prismaClient.user.create({
          data: {
            displayName,
            email,
            password: hashedPassword
          },
          select: {
            id: true,
            email: true,
            displayName: true,
            refreshToken: true
          }
        })

        const cookies = new Cookies(req, res)
        cookies.set('refreshToken', user.refreshToken, {
          maxAge: Number(process.env.REFRESH_TOKEN_EXPIRES) * 60 * 1000 // convert from minute to milliseconds
        })

        delete user.refreshToken

        const token = await generateToken(user)
        const expiresAt = getTokenExpiresAt()

        return res.status(200).json({ token, expiresAt })
      }

      return res.status(400).json({ message: 'User already exists' })
    }

    return res.status(400).json({ message: 'Passwords do not match' })
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
