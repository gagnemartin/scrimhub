import { Context } from '@apollo/client'

export const resolvers = {
  Query: {
    user: async (_parent: any, _args: any, ctx: Context) => {
      const user = await ctx.prisma.user.findOne({ where: { id: _args.id } })
      return user
    },
    users: async (_parent: any, _args: any, ctx: Context) => {
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
  }
}
