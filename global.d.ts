import { ApolloClient } from '@apollo/client'

declare global {
  var apolloClient: ApolloClient
  var prismaClient: PrismaClient
}
