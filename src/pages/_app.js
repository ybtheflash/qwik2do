import Head from "next/head";
import { AuthProvider } from "../context/AuthContext";
import "../styles/globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Head>
        <title>Qwik2Do - Manage Your Tasks</title>
        <link rel="icon" href="/images/favicon.png" sizes="32x32" />
      </Head>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
