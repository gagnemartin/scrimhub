import { Context } from '@apollo/client'
import bcrypt from 'bcrypt'
import { UserInputError } from 'apollo-server-micro'
import { createScrim, createUser } from './validations'
import withAuthGuard from '@middlewares/withAuthGuard'
import { ValidationError } from 'yup'

export const resolvers = {
  Query: {
    myTeams: withAuthGuard(async (_parent: any, args: any, ctx: Context) => {
      console.log(args)
      const teams = await ctx.prisma.user.findUnique({
        where: {
          id: args.id
        },
        select: {
          id: true,
          teams: {
            include: {
              team: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        }
      })
      return teams
    }),
    // users: async (_parent: any, _args: any, ctx: Context) => {
    //   console.log({ token: ctx.token })
    //   const users = await ctx.prisma.user.findMany({
    //     include: {
    //       organisationsCreated: true,
    //       organisations: {
    //         include: {
    //           organisation: true
    //         }
    //       },
    //       teams: {
    //         include: {
    //           team: true
    //         }
    //       }
    //     }
    //   })
    //   return users
    // },
    games: async (_parent: any, _args: any, ctx: Context) => {
      const games = await ctx.prisma.game.findMany()

      return games
    },

    scrims: async (_parent: any, _args: any, ctx: Context) => {
      const { prisma } = ctx

      const scrims = await prisma.scrim.findMany({
        where: {
          booked: false
        },
        select: {
          id: true,
          booked: true,
          date: true,
          game: {
            select: {
              name: true
            }
          },
          teams: {
            include: {
              team: {
                select: {
                  name: true
                }
              }
            }
          }
        },
        orderBy: {
          date: 'desc'
        }
      })

      return scrims
    }
  },
  Mutation: {
    createUser: async (_parent: any, args: any, ctx: Context) => {
      const {
        user: { displayName, email, password, passwordConfirm }
      } = args

      const data = { displayName, email, password, passwordConfirm }

      await createUser.validate(data, { abortEarly: false }).catch((err) => {
        const errors = {}

        if (err instanceof ValidationError) {
          err.inner?.forEach((e: any): any => {
            errors[e.path] = e.errors
          })
        }

        throw new UserInputError('error', {
          exception: { errors },
          statusCode: 400
        })
      })

      const dataCast = createUser.cast(data)

      const hashedPassword = await bcrypt.hash(dataCast.password, 10)

      const user = await ctx.prisma.user.create({
        data: {
          displayName: dataCast.displayName,
          email: dataCast.email,
          password: hashedPassword
        },
        select: {
          id: true,
          email: true,
          displayName: true,
          refreshToken: true
        }
      })

      return user
    },

    createScrim: withAuthGuard(async (_parent: any, args: any, ctx: Context) => {
      try {
        const {
          scrim: { date, duration, gameId, teamId }
        } = args

        const lobbyLogin = `SH${generateRandomLobby()}`
        const lobbyPassword = generateRandomLobby()
        const data = { date, duration, gameId, teamId, lobbyLogin, lobbyPassword }

        await createScrim.validate(data, { abortEarly: false }).catch((err) => {
          const errors = {}

          if (err instanceof ValidationError) {
            err.inner?.forEach((e: any): any => {
              errors[e.path] = e.errors
            })
          }

          throw new UserInputError('error', {
            exception: { errors },
            statusCode: 400
          })
        })

        const dataCast = createUser.cast(data)

        const scrim = await ctx.prisma.scrim.create({
          data: {
            date: dataCast.date,
            duration: dataCast.duration,
            gameId: dataCast.gameId,
            lobbyLogin: dataCast.lobbyLogin,
            lobbyPassword: dataCast.lobbyPassword,
            teams: {
              create: [
                {
                  teamId: dataCast.teamId
                }
              ]
            }
          },
          select: {
            id: true,
            date: true,
            duration: true,
            teams: {
              include: {
                team: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        })

        return scrim
      } catch (e) {
        console.error(e)
        return e
      }
    })
  }
}

const generateRandomLobby = () => {
  return Math.floor(1000 + Math.random() * 9000).toString()
}
