import { v4 as uuidv4 } from 'uuid'
import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcrypt'
import Cookies from 'cookies'
import prismaClient from '@lib/prismaClient'
import { generateToken, getTokenExpiresAt } from '@utils/jwt'
import withMethodsGuard from '@middlewares/withMethodsGuard'

export default withMethodsGuard(['POST'], async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, password } = req.body
  console.log({ email, password })

  const user = await prismaClient.user.findUnique({
    where: { email },
    select: { id: true, email: true, displayName: true, password: true }
  })

  if (user) {
    const isValid = await bcrypt.compare(password, user.password)

    if (isValid) {
      delete user.password

      // Update refresh token
      const refreshToken = uuidv4()
      await prismaClient.user.update({
        where: {
          id: user.id
        },
        data: {
          refreshToken
        }
      })

      const token = await generateToken(user)
      const expiresAt = getTokenExpiresAt()

      const cookies = new Cookies(req, res)
      cookies.set('refreshToken', refreshToken, {
        maxAge: Number(process.env.REFRESH_TOKEN_EXPIRES) * 60 * 1000 // convert from minute to milliseconds
      })

      return res.status(200).json({ token, expiresAt })
    }
  }

  return res.status(400).json({ message: 'User not found' })
})