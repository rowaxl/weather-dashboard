import Head from 'next/head'
import 'tailwindcss/tailwind.css'

function MyApp({ Component, pageProps }) {
  return (
    <div className="flex flex-col h-screen w-screen bg-gray-100 dark:bg-gray-800">
      <Head>
        <title>Weather Board</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex-1 overflow-scroll">
        <Component {...pageProps} />
      </main>

      <footer className="w-full pl-4 py-2">
        <p className="dark:text-white">
          &copy; rowaxl0, images from Unsplash
        </p>
      </footer>
    </div>
  )
}

export default MyApp
