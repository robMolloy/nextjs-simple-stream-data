import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Link from "next/link";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <div className="flex gap-8">
        <Link href="/" className="hover:underline p-4">
          Home
        </Link>
        <Link href="/stream-numbers-simple" className="hover:underline p-4">
          Stream Numbers Simple
        </Link>
        <Link href="/stream-numbers-jh" className="hover:underline p-4">
          Stream Numbers JH
        </Link>
      </div>
      <Component {...pageProps} />
    </>
  );
}
