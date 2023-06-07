import '@/styles/globals.css'
import { NextPage } from 'next';
import type { AppProps } from 'next/app'
import React, { ReactElement, ReactNode } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};
 
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page) => page);
 
  return getLayout(
    <main>
      <ToastContainer/>
      <Component {...pageProps} />
    </main>
  )
}
