import '../styles/globals.sass'
import '../code-examples/nexus-tbc-builds/app/ClassicBuilds.sass'

import type { AppProps } from 'next/app'
import Head from 'next/head'

import ThemeProvider from '../contexts/theme'
import AppContainer from '../layout/AppContainer'

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Zac Miller</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeProvider>
        <AppContainer>
          <Component {...pageProps} />
        </AppContainer>
      </ThemeProvider>
    </>
  )
}

export default App