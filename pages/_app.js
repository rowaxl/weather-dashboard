import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>Weather Board</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Component {...pageProps} />
      </main>

      <footer>
        <p>
          &copy; rowaxl0
        </p>
      </footer>
    </div>
  )
}

export default MyApp
