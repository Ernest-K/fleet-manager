import { Toaster } from "@/components/ui/toaster";
import { AppProvider } from "@/providers/app-provider";
import "@/styles/globals.css";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import { ReactElement, ReactNode } from "react";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  const pageContent = getLayout(<Component {...pageProps} />);

  return (
    <AppProvider>
      {pageContent} 
      <Toaster />
    </AppProvider>
  );
  // return getLayout(<Component {...pageProps} />);
}
