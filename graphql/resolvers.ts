import { Context } from '@apollo/client'
import bcrypt from 'bcrypt'
import { UserInputError } from 'apollo-server-micro'
import { generateToken, getTokenExpiresAt } from '../utils/jwt'

export const resolvers = {
  Query: {
    user: async (_parent: any, _args: any, ctx: Context) => {
      const user = await ctx.prisma.user.findOne({ where: { id: _args.id } })
      return user
    },
    users: async (_parent: any, _args: any, ctx: Context) => {
      console.log(ctx.token)
      const users = await ctx.prisma.user.findMany({
        include: {
          organisationsCreated: true,
          organisations: {
            include: {
              organisation: true
            }
          },
          teams: {
            include: {
              team: true
            }
          }
        }
      })
      return users
    }
  },
  Mutation: {
    createUser: async (_parent: any, args: any, ctx: Context) => {
      const {
        user: { displayName, email, password, passwordConfirm }
      } = args

      if (password !== passwordConfirm) {
        throw new UserInputError('Passwords do not match', {
          invalidArgs: ['password', 'passwordConfirm']
        })
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      const user = await ctx.prisma.user.create({
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

      // const token = generateToken(user)
      // const expiresAt = getTokenExpiresAt()

      ctx.res.cookie('refreshToken', user.refreshToken, {
        maxAge: process.env.REFRESH_TOKEN_EXPIRES * 60 * 1000, // convert from minute to milliseconds
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
      })

      return user
    },
    login: async (_parent: any, args: any, ctx: Context) => {
      const { email, password } = args

      const user = await ctx.prisma.user.findOne({
        where: { email },
        select: {
          id: true,
          email: true,
          displayName: true,
          refreshToken: true
        }
      })

      if (user) {
        const isValid = await bcrypt.compare(password, user.password)
      }

      throw new UserInputError('User not found')
    }
  }
}
