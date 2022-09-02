import Head from 'next/head'
import type { NextPage } from 'next'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Zippia</title>
        <meta name="description" content="Zippia frontend test." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  )
}

export default Home
