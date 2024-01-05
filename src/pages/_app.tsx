import "@/styles/globals.css";
import { Open_Sans } from "next/font/google";
import { ThemeProvider } from "@emotion/react";

import { SessionProvider } from "next-auth/react";

const OpenSans = Open_Sans({ subsets: ["latin"] });
import type { AppProps } from "next/app";
import { theme } from "@/styles/globalTheme";
import { persistor, store } from "@/Redux/app/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps }
}: AppProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <main className={OpenSans.className}>
          <ThemeProvider theme={theme}>
            <SessionProvider session={session}>
              <Component {...pageProps} />
            </SessionProvider>
          </ThemeProvider>
        </main>
      </PersistGate>
    </Provider>
  );
}
