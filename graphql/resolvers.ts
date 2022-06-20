import { Context } from '@apollo/client'

export const resolvers = {
  Query: {
    // user: async (_parent: any, _args: any, ctx: Context) => {
    //   const user = await ctx.prisma.user.findOne({ where: { id: _args.id } })
    //   return user
    // },
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
    scrims: async (_parent: any, _args: any, ctx: Context) => {
      const scrims = await ctx.prisma.scrim.findMany({
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
  }
}
