import React from 'react'
import type { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import RegisterComponent from 'components/register'

const Register: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Register</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        <RegisterComponent />
      </main>
    </div>
  )
}

const withAuth = (getServerSideProps: GetServerSideProps) => {
  return async (context: GetServerSidePropsContext) => {
    const { req } = context
    const refreshToken = req?.cookies?.refreshToken

    if (refreshToken) {
      return {
        redirect: {
          destination: '/'
        }
      }
    }

    return await getServerSideProps(context)
  }
}

export const getServerSideProps = withAuth(async () => {
  return {
    props: {}
  }
})

export default Register
