import { ApolloClient, InMemoryCache } from '@apollo/client'

const config = {
  uri: 'http://localhost:3000/api/graphql',
  cache: new InMemoryCache()
}

let apolloClient: ApolloClient<any>

if (process.env.NODE_ENV === 'production') {
  apolloClient = new ApolloClient(config)
} else {
  if (!global.apolloClient) {
    global.apolloClient = new ApolloClient(config)
  }
  apolloClient = global.apolloClient
}

export default apolloClient

declare global {
  var apolloClient: ApolloClient<any>
}
