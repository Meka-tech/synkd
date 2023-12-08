import "@/styles/globals.css";
import { Open_Sans } from "next/font/google";
import { ThemeProvider } from "@emotion/react";

import { SessionProvider } from "next-auth/react";

const OpenSans = Open_Sans({ subsets: ["latin"] });
import type { AppProps } from "next/app";
import { theme } from "@/styles/globalTheme";

export default function App({
  Component,
  pageProps: { session, ...pageProps }
}: AppProps) {
  return (
    <main className={OpenSans.className}>
      <ThemeProvider theme={theme}>
        <SessionProvider session={session}>
          <Component {...pageProps} />
        </SessionProvider>
      </ThemeProvider>
    </main>
  );
}
