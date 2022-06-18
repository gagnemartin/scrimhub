import { ApolloServer } from 'apollo-server-micro'
import Cors from 'micro-cors'
import { constraintDirective, constraintDirectiveTypeDefs } from 'graphql-constraint-directive'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { typeDefs } from '../../graphql/schema'
import { resolvers } from '../../graphql/resolvers'
import { createContext } from '../../graphql/context'

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
