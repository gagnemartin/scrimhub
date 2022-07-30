import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcrypt'
import Cookies from 'cookies'
import { createApolloClient } from '@lib/apolloClient'
import prismaClient from '@lib/prismaClient'
import { generateToken, getTokenExpiresAt } from '@utils/jwt'
import { gql } from '@apollo/client'
import withMethodsGuard from '@middlewares/withMethodsGuard'

const apolloClient = createApolloClient()

const CREATE_USER = gql`
  mutation createUser($user: CreateUserInput) {
    createUser(user: $user) {
      id
      email
      displayName
      refreshToken
    }
  }
`

const trimData = (data: any) => {
  const { displayName, email, password, passwordConfirm } = data

  return {
    displayName: displayName.trim(),
    email: email.trim(),
    password: password.trim(),
    passwordConfirm: passwordConfirm.trim()
  }
}

export default withMethodsGuard(['POST'], async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { displayName, email, password, passwordConfirm } = trimData(req.body)
    const user = await apolloClient.mutate({
      variables: { user: { displayName, email, password, passwordConfirm } },
      mutation: CREATE_USER
    })

    console.log({ user })
    const cookies = new Cookies(req, res)
    cookies.set('refreshToken', user.refreshToken, {
      maxAge: Number(process.env.REFRESH_TOKEN_EXPIRES) * 60 * 1000 // convert from minute to milliseconds
    })

    delete user.refreshToken

    const token = await generateToken(user)
    const expiresAt = getTokenExpiresAt()

    return res.status(200).json({ token, expiresAt })
  } catch (e: any) {
    return res.status(400).json(e)
  }

  // if (notEmpty(displayName) && notEmpty(email) && notEmpty(password) && equalTo(password, passwordConfirm)) {
  //   const user = await prismaClient.user.findUnique({
  //     where: { email },
  //     select: { id: true }
  //   })

  //   if (!user) {
  //     const hashedPassword = await bcrypt.hash(password, 10)

  //     const user = await prismaClient.user.create({
  //       data: {
  //         displayName,
  //         email,
  //         password: hashedPassword
  //       },
  //       select: {
  //         id: true,
  //         email: true,
  //         displayName: true,
  //         refreshToken: true
  //       }
  //     })

  //     const cookies = new Cookies(req, res)
  //     cookies.set('refreshToken', user.refreshToken, {
  //       maxAge: Number(process.env.REFRESH_TOKEN_EXPIRES) * 60 * 1000 // convert from minute to milliseconds
  //     })

  //     delete user.refreshToken

  //     const token = await generateToken(user)
  //     const expiresAt = getTokenExpiresAt()

  //     return res.status(200).json({ token, expiresAt })
  //   }

  //   return res.status(400).json({ message: 'User already exists' })
  // }

  // return res.status(400).json({ message: 'Bad data' })
})
