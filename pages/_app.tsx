import type { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client'
import useApolloClient from '@lib/apolloClient'
import AuthProvider from 'context/authContext'

function MyApp({ Component, pageProps }: AppProps) {
  const client = useApolloClient()
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  )
}

const Container = (props: AppProps) => {
  return (
    <AuthProvider>
      <MyApp {...props} />
    </AuthProvider>
  )
}

export default Container
