import { NextComponentType } from 'next'
import '../styles/globals.scss'

function MyApp({ Component, pageProps }: {Component:NextComponentType, pageProps:{}}) {
  return <Component {...pageProps} />
}

export default MyApp
