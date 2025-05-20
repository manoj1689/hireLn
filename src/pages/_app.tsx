import { useEffect } from "react";
import { Lexend } from "next/font/google";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import "../app/globals.css";
import { store } from "../redux/store";



const lexendFont = Lexend({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

function MyApp({ Component, pageProps }: AppProps) {
  
  return (
    <Provider store={store}>
      <div className={lexendFont.className}>
        <Component {...pageProps} />
      </div>
    </Provider>
  );
}

export default MyApp;
