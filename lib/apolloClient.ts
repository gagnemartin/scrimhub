import { ApolloClient, InMemoryCache, createHttpLink, GraphQLRequest, Context } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import useAuth from '@hooks/useAuth'

const createApolloClient = (token?: String) => {
  const httpLink = createHttpLink({
    uri: 'http://localhost:3000/api/graphql',
    credentials: 'same-origin'
  })

  const authLink = setContext((_: GraphQLRequest, context: Context) => {
    const { headers } = context

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

  return new ApolloClient(config)
}

const useApolloClient = () => {
  const auth = useAuth()

  return createApolloClient(auth?.user?.token)
}

export default useApolloClient
export { createApolloClient }
