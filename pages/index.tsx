import React from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import ScrimsBar from 'components/scrimsBar'
import Login from 'components/login'
import Link from 'next/link'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        <ScrimsBar />
        <Login />
        <Link href='/request-scrim'>
          <a href='/request-scrim'>Request scrim</a>
        </Link>
      </main>
    </div>
  )
}

export default Home
