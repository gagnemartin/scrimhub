import type { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client'
import apolloClient from '@lib/apolloClient'
import AuthProvider from 'context/authContext'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ApolloProvider client={apolloClient}>
        <Component {...pageProps} />
      </ApolloProvider>
    </AuthProvider>
  )
}

export default MyApp
