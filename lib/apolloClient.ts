import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

const httpLink = createHttpLink({
  uri: 'http://localhost:3000/api/graphql',
  credentials: 'same-origin'
})

const authLink = setContext((_, context) => {
  const { headers, token } = context

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }
})

const config = {
  link: authLink.concat(httpLink),
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
