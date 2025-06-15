import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import "@/styles/globals.css"; // or "../styles/globals.css" if alias fails


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
