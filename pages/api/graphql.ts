import { ApolloServer, AuthenticationError, UserInputError, ValidationError } from 'apollo-server-micro'
import Cors from 'micro-cors'
import { constraintDirective, constraintDirectiveTypeDefs } from 'graphql-constraint-directive'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { typeDefs } from '../../graphql/schema'
import { resolvers } from '../../graphql/resolvers'
import { createContext } from '../../graphql/context'
import { Prisma } from '@prisma/client'

let schema = makeExecutableSchema({
  typeDefs: [constraintDirectiveTypeDefs, typeDefs],
  resolvers
})
schema = constraintDirective()(schema)

const cors = Cors()
const apolloServer = new ApolloServer({
  schema,
  csrfPrevention: true,
  context: createContext
  // formatError: (err) => {
  //   const { originalError } = err
  //   console.log(err.constructor.name)
  //   console.log(err, err.originalError)

  //   if (originalError instanceof Prisma.PrismaClientKnownRequestError) {
  //     const {
  //       code,
  //       meta: { target }
  //     } = originalError
  //     if (code === 'P2002') {
  //       throw new UserInputError(`${target.join(', ')} already exists`, {
  //         exception: { meta: { target } },
  //         statusCode: 400
  //       })
  //     }
  //   } else if (err instanceof UserInputError) {
  //     const regex = new RegExp(/\"(?<type>[a-z]+)\.(?<field>[a-z]+)\"/gi)
  //     const message = err.message.split('. ')[1]
  //     const matches = regex.exec(err.message)
  //     const field = matches?.groups?.field

  //     throw new UserInputError(message, {
  //       exception: { meta: { target: [field] } },
  //       statusCode: 400
  //     })
  //   }
  //   // Otherwise return the original error. The error can also
  //   // be manipulated in other ways, as long as it's returned.
  //   return err
  // }
})
const startServer = apolloServer.start()

export default cors(async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return false
  }

  await startServer
  await apolloServer.createHandler({ path: '/api/graphql' })(req, res)
})

export const config = { api: { bodyParser: false } }
